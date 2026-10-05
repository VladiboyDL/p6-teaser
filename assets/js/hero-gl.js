/* P6 teaser, hero in WebGL: the architect's visualisation as a 2.5D scene.
   A depth map estimated from the same render (assets/img/hero-*depth*.webp, near = white) drives:
   - parallax for the mouse (and phone tilt where the browser allows it without a prompt),
   - a depth-weighted push-in with depth of field while the hero scrolls away,
   - the reveal: a copper scan travels from the sky to the street and the picture resolves behind it.
   Nothing is added to the picture; it only moves. Draws only while the hero is on screen and the tab is visible.
   Without WebGL the plain <img> stays. API for motion.js: window.P6HeroGL = { ready, reveal(sec), look(x, y), scroll(p) } */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  var media = document.querySelector('.hero__media');
  var img = document.querySelector('.hero__poster');
  if (!media || !img) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'hero__gl';
  canvas.setAttribute('aria-hidden', 'true');
  var gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) return;

  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  // Parallax is solved per pixel by marching the depth field from near to far: the first surface the ray meets wins,
  // so foreground edges stay whole and the background fills in behind them (parallax occlusion mapping, 2.5D).
  var STEPS = window.matchMedia('(pointer: coarse)').matches ? 12 : 16;
  var FS = [
    'precision highp float;',
    '#define STEPS ' + STEPS,
    'varying vec2 v;',
    'uniform sampler2D uImg,uDepth;',
    'uniform vec2 uRes,uImgRes,uPos,uLook,uLight;',
    'uniform float uScroll,uReveal,uTime,uFocus,uLightAmt;',
    'const vec3 INK=vec3(.078,.071,.059);',
    'const vec3 COPPER=vec3(.851,.580,.357);',
    'vec2 S,FC,CAM; float Z;',
    // how far a surface of depth t moves: the focus plane (the building) stays put, the street moves with the camera,
    // the sky moves against it but less, as real disparity does
    'float g(float t){return t>uFocus?(t-uFocus)/(1.-uFocus)*.5:(t-uFocus)/uFocus*.32;}',
    'vec2 src(vec2 base,float t){vec2 b=base-CAM*g(t);return FC+(b-FC)/(1.+Z*(.25+.75*t));}',
    'float H(vec2 q){return texture2D(uDepth,q).r;}',
    'void main(){',
    '  vec2 suv=vec2(v.x,1.-v.y);',
    '  float rc=uRes.x/uRes.y, ri=uImgRes.x/uImgRes.y;',
    '  S=rc>ri?vec2(1.,ri/rc):vec2(rc/ri,1.);',
    '  S*=.92;',                                                       // bleed: larger than the largest shift, so no edge ever shows
    '  vec2 base=suv*S+(1.-S)*uPos;',
    '  FC=vec2(.5,.46)*S+(1.-S)*uPos;',
    '  CAM=uLook*vec2(.009,.005)+vec2(sin(uTime*.21),cos(uTime*.16))*vec2(.0016,.0011);',
    '  Z=uScroll*.14;',
    '  float dt=1./float(STEPS);',
    '  float tPrev=1.; float tHit=0.;',
    '  bool top=H(src(base,1.))>=1.;',                                  // nearest possible surface already covers this pixel
    '  for(int i=1;i<=STEPS;i++){',
    '    float t=1.-float(i)*dt;',
    '    if(H(src(base,t))>=t){tHit=t;break;}',                         // the ray reached a surface between tPrev and t
    '    tPrev=t;',
    '  }',
    '  for(int k=0;k<5;k++){',                                          // binary refinement: the exact edge, no combing on thin twigs
    '    float tm=.5*(tHit+tPrev);',
    '    if(H(src(base,tm))>=tm) tHit=tm; else tPrev=tm;',
    '  }',
    '  vec2 q=src(base,top?1.:tHit);',
    '  float d=H(q);',
    '  vec3 col=texture2D(uImg,q).rgb;',
    '  float blur=uScroll*abs(d-uFocus)*.007;',                        // depth of field on the way out, building stays sharp
    '  if(blur>.0003){',
    '    vec2 a=vec2(blur/rc,blur);',
    '    col=col*.2',
    '      +texture2D(uImg,q+a*vec2( 1., 0.)).rgb*.1+texture2D(uImg,q+a*vec2(-1., 0.)).rgb*.1',
    '      +texture2D(uImg,q+a*vec2( 0., 1.)).rgb*.1+texture2D(uImg,q+a*vec2( 0.,-1.)).rgb*.1',
    '      +texture2D(uImg,q+a*vec2( .7, .7)).rgb*.1+texture2D(uImg,q+a*vec2(-.7, .7)).rgb*.1',
    '      +texture2D(uImg,q+a*vec2( .7,-.7)).rgb*.1+texture2D(uImg,q+a*vec2(-.7,-.7)).rgb*.1;',
    '  }',
    '  vec2 lv=(suv-uLight)*vec2(rc,1.);',
    '  col+=col*exp(-dot(lv,lv)*5.)*uLightAmt*.10*(.6+.4*d);',         // a soft lamp that follows the cursor
    '  vec3 outc=col;',
    '  if(uReveal<1.){',                                                // reveal only: skipped once the picture is in
    '    float kb=0.;',                                                 // front bends with depth, blurred wide so it stays smooth
    '    for(int j=0;j<8;j++){float a=float(j)*.785;kb+=H(q+vec2(cos(a)/rc,sin(a))*.022);}',
    '    kb=1.-kb/8.;',
    '    float n=fract(sin(dot(suv*uRes,vec2(12.9898,78.233)))*43758.5453);',
    '    float key=mix(kb,1.-suv.y,.5)+(n-.5)*.012;',
    '    float r=clamp((uReveal-.08)/.92,0.,1.);',
    '    float f=mix(1.2,-.25,r);',
    '    float shown=smoothstep(f,f+.14,key);',
    '    float ex=(key-f-.05)/.06; float edge=exp(-ex*ex);',
    '    float bx=(key-f-.2)/.16; float bloom=exp(-bx*bx);',
    '    float lum=dot(col,vec3(.299,.587,.114));',
    '    vec3 pre=INK+vec3(lum)*vec3(.16,.14,.12)*smoothstep(0.,.12,uReveal);',
    '    outc=mix(pre,col*(1.+.28*bloom),shown)+(COPPER*.5+col*.35)*edge*.7;',
    '  }',
    '  gl_FragColor=vec4(outc,1.);',
    '}'
  ].join('\n');

  function sh(type, src) {
    var o = gl.createShader(type);
    gl.shaderSource(o, src);
    gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o));
    return o;
  }
  var prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { return; }
  gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {};
  ['uImg', 'uDepth', 'uRes', 'uImgRes', 'uPos', 'uLook', 'uLight', 'uScroll', 'uReveal', 'uTime', 'uFocus', 'uLightAmt']
    .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

  function texture(unit, source) {
    var t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  var load = function (el) {
    return new Promise(function (res, rej) {
      if (el.complete && el.naturalWidth) return res(el);
      el.addEventListener('load', function () { res(el); }, { once: true });
      el.addEventListener('error', rej, { once: true });
    });
  };

  // the tall picture (phones in portrait) has its own depth map and its own scale of depth values
  var state = {
    look: [0, 0], lookT: [0, 0], light: [0.5, 0.4], lightT: [0.5, 0.4], lightAmt: 0, lightAmtT: 0,
    scroll: 0, reveal: 0, t0: performance.now(), visible: true, running: false, dirty: true
  };
  var cfg = null;

  var ready = load(img).then(function () {
    var tall = /tall/.test(img.currentSrc || img.src);
    cfg = tall
      ? { depth: 'assets/img/hero-tall-depth-600.webp?v=2', focus: 0.40, pos: [0.5, 0.30] }
      : { depth: 'assets/img/hero-depth-1100.webp?v=2', focus: 0.78, pos: [0.5, 0.42] };
    var dimg = new Image();
    dimg.decoding = 'async';
    dimg.src = cfg.depth;
    return Promise.all([img.decode ? img.decode().catch(function () {}) : null, load(dimg)]).then(function () { return dimg; });
  }).then(function (dimg) {
    if (state.aborted) return false; // motion.js gave up waiting and showed the plain picture
    texture(0, img);
    texture(1, dimg);
    gl.uniform1i(U.uImg, 0);
    gl.uniform1i(U.uDepth, 1);
    gl.uniform2f(U.uImgRes, img.naturalWidth, img.naturalHeight);
    gl.uniform2f(U.uPos, cfg.pos[0], cfg.pos[1]);
    gl.uniform1f(U.uFocus, cfg.focus);
    media.insertBefore(canvas, media.querySelector('.hero__scrim'));
    size();
    draw(performance.now());
    root.classList.add('hero-gl');
    start();
    return true;
  });

  function size() {
    var r = media.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5); // the source is 2200 px wide, more pixels add cost, not detail
    var w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h);
    state.dirty = true;
  }

  function draw(now) {
    var k = 0.075; // easing per frame towards the targets
    state.look[0] += (state.lookT[0] - state.look[0]) * k;
    state.look[1] += (state.lookT[1] - state.look[1]) * k;
    state.light[0] += (state.lightT[0] - state.light[0]) * 0.12;
    state.light[1] += (state.lightT[1] - state.light[1]) * 0.12;
    state.lightAmt += (state.lightAmtT - state.lightAmt) * 0.06;
    gl.uniform2f(U.uLook, state.look[0], state.look[1]);
    gl.uniform2f(U.uLight, state.light[0], state.light[1]);
    gl.uniform1f(U.uLightAmt, state.lightAmt);
    gl.uniform1f(U.uScroll, state.scroll);
    gl.uniform1f(U.uReveal, state.reveal);
    gl.uniform1f(U.uTime, (now - state.t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function frame(now) {
    if (!state.running) return;
    draw(now);
    requestAnimationFrame(frame);
  }
  function start() {
    if (state.running || !state.visible || document.hidden) return;
    state.running = true;
    requestAnimationFrame(frame);
  }
  function stop() { state.running = false; }

  new IntersectionObserver(function (e) { state.visible = e[0].isIntersecting; if (state.visible) start(); else stop(); }).observe(media);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  var rT = null;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { if (cfg) size(); }, 120); });

  // phone tilt: only where it needs no permission prompt (Android); iOS keeps the slow drift
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null) return;
    state.lookT[0] = Math.max(-1, Math.min(1, e.gamma / 25));
    state.lookT[1] = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }, { passive: true });

  window.P6HeroGL = {
    ready: ready,
    reveal: function (sec) {
      return new Promise(function (res) {
        if (!window.gsap) { state.reveal = 1; return res(); }
        gsap.fromTo(state, { reveal: 0 }, { reveal: 1, duration: sec || 1.8, ease: 'power2.inOut', onComplete: res });
      });
    },
    show: function () { state.reveal = 1; },
    abort: function () { state.aborted = true; },
    look: function (x, y, lx, ly) {
      state.lookT[0] = x; state.lookT[1] = y;
      if (lx !== undefined) { state.lightT[0] = lx; state.lightT[1] = ly; state.lightAmtT = 1; }
    },
    rest: function () { state.lookT[0] = 0; state.lookT[1] = 0; state.lightAmtT = 0; },
    scroll: function (p) { state.scroll = p; }
  };
})();
