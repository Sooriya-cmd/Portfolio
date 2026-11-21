/**
 * pole.js — Procedural Utility Pole, Collar Bands, Brackets, Crossbars, and Street Signs
 */

import * as THREE from 'three';
import { THEME } from '../config/theme.js';

/**
 * Generate a procedural sticker decal texture on a canvas
 */
function createPoleStickersTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Base pole purple
  ctx.fillStyle = THEME.colors.polePurple;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Helper for rounded rect sticker
  function drawSticker(x, y, w, h, bg, border, drawContent) {
    ctx.save();
    ctx.fillStyle = border;
    ctx.beginPath();
    ctx.roundRect(x - 3, y - 3, w + 6, h + 6, 12);
    ctx.fill();

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    drawContent(ctx, w, h);
    ctx.restore();
    ctx.restore();
  }

  // Draw checkered band near top
  const bandY = 120;
  ctx.fillStyle = '#FFCC00';
  ctx.fillRect(0, bandY, canvas.width, 36);
  ctx.fillStyle = '#11111E';
  for (let i = 0; i < canvas.width; i += 36) {
    if ((i / 36) % 2 === 0) {
      ctx.fillRect(i, bandY, 36, 36);
    }
  }

  // Decal 1: Smiley Face
  drawSticker(100, 260, 110, 110, '#FFD21F', '#11111E', (c) => {
    c.fillStyle = '#11111E';
    c.beginPath();
    c.arc(-20, -10, 8, 0, Math.PI * 2);
    c.arc(20, -10, 8, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(0, 10, 25, 0, Math.PI);
    c.lineWidth = 6;
    c.stroke();
  });

  // Decal 2: Lightning Bolt
  drawSticker(600, 320, 90, 130, '#FF3366', '#FFFFFF', (c) => {
    c.fillStyle = '#FFEB3B';
    c.beginPath();
    c.moveTo(5, -45);
    c.lineTo(-25, 5);
    c.lineTo(0, 5);
    c.lineTo(-10, 45);
    c.lineTo(25, -5);
    c.lineTo(0, -5);
    c.closePath();
    c.fill();
  });

  // Decal 3: "KEEP GOING" Badge
  drawSticker(280, 500, 220, 60, '#11111E', '#2EE5EF', (c) => {
    c.fillStyle = '#2EE5EF';
    c.font = 'bold 24px monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('KEEP GOING', 0, 0);
  });

  // Decal 4: Mushroom Sticker
  drawSticker(720, 680, 120, 120, '#FFFFFF', '#11111E', (c) => {
    c.fillStyle = '#FF334B';
    c.beginPath();
    c.arc(0, -10, 40, Math.PI, 0);
    c.fill();
    c.fillStyle = '#FFFFFF';
    c.beginPath();
    c.arc(-15, -25, 8, 0, Math.PI * 2);
    c.arc(15, -25, 8, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#F4E7D3';
    c.fillRect(-15, -10, 30, 35);
  });

  // Decal 5: Barcode & Number
  drawSticker(140, 900, 180, 70, '#FFFFFF', '#11111E', (c) => {
    c.fillStyle = '#11111E';
    for (let x = -70; x < 70; x += 10) {
      c.fillRect(x, -20, (x % 20 === 0) ? 6 : 3, 30);
    }
    c.font = '14px monospace';
    c.textAlign = 'center';
    c.fillText('NO. 4792-B', 0, 22);
  });

  // Decal 6: "HELLO!" Speech Bubble Sticker
  drawSticker(520, 1150, 180, 75, '#2EE5EF', '#11111E', (c) => {
    c.fillStyle = '#11111E';
    c.font = '900 28px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('HELLO!', 0, 0);
  });

  // Decal 7: Pixel Heart
  drawSticker(300, 1420, 100, 100, '#FF4F92', '#FFFFFF', (c) => {
    c.fillStyle = '#FFFFFF';
    c.font = '48px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('♥', 0, 0);
  });

  // Decal 8: "DON'T WAIT" Badge
  drawSticker(680, 1680, 200, 55, '#3158DF', '#FFCC00', (c) => {
    c.fillStyle = '#FFFFFF';
    c.font = 'bold 22px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText("DON'T WAIT", 0, 0);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Reusable Helper: Create a 3D Sign Mesh with text & border
 */
export function createStreetSign({ text, subtext = '', bgColor, textColor = '#FFFFFF', width = 2.2, height = 0.7, isArrow = false }) {
  const canvas = document.createElement('canvas');
  // Match canvas aspect ratio closely to geometry aspect ratio to avoid texture distortion
  const aspect = width / height;
  canvas.height = 180;
  canvas.width = Math.round(180 * aspect);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  // Text with proportional typography matching actual content
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (subtext) {
    ctx.font = '900 44px "Barlow Condensed", sans-serif';
    ctx.fillText(text, canvas.width / 2, 54);
    ctx.font = '700 24px "Inter", sans-serif';
    ctx.fillStyle = '#FFD21F';
    ctx.fillText(subtext, canvas.width / 2, 118);
  } else {
    ctx.font = '900 48px "Barlow Condensed", sans-serif';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.BoxGeometry(width, height, 0.08);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.35,
    metalness: 0.1
  });

  const signMesh = new THREE.Mesh(geo, mat);
  return signMesh;
}

/**
 * Builder for Utility Pole and Attached Signage
 */
export function createUtilityPole() {
  const poleGroup = new THREE.Group();

  // 1. Main Pole Cylinder
  const poleGeo = new THREE.CylinderGeometry(0.38, 0.42, 36, 32);
  const poleMat = new THREE.MeshStandardMaterial({
    map: createPoleStickersTexture(),
    roughness: 0.45,
    metalness: 0.1
  });
  const poleCylinder = new THREE.Mesh(poleGeo, poleMat);
  poleCylinder.position.set(0, -12, 0);
  poleGroup.add(poleCylinder);

  // 2. Collar Rings (Yellow, Green & Pink accents)
  const collarGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.4, 32);
  const yellowCollarMat = new THREE.MeshStandardMaterial({ color: 0xF1C40F, roughness: 0.3 });
  const greenCollarMat = new THREE.MeshStandardMaterial({ color: 0x2ECC71, roughness: 0.3 });
  const pinkCollarMat = new THREE.MeshStandardMaterial({ color: 0xFF4F92, roughness: 0.3 });

  // Top Yellow Collar
  const collar1 = new THREE.Mesh(collarGeo, yellowCollarMat);
  collar1.position.set(0, 3.8, 0);
  poleGroup.add(collar1);

  // Mid Green Collar
  const collar2 = new THREE.Mesh(collarGeo, greenCollarMat);
  collar2.position.set(0, 1.2, 0);
  poleGroup.add(collar2);

  // Lower Collars
  const collar3 = new THREE.Mesh(collarGeo, yellowCollarMat);
  collar3.position.set(0, -3.2, 0);
  poleGroup.add(collar3);

  const collar4 = new THREE.Mesh(collarGeo, pinkCollarMat);
  collar4.position.set(0, -8.0, 0);
  poleGroup.add(collar4);

  const collar5 = new THREE.Mesh(collarGeo, greenCollarMat);
  collar5.position.set(0, -18.5, 0);
  poleGroup.add(collar5);

  // 3. Horizontal Crossbars
  const crossbarMat = new THREE.MeshStandardMaterial({ color: 0x483272, roughness: 0.4 });
  
  // Hero Crossbar (for 7 birds and traffic signal)
  const heroCrossbarGeo = new THREE.BoxGeometry(4.2, 0.18, 0.18);
  const heroCrossbar = new THREE.Mesh(heroCrossbarGeo, crossbarMat);
  heroCrossbar.position.set(-1.8, 3.2, 0);
  poleGroup.add(heroCrossbar);

  // Diagonal support strut for hero crossbar
  const strutGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12);
  const strut = new THREE.Mesh(strutGeo, crossbarMat);
  strut.position.set(-0.9, 2.4, 0);
  strut.rotation.z = Math.PI / 4;
  poleGroup.add(strut);

  // 4. Street Lamp Fixture (Positioned towards the right with generous clearance from boxes & crossbars)
  const lampGroup = new THREE.Group();
  
  // Curved lamp arm extending to the right from the pole (x = +1.15)
  const armCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.35, 4.2, 0),
    new THREE.Vector3(0.7, 4.4, 0),
    new THREE.Vector3(1.1, 4.3, 0),
    new THREE.Vector3(1.2, 3.8, 0)
  );
  const armGeo = new THREE.TubeGeometry(armCurve, 16, 0.05, 8, false);
  const armMesh = new THREE.Mesh(armGeo, crossbarMat);
  lampGroup.add(armMesh);

  // Diagonal support strut under lamp arm
  const lampStrutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8);
  const lampStrut = new THREE.Mesh(lampStrutGeo, crossbarMat);
  lampStrut.position.set(0.65, 3.85, 0);
  lampStrut.rotation.z = -Math.PI / 4;
  lampGroup.add(lampStrut);

  // Lamp Bell Hood
  const hoodGeo = new THREE.ConeGeometry(0.30, 0.26, 16, 1, true);
  const hoodMat = new THREE.MeshStandardMaterial({ color: 0x2A2A38, roughness: 0.35 });
  const hood = new THREE.Mesh(hoodGeo, hoodMat);
  hood.position.set(1.2, 3.75, 0);
  lampGroup.add(hood);

  // Top cap for hood
  const capGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.08, 12);
  const cap = new THREE.Mesh(capGeo, crossbarMat);
  cap.position.set(1.2, 3.9, 0);
  lampGroup.add(cap);

  // Glowing Warm Bulb
  const bulbGeo = new THREE.SphereGeometry(0.11, 16, 12);
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xFFF0A0,
    emissive: 0xFFD240,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.set(1.2, 3.65, 0);
  lampGroup.add(bulb);

  // Warm Point Light
  const lampLight = new THREE.PointLight(0xFFE890, 1.2, 8, 1.5);
  lampLight.position.set(1.2, 3.5, 0.1);
  lampGroup.add(lampLight);

  poleGroup.add(lampGroup);

  // 5. Street Signs at Chapter Milestones — Tailored dimensions to fit content without excess empty space
  // Helper to mount sign with horizontal metal bracket rod to pole cleanly without penetrating pole
  const signsList = [];
  function attachSignWithBracket(sign, x, y, z, width, idx = 0) {
    sign.position.set(x, y, z);
    sign.userData.basePosY = y;
    sign.userData.swayPhase = idx * 0.8;
    poleGroup.add(sign);
    signsList.push(sign);

    // Bracket rod extending from sign back to pole collar
    const poleSurfaceX = -0.40;
    const bracketLen = Math.abs(poleSurfaceX - x);
    const bracketGeo = new THREE.CylinderGeometry(0.025, 0.025, bracketLen, 8);
    const bracket = new THREE.Mesh(bracketGeo, crossbarMat);
    bracket.rotation.z = Math.PI / 2;
    bracket.position.set(x + bracketLen / 2, y, z - 0.04);
    poleGroup.add(bracket);
  }

  // Milestone: About (y ≈ 0.6)
  const aboutSign = createStreetSign({
    text: 'ⓘ ABOUT',
    subtext: '📍 YOU ARE HERE',
    bgColor: '#1E56D0',
    width: 2.0,
    height: 0.72
  });
  attachSignWithBracket(aboutSign, -1.45, 0.6, 0.35, 2.0, 0);

  // Milestone: Experience Bus Stop (y ≈ -4.5)
  const expSign = createStreetSign({ text: 'EXPERIENCE BUS', subtext: 'ROUTE 100 → NE', bgColor: '#0F8A5F', width: 2.1, height: 0.70 });
  attachSignWithBracket(expSign, -1.45, -4.50, 0.35, 2.1, 1);

  // Milestone: Projects Arrow Sign (y ≈ -6.8)
  const projSign = createStreetSign({ text: 'PROJECTS 🠗', bgColor: '#F39C12', width: 1.9, height: 0.55 });
  attachSignWithBracket(projSign, -1.40, -6.80, 0.35, 1.9, 2);

  // Milestone: More Projects ArtStation Sign (y ≈ -19.6; well clear of jackpot signal at y = -17.8)
  const artstationSign = createStreetSign({ text: 'ARTSTATION ➔', bgColor: '#131A26', textColor: '#00F0FF', width: 1.7, height: 0.42 });
  attachSignWithBracket(artstationSign, -1.35, -19.60, 0.35, 1.7, 3);

  // Milestone: Contacts Signs (y ≈ -22.5)
  const contactSign = createStreetSign({ text: 'CONTACTS / SAY HI 🠗', bgColor: '#FFFFFF', textColor: '#11111E', width: 2.0, height: 0.50 });
  attachSignWithBracket(contactSign, -1.45, -22.50, 0.35, 2.0, 4);

  // Mailbox prop on pole at contacts
  const mailboxGeo = new THREE.BoxGeometry(0.55, 0.65, 0.40);
  const mailboxMat = new THREE.MeshStandardMaterial({ color: 0x1E56D0, roughness: 0.3 });
  const mailbox = new THREE.Mesh(mailboxGeo, mailboxMat);
  mailbox.position.set(-0.65, -23.5, 0.25);
  poleGroup.add(mailbox);

  // Position whole pole assembly towards the right anchor x = 4.35 (Requirement 3: Street lamp & pole moved right)
  poleGroup.position.set(4.35, 0, 0);

  // Micro-animations for street lamp and physical suspended signboards (Requirement 9)
  poleGroup.userData = {
    update: (time) => {
      // Warm glow breathing variation on street lamp bulb and point light
      if (lampLight && bulb) {
        lampLight.intensity = 1.15 + Math.sin(time * 2.2) * 0.15;
        bulbMat.emissiveIntensity = 0.85 + Math.sin(time * 2.2) * 0.12;
      }

      // Subtle, gentle physical suspension sway on street signs
      signsList.forEach((s) => {
        if (s && s.userData && s.userData.basePosY !== undefined) {
          s.rotation.z = Math.sin(time * 1.3 + s.userData.swayPhase) * 0.015;
          s.position.y = s.userData.basePosY + Math.sin(time * 1.6 + s.userData.swayPhase) * 0.005;
        }
      });
    }
  };

  return {
    group: poleGroup,
    heroCrossbar
  };
}
