/**
 * projectControls.js — 3-Project Showcase Carousel & Navigation Controls
 */

import content from '../config/content.json';
import { CHAPTER_RANGES, getProjectRange } from '../config/path.js';
import gsap from 'gsap';

export class ProjectShowcase {
  constructor(container) {
    this.container = container;
    this.projects = content.projects || [];
    this.currentIndex = 0;
    this.total = this.projects.length;
    this.isTransitioning = false;

    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div id="project-showcase-panel" class="framed-panel project-showcase-panel">
        <div class="panel-header">
          <span id="proj-badge" class="index-badge">01 / ${String(this.total).padStart(2, '0')}</span>
          <span id="proj-year" class="skill-category" style="font-size: 0.95rem; padding: 4px 12px;">2026</span>
        </div>

        <div class="project-showcase-content">
          <h3 id="proj-title" class="panel-title">${this.projects[0]?.title || ''}</h3>
          <p id="proj-tagline" class="panel-subtitle">${this.projects[0]?.tagline || ''}</p>
          
          <div class="project-media-frame">
            <img id="proj-image" src="${this.projects[0]?.image || ''}" alt="${this.projects[0]?.imageAlt || ''}" />
          </div>

          <p id="proj-desc" class="panel-body">${this.projects[0]?.description || ''}</p>

          <div id="proj-tags" class="tag-list"></div>

          <div class="project-showcase-footer">
            <div id="proj-links" class="btn-group"></div>
            
            <div class="project-nav-arrows">
              <button id="btn-proj-prev" class="btn-icon" aria-label="Previous project" title="Previous project">
                <span aria-hidden="true">❮</span>
              </button>
              <button id="btn-proj-next" class="btn-icon" aria-label="Next project" title="Next project">
                <span aria-hidden="true">❯</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.badgeEl = document.getElementById('proj-badge');
    this.yearEl = document.getElementById('proj-year');
    this.titleEl = document.getElementById('proj-title');
    this.taglineEl = document.getElementById('proj-tagline');
    this.imageEl = document.getElementById('proj-image');
    this.descEl = document.getElementById('proj-desc');
    this.tagsEl = document.getElementById('proj-tags');
    this.linksEl = document.getElementById('proj-links');
    this.prevBtn = document.getElementById('btn-proj-prev');
    this.nextBtn = document.getElementById('btn-proj-next');

    this.updateProject(0);
  }

  updateProject(index) {
    if (index < 0 || index >= this.total) return;
    this.currentIndex = index;
    const proj = this.projects[index];
    if (!proj) return;

    const num = String(index + 1).padStart(2, '0');
    const tot = String(this.total).padStart(2, '0');

    if (this.badgeEl) this.badgeEl.textContent = `${num} / ${tot}`;
    if (this.yearEl) this.yearEl.textContent = proj.year || '';
    if (this.titleEl) this.titleEl.textContent = proj.title || '';
    if (this.taglineEl) this.taglineEl.textContent = proj.tagline || '';
    if (this.descEl) this.descEl.textContent = proj.description || '';

    if (this.imageEl) {
      this.imageEl.src = proj.image;
      this.imageEl.alt = proj.imageAlt || proj.title;
    }

    if (this.tagsEl) {
      this.tagsEl.innerHTML = (proj.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');
    }

    if (this.linksEl) {
      let buttonsHtml = '';
      if (proj.links && proj.links.repo) {
        buttonsHtml += `
          <a href="${proj.links.repo}" target="_blank" rel="noopener noreferrer" class="btn-primary">
            <span>VIEW ON GITHUB</span>
            <span aria-hidden="true">↗</span>
          </a>
        `;
      }
      if (proj.links && proj.links.live) {
        buttonsHtml += `
          <a href="${proj.links.live}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
            <span>LIVE DEMO</span>
            <span aria-hidden="true">↗</span>
          </a>
        `;
      }
      this.linksEl.innerHTML = buttonsHtml;
    }

    // Enable/disable navigation buttons
    if (this.prevBtn) this.prevBtn.disabled = (index === 0);
    if (this.nextBtn) this.nextBtn.disabled = (index === this.total - 1);
  }

  /**
   * In-place smooth project navigation transition.
   * Keeps the website completely static during transitions so visitors
   * can clearly inspect each project without unnecessary page movement (Requirement 4).
   */
  goToProject(index) {
    if (index < 0 || index >= this.total || index === this.currentIndex || this.isTransitioning) return;
    this.isTransitioning = true;

    const contentEl = this.container.querySelector('.project-showcase-content');
    const dir = index > this.currentIndex ? 1 : -1;

    if (contentEl) {
      gsap.to(contentEl, {
        opacity: 0,
        x: -18 * dir,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          this.updateProject(index);
          gsap.fromTo(
            contentEl,
            { opacity: 0, x: 18 * dir },
            {
              opacity: 1,
              x: 0,
              duration: 0.28,
              ease: 'back.out(1.2)',
              onComplete: () => {
                this.isTransitioning = false;
              }
            }
          );
        }
      });
    } else {
      this.updateProject(index);
      this.isTransitioning = false;
    }
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.currentIndex > 0) {
          this.goToProject(this.currentIndex - 1);
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.currentIndex < this.total - 1) {
          this.goToProject(this.currentIndex + 1);
        }
      });
    }

    // Keyboard navigation (ArrowLeft / ArrowRight) in-place without page jumping
    window.addEventListener('keydown', (e) => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      if (progress >= CHAPTER_RANGES.projects.start - 0.05 && progress <= CHAPTER_RANGES.projects.end + 0.05) {
        if (e.key === 'ArrowRight' && this.currentIndex < this.total - 1) {
          e.preventDefault();
          this.goToProject(this.currentIndex + 1);
        } else if (e.key === 'ArrowLeft' && this.currentIndex > 0) {
          e.preventDefault();
          this.goToProject(this.currentIndex - 1);
        }
      }
    });
  }

  onScrollProgress(progress) {
    if (this.isTransitioning) return;
    if (progress < CHAPTER_RANGES.projects.start || progress > CHAPTER_RANGES.projects.end) {
      return;
    }
    const span = CHAPTER_RANGES.projects.end - CHAPTER_RANGES.projects.start;
    const relProgress = (progress - CHAPTER_RANGES.projects.start) / span;
    const newIndex = Math.min(Math.floor(relProgress * this.total), this.total - 1);
    if (newIndex !== this.currentIndex && newIndex >= 0) {
      this.updateProject(newIndex);
    }
  }
}
