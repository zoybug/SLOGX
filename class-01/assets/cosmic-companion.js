(() => {
  const facts = window.ZOYBUG_FACTS;
  if (!Array.isArray(facts) || facts.length !== 100) return;
  const meerkatUrl = new URL('mechanic-meerkat.webp', document.currentScript.src).href;
  const discoveryKey = 'zoybug-discoveries-v2';
  const evolutionKey = 'zoybug-cosmic-evolution-v1';
  const validIds = new Set(facts.map(fact => fact.id));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let seen = new Set(), steps = 0, pulse = null, ripple = null, frame = 0, storageAvailable = true;

  function loadProgress() {
    if (!storageAvailable) return;
    try {
      const saved = JSON.parse(localStorage.getItem(discoveryKey) || '[]');
      seen = new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
      const savedSteps = Number(localStorage.getItem(evolutionKey));
      steps = Number.isFinite(savedSteps) ? Math.max(0, Math.min(12, Math.floor(savedSteps))) : 0;
    } catch (_) { storageAvailable = false; }
  }
  loadProgress();

  const dock = document.createElement('div');
  dock.className = 'cosmic-dock';
  const widget = document.createElement('aside');
  widget.className = 'zoybug-widget zoybug-cosmic';
  widget.setAttribute('aria-label', 'Logistics discoveries');
  widget.dataset.open = 'false';
  widget.innerHTML = `
    <button class="zoybug-trigger" type="button" aria-expanded="false" aria-controls="zoybug-fact-card">
      <span class="cosmic-form" aria-hidden="true">
        <span class="cosmic-halo"></span><span class="cosmic-ripple"></span><span class="cosmic-orbit"></span>
        <span class="cosmic-sphere"><span class="cosmic-cloud cosmic-cloud-one"></span><span class="cosmic-cloud cosmic-cloud-two"></span><span class="cosmic-stars"></span><span class="cosmic-glass"></span></span>
        <img class="cosmic-meerkat" alt="" width="400" height="600" decoding="async">
      </span>
    </button>
    <section class="zoybug-card" id="zoybug-fact-card" aria-labelledby="zoybug-card-title" hidden>
      <div class="cosmic-card-header"><div class="cosmic-fact-heading"><h2 id="zoybug-card-title" class="zoybug-topic"></h2><span class="zoybug-count"></span></div><button class="zoybug-close" type="button" aria-label="Close discovery">×</button></div>
      <p class="zoybug-fact" aria-live="polite" aria-atomic="true"></p>
      <div class="zoybug-card-foot"><a class="zoybug-source" target="_blank" rel="noopener noreferrer"></a><button class="cosmic-next" type="button">Discover another <span aria-hidden="true">↗</span></button></div>
    </section>`;
  dock.append(widget);
  document.body.append(dock);
  const trigger = widget.querySelector('.zoybug-trigger'), card = widget.querySelector('.zoybug-card');
  const close = widget.querySelector('.zoybug-close'), topic = widget.querySelector('.zoybug-topic');
  const text = widget.querySelector('.zoybug-fact'), source = widget.querySelector('.zoybug-source');
  const count = widget.querySelector('.zoybug-count'), portrait = widget.querySelector('.cosmic-meerkat');
  const form = widget.querySelector('.cosmic-form'), wave = widget.querySelector('.cosmic-ripple');

  function updateEvolution() {
    const stage = steps >= 12 ? 5 : steps >= 9 ? 4 : steps >= 6 ? 3 : steps >= 4 ? 2 : steps >= 2 ? 1 : 0;
    widget.dataset.stage = String(stage);
    widget.dataset.evolution = String(steps);
    widget.style.setProperty('--cosmic-progress', String(steps / 12));
    widget.style.setProperty('--cosmic-angle', `${steps * 29}deg`);
    widget.style.setProperty('--cosmic-hue', `${steps * 13}deg`);
    widget.style.setProperty('--cosmic-reveal', String(Math.max(0, (steps - 8) / 4)));
    count.textContent = `${seen.size} / ${facts.length} facts`;
    trigger.setAttribute('aria-label', `Discover a logistics fact. ${seen.size} of ${facts.length} facts discovered.`);
    if (steps >= 8 && !portrait.hasAttribute('src')) portrait.src = meerkatUrl;
  }
  portrait.addEventListener('load', () => { widget.dataset.portraitReady = 'true'; });
  updateEvolution();
  function react() {
    pulse?.cancel(); ripple?.cancel();
    if (reducedMotion.matches) return;
    pulse = form.animate(steps === 12 ? [{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(-5deg) scale(1.07)', offset: .4 }, { transform: 'rotate(0deg) scale(1)' }] : [{ transform: 'scale(1)' }, { transform: 'scale(1.1)', offset: .4 }, { transform: 'scale(1)' }], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
    ripple = wave.animate([{ opacity: .7, transform: 'scale(.8)' }, { opacity: 0, transform: 'scale(1.65)' }], { duration: 850, easing: 'ease-out' });
  }
  function reveal() {
    loadProgress();
    const pool = seen.size < facts.length ? facts.filter(fact => !seen.has(fact.id)) : facts;
    const fact = pool[Math.floor(Math.random() * pool.length)];
    seen.add(fact.id); steps = Math.min(12, steps + 1);
    if (storageAvailable) {
      try { localStorage.setItem(discoveryKey, JSON.stringify([...seen])); localStorage.setItem(evolutionKey, String(steps)); }
      catch (_) { storageAvailable = false; } // Keep evolving in memory if saving fails.
    }
    card.hidden = false;
    widget.dataset.open = 'true';
    trigger.setAttribute('aria-expanded', 'true');
    topic.textContent = fact.topic.toLowerCase(); text.textContent = fact.text;
    source.href = fact.url; source.textContent = `${fact.source} ↗`;
    source.setAttribute('aria-label', `Read source: ${fact.source}`);
    updateEvolution(); react(); place();
  }
  function dismiss(restoreFocus = true) {
    card.hidden = true; widget.dataset.open = 'false'; trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({ preventScroll: true });
    schedulePlace();
  }
  function dockAtFooter(docked) { widget.dataset.docked = String(docked); dock.dataset.docked = String(docked); }
  function place() {
    frame = 0;
    if (!card.hidden) {
      dockAtFooter(false);
      widget.style.setProperty('--cosmic-bottom', '18px');
      // Hiding the orb on a short sheet can reset native focus to the body.
      if (innerHeight <= 500 && !document.querySelector('dialog[open]') &&
          (document.activeElement === trigger || document.activeElement === document.body)) {
        close.focus({ preventScroll: true });
      }
      return;
    }
    if (widget.contains(document.activeElement) || (matchMedia('(hover: hover)').matches && widget.matches(':hover'))) return;
    dockAtFooter(false);
    const box = trigger.getBoundingClientRect();
    const header = document.querySelector('.masthead, .unified-header');
    const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom || 0);
    const controls = [...document.querySelectorAll('a,button,input,select,textarea,summary,[tabindex]')]
      .filter(el => !widget.contains(el) && !el.closest('dialog'))
      .map(el => el.getBoundingClientRect())
      .filter(rect => rect.width && rect.height && rect.bottom > headerBottom && rect.top < innerHeight);
    for (let index = 0; index < 3; index++) {
      const bottom = 18 + index * (box.height + 12), top = innerHeight - bottom - box.height;
      if (top < headerBottom + 12) break;
      const overlaps = controls.some(rect => rect.left < box.right + 6 && rect.right > box.left - 6 && rect.top < top + box.height + 6 && rect.bottom > top - 6);
      if (!overlaps) { widget.style.setProperty('--cosmic-bottom', `${bottom}px`); return; }
    }
    dockAtFooter(true);
  }
  function schedulePlace() { if (!frame) frame = requestAnimationFrame(place); }
  trigger.addEventListener('click', reveal);
  widget.querySelector('.cosmic-next').addEventListener('click', reveal);
  close.addEventListener('click', () => dismiss());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.defaultPrevented && !card.hidden && !document.querySelector('dialog[open]')) { event.preventDefault(); dismiss(); }
  });
  document.addEventListener('pointerdown', event => {
    if (!card.hidden && !widget.contains(event.target) && !document.querySelector('dialog[open]')) dismiss(false);
  });
  document.addEventListener('focusin', schedulePlace);
  window.addEventListener('scroll', schedulePlace, { passive: true });
  window.addEventListener('resize', () => { if (card.hidden) schedulePlace(); else place(); });
  window.addEventListener('storage', event => {
    if (event.key === discoveryKey || event.key === evolutionKey || event.key === null) { loadProgress(); updateEvolution(); }
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { pulse?.cancel(); ripple?.cancel(); } });
  document.fonts.ready.then(schedulePlace);
  schedulePlace();
})();
