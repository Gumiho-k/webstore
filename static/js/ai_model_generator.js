document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadForm = document.getElementById('upload-form');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('sketch-upload');
    const uploadBtn = document.getElementById('upload-btn');
    const processContainer = document.querySelector('.process-container');
    const resultContainer = document.querySelector('.result-container');
    const progressBar = document.getElementById('total-progress');
    const processMessage = document.getElementById('process-message');
    const originalSketchImg = document.getElementById('original-sketch');
    const processedImageImg = document.getElementById('processed-image');
    const modelViewer = document.getElementById('model-viewer');
    
    // Process steps
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    // Order form elements
    const modelSizeSelect = document.getElementById('model-size');
    const modelQuantityInput = document.getElementById('model-quantity');
    const unitPriceDisplay = document.getElementById('unit-price');
    const quantityDisplay = document.getElementById('quantity-display');
    const totalPriceDisplay = document.getElementById('total-price');
    
    // Variables
    let selectedFile = null;
    let uploadedImageUrl = null;
    
    // Price mapping
    const prices = {
        'small': 150,
        'medium': 250,
        'large': 350
    };
    
    // File upload handling
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];
            
            // Validate file
            if (validateFile(selectedFile)) {
                // Show file name in upload area
                const fileName = selectedFile.name;
                uploadArea.innerHTML = `
                    <img src="${URL.createObjectURL(selectedFile)}" alt="預覽" style="max-height: 200px; margin-bottom: 1rem;">
                    <p>${fileName}</p>
                    <p class="file-info">點擊更換檔案</p>
                `;
                
                // Enable upload button
                uploadBtn.disabled = false;
            } else {
                resetUpload();
                alert('請上傳有效的圖片檔案 (JPG, PNG, GIF)，大小不超過 5MB。');
            }
        }
    });
    
    // Drag and drop handling
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('dragover');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            selectedFile = files[0];
            
            // Validate file
            if (validateFile(selectedFile)) {
                // Show file name in upload area
                const fileName = selectedFile.name;
                uploadArea.innerHTML = `
                    <img src="${URL.createObjectURL(selectedFile)}" alt="預覽" style="max-height: 200px; margin-bottom: 1rem;">
                    <p>${fileName}</p>
                    <p class="file-info">點擊更換檔案</p>
                `;
                
                // Enable upload button
                uploadBtn.disabled = false;
            } else {
                resetUpload();
                alert('請上傳有效的圖片檔案 (JPG, PNG, GIF)，大小不超過 5MB。');
            }
        }
    }
    
    // Form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedFile) {
            // Hide upload form and show process container
            uploadForm.style.display = 'none';
            processContainer.style.display = 'block';
            
            // Save the uploaded image URL for later use
            uploadedImageUrl = URL.createObjectURL(selectedFile);
            
            // Start processing
            simulateProcessing();
        }
    });
    
    // Simulate the AI processing
    function simulateProcessing() {
        // Step 1: Upload
        updateStep(step1, 'active', '處理中...');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            
            if (progress === 20) {
                // Step 1 completed
                updateStep(step1, 'completed', '完成');
                updateStep(step2, 'active', '處理中...');
                processMessage.textContent = 'AI 正在處理您的線稿...';
            } else if (progress === 60) {
                // Step 2 completed
                updateStep(step2, 'completed', '完成');
                updateStep(step3, 'active', '處理中...');
                processMessage.textContent = '正在生成 3D 模型...';
            } else if (progress === 100) {
                // All steps completed
                clearInterval(interval);
                updateStep(step3, 'completed', '完成');
                processMessage.textContent = '處理完成！';
                
                // Show results after a short delay
                setTimeout(showResults, 1000);
            }
        }, 50);
    }
    
    // Update step status
    function updateStep(stepElement, status, message) {
        // Remove existing status classes
        stepElement.classList.remove('active', 'completed');
        
        // Add new status class
        stepElement.classList.add(status);
        
        // Update status message
        stepElement.querySelector('.step-status').textContent = message;
    }
    
    // Show processing results
    function showResults() {
        // Hide process container
        processContainer.style.display = 'none';
        
        // Show result container
        resultContainer.style.display = 'block';
        
        // Set original sketch image
        originalSketchImg.src = uploadedImageUrl;
        
        // For demo purposes, we'll use a placeholder for the processed image
        // In a real implementation, this would come from the AI service
        processedImageImg.src = '/static/images/ai_generated.png';
        
        // Initialize 3D model viewer (placeholder)
        initModelViewer();
        
        // Initialize order form
        initOrderForm();
    }
    
    // Initialize 3D model viewer (placeholder)
    function initModelViewer() {
        // In a real implementation, this would use a 3D viewer library like Three.js
        // For now, we'll just show a placeholder message
        modelViewer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #f5f5f5; border-radius: 4px;">
                <p>3D 模型預覽 (示範用)</p>
            </div>
        `;
        
        // Add event listeners for model controls
        document.getElementById('rotate-left').addEventListener('click', function() {
            alert('旋轉模型 (示範功能)');
        });
        
        document.getElementById('rotate-right').addEventListener('click', function() {
            alert('旋轉模型 (示範功能)');
        });
        
        document.getElementById('zoom-in').addEventListener('click', function() {
            alert('放大模型 (示範功能)');
        });
        
        document.getElementById('zoom-out').addEventListener('click', function() {
            alert('縮小模型 (示範功能)');
        });
    }
    
    // Initialize order form
    function initOrderForm() {
        // Update price when size changes
        modelSizeSelect.addEventListener('change', updatePrice);
        
        // Update price when quantity changes
        modelQuantityInput.addEventListener('change', updatePrice);
        modelQuantityInput.addEventListener('input', updatePrice);
        
        // Initial price update
        updatePrice();
        
        // Handle order form submission
        document.getElementById('order-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const size = modelSizeSelect.value;
            const material = document.getElementById('model-material').value;
            const color = document.querySelector('input[name="color"]:checked').value;
            const quantity = modelQuantityInput.value;
            
            // Show confirmation
            alert(`訂單已提交！\n\n尺寸: ${size}\n材質: ${material}\n顏色: ${color}\n數量: ${quantity}\n總價: MOP ${calculateTotal()}`);
        });
    }
    
    // Update price display
    function updatePrice() {
        const size = modelSizeSelect.value;
        const quantity = parseInt(modelQuantityInput.value) || 1;
        
        // Update unit price
        const unitPrice = prices[size];
        unitPriceDisplay.textContent = `MOP ${unitPrice}`;
        
        // Update quantity
        quantityDisplay.textContent = quantity;
        
        // Update total price
        totalPriceDisplay.textContent = `MOP ${calculateTotal()}`;
    }
    
    // Calculate total price
    function calculateTotal() {
        const size = modelSizeSelect.value;
        const quantity = parseInt(modelQuantityInput.value) || 1;
        return prices[size] * quantity;
    }
    
    // Validate uploaded file
    function validateFile(file) {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return false;
        }
        
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return false;
        }
        
        return true;
    }
    
    // Reset upload area
    function resetUpload() {
        uploadArea.innerHTML = `
            <img src="/static/images/upload-icon.png" alt="上傳" id="upload-icon">
            <p>點擊或拖放您的線稿圖片</p>
            <p class="file-info">支持 JPG, PNG, GIF 格式，最大 5MB</p>
        `;
        
        fileInput.value = '';
        selectedFile = null;
        uploadBtn.disabled = true;
    }
});
