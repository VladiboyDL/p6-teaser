/* P6 teaser, motion layer: smooth scroll, intro, scroll choreography, map tour.
   Needs GSAP 3 with ScrollTrigger, SplitText, DrawSVGPlugin and MotionPathPlugin (all in assets/vendor/).
   Scrolling stays native on purpose: it runs at the screen's own refresh rate (120 Hz on ProMotion), a JS scroller does not.
   Runs only when motion-boot.js set html.motion. Loads before teaser.js because it takes over the .reveal elements.
   Copy is never changed: text is only split into lines or letters for animation and re-split after a language switch. */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || !window.DrawSVGPlugin || !window.MotionPathPlugin) {
    root.classList.remove('motion', 'intro');
    return;
  }
  var blocks = [];
  window.P6Motion = { blocks: blocks };
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin);

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var mq = function (q) { return window.matchMedia(q); };
  var fine = mq('(hover: hover) and (pointer: fine)').matches;
  var EASE = 'expo.out';
  var NS = 'http://www.w3.org/2000/svg';

  /* --- in-page links: native smooth scroll with the nav offset ------------------------- */
  var navOffset = function () { return (parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 76) + 8; };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]:not(.skip-link)');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href').slice(1), t = id ? document.getElementById(id) : null;
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : navOffset()), behavior: 'smooth' });
    if (history.pushState) history.pushState(null, '', '#' + id);
  });
  gsap.ticker.lagSmoothing(0);

  /* --- take over the reveal system (teaser.js finds none left) ------------------------ */
  $$('.reveal').forEach(function (el) { el.classList.remove('reveal'); });

  /* --- split helpers: always split from the clean source. i18n owns the HTML, so a split is reverted
     only after its current text has been captured, and the captured text is written back before the next split. */
  function source(el) {
    if (el.__src === undefined) el.__src = el.innerHTML;
    else el.innerHTML = el.__src;
  }
  function lines(b, el) {
    source(el);
    if (b.splitEls.indexOf(el) < 0) b.splitEls.push(el);
    var s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'm-line' });
    b.splits.push(s);
    return s.lines;
  }

  /* Blocks: a scroll-triggered timeline that can be rebuilt (language switch, width change).
     Once played, a rebuild jumps straight to the end. */
  function block(el, build, start) {
    var b = { el: el, played: false, tl: null, st: null, splits: [], splitEls: [] };
    b.run = function () {
      if (b.st) b.st.kill();
      if (b.tl) b.tl.kill();
      // capture the current text first (after a language switch it is fresh), then let the old splits revert
      b.splitEls.forEach(function (el) { if (el.__src === undefined) el.__src = el.innerHTML; });
      b.splits.forEach(function (s) { s.revert(); });
      b.splits = [];
      b.tl = gsap.timeline({ paused: true, defaults: { ease: EASE, duration: 1.1 } });
      build(b.tl, b);
      if (b.played) { b.tl.progress(1); return; }
      b.st = ScrollTrigger.create({ trigger: el, start: start || 'top 86%', once: true, onEnter: function () { b.played = true; b.tl.play(); } });
    };
    blocks.push(b);
    b.run();
    return b;
  }

  /* --- intro + hero ------------------------------------------------------------------- */
  var hero = $('[data-hero]');
  var heroImg = $('.hero__poster');
  var heroPic = $('.hero picture');
  var h1 = $('.hero__title');
  var sub = $('.hero__sub');
  var heroSplits = [];
  var heroPlayed = false;

  function heroText() {
    [h1, sub].forEach(function (el) { if (el.__src === undefined) el.__src = el.innerHTML; });
    heroSplits.forEach(function (s) { s.revert(); });
    heroSplits = [];
    source(h1);
    source(sub);
    var spans = $$('.line > span', h1);
    gsap.set(spans, { y: 0 });
    var c = SplitText.create(spans, { type: 'words,chars', charsClass: 'm-ch' });
    var l = SplitText.create(sub, { type: 'lines', mask: 'lines', linesClass: 'm-line' });
    heroSplits.push(c, l);
    return { chars: c.chars, lines: l.lines };
  }

  function countTo(el, to, dur) {
    var o = { v: 0 };
    return gsap.to(o, { v: to, duration: dur || 1.6, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  function heroIn() {
    var t = heroText();
    var facts = $$('.hero__facts li');
    var n44 = $('.hero__facts li:first-child b');
    var tl = gsap.timeline({ defaults: { ease: EASE }, onComplete: function () { heroPlayed = true; } });
    tl.fromTo(heroImg, { scale: 1.3 }, { scale: 1, duration: 2.6 }, 0)
      .from(t.chars, { yPercent: 120, rotate: 8, duration: 1.35, stagger: 0.022 }, 0.12)
      .fromTo('.status', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 0.05)
      .set(sub, { opacity: 1 }, 0.5)
      .from(t.lines, { yPercent: 105, duration: 1.15, stagger: 0.08 }, 0.5)
      .fromTo('.hero__actions', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1 }, 0.72)
      .fromTo(facts, { opacity: 0, x: 26 }, { opacity: 1, x: 0, duration: 1.1, stagger: 0.1 }, 0.85)
      .to('.hero__cue', { opacity: 1, duration: 0.8 }, 1.3);
    if (n44) tl.add(countTo(n44, 44, 1.8), 0.85);
    return tl;
  }

  function heroShow() { // after a language switch, or when the intro already ran
    var t = heroText();
    gsap.set(t.chars, { yPercent: 0, rotate: 0 });
    gsap.set(['.status', sub, '.hero__actions', '.hero__facts li', '.hero__cue'], { opacity: 1 });
  }

  function intro() {
    var el = $('div.intro');
    if (!el || !root.classList.contains('intro')) { gsap.delayedCall(0.05, heroIn); return; }
    var mark = $('.intro__mark', el);
    var count = $('.intro__count', el);
    $$('#p6 path').forEach(function (p) { mark.appendChild(p.cloneNode()); });
    var paths = $$('path', mark);
    el.style.animation = 'none';
    gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' });
    root.classList.add('m-lock');

    var ready = Promise.race([
      heroImg && heroImg.decode ? heroImg.decode().catch(function () {}) : Promise.resolve(),
      new Promise(function (r) { setTimeout(r, 1800); })
    ]);
    var n = { v: 0 };
    gsap.timeline({ onComplete: function () { ready.then(out); } })
      .from(paths, { drawSVG: '0%', duration: 1.2, ease: 'power2.inOut', stagger: 0.14 }, 0.1)
      .to(n, { v: 100, duration: 1.45, ease: 'power2.inOut', onUpdate: function () { count.textContent = ('00' + Math.round(n.v)).slice(-3); } }, 0)
      .to('.intro__bar', { scaleX: 1, duration: 1.45, ease: 'power2.inOut' }, 0)
      .to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: 0.5, ease: 'power1.out' }, 1.1);

    function out() {
      gsap.timeline({
        onComplete: function () {
          el.remove();
          root.classList.remove('intro');
          root.classList.remove('m-lock');
          try { sessionStorage.setItem('p6-intro', '1'); } catch (e) { /* fine */ }
        }
      })
        .to(mark, { scale: 0.82, opacity: 0, duration: 0.7, ease: 'power3.in' }, 0)
        .to(['.intro__meta', '.intro__bar'], { opacity: 0, duration: 0.4 }, 0)
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.15, ease: 'expo.inOut' }, 0.35)
        .add(heroIn(), 0.7);
    }
  }

  var dim = document.createElement('div');
  dim.className = 'hero__dim';
  dim.setAttribute('aria-hidden', 'true');
  $('.hero__media').appendChild(dim);
  /* hero leaves: image sinks slower than the page, darkens, copy lifts away */
  gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__media', { yPercent: 26, ease: 'none' }, 0)
    .to(dim, { opacity: 0.6, ease: 'none' }, 0)
    .to(heroPic, { scale: 1.1, ease: 'none' }, 0)
    .to('.hero__copy', { yPercent: -16, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero__facts', { yPercent: -34, opacity: 0, ease: 'power1.in' }, 0);

  if (fine) { // depth: image drifts against the mouse, copy a little with it
    var px = gsap.quickTo(heroPic, 'x', { duration: 1.2, ease: 'power3' });
    var py = gsap.quickTo(heroPic, 'y', { duration: 1.2, ease: 'power3' });
    var cx = gsap.quickTo('.hero__body', 'x', { duration: 1.4, ease: 'power3' });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      px(dx * -26); py(dy * -18); cx(dx * 10);
    });
    hero.addEventListener('pointerleave', function () { px(0); py(0); cx(0); });
  }

  /* --- text blocks ---------------------------------------------------------------------- */
  function textBlock(el) {
    var eb = $('.eyebrow', el);
    block(el, function (tl, b) {
      var h = $('h2', el);
      var ledes = $$('.lede', el);
      var rest = $$(':scope > p:not(.eyebrow):not(.lede), :scope > a, :scope > .reg__contact, :scope > ul > li', el);
      if (eb) {
        tl.fromTo(eb, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.9 }, 0);
        tl.call(function () { eb.classList.add('m-on'); }, null, 0);
      }
      if (h) tl.from(lines(b, h), { yPercent: 112, rotate: 2.2, transformOrigin: '0% 0%', duration: 1.3, stagger: 0.1 }, 0.06);
      ledes.forEach(function (l) { tl.from(lines(b, l), { yPercent: 105, duration: 1.1, stagger: 0.07 }, 0.32); });
      if (rest.length) tl.from(rest, { opacity: 0, y: 26, duration: 1, stagger: 0.07 }, 0.5);
    });
  }
  $$('.split__text, .loc__text, .head, .reg__text').forEach(textBlock);

  /* --- about: image opens up as it scrolls in ------------------------------------------------ */
  var sm = $('.split__media');
  if (sm) {
    gsap.fromTo(sm, { clipPath: 'inset(16% 14% 16% 14% round 6px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 6px)', ease: 'none', scrollTrigger: { trigger: sm, start: 'top 98%', end: 'top 30%', scrub: true } });
    gsap.fromTo($('img', sm), { scale: 1.38, yPercent: -5 },
      { scale: 1.08, yPercent: 5, ease: 'none', scrollTrigger: { trigger: sm, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* --- figures ---------------------------------------------------------------------------- */
  var figs = $('.figs');
  if (figs) {
    block(figs, function (tl) {
      tl.call(function () { figs.classList.add('m-on'); }, null, 0)
        .from($$(':scope > div', figs), { opacity: 0, y: 34, duration: 1.1, stagger: 0.1 }, 0.1);
      $$('[data-count]', figs).forEach(function (dd, i) {
        tl.add(countTo(dd, parseInt(dd.getAttribute('data-count'), 10), 1.7), 0.15 + i * 0.1);
      });
    }, 'top 88%');
  }

  /* --- location: zoom out from P6, list items light up their places ------------------------- */
  var map = $('[data-map]');
  var svg = map && $('svg', map);
  if (svg) {
    var C = { x: 405.4, y: 304.4 };
    var pois = $$('.map__poi', svg);
    var edges = $$('.map__edge', svg);
    var rings = $$('.radar__ring', svg);
    var p6 = $('.map__p6', svg);
    var distLis = $$('.dist li');
    var routesG = document.createElementNS(NS, 'g');
    routesG.setAttribute('class', 'map__routes');
    svg.insertBefore(routesG, p6);

    var mkRoute = function (x, y) {
      var dx = x - C.x, dy = y - C.y, len = Math.hypot(dx, dy), bend = Math.min(len * 0.2, 46);
      var mx = (C.x + x) / 2 - dy / len * bend, my = (C.y + y) / 2 + dx / len * bend;
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', 'M' + C.x + ' ' + C.y + 'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + x + ' ' + y);
      p.setAttribute('class', 'map__route');
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '3.4');
      dot.setAttribute('class', 'map__runner');
      routesG.appendChild(p);
      routesG.appendChild(dot);
      gsap.set(p, { drawSVG: '0%' });
      return { p: p, dot: dot, tw: null };
    };
    var at = function (g) { var c = $('circle', g); return [+c.getAttribute('cx'), +c.getAttribute('cy')]; };
    // .dist order: business zone, bus stop, school, market, Nivy + towers, airport
    var LINKS = [{ zone: 1 }, { ring: 0 }, { pois: [1] }, { pois: [0] }, { pois: [2, 3, 4, 5] }, { edge: 2, to: [606, 192] }];
    LINKS.forEach(function (L) {
      L.routes = (L.pois || []).map(function (k) { var a = at(pois[k]); return Object.assign(mkRoute(a[0], a[1]), { g: pois[k] }); });
      if (L.to) L.routes.push(Object.assign(mkRoute(L.to[0], L.to[1]), { g: edges[L.edge] }));
    });

    var visible = function (g) { return !g || getComputedStyle(g).display !== 'none'; };
    var active = -1;
    var on = function (L) {
      L.routes.forEach(function (r) {
        if (!visible(r.g)) return;
        gsap.fromTo(r.p, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'power3.inOut', overwrite: true });
        r.tw = gsap.timeline({ repeat: -1, delay: 0.8 })
          .set(r.dot, { opacity: 1 })
          .to(r.dot, { motionPath: { path: r.p, align: r.p, alignOrigin: [0.5, 0.5] }, duration: 1.7, ease: 'power1.inOut' })
          .to(r.dot, { opacity: 0, duration: 0.25 }, '-=0.25')
          .to({}, { duration: 0.35 });
        if (r.g) r.g.classList.add('is-hot');
      });
      if (L.ring !== undefined) rings[L.ring].classList.add('is-hot');
      if (L.zone) p6.classList.add('is-hot');
    };
    var off = function (L) {
      L.routes.forEach(function (r) {
        if (r.tw) { r.tw.kill(); r.tw = null; }
        gsap.to(r.dot, { opacity: 0, duration: 0.2 });
        gsap.to(r.p, { drawSVG: '100% 100%', duration: 0.6, ease: 'power2.in', overwrite: true });
        if (r.g) r.g.classList.remove('is-hot');
      });
      if (L.ring !== undefined) rings[L.ring].classList.remove('is-hot');
      if (L.zone) p6.classList.remove('is-hot');
    };
    var activate = function (i) {
      if (i === active) return;
      if (active > -1) off(LINKS[active]);
      active = i;
      if (i > -1) on(LINKS[i]);
      distLis.forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
      svg.classList.toggle('is-focus', i > -1);
    };

    ScrollTrigger.create({ trigger: map, start: 'top 82%', once: true, onEnter: function () { map.classList.add('is-in'); } });

    // the view starts close on P6 and pulls back to the whole neighbourhood
    var narrow = mq('(max-width: 640px)');
    var vb = function (s) { return s.split(/[\s,]+/).map(Number); };
    var zoom = { t: 0 };
    var setVB = function () {
      var T = vb(svg.getAttribute(narrow.matches ? 'data-vb-narrow' : 'data-vb-wide'));
      var w = T[2] * 0.48, h = T[3] * 0.48, S = [C.x - w / 2, C.y - h / 2, w, h];
      svg.setAttribute('viewBox', S.map(function (v, i) { return (v + (T[i] - v) * zoom.t).toFixed(2); }).join(' '));
    };

    var wideMq = mq('(min-width: 1000px)');
    distLis.forEach(function (li, k) { li.addEventListener('mouseenter', function () { if (wideMq.matches) activate(k); }); });
    var mmap = gsap.matchMedia();
    var byProgress = function (p) { return Math.min(LINKS.length - 1, Math.floor(p * LINKS.length)); };
    mmap.add({ pin: '(min-width: 1000px) and (min-height: 700px)', wide: '(min-width: 1000px)', small: '(max-width: 999px)' }, function (ctx) {
      var c = ctx.conditions;
      zoom.t = 0;
      setVB();
      if (c.pin) {
        // the whole block holds still while the scroll walks the list, one place after another
        var loc = $('.loc');
        gsap.to(zoom, { t: 1, ease: 'power2.inOut', onUpdate: setVB,
          scrollTrigger: { trigger: loc, start: 'top 85%', end: 'center 46%', scrub: 1 } });
        ScrollTrigger.create({ trigger: loc, start: 'center 46%', end: function () { return '+=' + Math.round(window.innerHeight * 1.9); },
          pin: true, anticipatePin: 1,
          onUpdate: function (s) { activate(byProgress(s.progress)); },
          onLeave: function () { activate(-1); },
          onLeaveBack: function () { activate(-1); } });
      } else if (c.wide) {
        gsap.to(zoom, { t: 1, ease: 'power2.inOut', onUpdate: setVB,
          scrollTrigger: { trigger: '#lokalita', start: 'top 70%', end: 'top 5%', scrub: 1 } });
        ScrollTrigger.create({ trigger: '.dist', start: 'top 75%', end: 'bottom 25%',
          onUpdate: function (s) { activate(byProgress(s.progress)); },
          onLeave: function () { activate(-1); },
          onLeaveBack: function () { activate(-1); } });
      } else {
        gsap.to(zoom, { t: 1, ease: 'power2.inOut', onUpdate: setVB,
          scrollTrigger: { trigger: map, start: 'top 95%', end: 'center 55%', scrub: 1 } });
        var timer = null, k = 0;
        ScrollTrigger.create({ trigger: map, start: 'top 70%', end: 'bottom 30%',
          onToggle: function (s) {
            clearInterval(timer);
            if (!s.isActive) { activate(-1); return; }
            activate(k % LINKS.length);
            timer = setInterval(function () { k++; activate(k % LINKS.length); }, 2600);
          } });
        return function () { clearInterval(timer); activate(-1); };
      }
      return function () { activate(-1); };
    });
  }

  /* --- perks: rule wipes, icon draws itself, label rises --------------------------------- */
  $$('.perks li').forEach(function (li) {
    var parts = $$('path, rect, circle', li);
    var label = $('span', li);
    block(li, function (tl) {
      tl.call(function () { li.classList.add('m-on'); }, null, 0)
        .from(parts, { drawSVG: '0%', duration: 1.4, ease: 'power2.inOut', stagger: 0.04 }, 0)
        .from(label, { opacity: 0, y: 18, duration: 1 }, 0.15);
    }, 'top 92%');
  });

  /* --- gallery: frames unveil upwards, images settle and drift ------------------------- */
  $$('.mosaic .frame, .note').forEach(function (el) {
    if (el.classList.contains('note')) {
      block(el, function (tl) { tl.from(el, { opacity: 0, y: 24, duration: 1.1 }); });
      return;
    }
    var img = $('img', el);
    el.classList.add('m-veil');
    block(el, function (tl) {
      tl.call(function () { el.classList.remove('m-veil'); }, null, 0.4)
        .fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 6px)' }, { clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.5, ease: 'expo.inOut' }, 0)
        .fromTo(img, { scale: 1.45 }, { scale: 1.12, duration: 2.2, ease: EASE }, 0.1);
    }, 'top 90%');
    gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* --- steps: cards rise, a copper rail runs across and lights each one ----------------- */
  var steps = $('.steps');
  if (steps) {
    var items = $$('li', steps);
    var rail = document.createElement('span');
    rail.className = 'steps__rail';
    rail.setAttribute('aria-hidden', 'true');
    steps.appendChild(rail);
    block(steps, function (tl) {
      tl.from(items, { opacity: 0, y: 46, duration: 1.2, stagger: 0.12 }, 0)
        .from($$('.steps__n', steps), { opacity: 0, x: -12, duration: 0.9, stagger: 0.12 }, 0.2);
    }, 'top 85%');
    gsap.to(rail, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: steps, start: 'top 72%', end: 'bottom 62%', scrub: 0.6,
        onUpdate: function (s) { items.forEach(function (li, i) { li.classList.toggle('m-lit', s.progress > i / items.length + 0.01); }); } }
    });
  }

  /* --- registration: card lifts in, a big P6 draws itself behind ----------------------- */
  var reg = $('[data-reg]');
  if (reg) {
    var glow = document.createElement('div');
    glow.className = 'reg__glow';
    glow.setAttribute('aria-hidden', 'true');
    var big = document.createElementNS(NS, 'svg');
    big.setAttribute('class', 'reg__mark');
    big.setAttribute('viewBox', '100 100 678 472');
    big.setAttribute('aria-hidden', 'true');
    $$('#p6 path').forEach(function (p) { big.appendChild(p.cloneNode()); });
    reg.insertBefore(big, reg.firstChild);
    reg.insertBefore(glow, reg.firstChild);
    gsap.fromTo($$('path', big), { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', stagger: 0.15,
      scrollTrigger: { trigger: reg, start: 'top 85%', end: 'center 45%', scrub: 1 } });
    gsap.fromTo(big, { yPercent: 12 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: reg, start: 'top bottom', end: 'bottom top', scrub: true } });
    var card = $('.reg__card', reg);
    if (card) block(card, function (tl) { tl.from(card, { opacity: 0, y: 70, duration: 1.4 }); }, 'top 90%');
  }

  /* --- footer --------------------------------------------------------------------------- */
  var foot = $('.foot__grid');
  if (foot) block(foot, function (tl) { tl.from($$(':scope > div', foot), { opacity: 0, y: 30, duration: 1.1, stagger: 0.08 }); }, 'top 92%');

  /* --- nav: progress hairline, hides on the way down, back on the way up ---------------- */
  var nav = $('[data-nav]');
  if (nav) {
    var bar = document.createElement('span');
    bar.className = 'nav__progress';
    bar.setAttribute('aria-hidden', 'true');
    nav.appendChild(bar);
    var setBar = gsap.quickSetter(bar, 'scaleX');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) {
      setBar(s.progress);
      nav.classList.toggle('m-hide', s.direction === 1 && s.scroll() > window.innerHeight * 0.9 && !nav.contains(document.activeElement));
    } });
  }

  /* --- mouse: cursor ring and magnetic buttons ------------------------------------------- */
  if (fine) {
    var cur = document.createElement('div');
    cur.className = 'm-cursor';
    cur.setAttribute('aria-hidden', 'true');
    cur.appendChild(document.createElement('span'));
    document.body.appendChild(cur);
    var qx = gsap.quickTo(cur, 'x', { duration: 0.45, ease: 'power3' });
    var qy = gsap.quickTo(cur, 'y', { duration: 0.45, ease: 'power3' });
    window.addEventListener('pointermove', function (e) { qx(e.clientX); qy(e.clientY); cur.classList.add('is-on'); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); });
    document.addEventListener('pointerover', function (e) {
      var t = e.target;
      var field = t.closest && t.closest('input:not([type="checkbox"]):not([type="radio"]), textarea, select');
      var link = !field && t.closest && t.closest('a, button, label, [data-lang]');
      cur.classList.toggle('is-field', !!field);
      cur.classList.toggle('is-link', !!link);
      cur.classList.toggle('is-media', !field && !link && !!(t.closest && t.closest('.frame, .map svg')));
    });

    $$('.btn').forEach(function (b) {
      var bx = gsap.quickTo(b, 'x', { duration: 0.7, ease: 'elastic.out(1, .45)' });
      var by = gsap.quickTo(b, 'y', { duration: 0.7, ease: 'elastic.out(1, .45)' });
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        bx((e.clientX - r.left - r.width / 2) * 0.28);
        by((e.clientY - r.top - r.height / 2) * 0.4);
      });
      b.addEventListener('pointerleave', function () { bx(0); by(0); });
    });
  }

  /* --- language switch and width changes: re-split from the fresh text ---------------- */
  document.addEventListener('p6:lang', function () {
    [h1, sub].concat.apply([h1, sub], blocks.map(function (b) { return b.splitEls; }))
      .forEach(function (el) { el.__src = undefined; });
    blocks.forEach(function (b) { b.run(); });
    if (!root.classList.contains('intro')) heroShow();
    ScrollTrigger.refresh();
  });
  var lastW = window.innerWidth;
  var rT = null;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(onResize, 250); });
  function onResize() {
    if (Math.abs(window.innerWidth - lastW) < 2) return;
    lastW = window.innerWidth;
    blocks.forEach(function (b) { b.run(); });
    if (heroPlayed) heroShow();
    ScrollTrigger.refresh();
  }

  /* --- go ------------------------------------------------------------------------------- */
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  intro();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
