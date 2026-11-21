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

  const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  // On mobile touch devices or reduced motion, guarantee 100% full visibility for all sections immediately
  if (isReducedMotion || isMobile) {
    gsap.set('.framed-panel, .education-card, .skill-category-box, .experience-card, .achievement-box', {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'transform'
    });
    return;
  }

  // Desktop entrance reveals: pop-in once on scroll and never disappear
  // 1. Framed portfolio panels (Hero, About, Skills, Experience, More Projects, Contact, Ending)
  const panels = gsap.utils.toArray('.framed-panel');
  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight;

    gsap.fromTo(
      panel,
      { opacity: alreadyVisible ? 1 : 0, y: alreadyVisible ? 0 : 20, scale: alreadyVisible ? 1 : 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });

  // 2. Education Card
  const eduCard = document.querySelector('.education-card');
  if (eduCard) {
    const rect = eduCard.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight;
    gsap.fromTo(
      eduCard,
      { opacity: alreadyVisible ? 1 : 0.2, y: alreadyVisible ? 0 : 16, scale: alreadyVisible ? 1 : 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: isMobile ? 0.35 : 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: eduCard,
          start: isMobile ? 'top 95%' : 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  }

  // 3. Staggered Skills Categories
  const skillBoxes = gsap.utils.toArray('#section-skills .skill-category-box');
  if (skillBoxes.length > 0) {
    gsap.fromTo(
      skillBoxes,
      { opacity: isMobile ? 0.4 : 0, y: 16, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: isMobile ? 0.05 : 0.09,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#section-skills',
          start: isMobile ? 'top 92%' : 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  }

  // 4. Staggered Experience / Leadership Cards
  const expCards = gsap.utils.toArray('.experience-card');
  if (expCards.length > 0) {
    gsap.fromTo(
      expCards,
      { opacity: isMobile ? 0.4 : 0, y: 16, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: isMobile ? 0.06 : 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#section-experience',
          start: isMobile ? 'top 92%' : 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  }

  // 5. Staggered Achievement Boxes
  const achBoxes = gsap.utils.toArray('.achievement-box');
  if (achBoxes.length > 0) {
    gsap.fromTo(
      achBoxes,
      { opacity: isMobile ? 0.4 : 0, y: 16, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: isMobile ? 0.06 : 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#section-experience',
          start: isMobile ? 'top 90%' : 'top 60%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  }

  // Refresh ScrollTrigger calculations after initial setup
  ScrollTrigger.refresh();
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
