/**
 * decryptedText.js — Technical Scramble & Decryption Text Effect
 * Ported from React Bits <DecryptedText /> component to Vanilla JS ES Module.
 * Scrambles technical characters and sequentially resolves into final text.
 */

const FADE_FLOOR = 0.2;
const FADE_PEAK = 0.75;
const FADE_LEAD = 6;
const SETTLE = 'color 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+{}[]:;<>,.?/~0123456789';

const isSpace = char => /\s/.test(char);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false);

const glyphWidths = new Map();
let measureContext = null;

const readFont = node => {
  if (typeof window === 'undefined') return { font: '16px monospace', spacing: 0 };
  const style = window.getComputedStyle(node);
  return {
    font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
    spacing: parseFloat(style.letterSpacing) || 0
  };
};

const advance = (font, glyph) => {
  let widths = glyphWidths.get(font);
  if (!widths) {
    widths = new Map();
    glyphWidths.set(font, widths);
  }
  let width = widths.get(glyph);
  if (width === undefined) {
    measureContext = measureContext || document.createElement('canvas').getContext('2d');
    if (!measureContext) return 0;
    measureContext.font = font;
    width = measureContext.measureText(glyph).width;
    widths.set(glyph, width);
  }
  return width;
};

export class DecryptedText {
  /**
   * @param {HTMLElement} element - Target container element
   * @param {Object} options
   */
  constructor(element, options = {}) {
    this.element = element;
    if (!this.element) return;

    this.text = options.text !== undefined ? String(options.text) : (this.element.textContent || '').trim();
    this.duration = options.duration ?? 2200; // 2.0 to 2.5 seconds duration
    this.speed = Math.max(16, options.speed ?? 40);
    this.maxIterations = options.maxIterations ?? 10;
    this.sequential = options.sequential !== false;
    this.revealDirection = options.revealDirection || 'start';
    this.scrambleColor = options.scrambleColor || '#2EE5EF';
    this.characters = options.characters || DEFAULT_CHARS;
    this.animateOn = options.animateOn || 'view'; // 'view', 'manual', 'hover'
    this.loop = options.loop || false;
    this.loopDelay = options.loopDelay || 2000;
    this.useOriginalCharsOnly = options.useOriginalCharsOnly || false;
    this.parentClassName = options.parentClassName || '';
    this.className = options.className || '';
    this.encryptedClassName = options.encryptedClassName || 'decrypted-encrypted';

    this.timer = null;
    this.holdTimer = null;
    this.observer = null;
    this.played = false;
    this.run = null;
    this.cells = [];
    this.font = null;

    this.init();
  }

  init() {
    this.setupPool();
    this.buildDOM();

    if (prefersReducedMotion()) {
      this.resolveImmediately();
      return;
    }

    if (this.animateOn === 'view') {
      this.setupObserver();
    } else if (this.animateOn === 'manual') {
      // Wait for explicit start() call
    }
  }

  setupPool() {
    this.chars = Array.from(this.text);
    const letters = this.chars.filter(c => !isSpace(c));
    this.pool = this.useOriginalCharsOnly && letters.length
      ? Array.from(new Set(letters))
      : Array.from(this.characters);
    if (!this.pool.length) this.pool = ['#', '!', '?', '@', '*', '+', '%'];
  }

  buildDOM() {
    this.element.innerHTML = '';
    this.element.classList.add('decrypted-text-root');
    if (this.parentClassName) {
      this.element.classList.add(this.parentClassName);
    }

    // Accessible screen reader element
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = this.text;
    this.element.appendChild(srOnly);

    // Visual animated container
    this.displaySpan = document.createElement('span');
    this.displaySpan.setAttribute('aria-hidden', 'true');
    this.displaySpan.className = 'decrypted-text-display';
    Object.assign(this.displaySpan.style, {
      display: 'inline-block',
      whiteSpace: 'pre-wrap',
      position: 'relative'
    });
    this.element.appendChild(this.displaySpan);

    // Group into words
    this.cells = [];
    this.mask = this.chars.map(c => isSpace(c));

    let currentWord = null;

    this.chars.forEach((char, index) => {
      if (isSpace(char)) {
        if (char === '\n') {
          this.displaySpan.appendChild(document.createElement('br'));
        } else {
          const spaceNode = document.createTextNode(char);
          this.displaySpan.appendChild(spaceNode);
        }
        currentWord = null;
        this.cells.push(null);
        return;
      }

      if (!currentWord) {
        currentWord = document.createElement('span');
        currentWord.style.whiteSpace = 'nowrap';
        currentWord.style.display = 'inline-block';
        this.displaySpan.appendChild(currentWord);
      }

      const cell = document.createElement('span');
      cell.className = `decrypted-cell ${this.encryptedClassName}`;
      Object.assign(cell.style, {
        position: 'relative',
        display: 'inline-block'
      });

      // Ghost span to hold exact glyph width
      const ghost = document.createElement('span');
      ghost.className = 'decrypted-ghost';
      ghost.style.visibility = 'hidden';
      ghost.textContent = char;
      cell.appendChild(ghost);

      // Glyph span showing scrambled or resolved char
      const glyph = document.createElement('span');
      glyph.className = 'decrypted-glyph';
      Object.assign(glyph.style, {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        color: this.scrambleColor,
        transition: SETTLE
      });
      glyph.textContent = this.getRandomGlyph(char, index);
      cell.appendChild(glyph);

      currentWord.appendChild(cell);
      this.cells.push({ cell, ghost, glyph, char });
    });
  }

  getRandomGlyph(char, index) {
    const seed = char.codePointAt(0) + index * 7;
    return this.pool[seed % this.pool.length];
  }

  fit(index, glyph) {
    if (!this.font && this.element) {
      this.font = readFont(this.element);
    }
    if (!this.font) return 1;
    const room = advance(this.font.font, this.chars[index] ?? glyph) + this.font.spacing;
    const need = advance(this.font.font, glyph) + this.font.spacing;
    return need > room + 0.01 ? Math.round(Math.max(0.05, room / need) * 1000) / 1000 : 1;
  }

  revealOrder() {
    const order = [];
    this.chars.forEach((char, index) => {
      if (!isSpace(char)) order.push(index);
    });
    if (this.revealDirection === 'end') return order.reverse();
    if (this.revealDirection === 'center') {
      const middle = Math.floor(this.chars.length / 2);
      return order.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle));
    }
    if (this.revealDirection === 'random') {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }
    return order;
  }

  setupObserver() {
    if (typeof IntersectionObserver === 'undefined') {
      this.start();
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting);
        if (visible && !this.played) {
          this.played = true;
          this.start();
          if (!this.loop) {
            this.observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    this.observer.observe(this.element);
  }

  start() {
    if (prefersReducedMotion()) {
      this.resolveImmediately();
      return;
    }

    this.stop();
    const order = this.revealOrder();
    const letterCount = order.length;
    const totalTicks = Math.max(16, Math.round(this.duration / this.speed));

    // First ~20% of ticks (e.g. 450ms): all letters actively scramble
    const leadTicks = Math.round(totalTicks * 0.22);
    const resolveWindow = Math.max(1, totalTicks - leadTicks - 2);

    const lockTicks = new Map();
    order.forEach((charIndex, rank) => {
      const lockAt = leadTicks + Math.floor((rank / Math.max(1, letterCount - 1)) * resolveWindow);
      lockTicks.set(charIndex, lockAt);
    });

    this.run = {
      tick: 0,
      totalTicks,
      lockTicks
    };

    this.timer = setInterval(() => this.tick(), this.speed);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    clearTimeout(this.holdTimer);
    this.holdTimer = null;
    this.run = null;
  }

  resolveImmediately() {
    this.stop();
    this.mask = this.chars.map(() => true);
    this.cells.forEach(item => {
      if (!item) return;
      item.glyph.textContent = item.char;
      item.glyph.style.color = '';
      item.glyph.style.opacity = '1';
      item.glyph.style.transform = 'translateX(-50%) scaleX(1)';
      item.cell.className = `decrypted-cell ${this.className}`;
    });
  }

  tick() {
    if (!this.run) return;

    this.run.tick += 1;
    const currentTick = this.run.tick;
    const lockTicks = this.run.lockTicks;

    this.chars.forEach((char, index) => {
      if (isSpace(char)) {
        this.mask[index] = true;
        return;
      }
      const lockAt = lockTicks.get(index);
      if (lockAt !== undefined && currentTick >= lockAt) {
        this.mask[index] = true;
      } else {
        this.mask[index] = false;
      }
    });

    // Paint updated frame
    this.cells.forEach((item, index) => {
      if (!item) return;
      const isRevealed = this.mask[index];
      if (isRevealed) {
        item.glyph.textContent = item.char;
        item.glyph.style.color = '';
        item.glyph.style.opacity = '1';
        item.glyph.style.transform = 'translateX(-50%) scaleX(1)';
        item.cell.className = `decrypted-cell ${this.className}`;
      } else {
        const randomChar = this.pool[Math.floor(Math.random() * this.pool.length)];
        const squeeze = this.fit(index, randomChar);
        item.glyph.textContent = randomChar;
        item.glyph.style.color = this.scrambleColor;
        item.glyph.style.opacity = String(FADE_FLOOR + (FADE_PEAK - FADE_FLOOR) * 0.85);
        item.glyph.style.transform = `translateX(-50%) scaleX(${squeeze})`;
        item.cell.className = `decrypted-cell ${this.encryptedClassName}`;
      }
    });

    if (currentTick >= this.run.totalTicks) {
      this.stop();
      this.resolveImmediately();
      if (this.loop) {
        this.holdTimer = setTimeout(() => {
          this.mask = this.chars.map(c => isSpace(c));
          this.start();
        }, this.loopDelay);
      }
    }
  }

  /**
   * Update with new text (used for carousel switching)
   */
  setText(newText) {
    this.text = String(newText || '').trim();
    this.stop();
    this.setupPool();
    this.buildDOM();
    this.start();
  }

  destroy() {
    this.stop();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Global helper to attach DecryptedText to an element or selector
 */
export function applyDecryptedText(target, options = {}) {
  const elements = typeof target === 'string'
    ? Array.from(document.querySelectorAll(target))
    : [target].filter(Boolean);

  return elements.map(el => new DecryptedText(el, options));
}
