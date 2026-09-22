# Working in this repo

Two people and two assistants share it:

- **Filip + Claude** — the official site in `web/p6-site/` (build scripts, plans, apartment PDFs).
- **Vlad + his Claude** — the teaser at the repo root (live on **bytyp6.sk**), the legal pages, the CRM and the lead flow.

`main` is production: every push to it is deployed to bytyp6.sk by `.github/workflows/pages.yml`
(GitHub Pages). The repo is public, and stays public.

## The rule: dev notes in this file

**Before you edit anything**, `git pull` and read the newest entries under *Dev
notes*. The other side may have changed something since your last session, and
their notes say what and why. A commit log alone does not tell you that a flag
was flipped, a file moved, or that something is waiting on the client.

**After every commit**, add an entry at the top of *Dev notes* — the same push,
so the note and the code travel together.

Keep an entry to what the other side actually needs:

```
### YYYY-MM-DD · short title · branch or PR · who
- what changed, and why (a few lines, not a diff)
- anything the other side must know: flags flipped, files moved, deploy or
  domain changes, what is now waiting on whom
```

Write in whichever language suits you; both assistants read Slovak and English.

## Source of truth (kept by Vlad's side; if something here is wrong or missing, ask, do not guess)

**The repository is public on GitHub, so this file and the READMEs can be read by anyone** (since 2026-09-21 they are no longer served
on bytyp6.sk, see *What gets published*). Keep notes factual: no secrets, no credentials, nothing about the client's business reasoning, prices or negotiations.

### What is *not* in this repo
The website is the only thing here. The CRM (`p6-crm`, private, https://p6-crm.onrender.com), the n8n workflows (confirmation e-mail, lead → CRM),
the generators of the legal pages and of the teaser map, and the campaign material live on Vlad's side. Two consequences:
- **Do not hand-edit the four legal pages in the root** (`ochrana-osobnych-udajov.html`, `cookies.html`, `suhlas-so-spracovanim.html`,
  `pravne-informacie.html`) or the baked `data-cfg` values in them. They are generated in four languages and baked from `assets/js/config.js`;
  a manual edit is overwritten by the next bake. Need a change there? Leave a dev note for Vlad.
- `assets/js/config.js` is the single source for operator data, contact e-mail, tracking IDs and the n8n webhook.

### Identity (verified in the commercial register, 2026-09-21)
- **Operator / controller:** Byty Prievozska6 s.r.o. (official spelling, no diacritics), Prievozská 6, 821 09 Bratislava - mestská časť Ružinov,
  IČO 54 793 360, DIČ 2121785754, IČ DPH SK2121785754, OR Mestského súdu Bratislava III, oddiel Sro, vložka č. 162817/B.
  An earlier draft named a different company (Byty Jegeho2); that was wrong and is gone everywhere.
- **Processor** (runs the website, CRM and marketing, has access to the data): BIO - SERV, a.s. (avatarAI), IČO 31 442 072. Named in the privacy policy.
- **Contact:** info@bytyp6.sk only. There is **no sales phone number**. The operator's number appears once, as plain text in the imprint
  (`pravne-informacie.html`), because the law asks for it; never as a `tel:` link and never as a contact for buyers.
- Domain: bytyp6.sk (`prievozska6.sk` was a placeholder and is not ours).

### Public copy: what may be said
Confirmed: 44 flats · 1 to 3 rooms · 30 to 78 m² · a balcony with every flat · a communal rooftop terrace · parking by the house (no number) ·
the walking times and places shown on the teaser map · "predpredaj vybraných bytov za úvodné ceny", registration without obligation.

Not to be stated anywhere (pages, PDFs, meta tags, alt texts, public JS comments, ads): a number of parking spaces · fitness · heating, cooling,
glazing, floors or any other technical specification · dates of construction, completion or handover · prices, until an administrator enters them
in the CRM · yield, appreciation or any financial promise · "novostavba" · the reconstructed skeleton · that all 44 flats are available, which flats
are offered first or how many. Visualisations carry "ilustračná vizualizácia" / "Ilustračný obrázok".

### One set of legal pages, consent and tracking for the whole domain (in place since 2026-09-21)
Both sites live on the same origin. The official site **links to the root legal pages** (footer and form: `/ochrana-osobnych-udajov.html`,
`/cookies.html`, `/suhlas-so-spracovanim.html`, `/pravne-informacie.html`; add `?lang=en|de|uk` when needed) and every page of it **loads the root
scripts** `/assets/js/config.js` and `/assets/js/consent.js` (the generator's `scripts()` does that). `consent.js` is self-sufficient: its own texts
in four languages, its own stylesheet `/assets/css/consent.css` fetched on demand. The banner shows by itself as soon as a tracking id exists
in `config.js`, and reopens from any element with `data-cookie-settings`. **No analytics or ad tag may load outside `consent.js`** (Consent Mode v2,
everything denied until the visitor agrees). Fonts are self-hosted on both sites (`assets/fonts/`, the official site has its own copies of Inter);
nothing may be fetched from Google Fonts or another third party without consent. Root pages carry a CSP `<meta>`; a new third-party host has to
be added there on all five root pages.

### Forms (D1, done 2026-09-21 in `web/p6-site/assets/js/forms.js`): the one lead flow
A form on either site does two posts, both from the browser, field **names in plain ASCII** (Web3Forms garbles accented names):
1. `POST https://api.web3forms.com/submit` (multipart; `access_key` as in the root `index.html`, it is public by design) → e-mail to info@bytyp6.sk.
   Fields: `subject`, `from_name`, `replyto`, `Meno`, `Priezvisko`, `email`, `Telefon`, `Typ bytu`, `Byt na`, `Zdroj`, `Odkaz`, `GDPR kontakt`,
   `GDPR newsletter`, `Kedy`, `Jazyk`, `URL`, `utm_*`; add `Byt` for a specific flat.
2. After success, `POST P6_CONFIG.confirmWebhook` (multipart, `mode: "no-cors"`, `keepalive`) → n8n sends the confirmation e-mail and files the lead in the CRM.
   Fields: `token=p6-web-2026`, `email`, `name`, `priezvisko`, `telefon`, `typ_bytu`, `ucel`, `zdroj`, `sprava`, `suhlas_kontakt` (`ano`, mandatory:
   without it n8n drops the lead), `suhlas_newsletter` (`ano`/`nie`), `lang`, `url`, `utm_source|medium|campaign|content|term`,
   and **`byt`** = the flat id exactly as in `data.js` (`4.C`); n8n and the CRM attach that flat to the lead (live since 2026-09-21).
   The honeypot field is `p6_kontrola` and must stay empty.
   n8n only accepts requests whose Origin or Referer is https://bytyp6.sk, so the flow cannot be tested from localhost or a github.io preview.
Reuse the bot protection from `/assets/js/teaser.js` (honeypot, 4 s minimum, a real pointer or key event, 3 sends per hour, no links in the message).
The CRM's secret never reaches a browser; nothing on the site talks to the CRM's write API.

### Availability feed (wired since 2026-09-21, `web/p6-site/assets/js/availability.js`)
`GET https://p6-crm.onrender.com/api/public/units` → `{ "updatedAt": "...", "units": [{ "id": "2.A", "floor": 2, "rooms": 2, "area": "42.8", "ext": "13.0",
"total": "55.8", "status": "available" | "reserved" | "sold", "price": 189900 | null }] }`. CORS is open for https://bytyp6.sk and https://www.bytyp6.sk
(so it cannot be tried from localhost or another preview host), cache 60 s.
- The feed lists **only flats the administrator published in the CRM**. Selling and publishing are separate there: a closed sales round can
  reserve and sell flats that never appear in the feed. **A flat that is not in the list reads "Pripravujeme", without a price**; it can still be enquired about.
- `price` is a number only where the administrator published the price, otherwise `null` → "Na vyžiadanie".
- An empty, slow (2.5 s) or unreachable feed leaves the whole site neutral. The site never shows stale or invented availability.
- `data.js` stays the source of areas, rooms and plans; ids are identical on both sides. The apartment PDFs do not load the feed and stay neutral.

### Root files that production depends on
`CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `.well-known/security.txt`, and `assets/img/email/*` (the live confirmation e-mail loads its images
from there). Do not move, rename or delete them. Root assets are cache-busted with `?v=N`; bump the number when a file changes.

### What gets published (decided by Vlad, 2026-09-21)
bytyp6.sk is deployed by `.github/workflows/pages.yml` on every push to `main`, not by "deploy from branch" any more. It publishes the repository
**except**: `*.md`, every `_build/` folder (build scripts, the architect's source drawings, the PDF template), `*.py`, `*.mjs`, design sources
(`*.blend`, `*.psd`, `*.ai`), `.github/`, `.gitignore`. The workflow refuses to deploy when a page production depends on is missing or when one of
those internal kinds slipped in. **A new kind of internal file must be added to the exclude list in that workflow**, otherwise it goes online.
The custom domain and HTTPS are repository settings; `CNAME` stays in the root anyway. A deploy takes about a minute; its result is under *Actions*.

## Map, and the switches that decide what the site says

| Where | What |
|---|---|
| `/` (root) | the teaser, live on bytyp6.sk |
| `/nahlad/` | short link to the official site while it lives beside the teaser |
| `web/p6-site/` | the official site; see its own `README.md` for how it is built |
| `web/p6-site/_build/` | build scripts and source drawings, **not** part of the site and not published |

Switches in the official site, all documented in `web/p6-site/README.md`:

- `PREVIEW` (`_build/build_pages.py`) — `True` puts noindex on every page.
- `SHOW_STANDARD` (`_build/build_pages.py`) — the Štandard section, off until
  the project manager confirms the specification in writing.
- `SHOW_STATUS` / `SHOW_COUNTS` (`assets/js/data.js`) — **not switched by hand any more.** `assets/js/availability.js`
  reads the CRM feed on every page load and turns `SHOW_STATUS` on once the CRM has published at least one flat, and
  `SHOW_COUNTS` only when no flat is "Pripravujeme" any more. Until then the site is exactly as before: every flat reads
  "Pripravujeme", no legend, no availability filter, no counters. `LIVE_STATUS_URL = ""` cuts the site off from the CRM.
  Anything that draws flats must start through `whenAvailabilityKnown(fn)` (`site.js`), not on `DOMContentLoaded`.
- `SHOW_PRICES` (`assets/js/data.js`) — master switch for prices. A price now comes from the CRM feed, and only for flats
  whose price the administrator published; everything else says "Na vyžiadanie". The `status` and `price` values inside
  `data.js` are placeholders that the feed overwrites.

After changing anything in `web/p6-site/`, rebuild — and if the copy that goes
into the apartment cards changed, rebuild the PDFs too:

```bash
cd web/p6-site
python3 _build/build_pages.py
node _build/pdf/build_pdfs.mjs      # all 44 PDFs carry the same texts
```

## Dev notes

### 2026-09-22 · Meta Pixel ID doplnené, cookie lišta sa tým zapína · feat/meta-pixel-id · Filip + Claude
- `assets/js/config.js`: `tracking.metaPixel` = `1799799647800061` (dataset „P6 bytyp6.sk“, Events Manager,
  business P6 Byty). Zvyšné tri ID (`ga4`, `googleAds`, `googleAdsLeadLabel`) sú stále prázdne.
- **Dôsledok, o ktorom musíš vedieť:** `cookieBanner: 'auto'` a `consent.js` berie `hasTools` z toho, či je
  vyplnené aspoň jedno tracking ID. Doteraz nebolo žiadne, takže lišta sa nezobrazovala. Od tohto merge sa
  **cookie lišta na bytyp6.sk zobrazuje všetkým návštevníkom**. Ak sa tým mení text cookie stránky, prepeč
  právne stránky na svojej strane.
- Kód sa nemenil: pixel načítava `consent.js` až po súhlase s marketingom (PageView), `teaser.js` posiela
  `Lead` po odoslaní registrácie. CSP už `connect.facebook.net` aj `www.facebook.com` povoľuje.
- Ad account P6 Byty (`28619163461082427`) je zatiaľ prázdny a **nemá platobnú metódu**. Kampane sa pripravujú
  cez oficiálny Meta Ads MCP a vytvárajú sa v stave PAUSED.

### 2026-09-21 · only public files are deployed · ci/publish-only-public · Vlad + Claude
- Vlad decided the open point from PR #1's heads-up: Pages now deploys through `.github/workflows/pages.yml` (repository setting switched from
  "deploy from branch" to "GitHub Actions"). `_build/` with the architect's drawings, all `*.md` (this file, the READMEs), scripts and design
  sources are no longer downloadable from bytyp6.sk. Everything else is published exactly as before, same URLs.
- The workflow has a guard: it fails, and the previous deployment stays online, if a page production depends on is missing, if fewer than
  44 apartment PDFs are there, or if an internal file kind would be published. If a deploy fails, look at *Actions* first.
- For Filip's side nothing changes in how you work: branch, PR, merge to `main`, about a minute later it is live. If you add a new kind of
  internal file (e.g. `.xlsx` working sheets), add it to the exclude list in the workflow in the same PR.

### 2026-09-21 · legal links, local fonts, shared cookie banner, neutral contact page · feat/p6-site-legal-fonts-consent · Vlad + Claude
- At Vlad's request his side closed D3, D4, D5 and the contact-page part of E inside `web/p6-site/`.
- **D3:** footer column "Právne informácie" with the four root legal pages and "Nastavenia cookies" (`data-cookie-settings`).
- **D4:** Google Fonts are gone from every page and from the PDF template; Inter is served from `web/p6-site/assets/fonts/` (`@font-face` in
  `site.css`, same files as the teaser). The official site now makes no third-party request except the CRM availability feed.
- **D5:** every page loads the domain's `/assets/js/config.js` + `/assets/js/consent.js` through `scripts()`. Root change that made this possible:
  `consent.js` no longer needs the teaser's `i18n.js` or `teaser.css`: the banner texts (4 languages) moved into it, its styles into the new
  `/assets/css/consent.css`. No banner shows today because no tracking id is set. Root asset versions: `consent.js?v=4`, `i18n.js?v=16`, `teaser.css?v=15`.
- **Contact page:** removed opening hours, "vzorové materiály" and the answer "do jedného pracovného dňa"; nobody confirmed them. The thank-you
  now says a confirmation e-mail was sent (it is). `floorplan.js` comment no longer mentions the skeleton.
- `ASSET_V` 66 → 67, pages rebuilt, PDFs not rebuilt (next PDF build no longer needs the network for Inter).
- Checked in a browser: no third-party requests, Inter loaded locally, footer links resolve, banner with a simulated tracking id on both sites
  (Slovak on the official site; sk/en/de/uk on the teaser; reject loads nothing, accept loads the Google tag, footer link reopens settings).
- Still open on the official site: gallery images are AI stand-ins (E), `PREVIEW = False` last (F).

### 2026-09-21 · the contact form works: e-mail, confirmation, CRM · feat/p6-site-forms · Vlad + Claude
- At Vlad's request his side wired the official site's form (D1). Until now it showed "ďakujeme" and **sent nothing**; every enquiry was lost.
- New `assets/js/forms.js` (contact page only; `initForms` left `site.js`): Web3Forms → e-mail to info@bytyp6.sk, then the n8n webhook from the
  domain's `/assets/js/config.js` → confirmation e-mail to the visitor and the lead in the CRM **with the flat attached** (`?byt=4.C` from a
  flat's detail page, or what the visitor types, `2,a` → `2.A`; free text stays in the e-mail only). Same bot protection as the teaser.
- Form markup changed in `_build/build_pages.py`: two consents as on the teaser (contact mandatory, news optional) linking to the root legal
  pages, honeypot, error line, `maxlength`s, placeholder `4.C` instead of `4.03`, and the room select lost "4-izbový" and "5 a viac izieb"
  (the house has 1 to 3 rooms). `ASSET_V` 65 → 66, pages rebuilt. D2 is thereby done for this form; D3 (footer links), D4 (fonts), D5 (cookie bar) stay open.
- Checked in a browser with Web3Forms, n8n and the CRM mocked: payloads, prefill, no consent, bad e-mail, too fast, honeypot, scripted
  submit, links, delivery failure. Then one real enquiry on the live site (see the PR).
- Not touched, but worth a look by Filip's side: the contact page still promises "Otváracie hodiny 9:00 až 18:00", "vzorové materiály" and
  an answer "do jedného pracovného dňa". Nobody has confirmed those.

### 2026-09-21 · availability comes live from the CRM · feat/live-availability · Vlad + Claude
- At Vlad's request his side made this change inside `web/p6-site/`. New `assets/js/availability.js` (loaded right after `data.js`) reads the
  CRM feed; `site.js`, `floors.js` and the home page's featured block now start through `whenAvailabilityKnown()`. `SHOW_STATUS` became a `let`
  that the feed switches on, plus a new `SHOW_COUNTS`; counters stay hidden while any flat is still "Pripravujeme". Legend got a fourth entry.
- **Nothing changes on the site today:** the CRM has published no flat, so the feed is empty and everything reads "Pripravujeme" as before.
  It switches itself on when Vlad publishes the first flats in the CRM. Do not flip the flags by hand any more.
- `_build/plans/gendata.py` did not know `SHOW_STATUS` at all (it had been added to `data.js` by hand), so a regenerated `data.js` would have
  dropped it. The generator now writes the same block as `data.js`. `ASSET_V` 64 → 65, pages rebuilt; PDFs not rebuilt (their content is unchanged).
- Checked in a browser against a mocked feed: empty feed, three published flats (status, price, filter, detail pages), all 44 published
  (counters appear), feed failing and feed hanging (neutral after 2.5 s), no script errors.
- CRM side, for information: a flat has "Zverejniť na webe" and "Zverejniť aj cenu" switches and the enquiry field `byt` is accepted by the CRM.

### 2026-09-21 · source of truth section · docs/source-of-truth · Vlad + Claude
- Added **Source of truth** above: verified identity (controller, processor), what may and may not be said publicly, the contract for forms
  (D1) and for the availability feed, which root files production depends on, and that the legal pages are generated and must not be hand-edited.
- For D2, D3, D5: **link to the root legal pages and load the root `config.js` / `consent.js`**; do not copy them into `web/p6-site/`. For D4 use `/assets/fonts/`.
- For D1 send the flat as `byt` (`4.C`). Vlad's side is adding it to n8n and the CRM; until then the field is ignored and harmless.
- Earlier today, before the PR rule, Vlad's side pushed two commits straight to `main`: `6b377cf` (operator corrected to Byty Prievozska6 s.r.o.
  in `config.js` and all legal pages, documents effective 21. 9. 2026) and `73c12cf` (processor named). From now on branches and PRs only.
- Reminder: everything written here is public (see the first lines of *Source of truth*).

### 2026-09-21 · dev notes rule · chore/claude-devnotes · Filip + Claude
- Added this file. From now on: read the notes before editing, add an entry
  with every commit. Same rule for both sides.

### 2026-09-21 · short preview link · PR #3 · Filip + Claude
- `/nahlad/` redirects to `/web/p6-site/`, so the official site can be shared
  while it sits beside the teaser. noindex. **Delete it at go-live**, when the
  official site takes the domain root.

### 2026-09-21 · etapa 2: unconfirmed claims removed · PR #2 · Filip + Claude
- Worked through Vlad's `ETAPA2-ZMENY-PRE-KOLEGU.md`, sections A, B, C and E.
- **Štandard section is off** (`SHOW_STANDARD = False`): underfloor heating was
  invented (the house has radiators), and glazing, tiling, floors, chip entry
  and EV charging are unconfirmed. Fitness is gone everywhere. No parking count
  anywhere. Cellar sizes left `PARAMS`. The disclaimer matches the teaser and
  the "reconstructed skeleton" sentence also left the public `data.js`.
- **Identity**: bytyp6.sk, info@bytyp6.sk, the invented phone number removed
  everywhere including the PDFs, operator named in the footer and every PDF.
- **Availability hidden** (`SHOW_STATUS = false`): the sale runs in stages, so
  the site must not claim all 44 are free nor show which go first. Flip it back
  when the CRM feeds status (`GET /api/public/units`).
- All 44 PDFs regenerated. Still open from that document: the contact form
  sends nothing (D1), legal pages, consent and cookie bar to come over from the
  teaser (D2, D3, D5), Inter to self-host (D4), gallery is AI stand-ins (E),
  `PREVIEW = False` last (F).

### 2026-09-21 · the official site moved in · PR #1 · Filip + Claude
- `TheBiceps/rezidencia-aurora` imported to `web/p6-site/` with `git subtree`,
  so its 28 commits of history came with it. That repo is now private and its
  GitHub Pages is switched off; this repo is the only source of truth.
- The page builder derives its own location, so the folder can be renamed or
  moved without touching the script.
- **Heads-up:** Pages serves the whole repo, so `web/p6-site/_build/` is public
  too — including the architect's source drawings in `_build/plans/src/`. If
  that should not be downloadable, Pages has to publish a filtered folder
  through an Actions workflow instead of the branch.

### 2026-09-21 · privacy policy: processor named · 73c12cf · Vlad
- Named the processor with access to the data (BIO - SERV, a.s., avatarAI) in
  the privacy policy. Logged here so the other side knows it landed.
