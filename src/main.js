/**
 * main.js — Application Entry Point
 * Renders semantic portfolio from content.json with accessible UI and navigation.
 */

import content from './config/content.json';
import { CHAPTER_RANGES } from './config/path.js';

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
 * Render Semantic Portfolio Content
 */
function renderPortfolio() {
  if (!contentMount) return;

  const sectionsHtml = `
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
          <a href="#section-about" class="btn-primary">
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
          <a href="#section-skills" class="btn-primary">SEE SKILLS →</a>
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
          <a href="#section-experience" class="btn-primary">VIEW EXPERIENCE →</a>
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
          <a href="#section-projects" class="btn-primary">EXPLORE PROJECTS (08) →</a>
        </div>
      </div>
    </section>

    <!-- PROJECTS SECTION (8 DISTINCT PROJECTS) -->
    <section id="section-projects" class="portfolio-section" data-chapter="projects">
      <div style="width: 100%; display: flex; flex-direction: column; gap: 80px;">
        ${content.projects.map((proj, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const total = String(content.projects.length).padStart(2, '0');
          return `
            <article id="${escapeHtml(proj.id)}" class="framed-panel" style="max-width: 800px;">
              <div class="panel-header">
                <span class="index-badge">${num} / ${total} PROJECT</span>
                <span class="skill-category" style="font-size: 0.9rem; padding: 4px 10px;">${escapeHtml(proj.year)}</span>
              </div>
              <h3 class="panel-title">${escapeHtml(proj.title)}</h3>
              <p class="panel-subtitle">${escapeHtml(proj.tagline)}</p>
              
              <div class="project-media-frame">
                <img src="${escapeHtml(proj.image)}" alt="${escapeHtml(proj.imageAlt || proj.title)}" loading="lazy" />
              </div>

              <div class="panel-body">
                <p>${escapeHtml(proj.description)}</p>
              </div>

              <div class="tag-list">
                ${proj.tags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}
              </div>

              <div class="btn-group">
                ${proj.links && proj.links.live ? `
                  <a href="${escapeHtml(proj.links.live)}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                    <span>LIVE DEMO</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ` : ''}
                ${proj.links && proj.links.repo ? `
                  <a href="${escapeHtml(proj.links.repo)}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
                    <span>SOURCE CODE</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ` : ''}
                ${idx < content.projects.length - 1 ? `
                  <a href="#${content.projects[idx + 1].id}" class="btn-secondary">NEXT PROJECT →</a>
                ` : `
                  <a href="#section-more-projects" class="btn-secondary">STAY TUNED →</a>
                `}
              </div>
            </article>
          `;
        }).join('')}
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
          <a href="#section-contact" class="btn-primary">GET IN TOUCH →</a>
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

        <!-- Social Links (cleanly rendered only if url present) -->
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

  contentMount.innerHTML = sectionsHtml;

  // Bind Back to top button
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
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
    { id: 'section-more-projects', label: content.sections.moreProjects || 'MORE' },
    { id: 'section-contact', label: content.sections.contact || 'CONTACT' },
    { id: 'section-ending', label: content.sections.ending || 'THE END' }
  ];

  chapterList.innerHTML = chapters.map(ch => `
    <li>
      <a href="#${ch.id}" class="chapter-link">
        <span>${escapeHtml(ch.label)}</span>
        <span aria-hidden="true">→</span>
      </a>
    </li>
  `).join('');

  // Close menu when clicking link
  chapterList.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('click', () => closeMenu());
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

  // Guide Next Button interaction
  if (guideNextBtn) {
    guideNextBtn.addEventListener('click', () => {
      const scrollY = window.scrollY;
      for (const id of sectionIds) {
        const sec = document.getElementById(id);
        if (sec && sec.offsetTop > scrollY + 120) {
          sec.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
 * Helper: Escape HTML to prevent injection
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

// Kick off
initMetadata();
renderPortfolio();
initChapterMenu();
initScrollTracking();
initSoundControl();
console.log('Sky Street Portfolio initialized in 2D mode (Milestone M1).');
