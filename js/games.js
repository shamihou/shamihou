// 游戏页面功能

let gamesData = null;

// 从目录加载游戏数据
async function loadGamesData() {
    try {
        const response = await fetch('/content/zh/games/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mdFiles = Array.from(doc.querySelectorAll('a'))
            .filter(a => a.href.endsWith('.md'))
            .map(a => a.href.split('/').pop());

        const games = [];
        for (const mdFile of mdFiles) {
            const id = mdFile.replace('.md', '');
            const response = await fetch(`/content/zh/games/${mdFile}`);
            const content = await response.text();
            const title = content.split('\n')[0].replace('#', '').trim();
            const description = content.split('\n').slice(1).find(line => line.trim() !== '') || '';
            const date = new Date((await fetch(`/content/zh/games/${mdFile}`)).headers.get('last-modified'));
            
            // 提取预览图链接
            const previewMatch = content.match(/!\[.*?\]\((.*?)\)/);
            const previewImage = previewMatch ? previewMatch[1] : '/images/default-game-cover.jpg';
            
            games.push({
                id,
                title,
                description: description.replace(/^[#\s-]*/, ''),
                date: date.toISOString().split('T')[0],
                previewImage
            });
        }

        gamesData = {
            games: games.sort((a, b) => b.date.localeCompare(a.date))
        };
        return gamesData;
    } catch (error) {
        console.error('加载游戏数据失败:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // 获取游戏列表容器
    const gamesGrid = document.querySelector('.games-grid');
    
    // 添加加载状态
    gamesGrid.innerHTML = '<div class="loading">加载中...</div>';

    try {
        // 加载游戏数据
        await loadGamesData();

        if (!gamesData) {
            throw new Error('无法加载游戏数据');
        }

        // 清除加载状态
        gamesGrid.innerHTML = '';

        // 一次性创建所有游戏卡片
        const gamesHTML = gamesData.games.map(game => `
            <div class="game-card">
                <img src="${game.previewImage}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <div class="game-meta">
                    <span class="game-date">${game.date}</span>
                </div>
                <a href="/pages/pages.html?path=games/${game.id}.md" class="read-more" data-i18n="readMore">了解更多</a>
            </div>
        `).join('');

        gamesGrid.innerHTML = gamesHTML;

        // 更新多语言文本
        if (typeof updatePageText === 'function') {
            updatePageText();
        }
    } catch (error) {
        console.error('加载游戏列表失败:', error);
        gamesGrid.innerHTML = `
            <div class="error-message">
                <h2>加载失败</h2>
                <p>抱歉，无法加载游戏列表。请稍后再试。</p>
            </div>
        `;
    }
});