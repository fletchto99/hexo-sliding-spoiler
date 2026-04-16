document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.getElementsByClassName('spoiler'), function(panel) {
        panel.getElementsByClassName('spoiler-title')[0].onclick = function() {
            panel.classList.toggle("collapsed");
            panel.classList.toggle("expanded");
        }
    });
});