import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const gui = new dat.GUI();
        this._gui = gui;

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
        controls.target.set(0, 0, 0);
        controls.update();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
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
        
        camera.position.set(0, 0, 5);
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

    _setupModel(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        {
            const d = 0.8;
            make_cube(geometry, hsl_color(0 / 8, 1, .5), -d, -d, -d, this._scene);
            make_cube(geometry, hsl_color(1 / 8, 1, .5),  d, -d, -d, this._scene);
            make_cube(geometry, hsl_color(2 / 8, 1, .5), -d,  d, -d, this._scene);
            make_cube(geometry, hsl_color(3 / 8, 1, .5),  d,  d, -d, this._scene);
            make_cube(geometry, hsl_color(4 / 8, 1, .5), -d, -d,  d, this._scene);
            make_cube(geometry, hsl_color(5 / 8, 1, .5),  d, -d,  d, this._scene);
            make_cube(geometry, hsl_color(6 / 8, 1, .5), -d,  d,  d, this._scene);
            make_cube(geometry, hsl_color(7 / 8, 1, .5),  d,  d,  d, this._scene);
        }

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

function hsl_color(h, s, l){
    return (new THREE.Color()).setHSL(h, s, l);
}

function make_cube(geometry, color, x, y, z, scene){
    [THREE.BackSide, THREE.FrontSide].forEach((side) => {
        const material = new THREE.MeshStandardMaterial({
            color: color,
            opacity: 0.5,
            transparent: true,
            side: side,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);

        scene.add(mesh);
    });
}

window.onload = function() {
    new App();
}