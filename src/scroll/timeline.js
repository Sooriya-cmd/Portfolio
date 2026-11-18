/**
 * timeline.js — GSAP ScrollTrigger Pipeline Driving Normalized Progress (0 to 1)
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CHAPTER_RANGES } from '../config/path.js';

gsap.registerPlugin(ScrollTrigger);

let scrollTriggerInstance = null;
let devReadoutEl = null;

export function initScrollTimeline(cameraRig, projectShowcase) {
  // Destroy existing if any
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }

  // Development progress readout element
  if (import.meta.env.DEV && !devReadoutEl) {
    devReadoutEl = document.createElement('div');
    devReadoutEl.id = 'dev-progress-readout';
    devReadoutEl.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: rgba(18, 19, 36, 0.85);
      color: #2EE5EF;
      font-family: monospace;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #2EE5EF;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(devReadoutEl);
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

      // Update development readout
      if (devReadoutEl) {
        let activeChapter = 'Hero';
        for (const [key, range] of Object.entries(CHAPTER_RANGES)) {
          if (progress >= range.start && progress <= range.end) {
            activeChapter = range.name;
            break;
          }
        }
        devReadoutEl.textContent = `Progress: ${(progress * 100).toFixed(1)}% | ${activeChapter}`;
      }
    }
  });

  return scrollTriggerInstance;
}

export function destroyScrollTimeline() {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
  if (devReadoutEl && devReadoutEl.parentNode) {
    devReadoutEl.parentNode.removeChild(devReadoutEl);
    devReadoutEl = null;
  }
}
