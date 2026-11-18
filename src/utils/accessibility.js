/**
 * accessibility.js — Accessible Focus Trapping, Keyboard Navigation, and Screen Announcements
 */

export function initAccessibility() {
  // Ensure keyboard focus is visibly indicated
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Accessible announcer
  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
}

export function announceToScreenReader(message) {
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) {
    announcer.textContent = message;
  }
}
