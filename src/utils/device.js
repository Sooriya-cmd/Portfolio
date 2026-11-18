/**
 * device.js — Device Detection, WebGL Capability, and Motion Preferences
 */

export function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('webgl2'))
    );
  } catch (e) {
    return false;
  }
}

export function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getOptimalPixelRatio() {
  if (isMobileDevice()) {
    return Math.min(window.devicePixelRatio, 1.5);
  }
  return Math.min(window.devicePixelRatio, 2.0);
}
