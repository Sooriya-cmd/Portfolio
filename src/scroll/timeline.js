/**
 * timeline.js — GSAP ScrollTrigger Pipeline Driving Normalized Progress (0 to 1)
 * and Section Box Entrance Reveal Animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scrollTriggerInstance = null;

/**
 * Applies subtle pop-up reveal animations with stagger to all existing content panels and cards
 */
export function initBoxEntranceAnimations() {
  if (typeof window === 'undefined') return;

  // Respect reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Framed portfolio panels (Hero, About, Skills, Experience, More Projects, Contact, Ending)
  const panels = gsap.utils.toArray('.framed-panel');
  panels.forEach((panel) => {
    gsap.fromTo(
      panel,
      { opacity: 0, y: 20, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // 2. Education Card
  const eduCard = document.querySelector('.education-card');
  if (eduCard) {
    gsap.fromTo(
      eduCard,
      { opacity: 0, y: 16, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.15)',
        scrollTrigger: {
          trigger: eduCard,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 3. Staggered Skills Categories
  const skillBoxes = gsap.utils.toArray('#section-skills .skill-category-box');
  if (skillBoxes.length > 0) {
    gsap.fromTo(
      skillBoxes,
      { opacity: 0, y: 16, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.09,
        ease: 'back.out(1.15)',
        scrollTrigger: {
          trigger: '#section-skills',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 4. Staggered Experience / Leadership Cards
  const expCards = gsap.utils.toArray('.experience-card');
  if (expCards.length > 0) {
    gsap.fromTo(
      expCards,
      { opacity: 0, y: 16, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.15)',
        scrollTrigger: {
          trigger: '#section-experience',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 5. Staggered Achievement Boxes
  const achBoxes = gsap.utils.toArray('.achievement-box');
  if (achBoxes.length > 0) {
    gsap.fromTo(
      achBoxes,
      { opacity: 0, y: 16, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.15)',
        scrollTrigger: {
          trigger: '#section-experience',
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }
}

export function initScrollTimeline(cameraRig, projectShowcase) {
  // Destroy existing if any
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: '#app',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;

      if (cameraRig) {
        cameraRig.setProgress(progress);
      }

      if (projectShowcase) {
        projectShowcase.onScrollProgress(progress);
      }
    }
  });

  // Initialize pop-up animations for boxes and panels
  initBoxEntranceAnimations();

  return scrollTriggerInstance;
}

export function destroyScrollTimeline() {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
}
