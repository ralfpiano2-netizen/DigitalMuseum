// Which asset slots are filled. tools/assets.mjs writes assets/index.json; anything not listed
// is never requested, so an empty slot costs no request and shows its placeholder instead.
import { SLOTS } from './slots.js';

let filled = new Set();

export async function loadIndex() {
  try {
    const res = await fetch('assets/index.json', { cache: 'no-cache' });
    if (res.ok) filled = new Set(await res.json());
  } catch {
    filled = new Set();
  }
}

export function asset(slot) {
  const spec = SLOTS[slot];
  if (!spec || !filled.has(slot)) return null;
  if (spec.kind === 'audio') return `assets/audio/${slot}.mp3`;
  return `assets/img/${slot}.${spec.hd ? 'webp' : 'png'}`;
}
