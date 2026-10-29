// The three time jumps, each scrubbed by scroll so nothing ever blocks the scroll:
// the rewind (2026 back to 2000), the sign-off (the broadcast day ends) and the upgrade
// (2010 up to 2026). Also the Wing 1 glitter trail.
import { onProgress } from '../scroll.js';
import { sfx, playSlot } from '../audio.js';
import { asset } from '../assets.js';
import { placeholder } from '../scenes.js';
import { $, reduceMotion } from '../ui.js';

// Canvases draw at the screen's density (capped at 2x), so the 2026 end of the upgrade is sharp.
const DPR = Math.min(2, window.devicePixelRatio || 1);
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const setHud = text => { $('#hud-clock').textContent = text; };
const timeNow = () => new Date().toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' }).replace(/\s?[ap]\.?m\.?$/i, '');

function loadImage(src) {
  return new Promise(resolve => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

// A filled slot's image, else the drawn placeholder scene for it.
async function picture(slot, scene) {
  const src = asset(slot);
  return (src && await loadImage(src)) || loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholder(scene))}`);
}

// The present: the 2026 wallpaper with the time across it, the way the lobby showed it.
// Drawn at 2x a 360 x 640 phone, in that phone's units.
async function present() {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 1280;
  const g = c.getContext('2d');
  g.scale(2, 2);
  const wall = asset('void-lockscreen') && await loadImage(asset('void-lockscreen'));
  if (wall) cover(g, wall, 360, 640, true);
  else {
    g.fillStyle = '#0d0f1f';
    g.fillRect(0, 0, 360, 640);
    for (const [x, y, r, color] of [[70, 80, 330, '#2b2f6b'], [330, 520, 300, '#3a1f55']]) {
      const glow = g.createRadialGradient(x, y, 0, x, y, r);
      glow.addColorStop(0, color);
      glow.addColorStop(1, 'rgba(13, 15, 31, 0)');
      g.fillStyle = glow;
      g.fillRect(0, 0, 360, 640);
    }
  }
  g.fillStyle = '#f2f2f5';
  g.textAlign = 'center';
  g.font = '200 100px system-ui, -apple-system, Segoe UI, sans-serif';
  g.fillText(timeNow(), 180, 250);
  return c;
}

function cover(g, src, w, h, smooth) {
  const sw = src.naturalWidth || src.width;
  const sh = src.naturalHeight || src.height;
  const s = Math.max(w / sw, h / sh);
  g.imageSmoothingEnabled = smooth;
  g.drawImage(src, (w - sw * s) / 2, (h - sh * s) / 2, sw * s, sh * s);
}

// Draws src in blocks of `block` CSS pixels with hard edges. At one pixel it draws src directly,
// smoothed unless it is pixel art.
function pixelate(g, src, block, buffer, smooth = true) {
  const { width: w, height: h } = g.canvas;
  if (block <= 1.01) { cover(g, src, w, h, smooth); return; }
  buffer.width = Math.max(1, Math.round(w / (block * DPR)));
  buffer.height = Math.max(1, Math.round(h / (block * DPR)));
  cover(buffer.getContext('2d'), src, buffer.width, buffer.height, true);
  g.imageSmoothingEnabled = false;
  g.drawImage(buffer, 0, 0, w, h);
}

function fit(canvas) {
  const w = Math.round(canvas.clientWidth * DPR);
  const h = Math.round(canvas.clientHeight * DPR);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return canvas.getContext('2d');
}

// Runs fn once, the first time p passes the mark.
const cue = () => {
  const done = new Set();
  return (p, mark, fn) => { if (p >= mark && !done.has(mark)) { done.add(mark); fn(); } };
};

async function rewind(reduce) {
  const section = $('#rewind');
  const canvas = $('#rewind-canvas');
  const year = $('#rewind-year');
  const buffer = document.createElement('canvas');
  let from = null;
  let to = null;
  let last = 0;
  let loading = false;
  const at = cue();
  const draw = p => {
    last = p;
    // The sala loads once the rewind starts moving, not with the lobby.
    if (p > 0 && !loading) {
      loading = true;
      picture('bg-sala', 'sala').then(im => { to = im; draw(last); });
    }
    const g = fit(canvas);
    const { width: w, height: h } = canvas;
    g.globalAlpha = 1;
    g.fillStyle = '#0b0c12';
    g.fillRect(0, 0, w, h);
    const fade = clamp((p - 0.5) / 0.4);
    if (from && fade < 1) {
      if (reduce) cover(g, from, w, h, true);
      else pixelate(g, from, lerp(1, 30, clamp(p / 0.6) ** 1.4), buffer);
    }
    if (to && fade > 0) {
      g.globalAlpha = reduce ? (fade > 0.5 ? 1 : 0) : fade;
      cover(g, to, w, h, false);
      g.globalAlpha = 1;
    }
    if (!reduce && p > 0.15 && p < 0.85) {
      g.fillStyle = 'rgba(255, 255, 255, 0.07)';
      g.fillRect(0, ((p * 6) % 1) * h - 20, w, 24);
    }
    year.textContent = String(Math.round(2026 - 26 * clamp(p / 0.85)));
    if (document.documentElement.dataset.stop === 'rewind') setHud(year.textContent);
    at(p, 0.04, () => playSlot('sfx-dialup'));
  };
  onProgress(section, draw);
  from = await present();
  draw(last);
}

function signoff(reduce) {
  const section = $('#signoff');
  const canvas = $('#signoff-static');
  const at = cue();
  let timer = 0;
  const noise = () => {
    canvas.width = 96;
    canvas.height = 170;
    const g = canvas.getContext('2d');
    const frame = g.createImageData(96, 170);
    for (let i = 0; i < frame.data.length; i += 4) {
      const v = 70 + Math.random() * 80;
      frame.data[i] = frame.data[i + 1] = frame.data[i + 2] = v;
      frame.data[i + 3] = 255;
    }
    g.putImageData(frame, 0, 0);
  };
  onProgress(section, p => {
    at(p, 0.05, () => sfx.tone(2.4));
    at(p, 0.4, () => sfx.noise(1.4));
    at(p, 0.64, () => sfx.crtOff());
    const snowing = !reduce && p > 0.38 && p < 0.66;
    if (snowing && !timer) timer = setInterval(noise, 1000 / 12);
    if (!snowing && timer) { clearInterval(timer); timer = 0; }
    if (document.documentElement.dataset.stop === 'signoff') setHud(p < 0.6 ? '23:59' : '00:00');
  });
}

function upgrade(reduce) {
  const section = $('#upgrade');
  const canvas = $('#upgrade-canvas');
  const year = $('#upgrade-year');
  const buffer = document.createElement('canvas');
  let past = null;
  let now = null;
  let last = 0;
  let loading = false;
  const at = cue();
  const draw = p => {
    last = p;
    // Loads on the first draw, when the upgrade nears the screen, so the clock is the arrival time.
    if (!loading) {
      loading = true;
      Promise.all([picture('bg-bedroom', 'bedroom'), present()]).then(([a, b]) => { past = a; now = b; draw(last); });
    }
    const g = fit(canvas);
    const { width: w, height: h } = canvas;
    g.globalAlpha = 1;
    g.fillStyle = '#0b0c12';
    g.fillRect(0, 0, w, h);
    const sharpen = clamp((p - 0.4) / 0.5);
    if (past && sharpen < 1) {
      if (reduce) cover(g, past, w, h, false);
      else pixelate(g, past, lerp(1, 22, clamp((p - 0.15) / 0.4)), buffer, false);
    }
    if (now && sharpen > 0) {
      g.globalAlpha = reduce ? (sharpen > 0.5 ? 1 : 0) : sharpen;
      if (reduce) cover(g, now, w, h, true);
      else pixelate(g, now, lerp(26, 1, sharpen ** 0.8), buffer);
      g.globalAlpha = 1;
    }
    year.textContent = String(Math.round(2010 + 16 * clamp((p - 0.1) / 0.8)));
    if (document.documentElement.dataset.stop === 'upgrade') setHud(year.textContent);
    at(p, 0.08, () => { sfx.sms(); sfx.vibrate([60, 40, 60]); });
    at(p, 0.38, () => sfx.whoosh());
  };
  onProgress(section, draw);
}

// Wing 1 only: the cursor (or a dragging finger) leaves pixel sparkles, like an old profile page.
function glitter() {
  const canvas = $('#glitter');
  const g = canvas.getContext('2d');
  const sparks = [];
  const COLORS = ['#f2d24b', '#ffffff', '#d94f8a', '#9fd3ff'];
  let raf = 0;
  const size = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  size();
  addEventListener('resize', size);
  const draw = now => {
    g.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const age = (now - s.born) / 600;
      if (age >= 1) { sparks.splice(i, 1); continue; }
      s.y += s.fall;
      g.globalAlpha = 1 - age;
      g.fillStyle = s.color;
      const x = Math.round(s.x);
      const y = Math.round(s.y);
      g.fillRect(x - s.arm, y, s.arm * 2 + 1, 1);
      g.fillRect(x, y - s.arm, 1, s.arm * 2 + 1);
    }
    g.globalAlpha = 1;
    raf = sparks.length ? requestAnimationFrame(draw) : 0;
  };
  const spawn = (x, y) => {
    if (document.documentElement.dataset.era !== '2000' || reduceMotion()) return;
    for (let i = 0; i < 2; i++) {
      sparks.push({
        x: x + (Math.random() - 0.5) * 16, y: y + (Math.random() - 0.5) * 16, fall: 0.3 + Math.random() * 0.6,
        born: performance.now(), color: COLORS[Math.floor(Math.random() * COLORS.length)], arm: Math.random() < 0.3 ? 3 : 2,
      });
    }
    if (sparks.length > 60) sparks.splice(0, sparks.length - 60);
    if (!raf) raf = requestAnimationFrame(draw);
  };
  addEventListener('pointermove', e => { if (e.pointerType !== 'touch') spawn(e.clientX, e.clientY); }, { passive: true });
  addEventListener('touchmove', e => { const t = e.touches[0]; if (t) spawn(t.clientX, t.clientY); }, { passive: true });
}

export function mountTransitions() {
  const reduce = reduceMotion();
  rewind(reduce);
  signoff(reduce);
  upgrade(reduce);
  glitter();
}
