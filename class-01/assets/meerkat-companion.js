(() => {
  const facts = window.ZOYBUG_FACTS;
  if (!Array.isArray(facts) || facts.length !== 100) return;
  const meerkatUrl = new URL('mechanic-meerkat-natural.webp', document.currentScript.src).href;
  const discoveryKey = 'zoybug-discoveries-v2';
  const validIds = new Set(facts.map(fact => fact.id));
  let seen = new Set(), frame = 0, storageAvailable = true;

  function loadProgress() {
    if (!storageAvailable) return;
    try {
      const saved = JSON.parse(localStorage.getItem(discoveryKey) || '[]');
      seen = new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch (_) { storageAvailable = false; }
  }
  loadProgress();

  const dock = document.createElement('div');
  dock.className = 'meerkat-dock';
  const widget = document.createElement('aside');
  widget.className = 'zoybug-widget zoybug-meerkat';
  widget.setAttribute('aria-label', 'Logistics discoveries');
  widget.dataset.open = 'false';
  widget.innerHTML = `
    <button class="zoybug-trigger" type="button" aria-expanded="false" aria-controls="zoybug-fact-card">
      <img class="meerkat-portrait" alt="" width="400" height="600" decoding="async">
    </button>
    <section class="zoybug-card" id="zoybug-fact-card" aria-labelledby="zoybug-card-title" hidden>
      <div class="meerkat-card-header"><div class="meerkat-fact-heading"><h2 id="zoybug-card-title" class="zoybug-topic"></h2><span class="zoybug-count"></span></div><button class="zoybug-close" type="button" aria-label="Close discovery">×</button></div>
      <p class="zoybug-fact" aria-live="polite" aria-atomic="true"></p>
      <div class="zoybug-card-foot"><a class="zoybug-source" target="_blank" rel="noopener noreferrer"></a><button class="meerkat-next" type="button">Discover another <span aria-hidden="true">↗</span></button></div>
    </section>`;
  dock.append(widget);
  document.body.append(dock);
  const trigger = widget.querySelector('.zoybug-trigger'), card = widget.querySelector('.zoybug-card');
  const close = widget.querySelector('.zoybug-close'), topic = widget.querySelector('.zoybug-topic');
  const text = widget.querySelector('.zoybug-fact'), source = widget.querySelector('.zoybug-source');
  const count = widget.querySelector('.zoybug-count');
  widget.querySelector('.meerkat-portrait').src = meerkatUrl;

  function updateCount() {
    count.textContent = `${seen.size} / ${facts.length} facts`;
    trigger.setAttribute('aria-label', `Meerkat mechanic: discover a logistics fact. ${seen.size} of ${facts.length} facts discovered.`);
  }
  updateCount();
  function reveal() {
    loadProgress();
    const pool = seen.size < facts.length ? facts.filter(fact => !seen.has(fact.id)) : facts;
    const fact = pool[Math.floor(Math.random() * pool.length)];
    seen.add(fact.id);
    if (storageAvailable) {
      try { localStorage.setItem(discoveryKey, JSON.stringify([...seen])); }
      catch (_) { storageAvailable = false; } // Keep discoveries in memory if saving fails.
    }
    card.hidden = false;
    widget.dataset.open = 'true';
    trigger.setAttribute('aria-expanded', 'true');
    topic.textContent = fact.topic.toLowerCase(); text.textContent = fact.text;
    source.href = fact.url; source.textContent = `${fact.source} ↗`;
    source.setAttribute('aria-label', `Read source: ${fact.source}`);
    updateCount(); place();
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
      widget.style.setProperty('--meerkat-bottom', '18px');
      // The compact fact sheet hides the mascot; keep focus on a visible control.
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
      if (!overlaps) { widget.style.setProperty('--meerkat-bottom', `${bottom}px`); return; }
    }
    dockAtFooter(true);
  }
  function schedulePlace() { if (!frame) frame = requestAnimationFrame(place); }
  trigger.addEventListener('click', reveal);
  widget.querySelector('.meerkat-next').addEventListener('click', reveal);
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
    if (event.key === discoveryKey || event.key === null) { loadProgress(); updateCount(); }
  });
  document.fonts.ready.then(schedulePlace);
  schedulePlace();
})();
