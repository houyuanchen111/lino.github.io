// --- 这是最终修正版的JS代码 ---
document.addEventListener('DOMContentLoaded', () => {

    const mainImage = document.getElementById('main-image');
    const normalMap1 = document.getElementById('normal-map-1');
    const normalMap2 = document.getElementById('normal-map-2');
    const selectBoxes = document.querySelectorAll('.select-box');

    function updateDisplay(selectedBox) {
        if (!selectedBox || !mainImage || !normalMap1 || !normalMap2) return;

        // --- 核心改动在这里 ---
        // 我们不再使用 .dataset.normal1
        // 而是用 getAttribute('data-normal-1') 来直接、完整地按名字读取属性
        
        const newMainSrc = selectedBox.dataset.mainSrc; // .dataset 对 mainSrc 有效，可以保留
        const newNormal1Src = selectedBox.getAttribute('data-normal-1'); // 改动点
        const newNormal2Src = selectedBox.getAttribute('data-normal-2'); // 改动点

        // --- 改动结束 ---
        
        console.log("读取到的 Main Src:", newMainSrc);
        console.log("读取到的 Normal 1 Src:", newNormal1Src);
        console.log("读取到的 Normal 2 Src:", newNormal2Src);


        if (newMainSrc) {
            mainImage.src = newMainSrc;
        }
        
        if (newNormal1Src) {
            normalMap1.src = newNormal1Src;
        }
        
        if (newNormal2Src) {
            normalMap2.src = newNormal2Src;
        }

        // 更新选中样式
        selectBoxes.forEach(box => box.classList.remove('selected'));
        selectedBox.classList.add('selected');
    }

    selectBoxes.forEach(box => {
        box.addEventListener('click', (event) => {
            updateDisplay(event.currentTarget);
        });
    });

    const initiallySelectedBox = document.querySelector('.select-box.selected');
    if (initiallySelectedBox) {
        updateDisplay(initiallySelectedBox);
    }
});