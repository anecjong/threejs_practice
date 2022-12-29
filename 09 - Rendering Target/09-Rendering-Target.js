import * as THREE from "three";

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const gui = new dat.GUI();
        this._gui = gui;

        const loader = new THREE.TextureLoader();
        this._loader = loader;

        const renderer = new THREE.WebGLRenderer({});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer

        const scene = new THREE.Scene();
        this._scene = scene

        this._setupRenderTarget();
        this._setupCamera();
        this._setupLight();
        this._setupModel();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this))
    }

    _setupCamera(){
        const fov = 45;
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
        
        camera.position.set(0, 0, 3);
        this._camera = camera;
    }

    _setupLight(){
        {
            // ambient light
            const color = 0xffffff;
            const intensity = 0.1;
            const light = new THREE.AmbientLight(color, intensity);
            this._scene.add(light);
            this._gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
            this._gui.add(light, 'intensity', 0, 2, 0.01);
        }
        {
            // hemisphere light
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 0.5;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this._scene.add(light);
            this._gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
            this._gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
            this._gui.add(light, 'intensity', 0, 2, 0.01);
        }
        {
            // directional light
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 10, 0);
            light.target.position.set(-5, 0, 0);
            this._scene.add(light);
            this._scene.add(light.target);
            this._gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
            this._gui.add(light, 'intensity', 0, 2, 0.01);
            this._gui.add(light.target.position, 'x', -10, 10);
            this._gui.add(light.target.position, 'z', -10, 10);
            this._gui.add(light.target.position, 'y', 0, 10);
        }
    }

    _setupRenderTarget(){
        const rtWidth = 512;
        const rtHeight = 512;
        const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
        this._renderTarget = renderTarget;

        const rtCamera = new THREE.PerspectiveCamera(75, rtWidth/rtHeight, 0.1, 5);
        rtCamera.position.set(0, 0, 2);
        this._rtCamera = rtCamera;
        
        const rtScene = new THREE.Scene();
        rtScene.background = new THREE.Color( 0x115511 );
        this._rtScene = rtScene;

        {
            const color = 0xffffff;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            rtScene.add(light);
        }

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const fox_cube_1 = new THREE.Mesh(geometry,
            new THREE.MeshBasicMaterial({map: this._loader.load("./resources/fox-1.jpg")}));
        fox_cube_1.position.set(-0.8, 0, 0);
        this._rtScene.add(fox_cube_1);

        const fox_cube_2 = new THREE.Mesh(geometry,
            new THREE.MeshBasicMaterial({map: this._loader.load("./resources/fox-2.jpg")}));
        this._rtScene.add(fox_cube_2);
        fox_cube_2.position.set(0.8, 0, 0);

        const cubes = [
            fox_cube_1,
            fox_cube_2,
        ];

        this._cubes = cubes;
    }

    _setupModel(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const material = new THREE.MeshBasicMaterial({
            map: this._renderTarget.texture,
        })

        const mesh = new THREE.Mesh(geometry, material);
        this._mesh = mesh;

        this._scene.add(mesh);

    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time){
        this.update(time);

        this._renderer.setRenderTarget(this._renderTarget);
        this._renderer.render(this._rtScene, this._rtCamera);
        this._renderer.setRenderTarget(null);

        this._renderer.render(this._scene, this._camera);

        requestAnimationFrame(this.render.bind(this));
    }

    update(time){
        time *= 0.001; // second unit

        this._cubes.forEach((cube, ndx) => {
            const i = Math.pow(-1, ndx);
            cube.rotation.set(time * i, time, time);
        })

        this._mesh.rotation.set(time, -time, time);

    }
}

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

window.onload = function() {
    new App();
}