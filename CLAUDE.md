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
