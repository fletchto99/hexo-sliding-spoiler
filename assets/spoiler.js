document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.getElementsByClassName('spoiler'), function(panel) {
        var content = panel.getElementsByClassName('spoiler-content')[0];
        panel.getElementsByClassName('spoiler-title')[0].onclick = function() {
            if (panel.classList.contains('collapsed')) {
                panel.classList.replace('collapsed', 'expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                panel.classList.replace('expanded', 'collapsed');
                content.style.maxHeight = '0';
            }
        }
    });
});