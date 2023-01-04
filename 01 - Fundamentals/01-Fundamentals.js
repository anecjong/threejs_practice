import * as THREE from "three";

class App{
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer

        const scene = new THREE.Scene();
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
        light.position.set(-1, 2, 4)
        this._scene.add(light);
    }

    _setupModel(){
        const box_width = 1;
        const box_height = 1;
        const box_depth = 1;

        const box_width_segments = 2;
        const box_height_segments = 2;
        const box_depth_segments = 2;

        const geometry = new THREE.BoxGeometry(
            box_width, box_height, box_depth,
            box_width_segments, box_height_segments, box_depth_segments
        )

        const cubes = [
            this.make_instance(geometry, 0x44aa88, 0),
            this.make_instance(geometry, 0x8844aa, -2),
            this.make_instance(geometry, 0xaa8844, 2)
        ];

        this._cubes = cubes;
    }

    make_instance(geometry, color, x){
        const material = new THREE.MeshPhongMaterial({color: color});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = x;

        this._scene.add(cube);

        return cube;
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
        this._cubes.forEach((cube, ndx) =>{
            const speed = 1 + ndx * 0.1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        })
    }
}

window.onload = function() {
    new App();
}