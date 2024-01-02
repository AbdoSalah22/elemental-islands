// modelLoader.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export let airIslandLoaded;
export let flameMixer;
export let shipLoaded;
export let airPhoenixMixer;
export let firePhoenixMixer;
export let earthDragonMixer;
export let waterBirdMixer;
export let gyroscopeMixer;

export function loadModels(scene) {

    // Gyroscope
    const gyroscopeLoader = new GLTFLoader();
    gyroscopeLoader.load('models/gyroscope/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.position.y = 15;
        model.scale.set(20, 20, 20);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);

        const animations = gltf.animations;
        if (animations && animations.length) {
            gyroscopeMixer = new THREE.AnimationMixer(model);
            animations.forEach((clip) => {
                const action = gyroscopeMixer.clipAction(clip);
                action.play();
            });
            model.gyroscopeMixer = gyroscopeMixer;
        }
    });

  // Air Island
  const airIslandLoader = new GLTFLoader();
  airIslandLoader.load('models/air_island/scene.gltf', (gltf) => {
      airIslandLoaded = gltf;
      const model = gltf.scene;
      model.position.x = 70;
      model.position.y = 60;
      model.position.z = 10;
      model.scale.set(10, 10, 10);
      model.castShadow = true;
      model.receiveShadow = true;
      scene.add(model);
  });

  // Earth Island
  const earthIslandLoader = new GLTFLoader();
  earthIslandLoader.load('models/earth_island/scene.gltf', (gltf) => {
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
  waterIslandLoader.load('models/water_island/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.x = 40;
      model.position.y = -2.3;
      model.position.z = 100;
      model.rotation.y = 90;
      model.scale.set(50, 50, 50);
      scene.add(model);
  });

  // Fire Island
  const fireIslandLoader = new GLTFLoader();
  fireIslandLoader.load('models/fire_island/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.x = -80;
      model.position.y = -7;
      model.position.z = -80;
      model.rotation.y = 180;
      model.scale.set(2, 2, 2);
      model.receiveShadow = true;
      scene.add(model);
  });

  // Fire Temple
  const fireTempleLoader = new GLTFLoader();
  fireTempleLoader.load('models/fire_temple/scene.gltf', (gltf) => {
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
      });
  });

  // Flame Animated
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


  // Ship
  const shipLoader = new GLTFLoader();
  shipLoader.load('models/ship/scene.gltf', (gltf) => {
      shipLoaded = gltf;
      const model = gltf.scene;
      model.scale.set(15, 15, 15);
      scene.add(model);
  });


  // Air Phoenix Animated
  const airPhoenixLoader = new GLTFLoader();
  airPhoenixLoader.load('models/air_phoenix/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.x = 70;
      model.position.y = 120;
      model.position.z = 10;
      model.rotation.y = Math.PI;
      model.scale.set(0.05, 0.05, 0.05);
      scene.add(model);

      const animations = gltf.animations;
      if (animations && animations.length) {
        airPhoenixMixer = new THREE.AnimationMixer(model);
          animations.forEach((clip) => {
              const action = airPhoenixMixer.clipAction(clip);
              action.play();
          });
          model.airPhoenixMixer = airPhoenixMixer;
      }
  });

    // Fire Phoenix Animated
    const firePhoenixLoader = new GLTFLoader();
    firePhoenixLoader.load('models/fire_phoenix/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.position.x = -80;
        model.position.y = 100;
        model.position.z = -25;
        model.scale.set(15, 15, 15);
        scene.add(model);

        const animations = gltf.animations;
        if (animations && animations.length) {
            firePhoenixMixer = new THREE.AnimationMixer(model);
            animations.forEach((clip) => {
                const action = firePhoenixMixer.clipAction(clip);
                action.play();
            });
            model.firePhoenixMixer = firePhoenixMixer;
        }
    });

    // Earth Dragon
    const earthDragonLoader = new GLTFLoader();
    earthDragonLoader.load('models/earth_dragon/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.position.x = -80;
        model.position.y = 10;
        model.position.z = 80;
        model.rotation.y = Math.PI / 2;
        model.scale.set(0.25, 0.25, 0.25);
        scene.add(model);

        const animations = gltf.animations;
        if (animations && animations.length) {
            earthDragonMixer = new THREE.AnimationMixer(model);
            animations.forEach((clip) => {
                const action = earthDragonMixer.clipAction(clip);
                action.play();
            });
            model.earthDragonMixer = earthDragonMixer;
        }
    });

    // Water Bird
    const waterBirdLoader = new GLTFLoader();
    waterBirdLoader.load('models/water_bird/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.position.x = 15;
        model.position.y = 0;
        model.position.z = 75;
        model.rotation.y = 2.5 * Math.PI / 4;
        model.scale.set(4, 4, 4);
        scene.add(model);

        const animations = gltf.animations;
        if (animations && animations.length) {
            waterBirdMixer = new THREE.AnimationMixer(model);
            animations.forEach((clip) => {
                const action = waterBirdMixer.clipAction(clip);
                action.play();
            });
            model.waterBirdMixer = waterBirdMixer;
        }
    });
}