import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import {
    gyroscopeMixer,
    airIslandLoaded,
    airPhoenixMixer,
    firePhoenixMixer,
    earthDragonMixer,
    waterBirdMixer,
    flameMixer,
    shipLoaded,
    loadModels, } from './modelLoader.js';


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xFEFEFE);
const scene = new THREE.Scene();

// Camera
const fieldOfView = 75;
const aspectRatio = window.innerWidth / window.innerHeight;
const zNear = 0.2;
const zFar = 2000;
const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, zNear, zFar);

// Orbit Controls
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(250, 30, 20);
orbit.update();

// First Person Controls
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 25;
controls.lookSpeed = 0.08;
controls.lookVertical = true;

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Grid and Axes helpers
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);


// Set up audio listener and load background music
const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
const sound = new THREE.PositionalAudio(listener);

function startAudioPlayback() {
  audioLoader.load('audio/korra.mp3',
    // Success callback
    function (buffer) {
      sound.setBuffer(buffer);
      sound.play();
    },
    // Error callback
    function (e) {
      console.error('Error loading audio:', e);
    }
  );
}
camera.add(sound);

document.addEventListener('click', function () {
  listener.context.resume().then(() => {
    startAudioPlayback();
  });
});


// Generate Water
const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
let water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('images/water_texture.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x00106f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);
water.material.uniforms.size.value = 5;
water.material.uniforms.alpha.value = 0.8;
water.rotation.x = -Math.PI / 2;
scene.add(water);


// Skybox
const loader = new THREE.TextureLoader();
const texture = loader.load('images/skybox2.jpeg');
const geometry = new THREE.SphereGeometry(1000, 120, 80);
geometry.scale(-1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    map: texture
});
const skybox = new THREE.Mesh(geometry, material);
scene.add(skybox);


// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Sun Light
const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
sunLight.position.set(100, 100, 100);
scene.add(sunLight);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;


// Distant Fog
scene.fog = new THREE.Fog(0xffffff, 600, 1000);


// Set up grass cube
const cubeGeometry = new THREE.BoxGeometry(11, 10, 11);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf3f3f3,
    roughness: 0.7,
    metalness: 0.5,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.receiveShadow = true;
scene.add(cube);

// Set up animated grass on top of the cube
const grassGeometry = new THREE.CylinderGeometry(0.01, 0.05, 4, 4); // Adjust parameters for pointy and thin grass
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const grassCount = 2000;
const grassGroup = new THREE.Group();
for (let i = 0; i < grassCount; i++) {
  const grassBlade = new THREE.Mesh(grassGeometry, grassMaterial);
  grassBlade.castShadow = true;
  const randomX = Math.random() * 10 - 5;
  const randomZ = Math.random() * 10 - 5;
  grassBlade.position.set(randomX, 5, randomZ);
  grassBlade.rotation.y = Math.PI / 2;
  grassGroup.add(grassBlade);
}
scene.add(grassGroup);



// Load all GLTF models
loadModels(scene);



// Animation
const clock = new THREE.Clock();
function animate() {
    const time = performance.now() * 0.001;
    const delta = clock.getDelta();
    
    // Water Animation
    water.material.uniforms['time'].value += 1.0 / 60.0;

    // Grass Animation
    grassGroup.children.forEach((grassBlade, index) => {
        const rotationAngle = Math.sin(time + index * 0.1) * 0.1;
        grassBlade.rotation.z = rotationAngle;
    });

    if (sunLight){
        // Adjust sun position for dynamic lighting
        const radius = 300;
        const speed = 0.5;
        const angle = time * speed;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        sunLight.position.set(x, 100, z);
    }

    // Gyroscope Animation
    if (gyroscopeMixer) {
        gyroscopeMixer.update(delta);
    }

    //Air Island Animation
    if (airIslandLoaded) {
        airIslandLoaded.scene.position.y += Math.sin(time) * 0.1;
    }
    
    // Flame Animation
    if (flameMixer) {
        flameMixer.update(delta);
    }

    if (airPhoenixMixer){
        airPhoenixMixer.update(delta);
    }
    
    if (firePhoenixMixer){
        firePhoenixMixer.update(delta);
    }

    if (earthDragonMixer){
        earthDragonMixer.update(delta);
    }

    if (waterBirdMixer){
        waterBirdMixer.update(delta);
    }

    if (shipLoaded) {
        const radius = 200;
        const speed = 0.2;
        const angle = time * speed;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        shipLoaded.scene.position.set(z, 0, x);
        shipLoaded.scene.rotation.y = angle + Math.PI / 2;
    }
    
    controls.update(delta);
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


// Event Listeners
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Preloader
const preloader = document.getElementById('preloader');
const appContainer = document.getElementById('app');

function loadAssets() {
    setTimeout(() => {
        preloader.style.display = 'none';
        appContainer.style.display = 'block';
        requestAnimationFrame(animate);
    }, 2000);
}

loadAssets();
