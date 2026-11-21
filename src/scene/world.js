/**
 * world.js — 3D Scene Graph, Lighting, Environment Props, Signals, Birds, and Sky
 */

import * as THREE from 'three';
import { createUtilityPole } from './pole.js';
import { createWires } from './wires.js';
import { createTrafficSignal, createJackpotSignal, createSnakeArcadeBox, createFinalePartyProps } from './signals.js';
import { populateSceneBirds } from './birds.js';
import { CloudsField } from './clouds.js';
import { DayNightCycle } from './dayNight.js';
import { SkyProps } from './skyProps.js';
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
    const { group: poleGroup } = createUtilityPole();
    this.group.add(poleGroup);
    this.pole = poleGroup;

    // 2. Traffic Signal suspended under hero crossbar (x ≈ 1.8, y ≈ 2.3)
    this.trafficSignal = createTrafficSignal();
    this.trafficSignal.position.set(1.8, 2.3, 0.1);
    this.group.add(this.trafficSignal);

    // 3. Jackpot Signal at More Projects milestone (x ≈ 2.0, y ≈ -17.8; well separated from artstationSign at y = -19.6)
    this.jackpotSignal = createJackpotSignal();
    this.jackpotSignal.position.set(2.0, -17.8, 0.2);
    this.group.add(this.jackpotSignal);

    // 4. Snake Arcade Box at Contacts milestone (x ≈ 1.8, y ≈ -22.5)
    this.snakeArcade = createSnakeArcadeBox();
    this.snakeArcade.position.set(1.8, -22.5, 0.2);
    this.group.add(this.snakeArcade);

    // 5. Finale Party Props (Disco Ball, Bunting, Loudspeakers) at The End (x ≈ 1.8, y ≈ -25.2)
    this.finaleProps = createFinalePartyProps();
    this.finaleProps.position.set(1.8, -25.2, 0);
    this.group.add(this.finaleProps);

    // 6. Sagging catenary wires
    this.wires = createWires();
    this.group.add(this.wires);

    // 7. Sky props (Animated morning plane & night UFO)
    this.skyProps = new SkyProps(this.scene);
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

    // Update traffic signal LED pulses
    if (this.trafficSignal && this.trafficSignal.userData && this.trafficSignal.userData.update) {
      this.trafficSignal.userData.update(elapsedTime);
    }

    // Update Jackpot signal pulses
    if (this.jackpotSignal && this.jackpotSignal.userData && this.jackpotSignal.userData.update) {
      this.jackpotSignal.userData.update(elapsedTime);
    }

    // Update Pole street lamp warm glow & signs micro-settling
    if (this.pole && this.pole.userData && this.pole.userData.update) {
      this.pole.userData.update(elapsedTime, progress);
    }

    // Update Snake arcade screen
    if (this.snakeArcade && this.snakeArcade.userData && this.snakeArcade.userData.update) {
      this.snakeArcade.userData.update(elapsedTime);
    }

    // Update Finale Disco Ball
    if (this.finaleProps && this.finaleProps.userData && this.finaleProps.userData.update) {
      this.finaleProps.userData.update(elapsedTime);
    }

    // Update animated sky props (Plane & UFO)
    if (this.skyProps) {
      this.skyProps.update(progress, deltaTime, elapsedTime);
    }

    // Update day-night transitions
    if (this.dayNight) {
      this.dayNight.update(progress, this.dirLight, this.hemiLight);
    }
  }
}
