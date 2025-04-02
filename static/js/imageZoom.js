document.addEventListener('DOMContentLoaded', function() {
    // 創建模態框
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img class="modal-content">
    `;
    document.body.appendChild(modal);

    // 獲取所有產品圖片
    const productImages = document.querySelectorAll('.product-card img, .main-image img');
    const modalImg = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.close-modal');

    // 為每個產品圖片添加點擊事件
    productImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
        });
    });

    // 關閉模態框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 點擊模態框外部關閉
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});