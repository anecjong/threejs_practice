import * as THREE from "three";

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
        
        camera.position.z = 6;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1.0;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(-1, 1, 4)
        this._scene.add(light);
    }

    _setupModel(){
        const geometry = new THREE.BufferGeometry();
        
        const vertices = [
            // front
            { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
            { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
            { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
 
            { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
            { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
            { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
            // right
            { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
            { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
            { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
 
            { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
            { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
            { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
            // back
            { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
            { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
            { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
 
            { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
            { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
            { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
            // left
            { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 1], },
            { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], },
            { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], },
 
            { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], },
            { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], },
            { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 0], },
            // top
            { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 1], },
            { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], },
            { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 0], },
 
            { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 0], },
            { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], },
            { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 0], },
            // bottom
            { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 1], },
            { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 1], },
            { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 0], },
 
            { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 0], },
            { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 1], },
            { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 0], },
        ];

        const positions = [];
        const normals = [];
        const uvs = [];
        for (const vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }

        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

        const cubes = [
            make_cube(geometry, 0xaaaa00,  0, this._scene),
            make_cube(geometry, 0x00aaaa,  3, this._scene),
            make_cube(geometry, 0xaa00aa, -3, this._scene),
        ]

        this._cubes = cubes;

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
        this._cubes.forEach((cube, ndx) => {
            const rot_dir = Math.pow(-1, ndx);
            cube.rotation.set(rot_dir * time, 0, rot_dir * time);
        });
    }
}

function make_cube(geometry, color, x, scene){
    const material = new THREE.MeshPhongMaterial({color: color});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 0, 0);
    scene.add(cube);
    return cube;
}

window.onload = function() {
    new App();
}