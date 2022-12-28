import * as THREE from "../../three.js.master/build/three.module.js";

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xAAAAAA);
        this._scene = scene

        this._setupCamera();
        this._setupLight();
        this._setupModel();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this))
    }

    _setupCamera(){
        const fov = 75;
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const plane_near = 0.1;
        const plane_far = 100;
        const camera = new THREE.PerspectiveCamera(
            fov,
            width/height,
            plane_near,
            plane_far
        );
        
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 1, 4)
        this._scene.add(light);
    }

    _setupModel(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const group = new THREE.Group();
        this._group = group;
        this._scene.add(group);

        const loadManager = new THREE.LoadingManager();
        const loader = new THREE.TextureLoader(loadManager);

        // multiple textures
        const materials = [
            new THREE.MeshBasicMaterial({ map: loader.load("resources/fox-1.jpg") }),
            new THREE.MeshBasicMaterial({ map: loader.load("resources/fox-2.jpg") }),
            new THREE.MeshBasicMaterial({ map: loader.load("resources/fox-1.jpg") }),
            new THREE.MeshBasicMaterial({ map: loader.load("resources/fox-2.jpg") }),
            new THREE.MeshBasicMaterial({ map: loader.load("resources/fox-1.jpg") }),
            new THREE.MeshBasicMaterial({ map: loader.load("resources/fox-2.jpg") }),
        ];

        const loadingElem = document.querySelector('#loading');
        const progressBarElem = loadingElem.querySelector('.progressbar');

        loadManager.onLoad = () => {
            loadingElem.style.display = 'none';
            const mesh = new THREE.Mesh(geometry, materials);
            this._group.add(mesh);
        };
        loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
            const progress = itemsLoaded / itemsTotal;
            sleep(1000);
            progressBarElem.style.transform = `scaleX(${progress})`;
        };
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time){
        this._renderer.render(this._scene, this._camera);
        this.update(time)
        requestAnimationFrame(this.render.bind(this));
        // reder loop
        // requestAnimationFrame -> time parameter
    }

    update(time){
        time *= 0.001; // second unit
        this._group.rotation.x = time;
        this._group.rotation.y = time;
    }
}

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

window.onload = function() {
    new App();
}