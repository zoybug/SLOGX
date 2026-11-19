(() => {
  const head = document.querySelector('.edition-head');
  const menu = head.querySelector('.ed-menu');
  new ResizeObserver(() => {
    document.body.style.setProperty('--ed-head-height', head.offsetHeight + 'px');
  }).observe(head);

  if (menu) {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener('focusout', event => {
      if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
    });
  }

  function revealHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    const disclosure = target.matches('details') ? target : target.closest('.finding')?.querySelector('details');
    if (disclosure) disclosure.open = true;
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();
  document.querySelector('a[href="#about"]')?.addEventListener('click', () => {
    document.getElementById('about').open = true;
  });

  // The original two readers already track their own slideshow and section links.
  const sectionLinks = [...head.querySelectorAll('[data-section]')];
  if (sectionLinks.length && !document.body.classList.contains('early-reader')) {
    const sections = sectionLinks.map(link => document.getElementById(link.dataset.section));
    let frame = 0;
    function markSection() {
      frame = 0;
      let current = 0;
      sections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= head.offsetHeight + 35) current = i;
      });
      sectionLinks.forEach((link, i) => {
        if (i === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(markSection); };
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    markSection();
  }

  const lab = document.querySelector('.model .lab-controls');
  if (lab) {
    const model = lab.closest('.model');
    const value = name => Number(lab.querySelector('[name="' + name + '"]').value);
    function updateModel() {
      lab.querySelectorAll('input[type="range"]').forEach(input => {
        lab.querySelector('[data-value="' + input.name + '"]').textContent = input.value + ' ' + input.dataset.unit;
      });
      let result;
      switch (model.dataset.model) {
        case '3': {
          const batch = value('wait') + 5 + 3;
          const deadline = value('due');
          const outcome = end => end > deadline ? (end - deadline) + ' min late' : end === deadline ? 'right on the deadline' : (deadline - end) + ' min early';
          result = 'Alone, A finishes at minute 7 (' + outcome(7) + '). In the batch, A finishes at minute ' + batch + ' (' + outcome(batch) + ').';
          break;
        }
        case '5':
          result = 'The vehicle travels ' + (value('speed') * value('age')) + ' m after the fix (' + value('speed') + ' m/s × ' + value('age') + ' s).';
          break;
        case '6': {
          const total = 5 + 6 + value('queue') + value('pickup');
          const comparison = total === 22 ? 'Both services take the same time.' : (total < 22 ? 'The station service' : 'The rider') + ' is ' + Math.abs(total - 22) + ' min faster.';
          result = 'Station delivery takes ' + total + ' min. ' + comparison;
          break;
        }
        case '7': {
          const dest = lab.querySelector('[name="stack"]:checked').value;
          const stacks = {A:[1], B:dest === 'B' ? [2,3] : [2], C:dest === 'C' ? [3] : []};
          lab.querySelectorAll('[data-stack]').forEach(stack => {
            const name = stack.dataset.stack;
            const label = document.createElement('small');
            label.textContent = 'Stack ' + name;
            stack.replaceChildren(label);
            stacks[name].forEach(box => {
              const block = document.createElement('b');
              block.textContent = box;
              if (box === 3) block.className = 'blocker';
              stack.append(block);
            });
          });
          result = dest === 'B' ? 'Two relocations. Box 3 frees box 1 but blocks box 2, so the crane must move it again.' : 'One relocation. Moving box 3 into the empty stack leaves both upcoming pickups accessible.';
          break;
        }
      }
      model.querySelector('.lab-result').textContent = result;
    }
    lab.hidden = false;
    lab.addEventListener('input', updateModel);
    updateModel();
  }

  const practice = document.querySelector('[data-practice]');
  if (!practice) return;
  const items = [...practice.querySelectorAll('.practice-item')];
  const actions = practice.querySelector('.quiz-actions');
  const status = practice.querySelector('.practice-status');
  const check = actions.querySelector('[data-check]');
  const next = actions.querySelector('[data-next]');
  const reset = actions.querySelector('[data-reset]');
  const storageKey = 'slogx-2026-quiz-v1/' + location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  let responses = [];
  let finished = false;
  let index = 0;
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (Array.isArray(saved?.responses) && saved.responses.length <= items.length &&
        saved.responses.every(i => Number.isInteger(i) && i >= 0 && i <= 2)) {
      responses = saved.responses;
      finished = saved.finished === true && responses.length === items.length;
      const lastAnswer = Math.max(0, responses.length - 1);
      const firstUnanswered = Math.min(responses.length, items.length - 1);
      index = Number.isInteger(saved.index) && saved.index >= lastAnswer && saved.index <= firstUnanswered ? saved.index : lastAnswer;
    }
  } catch { /* The quiz also works when browser storage is unavailable. */ }
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({responses, finished, index})); } catch {}
  }
  function draw(focus = false) {
    let score = 0;
    items.forEach((item, i) => {
      if (responses[i] === Number(item.dataset.key)) score++;
      item.hidden = finished || i !== index;
    });
    reset.hidden = !finished;
    if (finished) {
      check.hidden = true;
      next.hidden = true;
      status.textContent = 'Quiz complete. Score ' + score + ' of ' + items.length + '.';
      if (focus) reset.focus();
      return;
    }
    const item = items[index];
    const key = item.querySelector('.answer-key');
    const answered = index < responses.length;
    item.querySelector('fieldset').disabled = answered;
    item.querySelectorAll('input').forEach(input => {
      input.checked = answered && Number(input.value) === responses[index];
    });
    check.hidden = answered;
    check.disabled = true;
    next.hidden = !answered;
    next.textContent = index === items.length - 1 ? 'See result' : 'Next question';
    key.hidden = !answered;
    key.open = answered;
    status.textContent = 'Question ' + (index + 1) + ' of ' + items.length +
      (answered ? (responses[index] === Number(item.dataset.key) ? ' · Correct' : ' · Review the answer') + ' · Score ' + score + '/' + responses.length : '');
    if (focus) {
      if (answered) next.focus();
      else item.querySelector('input').focus();
    }
  }
  practice.classList.add('has-script');
  actions.hidden = false;
  practice.addEventListener('change', event => {
    if (event.target.matches('input[type="radio"]') && !items[index].hidden) check.disabled = false;
  });
  check.addEventListener('click', () => {
    const input = items[index].querySelector('input:checked');
    if (!input || index < responses.length) return;
    responses.push(Number(input.value));
    save();
    draw(true);
  });
  next.addEventListener('click', () => {
    if (index + 1 < items.length) index++;
    else finished = true;
    save();
    draw(true);
  });
  reset.addEventListener('click', () => {
    index = 0;
    responses = [];
    finished = false;
    save();
    draw(true);
  });
  draw();
})();
