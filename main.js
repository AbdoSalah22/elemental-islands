import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { loadingScreen } from './loading.js';
import {
    gyroscopeMixer,
    airIslandLoaded,
    airPhoenixMixer,
    firePhoenixMixer,
    earthDragonMixer,
    waterBirdMixer,
    flameMixer,
    shipLoaded,
    loadModels, } from './models.js';


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
camera.position.set(120, 10, 20);
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


// Background music
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


// Load Sound Effect
const soundEffectAudio = new THREE.Audio(listener);
const soundEffectLoader = new THREE.AudioLoader();
soundEffectLoader.load('audio/fire.mp3', function (buffer) {
    soundEffectAudio.setBuffer(buffer);
    soundEffectAudio.setLoop(false); // Adjust loop as needed
    soundEffectAudio.setVolume(0); // Initial volume
    soundEffectAudio.play();
});

// Create a position for the sound source
const soundSourcePosition = new THREE.Vector3(-80, 45, -25); // Adjust the position


// Create a fire particle
const fireParticleGeometry = new THREE.TetrahedronGeometry(0.8);
const fireParticleMaterial = new THREE.MeshBasicMaterial({ color: 0xff1f00 });
const fireParticle = new THREE.Mesh(fireParticleGeometry, fireParticleMaterial);
fireParticle.position.set(0, 15, 0); // Set the position to y = 20
scene.add(fireParticle);

// Add a point light at the position of the fire particle
const pointLight = new THREE.PointLight(0xffa500, 200, 20);
pointLight.position.copy(fireParticle.position);
scene.add(pointLight);
pointLight.castShadow = true;

// Simple animation for the fire particle
function animateFire() {
    const speed = 0.1;

    // Move the fire particle up and down for a flickering effect
    fireParticle.position.y += Math.sin(Date.now() * speed) * 0.1;

    // Rotate the fire particle for a dynamic look
    fireParticle.rotation.x += 0.01;
    fireParticle.rotation.y += 0.01;
}

// Generate Water
const waterGeometry = new THREE.PlaneGeometry(2000, 2000);
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

// Load Ocean Waves Sound
const oceanWavesAudio = new THREE.Audio(listener);
const oceanWavesLoader = new THREE.AudioLoader();
oceanWavesLoader.load('audio/waves.mp3', function (buffer) {
    oceanWavesAudio.setBuffer(buffer);
    oceanWavesAudio.setLoop(true);
    oceanWavesAudio.setVolume(0.5); // Adjust the volume as needed
    oceanWavesAudio.play();
});


// Skybox
const loader = new THREE.TextureLoader();
const texture = loader.load('images/skybox.jpeg');
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
sunLight.position.set(200, 300, 20);
scene.add(sunLight);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = zNear;
sunLight.shadow.camera.far = zFar;


// Distant Fog (not visually appealing)
//scene.fog = new THREE.Fog(0xffffff, 600, 1000);


// Moon
const moonLoader = new THREE.TextureLoader();
const moonTexture = loader.load('images/orb.jpg');
const moonGeometry = new THREE.SphereGeometry(10, 10, 10);
const moonMaterial = new THREE.MeshBasicMaterial({
    map: moonTexture,
    metalness: 0.9
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moonGeometry.scale(0.5, 0.5, 0.5);
moon.position.x = 70;
moon.position.y = 100;
moon.position.z = 10;
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);


// Set up grass cube
const cubeGeometry = new THREE.BoxGeometry(11, 10, 11);
const cubeTextureLoader = new THREE.TextureLoader();
const cubeTexture = cubeTextureLoader.load('images/sand.jpg');
const cubeMaterial = new THREE.MeshStandardMaterial({
    map: cubeTexture,
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
loadingScreen();
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

    // Gyroscope Animation
    if (gyroscopeMixer) {
        gyroscopeMixer.update(delta);
    }

    //Air Island Animation
    if (airIslandLoaded) {
        airIslandLoaded.scene.position.y += Math.sin(time) * 0.1;
    }

    // Moon Animation
    moon.position.y += Math.sin(time) * 0.1;
    moon.rotation.y += 0.5 * delta;
    
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
        const speed = 0.1;
        const angle = time * speed;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        shipLoaded.scene.position.set(z, 0, x);
        shipLoaded.scene.rotation.y = angle + Math.PI / 2;
    }

    // Update audio listener position based on camera position
    const { x, y, z } = camera.position;
    listener.position.set(x, y, z);

    // Set the position of the sound source
    soundEffectAudio.position.copy(soundSourcePosition);

    // Calculate distance between the listener and the sound source
    const distance = listener.position.distanceTo(soundSourcePosition);

    // Adjust the volume based on the distance
    const maxDistance = 100; // Adjust the maximum distance for the effect
    const volume = Math.max(0, 1 - distance / maxDistance);
    soundEffectAudio.setVolume(volume);

    animateFire();

    
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

