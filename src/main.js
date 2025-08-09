import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import './style.css';
import * as THREE from 'three';
import { rotate } from 'three/tsl';
import gsap from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    lerp: 0.1,
    multiplier: 0.5,
    smartphone: {
        smooth: true,
        lerp: 0.1,
        multiplier: 0.5,
    },
    tablet: {
        smooth: true,
        lerp: 0.1,
        multiplier: 0.5,
    }
});

//scene
const scene = new THREE.Scene();


//camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;12

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas : document.querySelector('canvas'),
    antialias: true,
    alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;



// Post-processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);



// RGB Shift effect
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms.amount.value = 0.003; 
rgbShiftPass.uniforms.angle.value = 0.5; 
composer.addPass(rgbShiftPass);


let model;


const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();





new RGBELoader().load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', function(texture){
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();

    const loader = new GLTFLoader();
    loader.load('public/DamagedHelmet.gltf', function(gltf){
        model = gltf.scene;
        scene.add(model);
    },undefined,function(error){
        console.error('An error happened',error);
    });
});

window.addEventListener('mousemove',(event)=>{
    if(model){
        const rotationX = (event.clientX / window.innerWidth - .5) * (Math.PI * .2);
        const rotationY = (event.clientY / window.innerHeight - .5) * (Math.PI * .2);
        
        gsap.to(model.rotation, {
            y: rotationX,
            x: rotationY,
            duration: 0.9,
            ease: "power2.out"
        });
    }
});

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

function animate(){
    window.requestAnimationFrame(animate);
    composer.render(); 
}
animate();