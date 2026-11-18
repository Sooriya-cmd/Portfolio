/**
 * birds.js — Procedural Bird Mascot Builder, Accessories, and Idle Animations
 */

import * as THREE from 'three';

/**
 * Creates an individual procedural bird mascot mesh
 */
export function createBird({
  bodyColor = 0xFFFFFF,
  beakColor = 0xFFA500,
  accessory = 'none', // 'none' | 'sunglasses' | 'blue-cap' | 'black-cap' | 'lavender-hat' | 'party-hat' | 'headband'
  scale = 1.0,
  idlePhase = 0
}) {
  const bird = new THREE.Group();
  bird.scale.setScalar(scale);

  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.35,
    metalness: 0.05
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x11111E });
  const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const beakMat = new THREE.MeshStandardMaterial({ color: beakColor, roughness: 0.3 });
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xFF85A1 });
  const feetMat = new THREE.MeshStandardMaterial({ color: 0xFFA500, roughness: 0.4 });

  // 1. Body (Egg-shaped sphere)
  const bodyGeo = new THREE.SphereGeometry(0.38, 20, 16);
  bodyGeo.scale(1.0, 1.15, 1.0);
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.y = 0.38;
  bird.add(bodyMesh);

  // 2. Eyes (Black vertical ovals with highlights)
  const eyeGeo = new THREE.SphereGeometry(0.045, 12, 10);
  eyeGeo.scale(0.8, 1.4, 0.4);

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.11, 0.48, 0.34);
  bird.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.11, 0.48, 0.34);
  bird.add(rightEye);

  // Eye highlights
  const highlightGeo = new THREE.SphereGeometry(0.015, 8, 8);
  const leftHighlight = new THREE.Mesh(highlightGeo, eyeHighlightMat);
  leftHighlight.position.set(-0.10, 0.51, 0.36);
  bird.add(leftHighlight);

  const rightHighlight = new THREE.Mesh(highlightGeo, eyeHighlightMat);
  rightHighlight.position.set(0.12, 0.51, 0.36);
  bird.add(rightHighlight);

  // 3. Beak (Small conical pyramid)
  const beakGeo = new THREE.ConeGeometry(0.065, 0.12, 4);
  const beakMesh = new THREE.Mesh(beakGeo, beakMat);
  beakMesh.rotation.x = Math.PI / 2;
  beakMesh.position.set(0, 0.40, 0.42);
  bird.add(beakMesh);

  // 4. Blush Cheeks (Pink discs)
  const blushGeo = new THREE.CircleGeometry(0.045, 12);
  const leftBlush = new THREE.Mesh(blushGeo, blushMat);
  leftBlush.position.set(-0.20, 0.41, 0.32);
  leftBlush.rotation.y = -Math.PI / 6;
  bird.add(leftBlush);

  const rightBlush = new THREE.Mesh(blushGeo, blushMat);
  rightBlush.position.set(0.20, 0.41, 0.32);
  rightBlush.rotation.y = Math.PI / 6;
  bird.add(rightBlush);

  // 5. Wings (Curved side flappers)
  const wingGeo = new THREE.SphereGeometry(0.18, 12, 10);
  wingGeo.scale(0.4, 1.0, 1.3);

  const leftWing = new THREE.Mesh(wingGeo, bodyMat);
  leftWing.position.set(-0.36, 0.36, 0.02);
  leftWing.rotation.z = Math.PI / 12;
  bird.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, bodyMat);
  rightWing.position.set(0.36, 0.36, 0.02);
  rightWing.rotation.z = -Math.PI / 12;
  bird.add(rightWing);

  // 6. Feet (Small perching claws)
  const footGeo = new THREE.BoxGeometry(0.06, 0.04, 0.12);
  const leftFoot = new THREE.Mesh(footGeo, feetMat);
  leftFoot.position.set(-0.12, 0.02, 0.06);
  bird.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, feetMat);
  rightFoot.position.set(0.12, 0.02, 0.06);
  bird.add(rightFoot);

  // 7. Optional Accessories
  if (accessory === 'sunglasses') {
    const glassesGroup = new THREE.Group();
    const glassFrameMat = new THREE.MeshBasicMaterial({ color: 0x05050A });
    const lensGeo = new THREE.BoxGeometry(0.13, 0.08, 0.03);
    
    const leftGlass = new THREE.Mesh(lensGeo, glassFrameMat);
    leftGlass.position.set(-0.12, 0.48, 0.38);
    glassesGroup.add(leftGlass);

    const rightGlass = new THREE.Mesh(lensGeo, glassFrameMat);
    rightGlass.position.set(0.12, 0.48, 0.38);
    glassesGroup.add(rightGlass);

    const bridgeGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
    const bridge = new THREE.Mesh(bridgeGeo, glassFrameMat);
    bridge.position.set(0, 0.48, 0.38);
    glassesGroup.add(bridge);

    bird.add(glassesGroup);
  } else if (accessory === 'blue-cap') {
    const capGroup = new THREE.Group();
    const capMat = new THREE.MeshStandardMaterial({ color: 0x2A69E8, roughness: 0.4 });
    const domeGeo = new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, capMat);
    dome.position.set(0, 0.65, 0);
    capGroup.add(dome);

    // Turned backward brim
    const brimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16, 1, false, 0, Math.PI);
    const brim = new THREE.Mesh(brimGeo, capMat);
    brim.rotation.x = -Math.PI / 6;
    brim.position.set(0, 0.68, -0.15);
    capGroup.add(brim);

    bird.add(capGroup);
  } else if (accessory === 'black-cap') {
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1A1A24, roughness: 0.3 });
    const domeGeo = new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, capMat);
    dome.position.set(0, 0.65, 0.02);
    bird.add(dome);
  } else if (accessory === 'lavender-hat') {
    const hatGroup = new THREE.Group();
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xB8A2E8, roughness: 0.4 });
    
    // Crown
    const crownGeo = new THREE.CylinderGeometry(0.20, 0.22, 0.22, 16);
    const crown = new THREE.Mesh(crownGeo, hatMat);
    crown.position.set(0, 0.74, 0);
    hatGroup.add(crown);

    // Brim
    const brimGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.03, 20);
    const brim = new THREE.Mesh(brimGeo, hatMat);
    brim.position.set(0, 0.64, 0);
    hatGroup.add(brim);

    bird.add(hatGroup);
  } else if (accessory === 'party-hat') {
    const hatGeo = new THREE.ConeGeometry(0.14, 0.38, 16);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xFF3366, roughness: 0.3 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 0.82, 0);
    hat.rotation.z = -Math.PI / 16;
    bird.add(hat);
  }

  // Animation State and update hook
  bird.userData = {
    idlePhase,
    initialY: 0,
    update: (time) => {
      // Gentle breathing bobbing
      const bob = Math.sin(time * 2.2 + idlePhase) * 0.025;
      bird.position.y = bird.userData.initialY + bob;

      // Slight head / body tilt
      bird.rotation.z = Math.sin(time * 1.4 + idlePhase) * 0.03;

      // Periodic blink (every ~4 seconds)
      const blinkCycle = (time + idlePhase) % 4.0;
      if (blinkCycle < 0.15) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
      } else {
        leftEye.scale.y = 1.0;
        rightEye.scale.y = 1.0;
      }
    }
  };

  return bird;
}

/**
 * Places the complete flock of birds across Bird Street props and crossbars
 */
export function populateSceneBirds(worldGroup) {
  const birdsList = [];

  // 1. The 7 Birds on Hero Crossbar (matching Screenshot 02!)
  const heroCrossbarY = 3.32;
  const heroBirdsConfig = [
    { x: 0.35, accessory: 'none', scale: 0.95 },
    { x: 0.85, accessory: 'black-cap', scale: 0.95 },
    { x: 1.35, accessory: 'blue-cap', scale: 0.95 },
    { x: 1.85, accessory: 'sunglasses', scale: 0.95 },
    { x: 2.35, accessory: 'none', scale: 0.90 },
    { x: 2.85, accessory: 'sunglasses', scale: 0.95 },
    { x: 3.35, accessory: 'lavender-hat', scale: 0.95 }
  ];

  heroBirdsConfig.forEach((cfg, idx) => {
    const bird = createBird({
      accessory: cfg.accessory,
      scale: cfg.scale,
      idlePhase: idx * 0.7
    });
    bird.position.set(cfg.x, heroCrossbarY, 0.15);
    bird.userData.initialY = heroCrossbarY;
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 2. Two Birds on ABOUT Highway Sign (y ≈ 1.1)
  const aboutBirds = [
    { x: 2.3, y: 1.12, accessory: 'sunglasses' },
    { x: 2.9, y: 1.12, accessory: 'none' }
  ];
  aboutBirds.forEach((b, i) => {
    const bird = createBird({ accessory: b.accessory, scale: 0.85, idlePhase: i + 2.0 });
    bird.position.set(b.x, b.y, 0.4);
    bird.userData.initialY = b.y;
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 3. Four Birds on PROJECTS Arrow Sign (y ≈ -6.4)
  const projBirds = [
    { x: 1.4, y: -6.42, accessory: 'party-hat' },
    { x: 1.9, y: -6.42, accessory: 'blue-cap' },
    { x: 2.4, y: -6.42, accessory: 'none' },
    { x: 2.9, y: -6.42, accessory: 'sunglasses' }
  ];
  projBirds.forEach((b, i) => {
    const bird = createBird({ accessory: b.accessory, scale: 0.85, idlePhase: i * 0.8 });
    bird.position.set(b.x, b.y, 0.4);
    bird.userData.initialY = b.y;
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 4. Three Birds on Contacts Sign (y ≈ -22.1)
  const contactBirds = [
    { x: 2.3, y: -22.18, accessory: 'none' },
    { x: 2.8, y: -22.18, accessory: 'sunglasses' },
    { x: 3.3, y: -22.18, accessory: 'lavender-hat' }
  ];
  contactBirds.forEach((b, i) => {
    const bird = createBird({ accessory: b.accessory, scale: 0.85, idlePhase: i * 0.9 });
    bird.position.set(b.x, b.y, 0.4);
    bird.userData.initialY = b.y;
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 5. Birds at the Finale Night Party (y ≈ -25.0)
  const finaleBirds = [
    { x: 1.8, y: -24.8, accessory: 'sunglasses' },
    { x: 2.3, y: -24.8, accessory: 'none' },
    { x: 2.8, y: -24.8, accessory: 'party-hat' }
  ];
  finaleBirds.forEach((b, i) => {
    const bird = createBird({ accessory: b.accessory, scale: 0.85, idlePhase: i * 1.1 });
    bird.position.set(b.x, b.y, 0.3);
    bird.userData.initialY = b.y;
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  return birdsList;
}
