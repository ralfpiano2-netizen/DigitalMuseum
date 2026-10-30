// The 2020s void: one endless feed where every 2000s artifact returns as its descendant. The feed
// times how long the visitor lingers on each zone and leans the next cards that way. Nothing is
// stored or sent; the "algorithm" lives in this tab. The only way out is Pause.
import { ARTIFACTS, ZONES, VOID_NOTES } from '../content.js?v=exhibit-text-2';
import { pickNext } from '../logic.js';
import { sfx, setAmbience, playMusic, isOn } from '../audio.js';
import { $, esc, accession, citeText, img, go, reduceMotion } from '../ui.js';
import { broadcast } from '../scenes.js';

const STILL = {
  'ao-01': 'void-dance', 'ao-04': 'void-concert', 'ao-06': 'void-rider', 'ao-09': 'void-esports',
  'ao-10': 'void-livesell', 'ao-11': 'void-drag', 'ao-12': 'void-concert',
};

const dots = (n, cls) => Array.from({ length: n }, (_, i) => `<i class="${cls}" style="--i:${i}"></i>`).join('');
const scatter = (n, cls) => Array.from({ length: n }, (_, i) =>
  `<i class="${cls}" style="--i:${i};left:${(i * 47) % 94 + 3}%;top:${(i * 29) % 70 + 14}%"></i>`).join('');

// Code-drawn 2020s visuals, used until (or instead of) an HD still for the card.
const VISUAL = {
  'ao-01': '<div class="vv vv-ring"><i></i><b></b></div>',
  'ao-02': '<div class="vv vv-sub"><p>“I’ll wait for you, even in the next life.”</p><span>Next episode</span></div>',
  'ao-03': '<div class="vv vv-next"><b>5</b><p>Next episode in 5</p></div>',
  'ao-04': `<div class="vv vv-sticks">${scatter(36, 'stick')}</div>`,
  'ao-05': `<div class="vv vv-split">${Array.from({ length: 6 }, () => `<div>${broadcast('boxing')}<span>LIVE</span></div>`).join('')}</div>`,
  'ao-06': `<div class="vv vv-map"><svg viewBox="0 0 200 140" aria-hidden="true">
      ${[20, 55, 90, 125].map(y => `<path d="M0 ${y}H200" />`).join('')}${[30, 80, 130, 175].map(x => `<path d="M${x} 0V140" />`).join('')}
      <path id="route-a" class="route" d="M30 125V55H130V20" /><path id="route-b" class="route" d="M175 125H80V90H30" /><path id="route-c" class="route" d="M0 55H175V140" />
      <circle r="4"><animateMotion dur="7s" repeatCount="indefinite"><mpath href="#route-a" /></animateMotion></circle>
      <circle r="4"><animateMotion dur="9s" repeatCount="indefinite"><mpath href="#route-b" /></animateMotion></circle>
      <circle r="4"><animateMotion dur="11s" repeatCount="indefinite"><mpath href="#route-c" /></animateMotion></circle></svg></div>`,
  'ao-07': '<div class="vv vv-inf"><b>∞</b><span>5G</span></div>',
  'ao-08': `<div class="vv vv-grid">${dots(9, 'tile')}</div>`,
  'ao-09': `<div class="vv vv-lobby"><p>Ranked, 5v5</p><p class="vv-dim">Finding a match… 0:42</p><div>${dots(5, 'slot')}</div></div>`,
  'ao-10': '<div class="vv vv-live"><p><span class="vv-badge">LIVE</span> 2.1K watching</p><ul><li>mine! mine!</li><li>mine po, size M</li><li>add to cart na</li><li>budol na naman</li></ul></div>',
  'ao-11': '<div class="vv vv-spot"><i></i></div>',
  'ao-12': '<div class="vv vv-list"><p>Made for you</p><ol><li>Track 1</li><li>Track 2</li><li>Track 3</li><li>Track 4</li></ol></div>',
  'ao-13': '<div class="vv vv-chat"><p class="vv-bubble">gising ka pa?</p><p class="vv-bubble vv-me"><span class="vv-wave"></span>0:14</p><p class="vv-dim">Seen 3:07 AM</p></div>',
  'ao-14': '<div class="vv vv-wallet"><p class="vv-dim">Buy load</p><b>₱30.00</b><p>Paid in 2 seconds</p></div>',
  'ao-15': `<div class="vv vv-net"><svg viewBox="0 0 200 140" aria-hidden="true">${[[100, 70, 30, 30], [100, 70, 170, 25], [100, 70, 40, 115], [100, 70, 165, 120], [100, 70, 100, 10], [30, 30, 40, 115], [170, 25, 165, 120]].map(([a, b, c, d]) => `<path d="M${a} ${b}L${c} ${d}" />`).join('')}${[[100, 70], [30, 30], [170, 25], [40, 115], [165, 120], [100, 10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" />`).join('')}</svg><p>#trending #trending #trending</p></div>`,
  'ao-16': '<div class="vv vv-repost"><b>12,481</b><p>reposts in the last hour</p></div>',
  'ao-17': '<div class="vv vv-two"><div><p>Your mix</p></div><div><p>Their mix</p></div></div>',
  'ao-18': `<div class="vv vv-qr">${dots(49, 'qr')}<p>Scan to pay</p></div>`,
};

// The first pass shows each artifact once, zones interleaved: 1, 2, 3, 1, 2, 3...
export function firstPass() {
  const byZone = [1, 2, 3].map(z => ARTIFACTS.filter(a => a.zone === z));
  return byZone[0].flatMap((_, i) => byZone.map(list => list[i]));
}

const count = n => (n >= 10 ? `${(n / 10).toFixed(1)}K` : String(n * 97));

export function cardEl(a, why = '') {
  const el = document.createElement('article');
  el.className = 'card';
  el.dataset.card = a.id;
  el.dataset.zone = a.zone;
  el.innerHTML = `<div class="card-media"></div>
    <p class="ancestor"><i aria-hidden="true"></i>Was ${accession(a)}, ${esc(a.title)}</p>
    ${why ? `<p class="card-why">${esc(why)}</p>` : ''}
    <h3>${esc(a.now.title)}</h3>
    <p class="card-body">${esc(a.now.body)}</p>
    <p class="card-cite">${esc(citeText(a.now.cite))}</p>
    <div class="card-rail" aria-hidden="true"><span><b></b>${count((a.n * 37) % 90 + 12)}</span><span><b></b>${count((a.n * 13) % 9 + 2)}</span><span><b></b>Share</span></div>`;
  const media = $('.card-media', el);
  const still = STILL[a.id] && img(STILL[a.id]);
  if (still) media.append(still); else media.innerHTML = VISUAL[a.id] ?? '';
  return el;
}

export function mountFeed(voidEl) {
  const feed = $('#feed', voidEl);
  const toasts = $('#toasts', voidEl);
  const timerEl = $('#void-timer', voidEl);
  const pauseBtn = $('#pause-btn', voidEl);
  const weights = { 1: 1, 2: 1, 3: 1 };
  const recent = [];
  let shown = 0;

  const watch = new IntersectionObserver(entries => {
    for (const e of entries) {
      const card = e.target;
      if (e.isIntersecting) card.dataset.seen = String(performance.now());
      else if (card.dataset.seen) {
        weights[card.dataset.zone] += (performance.now() - Number(card.dataset.seen)) / 1000;
        delete card.dataset.seen;
      }
    }
  }, { root: feed, threshold: 0.6 });

  const add = (a, why) => {
    const el = cardEl(a, why);
    feed.insertBefore(el, sentinel);
    // SMIL ignores the reduced-motion stylesheet, so the rider map's dots are paused by hand.
    if (reduceMotion()) for (const svg of el.querySelectorAll('svg')) svg.pauseAnimations();
    watch.observe(el);
    recent.push(a.id);
    if (recent.length > 4) recent.shift();
    shown++;
  };

  // After the first pass the feed recycles, leaning toward the zone the visitor lingers on.
  const more = () => {
    for (let i = 0; i < 6; i++) {
      const a = pickNext(ARTIFACTS, weights, recent);
      const top = Object.entries(weights).sort((x, y) => y[1] - x[1])[0][0];
      const zone = ZONES[Number(top) - 1];
      add(a, Number(top) === a.zone && weights[top] > 2 ? `Because you lingered on Zone ${zone.n}, ${zone.title}` : 'Suggested for you');
    }
    // Keep the DOM bounded: drop the oldest cards and hold the visible card steady. The position
    // is read before the removal, since the shrinking feed clamps it partway through.
    const cards = feed.querySelectorAll('.card');
    if (cards.length > 60) {
      const old = [...cards].slice(0, 18);
      const removed = old.reduce((sum, c) => sum + c.offsetHeight, 0);
      const top = feed.scrollTop;
      for (const c of old) { watch.unobserve(c); c.remove(); }
      feed.scrollTop = top - removed;
    }
  };

  const sentinel = document.createElement('div');
  sentinel.className = 'feed-sentinel';
  feed.append(sentinel);
  for (const a of firstPass()) add(a);
  new IntersectionObserver(entries => { if (entries[0].isIntersecting) more(); }, { root: feed, rootMargin: '0px 0px 200% 0px' }).observe(sentinel);
  // The feed takes the scroll only once the void fills the screen; until then the page scrolls.
  new IntersectionObserver(([e]) => feed.classList.toggle('is-docked', e.intersectionRatio >= 0.97), { threshold: [0, 0.97] }).observe(voidEl);

  /* The pressure: notifications, a counter, a clock that won't hold still. */
  let inVoid = false;
  let seconds = 0;
  let toastTimer = 0;
  let tick = 0;
  let noteIndex = 0;
  const toast = () => {
    const n = VOID_NOTES[noteIndex++ % VOID_NOTES.length];
    const el = document.createElement('p');
    el.className = 'toast';
    el.innerHTML = `<i aria-hidden="true"></i><span><b>${esc(n.app)}</b>${esc(n.text)}</span><time>now</time>`;
    toasts.prepend(el);
    while (toasts.children.length > 3) toasts.lastElementChild.remove();
    setTimeout(() => el.classList.add('is-old'), 4000);
    sfx.ping();
    toastTimer = setTimeout(toast, 7000 + Math.random() * 4000);
  };
  const enter = () => {
    if (inVoid) return;
    inVoid = true;
    toastTimer = setTimeout(toast, 2500);
    tick = setInterval(() => {
      seconds++;
      timerEl.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} in the void`;
      if (seconds === 90) pauseBtn.classList.add('is-nudging');
    }, 1000);
  };
  const leave = () => {
    if (!inVoid) return;
    inVoid = false;
    clearTimeout(toastTimer);
    clearInterval(tick);
    toasts.replaceChildren();
  };
  document.addEventListener('section:enter', ({ detail }) => {
    if (detail.id === 'void') enter(); else leave();
    if (detail.id === 'pause') setTimeout(() => { if (isOn() && document.documentElement.dataset.stop === 'pause') playMusic('music-finale'); }, 3000);
  });

  // Pause: everything goes quiet, then the reading room.
  pauseBtn.addEventListener('click', () => {
    leave();
    setAmbience([]);
    playMusic(null);
    pauseBtn.classList.remove('is-nudging');
    go('pause');
  });
}
