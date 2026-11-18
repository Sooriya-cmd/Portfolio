/**
 * wires.js — Sagging Catenary Cables and Power Line Strands
 */

import * as THREE from 'three';

/**
 * Creates a sagging catenary 3D wire between two points
 */
export function createSaggingWire({
  start,
  end,
  sag = 0.45,
  radius = 0.025,
  color = 0x1E1F30,
  segments = 32
}) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Linear interpolation
    const x = start.x + (end.x - start.x) * t;
    const z = start.z + (end.z - start.z) * t;
    
    // Parabolic catenary sag: max droop at midpoint t = 0.5
    const straightY = start.y + (end.y - start.y) * t;
    const droop = Math.sin(t * Math.PI) * sag;
    const y = straightY - droop;

    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, segments, radius, 8, false);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.2
  });

  return new THREE.Mesh(geo, mat);
}

/**
 * Builds the network of scene wires
 */
export function createWires() {
  const wiresGroup = new THREE.Group();

  // 1. High utility line passing through the hero scene
  const wire1 = createSaggingWire({
    start: new THREE.Vector3(-12, 4.2, -1),
    end: new THREE.Vector3(3.6, 3.8, 0),
    sag: 0.7,
    radius: 0.028,
    color: 0x1A1B2E
  });
  wiresGroup.add(wire1);

  // 2. Secondary parallel line with slight offset
  const wire2 = createSaggingWire({
    start: new THREE.Vector3(-12, 3.7, -0.5),
    end: new THREE.Vector3(3.6, 3.4, 0),
    sag: 0.85,
    radius: 0.022,
    color: 0x222438
  });
  wiresGroup.add(wire2);

  // 3. Lower cable line across mid-street
  const wire3 = createSaggingWire({
    start: new THREE.Vector3(-10, -5.5, -0.8),
    end: new THREE.Vector3(3.6, -7.0, 0),
    sag: 0.9,
    radius: 0.025,
    color: 0x1E1F32
  });
  wiresGroup.add(wire3);

  // 4. Low night-time cables near the finale
  const wire4 = createSaggingWire({
    start: new THREE.Vector3(-10, -24.2, -0.5),
    end: new THREE.Vector3(3.6, -24.6, 0),
    sag: 0.6,
    radius: 0.026,
    color: 0x1A1830
  });
  wiresGroup.add(wire4);

  return wiresGroup;
}
