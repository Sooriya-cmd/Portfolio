/**
 * signals.js — Yellow Signal Boxes, LED Dot-Matrix Lenses, Slot-Machine, Snake Arcade & Finale Props
 */

import * as THREE from 'three';
import { THEME } from '../config/theme.js';

/**
 * Procedural LED Dot-Matrix Texture Generator
 */
export function createLedDotTexture({ pattern = 'heart', color = '#FF334B', bgColor = '#0A0B14', resolution = 256 }) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, resolution, resolution);

  const gridSize = 16;
  const dotSpacing = resolution / gridSize;
  const dotRadius = dotSpacing * 0.38;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let isLit = false;
      const cx = x - 7.5;
      const cy = y - 7.5;

      if (pattern === 'heart') {
        const normX = cx / 6;
        const normY = -cy / 6;
        isLit = (Math.pow(normX * normX + normY * normY - 1, 3) - normX * normX * Math.pow(normY, 3)) <= 0;
      } else if (pattern === 'smile') {
        const isEye = (x === 5 && y === 5) || (x === 10 && y === 5);
        const isMouth = (y === 10 && (x >= 5 && x <= 10)) || (y === 9 && (x === 4 || x === 11));
        isLit = isEye || isMouth;
      } else if (pattern === 'down-arrows') {
        const chevron = (y % 4 === (7 - Math.abs(cx))) && (y >= 3 && y <= 12) && Math.abs(cx) <= 4;
        isLit = chevron;
      } else if (pattern === 'star') {
        isLit = (Math.abs(cx) + Math.abs(cy) <= 5) || (Math.abs(cx) <= 1 && Math.abs(cy) <= 7) || (Math.abs(cy) <= 1 && Math.abs(cx) <= 7);
      } else if (pattern === 'mushroom') {
        isLit = (cy <= 0 && cx * cx + cy * cy <= 25) || (cy > 0 && Math.abs(cx) <= 2 && cy <= 5);
      } else if (pattern === 'cherries') {
        isLit = (Math.abs(cx + 3) <= 2 && Math.abs(cy - 3) <= 2) || (Math.abs(cx - 3) <= 2 && Math.abs(cy - 3) <= 2) || (cy < 0 && Math.abs(cx) <= 3);
      } else if (pattern === 'ghost') {
        isLit = (cy <= 0 && cx * cx + cy * cy <= 28) || (cy > 0 && Math.abs(cx) <= 5 && cy <= 6);
      }

      const posX = x * dotSpacing + dotSpacing / 2;
      const posY = y * dotSpacing + dotSpacing / 2;

      ctx.beginPath();
      ctx.arc(posX, posY, dotRadius, 0, Math.PI * 2);

      if (isLit) {
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates the Hero 3-Lens Traffic Signal Box
 */
export function createTrafficSignal() {
  const signalGroup = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(2.4, 0.9, 0.45);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(THEME.colors.signalHousingYellow),
    roughness: 0.35,
    metalness: 0.1
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  signalGroup.add(body);

  const lensRadius = 0.3;
  const lensSpacing = 0.75;
  const lensConfigs = [
    { x: -lensSpacing, pattern: 'heart', color: '#FF334B' },
    { x: 0, pattern: 'smile', color: '#FFD21F' },
    { x: lensSpacing, pattern: 'down-arrows', color: '#28E070' }
  ];

  lensConfigs.forEach(cfg => {
    const lensGeo = new THREE.CylinderGeometry(lensRadius, lensRadius, 0.08, 24);
    const lensTexture = createLedDotTexture({ pattern: cfg.pattern, color: cfg.color });
    const lensMat = new THREE.MeshStandardMaterial({
      map: lensTexture,
      emissive: new THREE.Color(cfg.color),
      emissiveIntensity: 0.5,
      roughness: 0.2
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(cfg.x, 0, 0.22);
    signalGroup.add(lensMesh);

    const hoodGeo = new THREE.CylinderGeometry(lensRadius + 0.05, lensRadius + 0.05, 0.2, 16, 1, true, 0, Math.PI);
    const hoodMat = new THREE.MeshStandardMaterial({ color: 0x2A2A38, roughness: 0.5 });
    const hood = new THREE.Mesh(hoodGeo, hoodMat);
    hood.rotation.x = Math.PI / 2;
    hood.rotation.z = Math.PI;
    hood.position.set(cfg.x, 0.08, 0.25);
    signalGroup.add(hood);
  });

  return signalGroup;
}

/**
 * Creates the Slot Machine Jackpot Signal at the More Projects milestone
 */
export function createJackpotSignal() {
  const jackpotGroup = new THREE.Group();

  const housingGeo = new THREE.BoxGeometry(0.85, 2.4, 0.45);
  const housingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(THEME.colors.signalHousingYellow),
    roughness: 0.35
  });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  jackpotGroup.add(housing);

  // Pedestrian Push Button Box (Screenshot 11)
  const pushBoxGeo = new THREE.BoxGeometry(0.55, 0.85, 0.35);
  const pushBoxMat = new THREE.MeshStandardMaterial({ color: 0xF1C40F, roughness: 0.4 });
  const pushBox = new THREE.Mesh(pushBoxGeo, pushBoxMat);
  pushBox.position.set(-0.85, -0.6, 0);
  jackpotGroup.add(pushBox);

  // Glowing Orange Button Ring
  const btnRingGeo = new THREE.TorusGeometry(0.14, 0.04, 12, 24);
  const btnRingMat = new THREE.MeshStandardMaterial({
    color: 0xFF5500,
    emissive: 0xFF5500,
    emissiveIntensity: 0.8
  });
  const btnRing = new THREE.Mesh(btnRingGeo, btnRingMat);
  btnRing.position.set(-0.85, -0.65, 0.18);
  jackpotGroup.add(btnRing);

  // Lenses with dynamic slot icons
  const slotPatterns = [
    { pattern: 'star', color: '#FFD21F' },
    { pattern: 'mushroom', color: '#FF334B' },
    { pattern: 'cherries', color: '#2EE5EF' }
  ];

  const lensMeshes = [];
  slotPatterns.forEach((cfg, i) => {
    const y = 0.75 - i * 0.75;
    const lensGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 24);
    const texture = createLedDotTexture({ pattern: cfg.pattern, color: cfg.color });
    const lensMat = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color(cfg.color),
      emissiveIntensity: 0.65
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, y, 0.22);
    jackpotGroup.add(lensMesh);
    lensMeshes.push(lensMesh);
  });

  return jackpotGroup;
}

/**
 * Creates the Animated Snake Arcade Box at Contacts Milestone
 */
export function createSnakeArcadeBox() {
  const arcadeGroup = new THREE.Group();

  // Pink enclosure box (Screenshot 13-16)
  const boxGeo = new THREE.BoxGeometry(1.5, 1.1, 0.5);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xE84393, roughness: 0.35 });
  const box = new THREE.Mesh(boxGeo, boxMat);
  arcadeGroup.add(box);

  // Screen canvas texture
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 256;
  screenCanvas.height = 192;
  const ctx = screenCanvas.getContext('2d');
  const screenTexture = new THREE.CanvasTexture(screenCanvas);

  const screenGeo = new THREE.PlaneGeometry(1.2, 0.85);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, 0.26);
  arcadeGroup.add(screenMesh);

  // Snake game internal state
  const snake = [
    { x: 12, y: 6 },
    { x: 11, y: 6 },
    { x: 10, y: 6 },
    { x: 9, y: 6 },
    { x: 8, y: 6 },
    { x: 7, y: 6 },
    { x: 6, y: 6 }
  ];
  let direction = 'right';
  let food = { x: 18, y: 6 };
  let lastStep = 0;

  arcadeGroup.userData = {
    update: (time) => {
      if (time - lastStep > 0.18) {
        lastStep = time;

        // Move snake around perimeter
        const head = { ...snake[0] };
        if (direction === 'right') {
          head.x += 1;
          if (head.x >= 22) direction = 'down';
        } else if (direction === 'down') {
          head.y += 1;
          if (head.y >= 14) direction = 'left';
        } else if (direction === 'left') {
          head.x -= 1;
          if (head.x <= 2) direction = 'up';
        } else if (direction === 'up') {
          head.y -= 1;
          if (head.y <= 2) direction = 'right';
        }

        snake.unshift(head);
        snake.pop();

        // Render snake frame
        ctx.fillStyle = '#111122';
        ctx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

        // Border grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeRect(4, 4, screenCanvas.width - 8, screenCanvas.height - 8);

        // Draw food
        ctx.fillStyle = '#FF334B';
        ctx.beginPath();
        ctx.arc(food.x * 10, food.y * 10, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw snake segments
        ctx.fillStyle = '#2ECC71';
        snake.forEach(seg => {
          ctx.fillRect(seg.x * 10 - 4, seg.y * 10 - 4, 8, 8);
        });

        screenTexture.needsUpdate = true;
      }
    }
  };

  return arcadeGroup;
}

/**
 * Creates the Grand Finale Disco Ball & Party Audio Setup (Screenshot 17)
 */
export function createFinalePartyProps() {
  const finaleGroup = new THREE.Group();

  // 1. Triangular Bunting Flags spelling "THE END"
  const buntingLetters = ['T', 'H', 'E', ' ', 'E', 'N', 'D'];
  const buntingColors = ['#E74C3C', '#F39C12', '#2ECC71', '#3498DB', '#9B59B6', '#E67E22', '#1ABC9C'];
  
  buntingLetters.forEach((letter, i) => {
    if (letter === ' ') return;
    const flagGeo = new THREE.ConeGeometry(0.18, 0.35, 3);
    const flagMat = new THREE.MeshStandardMaterial({
      color: buntingColors[i % buntingColors.length],
      roughness: 0.4
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.rotation.x = Math.PI;
    flag.position.set(-1.8 + i * 0.45, 0.4, 0);
    finaleGroup.add(flag);
  });

  // 2. Sparkling Disco Ball
  const ballGeo = new THREE.SphereGeometry(0.65, 24, 20);
  const ballMat = new THREE.MeshStandardMaterial({
    color: 0xDFE6E9,
    metalness: 0.9,
    roughness: 0.15,
    flatShading: true
  });
  const discoBall = new THREE.Mesh(ballGeo, ballMat);
  discoBall.position.set(0, -0.4, 0);
  finaleGroup.add(discoBall);

  // Disco Ball suspension wire
  const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 8);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
  const suspensionWire = new THREE.Mesh(wireGeo, wireMat);
  suspensionWire.position.set(0, 0.0, 0);
  finaleGroup.add(suspensionWire);

  // 3. Loudspeaker Horn System (BF-07 transformer box + 2 speaker cones)
  const ampBoxGeo = new THREE.BoxGeometry(1.2, 1.0, 0.6);
  const ampBoxMat = new THREE.MeshStandardMaterial({ color: 0xF1C40F, roughness: 0.4 });
  const ampBox = new THREE.Mesh(ampBoxGeo, ampBoxMat);
  ampBox.position.set(0, -2.2, 0);
  finaleGroup.add(ampBox);

  // Horn Bell Left
  const hornGeo = new THREE.ConeGeometry(0.4, 0.7, 16, 1, true);
  const hornMat = new THREE.MeshStandardMaterial({ color: 0x9B59B6, roughness: 0.35 });
  
  const leftHorn = new THREE.Mesh(hornGeo, hornMat);
  leftHorn.rotation.z = Math.PI / 2;
  leftHorn.position.set(-0.9, -2.2, 0);
  finaleGroup.add(leftHorn);

  // Horn Bell Right
  const rightHorn = new THREE.Mesh(hornGeo, hornMat);
  rightHorn.rotation.z = -Math.PI / 2;
  rightHorn.position.set(0.9, -2.2, 0);
  finaleGroup.add(rightHorn);

  // Rotation animation hook for disco ball
  finaleGroup.userData = {
    update: (time) => {
      discoBall.rotation.y = time * 0.8;
    }
  };

  return finaleGroup;
}
