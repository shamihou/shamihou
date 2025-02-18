document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的path
    const urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('path');

    if (!path) {
        document.getElementById('content').innerHTML = '<h1>未找到指定的内容</h1>';
        return;
    }

    // 获取当前语言
    const currentLang = localStorage.getItem('language') || 'zh';

    // 构建Markdown文件路径
    const mdPath = `/content/${currentLang}/${path}`;

    // 从path中提取文件名作为标题（去除.md后缀）
    const title = path.split('/').pop().replace('.md', '');

    // 加载并渲染Markdown文件
    fetch(mdPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('文件不存在');
            }
            // 获取最后修改时间
            const lastModified = response.headers.get('last-modified');
            return Promise.all([response.text(), lastModified]);
        })
        .then(([markdown, lastModified]) => {
            // 使用marked渲染Markdown内容
            const htmlContent = marked.parse(markdown);
            
            // 格式化日期
            const date = new Date(lastModified);
            const formattedDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // 添加标题和日期到内容顶部
            const contentWithHeader = `
                <h1>${title}</h1>
                <div class="post-date">${formattedDate}</div>
                ${htmlContent}
            `;
            
            document.getElementById('content').innerHTML = contentWithHeader;
            document.title = title + ' - 我的网站';
        })
        .catch(error => {
            console.error('加载Markdown文件失败:', error);
            document.getElementById('content').innerHTML = `
                <h1>内容加载失败</h1>
                <p>抱歉，无法加载请求的内容。请确保文件路径正确。</p>
            `;
        });
});