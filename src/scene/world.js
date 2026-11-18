/**
 * world.js — 3D Scene Graph, Lighting, Environment Props, Signals, Birds, and Sky
 */

import * as THREE from 'three';
import { createUtilityPole } from './pole.js';
import { createWires } from './wires.js';
import { createTrafficSignal, createJackpotSignal } from './signals.js';
import { populateSceneBirds } from './birds.js';
import { CloudsField } from './clouds.js';
import { DayNightCycle } from './dayNight.js';
import { cameraPositionCurve } from '../config/path.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.initLights();
    this.dayNight = new DayNightCycle(this.scene);
    this.initProps();
    this.birds = populateSceneBirds(this.group);
    this.clouds = new CloudsField(this.scene, 16);

    // Dev-only debug path curve
    if (import.meta.env.DEV) {
      this.initDebugPath();
    }
  }

  initLights() {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 1.2);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff7e6, 1.5);
    this.dirLight.position.set(5, 10, 7);
    this.scene.add(this.dirLight);
  }

  initProps() {
    // 1. Utility pole with stickers and signs
    const { group: poleGroup, heroCrossbar } = createUtilityPole();
    this.group.add(poleGroup);
    this.pole = poleGroup;

    // 2. Traffic Signal suspended under hero crossbar (x ≈ 1.8, y ≈ 2.5)
    this.trafficSignal = createTrafficSignal();
    this.trafficSignal.position.set(1.8, 2.3, 0.1);
    this.group.add(this.trafficSignal);

    // 3. Jackpot Signal at More Projects milestone (x ≈ 2.2, y ≈ -19.2)
    this.jackpotSignal = createJackpotSignal();
    this.jackpotSignal.position.set(2.2, -19.0, 0.2);
    this.group.add(this.jackpotSignal);

    // 4. Sagging catenary wires
    this.wires = createWires();
    this.group.add(this.wires);
  }

  initDebugPath() {
    const points = cameraPositionCurve.getPoints(100);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0x2EE5EF, linewidth: 2 });
    this.debugPathLine = new THREE.Line(geo, mat);
    this.scene.add(this.debugPathLine);
  }

  update(progress = 0, deltaTime = 0.016, elapsedTime = 0) {
    // Update drifting clouds
    if (this.clouds) {
      this.clouds.update(deltaTime);
    }

    // Update birds idle breathing, tilt, and blinking
    if (this.birds && this.birds.length > 0) {
      this.birds.forEach(bird => {
        if (bird.userData && bird.userData.update) {
          bird.userData.update(elapsedTime);
        }
      });
    }

    // Update day-night transitions
    if (this.dayNight) {
      this.dayNight.update(progress, this.dirLight, this.hemiLight);
    }
  }
}
