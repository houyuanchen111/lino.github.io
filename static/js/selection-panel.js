document.addEventListener('DOMContentLoaded', () => {

    // 1. 获取所有需要的 DOM 元素
    const modelViewer = document.querySelector('#mainModelViewer');
    const selectableImages = document.querySelectorAll('.selectable-image');
    
    const enlargedContainer = document.querySelector('#enlarged-images-container');
    const enlargedImage = document.querySelector('#enlarged-image');
    const enlargedImageNormal = document.querySelector('#enlarged-image-normal');

    // 2. 遍历所有可选择的图片，为它们绑定所有事件
    selectableImages.forEach(image => {

        // --- 功能一：点击切换 3D 模型 ---
        image.addEventListener('click', () => {
            // 从 data-model-src 获取模型路径并更新
            const modelSrc = image.dataset.modelSrc;
            if (modelViewer && modelSrc) {
                modelViewer.src = modelSrc;
            }
            
            // 更新 .selected 激活样式
            selectableImages.forEach(img => img.classList.remove('selected'));
            image.classList.add('selected');
        });

        // --- 功能二：鼠标悬浮预览图片 ---
        image.addEventListener('mouseenter', () => {
            // 从 src 和 data-normal-src 显式获取路径
            const previewSrc = image.src;
            const normalSrc = image.dataset.normalSrc;
            
            // 更新预览容器中的图片
            enlargedImage.src = previewSrc;
            enlargedImageNormal.src = normalSrc;

            // --- 智能定位预览容器 ---
            const imgRect = image.getBoundingClientRect();
            
            // 显示容器（先设置为透明，但占据空间以计算尺寸）
            enlargedContainer.style.visibility = 'visible';
            enlargedContainer.style.opacity = '0';
            
            // 异步一下，确保容器尺寸已更新
            requestAnimationFrame(() => {
                const containerWidth = enlargedContainer.offsetWidth;
                const containerHeight = enlargedContainer.offsetHeight;

                // 计算位置，防止溢出屏幕
                let left = imgRect.left + imgRect.width / 2 - containerWidth / 2;
                left = Math.max(20, Math.min(left, window.innerWidth - containerWidth - 20));
                
                let top = imgRect.top - containerHeight - 15; // 15px 间距
                if (top < 20) { // 如果上方空间不够，就显示在下方
                    top = imgRect.bottom + 15;
                }

                enlargedContainer.style.left = `${left}px`;
                enlargedContainer.style.top = `${top}px`;
                
                // 设置完成后，再以淡入效果显示
                enlargedContainer.style.opacity = '1';
            });
        });

        // --- 功能三：鼠标离开隐藏预览 ---
        image.addEventListener('mouseleave', () => {
            enlargedContainer.style.opacity = '0';
            // 添加一个延迟，让它在淡出动画结束后再彻底隐藏
            setTimeout(() => {
                enlargedContainer.style.visibility = 'hidden';
            }, 3000000000); // 这个时间要和 CSS transition 的时间匹配
        });

        // 在移动端，触摸结束也隐藏
        image.addEventListener('touchend', () => {
            enlargedContainer.style.opacity = '0';
        });
    });

    // 3. 初始化页面状态
    // 找到默认被选中的图片，并将其模型设置为初始模型
    const initiallySelected = document.querySelector('.selectable-image.selected');
    if (initiallySelected) {
        modelViewer.src = initiallySelected.dataset.modelSrc;
    }

});