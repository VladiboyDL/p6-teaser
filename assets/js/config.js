/* P6 teaser — jediné miesto, kde sa dopĺňajú údaje prevádzkovateľa a merania.
   Všetky právne dokumenty (SK / EN / DE) si tieto hodnoty načítajú samy.
   Prázdna hodnota sa v dokumentoch zobrazí ako žlto označené „[doplniť …]“. */
window.P6_CONFIG = {
  legal: {
    company:  '',                       // obchodné meno, napr. 'P6 Development, s. r. o.'
    seat:     '',                       // sídlo, napr. 'Ulica 1, 811 01 Bratislava'
    ico:      '',                       // IČO
    dic:      '',                       // DIČ (nepovinné)
    icdph:    '',                       // IČ DPH (nepovinné)
    register: '',                       // napr. 'Obchodný register Mestského súdu Bratislava III, oddiel Sro, vložka č. 000000/B'
    email:    'info@prievozska6.sk',    // kontakt pre osobné údaje aj všeobecné otázky
    phone:    '',                       // telefón; kým je prázdny, v dokumentoch sa riadok nezobrazuje. Pred ostrým spustením doplniť (§ 4 zákona č. 22/2004 Z. z. ho vyžaduje)
    dpo:      '',                       // zodpovedná osoba (DPO), ak je určená: meno alebo e-mail; inak nechať prázdne
    seller:   '',                       // výhradný predajca / realitná kancelária, ak predaj zabezpečuje tretia strana
    retentionYears: 3,                  // ako dlho sa uchovávajú kontakty záujemcov od udelenia súhlasu
    effective: '2026-09-19'             // dátum účinnosti dokumentov (RRRR-MM-DD)
  },

  /* Meracie a reklamné nástroje. Kým je ID prázdne, nástroj sa nenačíta.
     Načítajú sa až po súhlase návštevníka v cookie lište. */
  tracking: {
    ga4:       '',                      // Google Analytics 4, napr. 'G-XXXXXXXXXX'
    googleAds: '',                      // Google Ads, napr. 'AW-XXXXXXXXX'
    metaPixel: ''                       // Meta (Facebook) Pixel ID
  },

  /* Cookie lišta: 'auto' = zobrazí sa, len ak je vyplnený aspoň jeden nástroj vyššie,
     true = vždy, false = nikdy. */
  cookieBanner: 'auto',

  /* Jazyk podľa polohy. Predvolene sa krajina odhaduje z časového pásma zariadenia,
     takže žiadna IP adresa neopúšťa prehliadač. Ak hosting vie vrátiť krajinu podľa IP
     (Cloudflare / Netlify / Vercel edge funkcia), sem patrí jej URL; má vrátiť JSON {"country":"AT"}. */
  geoEndpoint: '',
  slovakBrowserLangs: ['sk', 'cs']      // návštevník s týmto jazykom prehliadača dostane slovenčinu aj v zahraničí
};
