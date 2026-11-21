/**
 * birds.js — Procedural Bird Mascot Builder, Accessories, Spacing, and Interactive Flight
 */

import * as THREE from 'three';

/**
 * Creates an individual procedural bird mascot mesh
 */
export function createBird({
  bodyColor = 0xFFFFFF,
  beakColor = 0xFFA500,
  accessory = 'none', // 'none' | 'sunglasses' | 'blue-cap' | 'black-cap' | 'lavender-hat' | 'party-hat' | 'headband'
  scale = 0.82,
  idlePhase = 0,
  index = 0
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
    
    const crownGeo = new THREE.CylinderGeometry(0.20, 0.22, 0.22, 16);
    const crown = new THREE.Mesh(crownGeo, hatMat);
    crown.position.set(0, 0.74, 0);
    hatGroup.add(crown);

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

  // Calculate unique flight trajectory directions per bird index to prevent collisions
  const dirSign = (index % 2 === 0) ? -1 : 1;
  const flightVector = {
    x: dirSign * (0.85 + (index % 4) * 0.3),
    y: 1.1 + (index % 3) * 0.35,
    z: 0.5 + (index % 2) * 0.3
  };

  // Animation & Interactive State
  bird.userData = {
    isBird: true,
    index,
    idlePhase,
    initialY: 0,
    originalPos: new THREE.Vector3(),
    leftWing,
    rightWing,
    leftEye,
    rightEye,
    isFlying: false,
    flightStartTime: 0,
    flightDuration: 2.5,
    flightVector,

    update: (time) => {
      // 1. Handle Active Flight Animation
      if (bird.userData.isFlying) {
        const elapsed = (performance.now() - bird.userData.flightStartTime) / 1000;
        const dur = bird.userData.flightDuration;

        if (elapsed < dur) {
          const p = elapsed / dur; // 0 to 1
          // Smooth parabolic arc for height: peak at p = 0.5
          const heightArc = Math.sin(p * Math.PI);
          // Outward travel and return arc
          const lateralArc = Math.sin(p * Math.PI);

          const orig = bird.userData.originalPos;
          bird.position.x = orig.x + flightVector.x * lateralArc;
          bird.position.y = orig.y + flightVector.y * heightArc;
          bird.position.z = orig.z + flightVector.z * lateralArc;

          // Rapid wing flapping during flight (fluttering wings)
          const flap = Math.sin(elapsed * 42) * 0.75;
          leftWing.rotation.z = Math.PI / 12 + flap;
          rightWing.rotation.z = -Math.PI / 12 - flap;

          // Bird tilts slightly towards flight heading
          bird.rotation.z = -flightVector.x * 0.22 * lateralArc;
          bird.rotation.x = -0.2 * Math.cos(p * Math.PI);
          return;
        } else {
          // Flight completed: smoothly settle back to original perch
          bird.userData.isFlying = false;
          bird.position.copy(bird.userData.originalPos);
          bird.rotation.set(0, 0, 0);
          leftWing.rotation.z = Math.PI / 12;
          rightWing.rotation.z = -Math.PI / 12;
        }
      }

      // 2. Idle State (Natural breathing bobbing, head tilt, and irregular blinking)
      const bob = Math.sin(time * 2.0 + idlePhase) * 0.018;
      bird.position.y = bird.userData.initialY + bob;

      bird.rotation.z = Math.sin(time * 1.3 + idlePhase) * 0.02;
      bird.rotation.x = Math.sin(time * 1.0 + idlePhase) * 0.015;

      // Natural blink at irregular intervals per bird (Requirement 9)
      const blinkCycle = 3.2 + (index % 5) * 0.8;
      const phase = (time + idlePhase) % blinkCycle;
      if (phase < 0.12) {
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
 * Triggers an independent flight sequence for a specific bird
 */
export function triggerBirdFlight(bird) {
  if (!bird || !bird.userData || bird.userData.isFlying) return;
  bird.userData.isFlying = true;
  bird.userData.flightStartTime = performance.now();
}

/**
 * Places the complete flock of birds across Bird Street props and crossbars
 * Ensuring visible gaps and preventing intersections between neighboring birds
 */
export function populateSceneBirds(worldGroup) {
  const birdsList = [];

  // 1. The 7 Birds on Hero Crossbar (Symmetrically center-aligned around x = 2.55, y = 3.32)
  // Perfectly spaced at delta-x = 0.52 with scale 0.78, clear of context box on left and pole on right
  const heroCrossbarY = 3.32;
  const heroBirdsConfig = [
    { x: 0.99, accessory: 'none' },
    { x: 1.51, accessory: 'black-cap' },
    { x: 2.03, accessory: 'blue-cap' },
    { x: 2.55, accessory: 'sunglasses' },
    { x: 3.07, accessory: 'none' },
    { x: 3.59, accessory: 'sunglasses' },
    { x: 4.11, accessory: 'lavender-hat' }
  ];

  heroBirdsConfig.forEach((cfg, idx) => {
    const bird = createBird({
      accessory: cfg.accessory,
      scale: 0.78,
      idlePhase: idx * 0.7,
      index: idx
    });
    bird.position.set(cfg.x, heroCrossbarY, 0.15);
    bird.userData.initialY = heroCrossbarY;
    bird.userData.originalPos.copy(bird.position);
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 2. Two Birds on ABOUT Highway Sign (Symmetrically center-aligned around x = 2.90, y = 1.12)
  const aboutBirds = [
    { x: 2.62, y: 1.12, accessory: 'sunglasses' },
    { x: 3.18, y: 1.12, accessory: 'none' }
  ];
  aboutBirds.forEach((b, i) => {
    const bird = createBird({
      accessory: b.accessory,
      scale: 0.75,
      idlePhase: i + 2.0,
      index: 7 + i
    });
    bird.position.set(b.x, b.y, 0.4);
    bird.userData.initialY = b.y;
    bird.userData.originalPos.copy(bird.position);
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 3. Four Birds on PROJECTS Arrow Sign (Symmetrically center-aligned around x = 2.95, y = -6.42)
  const projBirds = [
    { x: 2.12, y: -6.42, accessory: 'party-hat' },
    { x: 2.67, y: -6.42, accessory: 'blue-cap' },
    { x: 3.22, y: -6.42, accessory: 'none' },
    { x: 3.77, y: -6.42, accessory: 'sunglasses' }
  ];
  projBirds.forEach((b, i) => {
    const bird = createBird({
      accessory: b.accessory,
      scale: 0.75,
      idlePhase: i * 0.8,
      index: 9 + i
    });
    bird.position.set(b.x, b.y, 0.4);
    bird.userData.initialY = b.y;
    bird.userData.originalPos.copy(bird.position);
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 4. Three Birds on Contacts Sign (Symmetrically center-aligned around x = 2.90, y = -22.18)
  const contactBirds = [
    { x: 2.35, y: -22.18, accessory: 'none' },
    { x: 2.90, y: -22.18, accessory: 'sunglasses' },
    { x: 3.45, y: -22.18, accessory: 'lavender-hat' }
  ];
  contactBirds.forEach((b, i) => {
    const bird = createBird({
      accessory: b.accessory,
      scale: 0.75,
      idlePhase: i * 0.9,
      index: 13 + i
    });
    bird.position.set(b.x, b.y, 0.4);
    bird.userData.initialY = b.y;
    bird.userData.originalPos.copy(bird.position);
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  // 5. Three Birds at the Finale Night Party (Symmetrically center-aligned around x = 2.50, y = -24.8)
  const finaleBirds = [
    { x: 1.80, y: -24.8, accessory: 'sunglasses' },
    { x: 2.50, y: -24.8, accessory: 'none' },
    { x: 3.20, y: -24.8, accessory: 'party-hat' }
  ];
  finaleBirds.forEach((b, i) => {
    const bird = createBird({
      accessory: b.accessory,
      scale: 0.75,
      idlePhase: i * 1.1,
      index: 16 + i
    });
    bird.position.set(b.x, b.y, 0.3);
    bird.userData.initialY = b.y;
    bird.userData.originalPos.copy(bird.position);
    worldGroup.add(bird);
    birdsList.push(bird);
  });

  return birdsList;
}

/**
 * Sets up 3D Raycasting for cursor hover and mobile tap interaction on individual birds
 */
export function initBirdRaycasting(birdsList, camera) {
  if (!birdsList || birdsList.length === 0 || !camera) return;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let lastCheck = 0;

  function findBirdFromObject(obj) {
    let curr = obj;
    while (curr) {
      if (curr.userData && curr.userData.isBird) {
        return curr;
      }
      curr = curr.parent;
    }
    return null;
  }

  function handleInteraction(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(birdsList, true);

    if (intersects.length > 0) {
      const hitBird = findBirdFromObject(intersects[0].object);
      if (hitBird) {
        triggerBirdFlight(hitBird);
      }
    }
  }

  // Pointer move: throttle checks to ~25fps for high performance
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastCheck < 40) return;
    lastCheck = now;
    handleInteraction(e.clientX, e.clientY);
  }, { passive: true });

  // Pointer down (Click / Tap on Mobile)
  window.addEventListener('pointerdown', (e) => {
    // Only check if not clicking directly on HTML control buttons or links
    if (e.target && e.target.closest && e.target.closest('button, a, input, select, textarea, .chapter-menu')) {
      return;
    }
    handleInteraction(e.clientX, e.clientY);
  }, { passive: true });
}
