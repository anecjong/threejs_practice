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
        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;
        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);

        // const material = new THREE.MeshBasicMaterial({
        //     color: 0xff0000,
        // })

        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            flatShading: false,
            shininess: 50,
        });

        // const material = new THREE.MeshLambertMaterial({
        //     color: 0xff0000,
        //     flatShading: true,
        // })

        // const material = new THREE.MeshStandardMaterial({
        //     color: 0x212121,
        //     emissive: 0x008800,
        //     roughness: 0.3,
        //     metalness: 0.9,
        //     flatshading: false,
        // })


        // material.color.set(0x00ffff);
        // material.color.set("red");
        // material.color.setHSL(0.0, 1.0, 0.5); // 0 ~ 1
        // material.color.setRGB(1.0, 0.0, 0.0); // 0 ~ 1
        const mesh = new THREE.Mesh(geometry, material);

        // const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        // const line = new THREE.LineSegments(
        //     new THREE.WireframeGeometry(geometry), lineMaterial
        // );

        const group = new THREE.Group();
        group.add(mesh);
        // group.add(line);
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