/**
 * entryScreen.js — Circular Entrance Screen with Developer Illustration and Interactive Mascot
 * Integrated with GradientASCII (eclipse ASCII gradient) and ScrollExpand (circular reveal).
 */

import gsap from 'gsap';
import { GradientASCII } from '../effects/gradientAscii.js';
import { CircularScrollExpand } from '../effects/scrollExpand.js';

export function initEntryScreen({ onEnter3D }) {
  let entryEl = document.getElementById('entry-screen');
  const isMobile = window.innerWidth <= 768;
  const instructionText = isMobile ? 'SWIPE TO REVEAL ↓' : 'SCROLL TO REVEAL ↓';

  if (!entryEl) {
    entryEl = document.createElement('div');
    entryEl.id = 'entry-screen';
    entryEl.className = 'entry-screen-overlay';
    entryEl.innerHTML = `
      <!-- ASCII Gradient Background Field (Layered Behind Entrance Card) -->
      <div id="entry-ascii-bg" class="entry-screen-ascii-bg" aria-hidden="true"></div>

      <div class="entry-card-wrap">
        <!-- Peeking Mascot Head with Interactive Pupils -->
        <div class="entry-mascot-peek" id="entry-mascot-head" aria-hidden="true">
          <div class="mascot-eye left" id="entry-eye-left">
            <div class="mascot-pupil" id="entry-pupil-left"></div>
          </div>
          <div class="mascot-eye right" id="entry-eye-right">
            <div class="mascot-pupil" id="entry-pupil-right"></div>
          </div>
          <div class="mascot-beak"></div>
          <div class="mascot-blush left"></div>
          <div class="mascot-blush right"></div>
          <div class="entry-hi-bubble" id="entry-hi-bubble">hi</div>
        </div>

        <!-- Center Interactive Circular Developer Illustration Frame (Only p.png, No ASCII Overlay Inside) -->
        <button id="btn-enter-hero" class="entry-circle-btn" aria-label="Enter Jayasooriya's Portfolio">
          <div class="entry-image-container" id="entry-image-frame">
            <img src="${import.meta.env.BASE_URL}p.png" alt="Jayasooriya Developer Illustration" class="entry-hero-img" id="entry-hero-img" />
          </div>
          <div class="entry-border-ring cyan"></div>
          <div class="entry-border-ring pink"></div>
        </button>

        <!-- Scroll / Swipe Reveal Instruction -->
        <div class="scroll-expand-instruction" id="scroll-expand-hint">
          ${instructionText}
        </div>
      </div>
    `;
    document.body.appendChild(entryEl);
  }

  const btnHero = document.getElementById('btn-enter-hero');
  const imageFrame = document.getElementById('entry-image-frame');
  const heroImg = document.getElementById('entry-hero-img');
  const asciiMount = document.getElementById('entry-ascii-bg');
  const hintEl = document.getElementById('scroll-expand-hint');
  const hiBubble = document.getElementById('entry-hi-bubble');
  const pupilLeft = document.getElementById('entry-pupil-left');
  const pupilRight = document.getElementById('entry-pupil-right');
  const eyeLeft = document.getElementById('entry-eye-left');
  const eyeRight = document.getElementById('entry-eye-right');

  // Initialize GradientASCII layered behind the illustration
  let asciiInstance = null;
  if (asciiMount) {
    asciiInstance = new GradientASCII(asciiMount, {
      colors: ['#3165E0', '#2EE5EF', '#DFD5F5', '#6745A8'],
      characters: ' .:-=+*#@',
      cellSize: 18,
      density: 0.55,
      glyphOpacity: 0.48,
      gradientOpacity: 0.22,
      softness: 0.65,
      scale: 1.1,
      flow: 0.2,
      speed: 0.4,
      flicker: 0.08
    });
  }

  // Smooth pop-up entrance animation for speech bubble
  if (hiBubble) {
    gsap.fromTo(
      hiBubble,
      { scale: 0.75, opacity: 0, y: 10 },
      { scale: 1, opacity: 1, y: 0, duration: 0.55, delay: 0.3, ease: 'back.out(1.4)' }
    );
  }

  // Smooth Eye Tracking for Entrance Bird
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentLX = 0, currentLY = 0;
  let currentRX = 0, currentRY = 0;
  let animId = null;

  function trackMouse(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  window.addEventListener('mousemove', trackMouse, { passive: true });

  function updatePupils() {
    if (!entryEl || entryEl.style.display === 'none') {
      cancelAnimationFrame(animId);
      return;
    }

    if (eyeLeft && pupilLeft) {
      const rectL = eyeLeft.getBoundingClientRect();
      const eyeCenterX = rectL.left + rectL.width / 2;
      const eyeCenterY = rectL.top + rectL.height / 2;
      const dx = mouseX - eyeCenterX;
      const dy = mouseY - eyeCenterY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy) * 0.05, 3.5);
      const targetX = Math.cos(angle) * dist;
      const targetY = Math.sin(angle) * (dist * 1.3);

      currentLX += (targetX - currentLX) * 0.15;
      currentLY += (targetY - currentLY) * 0.15;
      pupilLeft.style.transform = `translate(${currentLX.toFixed(2)}px, ${currentLY.toFixed(2)}px)`;
    }

    if (eyeRight && pupilRight) {
      const rectR = eyeRight.getBoundingClientRect();
      const eyeCenterX = rectR.left + rectR.width / 2;
      const eyeCenterY = rectR.top + rectR.height / 2;
      const dx = mouseX - eyeCenterX;
      const dy = mouseY - eyeCenterY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy) * 0.05, 3.5);
      const targetX = Math.cos(angle) * dist;
      const targetY = Math.sin(angle) * (dist * 1.3);

      currentRX += (targetX - currentRX) * 0.15;
      currentRY += (targetY - currentRY) * 0.15;
      pupilRight.style.transform = `translate(${currentRX.toFixed(2)}px, ${currentRY.toFixed(2)}px)`;
    }

    animId = requestAnimationFrame(updatePupils);
  }

  animId = requestAnimationFrame(updatePupils);

  // Transition into 3D Mode
  let isOpening = false;
  function triggerEntryTransition() {
    if (isOpening) return;
    isOpening = true;

    // Dissolve greeting bubble
    gsap.to(hiBubble, { scale: 0, opacity: 0, duration: 0.25 });
    gsap.to('#entry-mascot-head', { y: -20, opacity: 0, duration: 0.35 });
    if (hintEl) gsap.to(hintEl, { opacity: 0, duration: 0.25 });

    // Animate circular frame expanding outwards
    const tl = gsap.timeline({
      onComplete: () => {
        entryEl.style.display = 'none';
        window.removeEventListener('mousemove', trackMouse);
        if (animId) cancelAnimationFrame(animId);
        if (asciiInstance) asciiInstance.destroy();
        if (scrollExpandInstance) scrollExpandInstance.destroy();

        document.body.classList.remove('is-2d-mode');
        document.body.classList.add('is-3d-mode');
        if (onEnter3D) onEnter3D();
      }
    });

    tl.to(btnHero, {
      scale: 1.08,
      duration: 0.2,
      ease: 'power1.out'
    })
    .to('.entry-border-ring.cyan', {
      scale: 2.2,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.1')
    .to('.entry-border-ring.pink', {
      scale: 2.6,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.5')
    .to(btnHero, {
      scale: 14,
      opacity: 0,
      duration: 0.75,
      ease: 'expo.inOut'
    }, '-=0.5')
    .to(entryEl, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.inOut'
    }, '-=0.4');
  }

  // Initialize CircularScrollExpand (drives circular clip by scroll/swipe)
  const scrollExpandInstance = new CircularScrollExpand({
    frameEl: imageFrame,
    imageEl: heroImg,
    hintEl: hintEl,
    onComplete: triggerEntryTransition
  });

  // Clicking the circular button triggers expansion directly
  btnHero.addEventListener('click', triggerEntryTransition);
}
