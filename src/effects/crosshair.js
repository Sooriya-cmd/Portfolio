/**
 * crosshair.js — Pointer-following scanner with lock-on brackets
 * Adapted from React Bits Crosshair for Vanilla JavaScript.
 * Scoped to the Projects showcase wrapper, desktop-only, pointer-events: none.
 */

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

export class Crosshair {
  constructor(container, options = {}) {
    this.container = container;
    this.color = options.color || '#2EE5EF';
    this.thickness = options.thickness || 1;
    this.opacity = options.opacity !== undefined ? options.opacity : 0.45;
    this.gap = options.gap !== undefined ? options.gap : 10;
    this.fade = options.fade !== undefined ? options.fade : 0.25;
    this.smoothing = options.smoothing !== undefined ? options.smoothing : 0.35;
    this.targetSelector = options.targetSelector || 'a, button, [data-crosshair-target]';
    this.clickPulse = options.clickPulse !== false;

    // Disable crosshair entirely on touch/mobile devices
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
    if (isTouch) {
      this.isTouch = true;
      return;
    }

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'crosshair-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10';

    this.container.style.position = 'relative';
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.state = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      inside: false,
      presence: 0,
      target: null,
      lock: { x: 0, y: 0, w: 0, h: 0, alpha: 0 },
      pulses: []
    };

    this.size = { w: 0, h: 0, dpr: 1 };
    this.alive = true;
    this.raf = null;
    this.lastTime = performance.now();

    this.parseColor();
    this.resize();
    this.bindEvents();
    this.startLoop();
  }

  parseColor() {
    // Parse hex or named color to RGB
    const probe = document.createElement('canvas').getContext('2d');
    probe.fillStyle = this.color;
    const computed = String(probe.fillStyle);
    if (computed.startsWith('#')) {
      const hex = parseInt(computed.slice(1, 7), 16);
      this.rgb = { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255, a: 1 };
    } else {
      const parts = computed.match(/[\d.]+/g)?.map(Number) ?? [46, 229, 239, 1];
      this.rgb = { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
    }
  }

  rgba(alpha) {
    return `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${clamp(alpha * this.rgb.a, 0, 1)})`;
  }

  resize() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.size.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.size.w = rect.width;
    this.size.h = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * this.size.dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * this.size.dpr));
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const inside = (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );

      this.state.inside = inside;
      if (inside) {
        this.state.tx = clientX - rect.left;
        this.state.ty = clientY - rect.top;

        // Target detection
        const hoveredEl = document.elementFromPoint(clientX, clientY);
        this.state.target = hoveredEl ? hoveredEl.closest(this.targetSelector) : null;
      }
    };

    this.onPointerLeave = () => {
      this.state.inside = false;
      this.state.target = null;
    };

    this.onClick = (e) => {
      if (!this.clickPulse || !this.state.inside) return;
      const rect = this.container.getBoundingClientRect();
      this.state.pulses.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        age: 0
      });
    };

    window.addEventListener('mousemove', this.onPointerMove, { passive: true });
    this.container.addEventListener('mouseleave', this.onPointerLeave);
    this.container.addEventListener('click', this.onClick);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
  }

  startLoop() {
    const loop = (now) => {
      if (!this.alive) return;
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      this.update(dt);
      this.render();

      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  update(dt) {
    const s = this.state;
    const factor = Math.exp(-dt / Math.max(0.001, this.smoothing * 0.15));
    s.x += (s.tx - s.x) * (1 - factor);
    s.y += (s.ty - s.y) * (1 - factor);

    const targetPresence = s.inside ? 1 : 0;
    s.presence += (targetPresence - s.presence) * (1 - Math.exp(-dt / 0.12));

    // Lock frame calculation
    if (s.target && s.inside) {
      const containerRect = this.container.getBoundingClientRect();
      const targetRect = s.target.getBoundingClientRect();
      const pad = 4;
      const targetBox = {
        x: targetRect.left - containerRect.left - pad,
        y: targetRect.top - containerRect.top - pad,
        w: targetRect.width + pad * 2,
        h: targetRect.height + pad * 2,
        alpha: 1
      };

      const lockFactor = 1 - Math.exp(-dt / 0.08);
      s.lock.x += (targetBox.x - s.lock.x) * lockFactor;
      s.lock.y += (targetBox.y - s.lock.y) * lockFactor;
      s.lock.w += (targetBox.w - s.lock.w) * lockFactor;
      s.lock.h += (targetBox.h - s.lock.h) * lockFactor;
      s.lock.alpha += (1 - s.lock.alpha) * lockFactor;
    } else {
      s.lock.alpha += (0 - s.lock.alpha) * (1 - Math.exp(-dt / 0.15));
    }

    // Pulses
    for (let i = s.pulses.length - 1; i >= 0; i--) {
      s.pulses[i].age += dt;
      if (s.pulses[i].age >= 0.55) {
        s.pulses.splice(i, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const s = this.state;
    ctx.setTransform(this.size.dpr, 0, 0, this.size.dpr, 0, 0);
    ctx.clearRect(0, 0, this.size.w, this.size.h);

    if (s.presence > 0.001) {
      ctx.globalAlpha = s.presence * this.opacity * (1 - 0.5 * s.lock.alpha);
      ctx.lineWidth = this.thickness;
      ctx.strokeStyle = this.rgba(1);

      const x = Math.round(s.x);
      const y = Math.round(s.y);

      // Horizontal line segments with gap
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(Math.max(0, x - this.gap), y);
      ctx.moveTo(Math.min(this.size.w, x + this.gap), y);
      ctx.lineTo(this.size.w, y);

      // Vertical line segments with gap
      ctx.moveTo(x, 0);
      ctx.lineTo(x, Math.max(0, y - this.gap));
      ctx.moveTo(x, Math.min(this.size.h, y + this.gap));
      ctx.lineTo(x, this.size.h);
      ctx.stroke();
    }

    // Lock-on brackets
    if (s.lock.alpha > 0.005) {
      const { x, y, w, h, alpha } = s.lock;
      ctx.globalAlpha = alpha * this.opacity * 1.2;
      ctx.strokeStyle = this.rgba(1);
      ctx.lineWidth = Math.max(1.5, this.thickness);
      ctx.lineCap = 'square';

      const arm = Math.min(12, w / 3, h / 3);
      ctx.beginPath();
      // Top-left
      ctx.moveTo(x, y + arm);
      ctx.lineTo(x, y);
      ctx.lineTo(x + arm, y);
      // Top-right
      ctx.moveTo(x + w - arm, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + arm);
      // Bottom-left
      ctx.moveTo(x, y + h - arm);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + arm, y + h);
      // Bottom-right
      ctx.moveTo(x + w - arm, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w, y + h - arm);
      ctx.stroke();
    }

    // Pulses
    s.pulses.forEach(pulse => {
      const t = pulse.age / 0.55;
      const eased = 1 - Math.pow(1 - t, 3);
      ctx.globalAlpha = Math.pow(1 - t, 2) * this.opacity;
      ctx.strokeStyle = this.rgba(1);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, 4 + 28 * eased, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
  }

  destroy() {
    this.alive = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('mousemove', this.onPointerMove);
    if (this.container) {
      this.container.removeEventListener('mouseleave', this.onPointerLeave);
      this.container.removeEventListener('click', this.onClick);
    }
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
