// Zone 2, the street. A PisoNet that sells online time by the peso, the Friendster page inside it,
// the LAN cafe's time slip, the mall mirror, the parlor's final question and the gig flyer wall.
import { formatTimer } from '../logic.js';
import { sfx, playMusic, playSlot } from '../audio.js?v=focused-1';
import { $, $$, go, esc } from '../ui.js';

const PESO_SECONDS = 300;
const SPEED = 10;

const r = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;

// The mall mirror's paper doll. A plain face: no features, like the rest of the wing's people.
function avatar({ hair, pants }) {
  const HAIR = {
    shag: r(7, 2, 10, 3, '#1e1e1e') + r(6, 4, 2, 9, '#1e1e1e') + r(16, 4, 2, 9, '#1e1e1e') + r(8, 5, 3, 2, '#1e1e1e') + r(13, 5, 3, 2, '#1e1e1e'),
    emo: r(7, 2, 10, 3, '#1e1e1e') + r(7, 5, 7, 4, '#1e1e1e') + r(16, 4, 1, 7, '#1e1e1e'),
    spiky: r(7, 3, 10, 2, '#4a2a12') + r(8, 1, 2, 2, '#4a2a12') + r(11, 0, 2, 3, '#4a2a12') + r(14, 1, 2, 2, '#4a2a12'),
  };
  const PANTS = {
    denim: r(7, 24, 10, 2, '#8b5a2b') + r(7, 26, 4, 11, '#2f6fb3') + r(13, 26, 4, 11, '#2f6fb3') + r(7, 23, 10, 1, '#ffffff'),
    cargo: r(7, 22, 10, 3, '#8e959c') + r(7, 25, 4, 12, '#8e959c') + r(13, 25, 4, 12, '#8e959c') + r(7, 29, 2, 3, '#5a5a5a') + r(15, 29, 2, 3, '#5a5a5a'),
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40" shape-rendering="crispEdges" role="img" aria-label="Y2K outfit: ${hair} hair, ${pants === 'denim' ? 'low-waist denim' : 'cargo pants'}">` +
    r(8, 4, 8, 9, '#e0ac7e') + r(11, 13, 2, 2, '#e0ac7e') + r(6, 15, 12, 9, '#3f6fc9') + r(9, 17, 6, 4, '#f2d24b') +
    r(4, 16, 2, 8, '#e0ac7e') + r(18, 16, 2, 8, '#e0ac7e') + PANTS[pants] + r(6, 37, 5, 3, '#f7f2e6') + r(13, 37, 5, 3, '#f7f2e6') + HAIR[hair] +
    '</svg>';
}

const TESTIMONIALS = [
  ['kristel_xoxo', 'jan! salamat sa pagiging bestfriend q since grade 4. ingatz lagi! mwah :)'],
  ['MaRk_SkaTeR', 'tol astig ng profile mo. pa-add naman sa YM ko. rock on \\m/'],
  ['Tita Baby', 'Anak, wag kang magpuyat sa computer shop ha. God bless!'],
];

const FLYERS = [
  ['Kalye Riot', 'Live sa Cubao', 'Fri 9 PM'],
  ['Sinag Avenue', 'Acoustic night', 'Sat 8 PM'],
  ['The Jeepney Saints', 'Album launch', 'Sun 7 PM'],
];

const CHAT = [
  '[All] PC03_Bea: sino may extra zeny?',
  '[Team] PC05_Rico: rush mid! rush mid!',
  '[All] PC07_Jun: pa-extend po kuya, isang oras!',
  '[All] Bantay: 10 minutes na lang, PC 07',
];

export function mountStreet(zone) {
  const host = $('#zone-2-devices', zone);
  host.innerHTML = `
    <div class="pisonet" data-show="zone-2 ao-07">
      <p class="pisonet-sign" aria-hidden="true">PISONET</p>
      <div class="pisonet-monitor"><div class="pisonet-screen"></div></div>
      <div class="pisonet-slot">
        <span class="pisonet-rate">₱1 = 5:00</span>
        <i class="pisonet-hole" aria-hidden="true"></i>
        <button class="coin" type="button" aria-label="Drop ₱1 in the coin slot">₱1</button>
      </div>
    </div>
    <div class="fs" data-show="ao-08">
      <div class="fs-chrome" aria-hidden="true"><i></i><i></i><i></i><span>friendster.com/profile</span><b class="fs-clock">00:00</b></div>
      <div class="fs-page">
        <p class="fs-glitter">~*WeLcOmE 2 mY pRoFiLe*~</p>
        <div class="fs-top">
          <div class="fs-photo" aria-hidden="true"></div>
          <div class="fs-info"><p class="fs-name">~*JaNiNe*~</p><p>Single, 16, Marikina</p><p>Who I want to meet: lahat kayo! add me po ^_^</p></div>
        </div>
        <p class="fs-song"><span>Profile song</span><button class="btn btn--small" type="button" data-act="song" aria-pressed="false">Play</button></p>
        <ol class="fs-testis" lang="fil">${TESTIMONIALS.map(([who, text]) => `<li><b>${esc(who)}</b> ${esc(text)}</li>`).join('')}</ol>
      </div>
      <div class="fs-out" hidden><p>Time’s up</p><button class="btn btn--small" type="button" data-act="coin">Drop ₱1</button></div>
    </div>
    <div class="lan" data-show="ao-09">
      <div class="lan-slip"><p>PC 07</p><p class="lan-time">01:00:00</p><p>Time left</p></div>
      <ol class="lan-chat" aria-label="In-game chat">${CHAT.map(line => `<li>${esc(line)}</li>`).join('')}</ol>
    </div>
    <div class="mirror" data-show="ao-10"><div class="mirror-glass">${avatar({ hair: 'shag', pants: 'denim' })}</div></div>
    <div class="qa" data-show="ao-11">
      <div class="qa-card">
        <div class="qa-face qa-front"><p class="qa-kicker">Final question</p><p>Candidate number 8, if you could save one thing from the 2000s, what would it be, and why?</p></div>
        <div class="qa-face qa-back"><p class="qa-kicker">Her answer</p><p>The PisoNet, because one peso taught us that time is precious. And to my barangay, I love you all! Thank you!</p></div>
      </div>
    </div>
    <div class="flyers" data-show="ao-12">${FLYERS.map(([band, what, when], i) =>
      `<button class="flyer flyer--${i}" type="button" data-act="gig" data-band="${esc(band)}"><b>${esc(band)}</b><span>${esc(what)}</span><span>${esc(when)}</span></button>`).join('')}</div>`;

  /* The PisoNet: each peso buys five minutes, run here at ten times speed. The Friendster page
     runs on the same clock, and goes dark if the time runs out while it is open. */
  const screen = $('.pisonet-screen', host);
  const coin = $('.coin', host);
  const fsClock = $('.fs-clock', host);
  const fsOut = $('.fs-out', host);
  $('[data-try="ao-07"]', zone).innerHTML = '<p class="try-status" aria-live="polite">Drag the coin into the slot, or tap it.</p>';
  const status = $('[data-try="ao-07"] .try-status', zone);
  let seconds = 0;
  let timer = 0;
  const clocks = () => {
    const time = $('.ps-time', screen);
    if (time) time.textContent = formatTimer(seconds);
    fsClock.textContent = formatTimer(seconds);
  };
  const idle = (title, note) => {
    screen.innerHTML = `<p class="ps-title">${title}</p><p class="ps-blink">Insert coin</p>${note ? `<p class="ps-note">${note}</p>` : ''}`;
  };
  const desktop = () => {
    screen.innerHTML = `<p class="ps-time">${formatTimer(seconds)}</p>
      <div class="ps-icons">
        <button type="button" data-go="ao-08"><i class="ico ico--fs"></i>Friendster</button>
        <button type="button" data-go="ao-09" aria-label="Ragnarok Online"><i class="ico ico--ro"></i>RO</button>
        <button type="button" data-go="ao-09"><i class="ico ico--dota"></i>DotA</button>
        <button type="button" data-go="ao-08" aria-label="Internet Explorer"><i class="ico ico--ie"></i>IE</button>
      </div>`;
  };
  const insert = () => {
    seconds += PESO_SECONDS;
    sfx.coin();
    playSlot('sfx-coin-slot');
    coin.classList.remove('is-dropping');
    void coin.offsetWidth;
    coin.classList.add('is-dropping');
    desktop();
    clocks();
    fsOut.hidden = true;
    status.textContent = `₱1 in. ${formatTimer(seconds)} on the clock.`;
    if (timer) return;
    timer = setInterval(() => {
      seconds -= 1;
      clocks();
      if (seconds > 0) return;
      clearInterval(timer);
      timer = 0;
      seconds = 0;
      if (document.documentElement.dataset.stop === 'zone-2') sfx.timeUp();
      idle('Time’s up', '“Kuya, ako na!”');
      status.textContent = 'Time’s up. Another peso buys five more minutes.';
      if ($('[data-stage]', zone).dataset.active === 'ao-08') fsOut.hidden = false;
    }, 1000 / SPEED);
  };
  idle('PisoNet', '');

  // Drag the coin onto the slot, or tap it (a tap or Enter drops it straight in).
  let drag = null;
  coin.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, y: e.clientY, moved: false };
    try { coin.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
  });
  coin.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) coin.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  coin.addEventListener('pointerup', e => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    coin.style.transform = '';
    if (!moved) return;
    // A mouse drag ends with a click on the coin, which must not drop a second peso. Touch sends
    // no click, so the flag clears right after either way.
    coin.dataset.dragged = '1';
    setTimeout(() => delete coin.dataset.dragged);
    const hole = $('.pisonet-hole', host).getBoundingClientRect();
    const near = Math.hypot(e.clientX - (hole.left + hole.width / 2), e.clientY - (hole.top + hole.height / 2)) < 70;
    if (near) insert();
  });
  coin.addEventListener('click', () => {
    if (coin.dataset.dragged) { delete coin.dataset.dragged; return; }
    insert();
  });

  /* Friendster: a profile song that waits for a tap, and testimonials that stay on this device. */
  const testis = $('.fs-testis', host);
  $('[data-try="ao-08"]', zone).innerHTML = `
    <form class="testi-form" novalidate>
      <label for="testi-input">Write a testimonial</label>
      <div class="testi-row"><input id="testi-input" name="testi" maxlength="140" autocomplete="off" placeholder="ingatz lagi! :)"><button class="btn btn--small" type="submit">Post</button></div>
      <p class="testi-error" id="testi-error" role="alert" hidden>Write something first.</p>
    </form>`;
  const form = $('.testi-form', zone);
  const input = $('#testi-input', zone);
  const error = $('#testi-error', zone);
  input.addEventListener('input', () => { error.hidden = true; input.removeAttribute('aria-invalid'); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', 'testi-error');
      return;
    }
    const li = document.createElement('li');
    const who = document.createElement('b');
    who.textContent = 'You';
    li.append(who, ` ${text}`);
    testis.prepend(li);
    input.value = '';
    sfx.tick();
  });

  /* LAN cafe: the hour runs down; "Pa-extend!" buys another. */
  const lanTime = $('.lan-time', host);
  let lanSeconds = 3600;
  let lanTimer = 0;
  const lanTick = () => {
    lanSeconds = Math.max(0, lanSeconds - 20);
    const h = Math.floor(lanSeconds / 3600);
    lanTime.textContent = `${String(h).padStart(2, '0')}:${formatTimer(lanSeconds % 3600)}`;
    if (!lanSeconds) {
      clearInterval(lanTimer);
      lanTimer = 0;
      if (document.documentElement.dataset.stop === 'zone-2') sfx.timeUp();
    }
  };
  $('[data-try="ao-09"]', zone).innerHTML = `<button class="btn btn--small" type="button" data-act="extend">Pa-extend! One more hour</button><p class="try-status" aria-live="polite"></p>`;

  /* The mall mirror. */
  const look = { hair: 'shag', pants: 'denim' };
  $('[data-try="ao-10"]', zone).innerHTML = `
    <div class="seg" role="group" aria-label="Hair"><span>Hair</span>
      <button class="btn btn--small" type="button" data-act="hair" data-value="shag" aria-pressed="true">Shag</button>
      <button class="btn btn--small" type="button" data-act="hair" data-value="emo" aria-pressed="false">Emo</button>
      <button class="btn btn--small" type="button" data-act="hair" data-value="spiky" aria-pressed="false">Spiky</button></div>
    <div class="seg" role="group" aria-label="Pants"><span>Pants</span>
      <button class="btn btn--small" type="button" data-act="pants" data-value="denim" aria-pressed="true">Low-waist</button>
      <button class="btn btn--small" type="button" data-act="pants" data-value="cargo" aria-pressed="false">Cargo</button></div>`;

  /* The parlor's final question. */
  $('[data-try="ao-11"]', zone).innerHTML = `<button class="btn btn--small" type="button" data-act="answer" aria-pressed="false">Hear her answer</button>`;

  /* The flyer wall. */
  $('[data-try="ao-12"]', zone).innerHTML = `<p class="try-status" aria-live="polite">Tap a flyer to hear the band.</p>`;

  zone.addEventListener('click', e => {
    const jump = e.target.closest('[data-go]');
    if (jump) { go(jump.dataset.go); return; }
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'coin') {
      insert();
    } else if (act === 'song') {
      const playing = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(playing));
      btn.textContent = playing ? 'Pause' : 'Play';
      playMusic(playing ? 'music-profile' : null);
    } else if (act === 'extend') {
      lanSeconds += 3600;
      lanTick();
      if (!lanTimer) lanTimer = setInterval(lanTick, 1000);
      sfx.coin();
      $('.try-status', btn.parentElement).textContent = 'Extended. Bantay adds an hour to PC 07.';
    } else if (act === 'hair' || act === 'pants') {
      look[act] = btn.dataset.value;
      for (const b of $$(`[data-act="${act}"]`, zone)) b.setAttribute('aria-pressed', String(b === btn));
      $('.mirror-glass', host).innerHTML = avatar(look);
      sfx.tick();
    } else if (act === 'answer') {
      const shown = $('.qa-card', host).classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', String(shown));
      btn.textContent = shown ? 'Back to the question' : 'Hear her answer';
      if (shown) playSlot('sfx-crowd-cheer');
    } else if (act === 'gig') {
      for (const f of $$('.flyer', host)) f.classList.toggle('is-playing', f === btn);
      playMusic('music-gig');
      $('[data-try="ao-12"] .try-status', zone).textContent = `Now playing: ${btn.dataset.band}, live.`;
    }
  });

  document.addEventListener('step:enter', ({ detail }) => {
    if (detail.zone !== 2) return;
    if (detail.id !== 'ao-08') fsOut.hidden = true;
    if (detail.id === 'ao-09' && !lanTimer) lanTimer = setInterval(lanTick, 1000);
    if (detail.id !== 'ao-09' && lanTimer) { clearInterval(lanTimer); lanTimer = 0; }
    if (!['ao-08', 'ao-12'].includes(detail.id)) {
      playMusic(null);
      const song = $('[data-act="song"]', zone);
      song.setAttribute('aria-pressed', 'false');
      song.textContent = 'Play';
      for (const f of $$('.flyer', host)) f.classList.remove('is-playing');
    }
  });
}
