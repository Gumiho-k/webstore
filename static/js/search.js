document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search-trigger');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    // 檢查元素是否存在
    if (!searchIcon || !searchForm || !searchInput) {
        console.error('搜索元素未找到');
        return;
    }


    // 創建搜索建議容器
    const searchResults = document.createElement('div');
    searchResults.className = 'search-suggestions';
    searchForm.appendChild(searchResults);

    let debounceTimer;
    let isSearchVisible = false;

    // 點擊搜索圖標時顯示/隱藏搜索欄
    searchIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isSearchVisible && searchInput.value.trim()) {
            // 如果搜索欄可見且有輸入內容，則提交搜索
            searchForm.submit();
        } else {
            // 否則切換搜索欄的顯示狀態
            toggleSearch();
        }
    });

    // 滑鼠移到搜索圖標上時顯示搜索欄
    searchIcon.addEventListener('mouseenter', function() {
        showSearch();
    });

    // 顯示搜索欄函數
    function showSearch() {
        if (!isSearchVisible) {
            searchForm.classList.add('search-form-visible');
            isSearchVisible = true;
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        }
    }

    // 隱藏搜索欄函數
    function hideSearch() {
        if (isSearchVisible) {
            searchForm.classList.remove('search-form-visible');
            isSearchVisible = false;
            searchResults.style.display = 'none';
        }
    }

    // 切換搜索欄顯示/隱藏
    function toggleSearch() {
        if (isSearchVisible) {
            hideSearch();
        } else {
            showSearch();
        }
    }

    // 監聽輸入事件
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        const query = this.value.trim();
        
        debounceTimer = setTimeout(() => {
            if (query.length >= 1) {
                fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('搜索請求失敗');
                        }
                        return response.json();
                    })
                    .then(data => {
                        searchResults.innerHTML = '';
                        if (data.length > 0) {
                            data.slice(0, 5).forEach(product => {
                                const div = document.createElement('div');
                                div.className = 'suggestion-item';
                                div.innerHTML = `
                                    <img src="/static/images/${product.image}" alt="${product.name}">
                                    <div>
                                        <h4>${product.name}</h4>
                                        <p>MOP ${product.price}</p>
                                    </div>
                                `;
                                div.addEventListener('click', () => {
                                    window.location.href = `/product/${product.id}`;
                                });
                                searchResults.appendChild(div);
                            });
                            searchResults.style.display = 'block';
                        } else {
                            searchResults.style.display = 'none';
                        }
                    })
                    .catch(error => {
                        console.error('搜索錯誤:', error);
                    });
            } else {
                searchResults.style.display = 'none';
            }
        }, 300);
    });

    // 點擊其他地方時隱藏搜索欄和搜索建議
    document.addEventListener('click', function(e) {
        if (!searchIcon.contains(e.target) && 
            !searchForm.contains(e.target)) {
            hideSearch();
        }
    });

    // 防止表單提交時的頁面刷新
    searchForm.addEventListener('submit', function(e) {
        const query = searchInput.value.trim();
        if (!query) {
            e.preventDefault();
        }
    });

    // 防止搜索表單點擊事件冒泡
    searchForm.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 按下 Enter 鍵時提交搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            e.preventDefault();
            searchForm.submit();
        }
    });
});