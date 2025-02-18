// 从GitHub API加载游戏预览图和博客文章

// GitHub API配置
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'shamihou';  // 需要替换为实际的GitHub用户名
const REPO_NAME = 'shamihou';      // 需要替换为实际的仓库名

// 从GitHub API获取文件内容
async function getFileContent(path) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`);
        const data = await response.json();
        if (data.type === 'file') {
            // GitHub API返回的内容是Base64编码的
            return atob(data.content);
        }
        throw new Error('Not a file');
    } catch (error) {
        console.error(`获取文件内容失败: ${path}`, error);
        return null;
    }
}

// 从GitHub API获取目录内容
async function getDirectoryContents(path) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`);
        const data = await response.json();
        return data.filter(item => item.type === 'file' && item.name.endsWith('.md'));
    } catch (error) {
        console.error(`获取目录内容失败: ${path}`, error);
        return [];
    }
}

// 游戏预览图数据加载
async function loadGamePreviews() {
    try {
        const files = await getDirectoryContents('content/zh/games');
        const sliderData = [];

        for (const file of files) {
            const content = await getFileContent(file.path);
            if (content) {
                // 提取标题（第一个#后的内容）
                const titleMatch = content.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : '';

                // 提取第一段描述
                const descMatch = content.match(/\n\n([^#\n].+)\n/);
                const description = descMatch ? descMatch[1] : '';

                // 提取图片URL
                const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
                if (imageMatch && imageMatch[1]) {
                    sliderData.push({
                        image: imageMatch[1],
                        title: title,
                        description: description,
                        url: `/pages/pages.html?path=${file.path.replace('content/zh/', '')}`
                    });
                }
            }
        }

        return sliderData;
    } catch (error) {
        console.error('加载游戏列表失败', error);
        return [];
    }
}

// 加载最新博客文章
async function loadLatestBlogPosts() {
    try {
        const files = await getDirectoryContents('content/zh/blog');
        const posts = [];

        for (const file of files) {
            const content = await getFileContent(file.path);
            if (content) {
                // 提取标题
                const titleMatch = content.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : '';

                // 提取第一段作为摘要
                const summaryMatch = content.match(/\n\n([^#\n].+)\n/);
                const summary = summaryMatch ? summaryMatch[1] : '';

                // 使用GitHub API返回的最后更新时间
                const date = new Date(file.last_modified || file.updated_at || new Date()).toISOString().split('T')[0];

                posts.push({
                    title: title,
                    summary: summary,
                    date: date,
                    url: `/pages/pages.html?path=${file.path.replace('content/zh/', '')}`
                });
            }
        }

        // 按日期排序，最新的在前
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('加载博客列表失败', error);
        return [];
    }
}

// 导出函数供其他模块使用
export { loadGamePreviews, loadLatestBlogPosts };