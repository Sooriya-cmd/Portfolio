/**
 * scrollExpand.js — Circular Image Reveal driven by scroll/wheel/touch progress
 * Smooth circular expansion: circle(r px at 50% 50%) from startRadius to endRadius.
 * Zoom out from 1.25 to 1.0, instruction text fading out smoothly.
 */

export class CircularScrollExpand {
  constructor({
    frameEl,
    imageEl,
    hintEl,
    onComplete,
    mediaZoom = 1.25
  }) {
    this.frame = frameEl;
    this.image = imageEl;
    this.hint = hintEl;
    this.onComplete = onComplete;
    this.mediaZoom = mediaZoom;

    this.progress = 0;
    this.targetProgress = 0;
    this.isCompleted = false;
    this.alive = true;
    this.animId = null;

    this.init();
  }

  init() {
    this.updateRadius(0);
    this.bindEvents();
    this.startLoop();
  }

  updateRadius(p) {
    const target = this.image || this.frame;
    if (!target) return;

    // Easing for pleasant mechanical motion
    const eased = p * p * (3 - 2 * p);

    if (this.image) {
      // Keep image fully fitted in the circular frame without clipping at rest
      this.image.style.clipPath = 'none';
      this.image.style.webkitClipPath = 'none';
      const baseScale = 1.22;
      const zoom = baseScale + (this.mediaZoom - 1.0) * eased * 0.25;
      this.image.style.transform = `scale(${zoom.toFixed(3)})`;
    }

    if (this.hint) {
      const hintAlpha = Math.max(0, 1 - eased * 2.2);
      this.hint.style.opacity = hintAlpha.toFixed(2);
      this.hint.style.transform = `translateY(${(-eased * 12).toFixed(1)}px)`;
    }
  }

  bindEvents() {
    let startY = 0;
    let touchDragging = false;

    this.onWheel = (e) => {
      if (this.isCompleted) return;
      const delta = e.deltaY * 0.0022;
      this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + delta));
      if (this.targetProgress >= 0.98 && !this.isCompleted) {
        this.complete();
      }
    };

    this.onTouchStart = (e) => {
      if (this.isCompleted || !e.touches[0]) return;
      startY = e.touches[0].clientY;
      touchDragging = true;
    };

    this.onTouchMove = (e) => {
      if (!touchDragging || this.isCompleted || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const diff = (startY - currentY) * 0.005; // swipe up = reveal
      startY = currentY;
      this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + diff));
      if (this.targetProgress >= 0.98 && !this.isCompleted) {
        this.complete();
      }
    };

    this.onTouchEnd = () => {
      touchDragging = false;
      // If not completed and released, gently spring back if < 0.6
      if (!this.isCompleted && this.targetProgress < 0.6) {
        this.targetProgress = 0;
      }
    };

    window.addEventListener('wheel', this.onWheel, { passive: true });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  complete() {
    if (this.isCompleted) return;
    this.isCompleted = true;
    this.targetProgress = 1;
    if (this.onComplete) {
      this.onComplete();
    }
  }

  startLoop() {
    const loop = () => {
      if (!this.alive) return;
      // Smooth lerp progress
      this.progress += (this.targetProgress - this.progress) * 0.14;
      this.updateRadius(this.progress);

      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  destroy() {
    this.alive = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }
}
