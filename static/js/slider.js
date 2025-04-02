document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    function showSlide(n) {
        slides.forEach(slide => slide.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function previousSlide() {
        showSlide(currentSlide - 1);
    }
    
    // 自動輪播
    setInterval(nextSlide, 5000);
    
    // 點擊導航點切換輪播
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // 顯示第一張圖片
    showSlide(0);
});