// 关于页面功能

// 加载关于页面内容
async function loadAboutContent() {
    const aboutContainer = document.querySelector('.about-content');
    try {
        // 这里应该从后端API获取数据，现在先用静态内容
        const aboutContent = `
            <section class="about-section">
                <h1>关于我们</h1>
                <p>欢迎来到我们的网站！我们是一群热爱桌游和技术的爱好者，致力于为大家带来优质的桌游资讯和技术分享。</p>
                
                <h2>我们的使命</h2>
                <p>通过分享桌游攻略、技术文章和行业动态，帮助更多人了解和热爱桌游文化，同时提供高质量的技术内容。</p>
                
                <h2>我们的团队</h2>
                <div class="team-members">
                    <div class="team-member">
                        <h3>桌游编辑</h3>
                        <p>专注于桌游评测、规则解析和策略分析，为玩家提供专业的游戏建议。</p>
                    </div>
                    <div class="team-member">
                        <h3>技术专家</h3>
                        <p>负责网站开发和维护，确保为用户提供流畅的浏览体验。</p>
                    </div>
                    <div class="team-member">
                        <h3>内容创作者</h3>
                        <p>创作有趣且实用的文章，让更多人了解桌游的魅力。</p>
                    </div>
                </div>
                
                <h2>联系我们</h2>
                <div class="contact-info">
                    <p>邮箱：contact@example.com</p>
                    <p>微信：boardgame_news</p>
                    <p>地址：北京市朝阳区xxx街xxx号</p>
                </div>
            </section>
        `;

        aboutContainer.innerHTML = aboutContent;
        
        // 更新多语言文本
        updatePageText();
    } catch (error) {
        console.error('加载关于页面内容失败:', error);
    }
}

// 页面加载完成后初始化内容
document.addEventListener('DOMContentLoaded', () => {
    loadAboutContent();
});