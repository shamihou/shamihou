// 语言切换功能
const languageToggle = document.getElementById('language-toggle');

// 从localStorage获取保存的语言设置
const savedLanguage = localStorage.getItem('language') || 'zh';
document.documentElement.lang = savedLanguage;

// 语言文本映射
const translations = {
    zh: {
        home: '首页',
        blog: '博客',
        about: '关于',
        latestPosts: '最新文章',
        readMore: '阅读更多',
        darkMode: '深色模式',
        language: '语言'
    },
    en: {
        home: 'Home',
        blog: 'Blog',
        about: 'About',
        latestPosts: 'Latest Posts',
        readMore: 'Read More',
        darkMode: 'Dark Mode',
        language: 'Language'
    }
};

// 更新页面文本
function updatePageText() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[savedLanguage][key]) {
            element.textContent = translations[savedLanguage][key];
        }
    });
}

// 初始化语言切换按钮状态
if (languageToggle) {
    languageToggle.checked = savedLanguage === 'en';
    
    // 监听语言切换事件
    languageToggle.addEventListener('change', () => {
        const newLanguage = languageToggle.checked ? 'en' : 'zh';
        document.documentElement.lang = newLanguage;
        localStorage.setItem('language', newLanguage);
        updatePageText();
    });
}

// 初始化页面文本
document.addEventListener('DOMContentLoaded', updatePageText);