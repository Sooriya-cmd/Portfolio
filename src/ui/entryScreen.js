/**
 * entryScreen.js — Entry / Welcome Screen Modal (3D vs Non-3D entry)
 */

import gsap from 'gsap';
import content from '../config/content.json';

export function initEntryScreen({ onEnter3D, onEnter2D }) {
  // Check if entry screen already exists
  let entryEl = document.getElementById('entry-screen');
  if (!entryEl) {
    entryEl = document.createElement('div');
    entryEl.id = 'entry-screen';
    entryEl.className = 'entry-screen-overlay';
    entryEl.innerHTML = `
      <div class="entry-card-wrap">
        <!-- Peeking Mascot Head -->
        <div class="entry-mascot-peek" aria-hidden="true">
          <div class="mascot-eye left"></div>
          <div class="mascot-eye right"></div>
          <div class="mascot-beak"></div>
          <div class="entry-hi-bubble">hi</div>
        </div>

        <!-- Center START Circle Medallion -->
        <button id="btn-enter-3d" class="entry-circle-btn" aria-label="Enter 3D Street Experience">
          <span class="entry-play-icon" aria-hidden="true">▶</span>
          <span class="entry-btn-text">${content.entry.enter3DLabel || 'START'}</span>
          <span class="entry-speaker-badge" title="Sound is opt-in" aria-hidden="true">♫</span>
        </button>

        <!-- Entry Choice Pills -->
        <div class="entry-pills-wrap">
          <button id="btn-enter-nosound" class="entry-pill-btn">
            <span aria-hidden="true">🔇</span>
            <span>${content.entry.enterWithoutSoundLabel || 'ENTER WITHOUT SOUND'}</span>
          </button>
          
          <button id="btn-enter-2d" class="entry-pill-btn">
            <span aria-hidden="true">📄</span>
            <span>${content.entry.enterWithout3DLabel || 'ENTER WITHOUT 3D'}</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(entryEl);
  }

  const btn3D = document.getElementById('btn-enter-3d');
  const btnNoSound = document.getElementById('btn-enter-nosound');
  const btn2D = document.getElementById('btn-enter-2d');

  function dismiss(callback) {
    gsap.to(entryEl, {
      opacity: 0,
      scale: 0.96,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        entryEl.style.display = 'none';
        if (callback) callback();
      }
    });
  }

  btn3D.addEventListener('click', () => {
    dismiss(() => {
      document.body.classList.remove('is-2d-mode');
      document.body.classList.add('is-3d-mode');
      if (onEnter3D) onEnter3D({ sound: false });
    });
  });

  btnNoSound.addEventListener('click', () => {
    dismiss(() => {
      document.body.classList.remove('is-2d-mode');
      document.body.classList.add('is-3d-mode');
      if (onEnter3D) onEnter3D({ sound: false });
    });
  });

  btn2D.addEventListener('click', () => {
    dismiss(() => {
      document.body.classList.add('is-2d-mode');
      document.body.classList.remove('is-3d-mode');
      if (onEnter2D) onEnter2D();
    });
  });
}
