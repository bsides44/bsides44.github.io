import * as THREE from 'three/build/three.module';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

// basic three scene
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(3, 3, 3, 3, 3, 3);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;


// function animate() {
//     requestAnimationFrame(animate);
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }
// init();
// animate();

// complex interactive cube scene, from https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_points.html

let renderer, scene, camera;

let particles;

const PARTICLE_SIZE = 20;

let raycaster, intersects;
let pointer, INTERSECTED;

init();
animate();

function init() {

    const container = document.getElementById('container');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 250;

    let boxGeometry = new THREE.BoxGeometry(50, 50, 50, 2, 2, 2);

    // if normal and uv attributes are not removed, mergeVertices() can't consolidate indentical vertices with different normal/uv data

    boxGeometry.deleteAttribute('normal');
    boxGeometry.deleteAttribute('uv');

    boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

    const positionAttribute = boxGeometry.getAttribute('position');

    const colors = [];
    const sizes = [];

    const color = new THREE.Color();

    for (let i = 0, l = positionAttribute.count; i < l; i++) {

        color.setHSL(0.01 + 0.1 * (i / l), 1.0, 0.5);
        color.toArray(colors, i * 3);

        sizes[i] = PARTICLE_SIZE * 0.5;

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positionAttribute);
    geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({

        uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            pointTexture: { value: new THREE.TextureLoader().load('./assets/disc.png') }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,

        alphaTest: 0.9

    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('pointermove', onPointerMove);

}

function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.001;

    const geometry = particles.geometry;
    const attributes = geometry.attributes;

    raycaster.setFromCamera(pointer, camera);

    intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].index) {

            attributes.size.array[INTERSECTED] = PARTICLE_SIZE;

            INTERSECTED = intersects[0].index;

            attributes.size.array[INTERSECTED] = PARTICLE_SIZE * 1.25;
            attributes.size.needsUpdate = true;

        }

    } else if (INTERSECTED !== null) {

        attributes.size.array[INTERSECTED] = PARTICLE_SIZE;
        attributes.size.needsUpdate = true;
        INTERSECTED = null;

    }

    renderer.render(scene, camera);

}