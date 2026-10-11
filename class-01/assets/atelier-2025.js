/* Progressive reading and the compact session index, restricted to 2025. */
(() => {
  if (!document.body.classList.contains('content-2025')) return;

  const readingDetails = [...document.querySelectorAll('details.analysis-disclosure, details.profile-disclosure')];
  const menus = [...document.querySelectorAll('details.session-menu')];
  const quizStatus = document.getElementById('quiz-status');
  let activeAttempt = false;
  let outsideFocus = null;

  const dialogOpen = () => !!document.querySelector('dialog[open]');
  const summaryOf = details => [...details.children].find(child => child.tagName === 'SUMMARY');

  function syncDisclosure(details) {
    const summary = summaryOf(details);
    if (!summary) return;
    summary.querySelectorAll('.disclosure-open').forEach(label => { label.hidden = details.open; });
    summary.querySelectorAll('.disclosure-close').forEach(label => { label.hidden = !details.open; });
    // Native summary already exposes its expanded state to assistive technology.
    // If a programmatic close hides the focused control, return to that summary.
    if (!details.open && details.contains(document.activeElement)) summary.focus({ preventScroll: true });
  }

  readingDetails.forEach(details => {
    syncDisclosure(details);
    details.addEventListener('toggle', () => syncDisclosure(details));
  });

  function closeMenus(restoreFocus = false) {
    menus.forEach(menu => {
      if (!menu.open) return;
      const hadFocus = menu.contains(document.activeElement);
      menu.open = false;
      if (restoreFocus && hadFocus) summaryOf(menu)?.focus({ preventScroll: true });
    });
  }

  function revealAncestors(target) {
    let details = target?.closest('details.analysis-disclosure, details.profile-disclosure');
    while (details) {
      details.open = true;
      syncDisclosure(details);
      details = details.parentElement?.closest('details.analysis-disclosure, details.profile-disclosure');
    }
  }

  function revealDestination() {
    if (!location.hash) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); }
    catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    revealAncestors(target);
    // Legacy synthesis links name the article or its heading, rather than an
    // element inside the newly disclosed body. Open only the related item.
    const item = target.closest('[data-analysis-item], .question-synthesis, .synthesis-theme, .event-theme, .lecturer-profile');
    const analysis = item?.querySelector(':scope > details.analysis-disclosure, :scope > details.profile-disclosure');
    if (analysis) { analysis.open = true; syncDisclosure(analysis); }
    // A source-note hash can target a dialog outside the article. Expose its
    // originating analysis too, so the source retains its reading context.
    const dialog = target.closest('dialog');
    if (dialog) {
      document.querySelectorAll('[data-detail]').forEach(trigger => {
        if (trigger.dataset.detail === dialog.id) revealAncestors(trigger);
      });
    }
  }

  // content-2025.js already owns navigation and quiz confirmation. It pushes
  // history only after an exit is approved, then queues destination scrolling.
  // Reveal that actual destination before its existing scroll/focus runs; do
  // not intercept links, create history entries or approve a proposed exit.
  const pushState = history.pushState;
  history.pushState = function (...args) {
    const result = pushState.apply(this, args);
    revealDestination();
    closeMenus();
    return result;
  };

  // Loaded before content-2025.js: reveal an accepted history destination before
  // its navigation listener runs. Mirroring final quiz state lets rejected Back
  // attempts keep both the existing guard and collapsed reading state intact.
  window.addEventListener('popstate', () => {
    if (activeAttempt || dialogOpen()) return;
    revealDestination();
    closeMenus();
  });
  window.addEventListener('hashchange', () => {
    if (!activeAttempt && !dialogOpen()) revealDestination();
  });
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('#quiz-choices [data-answer]')) {
      activeAttempt = !!quizStatus && !quizStatus.textContent.startsWith('Quiz complete');
    }
    if (event.target.closest('#quiz-next') && quizStatus?.textContent.startsWith('Quiz complete')) activeAttempt = false;
    // An unapproved restart is stopped by content-2025.js in capture phase.
    // Only completed or explicitly approved restarts reach this listener.
    if (event.target.closest('#quiz-restart')) activeAttempt = false;
  });

  // The source dialog remains secondary to the inline narrative. Programmatic
  // activation of an existing detail trigger must not leave its context hidden.
  document.addEventListener('click', event => {
    if (event.target instanceof Element) revealAncestors(event.target.closest('[data-detail]'));
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented || dialogOpen()) return;
    if (!menus.some(menu => menu.open)) return;
    event.preventDefault();
    closeMenus(true);
  });
  document.addEventListener('pointerdown', event => {
    outsideFocus = null;
    if (!(event.target instanceof Element) || dialogOpen()) return;
    menus.forEach(menu => {
      if (!menu.open || menu.contains(event.target)) return;
      const hadFocus = menu.contains(document.activeElement);
      menu.open = false;
      // Clicking another control will give that control focus naturally.
      // A non-interactive outside click must not leave focus in hidden content.
      if (hadFocus && !event.target.closest('a,button,input,select,textarea,summary,[tabindex]')) {
        outsideFocus = { menu, summary: summaryOf(menu) };
      }
    });
  });
  document.addEventListener('pointerup', () => {
    const restore = outsideFocus;
    outsideFocus = null;
    if (!restore) return;
    // Pointerdown's native focus action has now completed. Only restore a
    // formerly hidden menu focus when the click did not focus another control.
    queueMicrotask(() => {
      const focus = document.activeElement;
      if (focus === document.body || focus === document.documentElement || restore.menu.contains(focus)) {
        restore.summary?.focus({ preventScroll: true });
      }
    });
  });
  document.addEventListener('pointercancel', () => { outsideFocus = null; });
  document.addEventListener('focusin', event => {
    if (dialogOpen()) return; // Stay/Escape must restore to the visible origin link.
    menus.forEach(menu => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
  });

  // Initial deep links must be visible before the existing load-time navigation.
  revealDestination();
})();
