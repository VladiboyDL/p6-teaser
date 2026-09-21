/* ---------------------------------------------------------------------------
 * P6 — the contact form: one lead flow for the whole domain (see CLAUDE.md, "Forms")
 *
 *   1. POST to Web3Forms        → e-mail to the sales inbox. Field names are plain ASCII on purpose:
 *                                  Web3Forms decodes multipart field NAMES as Latin-1 ("Správa" → "SprÃ¡va").
 *   2. then POST to n8n webhook → confirmation e-mail to the visitor + the lead in the sales CRM,
 *                                  with the flat attached (`byt`, e.g. "4.C"). Fire and forget: the lead
 *                                  has already been delivered by step 1.
 *
 * The webhook URL comes from the domain's /assets/js/config.js (P6_CONFIG.confirmWebhook). n8n only accepts
 * requests from https://bytyp6.sk, so on localhost or a preview host step 2 is silently dropped by n8n.
 *
 * Against bots: the form has no action attribute, a hidden field people never see, a minimum time on the
 * page, proof of a real key press or tap, an hourly limit per browser and no links in the text. A blocked
 * attempt gets a polite error with the e-mail address, never a fake "thank you".
 * ------------------------------------------------------------------------ */

function initForms() {
  document.querySelectorAll('[data-form]').forEach(form => {
    const cfg = window.P6_CONFIG || {};
    const endpoint = form.dataset.endpoint, key = form.dataset.accessKey, mail = form.dataset.mailto;
    const ok = form.querySelector('[data-form-ok]'), err = form.querySelector('[data-form-error]'), btn = form.querySelector('button[type=submit]');
    const MIN_MS = 4000, MAX_PER_HOUR = 3, SENT_KEY = 'p6_sent', born = Date.now();
    let human = false, busy = false;
    ['pointerdown', 'touchstart', 'keydown'].forEach(ev =>
      form.addEventListener(ev, e => { if (e.isTrusted) human = true; }, { capture: true, passive: true }));

    const recentSends = () => { try { return JSON.parse(localStorage.getItem(SENT_KEY) || '[]').filter(t => Date.now() - t < 3600000); } catch (e) { return []; } };
    const noteSend = () => { try { localStorage.setItem(SENT_KEY, JSON.stringify(recentSends().concat(Date.now()))); } catch (e) { /* storage blocked */ } };
    const fail = text => { err.textContent = text; err.hidden = false; err.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
    const val = name => (form.elements[name] ? String(form.elements[name].value || '').trim() : '');
    const topicLabel = () => { const t = form.elements.topic; return t && t.selectedOptions[0] ? t.selectedOptions[0].textContent.trim() : ''; };
    /* the flat exactly as labelled in data.js ("4.C"); anything else the visitor typed stays in the message only */
    const flatId = () => { const m = val('unit').toUpperCase().replace(/\s+/g, '').match(/^([1-9])[.,]?([A-Z])$/); return m ? `${m[1]}.${m[2]}` : ''; };

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (busy) return;
      err.hidden = true;
      const name = val('name'), email = val('email');
      const bad = !name ? form.elements.name : !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) ? form.elements.email : !form.elements.suhlas_kontakt.checked ? form.elements.suhlas_kontakt : null;
      if (bad) { fail(bad === form.elements.suhlas_kontakt ? 'Bez súhlasu so spracovaním údajov vás nemôžeme kontaktovať.' : 'Vyplňte prosím meno a e-mail v správnom tvare.'); bad.focus(); return; }
      if (val('p6_kontrola') || !human || Date.now() - born < MIN_MS) return fail('Formulár sa odoslal príliš rýchlo. Počkajte pár sekúnd a skúste to znova.');
      if (/<\s*a\b|\[url|https?:\/\/|www\./i.test([name, val('unit'), val('message')].join(' '))) return fail('Správa nesmie obsahovať odkazy. Odstráňte ich prosím a skúste to znova.');
      if (recentSends().length >= MAX_PER_HOUR) return fail(`Z tohto prehliadača ste už poslali viac správ. Napíšte nám prosím na ${mail}.`);
      if (!endpoint || !key) return fail(`Formulár sa nepodarilo odoslať. Napíšte nám prosím na ${mail}.`);

      const parts = name.split(/\s+/), first = parts[0], last = parts.slice(1).join(' ');
      const byt = flatId(), qs = new URLSearchParams(location.search), url = location.href.split('#')[0];
      const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      const put = (fd, k, v) => { if (v !== null && v !== undefined && String(v).trim() !== '') fd.append(k, String(v).trim()); };

      const inbox = new FormData();
      put(inbox, 'access_key', key);
      put(inbox, 'subject', `P6: dopyt z webu – ${name}${byt ? ` (byt ${byt})` : ''}`);
      put(inbox, 'from_name', 'P6 web · kontaktný formulár');
      put(inbox, 'replyto', email);
      put(inbox, 'Meno', first); put(inbox, 'Priezvisko', last); put(inbox, 'email', email); put(inbox, 'Telefon', val('phone'));
      put(inbox, 'Byt', byt || val('unit')); put(inbox, 'Typ bytu', val('rooms')); put(inbox, 'Tema', topicLabel()); put(inbox, 'Odkaz', val('message'));
      put(inbox, 'GDPR kontakt', 'áno'); put(inbox, 'GDPR newsletter', form.elements.suhlas_newsletter.checked ? 'áno' : 'nie');
      put(inbox, 'Kedy', new Date().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' }) + ' (Bratislava)');
      put(inbox, 'Jazyk', 'slovenčina'); put(inbox, 'URL', url);
      utm.forEach(k => put(inbox, k, qs.get(k)));
      put(inbox, 'botcheck', '');

      busy = true; btn.disabled = true;
      fetch(endpoint, { method: 'POST', body: inbox, headers: { Accept: 'application/json' } })
        .then(r => r.json().catch(() => ({})).then(j => { if (!r.ok || j.success === false) throw new Error(j.message || 'send failed'); }))
        .then(() => {
          noteSend();
          if (cfg.confirmWebhook) {
            const lead = new FormData();
            put(lead, 'token', 'p6-web-2026'); put(lead, 'email', email); put(lead, 'name', first); put(lead, 'priezvisko', last); put(lead, 'telefon', val('phone'));
            put(lead, 'typ_bytu', val('rooms')); put(lead, 'zdroj', `Web: ${topicLabel()}`.slice(0, 80)); put(lead, 'sprava', val('message')); put(lead, 'byt', byt);
            put(lead, 'suhlas_kontakt', 'ano'); put(lead, 'suhlas_newsletter', form.elements.suhlas_newsletter.checked ? 'ano' : 'nie');
            put(lead, 'lang', 'sk'); put(lead, 'url', url);
            utm.forEach(k => put(lead, k, qs.get(k)));
            fetch(cfg.confirmWebhook, { method: 'POST', body: lead, mode: 'no-cors', keepalive: true }).catch(() => {});
          }
          try {   // conversions reach Google or Meta only after the visitor's consent (consent.js); no personal data
            const tr = cfg.tracking || {};
            if (window.gtag) { window.gtag('event', 'generate_lead', { form_name: 'kontakt', flat: byt }); if (tr.googleAds && tr.googleAdsLeadLabel) window.gtag('event', 'conversion', { send_to: `${tr.googleAds}/${tr.googleAdsLeadLabel}` }); }
            if (window.fbq) window.fbq('track', 'Lead', { content_name: 'kontakt' });
          } catch (e2) { /* measuring must never break the form */ }
          form.querySelectorAll('input, textarea, select, button').forEach(el => { el.disabled = true; });
          if (ok) { ok.dataset.show = 'true'; ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
        })
        .catch(() => { busy = false; btn.disabled = false; fail(`Správu sa nepodarilo odoslať. Skúste to prosím znova alebo nám napíšte na ${mail}.`); });
    });
  });
}
