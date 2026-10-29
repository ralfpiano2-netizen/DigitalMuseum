// Pure helpers shared by the exhibits and tools/check.mjs. No DOM here.

export const KEYMAP = {
  '1': '.,?!1', '2': 'abc2', '3': 'def3', '4': 'ghi4', '5': 'jkl5', '6': 'mno6',
  '7': 'pqrs7', '8': 'tuv8', '9': 'wxyz9', '0': ' 0', '*': '*', '#': '#',
};

// Nokia multi-tap: the same key inside the window cycles its letters, anything else
// appends. 160 characters is the SMS limit.
export function multitap(state, key, now, windowMs = 900) {
  const chars = KEYMAP[key];
  if (!chars) return state;
  if (key === state.key && now - state.t < windowMs && state.text) {
    const i = (state.i + 1) % chars.length;
    return { text: state.text.slice(0, -1) + chars[i], key, t: now, i };
  }
  if (state.text.length >= 160) return state;
  return { text: state.text + chars[0], key, t: now, i: 0 };
}

// The void's "algorithm": a weighted pick by zone that skips recently shown cards.
export function pickNext(pool, weights, recentIds = [], rand = Math.random) {
  const fresh = pool.filter(card => !recentIds.includes(card.id));
  const items = fresh.length ? fresh : pool;
  const w = items.map(card => Math.max(0, weights[card.zone] ?? 0));
  const total = w.reduce((a, b) => a + b, 0);
  if (!total) return items[Math.floor(rand() * items.length)];
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= w[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

const minutes = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const pad = n => String(n).padStart(2, '0');

// Interpolates a 24-hour clock between two times; p is clamped to 0..1.
export function clockAt(from, to, p) {
  const t = Math.round(minutes(from) + (minutes(to) - minutes(from)) * Math.min(1, Math.max(0, p)));
  return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`;
}

export function formatTimer(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}
