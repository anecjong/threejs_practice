import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

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
        this._renderer = renderer;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();

        const controls = new OrbitControls(this._camera, this._divContainer);
        controls.target.set(0, 0, 1);
        controls.update();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupCamera(){
        const fov = 75;
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const plane_near = 1;
        const plane_far = 1100;
        const camera = new THREE.PerspectiveCamera(
            fov,
            width/height,
            plane_near,
            plane_far
        );
        
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, 1);
        this._camera = camera;
    }

    _setupLight(){
        {
            // ambient light
            const color = 0xffffff;
            const intensity = 0.7;
            const light = new THREE.AmbientLight(color, intensity);
            this._scene.add(light);
            this._gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
            this._gui.add(light, 'intensity', 0, 2, 0.01);
        }
    }

    _setupModel(){
        const geometry = new THREE.SphereGeometry(500, 60, 40, 0, Math.PI, 0, Math.PI);
        geometry.scale(-1, 1, 1);

        const video = document.getElementById( 'video' );
        video.play();

        // const texture = this._loader.load("./resources/Panorama.jpg");
        const texture = new THREE.VideoTexture(video);

        const material = new THREE.MeshBasicMaterial({
            map: texture,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 1);
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
        this._renderer.render(this._scene, this._camera);
        this.update(time)
        requestAnimationFrame(this.render.bind(this));
        // reder loop
        // requestAnimationFrame -> time parameter
    }

    update(time){
        time *= 0.001; // second unit
        // this._group.rotation.x = time;
        // this._group.rotation.y = time;
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