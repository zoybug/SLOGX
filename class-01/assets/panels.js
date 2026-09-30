(() => {
  const panels = [...document.querySelectorAll('.content-dialog')];
  const openers = [...document.querySelectorAll('[data-panel]')];
  if (!panels.length) return;
  let lastOpener = null;

  function openPanel(id, opener = null) {
    const panel = document.getElementById(id);
    if (!panel || !panel.matches('dialog')) return;
    const current = panels.find(item => item.open);
    if (current && current !== panel) current.close();
    lastOpener = opener;
    if (!panel.open) panel.showModal();
    document.body.classList.add('modal-open');
    const close = panel.querySelector('[data-close]');
    if (close) close.focus({ preventScroll: true });
    history.replaceState(null, '', `#${id.replace(/^panel-/, '')}`);
  }

  openers.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel, button)));
  panels.forEach(panel => {
    panel.querySelector('[data-close]').addEventListener('click', () => panel.close());
    panel.addEventListener('click', event => { if (event.target === panel) panel.close(); });
    panel.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (location.hash === `#${panel.id.replace(/^panel-/, '')}`) history.replaceState(null, '', location.pathname + location.search);
      if (lastOpener) lastOpener.focus({ preventScroll: true });
    });
  });
  const initial = location.hash.slice(1);
  if (initial) openPanel(`panel-${initial}`);
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id && panels.some(panel => panel.id === `panel-${id}`)) openPanel(`panel-${id}`);
  });
})();
