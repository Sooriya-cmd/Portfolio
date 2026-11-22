/**
 * splitFlapText.js — Mechanical character flip engine with 'minimal' tileStyle
 * Bare flipping glyphs split by a central hinge line.
 * NO boxes, NO rectangular tile borders, NO departure-board backgrounds.
 */

const CHARSETS = {
  alpha: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ&.-',
  alphanumeric: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&.-'
};

export class SplitFlapText {
  constructor(container, options = {}) {
    this.container = container;
    this.words = options.words || [
      'MACHINE LEARNING',
      'AGENTIC AI',
      'PYTHON & AI',
      'SOFTWARE BUILDER'
    ];
    this.wordIndex = 0;
    this.flipDuration = options.flipDuration || 0.10;
    this.stagger = options.stagger || 0.035;
    this.cycleDelay = options.cycleDelay || 2600;
    this.flipsPerChar = options.flipsPerChar || 5;
    this.charset = CHARSETS[options.charset] || CHARSETS.alpha;
    this.fontSize = options.fontSize || '1.15rem';
    this.loop = options.loop !== false;
    this.timer = null;
    this.destroyed = false;

    // Pad length to max length across words to keep width stable
    this.maxLen = Math.max(...this.words.map(w => w.length));
    this.currentText = (this.words[0] || '').padEnd(this.maxLen, ' ');

    this.initDOM();
    this.startCycle();
  }

  initDOM() {
    this.el = document.createElement('div');
    this.el.className = 'split-flap-text split-flap-text--minimal';
    this.el.setAttribute('aria-label', this.words[0]);

    // Visually hidden live region for screen readers (announced on phrase completion)
    this.srEl = document.createElement('span');
    this.srEl.className = 'split-flap-text__sr';
    this.srEl.textContent = this.words[0];
    this.el.appendChild(this.srEl);

    this.tiles = [];
    for (let i = 0; i < this.maxLen; i++) {
      const tile = document.createElement('span');
      tile.className = 'split-flap-text__tile';
      tile.setAttribute('aria-hidden', 'true');

      const char = this.currentText[i] || ' ';
      tile.innerHTML = `
        <span class="split-flap-text__half split-flap-text__half--top">
          <span class="split-flap-text__char">${char === ' ' ? '&nbsp;' : char}</span>
        </span>
        <span class="split-flap-text__half split-flap-text__half--bottom">
          <span class="split-flap-text__char">${char === ' ' ? '&nbsp;' : char}</span>
        </span>
      `;

      this.el.appendChild(tile);
      this.tiles.push({
        el: tile,
        current: char,
        topChar: tile.querySelector('.split-flap-text__half--top .split-flap-text__char'),
        bottomChar: tile.querySelector('.split-flap-text__half--bottom .split-flap-text__char')
      });
    }

    this.container.appendChild(this.el);
  }

  flipTileTo(tileIndex, targetChar, totalFlips, onComplete) {
    if (this.destroyed) return;
    const tile = this.tiles[tileIndex];
    if (!tile) return;

    let flipsLeft = totalFlips;
    let currentChar = tile.current;

    const doNextFlip = () => {
      if (this.destroyed) return;
      if (flipsLeft <= 1) {
        currentChar = targetChar;
      } else {
        const randIdx = Math.floor(Math.random() * this.charset.length);
        currentChar = this.charset[randIdx];
      }

      const nextChar = currentChar;
      const prevChar = tile.current;

      // Animate single flap transition
      tile.el.classList.add('is-flipping');

      // Create animated flaps
      const frontFlap = document.createElement('span');
      frontFlap.className = 'split-flap-text__flap split-flap-text__flap--front';
      frontFlap.innerHTML = `<span class="split-flap-text__char">${prevChar === ' ' ? '&nbsp;' : prevChar}</span>`;

      const backFlap = document.createElement('span');
      backFlap.className = 'split-flap-text__flap split-flap-text__flap--back';
      backFlap.innerHTML = `<span class="split-flap-text__char">${nextChar === ' ' ? '&nbsp;' : nextChar}</span>`;

      tile.topChar.innerHTML = (nextChar === ' ' ? '&nbsp;' : nextChar);
      tile.el.appendChild(frontFlap);
      tile.el.appendChild(backFlap);

      setTimeout(() => {
        if (this.destroyed) return;
        tile.current = nextChar;
        tile.bottomChar.innerHTML = (nextChar === ' ' ? '&nbsp;' : nextChar);
        tile.el.classList.remove('is-flipping');
        if (frontFlap.parentNode) frontFlap.parentNode.removeChild(frontFlap);
        if (backFlap.parentNode) backFlap.parentNode.removeChild(backFlap);

        flipsLeft--;
        if (flipsLeft > 0) {
          doNextFlip();
        } else if (onComplete) {
          onComplete();
        }
      }, this.flipDuration * 1000);
    };

    doNextFlip();
  }

  transitionTo(nextWord) {
    if (this.destroyed) return;
    const targetWord = nextWord.padEnd(this.maxLen, ' ');
    let pendingTiles = 0;

    for (let i = 0; i < this.maxLen; i++) {
      const targetChar = targetWord[i];
      if (this.tiles[i].current !== targetChar) {
        pendingTiles++;
        const delay = i * this.stagger * 1000;
        setTimeout(() => {
          this.flipTileTo(i, targetChar, this.flipsPerChar, () => {
            pendingTiles--;
            if (pendingTiles <= 0) {
              if (this.srEl) this.srEl.textContent = nextWord;
              this.scheduleNextWord();
            }
          });
        }, delay);
      }
    }

    if (pendingTiles === 0) {
      this.scheduleNextWord();
    }
  }

  scheduleNextWord() {
    if (this.destroyed) return;
    this.timer = setTimeout(() => {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.transitionTo(this.words[this.wordIndex]);
    }, this.cycleDelay);
  }

  startCycle() {
    this.timer = setTimeout(() => {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.transitionTo(this.words[this.wordIndex]);
    }, this.cycleDelay);
  }

  destroy() {
    this.destroyed = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}
