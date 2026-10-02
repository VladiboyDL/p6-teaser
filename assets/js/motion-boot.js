/* P6 teaser, motion boot. Runs in <head> before the first paint and switches the motion layer on
   (html.motion), unless the visitor asked for reduced motion. The intro plays once per browser session.
   If motion.js does not start within 4 s, the page falls back to the plain teaser. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('js')) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('motion');
  var seen = false;
  try { seen = sessionStorage.getItem('p6-intro') === '1'; } catch (e) { /* storage blocked: play it */ }
  if (/[?&]intro\b/.test(location.search)) seen = false;
  if (!seen && !location.hash) root.classList.add('intro');
  setTimeout(function () { if (!window.P6Motion) root.classList.remove('motion', 'intro'); }, 4000);
})();
