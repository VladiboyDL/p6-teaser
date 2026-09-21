# Working in this repo

Two people and two assistants share it:

- **Filip + Claude** — the official site in `web/p6-site/` (build scripts, plans, apartment PDFs).
- **Vlad + his Claude** — the teaser at the repo root (live on **bytyp6.sk**), the legal pages, the CRM and the lead flow.

`main` is production: it deploys to bytyp6.sk through GitHub Pages. The repo is
public, and stays public.

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

**This file, the READMEs and everything else in the repo are public and served on bytyp6.sk** (`/CLAUDE.md` answers 200).
Keep notes factual: no secrets, no credentials, nothing about the client's business reasoning, prices or negotiations.

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
One leftover today: `web/p6-site/assets/js/floorplan.js:19` still says "the skeleton being reconstructed" in a comment.

### One set of legal pages, consent and tracking for the whole domain
Both sites live on the same origin, so the official site **links to the root legal pages** (`/ochrana-osobnych-udajov.html`, `/cookies.html`,
`/suhlas-so-spracovanim.html`, `/pravne-informacie.html`, add `?lang=en|de|uk` when needed) and **loads the root scripts** (`/assets/js/config.js`,
`/assets/js/consent.js`) instead of copying them. No analytics or ad tag may load outside `consent.js` (Consent Mode v2, everything denied until the
visitor agrees). Fonts are self-hosted in `/assets/fonts/` (Inter incl. Cyrillic, Newsreader); nothing may be fetched from Google Fonts or another
third party without consent. Root pages carry a CSP `<meta>`; a new third-party host has to be added there on all five root pages.

### Forms (D1): the one lead flow
A form on either site does two posts, both from the browser, field **names in plain ASCII** (Web3Forms garbles accented names):
1. `POST https://api.web3forms.com/submit` (multipart; `access_key` as in the root `index.html`, it is public by design) → e-mail to info@bytyp6.sk.
   Fields: `subject`, `from_name`, `replyto`, `Meno`, `Priezvisko`, `email`, `Telefon`, `Typ bytu`, `Byt na`, `Zdroj`, `Odkaz`, `GDPR kontakt`,
   `GDPR newsletter`, `Kedy`, `Jazyk`, `URL`, `utm_*`; add `Byt` for a specific flat.
2. After success, `POST P6_CONFIG.confirmWebhook` (multipart, `mode: "no-cors"`, `keepalive`) → n8n sends the confirmation e-mail and files the lead in the CRM.
   Fields: `token=p6-web-2026`, `email`, `name`, `priezvisko`, `telefon`, `typ_bytu`, `ucel`, `zdroj`, `sprava`, `suhlas_kontakt` (`ano`, mandatory:
   without it n8n drops the lead), `suhlas_newsletter` (`ano`/`nie`), `lang`, `url`, `utm_source|medium|campaign|content|term`,
   and **`byt`** = the flat id exactly as in `data.js` (`4.C`). The honeypot field is `p6_kontrola` and must stay empty.
   n8n only accepts requests whose Origin or Referer is https://bytyp6.sk, so the flow cannot be tested from localhost or a github.io preview.
Reuse the bot protection from `/assets/js/teaser.js` (honeypot, 4 s minimum, a real pointer or key event, 3 sends per hour, no links in the message).
The CRM's secret never reaches a browser; nothing on the site talks to the CRM's write API.

### Availability feed (for `SHOW_STATUS`)
`GET https://p6-crm.onrender.com/api/public/units` → `{ "updatedAt": "...", "units": [{ "id": "2.A", "floor": 2, "rooms": 2, "area": "42.8", "ext": "13.0",
"total": "55.8", "status": "available" | "reserved" | "sold" }] }`. CORS is open for https://bytyp6.sk and https://www.bytyp6.sk, cache 60 s.
**A flat that is not in the list is not on offer: show it as "Pripravujeme", without a status, price or enquiry button.** Today the list is empty.
The feed carries no prices yet. `data.js` stays the source of areas, rooms and plans; ids are identical on both sides.

### Root files that production depends on
`CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `.well-known/security.txt`, and `assets/img/email/*` (the live confirmation e-mail loads its images
from there). Do not move, rename or delete them. Root assets are cache-busted with `?v=N`; bump the number when a file changes.

### Open decision (Vlad)
Pages publishes the whole branch, so `/web/p6-site/` with all 44 flats, the PDFs, `_build/` with the architect's drawings, and this file are reachable on
the production domain (pages are noindex, PDFs and drawings cannot be). Option on the table: deploy through an Actions workflow that publishes only
what should be public. Nobody changes the Pages setup until Vlad decides.

## Map, and the switches that decide what the site says

| Where | What |
|---|---|
| `/` (root) | the teaser, live on bytyp6.sk |
| `/nahlad/` | short link to the official site while it lives beside the teaser |
| `web/p6-site/` | the official site; see its own `README.md` for how it is built |
| `web/p6-site/_build/` | build scripts and source drawings, **not** part of the site |

Switches in the official site, all documented in `web/p6-site/README.md`:

- `PREVIEW` (`_build/build_pages.py`) — `True` puts noindex on every page.
- `SHOW_STANDARD` (`_build/build_pages.py`) — the Štandard section, off until
  the project manager confirms the specification in writing.
- `SHOW_STATUS` (`assets/js/data.js`) — availability, off until the CRM feeds
  status live; every flat reads "Pripravujeme".
- `SHOW_PRICES` (`assets/js/data.js`) — prices; every price is `null` today, so
  the site says "Cena na vyžiadanie".

After changing anything in `web/p6-site/`, rebuild — and if the copy that goes
into the apartment cards changed, rebuild the PDFs too:

```bash
cd web/p6-site
python3 _build/build_pages.py
node _build/pdf/build_pdfs.mjs      # all 44 PDFs carry the same texts
```

## Dev notes

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
