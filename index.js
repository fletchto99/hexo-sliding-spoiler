const fs = require('fs');
const path = require('path');

const spoilerTag = (args, content) =>
`<div class='sliding-spoiler collapsed'>
    <div class='sliding-spoiler-title'>
        ${args.join(" ")}
    </div>
    <div class='sliding-spoiler-content'>
        ${
            hexo.render.renderSync({
                text: content,
                engine: "markdown"
            }) || "No content to show"
        }
    </div>
</div>`;

const tagOptions = { ends: true };

hexo.extend.tag.register('sliding_spoiler', spoilerTag, tagOptions);

hexo.extend.generator.register('spoiler_asset', () => [
    {
        path: 'css/spoiler.css',
        data: () => fs.createReadStream(path.resolve(__dirname, 'assets', 'spoiler.css'))
    },
    {
        path: 'js/spoiler.js',
        data: () => fs.createReadStream(path.resolve(__dirname, 'assets', 'spoiler.js'))
    }
]);

// Inject CSS into <head> and JS before </body> on any page containing a spoiler.
// This replaces the previous after_post_render approach which only added assets to
// data.content — that failed on index/archive pages where themes render excerpts
// instead of the full post content.
hexo.extend.filter.register('after_render:html', (str) => {
    if (!str.includes('class=\'sliding-spoiler') && !str.includes('class="sliding-spoiler')) {
        return str;
    }

    const root = hexo.config.root || '/';
    const link_css = `<link rel="stylesheet" href="${root}css/spoiler.css" type="text/css">`;
    const link_js = `<script src="${root}js/spoiler.js" type="text/javascript"></script>`;

    str = str.replace('</head>', link_css + '</head>');
    str = str.replace('</body>', link_js + '</body>');

    return str;
});
