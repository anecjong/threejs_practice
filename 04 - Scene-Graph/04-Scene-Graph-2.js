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

        this.aspect = width / height;
        const camera = new THREE.PerspectiveCamera(
            fov,
            this.aspect,
            plane_near,
            plane_far
        );
        
        camera.position.set(0, 30, 30);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);
        this._detach_camera = camera;
        this._camera = camera;
    }

    _setupLight(){
        {
            const color = 0xffffff;
            const intensity = 1;
            const light = new THREE.PointLight(color, intensity);
            light.position.set(10, 10, 0);
            this._scene.add(light);
            light.castShadow = true;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;

            const d = 50;
            light.shadow.camera.left = -d;
            light.shadow.camera.right = d;
            light.shadow.camera.top = d;
            light.shadow.camera.bottom = -d;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 50;
            light.shadow.bias = 0.001;
        }
        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 20, 0);
            this._scene.add(light);
            light.castShadow = true;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;

            const d = 50;
            light.shadow.camera.left = -d;
            light.shadow.camera.right = d;
            light.shadow.camera.top = d;
            light.shadow.camera.bottom = -d;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 50;
            light.shadow.bias = 0.001;
        }
    }

    _setupModel(){
        const objs = [];

        // ground
        const ground_geometry = new THREE.PlaneBufferGeometry(50, 50);
        const ground_material = new THREE.MeshPhongMaterial({color: 0xCC8866});
        const ground_mesh = new THREE.Mesh(ground_geometry, ground_material);
        ground_mesh.rotation.x = Math.PI * -.5;
        ground_mesh.receiveShadow = true;
        this._scene.add(ground_mesh);

        // tank
        const tank = new THREE.Object3D();
        this._tank = tank;
        this._scene.add(tank);

        // body
        const carWidth = 4;
        const carHeight = 1;
        const carLength = 8;
        const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);
        const bodyMaterial = new THREE.MeshPhongMaterial({color: 0x6688AA});
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.y = 1.4;
        bodyMesh.castShadow = true;
        tank.add(bodyMesh);

        // body camera
        const tankCamera = new THREE.PerspectiveCamera(75, this.fov, 0.1, 100);
        tankCamera.position.y = 3;
        tankCamera.position.z = -6;
        tankCamera.rotation.y = Math.PI;
        bodyMesh.add(tankCamera)
        this._tankCamera = tankCamera;

        const wheelRadius = 1;
        const wheelThickness = .5;
        const wheelSegments = 6;
        const wheelGeometry = new THREE.CylinderBufferGeometry(
            wheelRadius,     // top radius
            wheelRadius,     // bottom radius
            wheelThickness,  // height of cylinder
            wheelSegments);
        const wheelMaterial = new THREE.MeshPhongMaterial({color: 0x888888});
        const wheelPositions = [
            [-carWidth / 2 - wheelThickness / 2, -carHeight / 2,  carLength / 3],
            [ carWidth / 2 + wheelThickness / 2, -carHeight / 2,  carLength / 3],
            [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
            [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
            [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
            [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
        ];
        const wheelMeshes = wheelPositions.map((position) => {
            const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
            mesh.position.set(...position);
            mesh.rotation.z = Math.PI * .5;
            mesh.castShadow = true;
            bodyMesh.add(mesh);
            return mesh;
        });

        const domeRadius = 2;
        const domeWidthSubdivisions = 12;
        const domeHeightSubdivisions = 12;
        const domePhiStart = 0;
        const domePhiEnd = Math.PI * 2;
        const domeThetaStart = 0;
        const domeThetaEnd = Math.PI * .5;
        const domeGeometry = new THREE.SphereBufferGeometry(
            domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
            domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
        const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
        domeMesh.castShadow = true;
        bodyMesh.add(domeMesh);
        domeMesh.position.y = .5;

        const turretWidth = .1;
        const turretHeight = .1;
        const turretLength = carLength * .75 * .2;
        const turretGeometry = new THREE.BoxBufferGeometry(
            turretWidth, turretHeight, turretLength);
        const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
        const turretPivot = new THREE.Object3D();
        turretMesh.castShadow = true;
        turretPivot.scale.set(5, 5, 5);
        turretPivot.position.y = .5;
        turretMesh.position.z = turretLength * .5;
        turretPivot.add(turretMesh);
        bodyMesh.add(turretPivot);

        this._turretPivot = turretPivot;
        this._turretMesh = turretMesh;

        // target
        const targetGeometry = new THREE.SphereBufferGeometry(.5, 6, 3);
        const targetMaterial = new THREE.MeshPhongMaterial({color: 0x00FF00, flatShading: true});
        const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
        const targetOrbit = new THREE.Object3D();
        const targetElevation = new THREE.Object3D();
        const targetBob = new THREE.Object3D();

        this._targetGeometry =   targetGeometry ;
        this._targetMaterial =   targetMaterial ;
        this._targetMesh     =   targetMesh     ;
        this._targetOrbit    =   targetOrbit    ;
        this._targetElevation=   targetElevation;
        this._targetBob      =   targetBob      ;

        targetMesh.castShadow = true;
        this._scene.add(targetOrbit);
        targetOrbit.add(targetElevation);
        targetElevation.position.z = carLength * 2;
        targetElevation.position.y = 8;
        targetElevation.add(targetBob);
        targetBob.add(targetMesh);

        const targetCamera = new THREE.PerspectiveCamera(75.0, this.aspect, 0.1, 100);
        const targetCameraPivot = new THREE.Object3D();
        targetCamera.position.y = 1;
        targetCamera.position.z = -2;
        targetCamera.rotation.y = Math.PI;
        targetBob.add(targetCameraPivot);
        targetCameraPivot.add(targetCamera);

        const curve = new THREE.SplineCurve( [
            new THREE.Vector2( -10, 0 ),
            new THREE.Vector2( -5, 5 ),
            new THREE.Vector2( 0, 0 ),
            new THREE.Vector2( 5, -5 ),
            new THREE.Vector2( 10, 0 ),
            new THREE.Vector2( 5, 10 ),
            new THREE.Vector2( -5, 10 ),
            new THREE.Vector2( -10, -10 ),
            new THREE.Vector2( -15, -8 ),
            new THREE.Vector2( -10, 0 ),
        ] );
        this._curve = curve;
        const tankPosition = new THREE.Vector2();
        this._tankPosition = tankPosition;
        const tankTarget = new THREE.Vector2();
        this._tankTarget = tankTarget;
        const targetPosition = new THREE.Vector3();
        this._targetPosition = targetPosition;

        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        const splineObject = new THREE.Line( geometry, material );
        splineObject.rotation.x = Math.PI * .5;
        splineObject.position.y = 0.05;
        this._scene.add(splineObject);

    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        this.apsect = width / height;

        this._camera.aspect = this.aspect;
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

        if (time % 8 < 4){
            this._camera = this._detach_camera;
            this.resize();
        }
        else {
            this._camera = this._tankCamera;
            this.resize();
        }
        // move target
        this._targetOrbit.rotation.y = time * .27;
        this._targetBob.position.y = Math.sin(time * 2) * 4;
        this._targetMesh.rotation.x = time * 7;
        this._targetMesh.rotation.y = time * 13;
        this._targetMaterial.emissive.setHSL(time * 0.1 % 1, 1, .25);
        this._targetMaterial.color.setHSL(time * 0.1 % 1, 1, .25);

        // move tank
        const tankTime = time * 0.05;
        this._curve.getPointAt(tankTime % 1, this._tankPosition);
        this._curve.getPointAt((tankTime + 0.01) % 1, this._tankTarget);
        this._tank.position.set(this._tankPosition.x, 0, this._tankPosition.y);
        this._tank.lookAt(this._tankTarget.x, 0, this._tankTarget.y);

        // face turret at target
        this._targetMesh.getWorldPosition(this._targetPosition);
        this._turretPivot.lookAt(this._targetPosition);

    }
}

window.onload = function() {
    new App();
}