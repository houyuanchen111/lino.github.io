// NormalViewer.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createNormalViewer(container, options = {}) {
    // 验证容器是否存在
    if (!container) {
        console.error('Container element is not found.');
        return null;
    }

    // 创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 设置背景色
    if (options.backgroundColor) {
        renderer.setClearColor(new THREE.Color(options.backgroundColor));
    }

    // 添加相机控制
    camera.position.z = 3;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // 加载器和材质
    const gltfLoader = new GLTFLoader();
    const normalMaterial = new THREE.MeshNormalMaterial();
    let currentModel = null;

    // 加载模型函数
    async function loadModel(modelUrl) {
        if (!modelUrl) {
            console.error('No model URL provided.');
            return;
        }

        try {
            // 移除旧模型
            if (currentModel) {
                scene.remove(currentModel);
                // 注意：这里为了简化，没有处理dispose，可根据需要添加
            }

            // 加载新模型
            const gltf = await gltfLoader.loadAsync(modelUrl);
            const model = gltf.scene;

            // 应用法线材质
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = normalMaterial;
                }
            });

            scene.add(model);
            currentModel = model;

            // 调整相机
            const bbox = new THREE.Box3().setFromObject(model);
            const size = bbox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            camera.position.z = maxDim * 2;
            controls.update();
        } catch (error) {
            console.error('Error loading model:', error);
        }

        // 渲染循环
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            controls.update();
        }
        animate();
    }

    // 暴露加载模型函数
    return {
        loadModel
    };
}