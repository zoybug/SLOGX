/* Presentation navigation and progressive disclosure for Fall 2025 only. */
(() => {
  if (document.body.dataset.courseYear !== '2025') return;
  document.addEventListener('DOMContentLoaded', () => {
    const widget = document.querySelector('.zoybug-widget');
    if (!widget) return;
    let pending = false;
    function placeCompanion() {
      pending = false;
      const trigger = widget.querySelector('.zoybug-trigger');
      const base = 16;
      // Keep the familiar in the lower corner while its intentional popup is open.
      if (trigger.getAttribute('aria-expanded') === 'true') {
        widget.style.setProperty('--zoybug-bottom', `${base}px`);
        return;
      }
      const rect = widget.getBoundingClientRect();
      const headerBottom = document.querySelector('.masthead')?.getBoundingClientRect().bottom ?? 0;
      const maxBottom = Math.max(base, window.innerHeight - headerBottom - rect.height - 16);
      const controls = [...document.querySelectorAll('a, button, input, select, summary')]
        .filter(control => !widget.contains(control))
        .map(control => control.getBoundingClientRect())
        .filter(box => box.width && box.height && box.bottom > headerBottom && box.top < window.innerHeight);
      const overlaps = bottom => {
        const top = window.innerHeight - bottom - rect.height;
        return controls.filter(box => box.left < rect.right + 8 && box.right > rect.left - 8 && box.top < top + rect.height + 8 && box.bottom > top - 16).length;
      };
      let best = base;
      let score = overlaps(best);
      for (let bottom = base + rect.height + 16; score && bottom <= maxBottom; bottom += rect.height + 16) {
        const candidate = overlaps(bottom);
        if (candidate < score) { best = bottom; score = candidate; }
      }
      widget.style.setProperty('--zoybug-bottom', `${best}px`);
    }
    function schedulePlacement() {
      if (!pending) { pending = true; requestAnimationFrame(placeCompanion); }
    }
    window.addEventListener('scroll', schedulePlacement, { passive: true });
    window.addEventListener('resize', schedulePlacement);
    document.addEventListener('click', placeCompanion);
    document.addEventListener('keydown', placeCompanion);
    schedulePlacement();
  });

  const track = document.querySelector('#slide-track');
  const slides = [...document.querySelectorAll('[data-slide]')];
  if (!track || !slides.length) return;
  const header = document.querySelector('.unified-header');
  const links = [...document.querySelectorAll('[data-section]')];
  const sections = [...document.querySelectorAll('.lecture-section')];
  const position = document.querySelector('#synthesis-position');
  const methods = document.querySelector('#synthesis-method');
  let current = 0;
  let frame = 0;

  function updateHeader() {
    const stickyInset = Math.max(0, Number(getComputedStyle(header).top.replace('px', '')) || 0);
    document.body.style.setProperty('--briefing-header-height', `${header.getBoundingClientRect().height + stickyInset}px`);
  }

  function closeNotes() {
    document.querySelectorAll('[data-panel-notes]').forEach(note => { note.hidden = true; });
    document.querySelectorAll('[data-show-notes]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  }

  function select(index, { focus = false, remember = false } = {}) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    closeNotes();
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      slide.inert = i !== current;
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    document.querySelectorAll('[data-go-slide]').forEach(button => {
      if (Number(button.dataset.goSlide) === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-deck-prev]').forEach(button => { button.disabled = current === 0; });
    document.querySelectorAll('[data-deck-next]').forEach(button => { button.disabled = current === slides.length - 1; });
    position.textContent = current === 0 ? 'Contents' : `${String(current).padStart(2, '0')} / ${String(slides.length - 1).padStart(2, '0')}`;
    if (remember) history.replaceState(null, '', `#${current === 0 ? 'students' : slides[current].id}`);
    if (focus) track.focus({ preventScroll: true });
  }

  function showNotes(id, scroll = true) {
    const panelIndex = slides.findIndex(slide => slide.id === id);
    if (panelIndex > 0 && panelIndex !== current) select(panelIndex);
    closeNotes();
    const note = document.querySelector(`[data-panel-notes="${id}"]`);
    const button = document.querySelector(`[data-show-notes="${id}"]`);
    if (!note || !button) return;
    note.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    if (scroll) {
      note.scrollIntoView({ block: 'start', behavior: 'instant' });
      const heading = note.querySelector('h3');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }

  function goToView(index) {
    select(index, { focus: true, remember: true });
    // Natural page scrolling; selecting a view never creates an inner scrollbar.
    document.querySelector('#students').scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  document.querySelectorAll('[data-go-slide]').forEach(button => button.addEventListener('click', () => goToView(Number(button.dataset.goSlide))));
  document.querySelectorAll('[data-deck-prev]').forEach(button => button.addEventListener('click', () => goToView(current - 1)));
  document.querySelectorAll('[data-deck-next]').forEach(button => button.addEventListener('click', () => goToView(current + 1)));
  document.querySelectorAll('[data-show-notes]').forEach(button => button.addEventListener('click', () => showNotes(button.dataset.showNotes)));
  document.querySelectorAll('[data-close-notes]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.closeNotes;
    closeNotes();
    document.querySelector('#students').scrollIntoView({ block: 'start', behavior: 'instant' });
    document.querySelector(`[data-show-notes="${id}"]`).focus({ preventScroll: true });
  }));
  document.querySelectorAll('[data-method-link]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    methods.open = true;
    methods.scrollIntoView({ block: 'start', behavior: 'instant' });
    methods.querySelector('summary').focus({ preventScroll: true });
  }));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); goToView(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToView(current - 1); }
  });
  document.querySelectorAll('a[href="#students"]').forEach(link => link.addEventListener('click', () => select(0)));
  // Lecture explorers rebuild their buttons after selection. Keep keyboard focus
  // on the replacement button instead of leaving it on a detached node.
  document.querySelectorAll('#stage-grid, #case-selector').forEach(container => {
    container.addEventListener('click', event => {
      if (event.target.closest('button')) {
        container.querySelector('button[aria-pressed="true"]')?.focus({ preventScroll: true });
      }
    });
  });

  function openHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    const index = slides.findIndex(slide => slide.id === hash || slide.id === `slide-${hash}`);
    if (index >= 0) {
      select(index);
      document.querySelector('#students').scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    const target = document.getElementById(hash);
    const note = target?.closest('[data-panel-notes]');
    if (note) showNotes(note.dataset.panelNotes);
    if (hash === 'synthesis-method') methods.open = true;
  }
  function updateSection() {
    frame = 0;
    const threshold = header.getBoundingClientRect().bottom + 80;
    let active = sections[0];
    sections.forEach(section => { if (section.getBoundingClientRect().top <= threshold) active = section; });
    links.forEach(link => {
      if (link.dataset.section === active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleSection() { if (!frame) frame = requestAnimationFrame(updateSection); }
  window.addEventListener('scroll', scheduleSection, { passive: true });
  window.addEventListener('resize', () => { updateHeader(); scheduleSection(); });
  window.addEventListener('hashchange', openHash);
  // Initial fragment scrolling happens after deferred scripts. Re-align the
  // selected view once the browser has finished loading the page and artwork.
  window.addEventListener('load', () => {
    updateHeader();
    requestAnimationFrame(openHash);
  });
  updateHeader();
  select(0);
  openHash();
  scheduleSection();
})();
