// 博客页面功能

let blogData = null;
let POSTS_PER_PAGE = 6;

// 从目录加载博客文章数据
async function loadBlogData() {
    try {
        const response = await fetch('/content/zh/blog/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mdFiles = Array.from(doc.querySelectorAll('a'))
            .filter(a => a.href.endsWith('.md'))
            .map(a => a.href.split('/').pop());

        const blogs = [];
        for (const mdFile of mdFiles) {
            const id = mdFile.replace('.md', '');
            const response = await fetch(`/content/zh/blog/${mdFile}`);
            const content = await response.text();
            const title = content.split('\n')[0].replace('#', '').trim();
            const description = content.split('\n').slice(1).find(line => line.trim() !== '') || '';
            const date = new Date((await fetch(`/content/zh/blog/${mdFile}`)).headers.get('last-modified'));
            
            blogs.push({
                id,
                title,
                date: date.toISOString().split('T')[0],
                description: description.replace(/^[#\s-]*/, ''),
                tags: ['博客']
            });
        }

        blogData = {
            blogs: blogs.sort((a, b) => b.date.localeCompare(a.date))
        };
        return blogData;
    } catch (error) {
        console.error('加载博客数据失败:', error);
        return null;
    }
}

// 加载博客文章列表
async function loadBlogPosts(page = 1) {
    if (!blogData) {
        await loadBlogData();
    }

    if (!blogData) {
        console.error('无法加载博客数据');
        return;
    }
    const postsContainer = document.querySelector('.posts-container');
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = blogData.blogs.slice(startIndex, endIndex);

    let postsHtml = '';
    currentPosts.forEach(post => {
        postsHtml += `
            <article class="post-card">
                <h3>${post.title}</h3>
                <p class="post-meta">
                    <span class="post-date">${post.date}</span>
                </p>
                <p class="post-summary">${post.description}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="#" onclick="showBlogContent('${post.id}')" class="read-more" data-i18n="readMore">阅读更多</a>
            </article>
        `;
    });

    postsContainer.innerHTML = postsHtml;

    // 创建分页控件
    createPagination(page, Math.ceil(blogData.blogs.length / POSTS_PER_PAGE));
    
    // 更新多语言文本
    updatePageText();
}

// 显示博客内容
function showBlogContent(blogId) {
    const blog = blogData.blogs.find(b => b.id === blogId);
    if (blog) {
        window.location.href = `pages.html?path=blog/${blog.id}.md`;
    }
}

// 创建分页控件
function createPagination(currentPage, totalPages) {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    let paginationHtml = '';

    // 上一页按钮
    if (currentPage > 1) {
        paginationHtml += `<a href="#" class="page-link" data-page="${currentPage - 1}">上一页</a>`;
    }

    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
            <a href="#" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </a>
        `;
    }

    // 下一页按钮
    if (currentPage < totalPages) {
        paginationHtml += `<a href="#" class="page-link" data-page="${currentPage + 1}">下一页</a>`;
    }

    paginationContainer.innerHTML = paginationHtml;

    // 添加分页控件到文章列表后面
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.after(paginationContainer);

    // 添加分页事件监听
    paginationContainer.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('page-link')) {
            const page = parseInt(e.target.dataset.page);
            loadBlogPosts(page);
            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// 页面加载完成后初始化博客列表
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});