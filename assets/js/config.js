/* P6 teaser — jediné miesto, kde sa dopĺňajú údaje prevádzkovateľa a merania.
   Všetky právne dokumenty (SK / EN / DE) si tieto hodnoty načítajú samy.
   Prázdna hodnota sa v dokumentoch zobrazí ako žlto označené „[doplniť …]“. */
window.P6_CONFIG = {
  legal: {
    company:  'Byty Prievozska6 s.r.o.', // obchodné meno (presne podľa obchodného registra, bez dĺžňa)
    seat:     'Prievozská 6, 821 09 Bratislava - mestská časť Ružinov',   // sídlo
    ico:      '54 793 360',             // IČO
    dic:      '2121785754',             // DIČ (= IČ DPH bez predpony SK)
    icdph:    'SK2121785754',           // IČ DPH
    register: 'Obchodný register Mestského súdu Bratislava III, oddiel Sro, vložka č. 162817/B',   // overené na orsr.sk 21. 9. 2026
    email:    'info@bytyp6.sk',    // kontakt pre osobné údaje aj všeobecné otázky
    phone:    '+421 902 900 868',       // telefón prevádzkovateľa: LEN v údajoch o prevádzkovateľovi (§ 4 zákona č. 22/2004 Z. z.), nie je to predajná linka a nepatrí na hlavnú stránku
    dpo:      '',                       // zodpovedná osoba (DPO), ak je určená: meno alebo e-mail; inak nechať prázdne
    processor: 'BIO - SERV, a.s. (avatarAI), Prešovská 39/A, 821 08 Bratislava - mestská časť Ružinov, IČO 31 442 072',   // sprostredkovateľ podľa čl. 28 GDPR: spravuje web, CRM a marketing; OR MS Bratislava III, oddiel Sa, vložka č. 6911/B (overené 21. 9. 2026)
    seller:   '',                       // výhradný predajca / realitná kancelária, ak predaj zabezpečuje tretia strana
    retentionYears: 3,                  // ako dlho sa uchovávajú kontakty záujemcov od udelenia súhlasu
    effective: '2026-09-21'             // dátum účinnosti dokumentov (RRRR-MM-DD)
  },

  /* Meracie a reklamné nástroje. Kým je ID prázdne, nástroj sa nenačíta.
     Načítajú sa až po súhlase návštevníka v cookie lište. */
  tracking: {
    ga4:       '',                      // Google Analytics 4, napr. 'G-XXXXXXXXXX'
    googleAds: '',                      // Google Ads, napr. 'AW-XXXXXXXXX'
    googleAdsLeadLabel: '',             // označenie konverzie „registrácia“ z Google Ads (časť za lomkou v AW-XXXXXXXXX/AbCdEfGh)
    metaPixel: ''                       // Meta (Facebook) Pixel ID
  },

  /* Potvrdzovací e-mail záujemcovi po registrácii posiela n8n workflow „P6 · potvrdenie registrácie“
     (zdroj: teaser-build/n8n/). Prázdna hodnota = potvrdenie sa neposiela. Doména musí byť aj v CSP (connect-src). */
  confirmWebhook: 'https://n8n.allsoftcorp.com/webhook/p6-potvrdenie-registracie',

  /* Ochrana formulára captchou (hCaptcha cez Web3Forms, zadarmo). Predvolene vypnutá: formulár chráni
     skryté pole, časový zámok, overenie skutočného stlačenia klávesu alebo dotyku a hodinový limit.
     Zapnúť, len ak začne chodiť spam. POSTUP: 1. vo Web3Forms (dashboard, formulár P6 teaser) zapnúť hCaptcha,
     2. tu nastaviť true, 3. spustiť teaser-build/bake_config.py. Opačné poradie by formulár znefunkčnilo. */
  formCaptcha: false,

  /* Cookie lišta: 'auto' = zobrazí sa, len ak je vyplnený aspoň jeden nástroj vyššie,
     true = vždy, false = nikdy. */
  cookieBanner: 'auto',

  /* Jazyk podľa polohy. Predvolene sa krajina odhaduje z časového pásma zariadenia,
     takže žiadna IP adresa neopúšťa prehliadač. Ak hosting vie vrátiť krajinu podľa IP
     (Cloudflare / Netlify / Vercel edge funkcia), sem patrí jej URL; má vrátiť JSON {"country":"AT"}. */
  geoEndpoint: '',
  slovakBrowserLangs: ['sk', 'cs'],     // návštevník s týmto jazykom prehliadača dostane slovenčinu aj v zahraničí
  ukrainianBrowserLangs: ['uk']         // návštevník s ukrajinským prehliadačom dostane ukrajinčinu aj na Slovensku
};
