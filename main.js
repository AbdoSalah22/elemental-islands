import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PositionalAudio } from 'three';

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
camera.position.set(30, 40, 28);
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

// Function to start audio playback
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

// Connect the audio source to the camera
camera.add(sound);

// Listen for the 'keydown' event on the document
document.addEventListener('keydown', function (event) {
  // Check if the pressed key is the keypad down arrow (key code 40)
  if (event.code === 'ArrowDown') {
    startAudioPlayback();
  }
});

// Listen for a user interaction event (e.g., mouse click) to set up audio listener
document.addEventListener('click', function () {
  // Set up audio listener and start audio playback
  listener.context.resume().then(() => {
    startAudioPlayback();
  });
});

// Water
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
sunLight.position.set(50, 100, 5);
scene.add(sunLight);
sunLight.castShadow = true;


// Distant Fog
scene.fog = new THREE.Fog(0xffffff, 600, 1000);


// Air Island
const lodAirIsland = new THREE.LOD();
let airIslandLoaded;
const airIslandLoader = new GLTFLoader();
airIslandLoader.load('models/floating_island2/scene.gltf', (gltf) => {
    airIslandLoaded = gltf;
    const model = gltf.scene
    model.position.x = 70;
    model.position.y = -5;
    model.position.z = 10;
    model.scale.set(10, 10, 10);
    scene.add(model);
});


// Air Temple
let airTempleLoaded;
const airTempleLoader = new GLTFLoader();
airTempleLoader.load('models/greek_temple1/scene.gltf', (gltf) => {
    airTempleLoaded = gltf;
    gltf.scene.position.x = 50;
    gltf.scene.position.y = 15;
    gltf.scene.position.z = 20;
    gltf.scene.rotation.y = 0.5;
    gltf.scene.scale.set(0.03, 0.03, 0.03);
    scene.add(gltf.scene);
});


// Earth Island
const earthIslandLoader = new GLTFLoader();
earthIslandLoader.load('models/desert_island2/scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.position.x = -80;
    model.position.y = 10;
    model.position.z = 80;
    model.rotation.y = 180;
    model.scale.set(5, 5, 5);
    scene.add(model);
});


// Water Island
const waterIslandLoader = new GLTFLoader();
waterIslandLoader.load('models/ice_island5/scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.position.x = 30;
    model.position.y = -2.3;
    model.position.z = 90;
    model.rotation.y = 90;
    model.scale.set(40, 40, 40);
    scene.add(model);
});



// Fire Island
const fireIslandLoader = new GLTFLoader();
fireIslandLoader.load('models/volcano_island1/scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.position.x = -80;
    model.position.y = -7;
    model.position.z = -80;
    model.rotation.y = 180;
    model.scale.set(2, 2, 2);
    scene.add(model);
});

const fireTempleLoader = new GLTFLoader();
fireTempleLoader.load('models/fire_temple1/scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.x = -80;
    model.rotation.y = 45;
    model.position.z = -25;
    scene.add(model);
    model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
    })
});


// Flame Animated
let flameMixer;
const fireLoader = new GLTFLoader();
fireLoader.load('models/fire_animation/scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.position.x = -80;
    model.position.y = 80;
    model.position.z = -25;
    model.scale.set(10, 10, 10);
    scene.add(model);

    const animations = gltf.animations;
    if (animations && animations.length) {
        flameMixer = new THREE.AnimationMixer(model);
        animations.forEach((clip) => {
            const action = flameMixer.clipAction(clip);
            action.play();
        });
        model.flameMixer = flameMixer;
    }
});


// Set up grass cube
const cubeGeometry = new THREE.BoxGeometry(11, 10, 11);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    roughness: 0.7,
    metalness: 0.5,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Set up animated grass on top of the cube
const grassGeometry = new THREE.CylinderGeometry(0.01, 0.05, 6, 4); // Adjust parameters for pointy and thin grass
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const grassCount = 2000;
const grassGroup = new THREE.Group();
for (let i = 0; i < grassCount; i++) {
  const grassBlade = new THREE.Mesh(grassGeometry, grassMaterial);
  grassBlade.castShadow = true;
  grassBlade.receiveShadow = true;
  const randomX = Math.random() * 10 - 5;
  const randomZ = Math.random() * 10 - 5;
  grassBlade.position.set(randomX, 5, randomZ);
  grassBlade.rotation.y = Math.PI / 2;
  grassGroup.add(grassBlade);
}
scene.add(grassGroup);


// LOD
function updateLOD(camera) {
    lodAirIsland.update(camera);
    // Not working properly
    // ... update other LOD objects as needed
}

// Animation
const clock = new THREE.Clock();
function animate() {
    const time = performance.now() * 0.001;
    const delta = clock.getDelta();

    // Grass Animation
    grassGroup.children.forEach((grassBlade, index) => {
        const time = Date.now() * 0.002;
        const rotationAngle = Math.sin(time + index * 0.1) * 0.1;
        grassBlade.rotation.z = rotationAngle;
    });

    // Flame Animation
    if (flameMixer) {
        flameMixer.update(delta);
    }
    controls.update(delta);

    // Water Animation
    water.material.uniforms['time'].value += 1.0 / 60.0;

    //Air Island and Temple Animation
    if (airTempleLoaded) {
        airIslandLoaded.scene.position.y += Math.sin(time) * 0.1;
        airTempleLoaded.scene.position.y += Math.sin(time) * 0.1;
    }

    stats.update();
    updateLOD(camera);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();


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
        animate();
    }, 2000);
}

loadAssets();
