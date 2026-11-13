/* ---------------------------------------------------------------------------
 * P6 — shared helpers, navigation, page chrome
 * Load order:  data.js → availability.js → site.js → motion.js → plan.js → (map.js | building.js | list.js | detail.js)
 * ------------------------------------------------------------------------ */

const STATUS_LABEL = {
  dostupny: 'Voľný',
  rezervovany: 'Rezervovaný',
  predany: 'Predaný',
  pripravujeme: 'Pripravujeme',
};

/* What a flat's state is allowed to say, and how it is coloured. Status comes
   live from the CRM (availability.js). While nothing is released (SHOW_STATUS
   false) every flat reads the same neutral line, so nothing betrays which ones
   go first; afterwards a flat the CRM has not released stays "Pripravujeme". */
const statusText = st => (SHOW_STATUS ? (STATUS_LABEL[st] || STATUS_LABEL.pripravujeme) : STATUS_LABEL.pripravujeme);
const statusKind = st => (SHOW_STATUS && st !== 'pripravujeme' && STATUS_LABEL[st] ? st : 'tbd');
const soldOut = st => SHOW_STATUS && st === 'predany';

/* Anything that draws flats starts here instead of on DOMContentLoaded, so it
   never paints a status the CRM has not confirmed. The promise always resolves
   (2.5 s cap); without availability.js the site simply stays neutral. */
function whenAvailabilityKnown(fn) {
  const known = typeof P6_AVAILABILITY !== 'undefined' ? P6_AVAILABILITY : Promise.resolve();
  const run = () => known.then(fn);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
}

const nfArea = new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nfPrice = new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 0 });

const fmtArea = v => nfArea.format(v);
/* one decimal, Slovak comma — room areas come off the plans as e.g. 35,0 m² */
const nfArea1 = new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtArea1 = v => nfArea1.format(v);

function fmtPrice(price, status) {
  if (status === 'predany') return 'Predané';
  if (!SHOW_PRICES || price == null) return 'Na vyžiadanie';
  return nfPrice.format(price) + ' €';
}

/* A flat in the running campaign (availability.js): its price is the campaign price, under its own label.
   The PDF template loads no availability.js, so the campaign may not exist at all there. */
const campaignNow = () => (typeof P6_CAMPAIGN !== 'undefined' ? P6_CAMPAIGN : null);
const isCampaign = a => !!(a && a.campaign && campaignNow() && a.status !== 'predany');
const campaignPill = a => (isCampaign(a) ? '<span class="pill pill--akcia">Zvýhodnená cena</span>' : '');
const priceLabel = a => (isCampaign(a) ? 'Zvýhodnená cena vrátane DPH' : 'Cena vrátane DPH');
/** The campaign's last day, "23. 11. 2026" (it ends at midnight Bratislava time). */
function campaignLastDay() {
  const c = campaignNow();
  if (!c || !c.until) return '';
  const last = new Date(new Date(c.until).getTime() - 1);
  return new Intl.DateTimeFormat('sk-SK', { timeZone: 'Europe/Bratislava', day: 'numeric', month: 'numeric', year: 'numeric' }).format(last);
}

/** Slovak 1 / 2-4 / 5+ plural. */
function plural(n, one, few, many) {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}

const roomsLabel = n => n >= 5 ? 'Penthouse' : `${n}-izbový`;

const icon = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6 6 6-6"/></svg>',
};

/* --- navigation ---------------------------------------------------------- */

function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  const overHero = nav.dataset.nav === 'over';
  const sentinel = document.querySelector('[data-nav-sentinel]');

  const setState = solid => {
    nav.classList.toggle('nav--solid', solid);
    nav.classList.toggle('nav--over', overHero && !solid);
  };
  setState(!overHero);

  if (overHero && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => setState(!e.isIntersecting), { threshold: 0 }).observe(sentinel);
  } else if (overHero) {
    const onScroll = () => setState(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* mobile drawer */
  const drawer = document.querySelector('[data-drawer]');
  const openBtn = nav.querySelector('[data-drawer-open]');
  const closeBtn = drawer && drawer.querySelector('[data-drawer-close]');
  if (!drawer || !openBtn) return;

  const toggle = open => {
    drawer.dataset.open = String(open);
    drawer.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.dataset.locked = String(open);
    if (open) (drawer.querySelector('a, button') || drawer).focus();
    else openBtn.focus();
  };
  openBtn.addEventListener('click', () => toggle(true));
  closeBtn && closeBtn.addEventListener('click', () => toggle(false));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.dataset.open === 'true') toggle(false);
  });
}

/* --- contact form: assets/js/forms.js (loaded on the contact page only) -------------------- */

/* --- footer year --------------------------------------------------------- */

function initChrome() {
  /* Staged sale: no availability legend, no availability filter, no count of
     what is free (see SHOW_STATUS in data.js). */
  if (!SHOW_STATUS) {
    document.querySelectorAll('[data-status-legend], [data-status-filter]').forEach(el => el.remove());
  }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const free = SHOW_COUNTS ? APARTMENTS.filter(a => a.status === 'dostupny').length : 0;
  document.querySelectorAll('[data-count-free]').forEach(el => {
    el.textContent = free;
    el.dataset.countup = free;   // motion.js animates it into view
  });
}

/* A visitor who came through a campaign link (utm_*) keeps it while browsing, so an enquiry sent from any page
   still counts for the campaign in the CRM. Nothing is stored: the parameters ride along on internal links,
   added at the moment such a link is clicked. */
document.addEventListener('click', e => {
  const link = e.target.closest && e.target.closest('a[href]');
  if (!link || link.hasAttribute('download')) return;
  const keep = [...new URLSearchParams(location.search)].filter(([k]) => k.startsWith('utm_') || k === 'lang');
  if (!keep.length) return;
  const url = new URL(link.getAttribute('href'), location.href);
  if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
  keep.forEach(([k, v]) => { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
  link.href = url.toString();
}, true);

/* While a campaign runs, the picker says which flats carry its price and until when. */
function initCampaignNote() {
  const head = document.querySelector('.picker-sec__head');
  if (!head || !campaignNow() || document.querySelector('.picker-sec__akcia')) return;
  head.insertAdjacentHTML('afterend', `<p class="picker-sec__akcia"><span class="pill pill--akcia">Zvýhodnená cena</span>
    Byty a apartmány s týmto štítkom majú zvýhodnenú cenu, ale len pre tých, ktorí sa zaregistrujú počas novembrovej ponuky, do ${campaignLastDay()}.
    Na pôdoryse podlažia sú vyznačené medenou farbou.</p>`);
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  if (typeof initForms === 'function') initForms();
});
whenAvailabilityKnown(() => {
  initChrome();
  initCampaignNote();
  if (typeof initList === 'function') initList();
  if (typeof initDetail === 'function') initDetail();
});
