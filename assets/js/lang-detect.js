/* P6 teaser — language decision. Runs in <head>, before first paint.

   Order of precedence:
     1. ?lang=sk|en|de|uk in the URL (shareable, also what hreflang points to; ?lang=ua works too)
     2. the visitor's own earlier choice from the SK / EN / DE / UA switcher
     3. a browser set to Ukrainian -> uk, wherever the visitor is (the Ukrainian community in Bratislava)
     4. location: Slovakia -> sk, German-speaking country -> de, Ukraine -> uk, anywhere else -> en

   Location is read from the device's time zone, so nothing leaves the browser and
   no third party sees an IP address before the visitor has consented to anything.
   A visitor whose browser is set to Slovak (or Czech) gets Slovak even abroad.
   If P6_CONFIG.geoEndpoint is set, i18n.js refines the guess with the IP country. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var SUPPORTED = ['sk', 'en', 'de', 'uk'];
  var ALIAS = { ua: 'uk' };            // people type ?lang=ua; the language code is uk
  var cfg = window.P6_CONFIG || {};

  // IANA zones. Europe/Prague is here because older browsers canonicalise
  // Europe/Bratislava to it, and Czech visitors read Slovak without effort.
  var TZ_SK = ['Europe/Bratislava', 'Europe/Prague'];
  var TZ_DE = ['Europe/Berlin', 'Europe/Busingen', 'Europe/Vienna', 'Europe/Zurich', 'Europe/Vaduz'];
  var TZ_UK = ['Europe/Kyiv', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye'];
  var COUNTRY_DE = ['DE', 'AT', 'CH', 'LI'];

  function fromCountry(cc) {
    cc = String(cc || '').toUpperCase();
    if (cc === 'SK') return 'sk';
    if (COUNTRY_DE.indexOf(cc) > -1) return 'de';
    if (cc === 'UA') return 'uk';
    return cc ? 'en' : null;
  }

  // the first of the visitor's browser languages that is Slovak/Czech or Ukrainian, if any
  function heritage() {
    var sk = cfg.slovakBrowserLangs || ['sk', 'cs'];
    var uk = cfg.ukrainianBrowserLangs || ['uk'];
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().split('-')[0];
      if (sk.indexOf(code) > -1) return 'sk';
      if (uk.indexOf(code) > -1) return 'uk';
    }
    return null;
  }
  function browserIsSlovak() { return heritage() === 'sk'; }

  function fromLocation() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* very old browser */ }
    var h = heritage();
    if (h === 'uk') return 'uk';
    if (TZ_SK.indexOf(tz) > -1) return 'sk';
    if (h === 'sk') return 'sk';
    if (TZ_DE.indexOf(tz) > -1) return 'de';
    if (TZ_UK.indexOf(tz) > -1) return 'uk';
    if (!tz) return 'sk';          // nothing to go on: the primary language
    return 'en';
  }

  var lang = null, source = 'location';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    q = q && (ALIAS[q.toLowerCase()] || q.toLowerCase());
    if (q && SUPPORTED.indexOf(q) > -1) { lang = q; source = 'url'; }
  } catch (e) { /* no URLSearchParams */ }
  if (!lang) {
    try {
      var saved = localStorage.getItem('p6_lang');
      if (saved && SUPPORTED.indexOf(saved) > -1) { lang = saved; source = 'choice'; }
    } catch (e) { /* storage blocked */ }
  }
  if (!lang) lang = fromLocation();

  root.lang = lang;
  // index.html ships Slovak text inline; hide it for the blink it takes i18n.js to swap it
  if (lang !== 'sk') {
    root.classList.add('lang-pending');
    setTimeout(function () { root.classList.remove('lang-pending'); }, 1500);
  }

  window.P6_LANG = { current: lang, source: source, supported: SUPPORTED, fromCountry: fromCountry, browserIsSlovak: browserIsSlovak, heritage: heritage };
})();
