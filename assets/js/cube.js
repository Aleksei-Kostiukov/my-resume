const createCube = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    const container = document.getElementById('cube-container');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const iconPaths = [
        'assets/img/AUTOCAD.png',
        'assets/img/CSS.png',
        'assets/img/GIT.png',
        'assets/img/HTML.png',
        'assets/img/JS.png',
        'assets/img/NX.png'
    ];

    const createMaterialWithIcon = (color, iconPath) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const size = 1024;
        const iconSize = size * 0.7;

        canvas.width = size;
        canvas.height = size;

        context.fillStyle = color;
        context.fillRect(0, 0, size, size);

        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = iconPath;
            image.onload = () => {
                context.drawImage(image, (size - iconSize) / 2, (size - iconSize) / 2, iconSize, iconSize);
                const texture = new THREE.CanvasTexture(canvas);
                resolve(new THREE.MeshStandardMaterial({ map: texture }));
            };
            image.onerror = reject;
        });
    };

    const materialsPromises = iconPaths.map(iconPath => createMaterialWithIcon('#0563bb', iconPath));

    Promise.all(materialsPromises).then(materials => {
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);

        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

       
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(2, 2, 2);
        scene.add(pointLight);

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        // рендерер при изменениях размера окна
        const onWindowResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.render(scene, camera);
        };

    
        window.addEventListener('resize', onWindowResize);
    }).catch(error => {
        console.error('Ошибка загрузки текстур:', error);
    });
};

export { createCube };

