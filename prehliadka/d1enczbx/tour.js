// P6 virtual tour. Node data in data.js, built by _shared_pipeline/tour_build.py
import { Viewer } from './vendor/psv-core.js';
import { MarkersPlugin } from './vendor/psv-markers.js';

const T = window.TOUR;
const START = 'H1';
const DISC = { fill: 'rgba(247,244,239,.34)', stroke: 'rgba(247,244,239,.95)', strokeWidth: '2px' };
const DISC_HOT = { fill: 'rgba(247,244,239,.72)', stroke: '#fff', strokeWidth: '3px' };
let current = START, moving = false, hot = null;

const viewer = new Viewer({
  container: 'viewer',
  panorama: T.nodes[START].pano,
  defaultYaw: T.nodes[START].home, defaultPitch: -0.12, defaultZoomLvl: 20,
  minFov: 35, maxFov: 100,
  navbar: ['zoom', 'fullscreen'],
  loadingTxt: '', mousewheelCtrlKey: false, touchmoveTwoFingers: false,
  plugins: [[MarkersPlugin, {}]],
});
const markers = viewer.getPlugin(MarkersPlugin);

// ---- which node a click in a given direction leads to (precomputed from the model)
function targetAt(yaw, pitch) {
  const rows = T.nodes[current].click;
  const u = ((yaw / (2 * Math.PI) + 0.5) % 1 + 1) % 1, v = 0.5 - pitch / Math.PI;
  const ch = rows[Math.min(rows.length - 1, Math.max(0, Math.floor(v * rows.length)))][Math.floor(u * rows[0].length)];
  return ch === '.' || ch === undefined ? null : T.order[+ch];
}

function showMarkers() {
  markers.clearMarkers();
  for (const l of T.nodes[current].links) {
    markers.addMarker({ id: l.to, polygon: l.ring, svgStyle: { ...DISC }, className: 'hotspot',
                        tooltip: { content: T.nodes[l.to].room, position: 'top center' }, data: { to: l.to } });
  }
  document.querySelector('#room .name').textContent = T.nodes[current].room;
  for (const l of T.nodes[current].links) { const i = new Image(); i.src = T.nodes[l.to].pano; }   // preload neighbours
  drawMap();
}

function highlight(id) {
  if (id === hot) return;
  if (hot && markers.getMarker) try { markers.updateMarker({ id: hot, svgStyle: { ...DISC } }); } catch (e) {}
  hot = id;
  if (hot) try { markers.updateMarker({ id: hot, svgStyle: { ...DISC_HOT } }); } catch (e) {}
  viewer.container.style.cursor = hot ? 'pointer' : '';
}

// ---- move: turn toward the target, push in, cross-fade to the next panorama at the same heading
async function go(to) {
  if (moving || to === current || !T.nodes[to]) return;
  moving = true; highlight(null);
  const a = T.nodes[current], b = T.nodes[to];
  const yawTo = -Math.atan2(b.y - a.y, b.x - a.x);
  // a step through a door keeps the heading you walked in with; a jump from the minimap has no
  // heading to keep, so it arrives on the node's home view instead of facing whatever is nearest
  const linked = a.links.some(l => l.to === to);
  const arrive = linked ? yawTo : b.home;
  const z0 = viewer.getZoomLevel(), pitch = viewer.getPosition().pitch;
  await viewer.animate({ yaw: yawTo, pitch: Math.max(-0.35, Math.min(0.1, pitch)), zoom: Math.min(100, z0 + 28), speed: 700 });
  current = to;
  markers.clearMarkers();
  await viewer.setPanorama(b.pano, { position: { yaw: arrive, pitch: linked ? viewer.getPosition().pitch : -0.10 },
                                     zoom: z0, transition: 850, showLoader: false });
  // setPanorama's own position does not survive the cross-fade in every case, so a jump that
  // has to land on the home view says so again once the new panorama is actually up
  if (!linked) viewer.rotate({ yaw: arrive, pitch: -0.10 });
  showMarkers();
  moving = false;
}

markers.addEventListener('select-marker', ({ marker }) => go(marker.data.to));
viewer.addEventListener('click', ({ data }) => {
  if (data.rightclick || moving) return;
  const t = targetAt(data.yaw, data.pitch);
  if (t) go(t);
});
viewer.container.addEventListener('pointermove', (e) => {
  if (moving) return;
  const r = viewer.container.getBoundingClientRect();
  try {
    const s = viewer.dataHelper.viewerCoordsToSphericalCoords({ x: e.clientX - r.left, y: e.clientY - r.top });
    highlight(targetAt(s.yaw, s.pitch));
  } catch (err) { highlight(null); }
});
viewer.addEventListener('ready', () => { showMarkers(); setTimeout(() => document.getElementById('hint').style.opacity = 0, 7000); }, { once: true });
viewer.addEventListener('position-updated', drawCone);

// ---- minimap
const P = T.plan;
const plan = document.getElementById('plan'); plan.src = 'plan.jpg';
const svg = document.getElementById('mapsvg');
svg.setAttribute('viewBox', `0 0 ${P.w} ${P.h}`);
const toMap = (x, y) => [(x - P.x0) * P.px_per_m, (P.y1 - y) * P.px_per_m];
function drawMap() {
  svg.innerHTML = '';
  const cone = document.createElementNS('http://www.w3.org/2000/svg', 'path'); cone.setAttribute('class', 'cone'); cone.id = 'cone';
  svg.appendChild(cone);
  for (const id of T.order) {
    const [x, y] = toMap(T.nodes[id].x, T.nodes[id].y);
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', (id === current ? 0.30 : 0.24) * P.px_per_m);   // metres on the plan
    c.setAttribute('class', id === current ? 'here' : 'dot');
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'title'); t.textContent = T.nodes[id].room; c.appendChild(t);
    if (id !== current) c.addEventListener('click', () => go(id));
    svg.appendChild(c);
  }
  drawCone();
}
function drawCone() {
  const cone = document.getElementById('cone'); if (!cone) return;
  const [x, y] = toMap(T.nodes[current].x, T.nodes[current].y);
  const yaw = viewer.getPosition().yaw, half = 0.5, R = 2.2 * P.px_per_m;   // screen angle = yaw (y down)
  const p = (a) => `${x + R * Math.cos(a)},${y + R * Math.sin(a)}`;
  cone.setAttribute('d', `M${x},${y} L${p(yaw - half)} A${R},${R} 0 0 1 ${p(yaw + half)} Z`);
}
