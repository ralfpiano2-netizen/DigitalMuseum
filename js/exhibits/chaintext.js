// AO-15: "Go 2 EDSA. Wear blck." spreads phone to phone, three contacts at a time, until the
// phones gather into the crowd at the shrine. Scroll drives it; "Forward" pushes it a hop ahead.
import { onProgress } from '../scroll.js';
import { sfx } from '../audio.js';
import { $ } from '../ui.js';

const COUNT = 54;
const CONTACTS = 3;

// A small seeded generator, so the network looks the same on every visit.
function seeded(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function mountChainText(zone) {
  const host = $('#zone-3-devices', zone);
  host.insertAdjacentHTML('beforeend', `
    <div class="chain" data-show="ao-15">
      <canvas class="chain-canvas" aria-hidden="true"></canvas>
      <p class="chain-sms">Go 2 EDSA. Wear blck.</p>
    </div>`);
  const canvas = $('.chain-canvas', host);
  const rand = seeded(2001);
  const nodes = Array.from({ length: COUNT }, (_, i) => ({
    x: 0.08 + rand() * 0.84,
    y: 0.2 + rand() * 0.34,
    tx: 0.06 + (i % 9) * 0.11 + (Math.floor(i / 9) % 2) * 0.05,
    ty: 0.66 + Math.floor(i / 9) * 0.045,
    hop: Infinity,
    from: -1,
  }));
  for (const n of nodes) n.contacts = Array.from({ length: CONTACTS }, () => Math.floor(rand() * COUNT));
  // Hop distances from the first phone, breadth first.
  nodes[0].hop = 0;
  const queue = [0];
  while (queue.length) {
    const i = queue.shift();
    for (const c of nodes[i].contacts) {
      if (nodes[c].hop === Infinity) { nodes[c].hop = nodes[i].hop + 1; nodes[c].from = i; queue.push(c); }
    }
  }

  let manual = 0;
  let progress = 0;
  let shownHops = -1;
  const hops = () => Math.max(manual, Math.floor(progress * 7));
  const status = () => $('[data-try="ao-15"] .try-status', zone);

  const draw = () => {
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    const g = canvas.getContext('2d');
    const { width: w, height: h } = canvas;
    const reach = hops();
    const gather = Math.min(1, Math.max(0, (progress - 0.62) / 0.3));
    const ease = gather * gather * (3 - 2 * gather);
    g.clearRect(0, 0, w, h);
    const at = n => [(n.x + (n.tx - n.x) * ease) * w, (n.y + (n.ty - n.y) * ease) * h];
    g.strokeStyle = 'rgba(183, 199, 154, 0.55)';
    g.lineWidth = 1;
    for (const n of nodes) {
      if (n.hop > reach || n.from < 0 || ease > 0.5) continue;
      const [x1, y1] = at(nodes[n.from]);
      const [x2, y2] = at(n);
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.stroke();
    }
    const size = Math.max(4, Math.round(w / 70));
    let lit = 0;
    for (const n of nodes) {
      const on = n.hop <= reach;
      if (on) lit++;
      const [x, y] = at(n);
      if (ease > 0.5) {
        g.fillStyle = '#1e1e1e';
        g.fillRect(x - size, y - size, size * 2, size * 2.6);
        if (on) { g.fillStyle = '#b7c79a'; g.fillRect(x - size / 2, y - size * 2.4, size, size * 1.2); }
      } else {
        if (on) { g.fillStyle = 'rgba(183, 199, 154, 0.25)'; g.fillRect(x - size * 1.4, y - size * 1.8, size * 2.8, size * 3.6); }
        g.fillStyle = on ? '#b7c79a' : '#2c3e66';
        g.fillRect(x - size / 2, y - size * 0.8, size, size * 1.6);
      }
    }
    if (reach !== shownHops) {
      if (reach > shownHops && shownHops >= 0) sfx.key();
      shownHops = reach;
      if (status()) status().textContent = ease > 0.5 ? 'They met at the shrine.' : `Reached ${lit} of ${COUNT} phones.`;
    }
  };

  $('[data-try="ao-15"]', zone).innerHTML = `<button class="btn btn--small" type="button" data-act="forward">Forward to 3 friends</button><p class="try-status" aria-live="polite">Reached 1 of ${COUNT} phones.</p>`;
  zone.addEventListener('click', e => {
    if (!e.target.closest('[data-act="forward"]')) return;
    manual = Math.min(7, hops() + 1);
    draw();
  });

  onProgress($('#ao-15', zone), p => { progress = p; draw(); });
  document.addEventListener('step:enter', ({ detail }) => { if (detail.id === 'ao-15') requestAnimationFrame(draw); });
}
