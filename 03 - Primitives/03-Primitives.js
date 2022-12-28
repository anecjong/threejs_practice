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
        light.position.set(-1, 2, 4)
        this._scene.add(light);
    }

    _setupModel(){
        /* box
        const box_width = 1;
        const box_height = 1;
        const box_depth = 1;

        const box_width_segments = 2;
        const box_height_segments = 2;
        const box_depth_segments = 2;

        const geometry = new THREE.BoxGeometry(
            box_width, box_height, box_depth,
            box_width_segments, box_height_segments, box_depth_segments
        );
        */

        /* flat circle
        const radius = 1;
        const segments = 24;
        const geometry = new THREE.CircleBufferGeometry(radius, segments);
        */
        
        /* cone
        const radius = 1;
        const height = 1;
        const segments = 16;
        const geometry = new THREE.ConeBufferGeometry(radius, height, segments);
        */

        /* cylinder
        const radiusTop = 0.5;
        const radiusBottom = 1;
        const height = 1;
        const radialSegments = 12;
        const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);
        */

        /* A dodecahedron (12 sides)
        const radius = 7;
        const geometry = new THREE.DodecahedronBufferGeometry(radius);
        */

        /* heart
        const shape = new THREE.Shape();
        const x = -0.5;
        const y = -1;
        shape.moveTo(x + 0.5, y + 0.5);
        shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.72, x + 0.5, y + 1.9);
        shape.bezierCurveTo(x + 1.2, y + 1.72, x + 1.6, y + 0.9, x + 1.6, y + 0.7);
        shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
        shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

        const extrudeSettings = {
        steps: 2,
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelSegments: 2,
        };

        const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        */
        
        /* sphere */
        const radius = 1;
        const widthSegments = 8;
        const heightSegments = 8;
        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);

        const material = new THREE.MeshPhongMaterial({
            color: 0x515151
        });
        const mesh = new THREE.Mesh(geometry, material);

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry), lineMaterial
        );
        const group = new THREE.Group();
        group.add(mesh);
        group.add(line);
        this._group = group;
        this._scene.add(group);

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

window.onload = function() {
    new App();
}