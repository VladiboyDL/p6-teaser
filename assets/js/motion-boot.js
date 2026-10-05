/* P6 teaser, motion boot. Runs in <head> before the first paint and switches the motion layer on
   (html.motion), unless the visitor asked for reduced motion. The intro plays on every fresh visit (typed URL,
   link from elsewhere, reload) and is skipped when coming back from another page of the site, on Back/Forward,
   and when the URL points at a #section. If motion.js does not start within 4 s, the page falls back to the plain teaser. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('js')) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('motion');
  var nav = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  var fromSite = false;
  try { fromSite = !!document.referrer && new URL(document.referrer).host === location.host; } catch (e) { /* no referrer */ }
  var skip = !!location.hash || (nav && nav.type === 'back_forward') || (fromSite && !(nav && nav.type === 'reload'));
  if (/[?&]intro\b/.test(location.search)) skip = false;
  if (!skip) root.classList.add('intro');
  setTimeout(function () { if (!window.P6Motion) root.classList.remove('motion', 'intro'); }, 4000);
})();
