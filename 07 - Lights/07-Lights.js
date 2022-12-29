import * as THREE from "../../three.js.master/build/three.module.js";

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const gui = new dat.GUI();
        this._gui = gui;

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
        
        camera.position.set(0, 10, 20);
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
        // texture
        const planeSize = 40;
        const loader = new THREE.TextureLoader();
        const texture = loader.load("./resources/tile.png");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        const repeats = planeSize/2;
        texture.repeat.set(repeats, repeats);


        const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

        const palneMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeometry, palneMaterial);
        mesh.rotation.set(-0.5 * Math.PI, 0, 0);

        const group = new THREE.Group();
        group.add(mesh);
        this._group = group;
        this._scene.add(group);

        // cube
        const cubeSize = 4;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({
            color : "#8AC"
        });
        const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
        cubeMesh.position.set(cubeSize+1, cubeSize/2, 0);
        this._scene.add(cubeMesh);

        // sphere
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        this._scene.add(sphereMesh);

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