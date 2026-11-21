/**
 * skyProps.js — Animated Stylized Morning Airplanes and Night Miniature UFOs
 * Matches the Sky Street retro-pop aesthetic and day/night transitions (Requirement 8)
 */

import * as THREE from 'three';

export class SkyProps {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createMorningPlane();
    this.createNightUfo();
  }

  createMorningPlane() {
    this.plane = new THREE.Group();

    // 1. Fuselage (Rounded sleek body)
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.4, 16);
    bodyGeo.rotateZ(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.3,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.plane.add(body);

    // Nose cone (Cyan accent)
    const noseGeo = new THREE.ConeGeometry(0.18, 0.45, 16);
    noseGeo.rotateZ(-Math.PI / 2);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x2EE5EF, roughness: 0.3 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0.9, 0, 0);
    this.plane.add(nose);

    // 2. Wings (Yellow pop accent)
    const wingGeo = new THREE.BoxGeometry(0.45, 0.04, 2.2);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xFFD21F, roughness: 0.3 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0.1, 0.02, 0);
    this.plane.add(wings);

    // 3. Tail Fin (Pink pop accent)
    const finGeo = new THREE.BoxGeometry(0.3, 0.35, 0.04);
    const finMat = new THREE.MeshStandardMaterial({ color: 0xFF4F92, roughness: 0.3 });
    const fin = new THREE.Mesh(finGeo, finMat);
    fin.position.set(-0.6, 0.22, 0);
    this.plane.add(fin);

    // Tail horizontal stabilizer
    const stabGeo = new THREE.BoxGeometry(0.2, 0.03, 0.7);
    const stab = new THREE.Mesh(stabGeo, wingMat);
    stab.position.set(-0.65, 0.05, 0);
    this.plane.add(stab);

    // 4. Spinning Propeller
    const propGroup = new THREE.Group();
    const propGeo = new THREE.BoxGeometry(0.04, 0.55, 0.06);
    const propMat = new THREE.MeshStandardMaterial({ color: 0x11111E, roughness: 0.2 });
    const propBlade = new THREE.Mesh(propGeo, propMat);
    propGroup.add(propBlade);
    propGroup.position.set(1.13, 0, 0);
    this.plane.add(propGroup);
    this.propeller = propGroup;

    // Initial position in morning sky (Hero to Skills altitude)
    this.planeBaseY = 4.8;
    this.plane.position.set(-16, this.planeBaseY, -8.5);
    this.plane.scale.setScalar(0.75);

    this.group.add(this.plane);
  }

  createNightUfo() {
    this.ufo = new THREE.Group();

    // 1. Saucer Rim (Metallic Purple / Slate)
    const rimGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 24);
    rimGeo.scale(1.0, 0.6, 1.0);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x584382,
      metalness: 0.6,
      roughness: 0.25
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    this.ufo.add(rim);

    // 2. Glowing Glass Dome (Cyan Emissive)
    const domeGeo = new THREE.SphereGeometry(0.55, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x2EE5EF,
      emissive: 0x2EE5EF,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.88
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 0.08, 0);
    this.ufo.add(dome);

    // 3. Pulsing Neon Perimeter Lights
    this.ufoLeds = [];
    const ledCount = 8;
    for (let i = 0; i < ledCount; i++) {
      const angle = (i / ledCount) * Math.PI * 2;
      const ledGeo = new THREE.SphereGeometry(0.07, 10, 10);
      const ledMat = new THREE.MeshStandardMaterial({
        color: (i % 2 === 0) ? 0x28E070 : 0xFFD21F,
        emissive: (i % 2 === 0) ? 0x28E070 : 0xFFD21F,
        emissiveIntensity: 1.0
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(Math.cos(angle) * 1.15, -0.02, Math.sin(angle) * 1.15);
      this.ufo.add(led);
      this.ufoLeds.push(led);
    }

    // 4. Soft Conical Tractor / Abduction Light Beam
    const beamGeo = new THREE.ConeGeometry(1.5, 3.5, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x2EE5EF,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, -1.8, 0);
    this.ufo.add(beam);

    // Initial position in nighttime sky (Contacts to Ending altitude)
    this.ufoBaseY = -23.5;
    this.ufo.position.set(16, this.ufoBaseY, -7.5);
    this.ufo.scale.setScalar(0.7);

    this.group.add(this.ufo);
  }

  update(progress = 0, deltaTime = 0.016, elapsedTime = 0) {
    // 1. Morning Plane Behavior (Visible during daylight, progress < 0.52)
    const isDay = progress < 0.52;
    this.plane.visible = isDay;

    if (isDay) {
      // Fly across the sky from left to right (-18 to +18)
      const planeSpeed = 2.4;
      this.plane.position.x += planeSpeed * deltaTime;
      if (this.plane.position.x > 18) {
        this.plane.position.x = -18;
      }

      // Gentle flight cruising wave
      this.plane.position.y = this.planeBaseY + Math.sin(elapsedTime * 1.8) * 0.15;
      this.plane.rotation.z = Math.sin(elapsedTime * 1.8) * 0.04;

      // Spin propeller rapidly
      if (this.propeller) {
        this.propeller.rotation.x += deltaTime * 55;
      }
    }

    // 2. Night UFO Behavior (Visible during dusk and night, progress > 0.58)
    const isNight = progress > 0.58;
    this.ufo.visible = isNight;

    if (isNight) {
      // Glide silently across the starry night sky from right to left (18 to -18)
      const ufoSpeed = 1.6;
      this.ufo.position.x -= ufoSpeed * deltaTime;
      if (this.ufo.position.x < -18) {
        this.ufo.position.x = 18;
      }

      // Alien levitation wobble
      this.ufo.position.y = this.ufoBaseY + Math.sin(elapsedTime * 2.5) * 0.22;
      this.ufo.rotation.z = Math.sin(elapsedTime * 3.2) * 0.08;
      this.ufo.rotation.y = elapsedTime * 0.8;

      // Pulse neon LEDs
      this.ufoLeds.forEach((led, idx) => {
        const pulse = 0.6 + Math.sin(elapsedTime * 6.0 + idx * 0.8) * 0.4;
        led.material.emissiveIntensity = pulse;
      });
    }
  }
}
