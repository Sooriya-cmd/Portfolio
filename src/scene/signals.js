/**
 * signals.js — Yellow Signal Boxes, LED Dot-Matrix Lenses, Slot-Machine & Arcade Props
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

  // Dark lens background with subtle circular grid
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, resolution, resolution);

  const gridSize = 16;
  const dotSpacing = resolution / gridSize;
  const dotRadius = dotSpacing * 0.38;

  // Patterns defined as 16x16 boolean arrays or math rules
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let isLit = false;
      const cx = x - 7.5;
      const cy = y - 7.5;

      if (pattern === 'heart') {
        // Heart formula
        const normX = cx / 6;
        const normY = -cy / 6;
        isLit = (Math.pow(normX * normX + normY * normY - 1, 3) - normX * normX * Math.pow(normY, 3)) <= 0;
      } else if (pattern === 'smile') {
        // Eyes at (4,5) and (11,5)
        const isEye = (x === 5 && y === 5) || (x === 10 && y === 5);
        // Smile arc
        const isMouth = y === 10 && (x >= 5 && x <= 10) || (y === 9 && (x === 4 || x === 11));
        isLit = isEye || isMouth;
      } else if (pattern === 'down-arrows') {
        // Triple downward chevron arrows
        const chevron = (y % 4 === (7 - Math.abs(cx))) && (y >= 3 && y <= 12) && Math.abs(cx) <= 4;
        isLit = chevron;
      } else if (pattern === 'star') {
        isLit = (Math.abs(cx) + Math.abs(cy) <= 5) || (Math.abs(cx) <= 1 && Math.abs(cy) <= 7) || (Math.abs(cy) <= 1 && Math.abs(cx) <= 7);
      } else if (pattern === 'mushroom') {
        isLit = (cy <= 0 && cx * cx + cy * cy <= 25) || (cy > 0 && Math.abs(cx) <= 2 && cy <= 5);
      } else if (pattern === 'cherries') {
        isLit = (Math.abs(cx + 3) <= 2 && Math.abs(cy - 3) <= 2) || (Math.abs(cx - 3) <= 2 && Math.abs(cy - 3) <= 2) || (cy < 0 && Math.abs(cx) <= 3);
      }

      // Draw dot
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

  // Chunky Yellow Housing
  const bodyGeo = new THREE.BoxGeometry(2.4, 0.9, 0.45);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(THEME.colors.signalHousingYellow),
    roughness: 0.35,
    metalness: 0.1
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  signalGroup.add(body);

  // Visor Hoods and Lenses
  const lensRadius = 0.3;
  const lensSpacing = 0.75;
  const lensConfigs = [
    { x: -lensSpacing, pattern: 'heart', color: '#FF334B' },
    { x: 0, pattern: 'smile', color: '#FFD21F' },
    { x: lensSpacing, pattern: 'down-arrows', color: '#28E070' }
  ];

  lensConfigs.forEach(cfg => {
    // Lens mesh
    const lensGeo = new THREE.CylinderGeometry(lensRadius, lensRadius, 0.08, 24);
    const lensTexture = createLedDotTexture({ pattern: cfg.pattern, color: cfg.color });
    const lensMat = new THREE.MeshStandardMaterial({
      map: lensTexture,
      emissive: new THREE.Color(cfg.color),
      emissiveIntensity: 0.45,
      roughness: 0.2
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(cfg.x, 0, 0.22);
    signalGroup.add(lensMesh);

    // Visor hood
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

  // Vertical 3-lens signal tower
  const housingGeo = new THREE.BoxGeometry(0.85, 2.4, 0.45);
  const housingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(THEME.colors.signalHousingYellow),
    roughness: 0.35
  });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  jackpotGroup.add(housing);

  // Lenses with animated slot icons (Star, Mushroom, Cherries)
  const slotIcons = ['star', 'mushroom', 'cherries'];
  const colors = ['#FFD21F', '#FF334B', '#2EE5EF'];

  slotIcons.forEach((icon, i) => {
    const y = 0.75 - i * 0.75;
    const lensGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 24);
    const texture = createLedDotTexture({ pattern: icon, color: colors[i] });
    const lensMat = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color(colors[i]),
      emissiveIntensity: 0.6
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, y, 0.22);
    jackpotGroup.add(lensMesh);
  });

  return jackpotGroup;
}
