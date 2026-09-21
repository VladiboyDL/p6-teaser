/* P6 — cookie consent for the whole domain (the teaser in the root and the official site beside it).
   Self-sufficient on purpose: its own texts in four languages and its own stylesheet (/assets/css/consent.css),
   so a page only needs /assets/js/config.js and this file.
   Nothing that needs consent (§ 109 ods. 8 zákona č. 452/2021 Z. z., čl. 6 ods. 1 písm. a) GDPR)
   is loaded until the visitor opts in: Google Analytics / Google Ads / Meta Pixel are injected
   from here, never from the HTML. "Reject" sits on the first layer next to "Accept", nothing is
   pre-ticked, and the choice can be reopened from the footer at any time. */
(function () {
  'use strict';

  var cfg = window.P6_CONFIG || {};
  var TEXT = {
    sk: {
      'ck.title': 'Súbory cookies',
      'ck.text': 'Nevyhnutné cookies zabezpečujú fungovanie stránky. S vaším súhlasom použijeme aj analytické a marketingové cookies, aby sme stránku zlepšovali a merali reklamu. Súhlas môžete kedykoľvek zmeniť.',
      'ck.more': 'Zásady používania cookies',
      'ck.accept': 'Prijať všetky',
      'ck.reject': 'Odmietnuť',
      'ck.settings': 'Nastavenia',
      'ck.save': 'Uložiť výber',
      'ck.set.title': 'Nastavenia cookies',
      'ck.always': 'vždy aktívne',
      'ck.nec': 'Nevyhnutné',
      'ck.nec.d': 'Zapamätanie vášho výberu cookies a jazyka. Bez nich stránka nefunguje správne, preto sa nedajú vypnúť.',
      'ck.ana': 'Analytické',
      'ck.ana.d': 'Anonymizované štatistiky návštevnosti, ktoré nám pomáhajú stránku zlepšovať (Google Analytics).',
      'ck.mkt': 'Marketingové',
      'ck.mkt.d': 'Meranie účinnosti reklamy a jej zobrazovanie na iných stránkach (Google Ads, Meta).',
      'ck.close': 'Zavrieť'
    },
    en: {
      'ck.title': 'Cookies',
      'ck.text': 'Necessary cookies keep the site working. With your consent we also use analytics and marketing cookies to improve the site and measure advertising. You can change your choice at any time.',
      'ck.more': 'Cookie Policy',
      'ck.accept': 'Accept all',
      'ck.reject': 'Reject',
      'ck.settings': 'Settings',
      'ck.save': 'Save selection',
      'ck.set.title': 'Cookie settings',
      'ck.always': 'always active',
      'ck.nec': 'Necessary',
      'ck.nec.d': 'Remember your cookie choice and language. The site does not work properly without them, so they cannot be switched off.',
      'ck.ana': 'Analytics',
      'ck.ana.d': 'Anonymised visit statistics that help us improve the site (Google Analytics).',
      'ck.mkt': 'Marketing',
      'ck.mkt.d': 'Measuring how well our advertising works and showing it on other sites (Google Ads, Meta).',
      'ck.close': 'Close'
    },
    de: {
      'ck.title': 'Cookies',
      'ck.text': 'Notwendige Cookies sichern die Funktion der Website. Mit Ihrer Einwilligung verwenden wir auch Analyse- und Marketing-Cookies, um die Website zu verbessern und Werbung zu messen. Sie können Ihre Auswahl jederzeit ändern.',
      'ck.more': 'Cookie-Richtlinie',
      'ck.accept': 'Alle akzeptieren',
      'ck.reject': 'Ablehnen',
      'ck.settings': 'Einstellungen',
      'ck.save': 'Auswahl speichern',
      'ck.set.title': 'Cookie-Einstellungen',
      'ck.always': 'immer aktiv',
      'ck.nec': 'Notwendig',
      'ck.nec.d': 'Speichern Ihre Cookie-Auswahl und die Sprache. Ohne sie funktioniert die Website nicht richtig, daher lassen sie sich nicht abschalten.',
      'ck.ana': 'Analyse',
      'ck.ana.d': 'Anonymisierte Besuchsstatistiken, die uns helfen, die Website zu verbessern (Google Analytics).',
      'ck.mkt': 'Marketing',
      'ck.mkt.d': 'Messung der Wirksamkeit unserer Werbung und deren Anzeige auf anderen Websites (Google Ads, Meta).',
      'ck.close': 'Schließen'
    },
    uk: {
      'ck.title': 'Файли cookie',
      'ck.text': 'Необхідні файли cookie забезпечують роботу сайту. За вашою згодою ми також використовуємо аналітичні та маркетингові cookie, щоб покращувати сайт і вимірювати рекламу. Свій вибір ви можете будь-коли змінити.',
      'ck.more': 'Політика щодо файлів cookie',
      'ck.accept': 'Прийняти всі',
      'ck.reject': 'Відхилити',
      'ck.settings': 'Налаштування',
      'ck.save': 'Зберегти вибір',
      'ck.set.title': 'Налаштування cookie',
      'ck.always': 'завжди активні',
      'ck.nec': 'Необхідні',
      'ck.nec.d': 'Запам’ятовують ваш вибір щодо cookie та мову. Без них сайт не працює належним чином, тому їх не можна вимкнути.',
      'ck.ana': 'Аналітичні',
      'ck.ana.d': 'Анонімізована статистика відвідувань, яка допомагає нам покращувати сайт (Google Analytics).',
      'ck.mkt': 'Маркетингові',
      'ck.mkt.d': 'Вимірювання ефективності реклами та її показ на інших сайтах (Google Ads, Meta).',
      'ck.close': 'Закрити'
    }
  };
  var tr = cfg.tracking || {};
  var KEY = 'p6_consent';
  var VERSION = 1;                       // bump when categories or vendors change: everyone is asked again
  var MAX_AGE = 365 * 24 * 3600 * 1000;  // ask again after 12 months
  var lang = function () { var l = (document.documentElement.lang || 'sk').slice(0, 2).toLowerCase(); return TEXT[l] ? l : 'sk'; };
  var t = function (k) { return TEXT[lang()][k] || TEXT.sk[k] || k; };
  var cookiePage = function () { return '/cookies.html' + (lang() === 'sk' ? '' : '?lang=' + lang()); };

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
        '<p class="ck__text">' + esc(t('ck.text')) + ' <a href="' + cookiePage() + '">' + esc(t('ck.more')) + '</a></p>' +
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
        '<p class="ck__text ck__text--small"><a href="' + cookiePage() + '">' + esc(t('ck.more')) + '</a></p>' +
        '<div class="ck__actions">' +
          '<button type="button" class="ck__btn" data-ck="save">' + esc(t('ck.save')) + '</button>' +
          '<button type="button" class="ck__btn" data-ck="accept">' + esc(t('ck.accept')) + '</button>' +
          '<button type="button" class="ck__btn" data-ck="reject">' + esc(t('ck.reject')) + '</button>' +
        '</div>';
    }
    box.innerHTML = html;
  }

  /* The banner's styles live in one file for both sites; it is fetched only when the banner is about to show. */
  function withStyles(fn) {
    var link = document.getElementById('ck-css');
    if (link) { if (link.sheet) fn(); else link.addEventListener('load', fn, { once: true }); return; }
    link = document.createElement('link');
    link.id = 'ck-css'; link.rel = 'stylesheet'; link.href = '/assets/css/consent.css?v=1';
    var done = false, go = function () { if (!done) { done = true; fn(); } };
    link.addEventListener('load', go); link.addEventListener('error', go);
    setTimeout(go, 1500);                 // never hold the question back because a stylesheet is slow
    document.head.appendChild(link);
  }

  function open(which) { withStyles(function () { show(which); }); }

  function show(which) {
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
