/* P6 teaser — translations (EN, DE) and the SK / EN / DE switcher.
   Slovak is the source language and lives in the HTML itself; this file only
   carries what replaces it. Keys match data-i18n / data-i18n-attr in the markup.
   Strings are trusted HTML written by us, so they are applied with innerHTML. */
(function () {
  'use strict';

  var L = window.P6_LANG || { current: 'sk', source: 'location', supported: ['sk', 'en', 'de'] };
  var cfg = window.P6_CONFIG || {};
  var root = document.documentElement;

  /* --- strings that only JavaScript shows (needed in all three languages) ------------- */
  var JS = {
    sk: {
      'meta.title': 'P6 | Pripravujeme. Domov medzi Miletičkou a Downtownom',
      'meta.desc': 'Pripravujeme 44 bytov v bratislavskom Ružinove, medzi Miletičkou a novým downtownom. Zaregistrujte sa a získajte prednostný výber bytov ešte pred spustením predaja.',
      'err.first': 'Vyplňte, prosím, meno.',
      'err.last': 'Vyplňte, prosím, priezvisko.',
      'err.email': 'Zadajte platnú e-mailovú adresu.',
      'err.phone': 'Skontrolujte telefónne číslo.',
      'err.consent': 'Bez súhlasu so spracovaním údajov vás nemôžeme kontaktovať.',
      'err.send': 'Formulár sa nepodarilo odoslať. Skúste to, prosím, znova alebo nám napíšte na {email}.',
      'sending': 'Odosielam…',
      'done.title': 'Ďakujeme, ste na zozname',
      'done.text': 'Ozveme sa vám ako prvým, hneď ako budú pripravené pôdorysy a cenník.',
      'done.mail.title': 'Ešte jeden krok',
      'done.mail.text': 'Otvorili sme váš e-mailový program s pripravenou správou. Stačí ju odoslať a ste na zozname.',
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
      'ck.close': 'Zavrieť',
      'cfg.missing': 'doplniť'
    },
    en: {
      'meta.title': 'P6 | Coming soon. A home between Miletička market and Downtown',
      'meta.desc': '44 new apartments coming to Bratislava-Ružinov, between the Miletička market and the new downtown. Register for priority selection before sales open.',
      'err.first': 'Please enter your first name.',
      'err.last': 'Please enter your last name.',
      'err.email': 'Please enter a valid e-mail address.',
      'err.phone': 'Please check the phone number.',
      'err.consent': 'We cannot contact you without your consent to data processing.',
      'err.send': 'The form could not be sent. Please try again or write to us at {email}.',
      'sending': 'Sending…',
      'done.title': 'Thank you, you are on the list',
      'done.text': 'You will be among the first to hear from us once floor plans and prices are ready.',
      'done.mail.title': 'One more step',
      'done.mail.text': 'We have opened your e-mail app with a prepared message. Just send it and you are on the list.',
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
      'ck.close': 'Close',
      'cfg.missing': 'to be completed'
    },
    de: {
      'meta.title': 'P6 | In Vorbereitung. Zuhause zwischen Miletička-Markt und Downtown',
      'meta.desc': '44 neue Wohnungen in Bratislava-Ružinov, zwischen dem Miletička-Markt und der neuen Downtown. Registrieren Sie sich für die vorrangige Wohnungsauswahl vor dem Verkaufsstart.',
      'err.first': 'Bitte geben Sie Ihren Vornamen ein.',
      'err.last': 'Bitte geben Sie Ihren Nachnamen ein.',
      'err.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      'err.phone': 'Bitte überprüfen Sie die Telefonnummer.',
      'err.consent': 'Ohne Ihre Einwilligung in die Datenverarbeitung können wir Sie nicht kontaktieren.',
      'err.send': 'Das Formular konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns an {email}.',
      'sending': 'Wird gesendet…',
      'done.title': 'Vielen Dank, Sie stehen auf der Liste',
      'done.text': 'Wir melden uns bei Ihnen als Erste, sobald Grundrisse und Preisliste vorliegen.',
      'done.mail.title': 'Noch ein Schritt',
      'done.mail.text': 'Wir haben Ihr E-Mail-Programm mit einer vorbereiteten Nachricht geöffnet. Senden Sie sie einfach ab und Sie stehen auf der Liste.',
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
      'ck.close': 'Schließen',
      'cfg.missing': 'zu ergänzen'
    }
  };

  /* --- page copy ------------------------------------------------------------------------ */
  var PAGE = {
    en: {
      'skip': 'Skip to content',
      'nav.aria': 'Main navigation',
      'nav.project': 'Project', 'nav.location': 'Location', 'nav.perks': 'Benefits', 'nav.steps': 'How it works',
      'cta.interest': 'I’m interested',
      'hero.alt': 'Visualisation of the P6 apartment building: five storeys with green balconies and a roof terrace',
      'hero.status': 'Coming soon · Bratislava-Ružinov',
      'hero.title': '<span class="line"><span>A home between</span></span><span class="line"><span>Miletička market</span></span><span class="line"><span>and&nbsp;<em>Downtown</em></span></span>',
      'hero.sub': '44 apartments in Bratislava’s Ružinov district. The market, school, work, Nivy and the city’s new centre, all within natural reach. Register and choose your apartment before sales open.',
      'hero.cta': 'Get priority selection', 'hero.cta2': 'Discover the project',
      'hero.facts.aria': 'The project at a glance',
      'fact.flats': 'apartments', 'fact.rooms.n': '1 to 3', 'fact.rooms': 'rooms', 'fact.area.n': '30 to 78', 'fact.area': 'm² floor area',
      'viz': 'Visualisation', 'hero.cue': 'Continue to the project',
      'about.eyebrow': 'About the project',
      'about.title': 'A calm house<br>in a&nbsp;dynamic<br>part of the city',
      'about.lede': 'P6 is urban living in Ružinov, where the Miletička neighbourhood meets the new downtown. The original structure of the building gets a second life: 44 apartments, green balconies and a roof terrace for all residents.',
      'about.p1': 'One- to three-room apartments from 30 to 78&nbsp;m², each with its own balcony. Large windows, clear layouts and privacy where you will actually use it.',
      'about.p2': 'A home for people who want work, school, the market and the centre at the right distance. And who would rather spend less time commuting and more on what matters to them.',
      'about.link': 'Get priority selection',
      'about.alt': 'Visualisation of the P6 street façade: five storeys, continuous balconies with greenery and a roof terrace',
      'about.cap': 'Visualisation · street façade',
      'fig.area': 'm² apartment floor area', 'fig.floors': 'storeys above ground', 'fig.parking': 'parking spaces',
      'loc.eyebrow': 'Location',
      'loc.title': 'Everything that matters<br>at the right <em>distance</em>',
      'loc.lede': 'Mlynské nivy and its surroundings form Bratislava’s main business district. The Miletičova market, school, Nivy and the Danube embankment are all within walking or cycling distance.',
      'd1.n': '1 min', 'd1': 'on foot to the business district',
      'd2.n': '2 min', 'd2': 'on foot to public transport',
      'd3.n': '7 min', 'd3': 'on foot to primary and grammar school',
      'd4.n': '13 min', 'd4': 'on foot to the Miletičova market',
      'd5.n': 'within 1.5 km', 'd5': 'Nivy, Twin City, CBC, Sky Park',
      'd6.n': '15 to 20 min', 'd6': 'by car to Bratislava Airport',
      'map.aria': 'Schematic map of the P6 surroundings: Mlynské nivy, Miletičova, Nivy bus station, the Danube and 5- and 15-minute walking rings',
      'map.danube': 'DANUBE', 'map.r5': '5 MIN WALK', 'map.r15': '15 MIN WALK', 'map.oldtown': 'OLD TOWN',
      'map.market': 'Miletičova Market', 'map.school': 'Novohradská School', 'map.nivy': 'Nivy Bus Station',
      'map.bridge': 'Apollo Bridge', 'map.lake': 'Štrkovec Lake', 'map.airport': 'Airport 15 min →', 'map.stadium': '↑ Ice Stadium',
      'map.cap': 'Schematic map, not to scale. The project location is shown approximately; times are measured along real routes.',
      'perks.eyebrow': 'Benefits', 'perks.title': 'What will P6 bring?',
      'perk.1': 'A balcony with every apartment', 'perk.2': 'Shared roof terrace', 'perk.3': 'Fitness room for residents',
      'perk.4': '50 parking spaces in front of the building', 'perk.5': 'Large-format triple-glazed windows',
      'perk.6': 'Underfloor heating, prepared for cooling', 'perk.7': 'Public transport 2 minutes on foot',
      'perk.8': 'Business district and Nivy within walking distance',
      'perks.note': 'The finish standard and the fit-out of shared spaces will be specified according to the final project documentation.',
      'gal.eyebrow': 'First visualisations',
      'gal.title': 'Home does not end<br>at your front door',
      'gal.lede': 'Bright apartments with a balcony facing where you will use it. And above them a shared terrace for a chat, a rest or a quiet evening above the city.',
      'gal.alt1': 'Visualisation of a living room opening onto a balcony, a bright interior with a wooden floor',
      'gal.alt2': 'Visualisation of the shared roof terrace after sunset: pergolas, greenery and seating',
      'gal.alt3': 'Visualisation of a bedroom with a floor-to-ceiling window and a view of greenery',
      'gal.cap1': 'Visualisation · living room', 'gal.cap2': 'Visualisation · roof terrace', 'gal.cap3': 'Visualisation · bedroom',
      'steps.eyebrow': 'How it works',
      'steps.title': 'Three steps to an apartment<br>you get to choose first',
      'step1.t': 'You register', 'step1.p': 'Fill in a short form. It takes a minute and commits you to nothing.', 'step1.tag': 'Open now',
      'step2.t': 'We contact you first', 'step2.p': 'You receive floor plans, prices and the specification before sales open to the public.', 'step2.tag': 'Before sales open',
      'step3.t': 'You choose with priority', 'step3.p': 'At a personal consultation you pick your apartment while the full offer is still available.', 'step3.tag': 'Priority selection',
      'reg.eyebrow': 'Register your interest',
      'reg.title': 'Priority apartment selection <em>before sales open</em>',
      'reg.lede': 'Leave us your contact details. Registered buyers hear about apartments, prices and dates before anyone else.',
      'reg.t1': 'floor plans and prices before we publish them', 'reg.t2': 'a choice from all 44 apartments', 'reg.t3': 'a personal consultation with no obligation',
      'f.first': 'First name', 'f.first.ph': 'Your first name', 'f.last': 'Last name', 'f.last.ph': 'Your last name',
      'f.email': 'E-mail', 'f.email.ph': 'you@email.com', 'f.phone': 'Phone <i>(optional)</i>',
      'f.type': 'Which apartment are you interested in?', 'f.type1': '1 room', 'f.type2': '2 rooms', 'f.type3': '3 rooms', 'f.type0': 'Not sure yet',
      'f.purpose': 'I am looking for <i>(optional)</i>', 'f.purpose1': 'A home for myself', 'f.purpose2': 'An investment',
      'f.source': 'How did you hear about P6? <i>(optional)</i>',
      'f.src0': 'Select', 'f.src1': 'Google search', 'f.src2': 'Social media', 'f.src3': 'Online advertising', 'f.src4': 'Property portal',
      'f.src5': 'Advertising at the site', 'f.src6': 'Recommendation', 'f.src7': 'Other',
      'f.msg': 'Message <i>(optional)</i>', 'f.msg.ph': 'For example your preferred floor or orientation',
      'f.consent1': 'I give my <a href="suhlas-so-spracovanim.html" target="_blank" rel="noopener">consent to the processing of personal data</a> for the purpose of being contacted about the P6 project. I have read the <a href="ochrana-osobnych-udajov.html" target="_blank" rel="noopener">Privacy Policy</a>.',
      'f.consent2': 'I agree to receive news about the project by e-mail. I can withdraw this consent at any time. <i>(optional)</i>',
      'f.fine': 'We use your details only to contact you about the P6 project. We do not pass them to third parties for advertising.',
      'foot.about': 'Urban living in Bratislava’s Ružinov district. The Miletička market, school, business district, Nivy and the city’s new centre within natural reach.',
      'foot.sales': 'Sales', 'foot.hours': 'Mon to Fri, 9:00 to 18:00', 'foot.page': 'Page', 'foot.reg': 'Register your interest',
      'foot.legal': 'Legal',
      'legal.privacy': 'Privacy Policy', 'legal.cookies': 'Cookie Policy', 'legal.consent': 'Consent to data processing',
      'legal.terms': 'Terms of use and site operator', 'legal.cookieset': 'Cookie settings',
      'legal.back': 'Back to the homepage', 'legal.eyebrow': 'Legal information',
      'foot.rights': 'All rights reserved.',
      'foot.disclaimer': 'Visualisations are illustrative. Floor areas, times and distances are approximate. The project is a reconstruction of an existing structure and the investor reserves the right to make changes. Information on this site is neither an offer to conclude a contract nor a public promise.',
      'sticky.text': 'Priority apartment selection<span class="sticky__more"> before sales open</span>'
    },
    de: {
      'skip': 'Zum Inhalt springen',
      'nav.aria': 'Hauptnavigation',
      'nav.project': 'Projekt', 'nav.location': 'Lage', 'nav.perks': 'Vorteile', 'nav.steps': 'So funktioniert es',
      'cta.interest': 'Ich bin interessiert',
      'hero.alt': 'Visualisierung des Wohnhauses P6: fünf Geschosse mit begrünten Balkonen und Dachterrasse',
      'hero.status': 'In Vorbereitung · Bratislava-Ružinov',
      'hero.title': '<span class="line"><span>Zuhause zwischen</span></span><span class="line"><span>Miletička-Markt</span></span><span class="line"><span>und&nbsp;<em>Downtown</em></span></span>',
      'hero.sub': '44 Wohnungen im Bratislavaer Stadtteil Ružinov. Markt, Schule, Arbeit, Nivy und das neue Stadtzentrum in natürlicher Reichweite. Registrieren Sie sich und wählen Sie Ihre Wohnung vor dem Verkaufsstart.',
      'hero.cta': 'Vorrangige Auswahl sichern', 'hero.cta2': 'Projekt entdecken',
      'hero.facts.aria': 'Das Projekt in Kürze',
      'fact.flats': 'Wohnungen', 'fact.rooms.n': '1 bis 3', 'fact.rooms': 'Zimmer', 'fact.area.n': '30 bis 78', 'fact.area': 'm² Wohnfläche',
      'viz': 'Visualisierung', 'hero.cue': 'Weiter zum Projekt',
      'about.eyebrow': 'Über das Projekt',
      'about.title': 'Ein ruhiges Haus<br>in einem dynamischen<br>Teil der Stadt',
      'about.lede': 'P6 ist städtisches Wohnen in Ružinov, an der Schnittstelle zwischen dem Miletička-Viertel und der neuen Downtown. Das ursprüngliche Skelett des Gebäudes bekommt ein zweites Leben: 44 Wohnungen, begrünte Balkone und eine Dachterrasse für alle Bewohner.',
      'about.p1': 'Ein- bis Dreizimmerwohnungen von 30 bis 78&nbsp;m², jede mit eigenem Balkon. Große Fenster, klare Grundrisse und Privatsphäre dort, wo Sie sie wirklich nutzen.',
      'about.p2': 'Wohnen für Menschen, die Arbeit, Schule, Markt und Zentrum in der richtigen Entfernung haben möchten. Und die weniger Zeit unterwegs und mehr Zeit mit dem verbringen wollen, was ihnen wichtig ist.',
      'about.link': 'Vorrangige Auswahl sichern',
      'about.alt': 'Visualisierung der Straßenfassade von P6: fünf Geschosse, durchlaufende begrünte Balkone und Dachterrasse',
      'about.cap': 'Visualisierung · Straßenfassade',
      'fig.area': 'm² Wohnfläche der Wohnungen', 'fig.floors': 'oberirdische Geschosse', 'fig.parking': 'Parkplätze',
      'loc.eyebrow': 'Lage',
      'loc.title': 'Alles Wesentliche<br>in der richtigen <em>Entfernung</em>',
      'loc.lede': 'Mlynské nivy und Umgebung bilden das wichtigste Geschäftsviertel Bratislavas. Der Markt Miletičova, die Schule, Nivy und das Donauufer sind zu Fuß oder mit dem Fahrrad erreichbar.',
      'd1.n': '1 Min.', 'd1': 'zu Fuß ins Geschäftsviertel',
      'd2.n': '2 Min.', 'd2': 'zu Fuß zur ÖPNV-Haltestelle',
      'd3.n': '7 Min.', 'd3': 'zu Fuß zu Grundschule und Gymnasium',
      'd4.n': '13 Min.', 'd4': 'zu Fuß zum Markt Miletičova',
      'd5.n': 'bis 1,5 km', 'd5': 'Nivy, Twin City, CBC, Sky Park',
      'd6.n': '15 bis 20 Min.', 'd6': 'mit dem Auto zum Flughafen Bratislava',
      'map.aria': 'Schematische Karte der Umgebung von P6: Mlynské nivy, Miletičova, Busbahnhof Nivy, Donau sowie Gehzeit-Ringe für 5 und 15 Minuten',
      'map.danube': 'DONAU', 'map.r5': '5 MIN. ZU FUSS', 'map.r15': '15 MIN. ZU FUSS', 'map.oldtown': 'ALTSTADT',
      'map.market': 'Markt Miletičova', 'map.school': 'Schule Novohradská', 'map.nivy': 'Busbahnhof Nivy',
      'map.bridge': 'Apollo-Brücke', 'map.lake': 'Štrkovec-See', 'map.airport': 'Flughafen 15 Min. →', 'map.stadium': '↑ Eisstadion',
      'map.cap': 'Schematische Karte, nicht maßstabsgetreu. Die Lage des Projekts ist ungefähr eingezeichnet; die Zeiten wurden auf realen Wegen gemessen.',
      'perks.eyebrow': 'Vorteile', 'perks.title': 'Was bringt P6?',
      'perk.1': 'Ein Balkon zu jeder Wohnung', 'perk.2': 'Gemeinschaftliche Dachterrasse', 'perk.3': 'Fitnessraum für Bewohner',
      'perk.4': '50 Parkplätze vor dem Haus', 'perk.5': 'Großformatige Fenster mit Dreifachverglasung',
      'perk.6': 'Fußbodenheizung, für Kühlung vorbereitet', 'perk.7': 'ÖPNV-Haltestelle 2 Minuten zu Fuß',
      'perk.8': 'Geschäftsviertel und Nivy in Gehweite',
      'perks.note': 'Der Ausführungsstandard und die Ausstattung der Gemeinschaftsräume werden gemäß der endgültigen Projektdokumentation präzisiert.',
      'gal.eyebrow': 'Erste Visualisierungen',
      'gal.title': 'Zuhause endet nicht<br>an Ihrer Wohnungstür',
      'gal.lede': 'Helle Wohnungen mit einem Balkon, der dorthin ausgerichtet ist, wo Sie ihn nutzen. Und darüber eine gemeinsame Terrasse für ein Gespräch, eine Pause oder einen ruhigen Abend über der Stadt.',
      'gal.alt1': 'Visualisierung eines Wohnzimmers mit Zugang zum Balkon, helles Interieur mit Holzboden',
      'gal.alt2': 'Visualisierung der gemeinschaftlichen Dachterrasse nach Sonnenuntergang: Pergolen, Grün und Sitzgelegenheiten',
      'gal.alt3': 'Visualisierung eines Schlafzimmers mit bodentiefem Fenster und Blick ins Grüne',
      'gal.cap1': 'Visualisierung · Wohnzimmer', 'gal.cap2': 'Visualisierung · Dachterrasse', 'gal.cap3': 'Visualisierung · Schlafzimmer',
      'steps.eyebrow': 'So funktioniert es',
      'steps.title': 'Drei Schritte zur Wohnung,<br>die Sie als Erste auswählen',
      'step1.t': 'Sie registrieren sich', 'step1.p': 'Sie füllen ein kurzes Formular aus. Das dauert eine Minute und verpflichtet Sie zu nichts.', 'step1.tag': 'Läuft gerade',
      'step2.t': 'Wir melden uns zuerst bei Ihnen', 'step2.p': 'Grundrisse, Preisliste und Standard erhalten Sie noch vor dem öffentlichen Verkaufsstart.', 'step2.tag': 'Vor dem Verkaufsstart',
      'step3.t': 'Sie wählen vorrangig aus', 'step3.p': 'In einem persönlichen Beratungsgespräch wählen Sie Ihre Wohnung, solange das gesamte Angebot verfügbar ist.', 'step3.tag': 'Vorrangige Auswahl',
      'reg.eyebrow': 'Registrierung für Interessenten',
      'reg.title': 'Vorrangige Wohnungsauswahl <em>vor dem Verkaufsstart</em>',
      'reg.lede': 'Hinterlassen Sie uns Ihre Kontaktdaten. Registrierte Interessenten erfahren früher als alle anderen von Wohnungen, Preisen und Terminen.',
      'reg.t1': 'Grundrisse und Preisliste vor der Veröffentlichung', 'reg.t2': 'Auswahl aus dem gesamten Angebot von 44 Wohnungen', 'reg.t3': 'unverbindliche persönliche Beratung',
      'f.first': 'Vorname', 'f.first.ph': 'Ihr Vorname', 'f.last': 'Nachname', 'f.last.ph': 'Ihr Nachname',
      'f.email': 'E-Mail', 'f.email.ph': 'sie@email.de', 'f.phone': 'Telefon <i>(optional)</i>',
      'f.type': 'Für welche Wohnung interessieren Sie sich?', 'f.type1': '1 Zimmer', 'f.type2': '2 Zimmer', 'f.type3': '3 Zimmer', 'f.type0': 'Weiß ich noch nicht',
      'f.purpose': 'Ich suche eine Wohnung als <i>(optional)</i>', 'f.purpose1': 'Eigenes Zuhause', 'f.purpose2': 'Kapitalanlage',
      'f.source': 'Wie haben Sie von P6 erfahren? <i>(optional)</i>',
      'f.src0': 'Bitte wählen', 'f.src1': 'Google-Suche', 'f.src2': 'Soziale Netzwerke', 'f.src3': 'Online-Werbung', 'f.src4': 'Immobilienportal',
      'f.src5': 'Werbung an der Baustelle', 'f.src6': 'Empfehlung', 'f.src7': 'Sonstiges',
      'f.msg': 'Nachricht <i>(optional)</i>', 'f.msg.ph': 'Zum Beispiel bevorzugtes Stockwerk oder Ausrichtung',
      'f.consent1': 'Ich erteile meine <a href="suhlas-so-spracovanim.html" target="_blank" rel="noopener">Einwilligung in die Verarbeitung personenbezogener Daten</a> zum Zweck der Kontaktaufnahme im Zusammenhang mit dem Projekt P6. Die <a href="ochrana-osobnych-udajov.html" target="_blank" rel="noopener">Datenschutzerklärung</a> habe ich zur Kenntnis genommen.',
      'f.consent2': 'Ich bin mit der Zusendung von Neuigkeiten zum Projekt per E-Mail einverstanden. Die Einwilligung kann ich jederzeit widerrufen. <i>(optional)</i>',
      'f.fine': 'Wir verwenden Ihre Daten nur zur Kontaktaufnahme im Zusammenhang mit dem Projekt P6. Wir geben sie nicht zu Werbezwecken an Dritte weiter.',
      'foot.about': 'Städtisches Wohnen im Bratislavaer Stadtteil Ružinov. Miletička-Markt, Schule, Geschäftsviertel, Nivy und das neue Stadtzentrum in natürlicher Reichweite.',
      'foot.sales': 'Verkauf', 'foot.hours': 'Mo bis Fr, 9:00 bis 18:00 Uhr', 'foot.page': 'Seite', 'foot.reg': 'Registrierung für Interessenten',
      'foot.legal': 'Rechtliches',
      'legal.privacy': 'Datenschutzerklärung', 'legal.cookies': 'Cookie-Richtlinie', 'legal.consent': 'Einwilligung in die Datenverarbeitung',
      'legal.terms': 'Nutzungsbedingungen und Impressum', 'legal.cookieset': 'Cookie-Einstellungen',
      'legal.back': 'Zurück zur Startseite', 'legal.eyebrow': 'Rechtliche Informationen',
      'foot.rights': 'Alle Rechte vorbehalten.',
      'foot.disclaimer': 'Visualisierungen dienen der Illustration. Flächen, Zeiten und Entfernungen sind Richtwerte. Es handelt sich um die Rekonstruktion eines bestehenden Skeletts; der Investor behält sich Änderungen vor. Die Informationen auf dieser Website stellen weder ein Vertragsangebot noch eine Auslobung dar.',
      'sticky.text': 'Vorrangige Wohnungsauswahl<span class="sticky__more"> vor dem Verkaufsstart</span>'
    }
  };

  var LOCALE = { sk: 'sk-SK', en: 'en-GB', de: 'de-DE' };
  var OG = { sk: 'sk_SK', en: 'en_GB', de: 'de_DE' };

  function t(key, vars) {
    var s = (JS[L.current] && JS[L.current][key]) || (PAGE[L.current] && PAGE[L.current][key]) || JS.sk[key] || '';
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }

  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  function setContent(el, html) {
    if (el instanceof SVGElement) el.textContent = html;
    else el.innerHTML = html;
  }

  function apply(lang) {
    var dict = PAGE[lang] || {};
    $$('[data-i18n]').forEach(function (el) {
      if (el.__sk === undefined) el.__sk = (el instanceof SVGElement) ? el.textContent : el.innerHTML;
      var v = lang === 'sk' ? el.__sk : dict[el.getAttribute('data-i18n')];
      setContent(el, v === undefined ? el.__sk : v);
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      if (!el.__skAttr) el.__skAttr = {};
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':'), attr = p[0].trim(), key = p[1].trim();
        if (el.__skAttr[attr] === undefined) el.__skAttr[attr] = el.getAttribute(attr) || '';
        var v = lang === 'sk' ? el.__skAttr[attr] : dict[key];
        el.setAttribute(attr, v === undefined ? el.__skAttr[attr] : v);
      });
    });

    // the index page owns its <title>; legal pages take theirs from the visible <h1>
    var h1 = document.querySelector('[data-lang="' + lang + '"] h1');
    if (h1) document.title = h1.textContent + ' | P6';
    else if (document.querySelector('[data-hero]')) {
      document.title = JS[lang]['meta.title'];
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', JS[lang]['meta.desc']);
    }
    var og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute('content', OG[lang]);

    $$('[data-langs] [data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    fillConfig(lang);
  }

  /* --- legal documents: operator details come from config.js ---------------------------------- */
  function cfgValue(path) {
    if (path === 'tracking.any') {
      var tr = cfg.tracking || {};
      return (tr.ga4 || tr.googleAds || tr.metaPixel) ? '1' : '';
    }
    if (path === 'tracking.google') {
      var g = cfg.tracking || {};
      return (g.ga4 || g.googleAds) ? '1' : '';
    }
    return path.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : ''; }, cfg);
  }

  function fillConfig() {
    $$('[data-cfg]').forEach(function (el) {
      var path = el.getAttribute('data-cfg');
      var host = el.closest('[data-lang]');
      var lang = host ? host.getAttribute('data-lang') : L.current;
      var v = cfgValue(path);
      if (path === 'legal.effective' && v) {
        var d = new Date(v + 'T12:00:00');
        if (!isNaN(d)) v = d.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' });
      }
      if (v !== '' && v !== null && v !== undefined) {
        el.textContent = v;
        if (el.tagName === 'A' && path === 'legal.email') el.href = 'mailto:' + v;
      } else {
        el.innerHTML = '<mark>[' + JS[lang]['cfg.missing'] + ': ' + (el.getAttribute('data-cfg-label') || path) + ']</mark>';
      }
    });
    $$('[data-cfg-if]').forEach(function (el) { el.hidden = !cfgValue(el.getAttribute('data-cfg-if')); });
    $$('[data-cfg-unless]').forEach(function (el) { el.hidden = !!cfgValue(el.getAttribute('data-cfg-unless')); });
  }

  function setLang(lang, remember) {
    if (L.supported.indexOf(lang) < 0) return;
    L.current = lang;
    root.lang = lang;
    if (remember) { try { localStorage.setItem('p6_lang', lang); } catch (e) { /* storage blocked */ } }
    apply(lang);
    root.classList.remove('lang-pending');
    document.dispatchEvent(new CustomEvent('p6:lang', { detail: { lang: lang } }));
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-langs] [data-lang]');
    if (!b) return;
    L.source = 'choice';
    setLang(b.getAttribute('data-lang'), true);
    try {
      var u = new URL(location.href);
      if (u.searchParams.has('lang')) { u.searchParams.set('lang', L.current); history.replaceState(null, '', u); }
    } catch (err) { /* old browser */ }
  });

  window.P6I18N = { t: t, setLang: setLang, get lang() { return L.current; } };

  // an explicit ?lang= is a choice: keep it for the legal pages the visitor opens next
  setLang(L.current, L.source === 'url');

  /* --- optional IP-based refinement, only when the host provides an endpoint ------------------- */
  if (cfg.geoEndpoint && L.source === 'location' && window.fetch) {
    fetch(cfg.geoEndpoint, { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.country || L.source !== 'location') return;
        var byIp = L.fromCountry(j.country);
        if (byIp !== 'sk' && L.browserIsSlovak()) byIp = 'sk';
        if (byIp && byIp !== L.current) setLang(byIp, false);
      })
      .catch(function () { /* keep the time-zone guess */ });
  }
})();
