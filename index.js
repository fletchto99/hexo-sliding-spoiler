const fs = require('hexo-fs');
const path = require('path');

hexo.extend.tag.register('sspoiler', (args, content) =>
`<div class='sspoiler collapsed'>
    <div class='sspoiler-title'>
        ${args.join(" ")}
    </div>
    <div class='sspoiler-content'>
        ${
            hexo.render.renderSync({
                text: content,
                engine: "markdown"
            }) || "No content to show"
        }
    </div>
</div>`, {
    ends: true
});

hexo.extend.generator.register('sspoiler_asset', () => [
    {
        path: 'css/spoiler.css',
        data: function () {
            return fs.createReadStream(path.resolve(path.resolve(__dirname, "./assets"), 'spoiler.css'));
        }
    },
    {
        path: 'js/spoiler.js',
        data: function () {
            return fs.createReadStream(path.resolve(path.resolve(__dirname, "./assets"), 'spoiler.js'));
        }
    }
]);

hexo.extend.filter.register('after_post_render', (data) => {
    let link_css = `<link rel="stylesheet" href="${hexo.config.root}css/spoiler.css" type="text/css">`;
    let link_js = `<script src="${hexo.config.root}js/spoiler.js" type="text/javascript" async></script>`;
    data.content += link_css + link_js;
    return data;
});
