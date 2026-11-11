/* P6 teaser — the November campaign "Kľúče k vlastnej budúcnosti", 17. – 23. 11. 2026 (Bratislava time).
   Shows the campaign band under the hero, switches the sticky bar and the line above the form, but only in that
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
