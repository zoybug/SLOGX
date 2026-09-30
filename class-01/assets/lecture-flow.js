(() => {
  const track = document.querySelector('#slide-track');
  const slides = [...document.querySelectorAll('[data-slide]')];
  const sections = [...document.querySelectorAll('[data-parallax]')];
  const header = document.querySelector('.unified-header');
  const sectionLinks = [...document.querySelectorAll('[data-section]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!track || !slides.length) return;

  let current = 0;
  let trackFrame = 0;
  let pageFrame = 0;
  const slideTitle = index => index === 0 ? 'Contents' : slides[index].querySelector('.slide-intro h2').textContent.trim();

  function updateDeck(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
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
    const position = current === 0 ? 'CONTENTS / 05' : `${String(current).padStart(2, '0')} / 05 · ${slideTitle(current).toUpperCase()}`;
    document.querySelector('#deck-position').textContent = position;
    document.querySelector('#deck-mobile-position').textContent = current === 0 ? 'Contents' : `${String(current).padStart(2, '0')} / 05`;
    document.querySelector('#deck-progress-fill').style.width = `${current / (slides.length - 1) * 100}%`;
  }

  function goTo(index, smooth = true) {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    updateDeck(next);
    track.scrollTo({ left: next * track.clientWidth, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
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
  track.addEventListener('scroll', () => {
    if (trackFrame) return;
    trackFrame = requestAnimationFrame(() => {
      trackFrame = 0;
      updateDeck(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
    });
  }, { passive: true });

  function updatePage() {
    pageFrame = 0;
    const threshold = (header?.getBoundingClientRect().height || 0) + 90;
    let active = sections[0];
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold) active = section;
      if (reducedMotion.matches) {
        section.style.removeProperty('--parallax-y');
        section.style.removeProperty('--art-y');
      } else {
        const offset = Math.max(-90, Math.min(90, -rect.top * 0.12));
        section.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
        if (section.id === 'intro') section.style.setProperty('--art-y', `${(-offset * 0.25).toFixed(1)}px`);
      }
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
  reducedMotion.addEventListener('change', schedulePage);

  const oldLinks = { responses: 1, model: 2, evidence: 3, future: 4, world: 5 };
  function openHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    const slideIndex = oldLinks[hash] ?? slides.findIndex(slide => slide.id === hash);
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
