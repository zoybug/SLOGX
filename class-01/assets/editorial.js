/* Shared presentation/accessibility housekeeping; no teaching data lives here. */
(() => {
  const skip = document.querySelector('.skip');
  skip?.addEventListener('click', () => {
    const target = document.querySelector(skip.getAttribute('href'));
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  });
  // Match the archive's optional quiz instructions: preserve the complete
  // introduction while letting a returning reader go straight to the question.
  const quizSide = document.querySelector('.quiz-side');
  if (quizSide) {
    const board = quizSide.closest('.quiz-board');
    const help = document.createElement('details');
    help.className = 'quiz-help';
    const summary = document.createElement('summary');
    summary.textContent = 'How the quiz works';
    help.append(summary);
    board.before(help);
    const restart = quizSide.querySelector('#quiz-restart');
    if (restart) board.querySelector('.quiz-main').append(restart);
    help.append(quizSide);
  }
  const header = document.querySelector('.unified-header');
  if (header) {
    const update = () => document.body.style.setProperty('--briefing-header-height', `${header.getBoundingClientRect().height}px`);
    new ResizeObserver(update).observe(header);
    update();
  }

  // Generated explorer buttons are replaced by the teaching scripts. Restore
  // keyboard focus to the selected replacement instead of a detached node.
  if (!document.body.dataset.courseYear) {
    document.querySelectorAll('#stage-grid, #case-selector, #system-tabs').forEach(container => {
      container.addEventListener('click', event => {
        if (event.target.closest('button')) container.querySelector('button[aria-pressed="true"], button.active')?.focus({ preventScroll: true });
      });
    });
  }

  // Keep the functional fact companion away from visible controls in 2026,
  // matching the archive's existing collision avoidance. Never intercept clicks.
  if (document.body.dataset.courseYear === '2025') return;
  const widget = document.querySelector('.zoybug-widget');
  if (!widget) return;
  let frame = 0;
  function place() {
    frame = 0;
    const trigger = widget.querySelector('.zoybug-trigger');
    if (trigger.getAttribute('aria-expanded') === 'true') { widget.style.bottom = '16px'; return; }
    const box = trigger.getBoundingClientRect();
    const headerBottom = header?.getBoundingClientRect().bottom || 0;
    const controls = [...document.querySelectorAll('a, button, input, select, summary')]
      .filter(control => !widget.contains(control))
      .map(control => control.getBoundingClientRect())
      .filter(rect => rect.width && rect.height && rect.bottom > headerBottom && rect.top < innerHeight);
    for (let bottom = 16; bottom < innerHeight - headerBottom - box.height; bottom += box.height + 16) {
      const top = innerHeight - bottom - box.height;
      const overlaps = controls.some(rect => rect.left < box.right + 8 && rect.right > box.left - 8 && rect.top < top + box.height + 8 && rect.bottom > top - 8);
      if (!overlaps) { widget.style.bottom = `${bottom}px`; return; }
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(place); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('click', schedule);
  document.addEventListener('keydown', schedule);
  schedule();
})();
