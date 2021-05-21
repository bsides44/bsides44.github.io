import * as THREE from './node_modules/three/src/Three.js';
// import { VRButton } from '../../libs/three/jsm/VRButton.js';
// import { XRControllerModelFactory } from '../../libs/three/jsm/XRControllerModelFactory.js';
// import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
// import { Stats } from '../../libs/stats.module.js';
// import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';


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
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(40, (window.innerWidth) / (window.innerHeight), 0.1, 1000);

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        var light = new THREE.PointLight(0xffffff);
        light.position.set(-100, 200, 100);
        scene.add(light);

        var light2 = new THREE.PointLight(0xffffdd);
        light2.position.set(100, -2000, -100);
        scene.add(light2);

        var geometry = new THREE.BoxGeometry(4, 4, 4);
        var material = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        var sphereGeometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        var sphereMaterial = new THREE.MeshNormalMaterial();
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        camera.position.z = 30;

        var render = function () {
            requestAnimationFrame(render);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            sphere.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        render()
    }

}

export { App };