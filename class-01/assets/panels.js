(() => {
  const panels = [...document.querySelectorAll('.content-dialog')];
  const openers = [...document.querySelectorAll('[data-panel]')];
  if (!panels.length) return;

  let returnFocus = null;
  let mainTarget = null;
  const titleOf = panel => panel.querySelector('.dialog-intro h2').textContent.trim();
  const numberOf = panel => String(panels.indexOf(panel) + 1).padStart(2, '0');

  function setNeighbor(button, target, direction) {
    button.disabled = !target;
    button.setAttribute('aria-label', target ? `${direction} chapter: ${titleOf(target)}` : `No ${direction.toLowerCase()} chapter`);
    const title = button.querySelector('.neighbor-title, .mobile-neighbor');
    if (title) title.textContent = target ? titleOf(target) : direction === 'Previous' ? 'Start' : 'End';
    const number = button.querySelector('.neighbor-number');
    if (number) number.textContent = target ? `${numberOf(target)} / 05` : '';
  }

  function updateNavigation(panel) {
    const index = panels.indexOf(panel);
    const previous = panels[index - 1];
    const next = panels[index + 1];
    panel.querySelectorAll('[data-step="-1"]').forEach(button => setNeighbor(button, previous, 'Previous'));
    panel.querySelectorAll('[data-step="1"]').forEach(button => setNeighbor(button, next, 'Next'));
    panel.querySelector('.mobile-progress').textContent = `${numberOf(panel)} / 05`;
  }

  function openPanel(id) {
    const panel = document.getElementById(id);
    if (!panel || !panel.matches('dialog')) return;
    const current = panels.find(item => item.open);
    if (current === panel) return;
    if (current) current.close();
    returnFocus = openers.find(button => button.dataset.panel === id) || null;
    updateNavigation(panel);
    panel.showModal();
    panel.querySelector('.dialog-scroll').scrollTop = 0;
    // A direct hash link can scroll to a nested section after the dialog opens.
    requestAnimationFrame(() => {
      if (panel.open) panel.querySelector('.dialog-scroll').scrollTop = 0;
    });
    document.body.classList.add('modal-open');
    panel.querySelector('[data-close]').focus({ preventScroll: true });
    history.replaceState(null, '', `${location.pathname}${location.search}#${id.replace(/^panel-/, '')}`);
  }

  openers.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
  panels.forEach(panel => {
    panel.querySelector('[data-close]').addEventListener('click', () => panel.close());
    panel.querySelector('[data-student-start]').addEventListener('click', () => openPanel('panel-responses'));
    panel.querySelectorAll('[data-main-section]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      mainTarget = link.dataset.mainSection;
      history.pushState(null, '', `${location.pathname}${location.search}#${mainTarget}`);
      panel.close();
    }));
    panel.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
      const target = panels[panels.indexOf(panel) + Number(button.dataset.step)];
      if (target) openPanel(target.id);
    }));
    panel.addEventListener('close', () => {
      if (panels.some(item => item.open)) return;
      document.body.classList.remove('modal-open');
      if (mainTarget) {
        const target = document.getElementById(mainTarget);
        mainTarget = null;
        requestAnimationFrame(() => {
          if (!target) return;
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }
      if (location.hash === `#${panel.id.replace(/^panel-/, '')}`) history.replaceState(null, '', location.pathname + location.search);
      if (returnFocus) returnFocus.focus({ preventScroll: true });
    });
  });

  const initial = location.hash.slice(1);
  if (initial) openPanel(`panel-${initial}`);
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id && panels.some(panel => panel.id === `panel-${id}`)) openPanel(`panel-${id}`);
    else {
      const open = panels.find(panel => panel.open);
      if (open) {
        mainTarget = id;
        open.close();
      }
    }
  });
})();
