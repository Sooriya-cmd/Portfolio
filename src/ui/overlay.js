/**
 * overlay.js — Semantic HTML Portfolio Overlay & Chapter Containers
 */

import content from '../config/content.json';
import { ProjectShowcase } from './projectControls.js';

let projectShowcaseInstance = null;

export function initPortfolioOverlay(mountEl) {
  if (!mountEl) return null;

  // Build semantic structure
  mountEl.innerHTML = `
    <!-- HERO SECTION -->
    <section id="section-hero" class="portfolio-section" data-chapter="hero">
      <div class="framed-panel">
        <div class="panel-header">
          <span class="index-badge">00 / STREET INTRO</span>
        </div>
        <p class="section-eyebrow">${escapeHtml(content.hero.eyebrow)}</p>
        <h1 class="panel-title">${escapeHtml(content.hero.headline)}</h1>
        <p class="panel-subtitle">${escapeHtml(content.hero.subline)}</p>
        <div class="panel-body">
          <p>${escapeHtml(content.entry.description)}</p>
        </div>
        <div class="btn-group">
          <a href="#section-about" class="btn-primary" data-scroll-to="#section-about">
            <span>${escapeHtml(content.hero.scrollHint || 'EXPLORE STREET')}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section id="section-about" class="portfolio-section" data-chapter="about">
      <div class="framed-panel">
        <div class="panel-header">
          <span class="index-badge">01 / ABOUT</span>
        </div>
        <p class="section-eyebrow">${escapeHtml(content.sections.about)}</p>
        <h2 class="panel-title">${escapeHtml(content.about.heading)}</h2>
        <div class="panel-body">
          ${content.about.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
        ${content.about.facts && content.about.facts.length > 0 ? `
          <div class="skills-grid" style="margin-bottom: 24px;">
            ${content.about.facts.map(fact => `
              <div class="skill-card">
                <span class="skill-name" style="font-size: 0.95rem;">${escapeHtml(fact.label)}</span>
                <span class="skill-category">${escapeHtml(fact.value)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="btn-group">
          <a href="#section-skills" class="btn-primary" data-scroll-to="#section-skills">SEE SKILLS →</a>
        </div>
      </div>
    </section>

    <!-- SKILLS SECTION -->
    <section id="section-skills" class="portfolio-section" data-chapter="skills">
      <div class="framed-panel" style="max-width: 820px;">
        <div class="panel-header">
          <span class="index-badge">02 / CRAFT & SKILLS</span>
        </div>
        <p class="section-eyebrow">${escapeHtml(content.sections.skills)}</p>
        <h2 class="panel-title">${escapeHtml(content.skills.heading)}</h2>
        <div class="skills-grid">
          ${content.skills.items.map(skill => `
            <div class="skill-card">
              <span class="skill-name">${escapeHtml(skill.name)}</span>
              <span class="skill-category">${escapeHtml(skill.category)}</span>
            </div>
          `).join('')}
        </div>
        <div class="btn-group" style="margin-top: 24px;">
          <a href="#section-experience" class="btn-primary" data-scroll-to="#section-experience">VIEW EXPERIENCE →</a>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE SECTION -->
    <section id="section-experience" class="portfolio-section" data-chapter="experience">
      <div class="framed-panel" style="max-width: 820px;">
        <div class="panel-header">
          <span class="index-badge">03 / TRANSIT & EXPERIENCE</span>
        </div>
        <p class="section-eyebrow">${escapeHtml(content.sections.experience)}</p>
        <h2 class="panel-title">${escapeHtml(content.experience.heading)}</h2>
        <div class="experience-list">
          ${content.experience.items.map(exp => `
            <div class="experience-card">
              <div class="exp-header">
                <h3 class="exp-role">${escapeHtml(exp.role)}</h3>
                <span class="exp-period">${escapeHtml(exp.period)}</span>
              </div>
              <p class="exp-org">${escapeHtml(exp.organization)}</p>
              <p class="panel-body" style="margin-bottom: 8px;">${escapeHtml(exp.summary)}</p>
              ${exp.highlights && exp.highlights.length > 0 ? `
                <ul class="exp-highlights">
                  ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        <div class="btn-group" style="margin-top: 24px;">
          <a href="#section-projects" class="btn-primary" data-scroll-to="#section-projects">EXPLORE PROJECTS (08) →</a>
        </div>
      </div>
    </section>

    <!-- PROJECTS SECTION: SINGLE-PANEL SHOWCASE FOR 3D MODE -->
    <section id="section-projects" class="portfolio-section" data-chapter="projects" style="min-height: 250vh;">
      <div class="showcase-sticky-container">
        <div id="project-showcase-mount"></div>
      </div>

      <!-- Semantic project list for screen readers and Non-3D mode -->
      <div class="sr-only non-3d-project-list">
        ${content.projects.map((proj, idx) => `
          <article id="semantic-${proj.id}">
            <h3>${String(idx + 1).padStart(2, '0')}. ${proj.title} (${proj.year})</h3>
            <p>${proj.tagline}</p>
            <p>${proj.description}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <!-- MORE PROJECTS TRANSITION -->
    <section id="section-more-projects" class="portfolio-section" data-chapter="moreProjects">
      <div class="framed-panel">
        <div class="panel-header">
          <span class="index-badge">09 / ??</span>
        </div>
        <p class="section-eyebrow">${escapeHtml(content.moreProjects.label)}</p>
        <h2 class="panel-title">${escapeHtml(content.moreProjects.heading)}</h2>
        <div class="panel-body">
          <p>${escapeHtml(content.moreProjects.text)}</p>
        </div>
        <div class="btn-group">
          <a href="#section-contact" class="btn-primary" data-scroll-to="#section-contact">GET IN TOUCH →</a>
        </div>
      </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="section-contact" class="portfolio-section" data-chapter="contact">
      <div class="framed-panel">
        <div class="panel-header">
          <span class="index-badge">10 / CONTACT</span>
        </div>
        <p class="section-eyebrow">${escapeHtml(content.sections.contact)}</p>
        <h2 class="panel-title">${escapeHtml(content.contact.heading)}</h2>
        <div class="panel-body">
          <p>${escapeHtml(content.contact.text)}</p>
        </div>

        <div class="btn-group" style="margin-bottom: 24px;">
          ${content.person.email ? `
            <a href="mailto:${escapeHtml(content.person.email)}" class="btn-primary">
              <span>${escapeHtml(content.contact.cta)}</span>
              <span aria-hidden="true">✉</span>
            </a>
          ` : ''}
          ${content.person.resume ? `
            <a href="${escapeHtml(content.person.resume)}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
              <span>RESUME</span>
              <span aria-hidden="true">📄</span>
            </a>
          ` : ''}
        </div>

        ${content.socials && content.socials.some(s => s.url) ? `
          <div class="tag-list">
            ${content.socials.filter(s => s.url).map(s => `
              <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.95rem; padding: 6px 16px;">
                <span>${escapeHtml(s.label)}</span>
                <span aria-hidden="true">↗</span>
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>

    <!-- THE END FINALE SECTION -->
    <section id="section-ending" class="portfolio-section" data-chapter="ending">
      <div class="framed-panel">
        <div class="panel-header">
          <span class="index-badge">11 / FINALE</span>
        </div>
        <h2 class="panel-title">${escapeHtml(content.ending.heading)}</h2>
        <div class="panel-body">
          <p>${escapeHtml(content.ending.text)}</p>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 20px;">
            ${escapeHtml(content.ending.footer)}
          </p>
        </div>
        <div class="btn-group">
          <button id="btn-back-to-top" class="btn-primary">
            <span>BACK TO START</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </section>
  `;

  // Mount ProjectShowcase
  const showcaseMount = document.getElementById('project-showcase-mount');
  if (showcaseMount) {
    projectShowcaseInstance = new ProjectShowcase(showcaseMount);
  }

  return projectShowcaseInstance;
}

export function getProjectShowcase() {
  return projectShowcaseInstance;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
