(() => {
  const track = document.querySelector('#slide-track');
  const slides = [...document.querySelectorAll('[data-slide]')];
  const sections = [...document.querySelectorAll('.lecture-section')];
  const header = document.querySelector('.unified-header');
  const sectionLinks = [...document.querySelectorAll('[data-section]')];
  if (!track || !slides.length) return;

  let current = 0;
  let pageFrame = 0;
  const slideTitle = index => index === 0 ? 'Contents' : slides[index].querySelector('.slide-intro h2').textContent.trim();

  function updateDeck(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.hidden = !active;
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
    });
    document.querySelectorAll('[data-deck-prev]').forEach(button => {
      button.disabled = current === 0;
      button.setAttribute('aria-label', current === 0 ? 'No previous slide' : `Previous slide: ${slideTitle(current - 1)}`);
      const name = button.querySelector('.deck-neighbor');
      if (name) name.textContent = current === 0 ? 'Start' : slideTitle(current - 1);
    });
    document.querySelectorAll('[data-deck-next]').forEach(button => {
      button.disabled = current === slides.length - 1;
      button.setAttribute('aria-label', current === slides.length - 1 ? 'No next slide' : `Next slide: ${slideTitle(current + 1)}`);
      const name = button.querySelector('.deck-neighbor');
      if (name) name.textContent = current === slides.length - 1 ? 'End' : slideTitle(current + 1);
    });
    document.querySelector('#deck-mobile-position').textContent = current === 0 ? 'Contents' : `${String(current).padStart(2, '0')} / ${String(slides.length - 1).padStart(2, '0')}`;
  }

  function goTo(index, scroll = true) {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    updateDeck(next);
    // Synthesis grows with its contents. Selecting a view uses ordinary page
    // scrolling so long student contributions never need an inner scrollbar.
    if (scroll) document.querySelector('#students').scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  document.querySelectorAll('[data-go-slide]').forEach(button => button.addEventListener('click', () => {
    goTo(Number(button.dataset.goSlide));
    track.focus({ preventScroll: true });
  }));
  document.querySelectorAll('[data-deck-prev]').forEach(button => button.addEventListener('click', () => goTo(current - 1)));
  document.querySelectorAll('[data-deck-next]').forEach(button => button.addEventListener('click', () => goTo(current + 1)));
  document.querySelectorAll('a[href="#students"]').forEach(link => link.addEventListener('click', () => goTo(0, false)));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1); }
  });
  // Retain the old deck's touch navigation without trapping vertical reading.
  let touchStart = null;
  track.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('button, a, input, select, summary')) return;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  track.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  track.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

  function updatePage() {
    pageFrame = 0;
    const threshold = (header?.getBoundingClientRect().height || 0) + 90;
    let active = sections[0];
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold) active = section;
    });
    sectionLinks.forEach(link => {
      if (link.dataset.section === active?.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedulePage() {
    if (!pageFrame) pageFrame = requestAnimationFrame(updatePage);
  }
  window.addEventListener('scroll', schedulePage, { passive: true });
  window.addEventListener('resize', () => {
    goTo(current, false);
    schedulePage();
  });

  function openHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    // Resolve stable IDs against the actual order so editorial reordering keeps
    // both panel links and legacy section links pointing to the right content.
    const target = document.getElementById(hash);
    const panel = target?.closest('[data-slide]');
    const slideIndex = panel ? slides.indexOf(panel)
      : slides.findIndex(slide => slide.id === `slide-${hash}`);
    if (slideIndex > 0) {
      document.querySelector('#students').scrollIntoView({ behavior: 'auto', block: 'start' });
      goTo(slideIndex, false);
    }
    schedulePage();
  }
  window.addEventListener('hashchange', openHash);
  updateDeck(0);
  openHash();
  schedulePage();
})();
