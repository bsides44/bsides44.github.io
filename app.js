import * as THREE from './node_modules/three/src/Three.js';
import { ARButton } from './ARButton.js';
import { Stats } from './stats.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './node_modules/three/examples/jsm/loaders/FBXLoader.js';
// let mixer;

class App {
    constructor() {
        // flashing words
        var title = document.getElementById("title")
        var words = [...document.getElementsByClassName("words")]
        var ticker = true

        function repeatingFunc() {
            setTimeout(repeatingFunc, 500);
            ticker = !ticker
            ticker ? title.style.color = "black" : title.style.color = "red"
            words.forEach(word => ticker ? word.style.color = "black" : word.style.color = "blue")
        }

        setTimeout(repeatingFunc, 500);

        // three scene
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        this.initScene();
        this.setupXR();
        // this.animate();

        window.addEventListener('resize', this.resize.bind(this));
    }

    initScene() {
        // cubes
        // this.geometry = new THREE.BoxBufferGeometry(0.06, 0.06, 0.06);
        // spheres
        // this.sphereGeometry = new THREE.SphereGeometry(0.05, 8, 6, 0, Math.PI * 2, 0, Math.PI);

        this.meshes = [];
    }

    setupXR() {
        this.renderer.xr.enabled = true;

        const self = this;
        let controller;

        function onSelect() {
            // cubes
            // const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF * Math.random() });
            // const mesh = new THREE.Mesh(self.geometry, material);
            // spheres
            // var sphereMaterial = new THREE.MeshNormalMaterial();
            // const mesh = new THREE.Mesh(self.sphereGeometry, sphereMaterial);

            // mesh.position.set(0, 0, -0.39).applyMatrix4(controller.matrixWorld);
            // mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
            // self.scene.add(mesh);
            // self.meshes.push(mesh);

            const loader = new FBXLoader()
            loader.load('./boat.fbx', function (object) {

                // mixer = new THREE.AnimationMixer(object);

                // const action = mixer.clipAction(object.animations[0]);
                // action.play();

                object.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                object.scale.set(0.0002, 0.0002, 0.0002)

                object.position.set(0, 0, -0.2).applyMatrix4(controller.matrixWorld);
                object.quaternion.setFromRotationMatrix(controller.matrixWorld);
                self.scene.add(object);
                self.meshes.push(object);
            })
        }

        const btn = new ARButton(this.renderer)
        controller = this.renderer.xr.getController(0)  //the first touch of the screen
        controller.addEventListener('select', onSelect)
        this.scene.add(controller)
        this.renderer.setAnimationLoop(this.render.bind(this));

    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // animate() {
    // requestAnimationFrame(animate);
    // this.renderer.setAnimationLoop(this.render.bind(this));
    // const delta = this.clock.getDelta();
    // if (mixer) mixer.update(delta);
    // }

    render() {
        this.stats.update();
        // this.meshes.forEach((mesh) => { mesh.rotateY(0.01 * Math.random(), mesh.rotateZ(0.01 * Math.random())) });
        this.renderer.shadowMap.enabled = true;
        this.renderer.render(this.scene, this.camera);
    }

}

export { App };