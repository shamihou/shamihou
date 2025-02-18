// 主题切换功能
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 从localStorage获取保存的主题设置
const savedTheme = localStorage.getItem('theme') || 'light';
body.className = `${savedTheme}-theme`;

// 初始化主题切换按钮状态
if (themeToggle) {
    themeToggle.checked = savedTheme === 'dark';
    
    // 监听主题切换事件
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);
    });
}

// 监听系统主题变化
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
systemThemeQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        body.className = `${newTheme}-theme`;
        if (themeToggle) {
            themeToggle.checked = e.matches;
        }
    }
});