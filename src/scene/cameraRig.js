/**
 * cameraRig.js — Interpolates Camera Position and Look Target along Spline Curve
 */

import * as THREE from 'three';
import { cameraPositionCurve, cameraLookCurve } from '../config/path.js';

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.progress = 0;
    this.targetProgress = 0;
    
    this.currentPos = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.currentLook = new THREE.Vector3();
    this.targetLook = new THREE.Vector3();
    
    this.swayAmount = 0.08;
    this.enableSway = true;
    
    // Check reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enableSway = false;
    }
  }

  setProgress(p) {
    this.targetProgress = Math.min(Math.max(p, 0), 1);
  }

  update(deltaTime = 0.016, elapsedTime = 0) {
    // Smooth progress interpolation
    this.progress += (this.targetProgress - this.progress) * 0.1;
    const clampedProgress = Math.min(Math.max(this.progress, 0), 1);

    // Sample curves
    cameraPositionCurve.getPointAt(clampedProgress, this.targetPos);
    cameraLookCurve.getPointAt(clampedProgress, this.targetLook);

    // Subtle idle camera sway
    if (this.enableSway) {
      const swayX = Math.sin(elapsedTime * 0.8) * this.swayAmount;
      const swayY = Math.cos(elapsedTime * 1.1) * (this.swayAmount * 0.6);
      this.targetPos.x += swayX;
      this.targetPos.y += swayY;
    }

    // Smooth position and look damping
    this.camera.position.lerp(this.targetPos, 0.12);
    this.currentLook.lerp(this.targetLook, 0.12);
    this.camera.lookAt(this.currentLook);
  }
}
