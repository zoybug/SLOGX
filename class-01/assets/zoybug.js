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
  const is2025 = document.body.dataset.courseYear === '2025';

  const widget = document.createElement('aside');
  widget.className = 'zoybug-widget';
  widget.dataset.visited = String(seen.size > 0);
  widget.style.setProperty('--discovery-progress', `${seen.size}%`);
  widget.setAttribute('aria-label', 'Zoybug logistics facts');
  widget.innerHTML = `
    <section class="zoybug-card" id="zoybug-fact-card" aria-label="Logistics fact" hidden>
      ${is2025 ? '<div class="zoybug-identity"><strong>Zoybug</strong><span>Your logistics familiar</span></div>' : ''}
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
  if (is2025) {
    widget.classList.add('zoybug-familiar');
    // An original parcel creature with a discovery display, drawn as crisp SVG.
    widget.querySelector('.zoybug-trigger').innerHTML = `
      <svg viewBox="0 0 112 132" focusable="false" aria-hidden="true">
        <ellipse class="zoybug-ground" cx="56" cy="124" rx="29" ry="5" fill="#183b35" opacity=".12"/>
        <g class="zoybug-aura" fill="none" stroke="#99d9c3" stroke-width="1.5">
          <ellipse cx="56" cy="78" rx="49" ry="35" stroke-dasharray="4 7" opacity=".55"/>
          <circle cx="8" cy="69" r="3" fill="#ef6848" stroke="none"/>
          <path d="M97 32v10m-5-5h10M14 35v6m-3-3h6" stroke="#d95739" stroke-linecap="round"/>
        </g>
        <g class="zoybug-feelers" stroke="#214e43" stroke-width="3" stroke-linecap="round">
          <path d="M41 33 32 18m39 15 9-15"/>
          <circle cx="31" cy="16" r="5" fill="#ef6848"/><circle cx="81" cy="16" r="5" fill="#ef6848"/>
        </g>
        <g class="zoybug-fin zoybug-fin-left"><path d="M27 65C13 58 6 63 12 79l15 10" fill="#a9e8d4" stroke="#214e43" stroke-width="2.5"/><path d="m14 69 10 10" stroke="#62ac95" stroke-width="2"/></g>
        <g class="zoybug-fin zoybug-fin-right"><path d="M85 65c14-7 21-2 15 14L85 89" fill="#a9e8d4" stroke="#214e43" stroke-width="2.5"/><path d="m98 69-10 10" stroke="#62ac95" stroke-width="2"/></g>
        <path d="M28 97c-3 11 0 18 9 18l9-8m38-10c3 11 0 18-9 18l-9-8" fill="#ef6848" stroke="#214e43" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M24 64c0-24 12-36 32-36s32 12 32 36v21c0 17-12 26-32 26S24 102 24 85Z" fill="#ccf0df" stroke="#214e43" stroke-width="3"/>
        <path d="M31 62c0-14 9-23 25-23s25 9 25 23v20c0 14-9 21-25 21s-25-7-25-21Z" fill="#fbfbef"/>
        <rect x="34" y="31" width="44" height="22" rx="7" fill="#173e35" stroke="#7abb9c" stroke-width="2"/>
        <path d="M40 35h8" stroke="#dbf9e6" stroke-width="1.5" stroke-linecap="round" opacity=".45"/>
        <text class="zoybug-meter" x="56" y="48" text-anchor="middle" fill="#c5f99b" font-family="'IBM Plex Mono',monospace" font-size="16" font-weight="500">000</text>
        <g class="zoybug-eye"><g fill="#173e35"><ellipse cx="44" cy="64" rx="4" ry="5.5"/><ellipse cx="68" cy="64" rx="4" ry="5.5"/></g><g fill="#fff"><circle cx="45" cy="62" r="1.3"/><circle cx="69" cy="62" r="1.3"/></g></g>
        <ellipse cx="36" cy="73" rx="5" ry="2.5" fill="#ef9b82" opacity=".75"/><ellipse cx="76" cy="73" rx="5" ry="2.5" fill="#ef9b82" opacity=".75"/>
        <path class="zoybug-smile" d="M51 73q5 6 10 0" fill="none" stroke="#173e35" stroke-width="2" stroke-linecap="round"/>
        <g class="zoybug-parcel"><path d="m42 88 14-5 14 5v14l-14 5-14-5Z" fill="#eb6546" stroke="#b44830" stroke-width="1.5"/><path d="m42 88 14 5 14-5m-14 5v14m-7-21 14 5" fill="none" stroke="#ffd5ad" stroke-width="1.5"/><path d="m62 86-13 6" stroke="#fff1c9" stroke-width="3"/></g>
      </svg>`;
  }
  document.body.append(widget);

  const trigger = widget.querySelector('.zoybug-trigger');
  const card = widget.querySelector('.zoybug-card');
  const close = widget.querySelector('.zoybug-close');
  const topic = widget.querySelector('.zoybug-topic');
  const text = widget.querySelector('.zoybug-fact');
  const source = widget.querySelector('.zoybug-source');
  const count = widget.querySelector('.zoybug-count');
  const meter = widget.querySelector('.zoybug-meter');

  function updateMeter() {
    if (!meter) return;
    meter.textContent = String(seen.size).padStart(3, '0');
    trigger.setAttribute('aria-label', `Zoybug: reveal a logistics fact. ${seen.size} of ${facts.length} discovered`);
  }
  updateMeter();

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
    widget.dataset.open = 'true';
    updateMeter();
  }

  function dismiss() {
    card.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    widget.dataset.open = 'false';
    trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', reveal);
  close.addEventListener('click', dismiss);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !card.hidden) dismiss();
  });
})();
