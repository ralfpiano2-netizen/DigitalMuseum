// Small DOM helpers shared by main.js and the exhibits.
import { REFERENCES } from './sheet.js';
import { SLOTS } from './slots.js';
import { asset } from './assets.js';

const REF = Object.fromEntries(REFERENCES.map(r => [r.id, r]));

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const accession = a => `AO-${String(a.n).padStart(2, '0')}`;
export const citeText = ids => ids.map(id => REF[id].short).join('; ');
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// An <img> for a filled slot, or null so the caller keeps its placeholder.
export function img(slot, alt = SLOTS[slot]?.alt ?? '') {
  const src = asset(slot);
  if (!src) return null;
  const el = new Image();
  el.src = src;
  el.alt = alt;
  el.decoding = 'async';
  el.loading = 'lazy';
  return el;
}

// Jumps are instant: a smooth scroll would pass every stop on the way and set each one off.
// Focus follows the jump, so keyboard and screen-reader visitors land where the page did.
export function go(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'instant', block: 'start' });
  if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
  el.focus({ preventScroll: true });
  history.replaceState(null, '', `#${id}`);
}

export function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}
