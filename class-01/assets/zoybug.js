(() => {
  const facts = window.ZOYBUG_FACTS;
  if (!Array.isArray(facts) || facts.length !== 100) return;

  const storageKey = 'zoybug-discoveries-v2';
  let saved = [];
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(value)) saved = value.filter(id => facts.some(fact => fact.id === id));
  } catch (_) {
    // Browsers without local storage still get a working fact companion.
  }
  const seen = new Set(saved);

  const widget = document.createElement('aside');
  widget.className = 'zoybug-widget';
  widget.dataset.visited = String(seen.size > 0);
  widget.style.setProperty('--discovery-progress', `${seen.size}%`);
  widget.setAttribute('aria-label', 'Zoybug logistics facts');
  widget.innerHTML = `
    <section class="zoybug-card" id="zoybug-fact-card" aria-label="Logistics fact" hidden>
      <div class="zoybug-card-head"><span class="zoybug-topic"></span><button class="zoybug-close" type="button" aria-label="Close fact">×</button></div>
      <p class="zoybug-fact" aria-live="polite"></p>
      <div class="zoybug-card-foot"><a class="zoybug-source" target="_blank" rel="noopener noreferrer">Read the source ↗</a><span class="zoybug-count"></span></div>
    </section>
    <button class="zoybug-trigger" type="button" aria-label="Zoybug: reveal one logistics fact" aria-expanded="false" aria-controls="zoybug-fact-card">
      <span class="zoybug-hint" aria-hidden="true">TAP FOR A FACT</span>
      <svg viewBox="0 0 88 88" focusable="false" aria-hidden="true">
        <ellipse cx="44" cy="78" rx="25" ry="5" fill="#203b33" opacity=".15"/>
        <g class="zoybug-wing" fill="#d73516" stroke="#315751" stroke-width="2"><path d="M24 43 8 31l4 25 13 1Z"/><path d="m64 43 16-12-4 25-13 1Z"/></g>
        <path d="M44 17V8m0 1 10-5" stroke="#315751" stroke-width="3" stroke-linecap="round"/>
        <circle cx="55" cy="5" r="4" fill="#d73516"/>
        <path d="M18 43c0-19 11-28 26-28s26 9 26 28v14c0 12-11 20-26 20S18 69 18 57Z" fill="#315751" stroke="#183b35" stroke-width="2"/>
        <path d="M25 43c0-13 8-20 19-20s19 7 19 20v13c0 9-8 15-19 15s-19-6-19-15Z" fill="#edf4e8"/>
        <path d="M25 51h38M44 23v48" stroke="#aacabe" stroke-width="2"/>
        <rect x="36" y="42" width="16" height="13" rx="2" fill="#d73516"/>
        <path d="M44 43v11m-6-8h12" stroke="#fff4ed" stroke-width="1.4"/>
        <g class="zoybug-eye" fill="#183b35"><ellipse cx="34" cy="34" rx="3" ry="4"/><ellipse cx="54" cy="34" rx="3" ry="4"/></g>
        <path d="M41 38q3 3 6 0" fill="none" stroke="#183b35" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="24" cy="54" r="3" fill="#d73516"/><circle cx="64" cy="54" r="3" fill="#d73516"/>
      </svg>
    </button>`;
  document.body.append(widget);

  const trigger = widget.querySelector('.zoybug-trigger');
  const card = widget.querySelector('.zoybug-card');
  const close = widget.querySelector('.zoybug-close');
  const topic = widget.querySelector('.zoybug-topic');
  const text = widget.querySelector('.zoybug-fact');
  const source = widget.querySelector('.zoybug-source');
  const count = widget.querySelector('.zoybug-count');

  function reveal() {
    const pool = seen.size < facts.length ? facts.filter(fact => !seen.has(fact.id)) : facts;
    const fact = pool[Math.floor(Math.random() * pool.length)];
    seen.add(fact.id);
    try { localStorage.setItem(storageKey, JSON.stringify([...seen])); } catch (_) {}
    widget.dataset.visited = 'true';
    widget.style.setProperty('--discovery-progress', `${seen.size}%`);
    card.hidden = false;
    topic.textContent = fact.topic;
    text.textContent = fact.text;
    source.href = fact.url;
    source.setAttribute('aria-label', `Read source: ${fact.source}`);
    source.textContent = `${fact.source} ↗`;
    count.textContent = `${seen.size} / ${facts.length} FOUND`;
    trigger.setAttribute('aria-expanded', 'true');
  }

  function dismiss() {
    card.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }

  trigger.addEventListener('click', reveal);
  close.addEventListener('click', dismiss);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !card.hidden) dismiss();
  });
})();
