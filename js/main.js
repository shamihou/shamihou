// 主页功能
import { loadGamePreviews, loadLatestBlogPosts } from './content-loader.js';

// 初始化轮播图
async function initSlider() {
    const sliderContainer = document.querySelector('.hero-slider');
    const sliderData = await loadGamePreviews();
    let sliderHtml = '';

    sliderData.forEach((slide, index) => {
        sliderHtml += `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <img src="${slide.image}" alt="${slide.title}">
                <div class="slide-content">
                    <h2>${slide.title}</h2>
                    <p>${slide.description}</p>
                    <a href="${slide.url}" class="slide-link">了解更多</a>
                </div>
            </div>
        `;
    });

    sliderContainer.innerHTML = sliderHtml;

    // 自动轮播（从左向右）
    let currentSlide = sliderData.length - 1;
    setInterval(() => {
        const slides = document.querySelectorAll('.slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// 加载最新文章
async function loadLatestPosts() {
    const postsContainer = document.querySelector('.posts-container');
    try {
        const posts = await loadLatestBlogPosts();
        // 只显示最新的3篇文章
        const latestPosts = posts.slice(0, 3);

        let postsHtml = '';
        latestPosts.forEach(post => {
            postsHtml += `
                <article class="post-card">
                    <h3>${post.title}</h3>
                    <p class="post-summary">${post.summary}</p>
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                        <a href="${post.url}" class="read-more" data-i18n="readMore">阅读更多</a>
                    </div>
                </article>
            `;
        });

        postsContainer.innerHTML = postsHtml;
        
        // 更新多语言文本
        updatePageText();
    } catch (error) {
        console.error('加载最新文章失败:', error);
    }
}

// 页面加载完成后初始化功能
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    loadLatestPosts();
});