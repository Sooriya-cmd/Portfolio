/**
 * techText.js — Canvas-based interactive wordmark effect
 * Barlow Condensed 900 display wordmark with dashed vector outline on hover,
 * moving selection frame, corner connectors, specks, idle sweep, and click-kick spring physics.
 */

export class TechText {
  constructor(container, options = {}) {
    this.container = container;
    this.text = options.text || 'JAYASOORIYA';
    this.fontFamily = options.fontFamily || '"Barlow Condensed", sans-serif';
    this.fontWeight = options.fontWeight || 900;
    this.textColor = options.color || '#121324';
    this.accentColor = options.accentColor || '#2EE5EF';
    this.dashLength = options.dashLength || 4;
    this.dashGap = options.dashGap || 2;
    this.strokeWidth = options.strokeWidth || 1.5;
    this.specksCount = options.specks || 8;
    this.clickKick = options.clickKick !== false;
    this.bounce = options.bounce || 0.3;
    this.speed = options.speed || 0.45;
    this.sweepEnabled = options.sweep !== false;
    this.introDuration = options.introDuration || 1.8;

    this.letters = [];
    this.activeLetterIndex = -1;
    this.framePos = { x: 0, y: 0, width: 0, height: 0 };
    this.targetFrame = null;
    this.frameAlpha = 0;
    this.pointerX = -9999;
    this.pointerY = -9999;
    this.isHovered = false;
    this.idleTimer = 0;
    this.introProgress = 0;
    this.startTime = performance.now();
    this.lastTime = performance.now();
    this.animId = null;

    // Specks pool
    this.specks = [];
    for (let i = 0; i < this.specksCount; i++) {
      this.specks.push({
        relX: (Math.random() - 0.5) * 40,
        relY: (Math.random() - 0.5) * 40,
        size: 1.5 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      });
    }

    this.initDOM();
    this.measureAndLayout();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'tech-text-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.ctx = this.canvas.getContext('2d');

    this.container.classList.add('tech-text-wrap');
    this.container.appendChild(this.canvas);
  }

  measureAndLayout() {
    if (!this.container || !this.canvas) return;
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(rect.width, 240);
    
    // Fluid responsive font size based on container width
    const targetSize = Math.max(34, Math.min(width / (this.text.length * 0.62), 82));
    this.fontSize = Math.round(targetSize);

    this.canvasWidth = width;
    this.canvasHeight = Math.round(this.fontSize * 1.35);

    this.canvas.width = Math.round(this.canvasWidth * dpr);
    this.canvas.height = Math.round(this.canvasHeight * dpr);
    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Measure letter bounding boxes
    this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.ctx.textBaseline = 'alphabetic';

    const baselineY = Math.round(this.canvasHeight * 0.82);
    let currentX = 0;
    this.letters = [];

    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i];
      const metrics = this.ctx.measureText(char);
      const letterWidth = metrics.width;
      const letterHeight = this.fontSize;
      const letterY = baselineY - letterHeight * 0.85;

      this.letters.push({
        char,
        x: currentX,
        y: letterY,
        width: letterWidth,
        height: letterHeight,
        baselineY,
        offsetY: 0,
        velocityY: 0,
        dashPhase: 0,
        outlineAlpha: 0,
        kickAmount: 0
      });

      // Slight tracking adjustment
      currentX += letterWidth + (this.fontSize * -0.02);
    }
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointerX = e.clientX - rect.left;
      this.pointerY = e.clientY - rect.top;
      this.isHovered = true;
      this.idleTimer = 0;

      let found = -1;
      for (let i = 0; i < this.letters.length; i++) {
        const l = this.letters[i];
        if (
          this.pointerX >= l.x - 4 &&
          this.pointerX <= l.x + l.width + 4 &&
          this.pointerY >= l.y - 10 &&
          this.pointerY <= l.y + l.height + 10
        ) {
          found = i;
          break;
        }
      }
      this.activeLetterIndex = found;
    };

    this.onPointerLeave = () => {
      this.isHovered = false;
      this.activeLetterIndex = -1;
    };

    this.onClick = (e) => {
      if (!this.clickKick) return;
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      let targetIdx = this.activeLetterIndex;
      if (targetIdx === -1) {
        let minDist = Infinity;
        for (let i = 0; i < this.letters.length; i++) {
          const midX = this.letters[i].x + this.letters[i].width / 2;
          const dist = Math.abs(clickX - midX);
          if (dist < minDist) {
            minDist = dist;
            targetIdx = i;
          }
        }
      }

      if (targetIdx !== -1) {
        // Kick selected letter upwards and ripple neighbors
        for (let i = 0; i < this.letters.length; i++) {
          const dist = Math.abs(i - targetIdx);
          const power = Math.max(0, 1 - dist * 0.28);
          const delay = dist * 35; // ripple delay in ms
          setTimeout(() => {
            if (this.letters[i]) {
              this.letters[i].velocityY = -14 * power;
              this.letters[i].outlineAlpha = Math.max(this.letters[i].outlineAlpha, power);
            }
          }, delay);
        }
      }
    };

    this.canvas.addEventListener('mousemove', this.onPointerMove);
    this.canvas.addEventListener('mouseleave', this.onPointerLeave);
    this.canvas.addEventListener('click', this.onClick);

    this.resizeObserver = new ResizeObserver(() => {
      this.measureAndLayout();
    });
    this.resizeObserver.observe(this.container);
  }

  startLoop() {
    const loop = (now) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;
      this.update(dt, now);
      this.render(now);
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  update(dt, now) {
    const elapsed = (now - this.startTime) / 1000;
    this.introProgress = Math.min(1, elapsed / this.introDuration);
    this.idleTimer += dt;

    // Spring physics update for letter jump
    for (let i = 0; i < this.letters.length; i++) {
      const l = this.letters[i];
      if (l.offsetY !== 0 || l.velocityY !== 0) {
        // Spring equation: F = -k*x - c*v
        const springK = 220;
        const damping = 14;
        const force = -springK * l.offsetY - damping * l.velocityY;
        l.velocityY += force * dt;
        l.offsetY += l.velocityY * dt;

        if (Math.abs(l.offsetY) < 0.1 && Math.abs(l.velocityY) < 0.2) {
          l.offsetY = 0;
          l.velocityY = 0;
        }
      }

      // Outline transition
      const isTarget = (i === this.activeLetterIndex);
      const targetOutline = isTarget ? 1 : 0;
      l.outlineAlpha += (targetOutline - l.outlineAlpha) * 0.2;
      l.dashPhase += dt * 8;
    }

    // Frame interpolation
    if (this.activeLetterIndex >= 0 && this.letters[this.activeLetterIndex]) {
      const l = this.letters[this.activeLetterIndex];
      this.targetFrame = {
        x: l.x - 4,
        y: l.y - 4 + l.offsetY,
        width: l.width + 8,
        height: l.height + 8
      };
      this.frameAlpha += (1 - this.frameAlpha) * 0.22;
    } else {
      this.targetFrame = null;
      this.frameAlpha += (0 - this.frameAlpha) * 0.15;
    }

    if (this.targetFrame) {
      this.framePos.x += (this.targetFrame.x - this.framePos.x) * 0.25;
      this.framePos.y += (this.targetFrame.y - this.framePos.y) * 0.25;
      this.framePos.width += (this.targetFrame.width - this.framePos.width) * 0.25;
      this.framePos.height += (this.targetFrame.height - this.framePos.height) * 0.25;
    }
  }

  render(now) {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    const totalLetters = this.letters.length;
    const revealedCount = Math.floor(this.introProgress * (totalLetters + 1));
    const sweepPhase = (now * 0.001 * this.speed) % 1;
    const sweepX = sweepPhase * (this.canvasWidth + 100) - 50;

    this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.ctx.textBaseline = 'alphabetic';

    for (let i = 0; i < Math.min(revealedCount, totalLetters); i++) {
      const l = this.letters[i];
      const drawY = l.baselineY + l.offsetY;

      // 1. Draw solid letter fill
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, 1 - l.outlineAlpha);
      this.ctx.fillStyle = this.textColor;
      this.ctx.fillText(l.char, l.x, drawY);

      // Idle sweep sheen across letters
      if (this.sweepEnabled && !this.isHovered && this.introProgress >= 1) {
        const distToSweep = Math.abs((l.x + l.width / 2) - sweepX);
        if (distToSweep < 40) {
          const sweepIntensity = (1 - distToSweep / 40) * 0.45;
          this.ctx.globalAlpha = sweepIntensity;
          this.ctx.fillStyle = this.accentColor;
          this.ctx.fillText(l.char, l.x, drawY);
        }
      }
      this.ctx.restore();

      // 2. Draw dashed vector outline for hovered/kicking letter
      if (l.outlineAlpha > 0.01) {
        this.ctx.save();
        this.ctx.globalAlpha = l.outlineAlpha;
        this.ctx.strokeStyle = this.accentColor;
        this.ctx.lineWidth = this.strokeWidth;
        this.ctx.setLineDash([this.dashLength, this.dashGap]);
        this.ctx.lineDashOffset = -l.dashPhase;
        this.ctx.strokeText(l.char, l.x, drawY);
        this.ctx.restore();
      }
    }

    // 3. Draw active letter selection frame with subtle corner brackets & specks
    if (this.frameAlpha > 0.02) {
      const f = this.framePos;
      this.ctx.save();
      this.ctx.globalAlpha = this.frameAlpha;
      this.ctx.strokeStyle = this.accentColor;
      this.ctx.lineWidth = 1;

      // Outer dashed bounding box
      this.ctx.setLineDash([3, 3]);
      this.ctx.strokeRect(f.x, f.y, f.width, f.height);
      this.ctx.setLineDash([]);

      // Corner accent brackets
      const corner = 4;
      this.ctx.beginPath();
      // Top-left
      this.ctx.moveTo(f.x - 2, f.y + corner);
      this.ctx.lineTo(f.x - 2, f.y - 2);
      this.ctx.lineTo(f.x + corner, f.y - 2);
      // Top-right
      this.ctx.moveTo(f.x + f.width - corner, f.y - 2);
      this.ctx.lineTo(f.x + f.width + 2, f.y - 2);
      this.ctx.lineTo(f.x + f.width + 2, f.y + corner);
      // Bottom-left
      this.ctx.moveTo(f.x - 2, f.y + f.height - corner);
      this.ctx.lineTo(f.x - 2, f.y + f.height + 2);
      this.ctx.lineTo(f.x + corner, f.y + f.height + 2);
      // Bottom-right
      this.ctx.moveTo(f.x + f.width - corner, f.y + f.height + 2);
      this.ctx.lineTo(f.x + f.width + 2, f.y + f.height + 2);
      this.ctx.lineTo(f.x + f.width + 2, f.y + f.height - corner);
      this.ctx.stroke();

      // Specks around selection frame
      const midX = f.x + f.width / 2;
      const midY = f.y + f.height / 2;
      this.ctx.fillStyle = this.accentColor;
      for (let i = 0; i < this.specks.length; i++) {
        const s = this.specks[i];
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.005 + s.phase);
        this.ctx.globalAlpha = this.frameAlpha * s.alpha * pulse;
        this.ctx.fillRect(midX + s.relX, midY + s.relY, s.size, s.size);
      }

      this.ctx.restore();
    }
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.onPointerMove);
      this.canvas.removeEventListener('mouseleave', this.onPointerLeave);
      this.canvas.removeEventListener('click', this.onClick);
      if (this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }
}
