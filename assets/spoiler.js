(function (document) {
    var panels = document.getElementsByClassName('spoiler');
    [].forEach.call(panels, function(panel) {
        panel.getElementsByClassName('title')[0].onclick = function() {
            panel.classList.toggle("collapsed");
            panel.classList.toggle("expanded");
        }
    });

})(document);