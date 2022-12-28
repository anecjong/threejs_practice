import * as THREE from "../../three.js.master/build/three.module.js";

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const gui = new dat.GUI();
        this.gui = gui;

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
        
        camera.position.set(0, 20, 0);
        camera.up.set(0, 0, 1);
        camera.lookAt(0, 0, 0);
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        this._scene.add(light);
    }

    _setupModel(){
        const objs = [];

        // sphere
        const radius = 1;
        const width_segments = 6;
        const height_segments = 6;
        const geometry = new THREE.SphereBufferGeometry(
            radius, width_segments, height_segments);
        
        const sun_material = new THREE.MeshPhongMaterial({
            emissive: 0xFFFF00
        });

        // solar system
        const solar_system = new THREE.Object3D();
        this._scene.add(solar_system);
        this._solar_system = solar_system;

        // earth orbit
        const earth_orbit = new THREE.Object3D();
        earth_orbit.position.x = 10;
        solar_system.add(earth_orbit);
        this._earth_orbit = earth_orbit;

        // moon orbit
        const moon_orbit = new THREE.Object3D();
        moon_orbit.position.x = 2;
        earth_orbit.add(moon_orbit);
        this._moon_orbit = moon_orbit;

        // sun mesh
        const sun_mesh = new THREE.Mesh(geometry, sun_material);
        sun_mesh.scale.set(5, 5, 5);
        this._sun_mesh = sun_mesh;

        objs.push(sun_mesh);

        // earth mesh
        const earth_material = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244
        });
        const earth_mesh = new THREE.Mesh(geometry, earth_material);
        earth_mesh.scale.set(0.7, 0.7, 0.7);
        this._earth_mesh = earth_mesh;
        earth_orbit.add(earth_mesh);

        objs.push(earth_mesh);

        // moon mesh
        const moon_material = new THREE.MeshPhongMaterial({
            color: 0x888888,
            emissive: 0x222222
        });
        const moon_mesh = new THREE.Mesh(geometry, moon_material);
        moon_mesh.scale.set(0.3, 0.3, 0.3);
        this._moon_mesh = moon_mesh;
        moon_orbit.add(moon_mesh);

        objs.push(moon_mesh);

        // axeshelper
        // objs.forEach((node) => {
        //     const axes = new THREE.AxesHelper();
        //     axes.material.depthTest = false;
        //     axes.renderOrder = 1;
        //     node.add(axes);
        // })

        // dat.GUI library
        make_axis_grid(this.gui, solar_system, "solar_system", 25);
        make_axis_grid(this.gui, sun_mesh, "sun_mesh");
        make_axis_grid(this.gui, earth_orbit, "earth_orbit");
        make_axis_grid(this.gui, earth_mesh, "earth_mesh");
        make_axis_grid(this.gui, moon_mesh, "moon_mesh");

        this._scene.add(sun_mesh);
        solar_system.add(earth_orbit);
        earth_orbit.add(moon_orbit);
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

        this._solar_system.rotation.y = time * 0.1;
        this._sun_mesh.rotation.y = time * 0.3;

        this._earth_orbit.rotation.y = time * 2;
        this._earth_mesh.rotation.y = time * 1;

        this._moon_orbit.rotation.y = time * 2;
        this._moon_mesh.rotation.y = time * 4;
    }
}

function make_axis_grid(gui, node, label, units){
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
}

class AxisGridHelper{
    constructor(node, units=10){
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2; // after the grid
        node.add(axes);

        const grid = new THREE.GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);
        
        this.grid = grid;
        this.axes = axes;
        this.visible = false;
    }

    get visible(){
        return this._visible;
    }

    set visible(v){
        this._visible = v;
        this.grid.visible = v;
        this.axes.visible = v;
    }
}

window.onload = function() {
    new App();
}