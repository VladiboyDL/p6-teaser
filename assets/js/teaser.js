/* P6 teaser — nav, reveals, sticky CTA, registration form */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* --- nav ----------------------------------------------------------------- */
  var nav = $('[data-nav]');
  var hero = $('[data-hero]');
  function onScroll() {
    if (nav) nav.classList.toggle('is-solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- reveals ----------------------------------------------------------------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    // siblings revealed together get a small stagger
    reveals.forEach(function (el) {
      var sibs = $$(':scope > .reveal', el.parentElement);
      var i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        if (en.target.hasAttribute('data-count-host')) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --- count-up ----------------------------------------------------------------- */
  $$('[data-count]').forEach(function (dd) {
    var host = dd.closest('.reveal');
    if (host) host.setAttribute('data-count-host', '');
  });
  function countUp(host) {
    $$('[data-count]', host).forEach(function (el) {
      var to = parseInt(el.getAttribute('data-count'), 10);
      var t0 = null, dur = 1400;
      function tick(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * e);
        if (p < 1) requestAnimationFrame(tick);
      }
      el.textContent = '0';
      requestAnimationFrame(tick);
    });
  }

  /* --- sticky CTA: on after the hero, off while the form or footer is on screen ---- */
  var sticky = $('[data-sticky]');
  var reg = $('[data-reg]');
  var foot = $('.foot');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var pastHero = false, atForm = false, atFoot = false;
    var stickyBtn = $('a', sticky);
    var sync = function () {
      var on = pastHero && !atForm && !atFoot;
      sticky.classList.toggle('is-on', on);
      sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (stickyBtn) stickyBtn.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; sync(); }, { threshold: 0.35 }).observe(hero);
    if (reg) new IntersectionObserver(function (e) { atForm = e[0].isIntersecting; sync(); }, { threshold: 0.12 }).observe(reg);
    if (foot) new IntersectionObserver(function (e) { atFoot = e[0].isIntersecting; sync(); }, { threshold: 0 }).observe(foot);
  }

  /* --- registration form --------------------------------------------------------------- */
  var form = $('[data-form]');
  if (form) {
    var errBox = $('[data-form-error]', form);
    var done = $('[data-form-done]');
    var label = $('[data-form-label]', form);
    var btn = $('button[type="submit"]', form);
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var t = function (k, v) { return window.P6I18N ? window.P6I18N.t(k, v) : k; };

    var setBad = function (input, msg) {
      var wrap = input.closest('.field, .check');
      if (!wrap) return;
      wrap.classList.toggle('is-bad', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var old = $('.field__err', wrap);
      if (old) old.remove();
      if (msg && wrap.classList.contains('field')) {
        var s = document.createElement('small');
        s.className = 'field__err';
        s.textContent = msg;
        wrap.appendChild(s);
      }
    };

    var validate = function () {
      var firstBad = null;
      var check = function (input, ok, msg) {
        setBad(input, ok ? '' : msg);
        if (!ok && !firstBad) firstBad = input;
      };
      check(form.meno, form.meno.value.trim().length > 1, t('err.first'));
      check(form.priezvisko, form.priezvisko.value.trim().length > 1, t('err.last'));
      check(form.email, EMAIL.test(form.email.value.trim()), t('err.email'));
      var tel = form.telefon.value.trim();
      check(form.telefon, !tel || tel.replace(/[^\d]/g, '').length >= 9, t('err.phone'));
      check(form.suhlas_kontakt, form.suhlas_kontakt.checked, 'x');
      if (!form.suhlas_kontakt.checked) {
        showError(t('err.consent'));
      }
      return firstBad;
    };

    var showError = function (msg) { errBox.textContent = msg; errBox.hidden = false; };
    var hideError = function () { errBox.hidden = true; };

    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.is-bad');
      if (wrap) setBad(e.target, '');
      hideError();
    });

    var finish = function (viaMail) {
      $('[data-done-title]', done).textContent = t(viaMail ? 'done.mail.title' : 'done.title');
      $('[data-done-text]', done).textContent = t(viaMail ? 'done.mail.text' : 'done.text');
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    };

    /* What the sales inbox receives. Keys are readable labels in a fixed order, values stay Slovak whatever
       language the visitor used, and the consent moment is recorded with the message.
       Keys are plain ASCII on purpose: Web3Forms decodes multipart field NAMES as Latin-1 and turned
       "Správa" into "SprÃ¡va" (values are decoded correctly). */
    var collect = function () {
      var raw = new FormData(form);
      var name = (form.meno.value.trim() + ' ' + form.priezvisko.value.trim()).trim();
      var LANGS = { sk: 'slovenčina', en: 'angličtina', de: 'nemčina', uk: 'ukrajinčina' };
      var data = new FormData();
      var put = function (k, v) { if (v !== null && v !== undefined && String(v).trim() !== '') data.append(k, String(v).trim()); };

      put('subject', 'P6: nový záujemca – ' + name);
      put('from_name', 'P6 web · registrácia záujemcu');
      put('replyto', form.email.value);
      put('Meno', form.meno.value);
      put('Priezvisko', form.priezvisko.value);
      put('email', form.email.value);                 // lower-case on purpose: form services read it as the reply address
      put('Telefon', form.telefon.value);
      put('Typ bytu', raw.getAll('typ_bytu').join(', '));
      put('Byt na', raw.get('ucel'));
      put('Zdroj', form.zdroj.value);
      put('Odkaz', form.sprava.value);
      put('GDPR kontakt', form.suhlas_kontakt.checked ? 'áno' : 'nie');
      put('GDPR newsletter', form.suhlas_newsletter.checked ? 'áno' : 'nie');
      put('Kedy', new Date().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' }) + ' (Bratislava)');
      var lang = document.documentElement.lang || 'sk';
      put('Jazyk', LANGS[lang] || lang);
      put('URL', location.href.split('#')[0]);
      // campaign attribution, when the visitor arrived from an ad
      var qs = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { put(k, qs.get(k)); });
      return data;
    };

    /* --- bots -------------------------------------------------------------------------------
       The form has no action attribute, so bots that just parse the HTML and POST have nowhere to send.
       Against bots that drive a real browser: a hidden field people never see, a minimum time on the
       page, proof of a real key press or tap, a per-browser hourly limit and no links in the message.
       A blocked attempt gets a polite error with the e-mail address, never a fake "thank you", so a
       real person caught by mistake is not lost. Optional hCaptcha is switched on in config.js. */
    var cfg = window.P6_CONFIG || {};
    var mail = form.getAttribute('data-mailto');
    var born = Date.now(), human = false;
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
      form.addEventListener(ev, function (e) { if (e.isTrusted) human = true; }, { capture: true, passive: true });
    });
    var MIN_MS = 4000, MAX_PER_HOUR = 3, SENT_KEY = 'p6_sent';
    var recentSends = function () {
      try { return JSON.parse(localStorage.getItem(SENT_KEY) || '[]').filter(function (t0) { return Date.now() - t0 < 3600000; }); }
      catch (e) { return []; }
    };
    var noteSend = function () {
      try { localStorage.setItem(SENT_KEY, JSON.stringify(recentSends().concat(Date.now()))); } catch (e) { /* storage blocked */ }
    };
    var looksLikeSpam = function () {
      var text = [form.meno.value, form.priezvisko.value, form.sprava.value].join(' ');
      return /<\s*a\b|\[url|https?:\/\/|www\./i.test(text);
    };

    // optional hCaptcha (Web3Forms verifies it server-side once it is enabled in their dashboard)
    var captcha = { on: !!cfg.formCaptcha, id: null, loading: false };
    var captchaBox = $('[data-captcha]', form);
    var loadCaptcha = function () {
      if (!captcha.on || captcha.loading || !captchaBox) return;
      captcha.loading = true;
      captchaBox.hidden = false;
      window.p6CaptchaReady = function () {
        captcha.id = window.hcaptcha.render(captchaBox, { sitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2', theme: 'dark' });
      };
      var s = document.createElement('script');
      s.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=p6CaptchaReady&hl=' + (document.documentElement.lang || 'sk');
      s.async = true;
      document.head.appendChild(s);
    };
    if (captcha.on) form.addEventListener('focusin', loadCaptcha, { once: true });

    /* Confirmation e-mail to the visitor ("O krok bližšie k novému bývaniu"), sent by the n8n workflow behind
       cfg.confirmWebhook. Fire and forget: the lead itself has already been delivered, so a failure here must
       never show an error. A plain form POST in no-cors mode needs no preflight and no CORS set-up on n8n. */
    var sendConfirmation = function () {
      if (!cfg.confirmWebhook || !window.fetch) return;
      try {
        var fd = new FormData();
        fd.append('token', 'p6-web-2026');
        fd.append('email', form.email.value.trim());
        fd.append('name', form.meno.value.trim());
        fd.append('lang', document.documentElement.lang || 'sk');
        fetch(cfg.confirmWebhook, { method: 'POST', body: fd, mode: 'no-cors', keepalive: true }).catch(function () {});
      } catch (err) { /* never block the thank-you screen */ }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError();
      var bad = validate();
      if (bad) { bad.focus(); return; }

      if (form.p6_kontrola.value || !human || Date.now() - born < MIN_MS) { showError(t('err.wait')); return; }
      if (looksLikeSpam()) { showError(t('err.links')); return; }
      if (recentSends().length >= MAX_PER_HOUR) { showError(t('err.limit', { email: mail })); return; }
      var token = '';
      if (captcha.on) {
        token = (window.hcaptcha && captcha.id !== null) ? window.hcaptcha.getResponse(captcha.id) : '';
        if (!token) { loadCaptcha(); showError(t('err.captcha')); return; }
      }

      var endpoint = form.getAttribute('data-endpoint');
      var key = form.getAttribute('data-access-key');
      var data = collect();

      if (!endpoint) {
        // no backend configured yet: hand the message to the visitor's mail client
        var lines = [];
        data.forEach(function (v, k) { if (['subject', 'from_name', 'replyto'].indexOf(k) < 0) lines.push(k + ': ' + v); });
        location.href = 'mailto:' + form.getAttribute('data-mailto') +
          '?subject=' + encodeURIComponent(data.get('subject')) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        finish(true);
        return;
      }

      if (key) data.set('access_key', key);
      if (token) data.set('h-captcha-response', token);
      btn.disabled = true;
      label.textContent = t('sending');
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json().catch(function () { return {}; });
        })
        .then(function (json) {
          if (json && json.success === false) throw new Error(json.message || 'rejected');
          noteSend();
          sendConfirmation();
          finish();
        })
        .catch(function () {
          btn.disabled = false;
          if (captcha.on && window.hcaptcha && captcha.id !== null) window.hcaptcha.reset(captcha.id);
          label.innerHTML = label.__sk !== undefined && document.documentElement.lang === 'sk' ? label.__sk : t('cta.interest');
          showError(t('err.send', { email: form.getAttribute('data-mailto') }));
        });
    });
  }

  /* --- map: a narrower crop on phones keeps the labels legible ------------------------------ */
  var mapSvg = $('[data-map] svg');
  if (mapSvg) {
    var narrow = window.matchMedia('(max-width: 640px)');
    var setVB = function () { mapSvg.setAttribute('viewBox', mapSvg.getAttribute(narrow.matches ? 'data-vb-narrow' : 'data-vb-wide')); };
    setVB();
    if (narrow.addEventListener) narrow.addEventListener('change', setVB);
    else if (narrow.addListener) narrow.addListener(setVB);
  }

  /* --- misc ------------------------------------------------------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
