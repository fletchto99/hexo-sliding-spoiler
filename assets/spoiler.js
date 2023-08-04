(function (document) {
    [].forEach.call(document.getElementsByClassName('sspoiler'), function(panel) {
        panel.getElementsByClassName('sspoiler-title')[0].onclick = function() {
            panel.classList.toggle("collapsed");
            panel.classList.toggle("expanded");
        }
    });
})(document);