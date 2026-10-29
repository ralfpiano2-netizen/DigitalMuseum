// Scroll state without scroll listeners. A one-line band at the middle of the viewport decides
// the active step and section; a rAF loop runs only while a [data-progress] block is in view and
// writes its progress to --p (0 at its top edge, 1 when its bottom reaches the viewport bottom).
// ponytail: main-thread scroll work; move hot scenes to animation-timeline: view() if low-end Android stutters.

const MIDDLE = { rootMargin: '-50% 0px -50% 0px' };

function watchMiddle(selector, onEnter) {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) onEnter(e.target);
  }, MIDDLE);
  document.querySelectorAll(selector).forEach(el => io.observe(el));
  return io;
}

export const watchSteps = onEnter => watchMiddle('.step', onEnter);
export const watchSections = onEnter => watchMiddle('main > section', onEnter);

const listeners = new Map();
const live = new Set();
const last = new WeakMap();
let raf = 0;

export function onProgress(el, fn) {
  if (!listeners.has(el)) listeners.set(el, []);
  listeners.get(el).push(fn);
}

function frame() {
  raf = 0;
  const vh = window.innerHeight;
  for (const el of live) {
    const box = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - vh)));
    if (last.get(el) === p) continue;
    last.set(el, p);
    el.style.setProperty('--p', p.toFixed(4));
    for (const fn of listeners.get(el) ?? []) fn(p);
  }
  if (live.size) raf = requestAnimationFrame(frame);
}

export function watchProgress() {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) e.isIntersecting ? live.add(e.target) : live.delete(e.target);
    if (live.size && !raf) raf = requestAnimationFrame(frame);
  }, { rootMargin: '25% 0px' });
  document.querySelectorAll('[data-progress]').forEach(el => io.observe(el));
}
