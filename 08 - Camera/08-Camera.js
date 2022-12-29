import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

class App{
    constructor() {
        const canvas = document.querySelector("#c");
        this._canvas = canvas;

        const view1Elem = document.querySelector('#view1');
        const view2Elem = document.querySelector('#view2');
        this._view1Elem = view1Elem;
        this._view2Elem = view2Elem;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            // depth
            logarithmicDepthBuffer: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();

        window.onresize = this.resize.bind(this);
        this.resize();


        requestAnimationFrame(this.render.bind(this))
    }

    _setupCamera(){
        {
            const fov = 45;
            const width = this._canvas.clientWidth;
            const height = this._canvas.clientHeight;
            const plane_near = 5;
            const plane_far = 40;
            const camera = new THREE.PerspectiveCamera(
                fov,
                width/height,
                plane_near,
                plane_far
            );
        
            camera.position.set(0, 10, 20);
            this._camera_1 = camera;

            const controls = new OrbitControls(this._camera_1, this._view1Elem);
            this._control_1 = controls;

            // camera helper
            const cameraHelper = new THREE.CameraHelper(camera);
            this._cameraHelper = cameraHelper;
            this._scene.add(cameraHelper);
        }

        {
            const fov = 75;
            const width = this._canvas.clientWidth;
            const height = this._canvas.clientHeight;
            const plane_near = 0.1;
            const plane_far = 100;
            const camera = new THREE.PerspectiveCamera(
                fov,
                width/height,
                plane_near,
                plane_far
            );
        
            camera.position.set(40, 10, 30);
            camera.lookAt(0, 5, 0);
            this._camera_2 = camera;

            const controls = new OrbitControls(this._camera_2, this._view2Elem);
            this._control_2 = controls;

            this._control_2.target.set(0, 5, 0);
            this._control_2.update();
        }
    }

    _setupLight(){
        {
            const color = 0xffffff;
            const intensity = 0.1;
            const light = new THREE.AmbientLight(color, intensity);
            this._scene.add(light);
        }
        {
            const color = 0xffffff;
            const intensity = 0.7;
            const light = new THREE.PointLight(color, intensity);
            light.castShadow = true;
            light.position.set(0, 10, 10)
            this._scene.add(light);
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
        const palneMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeometry, palneMaterial);
        mesh.receiveShadow = true;
        mesh.rotation.set(-0.5 * Math.PI, 0, 0);
        mesh.position.set(0, -1, 0);

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
        cubeMesh.castShadow = true;
        group.add(cubeMesh);

        // sphere
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({
            color: '#CA8',
        });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        sphereMesh.castShadow = true;
        group.add(sphereMesh);

    }

    resize(){
        const width = this._canvas.clientWidth;
        const height = this._canvas.clientHeight;

        this._camera_1.aspect = width/height;
        this._camera_1.updateProjectionMatrix();

        this._camera_2.aspect = width/height;
        this._camera_2.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time){
        // turn on the scissor
        this._renderer.setScissorTest(true);
 
        // render the original view
        {
        const aspect = this.setScissorForElement(this._view1Elem);
 
        // adjust the camera for this aspect
        this._camera_1.aspect = aspect;
        this._camera_1.updateProjectionMatrix();
        this._cameraHelper.update();
 
        // don't draw the camera helper in the original view
        this._cameraHelper.visible = false;
 
        this._scene.background = new THREE.Color( 0x000000 );
 
        // render
        this._renderer.render(this._scene, this._camera_1);
        }
 
        // render from the 2nd camera
        {
        const aspect = this.setScissorForElement(this._view2Elem);
 
        // adjust the camera for this aspect
        this._camera_2.aspect = aspect;
        this._camera_2.updateProjectionMatrix();
 
        // draw the camera helper in the 2nd view
        this._cameraHelper.visible = true;
 
        this._scene.background.set(0x000040);
 
        this._renderer.render(this._scene, this._camera_2);
        }
    
        requestAnimationFrame(this.render.bind(this));
        // reder loop
        // requestAnimationFrame -> time parameter
    }

    update(time){
        time *= 0.001; // second unit

    }
    setScissorForElement(elem) {
        const canvasRect = this._canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
 
        // compute a canvas relative rectangle
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);
 
        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);
 
        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height - bottom;
        this._renderer.setScissor(left, positiveYUpBottom, width, height);
        this._renderer.setViewport(left, positiveYUpBottom, width, height);
 
        // return the aspect
        return width / height;
}
}



window.onload = function() {
    new App();
}