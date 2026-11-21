/**
 * createScene.js — Three.js Renderer, Lifecycle, Resize, and Animation Loop
 */

import * as THREE from 'three';
import { CameraRig } from './cameraRig.js';
import { World } from './world.js';
import { initBirdRaycasting } from './birds.js';
import { THEME } from '../config/theme.js';

export function createScene(container) {
  if (!container) return null;

  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(THEME.colors.skyDayHorizon, 0.018);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: THEME.quality.antialias,
    powerPreference: 'high-performance',
    alpha: false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, THEME.quality.maxPixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  container.appendChild(renderer.domElement);

  // Subsystems
  const cameraRig = new CameraRig(camera);
  const world = new World(scene);
  initBirdRaycasting(world.birds, camera);

  // Animation Loop State
  let animationFrameId = null;
  const clock = new THREE.Clock();
  let isRunning = true;

  function animate() {
    if (!isRunning) return;
    animationFrameId = requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    cameraRig.update(deltaTime, elapsedTime);
    world.update(cameraRig.progress, deltaTime, elapsedTime);

    renderer.render(scene, camera);
  }

  animate();

  // Resize Listener
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, THEME.quality.maxPixelRatio));
  }

  window.addEventListener('resize', onResize);

  // Handle Tab Visibility (Pause/Throttle Rendering)
  function onVisibilityChange() {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      if (!isRunning) {
        isRunning = true;
        clock.getDelta(); // reset clock jump
        animate();
      }
    }
  }

  document.addEventListener('visibilitychange', onVisibilityChange);

  // Teardown Method
  function destroy() {
    isRunning = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  return {
    scene,
    camera,
    renderer,
    cameraRig,
    world,
    destroy
  };
}
