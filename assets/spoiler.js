document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sliding-spoiler').forEach((panel) => {
        const content = panel.querySelector('.sliding-spoiler-content');
        panel.querySelector('.sliding-spoiler-title').addEventListener('click', () => {
            if (panel.classList.contains('collapsed')) {
                panel.classList.replace('collapsed', 'expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                panel.classList.replace('expanded', 'collapsed');
                content.style.maxHeight = '0';
            }
        });
    });
});