// Zone 1, the TV day. A CRT in the sala, a wall clock that spins to each show's hour, the family
// gathering in front of the set, and the newspaper TV guide that ran the household's schedule.
import { wallet } from '../state.js';
import { sfx, playMusic, playSlot } from '../audio.js';
import { onProgress } from '../scroll.js';
import { $, $$, img, go, esc } from '../ui.js';
import { broadcast } from '../scenes.js';
import { person, FAMILY, NEIGHBORS } from '../sprites.js';

// Each artifact step tunes the set. `day` 1 is the Sunday, so the wall clock spins forward.
const SHOWS = {
  'ao-01': { pic: 'noontime', slot: 'tv-noontime', ch: 7, music: 'music-noontime', time: '12:00 NN', at: '12:00', guide: 'Noontime variety show', who: 'lola bunso' },
  'ao-02': { pic: 'asianovela', slot: 'tv-asianovela', ch: 2, time: '4:00 PM', at: '16:00', guide: 'Asianovela, dubbed in Filipino', who: 'nanay ate' },
  'ao-03': { pic: 'teleserye', slot: 'tv-teleserye', ch: 2, music: 'music-teleserye', time: '7:00 PM', at: '19:00', guide: 'Primetime teleserye', who: 'lola tatay nanay ate bunso' },
  'ao-04': { pic: 'reality', slot: 'tv-reality', ch: 2, time: '9:00 PM', at: '21:00', guide: 'Reality show: eviction night', who: 'tatay ate bunso' },
  'ao-05': { pic: 'boxing', slot: 'tv-boxing', ch: 7, sound: 'sfx-fight-bell', time: 'SUN 11:00 AM', at: '11:00', day: 1, guide: 'Live via satellite: fight night', who: 'lola tatay nanay ate bunso' },
  'ao-06': { pic: 'news', ch: 2, time: 'SUN 9:30 PM', at: '21:30', day: 1, guide: 'Late-night news', who: 'lola tatay nanay ate bunso' },
};

const HOUSEMATES = [['Marlon', 38], ['Cheska', 41], ['Toto', 21]];

function noiseTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 48;
  const g = c.getContext('2d');
  const frame = g.createImageData(64, 48);
  for (let i = 0; i < frame.data.length; i += 4) {
    const v = 80 + Math.random() * 90;
    frame.data[i] = frame.data[i + 1] = frame.data[i + 2] = v;
    frame.data[i + 3] = 255;
  }
  g.putImageData(frame, 0, 0);
  return c.toDataURL();
}

export function mountTV(zone) {
  const host = $('#zone-1-devices', zone);
  host.innerHTML = `
    <div class="wall-clock" aria-hidden="true"><i class="hand hand--h"></i><i class="hand hand--m"></i><b></b></div>
    <div class="door" aria-hidden="true"><i class="door-leaf"></i></div>
    <div class="tv">
      <i class="tv-antenna" aria-hidden="true"></i>
      <div class="tv-body">
        <div class="tv-screen" role="img" aria-label="The television is off">
          <div class="tv-pictures"></div>
          <div class="tv-static"></div>
          <p class="tv-osd" aria-hidden="true"></p>
          <p class="tv-sub" hidden></p>
          <div class="tv-tally" hidden></div>
          <div class="tv-card" hidden></div>
          <div class="tv-glass"></div>
        </div>
        <div class="tv-panel" aria-hidden="true"><i></i><i></i><b></b></div>
      </div>
      <div class="tv-stand" aria-hidden="true"></div>
    </div>
    <div class="family" aria-hidden="true">
      ${NEIGHBORS.map((look, i) => `<i class="sprite sprite--crowd" data-n="${i}">${person({ ...look, standing: true })}</i>`).join('')}
      ${Object.entries(FAMILY).map(([who, look]) => `<i class="sprite sprite--${who}" data-who="${who}">${person(look)}</i>`).join('')}
      <p class="bubble" hidden>Ingat, Ate!</p>
    </div>
    <div class="walkway" aria-hidden="true"><i class="sprite sprite--walk">${person({ ...FAMILY.ate, standing: true, walking: true })}</i></div>`;

  const screen = $('.tv-screen', host);
  const pictures = $('.tv-pictures', host);
  const osd = $('.tv-osd', host);
  const sub = $('.tv-sub', host);
  const tally = $('.tv-tally', host);
  const card = $('.tv-card', host);
  const family = $('.family', host);
  const hands = { h: $('.hand--h', host), m: $('.hand--m', host) };
  $('.tv-static', host).style.backgroundImage = `url(${noiseTexture()})`;
  for (const [id, show] of Object.entries(SHOWS)) {
    const pic = document.createElement('div');
    pic.className = 'tv-pic';
    pic.dataset.for = id;
    const art = show.slot && img(show.slot);
    if (art) pic.append(art); else pic.innerHTML = broadcast(show.pic);
    pictures.append(pic);
  }

  const setClock = (at, day = 0) => {
    const [h, m] = at.split(':').map(Number);
    const total = day * 1440 + h * 60 + m;
    hands.m.style.transform = `rotate(${total * 6}deg)`;
    hands.h.style.transform = `rotate(${total * 0.5}deg)`;
  };
  setClock('12:00');

  const showCard = (title, note, ms = 2600) => {
    card.innerHTML = `<p>${esc(title)}<small>${esc(note)}</small></p>`;
    card.hidden = false;
    clearTimeout(showCard.timer);
    if (ms) showCard.timer = setTimeout(() => { card.hidden = true; }, ms);
  };

  // The rows are built once, so each bar can transition to its new width.
  let votes = HOUSEMATES.map(([, base]) => base);
  tally.innerHTML = HOUSEMATES.map(([name]) => `<p><span>${name}</span><i></i><b></b></p>`).join('');
  const rows = $$('p', tally);
  const drawTally = () => {
    const sum = votes.reduce((a, b) => a + b, 0);
    rows.forEach((row, i) => {
      const pct = Math.round((votes[i] / sum) * 100);
      row.querySelector('i').style.setProperty('--w', pct / 100);
      row.querySelector('b').textContent = `${pct}%`;
    });
  };
  drawTally();

  let current = null;
  let leaving = 0;
  const tune = id => {
    if (id === current) return;
    const wasOn = Boolean(SHOWS[current]);
    current = id;
    const show = SHOWS[id];
    screen.classList.toggle('is-on', Boolean(show));
    screen.setAttribute('aria-label', show ? `On the TV: ${show.guide}` : 'The television is off');
    for (const pic of pictures.children) pic.classList.toggle('is-on', pic.dataset.for === id);
    sub.hidden = id !== 'ao-02';
    tally.hidden = id !== 'ao-04';
    card.hidden = true;
    family.classList.remove('is-dancing', 'is-leaving');
    $('.bubble', family).hidden = true;
    $('[data-act="dance"]', zone)?.setAttribute('aria-pressed', 'false');
    clearTimeout(leaving);
    const who = new Set((show?.who ?? (id === 'zone-1' ? 'lola' : '')).split(' '));
    for (const s of $$('.sprite[data-who]', family)) s.classList.toggle('is-in', who.has(s.dataset.who));
    if (id !== 'ao-05') for (const s of $$('.sprite--crowd', family)) s.classList.remove('is-in');
    zone.querySelector('.door').classList.toggle('is-open', false);
    if (!show) {
      if (wasOn) sfx.crtOff();
      playMusic(null);
      setClock('12:00');
      return;
    }
    setClock(show.at, show.day);
    if (!wasOn) sfx.crtOn();
    sfx.noise(0.25);
    screen.classList.add('is-tuning');
    setTimeout(() => screen.classList.remove('is-tuning'), 320);
    osd.textContent = `CH ${show.ch}`;
    osd.classList.add('is-shown');
    clearTimeout(tune.osd);
    tune.osd = setTimeout(() => osd.classList.remove('is-shown'), 1800);
    playMusic(show.music ?? null);
    if (show.sound) playSlot(show.sound);
    if (id === 'ao-04') drawTally();
    if (id === 'ao-06') {
      // Ate stands and crosses the sala; the door opens as she reaches it.
      leaving = setTimeout(() => {
        family.classList.add('is-leaving');
        leaving = setTimeout(() => {
          zone.querySelector('.door').classList.add('is-open');
          playSlot('sfx-door');
        }, 2200);
      }, 1400);
    }
  };

  // The TV guide hangs in the zone's first label: tap a show to scroll to its hour.
  $('[data-step="zone-1"] .label', zone).insertAdjacentHTML('beforeend', `
    <div class="tv-guide">
      <p class="tv-guide-head"><span>TV Guide</span><span>Weekend</span></p>
      <ul>${Object.entries(SHOWS).map(([id, s]) =>
        `<li><button type="button" data-go="${id}"><time>${s.time}</time><span>${esc(s.guide)}</span></button></li>`).join('')}</ul>
      <p class="tv-guide-note">Tap a show to tune in. In the 2000s you had to be home when it aired.</p>
    </div>`);
  zone.addEventListener('click', e => {
    const listing = e.target.closest('[data-go]');
    if (listing) go(listing.dataset.go);
  });

  const tryRow = (id, html) => { $(`[data-try="${id}"]`, zone).innerHTML = html; };
  tryRow('ao-01', `<button class="btn btn--small" type="button" data-act="dance" aria-pressed="false">Sabayan, dance along</button>`);
  tryRow('ao-02', `<button class="btn btn--small" type="button" data-act="dub" data-lang="orig" aria-pressed="false">Original audio</button>
    <button class="btn btn--small" type="button" data-act="dub" data-lang="fil" aria-pressed="true">Tagalog dub</button>`);
  tryRow('ao-03', `<button class="btn btn--small" type="button" data-act="skip">Skip to the next episode</button><p class="try-status" aria-live="polite"></p>`);
  tryRow('ao-04', `${HOUSEMATES.map(([name]) => `<button class="btn btn--small" type="button" data-act="vote" data-name="${name}">Vote ${name}</button>`).join('')}
    <p class="try-status" aria-live="polite">Each vote is one text, paid from your load.</p>`);
  tryRow('ao-05', `<p class="try-status">Keep scrolling: the neighbors keep arriving.</p>`);
  tryRow('ao-06', `<button class="btn btn--small" type="button" data-act="wave">Ingat, Ate!</button>`);
  sub.textContent = 'Hindi kita iiwan, kahit kailan.';

  zone.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'dance') {
      const dancing = family.classList.toggle('is-dancing');
      btn.setAttribute('aria-pressed', String(dancing));
      playMusic(dancing ? 'music-novelty' : 'music-noontime');
    } else if (act === 'dub') {
      const dub = btn.dataset.lang === 'fil';
      for (const b of $$('[data-act="dub"]', zone)) b.setAttribute('aria-pressed', String(b === btn));
      sub.textContent = dub ? 'Hindi kita iiwan, kahit kailan.' : '[Mandarin dialogue]';
      sfx.tick();
    } else if (act === 'skip') {
      showCard('ABANGAN!', 'Bukas ulit, 7:00 PM');
      $('.try-status', btn.parentElement).textContent = 'No skipping in 2005. The next chapter airs tomorrow, same time.';
    } else if (act === 'vote') {
      const status = $('.try-status', btn.parentElement);
      if (wallet.spend(1)) {
        votes[HOUSEMATES.findIndex(([name]) => name === btn.dataset.name)] += 6;
        drawTally();
        sfx.key();
        status.textContent = `Vote for ${btn.dataset.name} sent. ₱1.00 used.`;
      } else {
        status.textContent = 'Not enough load. A load card waits in Zone 3.';
      }
    } else if (act === 'wave') {
      const bubble = $('.bubble', family);
      bubble.hidden = false;
      clearTimeout(tune.bubble);
      tune.bubble = setTimeout(() => { bubble.hidden = true; }, 2200);
    }
  });

  // Fight night: the sala fills as the visitor scrolls through the bout, with a break midway.
  onProgress($('#ao-05', zone), p => {
    if (current !== 'ao-05') return;
    const crowd = Math.round(Math.min(1, p * 1.4) * NEIGHBORS.length);
    $$('.sprite--crowd', family).forEach((s, i) => s.classList.toggle('is-in', i < crowd));
    const onBreak = p > 0.45 && p < 0.62;
    if (onBreak && card.hidden) showCard('Commercial break', 'Huwag kayong aalis!', 0);
    if (!onBreak && !card.hidden && card.textContent.startsWith('Commercial')) card.hidden = true;
  });

  document.addEventListener('step:enter', ({ detail }) => { if (detail.zone === 1) tune(detail.id); });
  document.addEventListener('section:enter', ({ detail }) => {
    if (detail.id === 'zone-1') tune($('[data-stage]', zone).dataset.active ?? 'zone-1');
    else if (current) { current = null; screen.classList.remove('is-on'); playMusic(null); }
  });
}
