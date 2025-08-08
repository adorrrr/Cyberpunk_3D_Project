import { While } from 'three/examples/jsm/transpiler/AST.js';
import './style.css';
import * as THREE from 'three';

//scene
const scene = new THREE.Scene();
//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;
//object
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 'whte' });    
const cube = new THREE.Mesh(geometry, material);    
scene.add(cube);


//renderer
const renderer = new THREE.WebGLRenderer({
    canvas : document.querySelector('canvas'),
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);


function animate(){
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();