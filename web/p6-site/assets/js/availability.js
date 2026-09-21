/* ---------------------------------------------------------------------------
 * P6 — live availability from the sales CRM
 * Load order:  data.js → availability.js → site.js → …
 *
 * The CRM is the only place where a flat's status and price are set. Its public
 * feed (LIVE_STATUS_URL in data.js) lists ONLY the flats that are on offer:
 *
 *   { "units": [ { "id": "2.A", "status": "available" | "reserved" | "sold", "price": 189900 | null } ] }
 *
 *   in the feed      → Voľný / Rezervovaný / Predaný, with its price when the CRM publishes one
 *   not in the feed  → "Pripravujeme", no price
 *   feed empty, slow or unreachable → the site stays exactly as it is while the sale is unannounced:
 *                      every flat reads "Pripravujeme", no legend, no availability filter (SHOW_STATUS false)
 *
 * So the site switches itself on the moment the administrator releases the first flat in the CRM,
 * and nobody edits data.js to change a status. Counters ("3 voľné") stay hidden while some flats are
 * still "Pripravujeme": the sale runs in stages and the site does not announce how many go first.
 *
 * Everything that draws flats waits for P6_AVAILABILITY (see whenAvailabilityKnown in site.js).
 * The PDF template does not load this file, so the apartment PDFs always stay neutral.
 * ------------------------------------------------------------------------ */

const P6_AVAILABILITY = (function () {
  const FROM_CRM = { available: 'dostupny', reserved: 'rezervovany', sold: 'predany' };
  const TIMEOUT_MS = 2500;

  function apply(units) {
    const onOffer = new Map(units.filter(u => u && FROM_CRM[u.status]).map(u => [u.id, u]));
    if (!onOffer.size) return;                                   // nothing released yet: stay neutral
    APARTMENTS.forEach(a => {
      const u = onOffer.get(a.id);
      a.status = u ? FROM_CRM[u.status] : 'pripravujeme';
      a.price = u && typeof u.price === 'number' && u.price > 0 ? u.price : null;
    });
    SHOW_STATUS = true;
    SHOW_COUNTS = APARTMENTS.every(a => a.status !== 'pripravujeme');
  }

  if (!LIVE_STATUS_URL || !window.fetch) return Promise.resolve();
  const ctrl = 'AbortController' in window ? new AbortController() : null;
  const timer = setTimeout(() => ctrl && ctrl.abort(), TIMEOUT_MS);
  return fetch(LIVE_STATUS_URL, { signal: ctrl ? ctrl.signal : undefined, credentials: 'omit' })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error('feed ' + r.status))))
    .then(feed => apply(Array.isArray(feed.units) ? feed.units : []))
    .catch(() => { /* unreachable CRM: better neutral than stale or invented availability */ })
    .then(() => clearTimeout(timer));
})();
