/**
 * scrollGlitchShards.js — Scroll-Reactive Glitch Shards
 * Spawns irregular pointed polygon streaks across the viewport exclusively during scroll.
 * Quantity and intensity scale with scroll velocity; smoothly fades out when scroll stops.
 */

const POLYGONS = [
  'polygon(50% 0%, 100% 12%, 60% 85%, 35% 100%, 42% 65%, 0% 15%)',
  'polygon(40% 0%, 90% 8%, 55% 92%, 20% 100%, 35% 55%, 5% 10%)',
  'polygon(60% 0%, 100% 20%, 50% 75%, 30% 100%, 25% 60%, 10% 25%)',
  'polygon(50% 0%, 85% 15%, 70% 90%, 40% 100%, 30% 70%, 15% 10%)',
  'polygon(45% 0%, 100% 5%, 65% 80%, 25% 100%, 40% 50%, 0% 8%)'
];

export class ScrollGlitchShards {
  constructor(options = {}) {
    this.maxShardsDesktop = options.maxShardsDesktop || 30;
    this.maxShardsMobile = options.maxShardsMobile || 12;

    this.reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduceMotion) return;

    this.shards = [];
    this.lastScrollY = window.scrollY || window.pageYOffset || 0;
    this.lastTime = performance.now();
    this.velocity = 0;
    this.decayTimer = null;
    this.alive = true;
    this.animId = null;

    this.initDOM();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    this.container = document.createElement('div');
    this.container.className = 'glitch-shards-layer';
    this.container.setAttribute('aria-hidden', 'true');
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100vw';
    this.container.style.height = '100vh';
    this.container.style.pointerEvents = 'none';
    this.container.style.zIndex = '5'; // Above 3D canvas, behind framed content panels
    this.container.style.overflow = 'hidden';

    document.body.appendChild(this.container);
  }

  bindEvents() {
    this.onScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const dt = Math.max(1, now - this.lastTime);
      const dy = Math.abs(currentScrollY - this.lastScrollY);

      // Compute velocity in px / ms
      this.velocity = (dy / dt) * 15;
      this.lastScrollY = currentScrollY;
      this.lastTime = now;

      // Reset decay timer
      clearTimeout(this.decayTimer);
      this.decayTimer = setTimeout(() => {
        this.velocity = 0;
      }, 90);
    };

    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  spawnShard() {
    const isMobile = window.innerWidth <= 768;
    const maxActive = isMobile ? this.maxShardsMobile : this.maxShardsDesktop;
    if (this.shards.length >= maxActive) return;

    const el = document.createElement('div');
    el.className = 'glitch-shard';

    const width = 1.5 + Math.random() * 2.5; // 1.5px - 4px
    const vhRatio = 0.06 + Math.random() * 0.22; // 6% - 28% of viewport height
    const height = Math.round(window.innerHeight * vhRatio);
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight - height);
    const poly = POLYGONS[Math.floor(Math.random() * POLYGONS.length)];
    const tilt = (Math.random() - 0.5) * 8; // slight diagonal tilt in deg

    el.style.position = 'absolute';
    el.style.left = `${x.toFixed(1)}px`;
    el.style.top = `${y.toFixed(1)}px`;
    el.style.width = `${width.toFixed(1)}px`;
    el.style.height = `${height}px`;
    el.style.background = 'rgba(255, 255, 255, 0.72)';
    el.style.clipPath = poly;
    el.style.webkitClipPath = poly;
    el.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.45)';
    el.style.transform = `rotate(${tilt.toFixed(1)}deg)`;
    el.style.opacity = '0';
    el.style.transition = 'opacity 60ms linear';

    this.container.appendChild(el);

    // Fade in immediately
    requestAnimationFrame(() => {
      const peakAlpha = Math.min(0.85, 0.35 + this.velocity * 0.12);
      el.style.opacity = peakAlpha.toFixed(2);
    });

    const shardObj = {
      el,
      life: 0.12 + Math.random() * 0.25, // lifespan in seconds
      age: 0,
      driftY: (Math.random() - 0.5) * 30
    };

    this.shards.push(shardObj);
  }

  startLoop() {
    const loop = (now) => {
      if (!this.alive) return;
      const dt = 0.016;

      // Spawn shards proportional to velocity
      if (this.velocity > 0.8) {
        const spawnCount = Math.min(4, Math.floor(this.velocity * 0.5));
        for (let i = 0; i < spawnCount; i++) {
          this.spawnShard();
        }
      }

      // Update existing shards
      for (let i = this.shards.length - 1; i >= 0; i--) {
        const s = this.shards[i];
        s.age += dt;
        if (s.age >= s.life) {
          // Fade out & destroy
          s.el.style.opacity = '0';
          setTimeout(() => {
            if (s.el.parentNode) {
              s.el.parentNode.removeChild(s.el);
            }
          }, 60);
          this.shards.splice(i, 1);
        }
      }

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  destroy() {
    this.alive = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    clearTimeout(this.decayTimer);
    window.removeEventListener('scroll', this.onScroll);
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
