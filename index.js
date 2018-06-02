const fs = require('hexo-fs');
const path = require('path');

hexo.extend.tag.register('spoiler', function(args,content){
    var arg_string = args.join(' ');
    return `<div class='spoiler collapsed'>${arg_string && `<div class='spoiler-title'>${arg_string}</div>`}<div class='spoiler-content'>${hexo.render.renderSync({
        text: content,
        engine: "markdown"
    })}</div></div></div>`}, {ends: true});

hexo.extend.generator.register('spoiler_asset', () => [
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
    var link_css = "<link rel=\"stylesheet\" href=\"/css/spoiler.css\" type=\"text/css\">";
    var link_js = "<script src=\"/js/spoiler.js\" type=\"text/javascript\" async></script>";
    data.content += link_css + link_js;
    return data;
});
