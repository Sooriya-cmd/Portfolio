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
          <p>${escapeHtml(content.person.tagline)}</p>
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
          <span class="index-badge">01 / ABOUT ME</span>
        </div>
        <p class="section-eyebrow">BACKGROUND</p>
        <h2 class="panel-title">${escapeHtml(content.about.heading)}</h2>
        <div class="panel-body">
          ${content.about.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>

        <!-- Education Card -->
        <div class="education-card" style="margin: 24px 0; padding: 20px; background: #FFFFFF; border: var(--border-medium); border-radius: var(--radius-md); box-shadow: 3px 3px 0px var(--color-panel-border);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
            <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: var(--color-text-primary);">
              ${escapeHtml(content.about.education.institution)}
            </h3>
            <span class="skill-category" style="font-size: 0.95rem; padding: 4px 10px; background: #FFD21F; color: #11111E;">
              CGPA: ${escapeHtml(content.about.education.cgpa)}
            </span>
          </div>
          <p style="font-weight: 700; color: #3158DF; font-size: 1.05rem; margin-bottom: 4px;">
            ${escapeHtml(content.about.education.degree)} — ${escapeHtml(content.about.education.specialisation)}
          </p>
          <div style="display: flex; gap: 16px; font-size: 0.9rem; color: var(--color-text-secondary); flex-wrap: wrap; margin-top: 8px;">
            <span>📅 ${escapeHtml(content.about.education.academicYear)} (Grad: ${escapeHtml(content.about.education.expectedGraduation)})</span>
            <span>📍 ${escapeHtml(content.about.education.location)}</span>
          </div>
        </div>

        <div class="btn-group">
          <a href="#section-skills" class="btn-primary" data-scroll-to="#section-skills">SEE SKILLS →</a>
        </div>
      </div>
    </section>

    <!-- SKILLS SECTION -->
    <section id="section-skills" class="portfolio-section" data-chapter="skills">
      <div class="framed-panel" style="max-width: 860px;">
        <div class="panel-header">
          <span class="index-badge">02 / CRAFT & SKILLS</span>
        </div>
        <p class="section-eyebrow">STACK</p>
        <h2 class="panel-title">${escapeHtml(content.skills.heading)}</h2>
        
        <!-- Categorized Skills -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 20px;">
          ${content.skills.categories.map(cat => `
            <div style="background: #FFFFFF; border: var(--border-medium); border-radius: var(--radius-sm); padding: 14px 18px; box-shadow: 2px 2px 0px var(--color-panel-border);">
              <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; color: #3158DF; margin-bottom: 8px;">
                ${escapeHtml(cat.name)}
              </div>
              <div class="tag-list" style="margin-bottom: 0;">
                ${cat.skills.map(s => `<span class="tag-pill" style="font-size: 0.9rem;">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="btn-group" style="margin-top: 24px;">
          <a href="#section-experience" class="btn-primary" data-scroll-to="#section-experience">VIEW LEADERSHIP & ACHIEVEMENTS →</a>
        </div>
      </div>
    </section>

    <!-- LEADERSHIP & ACHIEVEMENTS SECTION -->
    <section id="section-experience" class="portfolio-section" data-chapter="experience">
      <div class="framed-panel" style="max-width: 860px;">
        <div class="panel-header">
          <span class="index-badge">03 / LEADERSHIP & RECOGNITION</span>
        </div>
        <p class="section-eyebrow">MILESTONES</p>
        <h2 class="panel-title">${escapeHtml(content.experience.heading)}</h2>

        <!-- Leadership Items -->
        <div style="margin-top: 20px;">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: #11111E; margin-bottom: 12px;">LEADERSHIP ROLES</h3>
          <div class="experience-list">
            ${content.leadership.items.map(lead => `
              <div class="experience-card">
                <div class="exp-header">
                  <h4 class="exp-role">${escapeHtml(lead.role)}</h4>
                  <span class="exp-period">${escapeHtml(lead.period)}</span>
                </div>
                <p class="exp-org">${escapeHtml(lead.organization)}</p>
                <p class="panel-body" style="margin-bottom: 0;">${escapeHtml(lead.summary)}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Achievements & Recognitions -->
        <div style="margin-top: 28px;">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: #11111E; margin-bottom: 12px;">ACHIEVEMENTS & COURSES</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
            <div style="background: #FFFFFF; border: var(--border-medium); border-radius: var(--radius-sm); padding: 16px; box-shadow: 2px 2px 0px var(--color-panel-border);">
              <h5 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; color: #FF4F92; margin-bottom: 8px;">ACADEMIC RECOGNITION</h5>
              <ul style="padding-left: 18px; font-size: 0.95rem; line-height: 1.5; color: var(--color-text-secondary);">
                ${content.achievements.academic.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
              </ul>
            </div>

            <div style="background: #FFFFFF; border: var(--border-medium); border-radius: var(--radius-sm); padding: 16px; box-shadow: 2px 2px 0px var(--color-panel-border);">
              <h5 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; color: #3158DF; margin-bottom: 8px;">NPTEL CERTIFICATIONS</h5>
              <ul style="padding-left: 18px; font-size: 0.95rem; line-height: 1.5; color: var(--color-text-secondary);">
                ${content.achievements.nptel.map(n => `<li>${escapeHtml(n)}</li>`).join('')}
              </ul>
            </div>

            <div style="background: #FFFFFF; border: var(--border-medium); border-radius: var(--radius-sm); padding: 16px; box-shadow: 2px 2px 0px var(--color-panel-border);">
              <h5 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; color: #28E070; margin-bottom: 8px;">TECHNICAL PARTICIPATION</h5>
              <ul style="padding-left: 18px; font-size: 0.95rem; line-height: 1.5; color: var(--color-text-secondary);">
                ${content.achievements.participation.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="btn-group" style="margin-top: 28px;">
          <a href="#section-projects" class="btn-primary" data-scroll-to="#section-projects">EXPLORE CONFIRMED PROJECTS (03) →</a>
        </div>
      </div>
    </section>

    <!-- PROJECTS SECTION: 3 CONFIRMED PROJECTS -->
    <section id="section-projects" class="portfolio-section" data-chapter="projects" style="min-height: 220vh;">
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
            <p><a href="${proj.links.repo}" target="_blank" rel="noopener noreferrer">View Source on GitHub</a></p>
          </article>
        `).join('')}
      </div>
    </section>

    <!-- MORE PROJECTS TRANSITION -->
    <section id="section-more-projects" class="portfolio-section" data-chapter="moreProjects">
      <div class="framed-panel">
        <div class="panel-header">
          <span class="index-badge">04 / ??</span>
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
          <span class="index-badge">05 / CONTACT</span>
        </div>
        <p class="section-eyebrow">REACH OUT</p>
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
        </div>

        <!-- Social Links (GitHub, LinkedIn, LeetCode) -->
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
          <span class="index-badge">06 / FINALE</span>
        </div>
        <h2 class="panel-title">${escapeHtml(content.ending.heading)}</h2>
        <div class="panel-body">
          <p style="font-size: 1.25rem; font-weight: 700; color: #3158DF; margin-bottom: 8px;">
            "${escapeHtml(content.ending.text)}"
          </p>
          <p style="font-size: 1rem; color: var(--color-text-secondary); margin-top: 16px;">
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
