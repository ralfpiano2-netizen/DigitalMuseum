// Sound. Nothing is created or downloaded until the visitor turns sound on. Every slot has a
// synthesized stand-in (or silence), so the museum sounds right before any recording exists.
import { asset } from './assets.js';
import { SLOTS } from './slots.js';
import { GUIDE } from './content.js';

let ctx = null;
let master = null;
let on = false;
const bus = {};
const buffers = new Map();

const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

export const isOn = () => on;
export const state = () => (ctx ? ctx.state : 'none');

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  // Safari 17+: the visitor asked for sound, so play it through the silent switch.
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* not supported */ }
  master = ctx.createGain();
  master.connect(ctx.destination);
  for (const [name, level] of [['sfx', 0.8], ['amb', 0.55], ['music', 0.6], ['voice', 1]]) {
    bus[name] = ctx.createGain();
    bus[name].gain.value = level;
    bus[name].connect(master);
  }
  // Sound sleeps while the tab is hidden. iOS only lets a tap wake it, so every kind of tap tries.
  const wake = () => { if (on && ctx.state !== 'running' && document.visibilityState === 'visible') ctx.resume().catch(() => {}); };
  for (const type of ['pointerdown', 'touchend', 'click', 'keydown']) addEventListener(type, wake, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') ctx.suspend().catch(() => {});
    else wake();
  });
  return true;
}

export function enable() {
  if (!ctx && !build()) return;
  on = true;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(1, ctx.currentTime, 0.05);
  ctx.resume().catch(() => {});
  emit('sound', { on: true });
}

export function disable() {
  on = false;
  if (ctx) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    setTimeout(() => { if (!on) ctx.suspend().catch(() => {}); }, 400);
  }
  setAmbience([]);
  playMusic(null);
  stopGuide();
  emit('sound', { on: false });
}

/* Synthesized voices */

// One-shots are dropped while the context is asleep; queued, they would all fire at once on waking.
const awake = () => on && ctx.state === 'running';

function tone(freq, { type = 'square', at = 0, dur = 0.1, gain = 0.05, to = null, out = 'sfx' } = {}) {
  if (!awake()) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.setValueAtTime(gain, t + Math.max(0.006, dur - 0.012));
  g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g).connect(bus[out]);
  o.start(t);
  o.stop(t + dur + 0.02);
}

let noise = null;
function noiseBuffer() {
  if (noise) return noise;
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return noise;
}

function hiss({ at = 0, dur = 0.3, gain = 0.05, type = 'bandpass', freq = 3000, q = 0.8, out = 'sfx' } = {}) {
  if (!awake()) return;
  const t = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer();
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.setValueAtTime(gain, t + Math.max(0.011, dur - 0.03));
  g.gain.linearRampToValueAtTime(0, t + dur);
  src.connect(f).connect(g).connect(bus[out]);
  src.start(t);
  src.stop(t + dur + 0.05);
}

// Dial tone, seven touch tones, then the handshake: answer tone, chirps and a burst of training noise.
function dialup() {
  tone(350, { type: 'sine', dur: 0.8, gain: 0.03 });
  tone(440, { type: 'sine', dur: 0.8, gain: 0.03 });
  const DTMF = [[697, 1209], [770, 1336], [852, 1477], [697, 1336], [941, 1336], [770, 1209], [852, 1336]];
  DTMF.forEach(([lo, hi], i) => {
    tone(lo, { type: 'sine', at: 1 + i * 0.15, dur: 0.09, gain: 0.03 });
    tone(hi, { type: 'sine', at: 1 + i * 0.15, dur: 0.09, gain: 0.03 });
  });
  tone(2100, { type: 'sine', at: 2.3, dur: 0.7, gain: 0.025 });
  for (let i = 0; i < 6; i++) tone(i % 2 ? 1850 : 1650, { type: 'square', at: 3.1 + i * 0.12, dur: 0.1, gain: 0.012 });
  hiss({ at: 3.9, dur: 1.8, gain: 0.04, freq: 1800, q: 0.3 });
  tone(980, { type: 'sawtooth', at: 4.2, dur: 0.5, gain: 0.008, to: 1400 });
}

export const sfx = {
  key: () => tone(1200, { dur: 0.045, gain: 0.035 }),
  sms: () => {
    let t = 0.02;
    for (const s of '... -- ...') {
      if (s === ' ') { t += 0.16; continue; }
      const d = s === '.' ? 0.08 : 0.24;
      tone(1760, { at: t, dur: d, gain: 0.04 });
      t += d + 0.08;
    }
  },
  coin: () => {
    tone(2400, { type: 'triangle', dur: 0.06, gain: 0.05 });
    tone(1500, { type: 'triangle', at: 0.07, dur: 0.14, gain: 0.05 });
    hiss({ at: 0.05, dur: 0.12, gain: 0.03, freq: 6000 });
  },
  timeUp: () => [0, 0.22, 0.44].forEach((at, i) => tone(880, { at, dur: i === 2 ? 0.32 : 0.12, gain: 0.05 })),
  crtOn: () => {
    tone(55, { type: 'sine', dur: 0.25, gain: 0.25 });
    tone(7800, { type: 'sine', at: 0.05, dur: 1.1, gain: 0.006, to: 8200 });
    hiss({ at: 0.04, dur: 0.35, gain: 0.05, freq: 4000 });
  },
  crtOff: () => {
    tone(8200, { type: 'sine', dur: 0.5, gain: 0.006, to: 3000 });
    tone(60, { type: 'sine', dur: 0.12, gain: 0.15 });
  },
  tone: sec => tone(1000, { type: 'sine', dur: sec, gain: 0.05 }),
  noise: sec => hiss({ dur: sec, gain: 0.05, freq: 3500, q: 0.4 }),
  ping: () => {
    tone(1318.5, { type: 'sine', dur: 0.12, gain: 0.05 });
    tone(1975.5, { type: 'sine', at: 0.09, dur: 0.22, gain: 0.04 });
  },
  tick: () => tone(2600, { dur: 0.012, gain: 0.02 }),
  stamp: () => {
    tone(90, { type: 'sine', dur: 0.12, gain: 0.25, to: 50 });
    hiss({ dur: 0.06, gain: 0.05, freq: 900, type: 'lowpass' });
  },
  bell: () => [0, 0.45, 0.9].forEach(at => {
    tone(1480, { type: 'sine', at, dur: 0.9, gain: 0.05 });
    tone(2220, { type: 'sine', at, dur: 0.5, gain: 0.02 });
  }),
  dialup,
  // A rising sweep for the upgrade: noise opening up under a climbing tone.
  whoosh: () => {
    hiss({ dur: 1.6, gain: 0.035, freq: 900, q: 0.5 });
    tone(180, { type: 'sawtooth', dur: 1.5, gain: 0.012, to: 2400 });
  },
  vibrate: ms => { if (!on) return; try { navigator.vibrate?.(ms); } catch { /* not supported */ } },
};

/* Ambience beds that stand in for empty amb- slots */

function bed(build) {
  const g = ctx.createGain();
  g.gain.value = 0;
  g.connect(bus.amb);
  const nodes = build(g);
  nodes.forEach(n => n.start?.());
  return { gain: g, stop: () => nodes.forEach(n => { try { n.stop?.(); } catch { /* already stopped */ } }) };
}

const BEDS = {
  // An electric fan: filtered noise whose level swings as the fan oscillates.
  'amb-sala': out => {
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(); src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420;
    const swing = ctx.createGain(); swing.gain.value = 0.06;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.18;
    const depth = ctx.createGain(); depth.gain.value = 0.025;
    lfo.connect(depth).connect(swing.gain);
    src.connect(f).connect(swing).connect(out);
    return [src, lfo];
  },
  // Crickets: a high tone gated twice, once per pulse and once per chirp.
  'amb-night': out => {
    const carrier = ctx.createOscillator(); carrier.frequency.value = 4300;
    const pulse = ctx.createGain(); pulse.gain.value = 0;
    const pulseLfo = ctx.createOscillator(); pulseLfo.type = 'square'; pulseLfo.frequency.value = 28;
    const pulseDepth = ctx.createGain(); pulseDepth.gain.value = 0.5;
    pulseLfo.connect(pulseDepth).connect(pulse.gain);
    const chirp = ctx.createGain(); chirp.gain.value = 0;
    const chirpLfo = ctx.createOscillator(); chirpLfo.type = 'square'; chirpLfo.frequency.value = 0.9;
    const chirpDepth = ctx.createGain(); chirpDepth.gain.value = 0.012;
    chirpLfo.connect(chirpDepth).connect(chirp.gain);
    carrier.connect(pulse).connect(chirp).connect(out);
    return [carrier, pulseLfo, chirpLfo];
  },
  // The void: two low tones a fraction apart, beating slowly.
  'amb-void': out => {
    const a = ctx.createOscillator(); a.frequency.value = 55;
    const b = ctx.createOscillator(); b.frequency.value = 55.35;
    const c = ctx.createOscillator(); c.type = 'triangle'; c.frequency.value = 220.4;
    const g = ctx.createGain(); g.gain.value = 0.05;
    const gc = ctx.createGain(); gc.gain.value = 0.008;
    a.connect(g); b.connect(g); c.connect(gc).connect(out); g.connect(out);
    return [a, b, c];
  },
};

/* Samples */

function load(slot, url) {
  if (!buffers.has(slot)) {
    buffers.set(slot, fetch(url)
      .then(res => (res.ok ? res.arrayBuffer() : null))
      .then(data => (data ? ctx.decodeAudioData(data) : null))
      .catch(() => null));
  }
  return buffers.get(slot);
}

// Plays a filled slot (or its synthesized stand-in). Returns a handle with stop(), or null.
// onEnd(false) means the file failed to load or decode.
export function playSlot(slot, { loop = false, gain = 1, pan = 0, fadeIn = 0, onEnd } = {}) {
  if (!on) return null;
  const url = asset(slot);
  if (!url) {
    if (BEDS[slot]) {
      const b = bed(BEDS[slot]);
      b.gain.gain.setTargetAtTime(gain, ctx.currentTime, Math.max(0.05, fadeIn / 3));
      return { stop: (fade = 0.4) => { b.gain.gain.setTargetAtTime(0, ctx.currentTime, fade / 3); setTimeout(b.stop, fade * 1000 + 100); } };
    }
    SYNTH_FALLBACK[slot]?.();
    return null;
  }
  const handle = { stopped: false, src: null, g: null };
  handle.stop = (fade = 0.2) => {
    handle.stopped = true;
    if (!handle.src) return;
    handle.g.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
    const src = handle.src;
    setTimeout(() => { try { src.stop(); } catch { /* ended */ } }, fade * 1000 + 100);
  };
  load(slot, url).then(buffer => {
    if (handle.stopped || !on) return;
    if (!buffer) { onEnd?.(false); return; }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = loop;
    // Skip the encoder padding at each end of an MP3, which would click at every loop.
    if (loop && buffer.duration > 1) { src.loopStart = 0.03; src.loopEnd = buffer.duration - 0.03; }
    const g = ctx.createGain();
    g.gain.setValueAtTime(fadeIn ? 0 : gain, ctx.currentTime);
    if (fadeIn) g.gain.linearRampToValueAtTime(gain, ctx.currentTime + fadeIn);
    let tail = g;
    if (pan && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p);
      tail = p;
    }
    src.connect(g);
    tail.connect(bus[SLOTS[slot].mix]);
    src.onended = () => onEnd?.();
    src.start();
    handle.src = src;
    handle.g = g;
  });
  return handle;
}

const SYNTH_FALLBACK = {
  'sfx-dialup': dialup,
  'sfx-coin-slot': sfx.coin,
  'sfx-crt-on': sfx.crtOn,
  'sfx-fight-bell': sfx.bell,
  'sfx-scratch': () => hiss({ dur: 0.5, gain: 0.04, freq: 5000, q: 2 }),
};

/* Ambience, music and the guide */

const beds = new Map();

export function setAmbience(slots) {
  for (const [slot, handle] of beds) {
    if (!slots.includes(slot)) { handle?.stop(1.5); beds.delete(slot); }
  }
  if (!on) return;
  for (const slot of slots) {
    if (!beds.has(slot)) beds.set(slot, playSlot(slot, { loop: true, fadeIn: 1.5 }));
  }
}

let music = null;
let musicSlot = null;

export function playMusic(slot, { loop = SLOTS[slot]?.loop ?? false, gain = 1, pan = 0 } = {}) {
  const key = `${slot}|${pan}`;
  if (key === musicSlot && music) return;
  music?.stop(1);
  music = null;
  musicSlot = key;
  if (slot && on) music = playSlot(slot, { loop, gain, pan, fadeIn: 0.4, onEnd: () => { if (musicSlot === key) musicSlot = null; } });
}

let voice = null;
let captionTimer = 0;
const heard = new Set();

function duck(down) {
  if (!ctx) return;
  for (const name of ['amb', 'music']) bus[name].gain.setTargetAtTime(down ? 0.18 : (name === 'amb' ? 0.55 : 0.6), ctx.currentTime, 0.2);
}

export function stopGuide() {
  voice?.stop(0.2);
  voice = null;
  clearTimeout(captionTimer);
  duck(false);
  emit('caption', { text: null });
}

// The guide speaks once per stop per visit. The caption shows whether or not sound is on.
export function playGuide(key) {
  const line = GUIDE[key];
  if (!line || heard.has(key)) return;
  heard.add(key);
  stopGuide();
  emit('caption', { text: line.caption });
  const readMs = 2000 + line.caption.split(/\s+/).length * 260;
  const clear = ms => { captionTimer = setTimeout(() => emit('caption', { text: null }), ms); };
  if (on && asset(line.slot)) {
    duck(true);
    // A stopped clip reports its end after the next guide has begun, so only the current clip
    // may clear the caption. A clip that never loads leaves it up for the reading time.
    const clip = playSlot(line.slot, {
      onEnd: played => {
        if (voice !== clip) return;
        voice = null;
        duck(false);
        clear(played === false ? readMs : 600);
      },
    });
    voice = clip;
  } else {
    clear(readMs);
  }
}
