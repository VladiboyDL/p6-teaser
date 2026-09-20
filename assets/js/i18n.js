/* P6 teaser — translations (EN, DE, UK) and the SK / EN / DE / UA switcher.
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
      'meta.desc': 'Pripravujeme 44 bytov v bratislavskom Ružinove, medzi Miletičkou a novým downtownom. Zaregistrujte sa a získajte prístup k predpredaju prvých bytov za úvodné ceny.',
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
      'meta.desc': '44 new apartments coming to Bratislava-Ružinov, between the Miletička market and the new downtown. Register for access to the pre-sale of the first apartments at introductory prices.',
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
      'meta.desc': '44 neue Wohnungen in Bratislava-Ružinov, zwischen dem Miletička-Markt und der neuen Downtown. Registrieren Sie sich für den Zugang zum Vorverkauf der ersten Wohnungen zu Einführungspreisen.',
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
    },
    uk: {
      'meta.title': 'P6 | Незабаром. Дім між ринком Мілетічка і Downtown',
      'meta.desc': '44 нові квартири в братиславському районі Ружинов, між ринком Мілетічка та новим центром міста. Зареєструйтеся, щоб отримати доступ до передпродажу перших квартир за стартовими цінами.',
      'err.first': 'Будь ласка, вкажіть ім’я.',
      'err.last': 'Будь ласка, вкажіть прізвище.',
      'err.email': 'Вкажіть дійсну адресу електронної пошти.',
      'err.phone': 'Перевірте номер телефону.',
      'err.consent': 'Без вашої згоди на обробку даних ми не можемо з вами зв’язатися.',
      'err.send': 'Не вдалося надіслати форму. Спробуйте ще раз або напишіть нам на {email}.',
      'sending': 'Надсилаємо…',
      'done.title': 'Дякуємо, ви у списку',
      'done.text': 'Ми зв’яжемося з вами одними з перших, щойно будуть готові планування та прайс-лист.',
      'done.mail.title': 'Ще один крок',
      'done.mail.text': 'Ми відкрили вашу поштову програму з підготовленим листом. Просто надішліть його, і ви у списку.',
      'ck.title': 'Файли cookie',
      'ck.text': 'Необхідні файли cookie забезпечують роботу сайту. За вашою згодою ми також використовуємо аналітичні та маркетингові cookie, щоб покращувати сайт і вимірювати рекламу. Свій вибір ви можете будь-коли змінити.',
      'ck.more': 'Політика щодо файлів cookie',
      'ck.accept': 'Прийняти всі',
      'ck.reject': 'Відхилити',
      'ck.settings': 'Налаштування',
      'ck.save': 'Зберегти вибір',
      'ck.set.title': 'Налаштування cookie',
      'ck.always': 'завжди активні',
      'ck.nec': 'Необхідні',
      'ck.nec.d': 'Запам’ятовують ваш вибір щодо cookie та мову. Без них сайт не працює належним чином, тому їх не можна вимкнути.',
      'ck.ana': 'Аналітичні',
      'ck.ana.d': 'Анонімізована статистика відвідувань, яка допомагає нам покращувати сайт (Google Analytics).',
      'ck.mkt': 'Маркетингові',
      'ck.mkt.d': 'Вимірювання ефективності реклами та її показ на інших сайтах (Google Ads, Meta).',
      'ck.close': 'Закрити',
      'cfg.missing': 'заповнити'
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
      'hero.sub': '44 apartments in Bratislava’s Ružinov district. The market, school, work, Nivy and the city’s new centre, all within natural reach. Register to get access to the pre-sale of the first apartments at introductory prices.',
      'hero.cta': 'Get pre-sale access', 'hero.cta2': 'Discover the project',
      'hero.facts.aria': 'The project at a glance',
      'fact.flats': 'apartments', 'fact.rooms.n': '1 to 3', 'fact.rooms': 'rooms', 'fact.area.n': '30 to 78', 'fact.area': 'm² floor area',
      'viz': 'Visualisation', 'hero.cue': 'Continue to the project',
      'about.eyebrow': 'About the project',
      'about.title': 'A calm house<br>in a&nbsp;dynamic<br>part of the city',
      'about.lede': 'P6 is urban living in Ružinov, where the Miletička neighbourhood meets the new downtown. The original structure of the building gets a second life: 44 apartments, green balconies and a roof terrace for all residents.',
      'about.p1': 'One- to three-room apartments from 30 to 78&nbsp;m², each with its own balcony. Large windows, clear layouts and privacy where you will actually use it.',
      'about.p2': 'A home for people who want work, school, the market and the centre at the right distance. And who would rather spend less time commuting and more on what matters to them.',
      'about.link': 'Get pre-sale access',
      'about.alt': 'Visualisation of the P6 street façade: five storeys, balconies with greenery, light panels and a roof terrace',
      'about.cap': 'Visualisation · street façade',
      'fig.area': 'm² apartment floor area', 'fig.floors': 'storeys above ground',
      'loc.eyebrow': 'Location',
      'loc.title': 'Everything that matters<br>at the right <em>distance</em>',
      'loc.lede': 'Mlynské nivy and its surroundings form Bratislava’s main business district. The Miletičova market, school, Nivy and the Danube embankment are all within walking or cycling distance.',
      'd1.n': '1 min', 'd1': 'on foot to the business district',
      'd2.n': '2 min', 'd2': 'on foot to public transport',
      'd3.n': '7 min', 'd3': 'on foot to primary and grammar school',
      'd4.n': '13 min', 'd4': 'on foot to the Miletičova market',
      'd5.n': 'within 1.5 km', 'd5': 'Nivy, Twin City, CBC, Sky Park',
      'd6.n': '15 to 20 min', 'd6': 'by car to Bratislava Airport',
      'map.aria': 'Map of the P6 surroundings with 5-, 10- and 15-minute walking rings: Miletičova market, Novohradská school, Nivy station, Sky Park, Eurovea and the Danube',
      'map.danube': 'DANUBE', 'map.r5': '5 MIN WALK', 'map.r10': '10 MIN', 'map.r15': '15 MIN', 'map.oldtown': 'OLD TOWN',
      'map.market': 'Miletičova Market', 'map.school': 'School', 'map.nivy': 'Nivy Station',
      'map.bridge': 'Apollo Bridge', 'map.lake': '↑ Štrkovec Lake', 'map.airport': 'Airport 16 min →', 'map.stadium': '↑ Ice Stadium',
      'map.credit': 'Map data ©',
      'map.cap': 'The project location is shown approximately. The rings show approximate walking reach; times in the list are measured along real routes.',
      'perks.eyebrow': 'Benefits', 'perks.title': 'What will P6 bring?',
      'perk.1': 'A balcony with every apartment',
      'perk.2': 'Shared roof terrace',
      'perk.3': 'Parking next to the building',
      'perk.4': 'Public transport 2 minutes on foot',
      'perk.5': 'Primary and grammar school 7 minutes on foot',
      'perk.6': 'Miletičova market 13 minutes on foot',
      'perk.7': 'Business district and Nivy within walking distance',
      'perk.8': 'Airport 15 to 20 minutes by car',
      'perks.note': 'The project is in preparation. The details shown are preliminary and may change in line with the final permits and project documentation. The finish standard and the fit-out of shared spaces will be specified before sales open.',
      'gal.eyebrow': 'First visualisations',
      'gal.title': 'Home does not end<br>at your front door',
      'gal.lede': 'Bright apartments with a balcony facing where you will use it. And above them a shared terrace for a chat, a rest or a quiet evening above the city.',
      'gal.alt1': 'Visualisation of a living room opening onto a balcony, a bright interior with a wooden floor',
      'gal.alt2': 'Visualisation of the shared roof terrace after sunset: pergolas, greenery and seating',
      'gal.alt3': 'Visualisation of a bedroom with a floor-to-ceiling window and a view of greenery',
      'gal.cap1': 'Visualisation · living room', 'gal.cap2': 'Visualisation · roof terrace', 'gal.cap3': 'Visualisation · bedroom',
      'steps.eyebrow': 'How it works',
      'steps.title': 'Three steps to an apartment<br>at an introductory price',
      'step1.t': 'You register', 'step1.p': 'Fill in a short form. It takes a minute and commits you to nothing.', 'step1.tag': 'Open now',
      'step2.t': 'We contact you first', 'step2.p': 'You receive the pre-sale offer with floor plans and introductory prices before we publish it.', 'step2.tag': 'Before the offer goes public',
      'step3.t': 'You choose in the pre-sale', 'step3.p': 'At a personal consultation you choose from the apartments released for the pre-sale. Further apartments will go on sale in stages.', 'step3.tag': 'Pre-sale',
      'reg.eyebrow': 'Register your interest',
      'reg.title': 'Pre-sale of the first apartments <em>at introductory prices</em>',
      'reg.lede': 'We release apartments for sale in stages. The pre-sale opens a limited number of selected apartments at introductory prices, and registered buyers hear about it first. Whether you are looking for a home or an investment, let us know in the form.',
      'reg.t1': 'the pre-sale offer before we publish it', 'reg.t2': 'introductory prices that apply to the pre-sale only', 'reg.t3': 'a personal consultation with no obligation',
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
      'sticky.text': 'Pre-sale of the first apartments<span class="sticky__more"> at introductory prices</span>'
    },
    de: {
      'skip': 'Zum Inhalt springen',
      'nav.aria': 'Hauptnavigation',
      'nav.project': 'Projekt', 'nav.location': 'Lage', 'nav.perks': 'Vorteile', 'nav.steps': 'So funktioniert es',
      'cta.interest': 'Ich bin interessiert',
      'hero.alt': 'Visualisierung des Wohnhauses P6: fünf Geschosse mit begrünten Balkonen und Dachterrasse',
      'hero.status': 'In Vorbereitung · Bratislava-Ružinov',
      'hero.title': '<span class="line"><span>Zuhause zwischen</span></span><span class="line"><span>Miletička-Markt</span></span><span class="line"><span>und&nbsp;<em>Downtown</em></span></span>',
      'hero.sub': '44 Wohnungen im Bratislavaer Stadtteil Ružinov. Markt, Schule, Arbeit, Nivy und das neue Stadtzentrum in natürlicher Reichweite. Registrieren Sie sich und erhalten Sie Zugang zum Vorverkauf der ersten Wohnungen zu Einführungspreisen.',
      'hero.cta': 'Zugang zum Vorverkauf sichern', 'hero.cta2': 'Projekt entdecken',
      'hero.facts.aria': 'Das Projekt in Kürze',
      'fact.flats': 'Wohnungen', 'fact.rooms.n': '1 bis 3', 'fact.rooms': 'Zimmer', 'fact.area.n': '30 bis 78', 'fact.area': 'm² Wohnfläche',
      'viz': 'Visualisierung', 'hero.cue': 'Weiter zum Projekt',
      'about.eyebrow': 'Über das Projekt',
      'about.title': 'Ein ruhiges Haus<br>in einem dynamischen<br>Teil der Stadt',
      'about.lede': 'P6 ist städtisches Wohnen in Ružinov, an der Schnittstelle zwischen dem Miletička-Viertel und der neuen Downtown. Das ursprüngliche Skelett des Gebäudes bekommt ein zweites Leben: 44 Wohnungen, begrünte Balkone und eine Dachterrasse für alle Bewohner.',
      'about.p1': 'Ein- bis Dreizimmerwohnungen von 30 bis 78&nbsp;m², jede mit eigenem Balkon. Große Fenster, klare Grundrisse und Privatsphäre dort, wo Sie sie wirklich nutzen.',
      'about.p2': 'Wohnen für Menschen, die Arbeit, Schule, Markt und Zentrum in der richtigen Entfernung haben möchten. Und die weniger Zeit unterwegs und mehr Zeit mit dem verbringen wollen, was ihnen wichtig ist.',
      'about.link': 'Zugang zum Vorverkauf sichern',
      'about.alt': 'Visualisierung der Straßenfassade von P6: fünf Geschosse, begrünte Balkone, helle Paneele und Dachterrasse',
      'about.cap': 'Visualisierung · Straßenfassade',
      'fig.area': 'm² Wohnfläche der Wohnungen', 'fig.floors': 'oberirdische Geschosse',
      'loc.eyebrow': 'Lage',
      'loc.title': 'Alles Wesentliche<br>in der richtigen <em>Entfernung</em>',
      'loc.lede': 'Mlynské nivy und Umgebung bilden das wichtigste Geschäftsviertel Bratislavas. Der Markt Miletičova, die Schule, Nivy und das Donauufer sind zu Fuß oder mit dem Fahrrad erreichbar.',
      'd1.n': '1 Min.', 'd1': 'zu Fuß ins Geschäftsviertel',
      'd2.n': '2 Min.', 'd2': 'zu Fuß zur ÖPNV-Haltestelle',
      'd3.n': '7 Min.', 'd3': 'zu Fuß zu Grundschule und Gymnasium',
      'd4.n': '13 Min.', 'd4': 'zu Fuß zum Markt Miletičova',
      'd5.n': 'bis 1,5 km', 'd5': 'Nivy, Twin City, CBC, Sky Park',
      'd6.n': '15 bis 20 Min.', 'd6': 'mit dem Auto zum Flughafen Bratislava',
      'map.aria': 'Karte der Umgebung von P6 mit Gehzeit-Ringen für 5, 10 und 15 Minuten: Markt Miletičova, Schule Novohradská, Busbahnhof Nivy, Sky Park, Eurovea und Donau',
      'map.danube': 'DONAU', 'map.r5': '5 MIN. ZU FUSS', 'map.r10': '10 MIN.', 'map.r15': '15 MIN.', 'map.oldtown': 'ALTSTADT',
      'map.market': 'Markt Miletičova', 'map.school': 'Schule', 'map.nivy': 'Busbahnhof Nivy',
      'map.bridge': 'Apollo-Brücke', 'map.lake': '↑ Štrkovec-See', 'map.airport': 'Flughafen 16 Min. →', 'map.stadium': '↑ Eisstadion',
      'map.credit': 'Kartendaten ©',
      'map.cap': 'Die Lage des Projekts ist ungefähr eingezeichnet. Die Ringe zeigen die ungefähre fußläufige Erreichbarkeit; die Zeiten in der Liste wurden auf realen Wegen gemessen.',
      'perks.eyebrow': 'Vorteile', 'perks.title': 'Was bringt P6?',
      'perk.1': 'Ein Balkon zu jeder Wohnung',
      'perk.2': 'Gemeinschaftliche Dachterrasse',
      'perk.3': 'Parkplätze am Haus',
      'perk.4': 'ÖPNV-Haltestelle 2 Minuten zu Fuß',
      'perk.5': 'Grundschule und Gymnasium 7 Minuten zu Fuß',
      'perk.6': 'Markt Miletičova 13 Minuten zu Fuß',
      'perk.7': 'Geschäftsviertel und Nivy in Gehweite',
      'perk.8': 'Flughafen 15 bis 20 Minuten mit dem Auto',
      'perks.note': 'Das Projekt befindet sich in Vorbereitung. Die angegebenen Daten sind vorläufig und können sich entsprechend den rechtskräftigen Genehmigungen und der endgültigen Projektdokumentation ändern. Ausführungsstandard und Ausstattung der Gemeinschaftsräume präzisieren wir vor dem Verkaufsstart.',
      'gal.eyebrow': 'Erste Visualisierungen',
      'gal.title': 'Zuhause endet nicht<br>an Ihrer Wohnungstür',
      'gal.lede': 'Helle Wohnungen mit einem Balkon, der dorthin ausgerichtet ist, wo Sie ihn nutzen. Und darüber eine gemeinsame Terrasse für ein Gespräch, eine Pause oder einen ruhigen Abend über der Stadt.',
      'gal.alt1': 'Visualisierung eines Wohnzimmers mit Zugang zum Balkon, helles Interieur mit Holzboden',
      'gal.alt2': 'Visualisierung der gemeinschaftlichen Dachterrasse nach Sonnenuntergang: Pergolen, Grün und Sitzgelegenheiten',
      'gal.alt3': 'Visualisierung eines Schlafzimmers mit bodentiefem Fenster und Blick ins Grüne',
      'gal.cap1': 'Visualisierung · Wohnzimmer', 'gal.cap2': 'Visualisierung · Dachterrasse', 'gal.cap3': 'Visualisierung · Schlafzimmer',
      'steps.eyebrow': 'So funktioniert es',
      'steps.title': 'Drei Schritte zur Wohnung<br>zum Einführungspreis',
      'step1.t': 'Sie registrieren sich', 'step1.p': 'Sie füllen ein kurzes Formular aus. Das dauert eine Minute und verpflichtet Sie zu nichts.', 'step1.tag': 'Läuft gerade',
      'step2.t': 'Wir melden uns zuerst bei Ihnen', 'step2.p': 'Das Vorverkaufsangebot mit Grundrissen und Einführungspreisen erhalten Sie, bevor wir es veröffentlichen.', 'step2.tag': 'Vor Veröffentlichung des Angebots',
      'step3.t': 'Sie wählen im Vorverkauf', 'step3.p': 'In einem persönlichen Beratungsgespräch wählen Sie aus den Wohnungen, die für den Vorverkauf freigegeben sind. Weitere Wohnungen kommen schrittweise in den Verkauf.', 'step3.tag': 'Vorverkauf',
      'reg.eyebrow': 'Registrierung für Interessenten',
      'reg.title': 'Vorverkauf der ersten Wohnungen <em>zu Einführungspreisen</em>',
      'reg.lede': 'Wir geben die Wohnungen schrittweise in den Verkauf. Der Vorverkauf öffnet eine begrenzte Anzahl ausgewählter Wohnungen zu Einführungspreisen, und registrierte Interessenten erfahren als Erste davon. Ob Sie ein eigenes Zuhause oder eine Kapitalanlage suchen, teilen Sie es uns im Formular mit.',
      'reg.t1': 'das Vorverkaufsangebot vor der Veröffentlichung', 'reg.t2': 'Einführungspreise, die nur im Vorverkauf gelten', 'reg.t3': 'unverbindliche persönliche Beratung',
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
      'sticky.text': 'Vorverkauf der ersten Wohnungen<span class="sticky__more"> zu Einführungspreisen</span>'
    },
    uk: {
      'skip': 'Перейти до вмісту',
      'nav.aria': 'Головна навігація',
      'nav.project': 'Проєкт', 'nav.location': 'Розташування', 'nav.perks': 'Переваги', 'nav.steps': 'Як це працює',
      'cta.interest': 'Мені цікаво',
      'hero.alt': 'Візуалізація житлового будинку P6: п’ять поверхів із зеленими балконами та терасою на даху',
      'hero.status': 'Незабаром · Братислава-Ружинов',
      'hero.title': '<span class="line"><span>Дім між</span></span><span class="line"><span>ринком Мілетічка</span></span><span class="line"><span>і&nbsp;<em>Downtown</em></span></span>',
      'hero.sub': '44 квартири у братиславському районі Ружинов. Ринок, школа, робота, Nivy та новий центр Братислави на зручній відстані. Зареєструйтеся та отримайте доступ до передпродажу перших квартир за стартовими цінами.',
      'hero.cta': 'Хочу доступ до передпродажу', 'hero.cta2': 'Дізнатися про проєкт',
      'hero.facts.aria': 'Проєкт коротко',
      'fact.flats': 'квартири', 'fact.rooms.n': '1–3', 'fact.rooms': 'кімнати', 'fact.area.n': '30–78', 'fact.area': 'м² площі',
      'viz': 'Візуалізація', 'hero.cue': 'Перейти до проєкту',
      'about.eyebrow': 'Про проєкт',
      'about.title': 'Спокійний дім<br>у&nbsp;динамічній<br>частині міста',
      'about.lede': 'Проєкт P6 пропонує міське житло в Ружинові, на межі кварталу Мілетічка та нового Downtown. Оригінальний каркас будівлі отримує друге життя: 44 квартири, зелені балкони та тераса на даху для всіх мешканців.',
      'about.p1': 'Квартири від однієї до трьох кімнат площею від 30 до 78&nbsp;м², кожна з власним балконом. Великі вікна, зрозумілі планування та приватність там, де вона справді потрібна.',
      'about.p2': 'Житло для людей, які хочуть мати роботу, школу, ринок і центр на правильній відстані. І витрачати менше часу на дорогу, а більше на те, що для них важливо.',
      'about.link': 'Отримати доступ до передпродажу',
      'about.alt': 'Візуалізація вуличного фасаду P6: п’ять поверхів, балкони із зеленню, світлі панелі та тераса на даху',
      'about.cap': 'Візуалізація · вуличний фасад',
      'fig.area': 'м² площа квартир', 'fig.floors': 'надземних поверхів',
      'loc.eyebrow': 'Розташування',
      'loc.title': 'Усе важливе<br>на правильній <em>відстані</em>',
      'loc.lede': 'Mlynské nivy та околиці утворюють головний діловий район Братислави. Ринок Miletičova, школа, Nivy та набережна Дунаю поруч: пішки або на велосипеді.',
      'd1.n': '1 хв', 'd1': 'пішки до ділового району',
      'd2.n': '2 хв', 'd2': 'пішки до зупинки громадського транспорту',
      'd3.n': '7 хв', 'd3': 'пішки до школи та гімназії',
      'd4.n': '13 хв', 'd4': 'пішки до ринку Miletičova',
      'd5.n': 'до 1,5 км', 'd5': 'Nivy, Twin City, CBC, Sky Park',
      'd6.n': '15–20 хв', 'd6': 'автомобілем до аеропорту Братислави',
      'map.aria': 'Карта околиць P6 із колами пішої доступності 5, 10 і 15 хвилин: ринок Miletičova, школа, автовокзал Nivy, Sky Park, Eurovea та Дунай',
      'map.danube': 'ДУНАЙ', 'map.r5': '5 ХВ ПІШКИ', 'map.r10': '10 ХВ', 'map.r15': '15 ХВ', 'map.oldtown': 'СТАРЕ МІСТО',
      'map.market': 'Ринок Miletičova', 'map.school': 'Школа', 'map.nivy': 'Автовокзал Nivy',
      'map.bridge': 'Міст Аполло', 'map.lake': '↑ Озеро Štrkovec', 'map.airport': 'Аеропорт 16 хв →', 'map.stadium': '↑ Зимовий стадіон',
      'map.cap': 'Розташування проєкту позначено орієнтовно. Кола показують приблизну пішу доступність, час у списку виміряно за реальними маршрутами.',
      'map.credit': 'Картографічні дані ©',
      'perks.eyebrow': 'Переваги', 'perks.title': 'Що пропонує P6?',
      'perk.1': 'Балкон у кожній квартирі',
      'perk.2': 'Спільна тераса на даху',
      'perk.3': 'Паркування біля будинку',
      'perk.4': 'Зупинка громадського транспорту за 2 хвилини пішки',
      'perk.5': 'Школа та гімназія за 7 хвилин пішки',
      'perk.6': 'Ринок Miletičova за 13 хвилин пішки',
      'perk.7': 'Діловий район і Nivy в пішій доступності',
      'perk.8': 'Аеропорт за 15–20 хвилин автомобілем',
      'perks.note': 'Проєкт перебуває на стадії підготовки. Наведені дані є попередніми і можуть змінитися відповідно до чинних дозволів та остаточної проєктної документації. Стандарт оздоблення та обладнання спільних просторів ми уточнимо до початку продажу.',
      'gal.eyebrow': 'Перші візуалізації',
      'gal.title': 'Дім не закінчується<br>за вашими дверима',
      'gal.lede': 'Світлі квартири з балконом, зорієнтованим туди, де ви ним справді користуватиметеся. А над ними спільна тераса для розмови, відпочинку чи спокійного вечора над містом.',
      'gal.alt1': 'Візуалізація вітальні з виходом на балкон, світлий інтер’єр із дерев’яною підлогою',
      'gal.alt2': 'Візуалізація спільної тераси на даху після заходу сонця: перголи, зелень і місця для відпочинку',
      'gal.alt3': 'Візуалізація спальні з вікном від підлоги до стелі та видом на зелень',
      'gal.cap1': 'Візуалізація · вітальня', 'gal.cap2': 'Візуалізація · тераса на даху', 'gal.cap3': 'Візуалізація · спальня',
      'steps.eyebrow': 'Як це працює',
      'steps.title': 'Три кроки до квартири<br>за стартовою ціною',
      'step1.t': 'Ви реєструєтеся', 'step1.p': 'Заповнюєте коротку форму. Це займе хвилину і ні до чого вас не зобов’язує.', 'step1.tag': 'Триває зараз',
      'step2.t': 'Ми зв’яжемося з вами першими', 'step2.p': 'Пропозицію передпродажу з плануваннями та стартовими цінами ви отримаєте раніше, ніж ми її опублікуємо.', 'step2.tag': 'До публікації пропозиції',
      'step3.t': 'Ви обираєте на передпродажі', 'step3.p': 'На особистій консультації ви оберете квартиру з тих, що відкриті для передпродажу. Інші квартири надходитимуть у продаж поетапно.', 'step3.tag': 'Передпродаж',
      'reg.eyebrow': 'Реєстрація зацікавлених',
      'reg.title': 'Передпродаж перших квартир <em>за стартовими цінами</em>',
      'reg.lede': 'Ми відкриваємо квартири для продажу поетапно. На передпродажі буде доступна обмежена кількість обраних квартир за стартовими цінами, і першими про нього дізнаються зареєстровані. Шукаєте житло для себе чи інвестицію, зазначте це у формі.',
      'reg.t1': 'пропозиція передпродажу раніше, ніж ми її опублікуємо', 'reg.t2': 'стартові ціни, які діють лише на передпродажі', 'reg.t3': 'особиста консультація без зобов’язань',
      'f.first': 'Ім’я', 'f.first.ph': 'Ваше ім’я', 'f.last': 'Прізвище', 'f.last.ph': 'Ваше прізвище',
      'f.email': 'E-mail', 'f.email.ph': 'vasha@poshta.com', 'f.phone': 'Телефон <i>(необов’язково)</i>',
      'f.type': 'Яка квартира вас цікавить?', 'f.type1': '1-кімнатна', 'f.type2': '2-кімнатна', 'f.type3': '3-кімнатна', 'f.type0': 'Ще не знаю',
      'f.purpose': 'Шукаю квартиру для <i>(необов’язково)</i>', 'f.purpose1': 'Власного проживання', 'f.purpose2': 'Інвестиції',
      'f.source': 'Звідки ви дізналися про P6? <i>(необов’язково)</i>',
      'f.src0': 'Оберіть', 'f.src1': 'Пошук у Google', 'f.src2': 'Соціальні мережі', 'f.src3': 'Онлайн-реклама', 'f.src4': 'Портал нерухомості',
      'f.src5': 'Реклама на будівництві', 'f.src6': 'Рекомендація знайомих', 'f.src7': 'Інше',
      'f.msg': 'Повідомлення <i>(необов’язково)</i>', 'f.msg.ph': 'Наприклад, бажаний поверх або орієнтація',
      'f.consent1': 'Я даю <a href="suhlas-so-spracovanim.html" target="_blank" rel="noopener">згоду на обробку персональних даних</a> з метою зв’язку зі мною щодо проєкту P6. Я ознайомився(-лась) з <a href="ochrana-osobnych-udajov.html" target="_blank" rel="noopener">інформацією про захист персональних даних</a>.',
      'f.consent2': 'Я погоджуюся отримувати новини про проєкт електронною поштою. Згоду можу будь-коли відкликати. <i>(необов’язково)</i>',
      'f.fine': 'Ваші дані ми використаємо лише для зв’язку щодо проєкту P6. Ми не передаємо їх третім особам для рекламних цілей.',
      'foot.about': 'Міське житло у братиславському районі Ружинов. Ринок Мілетічка, школа, діловий район, Nivy та новий центр Братислави на зручній відстані.',
      'foot.sales': 'Продаж', 'foot.hours': 'Пн–Пт, 9:00–18:00', 'foot.page': 'Сторінка', 'foot.reg': 'Реєстрація зацікавлених',
      'foot.legal': 'Правова інформація',
      'legal.privacy': 'Захист персональних даних', 'legal.cookies': 'Політика щодо файлів cookie', 'legal.consent': 'Згода на обробку даних',
      'legal.terms': 'Умови користування та оператор сайту', 'legal.cookieset': 'Налаштування cookie',
      'legal.back': 'Назад на головну', 'legal.eyebrow': 'Правова інформація',
      'foot.rights': 'Усі права захищено.',
      'foot.disclaimer': 'Візуалізації мають ілюстративний характер. Площі, час і відстані є орієнтовними. Проєкт є реконструкцією наявного каркаса будівлі, інвестор залишає за собою право на зміни. Інформація на сайті не є пропозицією укласти договір ані публічною обіцянкою.',
      'sticky.text': 'Передпродаж перших квартир<span class="sticky__more"> за стартовими цінами</span>'
    }
  };

  var LOCALE = { sk: 'sk-SK', en: 'en-GB', de: 'de-DE', uk: 'uk-UA' };
  var OG = { sk: 'sk_SK', en: 'en_GB', de: 'de_DE', uk: 'uk_UA' };

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
        var h = L.heritage ? L.heritage() : null;
        if (h === 'uk') byIp = 'uk';
        else if (byIp !== 'sk' && h === 'sk') byIp = 'sk';
        if (byIp && byIp !== L.current) setLang(byIp, false);
      })
      .catch(function () { /* keep the time-zone guess */ });
  }
})();
