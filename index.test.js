const fs = require('fs');
const path = require('path');

// Build a minimal mock of the Hexo object that index.js expects at load time.
function createMockHexo(configOverrides = {}) {
    return {
        config: { root: '/', ...configOverrides },
        render: {
            renderSync: jest.fn(({ text }) => `<p>${text}</p>\n`),
        },
        extend: {
            tag: { register: jest.fn() },
            generator: { register: jest.fn() },
            filter: { register: jest.fn() },
        },
    };
}

// Load index.js with the given mock hexo on the global scope.
function loadPlugin(hexoMock) {
    // index.js reads the free variable `hexo`, so we put it on global scope.
    global.hexo = hexoMock;

    // Use Jest's module reset so the file re-executes each time.
    jest.resetModules();
    require('./index');
}

// Helpers to extract registered extensions from mock.calls
function getTagFn(mock, name) {
    const call = mock.extend.tag.register.mock.calls.find((c) => c[0] === name);
    return call ? call[1] : undefined;
}

function getTagOpts(mock, name) {
    const call = mock.extend.tag.register.mock.calls.find((c) => c[0] === name);
    return call ? call[2] : undefined;
}

function getGeneratorFn(mock, name) {
    const call = mock.extend.generator.register.mock.calls.find((c) => c[0] === name);
    return call ? call[1] : undefined;
}

function getFilterFn(mock, name) {
    const call = mock.extend.filter.register.mock.calls.find((c) => c[0] === name);
    return call ? call[1] : undefined;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('hexo-sliding-spoiler', () => {
    let hexo;

    beforeEach(() => {
        hexo = createMockHexo();
        loadPlugin(hexo);
    });

    afterEach(() => {
        delete global.hexo;
    });

    // ---- Registration ---------------------------------------------------

    describe('registration', () => {
        test('registers the sliding_spoiler tag', () => {
            expect(hexo.extend.tag.register).toHaveBeenCalledWith(
                'sliding_spoiler',
                expect.any(Function),
                { ends: true },
            );
        });

        test('registers the spoiler_asset generator', () => {
            expect(hexo.extend.generator.register).toHaveBeenCalledWith(
                'spoiler_asset',
                expect.any(Function),
            );
        });

        test('registers the after_render:html filter', () => {
            expect(hexo.extend.filter.register).toHaveBeenCalledWith(
                'after_render:html',
                expect.any(Function),
            );
        });
    });

    // ---- Tag function ---------------------------------------------------

    describe('spoilerTag', () => {
        let spoilerTag;

        beforeEach(() => {
            spoilerTag = getTagFn(hexo, 'sliding_spoiler');
        });

        test('wraps content in the expected divs', () => {
            const html = spoilerTag(['My', 'Title'], 'some **bold** text');
            expect(html).toContain("class='sliding-spoiler collapsed'");
            expect(html).toContain("class='sliding-spoiler-title'");
            expect(html).toContain("class='sliding-spoiler-content'");
        });

        test('joins args as the title', () => {
            const html = spoilerTag(['Several', 'Words', 'Here'], 'body');
            expect(html).toContain('Several Words Here');
        });

        test('single-word title renders correctly', () => {
            const html = spoilerTag(['Hint'], 'body');
            expect(html).toContain('Hint');
        });

        test('renders content through hexo.render.renderSync', () => {
            spoilerTag(['T'], 'markdown content');
            expect(hexo.render.renderSync).toHaveBeenCalledWith({
                text: 'markdown content',
                engine: 'markdown',
            });
        });

        test('rendered content appears inside spoiler-content div', () => {
            hexo.render.renderSync.mockReturnValue('<strong>rendered</strong>');
            const html = spoilerTag(['T'], 'ignored');
            expect(html).toContain('<strong>rendered</strong>');
        });

        test('falls back to "No content to show" when render returns falsy', () => {
            hexo.render.renderSync.mockReturnValue('');
            const html = spoilerTag(['T'], '');
            expect(html).toContain('No content to show');
        });

        test('tag is registered with ends: true', () => {
            expect(getTagOpts(hexo, 'sliding_spoiler')).toEqual({ ends: true });
        });
    });

    // ---- Generator ------------------------------------------------------

    describe('spoiler_asset generator', () => {
        let assets;

        beforeEach(() => {
            const generatorFn = getGeneratorFn(hexo, 'spoiler_asset');
            assets = generatorFn();
        });

        test('returns two asset entries', () => {
            expect(assets).toHaveLength(2);
        });

        test('first asset is the CSS file', () => {
            expect(assets[0].path).toBe('css/sliding-spoiler.css');
        });

        test('second asset is the JS file', () => {
            expect(assets[1].path).toBe('js/sliding-spoiler.js');
        });

        test('CSS data() returns a readable stream for the correct file', () => {
            const stream = assets[0].data();
            expect(stream).toBeDefined();
            expect(stream.path).toBe(
                path.resolve(__dirname, 'assets', 'sliding-spoiler.css'),
            );
            stream.destroy();
        });

        test('JS data() returns a readable stream for the correct file', () => {
            const stream = assets[1].data();
            expect(stream).toBeDefined();
            expect(stream.path).toBe(
                path.resolve(__dirname, 'assets', 'sliding-spoiler.js'),
            );
            stream.destroy();
        });
    });

    // ---- Filter ---------------------------------------------------------

    describe('after_render:html filter', () => {
        let filter;

        beforeEach(() => {
            filter = getFilterFn(hexo, 'after_render:html');
        });

        test('returns string unchanged when no spoiler is present', () => {
            const input = '<html><head></head><body><p>Hello</p></body></html>';
            expect(filter(input)).toBe(input);
        });

        test('injects CSS link before </head> when spoiler is present', () => {
            const input =
                '<html><head></head><body><div class="sliding-spoiler"></div></body></html>';
            const result = filter(input);
            expect(result).toContain(
                '<link rel="stylesheet" href="/css/sliding-spoiler.css" type="text/css"></head>',
            );
        });

        test('injects JS script before </body> when spoiler is present', () => {
            const input =
                '<html><head></head><body><div class="sliding-spoiler"></div></body></html>';
            const result = filter(input);
            expect(result).toContain(
                '<script src="/js/sliding-spoiler.js" type="text/javascript"></script></body>',
            );
        });

        test('uses hexo.config.root for asset paths', () => {
            const customHexo = createMockHexo({ root: '/blog/' });
            loadPlugin(customHexo);
            const customFilter = getFilterFn(customHexo, 'after_render:html');

            const input =
                '<html><head></head><body><div class="sliding-spoiler"></div></body></html>';
            const result = customFilter(input);
            expect(result).toContain('href="/blog/css/sliding-spoiler.css"');
            expect(result).toContain('src="/blog/js/sliding-spoiler.js"');
        });

        test('defaults root to "/" when hexo.config.root is falsy', () => {
            const customHexo = createMockHexo({ root: '' });
            loadPlugin(customHexo);
            const customFilter = getFilterFn(customHexo, 'after_render:html');

            const input =
                '<html><head></head><body><div class="sliding-spoiler"></div></body></html>';
            const result = customFilter(input);
            expect(result).toContain('href="/css/sliding-spoiler.css"');
            expect(result).toContain('src="/js/sliding-spoiler.js"');
        });
    });
});
