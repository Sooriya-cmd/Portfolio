/**
 * dayNight.js — Day-to-Night Sky Transitions, Dynamic Fog, Starfield, and Moon
 */

import * as THREE from 'three';
import { THEME } from '../config/theme.js';

export class DayNightCycle {
  constructor(scene) {
    this.scene = scene;

    // Day, Dusk, Night Color Palettes
    this.dayTop = new THREE.Color(THEME.colors.skyDayZenith);
    this.dayBottom = new THREE.Color(THEME.colors.skyDayHorizon);
    
    this.duskTop = new THREE.Color(THEME.colors.skyDuskZenith);
    this.duskBottom = new THREE.Color(THEME.colors.skyDuskHorizon);

    this.nightTop = new THREE.Color(THEME.colors.skyNightZenith);
    this.nightBottom = new THREE.Color(THEME.colors.skyNightHorizon);

    this.currentTop = new THREE.Color();
    this.currentBottom = new THREE.Color();

    this.initSky();
    this.initStars();
    this.initMoon();
  }

  initSky() {
    const skyGeo = new THREE.SphereGeometry(70, 32, 16);
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: this.dayTop.clone() },
        bottomColor: { value: this.dayBottom.clone() },
        offset: { value: 8.0 },
        exponent: { value: 0.65 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    this.skyMesh = new THREE.Mesh(skyGeo, this.skyMat);
    this.scene.add(this.skyMesh);
  }

  initStars(count = 250) {
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute stars mostly in upper hemisphere and night scene depths
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = 10 - Math.random() * 40;
      positions[i * 3 + 2] = -15 - Math.random() * 25;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.starMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.25,
      transparent: true,
      opacity: 0.0
    });

    this.stars = new THREE.Points(starGeo, this.starMat);
    this.scene.add(this.stars);
  }

  initMoon() {
    // Moon disc placed near the ending scene
    const moonGeo = new THREE.CircleGeometry(1.8, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xFFF3C4,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide
    });
    this.moon = new THREE.Mesh(moonGeo, moonMat);
    this.moon.position.set(5.5, -23.0, -10);
    this.scene.add(this.moon);
  }

  update(progress = 0, dirLight, hemiLight) {
    // Interpolate colors across daylight -> dusk -> night
    if (progress < 0.4) {
      // Pure daylight
      this.currentTop.copy(this.dayTop);
      this.currentBottom.copy(this.dayBottom);
      this.starMat.opacity = 0;
      this.moon.material.opacity = 0;
    } else if (progress < 0.75) {
      // Daylight to Dusk transition
      const t = (progress - 0.4) / 0.35;
      this.currentTop.copy(this.dayTop).lerp(this.duskTop, t);
      this.currentBottom.copy(this.dayBottom).lerp(this.duskBottom, t);
      this.starMat.opacity = t * 0.4;
      this.moon.material.opacity = t * 0.3;
    } else {
      // Dusk to Deep Night transition
      const t = (progress - 0.75) / 0.25;
      this.currentTop.copy(this.duskTop).lerp(this.nightTop, t);
      this.currentBottom.copy(this.duskBottom).lerp(this.nightBottom, t);
      this.starMat.opacity = 0.4 + t * 0.6;
      this.moon.material.opacity = 0.3 + t * 0.7;
    }

    this.skyMat.uniforms.topColor.value.copy(this.currentTop);
    this.skyMat.uniforms.bottomColor.value.copy(this.currentBottom);

    // Adjust light intensities
    if (dirLight) {
      dirLight.intensity = Math.max(1.5 - progress * 1.0, 0.5);
    }
    if (hemiLight) {
      hemiLight.intensity = Math.max(1.2 - progress * 0.6, 0.6);
    }
  }
}
