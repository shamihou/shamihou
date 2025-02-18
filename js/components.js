// 组件加载功能

// 加载页面头部
async function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    try {
        const response = await fetch('/templates/header.html');
        const html = await response.text();
        headerContainer.innerHTML = html;

        // 初始化主题和语言切换按钮
        const themeToggle = document.getElementById('theme-toggle');
        const languageToggle = document.getElementById('language-toggle');
        
        // 设置导航链接的active状态
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error('加载页面头部失败:', error);
    }
}

// 加载页面底部
async function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    try {
        const response = await fetch('/templates/footer.html');
        const html = await response.text();
        footerContainer.innerHTML = html;
    } catch (error) {
        console.error('加载页面底部失败:', error);
    }
}

// 页面加载完成后初始化组件
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});