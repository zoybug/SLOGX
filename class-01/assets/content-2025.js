/* Reading, evidence and navigation safeguards for the 2025 archive only. */
(() => {
  if (!document.body.classList.contains('content-2025')) return;
  const header = document.querySelector('.unified-header');
  const quiz = document.getElementById('quiz');
  const restart = document.getElementById('quiz-restart');
  const quizStatus = document.getElementById('quiz-status');
  let activeAttempt = false;
  let approvedExit = false;
  let restarting = false;
  const openDialogs = new Map();
  let pageLock = null;

  function openDialog(dialog, trigger = null) {
    if (!dialog || dialog.open) return;
    if (!openDialogs.size) {
      pageLock = { x: scrollX, y: scrollY, overflow: document.body.style.overflow };
      document.body.style.overflow = 'hidden';
    }
    openDialogs.set(dialog, { trigger: trigger || document.activeElement, restore: true });
    dialog.showModal();
    dialog.querySelector('.dialog-content')?.scrollTo(0, 0);
    dialog.querySelector('[data-guard-stay], [data-close-dialog]')?.focus({ preventScroll: true });
  }
  function closeDialog(dialog, restore = true) {
    const info = openDialogs.get(dialog);
    if (info) info.restore = restore;
    dialog.close();
  }
  function onClose(dialog) {
    const info = openDialogs.get(dialog);
    openDialogs.delete(dialog);
    if (!openDialogs.size && pageLock) {
      document.body.style.overflow = pageLock.overflow;
      if (info?.restore) window.scrollTo(pageLock.x, pageLock.y);
      pageLock = null;
    }
    if (info?.restore && info.trigger?.isConnected) info.trigger.focus({ preventScroll: true });
  }
  function connectDialog(dialog) {
    dialog.addEventListener('close', () => onClose(dialog));
    const content = dialog.querySelector('.dialog-content');
    if (content) {
      content.tabIndex = 0;
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', dialog.getAttribute('aria-labelledby'));
    }
  }
  document.querySelectorAll('.evidence-dialog').forEach(connectDialog);
  document.addEventListener('click', event => {
    const detail = event.target.closest('[data-detail]');
    if (detail) openDialog(document.getElementById(detail.dataset.detail), detail);
    const close = event.target.closest('[data-close-dialog]');
    if (close) closeDialog(close.closest('dialog'));
  });
  document.querySelectorAll('[data-detail]').forEach(button => button.setAttribute('aria-haspopup', 'dialog'));

  let guard = null;
  let pendingAction = null;
  function ensureGuard() {
    if (guard) return;
    guard = document.createElement('dialog');
    guard.id = 'quiz-exit-dialog';
    guard.className = 'evidence-dialog quiz-guard';
    guard.setAttribute('aria-labelledby', 'quiz-exit-title');
    guard.setAttribute('aria-describedby', 'quiz-exit-description');
    guard.innerHTML = '<div class="dialog-heading"><h2 id="quiz-exit-title">Leave this quiz?</h2></div><div class="dialog-content"><p id="quiz-exit-description">Your current progress will be lost if you leave now.</p><div class="guard-actions"><button type="button" data-guard-stay>Stay on quiz</button><button type="button" data-guard-leave>Leave quiz</button></div></div>';
    document.body.append(guard);
    connectDialog(guard);
    guard.querySelector('[data-guard-stay]').addEventListener('click', () => {
      pendingAction = null;
      closeDialog(guard);
    });
    guard.querySelector('[data-guard-leave]').addEventListener('click', () => {
      const action = pendingAction;
      pendingAction = null;
      closeDialog(guard, false);
      // close events are asynchronous; restore body scrolling before navigation.
      setTimeout(() => action?.(), 0);
    });
    guard.addEventListener('cancel', () => { pendingAction = null; });
  }
  function confirmExit(action, trigger, isRestart = false) {
    ensureGuard();
    if (guard.open) return;
    pendingAction = action;
    guard.querySelector('h2').textContent = isRestart ? 'Restart this quiz?' : 'Leave this quiz?';
    guard.querySelector('[data-guard-leave]').textContent = isRestart ? 'Restart quiz' : 'Leave quiz';
    openDialog(guard, trigger);
  }
  function resetAttempt() {
    activeAttempt = false;
    restarting = true;
    restart?.click();
    restarting = false;
  }
  // Read the final quiz state after its target listeners have updated scoring.
  document.addEventListener('click', event => {
    if (event.target.closest('#quiz-choices [data-answer]')) {
      activeAttempt = !quizStatus.textContent.startsWith('Quiz complete');
      if (activeAttempt && restart) restart.hidden = false;
    }
    if (event.target.closest('#quiz-next') && quizStatus.textContent.startsWith('Quiz complete')) activeAttempt = false;
  });
  document.addEventListener('click', event => {
    if (event.target.closest('#quiz-restart')) {
      if (activeAttempt && !restarting) {
        event.preventDefault(); event.stopImmediatePropagation();
        confirmExit(resetAttempt, event.target, true);
      } else activeAttempt = false;
    }
  }, true);
  window.addEventListener('beforeunload', event => {
    if (!activeAttempt || approvedExit) return;
    event.preventDefault(); event.returnValue = '';
  });
  // A browser may restore a document from its cache after a previously approved exit.
  window.addEventListener('pageshow', () => { approvedExit = false; });

  const session = `slogx-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let historyIndex = 0;
  let historyRestore = null;
  let allowHistory = false;
  history.scrollRestoration = 'manual';
  history.replaceState({ ...history.state, slogxSession: session, slogxIndex: 0 }, '', location.href);

  function hashTarget(url) {
    if (!url.hash) return null;
    try { return document.getElementById(decodeURIComponent(url.hash.slice(1))); }
    catch { return null; }
  }
  function readDestination(url) {
    const target = hashTarget(url);
    const dialog = target?.closest('dialog');
    if (dialog) { openDialog(dialog); return; }
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      const focus = target.matches('a,button,input,select,summary') ? target : target.querySelector('h1,h2,h3') || target;
      if (!focus.hasAttribute('tabindex')) focus.tabIndex = -1;
      focus.focus({ preventScroll: true });
    } else if (!url.hash) window.scrollTo(0, 0);
  }
  function navigate(url) {
    document.querySelectorAll('dialog[open]').forEach(dialog => closeDialog(dialog, false));
    const sameDocument = url.origin === location.origin && url.pathname === location.pathname && url.search === location.search;
    if (!sameDocument) { approvedExit = true; location.assign(url.href); return; }
    historyIndex++;
    history.pushState({ slogxSession: session, slogxIndex: historyIndex }, '', url.href);
    // Let native dialog close events run before changing the reading position.
    setTimeout(() => readDestination(url), 0);
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, location.href);
    if (!['http:', 'https:'].includes(url.protocol)) return;
    const sameDocument = url.origin === location.origin && url.pathname === location.pathname && url.search === location.search;
    const destination = hashTarget(url);
    const staysInQuiz = sameDocument && (destination === quiz || quiz?.contains(destination));
    if (activeAttempt && !staysInQuiz) {
      event.preventDefault(); event.stopImmediatePropagation();
      confirmExit(() => { resetAttempt(); navigate(url); }, anchor);
    } else if (sameDocument) {
      event.preventDefault();
      navigate(url);
    }
  }, true);

  window.addEventListener('popstate', event => {
    const state = event.state;
    if (state?.slogxSession !== session) return;
    if (historyRestore) {
      const restore = historyRestore;
      historyRestore = null;
      window.scrollTo(restore.x, restore.y);
      requestAnimationFrame(() => window.scrollTo(restore.x, restore.y));
      confirmExit(() => { resetAttempt(); allowHistory = true; history.go(restore.delta); }, restore.trigger);
      return;
    }
    const delta = state.slogxIndex - historyIndex;
    if (activeAttempt && !allowHistory && delta) {
      historyRestore = { delta, x: scrollX, y: scrollY, trigger: document.activeElement };
      history.go(-delta);
      return;
    }
    allowHistory = false;
    historyIndex = state.slogxIndex;
    readDestination(new URL(location.href));
  });

  function updateHeader() {
    if (header) document.body.style.setProperty('--briefing-header-height', `${header.getBoundingClientRect().height}px`);
  }
  if (header) new ResizeObserver(updateHeader).observe(header);
  updateHeader();
  const sectionLinks = [...document.querySelectorAll('[data-section]')];
  const sections = sectionLinks.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
  let sectionFrame = 0;
  function updateSection() {
    sectionFrame = 0;
    const threshold = (header?.getBoundingClientRect().bottom || 0) + 60;
    let active = sections[0];
    sections.forEach(section => { if (section.getBoundingClientRect().top <= threshold) active = section; });
    sectionLinks.forEach(link => {
      if (link.dataset.section === active?.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleSection() { if (!sectionFrame) sectionFrame = requestAnimationFrame(updateSection); }
  window.addEventListener('scroll', scheduleSection, { passive: true });
  window.addEventListener('resize', scheduleSection);
  updateSection();
  // Explorer scripts replace their selectors; put focus on the new selected control.
  document.querySelectorAll('#stage-grid,#case-selector').forEach(container => container.addEventListener('click', event => {
    if (event.target.closest('button')) container.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
  }));
  window.addEventListener('load', () => requestAnimationFrame(() => {
    updateHeader();
    if (location.hash) readDestination(new URL(location.href));
  }));

  // Keep the optional companion from covering reading controls in the lower corner.
  document.addEventListener('DOMContentLoaded', () => {
    const widget = document.querySelector('.zoybug-widget');
    if (!widget) return;
    let frame = 0;
    function place() {
      frame = 0;
      if (innerWidth <= 1100) return; // The companion has its own footer space.
      if (widget.querySelector('.zoybug-trigger')?.getAttribute('aria-expanded') === 'true') {
        widget.style.setProperty('--zoybug-bottom', '16px'); return;
      }
      const rect = widget.getBoundingClientRect();
      const headerBottom = header?.getBoundingClientRect().bottom || 0;
      const controls = [...document.querySelectorAll('a,button,input,select,summary')].filter(el => !widget.contains(el)).map(el => el.getBoundingClientRect()).filter(box => box.width && box.height && box.bottom > headerBottom && box.top < innerHeight);
      const overlaps = bottom => {
        const top = innerHeight - bottom - rect.height;
        return controls.filter(box => box.left < rect.right + 8 && box.right > rect.left - 8 && box.top < top + rect.height + 8 && box.bottom > top - 16).length;
      };
      let best = 16, score = overlaps(best);
      for (let bottom = 16 + rect.height + 16; score && bottom <= innerHeight - headerBottom - rect.height - 16; bottom += rect.height + 16) {
        const candidate = overlaps(bottom);
        if (candidate < score) { best = bottom; score = candidate; }
      }
      widget.style.setProperty('--zoybug-bottom', `${best}px`);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(place); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('click', schedule);
    schedule();
  });
})();
