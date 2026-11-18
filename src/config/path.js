/**
 * path.js — Camera spline path and chapter scroll progress milestones
 */

export const CHAPTER_RANGES = {
  hero: { start: 0.00, end: 0.08, name: 'Hero' },
  about: { start: 0.08, end: 0.17, name: 'About' },
  skills: { start: 0.17, end: 0.26, name: 'Skills' },
  experience: { start: 0.26, end: 0.35, name: 'Experience' },
  projects: { start: 0.35, end: 0.78, name: 'Projects' },
  moreProjects: { start: 0.78, end: 0.84, name: 'More Projects' },
  contact: { start: 0.84, end: 0.93, name: 'Contact' },
  ending: { start: 0.93, end: 1.00, name: 'The End' }
};

/**
 * Individual project intervals within the projects chapter range (0.35 to 0.78)
 */
export function getProjectRange(index, total = 8) {
  const span = CHAPTER_RANGES.projects.end - CHAPTER_RANGES.projects.start;
  const step = span / total;
  const start = CHAPTER_RANGES.projects.start + index * step;
  return {
    start,
    end: start + step
  };
}
