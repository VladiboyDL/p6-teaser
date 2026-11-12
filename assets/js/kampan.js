/* P6 teaser — the November campaign "Kľúče k vlastnej budúcnosti", 17. – 23. 11. 2026 (Bratislava time).
   Shows the campaign band under the hero (with a countdown), switches the hero button, the sticky bar and the line above the form, but only in that
   week; ?kampan=nahlad shows it any time, for checking. After the week nothing of it appears, nobody has to switch
   it off. The CRM decides who is entitled to the campaign price by its own clock (src/lib/campaign.ts in p6-crm);
   here the "Vyber si byt" buttons only make sure a registration from this page carries the campaign, like one
   that came from an ad. Delete this file, its band in index.html and its keys in i18n.js once it is over. */
(function () {
  'use strict';
  var FROM = Date.parse('2026-11-17T00:00:00+01:00'), TO = Date.parse('2026-11-24T00:00:00+01:00');
  var CAMPAIGN = 'p6_17nov_2026';
  var qs = new URLSearchParams(location.search);
  var now = Date.now();
  if (qs.get('kampan') !== 'nahlad' && !(now >= FROM && now < TO)) return;

  var band = document.querySelector('[data-kampan]');
  if (band) band.hidden = false;
  document.documentElement.classList.add('is-kampan');

  /* Countdown to the end of the offer (23. 11. 23:59:59 Bratislava time), ticking every second. */
  var clock = document.querySelector('[data-kampan-clock]');
  if (clock) {
    var cell = {}; ['d', 'h', 'm', 's'].forEach(function (k) { cell[k] = clock.querySelector('[data-cd="' + k + '"]'); });
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    var tick = function () {
      var left = Math.max(0, Math.floor((TO - Date.now()) / 1000));
      cell.d.textContent = String(Math.floor(left / 86400));
      cell.h.textContent = pad(Math.floor(left / 3600) % 24);
      cell.m.textContent = pad(Math.floor(left / 60) % 60);
      cell.s.textContent = pad(left % 60);
      if (left > 0) setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    clock.hidden = false;
  }

  /* A visitor who came from an ad already has the campaign in the address (utm_*), and teaser.js sends it with the
     form. One who found the page on their own gets it when they press "Vyber si byt", so the CRM sees both alike. */
  document.addEventListener('click', function (e) {
    var cta = e.target.closest && e.target.closest('[data-kampan-cta]');
    if (!cta || qs.get('utm_campaign')) return;
    qs.set('utm_source', 'bytyp6.sk'); qs.set('utm_medium', 'banner'); qs.set('utm_campaign', CAMPAIGN);
    history.replaceState(history.state, '', location.pathname + '?' + qs.toString() + location.hash);
    try {   // measured only after consent (consent.js); no personal data
      if (window.gtag) window.gtag('event', 'select_promotion', { promotion_id: CAMPAIGN, creative_slot: cta.closest('[data-sticky]') ? 'sticky' : 'band' });
    } catch (err) { /* measuring must never break the page */ }
  }, true);
})();
