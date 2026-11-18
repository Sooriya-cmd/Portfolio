/**
 * world.js — 3D Scene Graph, Lighting, Sky, and Greybox Props
 */

import * as THREE from 'three';
import { THEME } from '../config/theme.js';
import { cameraPositionCurve } from '../config/path.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.initLights();
    this.initSky();
    this.initGreyboxProps();

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

  initSky() {
    // Sky Dome with vertical gradient
    const skyGeo = new THREE.SphereGeometry(60, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(THEME.colors.skyDayZenith) },
        bottomColor: { value: new THREE.Color(THEME.colors.skyDayHorizon) },
        offset: { value: 5 },
        exponent: { value: 0.6 }
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

    this.sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.sky);
  }

  initGreyboxProps() {
    // Tall purple pole on the right anchor (x ≈ 3.6)
    const poleGeo = new THREE.CylinderGeometry(0.35, 0.35, 34, 16);
    const poleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(THEME.colors.polePurple),
      roughness: 0.4,
      metalness: 0.1
    });
    this.pole = new THREE.Mesh(poleGeo, poleMat);
    this.pole.position.set(3.6, -11, 0);
    this.group.add(this.pole);

    // Crossbar arms extending left from pole
    const crossbarGeo = new THREE.BoxGeometry(3.5, 0.15, 0.15);
    const crossbarMat = new THREE.MeshStandardMaterial({ color: 0x4B307B, roughness: 0.5 });
    
    // Top hero crossbar
    const heroCrossbar = new THREE.Mesh(crossbarGeo, crossbarMat);
    heroCrossbar.position.set(2.0, 2.5, 0);
    this.group.add(heroCrossbar);

    // Placeholder panel on the left (x ≈ -2.2)
    const panelGeo = new THREE.BoxGeometry(4.0, 2.5, 0.2);
    const panelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(THEME.colors.panelBg),
      roughness: 0.3
    });
    const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0x121324 });

    this.panelPlaceholder = new THREE.Mesh(panelGeo, panelMat);
    this.panelPlaceholder.position.set(-2.2, 2.2, 0);
    this.group.add(this.panelPlaceholder);
  }

  initDebugPath() {
    const points = cameraPositionCurve.getPoints(100);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0x2EE5EF, linewidth: 2 });
    this.debugPathLine = new THREE.Line(geo, mat);
    this.scene.add(this.debugPathLine);
  }

  update(progress = 0) {
    // Update sky or lights along progress if needed
  }
}
