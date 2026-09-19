/* P6 teaser — cookie consent.
   Nothing that needs consent (§ 109 ods. 8 zákona č. 452/2021 Z. z., čl. 6 ods. 1 písm. a) GDPR)
   is loaded until the visitor opts in: Google Analytics / Google Ads / Meta Pixel are injected
   from here, never from the HTML. "Reject" sits on the first layer next to "Accept", nothing is
   pre-ticked, and the choice can be reopened from the footer at any time. */
(function () {
  'use strict';

  var cfg = window.P6_CONFIG || {};
  var tr = cfg.tracking || {};
  var KEY = 'p6_consent';
  var VERSION = 1;                       // bump when categories or vendors change: everyone is asked again
  var MAX_AGE = 365 * 24 * 3600 * 1000;  // ask again after 12 months
  var t = function (k) { return window.P6I18N ? window.P6I18N.t(k) : k; };

  var hasTools = !!(tr.ga4 || tr.googleAds || tr.metaPixel);
  var bannerOn = cfg.cookieBanner === true || (cfg.cookieBanner !== false && hasTools);

  /* --- stored choice ------------------------------------------------------------------ */
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!c || c.v !== VERSION || Date.now() - c.ts > MAX_AGE) return null;
      return c;
    } catch (e) { return null; }
  }
  function write(analytics, marketing) {
    var c = { v: VERSION, ts: Date.now(), analytics: !!analytics, marketing: !!marketing };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* storage blocked: ask again next time */ }
    return c;
  }

  /* --- Google Consent Mode v2: everything denied until told otherwise -------------------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });

  var loaded = { google: false, meta: false };

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }

  function enable(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });

    var wantGoogle = (c.analytics && tr.ga4) || (c.marketing && tr.googleAds);
    if (wantGoogle && !loaded.google) {
      loaded.google = true;
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(tr.ga4 || tr.googleAds));
      gtag('js', new Date());
      if (c.analytics && tr.ga4) gtag('config', tr.ga4);
      if (c.marketing && tr.googleAds) gtag('config', tr.googleAds);
    }

    if (c.marketing && tr.metaPixel && !loaded.meta) {
      loaded.meta = true;
      /* Meta Pixel base code */
      (function (f, b, e, v, n, s, r) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
        s = b.createElement(e); s.async = true; s.src = v; r = b.getElementsByTagName(e)[0]; r.parentNode.insertBefore(s, r);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', tr.metaPixel);
      window.fbq('track', 'PageView');
    }
  }

  function dropCookies() {
    var names = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); })
      .filter(function (n) { return /^(_ga|_gid|_gat|_gcl_|_fbp|_fbc)/.test(n); });
    var host = location.hostname, parts = host.split('.');
    var domains = ['', host, '.' + host];
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    names.forEach(function (n) {
      domains.forEach(function (d) {
        document.cookie = n + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  /* --- UI ----------------------------------------------------------------------------------- */
  var box = null, view = 'banner', lastFocus = null;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function render() {
    if (!box) return;
    var c = read() || { analytics: false, marketing: false };
    var html;
    if (view === 'banner') {
      html =
        '<h2 class="ck__title" id="ck-title">' + esc(t('ck.title')) + '</h2>' +
        '<p class="ck__text">' + esc(t('ck.text')) + ' <a href="cookies.html">' + esc(t('ck.more')) + '</a></p>' +
        '<div class="ck__actions">' +
          '<button type="button" class="ck__btn" data-ck="accept">' + esc(t('ck.accept')) + '</button>' +
          '<button type="button" class="ck__btn" data-ck="reject">' + esc(t('ck.reject')) + '</button>' +
          '<button type="button" class="ck__link" data-ck="settings">' + esc(t('ck.settings')) + '</button>' +
        '</div>';
    } else {
      var row = function (id, title, desc, checked, locked) {
        return '<label class="ck__row"><span class="ck__rowtext"><b>' + esc(title) + '</b><small>' + esc(desc) + '</small></span>' +
          (locked
            ? '<span class="ck__locked">' + esc(t('ck.always')) + '</span>'
            : '<input type="checkbox" class="ck__switch" data-ck-cat="' + id + '"' + (checked ? ' checked' : '') + '>') +
          '</label>';
      };
      html =
        '<div class="ck__head"><h2 class="ck__title" id="ck-title">' + esc(t('ck.set.title')) + '</h2>' +
        '<button type="button" class="ck__x" data-ck="close" aria-label="' + esc(t('ck.close')) + '">×</button></div>' +
        row('necessary', t('ck.nec'), t('ck.nec.d'), true, true) +
        row('analytics', t('ck.ana'), t('ck.ana.d'), c.analytics, false) +
        row('marketing', t('ck.mkt'), t('ck.mkt.d'), c.marketing, false) +
        '<p class="ck__text ck__text--small"><a href="cookies.html">' + esc(t('ck.more')) + '</a></p>' +
        '<div class="ck__actions">' +
          '<button type="button" class="ck__btn" data-ck="save">' + esc(t('ck.save')) + '</button>' +
          '<button type="button" class="ck__btn" data-ck="accept">' + esc(t('ck.accept')) + '</button>' +
          '<button type="button" class="ck__btn" data-ck="reject">' + esc(t('ck.reject')) + '</button>' +
        '</div>';
    }
    box.innerHTML = html;
  }

  function open(which) {
    view = which || 'banner';
    if (!box) {
      box = document.createElement('section');
      box.className = 'ck';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-labelledby', 'ck-title');
      box.setAttribute('aria-modal', 'false');
      box.tabIndex = -1;
      box.addEventListener('click', onClick);
      box.addEventListener('keydown', function (e) { if (e.key === 'Escape' && read()) close(); });
      document.body.appendChild(box);
    }
    render();
    document.body.classList.add('ck-open');
    requestAnimationFrame(function () { box.classList.add('is-on'); });
    if (view === 'settings') { lastFocus = document.activeElement; box.focus({ preventScroll: true }); }
  }

  function close() {
    if (!box) return;
    box.classList.remove('is-on');
    document.body.classList.remove('ck-open');
    var b = box; box = null;
    setTimeout(function () { b.remove(); }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  function decide(analytics, marketing) {
    var before = read();
    var c = write(analytics, marketing);
    var withdrew = before && ((before.analytics && !c.analytics) || (before.marketing && !c.marketing));
    close();
    if (withdrew) { dropCookies(); if (loaded.google || loaded.meta) { location.reload(); return; } }
    enable(c);
    document.dispatchEvent(new CustomEvent('p6:consent', { detail: c }));
  }

  function onClick(e) {
    var b = e.target.closest('[data-ck]');
    if (!b) return;
    var a = b.getAttribute('data-ck');
    if (a === 'accept') decide(true, true);
    else if (a === 'reject') decide(false, false);
    else if (a === 'settings') { view = 'settings'; render(); box.focus({ preventScroll: true }); }
    else if (a === 'close') { if (read()) close(); else { view = 'banner'; render(); } }
    else if (a === 'save') {
      decide(box.querySelector('[data-ck-cat="analytics"]').checked, box.querySelector('[data-ck-cat="marketing"]').checked);
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-cookie-settings]')) { e.preventDefault(); open('settings'); }
  });
  document.addEventListener('p6:lang', render);

  window.P6Consent = { open: open, get: read };

  var current = read();
  if (current) enable(current);
  else if (bannerOn) open('banner');
})();
