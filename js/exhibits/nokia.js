// Zone 3, under the kumot. The Nokia (multi-tap, one peso a text, an inbox and Snake), the
// scratch-off load card, a 3GP arriving over Bluetooth, one earphone each, and Mama's padala.
import { multitap, KEYMAP } from '../logic.js';
import { wallet } from '../state.js';
import { sfx, playMusic, playSlot } from '../audio.js?v=focused-1';
import { $, $$, esc } from '../ui.js';
import { person } from '../sprites.js';

const REPLIES = ['eow dn! hehe. txt u l8r ;)', 'musta? d2 me sa skul. ingatz!', 'hahaha korni mo! gud nyt :)', 'ok po. GM ko 2 sa lahat ha'];
const MAMA = 'Anak, napadala ko na. Kunin mo bukas sa pawnshop, dalhin ang ID. Miss na kita. Ingat lagi.';
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const LABEL = { '1': '.,?', '0': 'space', '*': '', '#': '' };

// Sounds that arrive late (a reply, a finished transfer) stay quiet once the visitor has left.
const here = () => document.documentElement.dataset.stop === 'zone-3';

export function mountNokia(zone) {
  const host = $('#zone-3-devices', zone);
  host.insertAdjacentHTML('beforeend', `
    <div class="nokia" data-show="zone-3 ao-13 ao-14 ao-18" tabindex="0" role="group" aria-label="Keypad phone. Focus it and type with your number keys.">
      <i class="nokia-speaker" aria-hidden="true"></i>
      <div class="nokia-lcd" aria-live="polite"></div>
      <div class="nokia-soft">
        <button type="button" data-key="menu">Menu</button><button type="button" data-key="send">Send</button><button type="button" data-key="clear">Clear</button>
      </div>
      <div class="nokia-pad">${KEYS.map(k => `<button type="button" data-key="${k}"><b>${k}</b>${LABEL[k] ?? KEYMAP[k].slice(0, -1)}</button>`).join('')}</div>
    </div>
    <div class="loadcard" data-show="ao-14">
      <p class="lc-brand">Prepaid load</p>
      <p class="lc-amount">₱30</p>
      <div class="lc-scratch"><p class="lc-pin" aria-label="Card PIN">7412 0963 5528 1047</p><canvas class="lc-foil" aria-hidden="true"></canvas></div>
      <p class="lc-fine">Scratch gently. Valid for one load only.</p>
    </div>
    <div class="colorphone" data-show="ao-16">
      <div class="cp-screen"><p class="cp-title">Bluetooth</p><div class="cp-body"><p>1 file waiting:<br>sayaw.3gp, 1.2 MB</p></div></div>
      <div class="cp-keys" aria-hidden="true">${'<i></i>'.repeat(12)}</div>
    </div>
    <div class="mp3" data-show="ao-17">
      <div class="mp3-player" aria-hidden="true"><div class="mp3-screen"><p>NOW PLAYING</p><p>Track 03</p></div><i class="mp3-wheel"></i></div>
      <svg class="mp3-cords" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path class="cord cord--a" d="M50 58 C 47 46, 32 38, 27 28" /><path class="cord cord--b" d="M50 58 C 53 46, 68 38, 73 28" />
      </svg>
      <i class="mp3-kid mp3-kid--a" aria-hidden="true">${person({ top: '#3f6fc9', bottom: '#2c3e66' })}</i>
      <i class="mp3-kid mp3-kid--b" aria-hidden="true">${person({ top: '#d94f8a', bottom: '#2c3e66', long: true })}</i>
    </div>
    <div class="stub" data-show="ao-18">
      <p class="stub-head">PADALA</p><p class="stub-sub">Remittance claim stub</p>
      <dl><div><dt>Ref. no.</dt><dd>4815-2236</dd></div><div><dt>Receiver</dt><dd>Janine D.</dd></div><div><dt>Amount</dt><dd>₱2,500.00</dd></div></dl>
      <p class="stub-fine">Present a valid ID at any branch.</p>
    </div>`);

  /* The Nokia */
  const phone = $('.nokia', host);
  const lcd = $('.nokia-lcd', phone);
  let state = { text: '', key: null, t: 0, i: 0 };
  let mode = 'compose';
  let noteTimer = 0;
  let snake = null;
  const inbox = [];
  const balance = () => (wallet.infinite ? 'Unli' : `P${wallet.balance.toFixed(2)}`);

  const render = () => {
    if (mode !== 'compose') return;
    lcd.innerHTML = `<p class="lcd-top"><span>${balance()}</span><span>${160 - state.text.length}/1</span></p><p class="lcd-msg"></p><p class="lcd-keys"><span>Menu</span><span>Send</span><span>Clear</span></p>`;
    const msg = $('.lcd-msg', lcd);
    msg.textContent = state.text;
    msg.insertAdjacentHTML('beforeend', '<i class="lcd-cursor">_</i>');
  };
  const compose = () => { stopSnake(); mode = 'compose'; clearTimeout(noteTimer); render(); };
  const note = (html, ms = 1400, then = compose) => {
    stopSnake();
    mode = 'note';
    lcd.innerHTML = `<div class="lcd-note">${html}</div>`;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(then, ms);
  };
  // A text stays on screen until a key is pressed; 2 and 8 (or the arrow keys) scroll it.
  const read = m => {
    stopSnake();
    mode = 'read';
    clearTimeout(noteTimer);
    lcd.innerHTML = `<div class="lcd-read" lang="fil"><p class="lcd-title">${esc(m.from)}</p><p class="lcd-msg">${esc(m.text)}</p></div>`;
  };
  const scrollRead = dir => $('.lcd-read', lcd)?.scrollBy({ top: (dir * lcd.clientHeight) / 3 });
  const receive = (from, text) => {
    inbox.unshift({ from, text });
    if (inbox.length > 5) inbox.pop();
    if (here()) {
      sfx.sms();
      sfx.vibrate([120, 60, 120]);
    }
    phone.classList.remove('is-buzzing');
    void phone.offsetWidth;
    phone.classList.add('is-buzzing');
    read(inbox[0]);
  };
  const showInbox = () => {
    mode = 'inbox';
    lcd.innerHTML = `<p class="lcd-title">Inbox</p>${inbox.length
      ? `<ol class="lcd-menu">${inbox.map((m, i) => `<li>${i + 1} ${esc(m.from)}</li>`).join('')}</ol>`
      : '<p>No messages</p>'}`;
  };
  const send = () => {
    if (mode !== 'compose') { compose(); return; }
    if (!state.text.trim()) { note('<p>Type a message first</p>'); return; }
    if (!wallet.spend(1)) { note('<p>Not enough load.</p><p>Reload po.</p>', 1800); return; }
    state = { text: '', key: null, t: 0, i: 0 };
    note('<p>Message sent</p>', 1100, () => {
      compose();
      setTimeout(() => receive('Crush', REPLIES[Math.floor(Math.random() * REPLIES.length)]), 700);
    });
  };
  const menu = () => {
    if (mode === 'menu') { compose(); return; }
    stopSnake();
    mode = 'menu';
    lcd.innerHTML = '<p class="lcd-title">Menu</p><ol class="lcd-menu"><li>1 Messages</li><li>2 Games</li><li>3 Balance</li></ol>';
  };
  const press = key => {
    sfx.key();
    if (mode === 'snake') { snake.turn(key); return; }
    if (mode === 'read' && (key === '2' || key === '8')) { scrollRead(key === '2' ? -1 : 1); return; }
    if (mode === 'menu') {
      if (key === '1') showInbox();
      else if (key === '2') startSnake();
      else if (key === '3') note(`<p>Your balance is ${balance()}.</p><p>Valid until 12/31/2005.</p>`, 2600);
      return;
    }
    if (mode === 'inbox') {
      const m = inbox[Number(key) - 1];
      if (m) read(m); else compose();
      return;
    }
    if (mode !== 'compose') { compose(); return; }
    state = multitap(state, key, performance.now());
    render();
  };
  const soft = key => {
    if (key === 'menu') menu();
    else if (key === 'send') send();
    else if (key === 'clear') {
      if (mode !== 'compose') { compose(); return; }
      state = { ...state, text: state.text.slice(0, -1), key: null };
      sfx.key();
      render();
    }
  };

  phone.addEventListener('click', e => {
    const btn = e.target.closest('[data-key]');
    if (!btn) return;
    const key = btn.dataset.key;
    if (KEYMAP[key]) press(key); else soft(key);
  });
  // Number keys type only while the phone (or one of its keys) has focus.
  phone.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const onButton = e.target.closest('button');
    if (KEYMAP[e.key]) { e.preventDefault(); press(e.key); }
    else if (e.key === 'Backspace') { e.preventDefault(); soft('clear'); }
    else if (e.key === 'Enter' && !onButton) { e.preventDefault(); soft('send'); }
    else if (mode === 'read' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); scrollRead(e.key === 'ArrowUp' ? -1 : 1); }
    else if (mode === 'snake' && e.key.startsWith('Arrow')) {
      e.preventDefault();
      snake.turn({ ArrowUp: '2', ArrowDown: '8', ArrowLeft: '4', ArrowRight: '6' }[e.key]);
    }
  });
  document.addEventListener('wallet', () => render());

  /* Snake II, hidden in Menu, 2 Games. It wraps at the walls, like the original. */
  function startSnake() {
    mode = 'snake';
    lcd.innerHTML = '<canvas class="lcd-snake" width="84" height="48" aria-label="Snake. Use 2, 4, 6 and 8 to steer."></canvas>';
    const g = $('canvas', lcd).getContext('2d');
    const W = 21;
    const H = 10;
    let body = [{ x: 10, y: 5 }, { x: 9, y: 5 }, { x: 8, y: 5 }];
    let dir = { x: 1, y: 0 };
    let next = dir;
    let score = 0;
    const freeCell = () => {
      for (;;) {
        const c = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
        if (!body.some(s => s.x === c.x && s.y === c.y)) return c;
      }
    };
    let food = freeCell();
    const draw = () => {
      g.fillStyle = '#b7c79a';
      g.fillRect(0, 0, 84, 48);
      g.fillStyle = '#26321c';
      g.fillRect(0, 7, 84, 1);
      g.font = '6px monospace';
      g.fillText(String(score).padStart(4, '0'), 1, 6);
      for (const s of body) g.fillRect(s.x * 4, 8 + s.y * 4, 3, 3);
      g.fillRect(food.x * 4 + 1, 8 + food.y * 4, 1, 3);
      g.fillRect(food.x * 4, 8 + food.y * 4 + 1, 3, 1);
    };
    const tick = () => {
      dir = next;
      const head = { x: (body[0].x + dir.x + W) % W, y: (body[0].y + dir.y + H) % H };
      if (body.some(s => s.x === head.x && s.y === head.y)) {
        stopSnake();
        sfx.timeUp();
        note(`<p>Game over</p><p>Score ${score}</p>`, 2400);
        return;
      }
      body.unshift(head);
      if (head.x === food.x && head.y === food.y) { score += 7; sfx.tick(); food = freeCell(); } else body.pop();
      draw();
    };
    const DIRS = { '2': { x: 0, y: -1 }, '8': { x: 0, y: 1 }, '4': { x: -1, y: 0 }, '6': { x: 1, y: 0 } };
    snake = {
      timer: setInterval(tick, 170),
      turn: key => {
        const d = DIRS[key];
        if (d && (d.x !== -dir.x || d.y !== -dir.y)) next = d;
      },
    };
    let swipe = null;
    lcd.onpointerdown = e => { swipe = { x: e.clientX, y: e.clientY }; };
    lcd.onpointerup = e => {
      if (!swipe || mode !== 'snake') return;
      const dx = e.clientX - swipe.x;
      const dy = e.clientY - swipe.y;
      swipe = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
      snake.turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? '6' : '4') : (dy > 0 ? '8' : '2'));
    };
    draw();
  }
  function stopSnake() {
    if (!snake) return;
    clearInterval(snake.timer);
    snake = null;
  }

  /* The load card: scratch the foil (or press the button) to reveal the PIN, then load it once. */
  const foil = $('.lc-foil', host);
  const fg = foil.getContext('2d', { willReadFrequently: true });
  let painted = false;
  let revealed = false;
  let loaded = false;
  const paintFoil = () => {
    foil.width = foil.clientWidth || 200;
    foil.height = foil.clientHeight || 40;
    fg.globalCompositeOperation = 'source-over';
    fg.fillStyle = '#c0c4c8';
    fg.fillRect(0, 0, foil.width, foil.height);
    fg.fillStyle = '#8e959c';
    for (let i = 0; i < 160; i++) fg.fillRect(Math.random() * foil.width, Math.random() * foil.height, 2, 1);
  };
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    foil.classList.add('is-gone');
    $('[data-try="ao-14"] .try-status', zone).textContent = 'PIN revealed. Load it to your phone.';
  };
  const scratchAt = e => {
    const box = foil.getBoundingClientRect();
    fg.globalCompositeOperation = 'destination-out';
    fg.beginPath();
    fg.arc((e.clientX - box.left) * (foil.width / box.width), (e.clientY - box.top) * (foil.height / box.height), 9, 0, Math.PI * 2);
    fg.fill();
  };
  let scratching = false;
  let strokes = 0;
  foil.addEventListener('pointerdown', e => { scratching = true; try { foil.setPointerCapture(e.pointerId); } catch { /* pointer gone */ } scratchAt(e); });
  foil.addEventListener('pointermove', e => {
    if (!scratching || revealed) return;
    scratchAt(e);
    if (++strokes % 6) return;
    playSlot('sfx-scratch');
    const alpha = fg.getImageData(0, 0, foil.width, foil.height).data;
    let clear = 0;
    for (let i = 3; i < alpha.length; i += 4) if (alpha[i] === 0) clear++;
    if (clear / (alpha.length / 4) >= 0.6) reveal();
  });
  foil.addEventListener('pointerup', () => { scratching = false; });
  $('[data-try="ao-14"]', zone).innerHTML = `<button class="btn btn--small" type="button" data-act="scratch">Scratch it all</button>
    <button class="btn btn--small" type="button" data-act="load">Load ₱30</button><p class="try-status" aria-live="polite">Scratch the silver strip on the card.</p>`;

  $('[data-try="ao-13"]', zone).innerHTML = `<p class="try-status">Tap the keys, or select the phone and type with your number keys. Menu hides a game.</p>`;

  /* 3GP over Bluetooth: wait out the transfer, then watch a few blocky seconds. */
  const cpBody = $('.cp-body', host);
  let transfer = 0;
  let clip = 0;
  let received = false;
  const playClip = () => {
    cpBody.innerHTML = '<canvas class="cp-clip" width="44" height="36" aria-label="A grainy 3GP clip of someone dancing"></canvas><p class="cp-name">sayaw.3gp</p>';
    const g = $('canvas', cpBody).getContext('2d');
    let f = 0;
    clearInterval(clip);
    clip = setInterval(() => {
      f++;
      g.fillStyle = '#2c3e66';
      g.fillRect(0, 0, 44, 36);
      g.fillStyle = '#4a2a12';
      g.fillRect(0, 28, 44, 8);
      const up = f % 2;
      const x = 18 + (Math.floor(f / 4) % 2 ? 2 : -2);
      g.fillStyle = '#1e1e1e';
      g.fillRect(x + 2, 9 - up, 4, 4);
      g.fillStyle = '#d94f8a';
      g.fillRect(x, 13 - up, 8, 8);
      g.fillStyle = '#e0ac7e';
      g.fillRect(x - 2, up ? 9 : 14, 2, 6);
      g.fillRect(x + 8, up ? 14 : 9, 2, 6);
      g.fillStyle = '#2f6fb3';
      g.fillRect(x + 1, 21 - up, 3, 7);
      g.fillRect(x + 4, 21 - up, 3, 7);
      for (let i = 0; i < 40; i++) {
        g.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
        g.fillRect(Math.floor(Math.random() * 11) * 4, Math.floor(Math.random() * 9) * 4, 4, 4);
      }
      if (f > 72) { clearInterval(clip); cpBody.insertAdjacentHTML('beforeend', '<p class="cp-name">End of clip</p>'); }
    }, 1000 / 12);
  };
  const accept = () => {
    if (received) { playClip(); return; }
    clearInterval(transfer);
    let pct = 0;
    cpBody.innerHTML = '<p>Receiving sayaw.3gp</p><div class="cp-bar"><i></i></div><p class="cp-pct">0%</p>';
    cpStatus.textContent = 'Receiving sayaw.3gp over Bluetooth.';
    transfer = setInterval(() => {
      pct = Math.min(100, pct + 1.25);
      $('.cp-bar i', cpBody).style.width = `${pct}%`;
      $('.cp-pct', cpBody).textContent = `${Math.floor(pct)}% of 1.2 MB`;
      if (pct < 100) return;
      clearInterval(transfer);
      received = true;
      $('[data-act="accept"]', zone).textContent = 'Play again';
      cpStatus.textContent = 'Received. Playing sayaw.3gp.';
      if (here()) sfx.ping();
      playClip();
    }, 100);
  };
  $('[data-try="ao-16"]', zone).innerHTML = `<button class="btn btn--small" type="button" data-act="accept">Accept the file</button><p class="try-status" aria-live="polite"></p>`;
  const cpStatus = $('[data-try="ao-16"] .try-status', zone);

  /* One earphone each: sharing hands the other ear away, so you hear one side. */
  const mp3 = $('.mp3', host);
  $('[data-try="ao-17"]', zone).innerHTML = `<button class="btn btn--small" type="button" data-act="mp3" aria-pressed="false">Play track 03</button>
    <button class="btn btn--small" type="button" data-act="share" aria-pressed="false">Share an earbud</button>`;

  /* Mama's padala text. */
  $('[data-try="ao-18"]', zone).innerHTML = `<button class="btn btn--small" type="button" data-act="mama">Read Mama’s text</button>
    <button class="btn btn--small" type="button" data-act="reply">Reply to Mama</button><p class="try-status" aria-live="polite"></p>`;

  zone.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const status = $('.try-status', btn.parentElement);
    if (act === 'scratch') {
      fg.clearRect(0, 0, foil.width, foil.height);
      reveal();
    } else if (act === 'load') {
      if (!revealed) status.textContent = 'Scratch the card first to see the PIN.';
      else if (loaded) status.textContent = 'This card is used up. Each card loads once.';
      else {
        loaded = true;
        wallet.add(30);
        receive('8888', `You have loaded P30.00. Your balance is ${balance()}.`);
        status.textContent = `Loaded. Your balance is now ₱${wallet.balance.toFixed(2)}.`;
      }
    } else if (act === 'accept') {
      if (!received) btn.textContent = 'Receiving…';
      accept();
    } else if (act === 'mp3') {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      btn.textContent = on ? 'Stop' : 'Play track 03';
      const shared = mp3.classList.contains('is-shared');
      playMusic(on ? 'music-novelty' : null, { pan: shared ? 0.9 : 0 });
    } else if (act === 'share') {
      const shared = mp3.classList.toggle('is-shared');
      btn.setAttribute('aria-pressed', String(shared));
      if ($('[data-act="mp3"]', zone).getAttribute('aria-pressed') === 'true') playMusic('music-novelty', { pan: shared ? 0.9 : 0 });
    } else if (act === 'mama') {
      read({ from: 'Mama', text: MAMA });
    } else if (act === 'reply') {
      if (wallet.spend(1)) {
        note('<p>Message sent</p><p class="lcd-msg">Thank u ma! ingat po kau jan. miss u!</p>', 2600);
        status.textContent = 'Reply sent. ₱1.00 used.';
      } else {
        note('<p>Not enough load.</p>', 1800);
        status.textContent = 'Not enough load. There is a load card back at AO-14.';
      }
    }
  });

  let mamaSent = false;
  document.addEventListener('step:enter', ({ detail }) => {
    if (detail.zone !== 3) { stopSnake(); return; }
    if (detail.id !== 'ao-13') stopSnake();
    // The foil is painted once, so a half-scratched card survives leaving and coming back.
    if (detail.id === 'ao-14' && !painted) { painted = true; requestAnimationFrame(paintFoil); }
    if (detail.id === 'ao-18' && !mamaSent) { mamaSent = true; setTimeout(() => receive('Mama', MAMA), 600); }
    if (detail.id !== 'ao-17') {
      mp3.classList.remove('is-shared');
      for (const b of $$('[data-act="mp3"], [data-act="share"]', zone)) b.setAttribute('aria-pressed', 'false');
      $('[data-act="mp3"]', zone).textContent = 'Play track 03';
      playMusic(null);
    }
  });
  render();
}
