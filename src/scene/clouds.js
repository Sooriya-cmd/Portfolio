/**
 * clouds.js — Stylized 3D Multi-Lobed Cloud Clusters with Gentle Drift
 */

import * as THREE from 'three';

/**
 * Creates an individual multi-lobed cloud mesh
 */
export function createCloudCluster({ lobeCount = 5, scale = 1.0, color = 0xFFFFFF }) {
  const cloudGroup = new THREE.Group();

  // Custom toon-style cloud material with pink underside tint
  const cloudMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true
  });

  // Base lobes configuration
  const lobeOffsets = [
    { x: 0, y: 0, z: 0, r: 1.0 },
    { x: -0.85, y: -0.2, z: 0.1, r: 0.75 },
    { x: 0.85, y: -0.15, z: -0.1, r: 0.8 },
    { x: -1.5, y: -0.4, z: 0, r: 0.55 },
    { x: 1.5, y: -0.35, z: 0, r: 0.6 },
    { x: 0.3, y: 0.45, z: 0.1, r: 0.7 }
  ];

  lobeOffsets.slice(0, lobeCount).forEach(lobe => {
    const geo = new THREE.SphereGeometry(lobe.r * scale, 12, 10);
    const mesh = new THREE.Mesh(geo, cloudMat);
    mesh.position.set(lobe.x * scale, lobe.y * scale, lobe.z * scale);
    cloudGroup.add(mesh);
  });

  return cloudGroup;
}

/**
 * Manages the field of floating drifting clouds
 */
export class CloudsField {
  constructor(scene, count = 14) {
    this.scene = scene;
    this.clouds = [];
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.initClouds(count);
  }

  initClouds(count) {
    for (let i = 0; i < count; i++) {
      const scale = 0.8 + Math.random() * 0.7;
      const cloud = createCloudCluster({
        lobeCount: 5 + Math.floor(Math.random() * 2),
        scale
      });

      // Distribute along scene vertical span (y ≈ 5 to -28)
      const x = (Math.random() - 0.5) * 36;
      const y = 4 - Math.random() * 32;
      const z = -4 - Math.random() * 12;

      cloud.position.set(x, y, z);
      
      // Drift velocity
      cloud.userData = {
        speedX: 0.08 + Math.random() * 0.12,
        startX: -25,
        endX: 25
      };

      this.group.add(cloud);
      this.clouds.push(cloud);
    }
  }

  update(deltaTime = 0.016) {
    this.clouds.forEach(cloud => {
      cloud.position.x += cloud.userData.speedX * deltaTime * 6;
      // Seamless wrap
      if (cloud.position.x > cloud.userData.endX) {
        cloud.position.x = cloud.userData.startX;
      }
    });
  }
}
