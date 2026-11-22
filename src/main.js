/**
 * main.js — Application Entry Point
 * Renders semantic portfolio from content.json, initializes Three.js 3D world,
 * and synchronizes Lenis + GSAP ScrollTrigger.
 */

import content from './config/content.json';
import { CHAPTER_RANGES } from './config/path.js';
import { initLenis, getLenis } from './scroll/lenis.js';
import { createScene } from './scene/createScene.js';
import { initScrollTimeline } from './scroll/timeline.js';
import { initEntryScreen } from './ui/entryScreen.js';
import { initPortfolioOverlay } from './ui/overlay.js';
import { checkWebGLSupport } from './utils/device.js';
import { initAccessibility } from './utils/accessibility.js';
import {
  TechText,
  SplitFlapText,
  LetterGlitch,
  Crosshair,
  ScrollGlitchShards,
  ClickSpark,
  applyDecryptedText
} from './effects/index.js';

// DOM Mount Targets
const contentMount = document.getElementById('content-mount');
const chapterList = document.getElementById('chapter-list');
const chapterMenu = document.getElementById('chapter-menu');
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const menuBackdrop = document.getElementById('menu-backdrop');
const soundToggle = document.getElementById('sound-toggle');
const progressFill = document.getElementById('progress-fill');
const guideMessage = document.getElementById('guide-message');
const guideNextBtn = document.getElementById('guide-next-btn');
const canvasContainer = document.getElementById('canvas-container');

/**
 * Initialize Metadata
 */
function initMetadata() {
  document.title = content.site.title;
  const brandName = document.querySelector('.brand-name');
  if (brandName) {
    brandName.textContent = content.person.name.includes('REPLACE') ? 'SKY STREET' : content.person.name.toUpperCase();
  }
}

/**
 * Bind interactive internal scroll links
 */
function bindInteractiveLinks() {
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  document.querySelectorAll('[data-scroll-to]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-scroll-to');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -60 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * Populate Navigation Chapter Drawer
 */
function initChapterMenu() {
  if (!chapterList) return;

  const chapters = [
    { id: 'section-hero', label: content.sections.hero || 'START' },
    { id: 'section-about', label: content.sections.about || 'ABOUT' },
    { id: 'section-skills', label: content.sections.skills || 'SKILLS' },
    { id: 'section-experience', label: content.sections.experience || 'EXPERIENCE' },
    { id: 'section-projects', label: content.sections.projects || 'PROJECTS' },
    { id: 'section-contact', label: content.sections.contact || 'CONTACT' },
    { id: 'section-ending', label: content.sections.ending || 'THE END' }
  ];

  chapterList.innerHTML = chapters.map(ch => `
    <li>
      <a href="#${ch.id}" class="chapter-link" data-chapter-target="#${ch.id}">
        <span>${escapeHtml(ch.label)}</span>
        <span aria-hidden="true">→</span>
      </a>
    </li>
  `).join('');

  chapterList.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-chapter-target');
      const targetEl = document.querySelector(targetId);
      closeMenu();
      if (targetEl) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -60 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu());
  if (menuClose) menuClose.addEventListener('click', () => closeMenu());
  if (menuBackdrop) menuBackdrop.addEventListener('click', () => closeMenu());

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chapterMenu.hasAttribute('hidden')) {
      closeMenu();
    }
  });
}

function toggleMenu() {
  const isHidden = chapterMenu.hasAttribute('hidden');
  if (isHidden) {
    chapterMenu.removeAttribute('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuClose.focus();
  } else {
    closeMenu();
  }
}

function closeMenu() {
  chapterMenu.setAttribute('hidden', '');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.focus();
}

/**
 * Handle Scroll Progress and Guide Dialogue Updates
 */
function initScrollTracking() {
  const sections = document.querySelectorAll('.portfolio-section');
  const sectionIds = Array.from(sections).map(s => s.id);

  function onScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;

    if (progressFill) {
      progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
      const progressContainer = document.getElementById('progress-container');
      if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', Math.round(progress * 100));
      }
    }

    // Determine current active section for guide dialogue
    let currentChapter = 'hero';
    sections.forEach(sec => {
      const top = sec.offsetTop - 300;
      if (scrollY >= top) {
        currentChapter = sec.getAttribute('data-chapter') || 'hero';
      }
    });

    if (guideMessage && content.guide.messages[currentChapter]) {
      guideMessage.textContent = content.guide.messages[currentChapter];
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (guideNextBtn) {
    guideNextBtn.addEventListener('click', () => {
      const scrollY = window.scrollY;
      for (const id of sectionIds) {
        const sec = document.getElementById(id);
        if (sec && sec.offsetTop > scrollY + 120) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(sec, { offset: -60 });
          } else {
            sec.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }
      }
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Initialize Sound Control
 */
function initSoundControl() {
  if (!soundToggle) return;
  soundToggle.addEventListener('click', () => {
    alert('Audio track is currently not loaded. You can place your ambient audio file in /public/audio/ and configure it in src/config/content.json.');
  });
}

/**
 * Helper: Escape HTML
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Eye tracking for JIU mascot (bottom-left guide)
 */
function initJiuEyeTracking() {
  const eyeLeft = document.querySelector('#guide-container .mascot-eye.left');
  const eyeRight = document.querySelector('#guide-container .mascot-eye.right');
  const pupilLeft = eyeLeft ? eyeLeft.querySelector('.mascot-pupil') : null;
  const pupilRight = eyeRight ? eyeRight.querySelector('.mascot-pupil') : null;
  if (!pupilLeft || !pupilRight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curLX = 0, curLY = 0;
  let curRX = 0, curRY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function step() {
    if (eyeLeft && pupilLeft) {
      const rect = eyeLeft.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy) * 0.04, 2.2);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * (dist * 1.2);
      curLX += (tx - curLX) * 0.15;
      curLY += (ty - curLY) * 0.15;
      pupilLeft.style.transform = `translate(${curLX.toFixed(2)}px, ${curLY.toFixed(2)}px)`;
    }
    if (eyeRight && pupilRight) {
      const rect = eyeRight.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy) * 0.04, 2.2);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * (dist * 1.2);
      curRX += (tx - curRX) * 0.15;
      curRY += (ty - curRY) * 0.15;
      pupilRight.style.transform = `translate(${curRX.toFixed(2)}px, ${curRY.toFixed(2)}px)`;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Mobile tap-to-expand toggle for JIU assistant
 */
function initJiuMobileAssistant() {
  const guideContainer = document.getElementById('guide-container');
  const guideHead = document.querySelector('.guide-mascot-head');
  if (guideContainer && guideHead) {
    guideHead.style.cursor = 'pointer';
    guideHead.setAttribute('role', 'button');
    guideHead.setAttribute('aria-label', 'Toggle JIU guide message');
    guideHead.addEventListener('click', (e) => {
      e.stopPropagation();
      guideContainer.classList.toggle('is-expanded');
    });
  }
}

/**
 * Initialize Integrated Interactive Visual Effects
 */
function initEffects() {
  const techTextMount = document.getElementById('hero-tech-text-mount');
  if (techTextMount) {
    new TechText(techTextMount, {
      text: 'JAYASOORIYA',
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 900,
      color: '#121324',
      accentColor: '#2EE5EF',
      dashLength: 4,
      dashGap: 2,
      strokeWidth: 1.5,
      specks: 8,
      clickKick: true,
      bounce: 0.3,
      speed: 0.45,
      sweep: true,
      introDuration: 1.8
    });
  }

  const splitFlapMount = document.getElementById('hero-split-flap-mount');
  if (splitFlapMount) {
    new SplitFlapText(splitFlapMount, {
      words: [
        'MACHINE LEARNING',
        'AGENTIC AI',
        'PYTHON & AI',
        'SOFTWARE BUILDER'
      ],
      flipDuration: 0.10,
      stagger: 0.035,
      cycleDelay: 2600,
      flipsPerChar: 5,
      charset: 'alpha'
    });
  }

  const skillsCanvasMount = document.getElementById('skills-glitch-canvas');
  if (skillsCanvasMount && checkWebGLSupport()) {
    new LetterGlitch(skillsCanvasMount, {
      glitchColors: ['#3165E0', '#2EE5EF', '#FF4F92'],
      baseColor: '#121324',
      fontSize: 11,
      spacing: 0.65,
      density: 0.55,
      baseOpacity: 0.09,
      glitchAmount: 0.22,
      speed: 0.55,
      flow: 0.2,
      edgeFade: 0.18,
      centerFade: 0.75
    });
  }

  const showcaseWrapper = document.querySelector('.project-showcase-wrapper');
  if (showcaseWrapper) {
    new Crosshair(showcaseWrapper, {
      color: '#2EE5EF',
      thickness: 1,
      opacity: 0.45,
      gap: 10,
      fade: 0.25,
      smoothing: 0.35,
      targetSelector: 'a, button, [data-crosshair-target]',
      clickPulse: true
    });
  }

  // Global Scroll-Reactive Glitch Shards
  new ScrollGlitchShards();

  // Global Interactive ClickSpark System (React Bits)
  new ClickSpark({
    sparkColor: '#ffffff',
    shape: 'line',
    sparkCount: 8,
    sparkSize: 14,
    sparkRadius: 30,
    sparkWidth: 2.5,
    duration: 500,
    easing: 'ease-out',
    randomness: 0,
    gravity: 0,
    glow: 0,
    ring: false
  });

  // Global DecryptedText Effect for Specified Headings (2 - 2.5s duration)
  const headingsToDecrypt = [
    '#heading-about',
    '#heading-skills',
    '#heading-experience',
    '#heading-contact',
    '#heading-ending'
  ];
  headingsToDecrypt.forEach(selector => {
    applyDecryptedText(selector, {
      animateOn: 'view',
      duration: 2200, // 2.2 seconds smooth decryption
      speed: 40,
      sequential: true,
      revealDirection: 'start',
      scrambleColor: '#2EE5EF'
    });
  });
}

// Prevent browser from restoring scrolled position on refresh
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 1. Kick off UI rendering and Accessibility
initMetadata();
initAccessibility();
initJiuEyeTracking();
const hasWebGL = checkWebGLSupport();

if (!hasWebGL) {
  document.body.classList.add('is-2d-mode');
  console.warn('WebGL unsupported on this device. Initialized accessible Non-3D portfolio.');
}

const projectShowcase = initPortfolioOverlay(contentMount);
bindInteractiveLinks();
initChapterMenu();
initScrollTracking();
initSoundControl();
initEffects();
initJiuMobileAssistant();

// 2. Initialize Entry Welcome Screen
initEntryScreen({
  onEnter3D: () => {
    if (hasWebGL) {
      document.body.classList.remove('is-2d-mode');
      document.body.classList.add('is-3d-mode');
    }
    const lenisInst = getLenis();
    if (lenisInst) lenisInst.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  },
  onEnter2D: () => {
    document.body.classList.add('is-2d-mode');
    document.body.classList.remove('is-3d-mode');
    if (canvasContainer) canvasContainer.style.display = 'none';
    const lenisInst = getLenis();
    if (lenisInst) lenisInst.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }
});

// 3. Initialize Lenis Smooth Scroller
const lenis = initLenis();

// 4. Initialize Three.js 3D World (if WebGL available)
let sceneContext = null;
if (hasWebGL) {
  sceneContext = createScene(canvasContainer);
}

// 5. Synchronize ScrollTrigger with Camera Rig and Project Showcase
if (sceneContext && sceneContext.cameraRig) {
  initScrollTimeline(sceneContext.cameraRig, projectShowcase);
}

console.log('Sky Street 3D World & Lenis Scroll Bridge initialized (Milestone M2).');
