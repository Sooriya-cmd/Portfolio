/**
 * path.js — 3D Camera Spline Points, LookAt Targets, and Chapter Progress Intervals
 */

import * as THREE from 'three';

export const CHAPTER_RANGES = {
  hero: { start: 0.00, end: 0.08, name: 'Hero' },
  about: { start: 0.08, end: 0.17, name: 'About' },
  skills: { start: 0.17, end: 0.26, name: 'Skills' },
  experience: { start: 0.26, end: 0.35, name: 'Experience' },
  projects: { start: 0.35, end: 0.78, name: 'Projects' },
  moreProjects: { start: 0.78, end: 0.84, name: 'More Projects' },
  contact: { start: 0.84, end: 0.93, name: 'Contact' },
  ending: { start: 0.93, end: 1.00, name: 'The End' }
};

/**
 * 3D Spline Control Points for Camera Position
 */
export const CAMERA_PATH_POINTS = [
  new THREE.Vector3(0.0, 2.5, 9.2),     // 0.00 Hero
  new THREE.Vector3(0.3, 0.5, 8.8),     // 0.12 About
  new THREE.Vector3(0.5, -1.8, 8.5),    // 0.21 Skills
  new THREE.Vector3(0.4, -4.2, 8.2),    // 0.30 Experience
  new THREE.Vector3(0.2, -7.0, 8.0),    // 0.40 Projects (Start - MemoryBreaker)
  new THREE.Vector3(0.1, -11.5, 8.0),   // 0.55 Projects (Mid - Nova-Notes)
  new THREE.Vector3(0.2, -16.0, 8.0),   // 0.70 Projects (End - ClubHub)
  new THREE.Vector3(0.4, -19.2, 8.2),   // 0.80 More Projects
  new THREE.Vector3(0.5, -22.5, 8.5),   // 0.88 Contact
  new THREE.Vector3(0.0, -25.8, 8.8)    // 1.00 The End
];

/**
 * 3D Spline Control Points for Camera LookAt Target
 */
export const CAMERA_LOOK_POINTS = [
  new THREE.Vector3(1.2, 2.2, 0.0),     // Hero look target
  new THREE.Vector3(1.5, 0.4, 0.0),     // About look target
  new THREE.Vector3(1.6, -1.9, 0.0),    // Skills look target
  new THREE.Vector3(1.8, -4.3, 0.0),    // Experience look target
  new THREE.Vector3(1.6, -7.1, 0.0),    // Projects look target
  new THREE.Vector3(1.6, -11.6, 0.0),   // Projects mid look target
  new THREE.Vector3(1.6, -16.1, 0.0),   // Projects end look target
  new THREE.Vector3(1.8, -19.3, 0.0),   // More Projects look target
  new THREE.Vector3(1.8, -22.6, 0.0),   // Contact look target
  new THREE.Vector3(1.2, -25.5, 0.0)    // The End look target
];

export const cameraPositionCurve = new THREE.CatmullRomCurve3(CAMERA_PATH_POINTS);
export const cameraLookCurve = new THREE.CatmullRomCurve3(CAMERA_LOOK_POINTS);

export function getProjectRange(index, total = 3) {
  const span = CHAPTER_RANGES.projects.end - CHAPTER_RANGES.projects.start;
  const step = span / total;
  const start = CHAPTER_RANGES.projects.start + index * step;
  return {
    start,
    end: start + step
  };
}
