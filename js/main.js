import { presentMediaHTML } from './present-media.js?v=focused-10';
// Boot: render every label and dialog from the content modules, fill asset slots, then drive the
// HUD, the passport and each stage from the scroll observers.
import { SITE, ZONES, ARTIFACTS, LOBBY_NOTES, CREDITS } from './content.js?v=focused-10';
import { COMPARISONS, DOCUMENT_REFERENCES, DOCUMENT_SCOPE, SYNOPSIS, CLOSING } from './exhibit-text.js?v=exhibit-text-2';
import { SLOTS } from './slots.js';
import { loadIndex } from './assets.js';
import { wallet, passport } from './state.js';
import { watchSteps, watchSections, watchProgress } from './scroll.js';
import { placeholder } from './scenes.js';
import { $, $$, esc, accession, citeText, img, go, reduceMotion, emit } from './ui.js';
import { mountFeed } from './exhibits/feed.js?v=focused-10';
import { mountTransitions } from './exhibits/transitions.js?v=focused-1';
import { mountTV } from './exhibits/tvguide.js?v=focused-1';
import { mountStreet } from './exhibits/pisonet.js?v=focused-1';
import { mountNokia } from './exhibits/nokia.js?v=focused-1';
import { mountChainText } from './exhibits/chaintext.js?v=focused-1';
import { enable, disable, isOn, sfx, setAmbience, playMusic, playGuide, stopGuide } from './audio.js?v=focused-1';
import { artifactCardMediaHTML, artifactMediaHTML, archiveMediaHTML, mediaCreditsHTML, mountMedia } from './media.js?v=focused-10';

const BY_ID = Object.fromEntries(ARTIFACTS.map(a => [a.id, a]));
const ZONE_BY_ID = Object.fromEntries(ZONES.map(z => [z.id, z]));
const DOMAINS = ['Social', 'Economic', 'Political', 'Cultural', 'Environmental', 'Aesthetics'];
const LENSES = ['Time', 'Space', 'Technology', 'Overall'];
const LENS_LABEL = { Time: 'time', Space: 'space', Technology: 'technology', Overall: 'overall trend' };
// Scrubbed steps (the fight crowd, the chain text) run two screens long. They are sized here,
// before the asset index loads, so a reload restores the scroll against the final page height.
const LONG = new Set(['ao-05', 'ao-15']);

/* Rendering */

// Link the supplied author–date citations to their source without changing their wording.
function documentText(text) {
  const aliases = { 'A. K. S. Ong et al.': 'Ong, A. K.', 'J. C. Ong et al.': 'Ong, J. C., Fallorina',
    'J. C. Ong & Tapsell': 'Ong, J. C., & Tapsell', 'Messenger & Ghosheh': 'Messenger,',
    'Anoc & Cruz': 'Anoc,', 'Anarcon & Maglipon': 'Anarcon, J. P., & Maglipon', 'Rico & de Leon': 'Rico,' };
  return text.split(/(\([^()]*(?:(?:19|20)\d{2}[ab]?|n\.d\.)[^()]*\))/g).map(part => {
    if (!part.startsWith('(')) return esc(part);
    return '(' + part.slice(1, -1).split('; ').map(citation => {
      const match = citation.match(/^(.*), ((?:19|20)\d{2}[ab]?|n\.d\.)$/);
      if (!match) return esc(citation);
      const author = match[1], year = match[2];
      const prefix = aliases[author] || author.replace(/ et al\.$/, '').split(' & ')[0];
      const ref = DOCUMENT_REFERENCES.find(ref => ref.apa.startsWith(prefix) && ref.apa.includes('(' + year));
      return ref?.url ? `<a href="${esc(ref.url)}" target="_blank" rel="noopener noreferrer">${esc(citation)}</a>` : esc(citation);
    }).join('; ') + ')';
  }).join('');
}
function documentReferencesHTML() {
  return `<p>${esc(DOCUMENT_SCOPE)}</p><ul class="ref-list">${DOCUMENT_REFERENCES.map(ref => `<li>${ref.url ? `<a href="${esc(ref.url)}" target="_blank" rel="noopener noreferrer">${esc(ref.apa)}</a>` : esc(ref.apa)}</li>`).join('')}</ul>`;
}
function comparisonHTML(c, era = '') {
  return `<details class="archive-card document-comparison" id="${c.id}"><summary><span>${esc(c.domain)} · ${esc(LENS_LABEL[c.lens])}</span><h3>${esc(c.title)}</h3></summary><div class="comparison-copy"><p>${esc(c.intro)}</p>
    ${era !== '2020s' ? `<h4>2000s</h4><p>${documentText(c.past)}</p>` : ''}
    ${era !== '2000s' ? `<h4>2020s</h4><p>${documentText(c.present)}</p>` : ''}
    <h4>Synthesis</h4><p>${documentText(c.synthesis)}</p></div></details>`;
}

const SHORT_LABELS = {
  'ao-01': 'SexBomb’s “The Spageti Song” became a dance craze in 2003. Noontime performances made its choreography part of shared entertainment routines (Gloria, 2026).',
  'ao-02': 'Meteor Garden became a Philippine viewing phenomenon in 2003. Following its story and stars gave audiences shared references within the television schedule (Flores, 2003).',
  'ao-03': 'Pangako Sa ’Yo attracted audiences during its original 2000–2002 run. Following a story meant making room for it in the day’s television schedule (ABS-CBN, 2022; Anarcon & Maglipon, 2020).',
  'ao-04': 'StarStruck launched in 2003, followed by Pinoy Big Brother in 2005. Reality formats gave viewers reasons to keep following performers and participants as their stories developed (Anarcon, 2019; Sabio, 2025).',
  'ao-05': 'On fight Sundays, neighbors gathered around a television to follow Pacquiao’s bouts. This reconstructed scene recalls the shared anticipation of a live broadcast.',
  'ao-06': 'BPO work connected Philippine workers to international service operations. Night shifts changed local routines around customers elsewhere, raising questions about working hours and conditions (Messenger & Ghosheh, 2010).',
  'ao-07': 'A coin slot, a monitor, and a few minutes online. This reconstructed PisoNet scene recalls neighborhood access shared, timed, and paid for in small amounts.',
  'ao-08': 'Friendster gave users a profile to visit and a way to make friendship visible. Internet cafés provided access for people without convenient connections at home (DigitalFilipino, 2007; Glasner, 2005).',
  'ao-09': 'Computer shops combined digital play with company in the same room. Students gathered to play Ragnarok Online; Netopia and neighborhood cafés also offered research and social networking (Gokongwei-Cheng, 2003; Limos, 2021).',
  'ao-10': 'Mall of Asia opened in 2006 and TriNoma in 2007. Shopping, food, and shared leisure met in a physical destination, with participation shaped by commercial power and unequal access (GMANews.TV, 2007b; Rico & de Leon, 2017).',
  'ao-11': 'Salons and local pageants frame this comparison of space and queer expression. Cabalfin’s 2000 publication is verified through a catalog; claims about these particular venues remain curatorial questions, with safety and acceptance varying by setting (Cabalfin, 2000).',
  'ao-12': 'Kamikazee and Sponge Cola were part of the decade’s band culture. Both appeared in the 2006 Kami nAPO Muna tribute project, a record of their presence in the music scene (The Philippine Star, 2006).',
  'ao-13': 'Prepaid access and relatively affordable SMS helped make mobile conversation familiar. Texting developed its own shorthand and etiquette, while cost still shaped how messages were exchanged (Lichauco, 2001).',
  'ao-14': 'Scratch a card and enter a code: physical money became digital access. Level Up! prepaid cards gave Ragnarok players paid access to the game (Gokongwei-Cheng, 2003).',
  'ao-15': 'During EDSA II in January 2001, SMS circulated information and calls to assemble. Rafael examines the phone together with the crowd, including class assumptions about political participation (Rafael, 2003).',
  'ao-16': 'Phones carried media as well as messages. Nokia’s 2003 announcement for the 6600 documented video clips and local sharing through Bluetooth and infrared (Nokia, 2003).',
  'ao-17': 'Two people, one player, one earphone each. This reconstructed scene recalls music as something people carried and shared with someone beside them.',
  'ao-18': 'Remittance counters connected money sent across distance with families at home. Reporting described Cebuana Lhuillier expanding its transfer partnerships in 2006 (Torres, 2006).',
};

function detailedStoryHTML(details) {
  const paragraphs = list => list.map(text => `<p>${esc(text)}</p>`).join('');
  return `<p class="story-intro">${esc(details.intro)}</p><h3>2000s · Carrying a music collection</h3>${paragraphs(details.past)}<h3>2020s · Discovery, sharing, and gathering</h3>${paragraphs(details.present)}<h3>What connects them</h3><p>${esc(details.connection)}</p><details class="story-sources"><summary>Sources for this comparison</summary><ul>${details.sources.map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a></li>`).join('')}</ul></details>`;
}

function renderArtifactStory(a) {
  const c = COMPARISONS.find(c => c.id === a.comparison);
  $('#artifact-read-title').textContent = a.title;
  $('#artifact-read-body').innerHTML = `<article class="artifact-story">
    ${a.details ? detailedStoryHTML(a.details) : c ? `<p class="story-intro">${esc(c.intro)}</p><h3>2000s</h3><p>${documentText(c.past)}</p><h3>2020s</h3><p>${documentText(c.present)}</p><h3>What connects them</h3><p>${documentText(c.synthesis)}</p>` : `<p>${esc(a.body)}</p><h3>2020s</h3><p>${esc(a.now.body)}</p><p class="label-cite is-note">${esc(a.note)}</p>`}
    ${a.details ? artifactCardMediaHTML(a.id) : artifactMediaHTML(a.id)}
    <h3>Present-day visual</h3>${presentMediaHTML(a.id)}
    ${c ? '<p class="story-note">Author–date links open the supporting sources. The Archive contains all 21 comparisons and the full reference list.</p>' : ''}
    <button class="btn btn--plain" type="button" data-open="archive-dialog">Explore all 21 comparisons</button></article>`;
}

function stepHTML(a) {
  const no = accession(a);
  const long = LONG.has(a.id);
  return `<article class="step${long ? ' is-long' : ''}"${long ? ' data-progress' : ''} id="${a.id}" data-step="${a.id}" aria-labelledby="${a.id}-title">
    <div class="label" data-label="${a.id}">
      <div class="label-head"><span class="label-no">${no}</span><span>${esc(a.when)}, ${esc(a.medium.toLowerCase())}</span></div>
      <h3 id="${a.id}-title">${esc(a.title)}</h3>
      ${artifactCardMediaHTML(a.id)}
      <p class="label-body">${documentText(SHORT_LABELS[a.id] || a.body)}</p>
      <div class="label-actions"><button class="btn btn--small" type="button" data-read-artifact="${a.id}" aria-haspopup="dialog">Read more</button></div>
      <details class="label-interaction" hidden><summary>Try the exhibit</summary><div class="try" data-try="${a.id}"></div></details>
      ${!a.comparison ? '<p class="label-cite is-note">Supplemental curatorial scene</p>' : ''}
      <span class="stamp" aria-hidden="true">${no}<br>stamped</span>
    </div>
  </article>`;
}

function renderSteps() {
  for (const z of ZONES) {
    const intro = `<article class="step" data-step="${z.id}">
      <div class="label label-intro" role="group" aria-label="Zone ${z.n} introduction, ${esc(z.title)}"><div class="label-head"><span class="label-no">Zone ${z.n}</span><span>Zone introduction</span></div>
      <p class="label-body">${esc(z.intro)}</p></div></article>`;
    $(`[data-zone-steps="${z.n}"]`).innerHTML = intro + ARTIFACTS.filter(a => a.zone === z.n).map(stepHTML).join('');
  }
}

function renderMap() {
  const zone = z => `<a class="map-stop" href="#${z.id}"><strong>Zone ${z.n}: ${esc(z.title)}</strong><small>${esc(z.place)}</small></a>
    <ul class="map-artifacts">${ARTIFACTS.filter(a => a.zone === z.n).map(a =>
      `<li><a href="#${a.id}" data-map-artifact="${a.id}"><span>${accession(a)}</span>${esc(a.title)}</a></li>`).join('')}</ul>`;
  $('#map-body').innerHTML = `
    <div class="map-wing"><a class="map-stop" href="#lobby"><strong>Lobby</strong><small>2026, the ticket</small></a></div>
    <div class="map-wing"><h3>Wing 1, “${esc(SITE.wing2000)}”, the 2000s</h3>${ZONES.map(zone).join('')}
      <a class="map-stop" href="#signoff"><strong>Sign-off</strong><small>23:59, the broadcast day ends</small></a></div>
    <div class="map-wing"><a class="map-stop" href="#upgrade"><strong>The upgrade</strong><small>The 2010s in a few seconds</small></a></div>
    <div class="map-wing"><h3>Wing 2, the 2020s</h3>
      <a class="map-stop" href="#void"><strong>${esc(SITE.wing2020)}</strong><small>One endless feed</small></a>
      <a class="map-stop" href="#pause"><strong>Your pause</strong><small>Conclusion, credits and references</small></a></div>
    <div class="map-wing menu-tools"><button class="btn" type="button" data-open="passport-dialog">Your passport</button><button class="btn" type="button" data-open="archive-dialog">All 21 comparisons & references</button><button class="btn btn--plain" id="extra-effects" type="button" aria-pressed="false">Extra effects: off</button></div>`;
}

function markMap() {
  for (const a of $$('[data-map-artifact]')) a.classList.toggle('is-stamped', passport.has(a.dataset.mapArtifact));
}

function renderPassport() {
  $('#passport-body').innerHTML = `
    <p class="passport-summary">${passport.count()} of 18 artifacts stamped. A label is stamped after it has been on screen for a second.</p>
    <div class="passport-grid">${ARTIFACTS.map(a =>
      `<a class="passport-slot${passport.has(a.id) ? ' is-stamped' : ''}" data-zone="${a.zone}" href="#${a.id}"><span><b>${accession(a)}</b>${esc(a.title)}${passport.has(a.id) ? '<span class="sr-only">, stamped</span>' : ''}</span></a>`).join('')}</div>`;
}

function renderArchive() {
  const chips = (name, values, all) => `<fieldset><legend>${name}</legend>${[all, ...values].map((v, i) =>
    `<label class="chip"><input type="radio" name="${name.toLowerCase()}" value="${i ? v : ''}"${i ? '' : ' checked'}><span>${v}</span></label>`).join('')}</fieldset>`;
  $('#archive-body').innerHTML = `
    <details class="archive-section document-synopsis"><summary>About the 21 comparisons</summary>${SYNOPSIS.map(text => `<p>${esc(text)}</p>`).join('')}<p>The 21 comparisons below accompany 18 interactive stops. Three supplemental scenes—Pacquiao fight Sunday, PisoNet and the MP3 player—remain curatorial interpretations outside the supplied exhibit text.</p></details>
    <details class="archive-filter-panel"><summary>Filter comparisons</summary><form class="filters" id="archive-filters">${chips('Domain', DOMAINS, 'All')}${chips('Lens', LENSES, 'All')}${chips('Era', ['2000s', '2020s'], 'Both')}</form></details>
    <p class="archive-count" id="archive-count"></p><div id="archive-media"></div>
    <div class="archive-list" id="archive-list"></div>
    <section class="archive-section"><h3>References for the exhibit text</h3>${documentReferencesHTML()}</section>`;
  const form = $('#archive-filters');
  const draw = () => {
    const f = new FormData(form);
    const [d, l, e] = ['domain', 'lens', 'era'].map(k => f.get(k));
    const rows = COMPARISONS.filter(c => (!d || c.domain === d) && (!l || c.lens === l));
    $('#archive-media').innerHTML = archiveMediaHTML(d, l, e);
    $('#archive-count').textContent = `${rows.length} of ${COMPARISONS.length} artifact comparisons${e ? ' · ' + e + ' with synthesis' : ''}`;
    $('#archive-list').innerHTML = rows.map(c => comparisonHTML(c, e)).join('');
  };
  form.addEventListener('change', draw);
  draw();
}

function renderFinale() {
  $('#conclusion').textContent = CLOSING[0];
  $('#impacts').innerHTML = CLOSING.slice(1).map(text => `<p>${esc(text)}</p>`).join('');
  $('#credits').innerHTML = `<details><summary id="credits-title">Credits & media sources</summary>
    <p class="credit-ai">${esc(SITE.group)}, ${esc(SITE.project)}</p>
    <ul class="credit-list">${CREDITS.members.map(m => `<li>${esc(m.name)}: ${esc(m.role)}</li>`).join('')}</ul>
    <p class="credit-ai">${esc(CREDITS.ai)}</p>${mediaCreditsHTML()}</details>`;
  $('#references').innerHTML = `<details><summary id="references-title">References & research notes</summary>
    ${documentReferencesHTML()}</details>`;
  updateFinalePassport();
}

function updateFinalePassport() {
  const n = passport.count();
  $('#finale-passport').textContent = n === 18
    ? 'You collected all 18 interactive artifacts. Explore the Archive for all 21 comparisons and their synthesis.'
    : `You collected ${n} of 18 artifacts. The map can take you back to the rest.`;
}

function fillSlots() {
  const debug = new URLSearchParams(location.search).has('slots');
  for (const el of $$('[data-slot-bg]')) {
    const slot = el.dataset.slotBg;
    const art = img(slot, SLOTS[slot]?.alt ?? '');
    if (art) { el.append(art); continue; }
    if (el.dataset.placeholder) el.insertAdjacentHTML('beforeend', placeholder(el.dataset.placeholder));
    else el.dataset.placeholderOn = '';
    if (debug) el.insertAdjacentHTML('beforeend', `<span class="ph-tag">${slot}</span>`);
  }
}

/* The lobby: the present, buzzing. */

const TILE = { GCash: '#2f6fb3', Messenger: '#6e7bff', TikTok: '#2a2a33', Shopee: '#e5793b', Calendar: '#b23a2e' };
const clockNow = () => new Date().toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' }).replace(/\s?[ap]\.?m\.?$/i, '');

function lobby() {
  $('#lock-date').textContent = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' });
  $('#lock-notes').replaceChildren();
}

// A gentle auto-scroll from the ticket through the rewind. Any input from the visitor stops it
// (a press too, so a map jump made mid-glide is not dragged back), and so does a second glide.
const GLIDE_STOPPERS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
let stopGlide = null;

function glide(target, ms = 4600) {
  stopGlide?.();
  if (reduceMotion()) { target.scrollIntoView(); return; }
  const root = document.documentElement;
  const start = scrollY;
  const end = target.getBoundingClientRect().top + scrollY;
  const t0 = performance.now();
  let raf = 0;
  const stop = () => {
    stopGlide = null;
    cancelAnimationFrame(raf);
    root.style.scrollBehavior = '';
    for (const type of GLIDE_STOPPERS) removeEventListener(type, stop);
  };
  stopGlide = stop;
  root.style.scrollBehavior = 'auto';
  for (const type of GLIDE_STOPPERS) addEventListener(type, stop, { passive: true });
  const tick = now => {
    const k = Math.min(1, (now - t0) / ms);
    const ease = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
    scrollTo(0, start + (end - start) * ease);
    if (k < 1) raf = requestAnimationFrame(tick); else stop();
  };
  raf = requestAnimationFrame(tick);
}

/* HUD, stages and the passport */

const hudClock = $('#hud-clock');
let liveClock = true;

function setClock(text) {
  liveClock = text === null;
  hudClock.textContent = liveClock ? clockNow() : text;
}

function tickNow() {
  $('#lock-time').textContent = clockNow();
  if (liveClock) hudClock.textContent = clockNow();
}

function showWallet({ balance, infinite }) {
  $('#hud-load-value').textContent = infinite ? '∞' : `₱${balance.toFixed(2)}`;
}

// The address bar follows the visitor. Chrome scrolls to the URL's fragment after restoring a
// reload, so a stale one would pull the visitor back to their last jump; a current one is also a
// link to where they are. Safari limits how often the URL may change, so a refused update is skipped.
function mark(id) {
  try { history.replaceState(null, '', id === 'lobby' ? location.pathname + location.search : `#${id}`); } catch { /* rate-limited */ }
}

function onSection(section) {
  const root = document.documentElement;
  const era = section.dataset.era;
  root.dataset.era = era;
  root.dataset.sky = section.dataset.sky ?? '';
  root.dataset.stop = section.id;
  $('#hud-load').hidden = !['2000', '2010', '2020'].includes(era);
  if (era === '2000') wallet.setInfinite(false);
  if (era === '2020') wallet.setInfinite(true);
  const id = section.id;
  if (id === 'lobby' || id === 'pause') setClock(null);
  else if (id === 'rewind') setClock($('#rewind-year').textContent);
  else if (id === 'signoff') setClock('23:59');
  else if (id === 'upgrade') setClock($('#upgrade-year').textContent);
  else if (id === 'void') setClock('--:--');
  else if (ZONE_BY_ID[id]) {
    // The step observer may fire before or after this one, so read the middle line directly.
    const mid = innerHeight / 2;
    const step = $$('.step', section).find(s => { const box = s.getBoundingClientRect(); return box.top <= mid && box.bottom >= mid; });
    const active = step?.dataset.step ?? id;
    activate(section, active);
    setClock(BY_ID[active]?.clock ?? ZONE_BY_ID[id].clock);
    mark(active);
  }
  if (!ZONE_BY_ID[id]) mark(id);
  if (id === 'pause') updateFinalePassport();
  emit('section:enter', { id, era });
}

// Points a zone's stage at a step (or at the zone itself, its intro) and swaps the scene layers.
function activate(zoneEl, id) {
  const stage = zoneEl.querySelector('[data-stage]');
  stage.dataset.active = id;
  for (const layer of $$('[data-show]', stage)) {
    const shows = layer.dataset.show.split(' ');
    const on = shows.includes('*') || shows.includes(id);
    layer.classList.toggle('is-on', on);
    if (on) layer.removeAttribute('aria-hidden'); else layer.setAttribute('aria-hidden', 'true');
  }
}

function onStep(step) {
  const id = step.dataset.step;
  const zoneEl = step.closest('.zone');
  if (zoneEl) activate(zoneEl, id);
  mark(id);
  setClock(BY_ID[id]?.clock ?? ZONE_BY_ID[id]?.clock ?? null);
  emit('step:enter', { id, zone: Number(zoneEl?.dataset.zone) });
}

function watchStamps() {
  for (const a of ARTIFACTS) if (passport.has(a.id)) $(`[data-label="${a.id}"]`)?.classList.add('is-stamped');
  const timers = new Map();
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      const id = e.target.dataset.label;
      if (e.intersectionRatio >= 0.6) {
        if (!timers.has(id)) timers.set(id, setTimeout(() => { timers.delete(id); passport.stamp(id); }, 1000));
      } else {
        clearTimeout(timers.get(id));
        timers.delete(id);
      }
    }
  }, { threshold: [0, 0.6] });
  for (const el of $$('.label[data-label]')) io.observe(el);
  document.addEventListener('stamp', ({ detail }) => {
    $(`[data-label="${detail.id}"]`)?.classList.add('is-stamped');
    $('#hud-count').textContent = detail.count;
    const btn = $('#hud-passport');
    btn.classList.remove('is-bumped');
    void btn.offsetWidth;
    btn.classList.add('is-bumped');
    markMap();
  });
  $('#hud-count').textContent = passport.count();
}

function wireDialogs() {
  const open = id => {
    for (const d of $$('dialog[open]')) d.close();
    if (id === 'passport-dialog') renderPassport();
    if (id === 'map-dialog') markMap();
    $(`#${id}`).showModal();
  };
  $('#hud-map').addEventListener('click', () => open('map-dialog'));
  $('#hud-passport').addEventListener('click', () => open('passport-dialog'));
  document.addEventListener('click', e => {
    const reader = e.target.closest('[data-read-artifact]');
    if (reader) {
      renderArtifactStory(BY_ID[reader.dataset.readArtifact]);
      open('artifact-dialog');
      $('#artifact-read-body').scrollTop = 0;
      return;
    }
    const effects = e.target.closest('#extra-effects');
    if (effects) {
      const enabled = document.documentElement.dataset.effects !== 'on';
      document.documentElement.dataset.effects = enabled ? 'on' : 'off';
      effects.setAttribute('aria-pressed', String(enabled));
      effects.textContent = `Extra effects: ${enabled ? 'on' : 'off'}`;
      emit('effects:change', { enabled });
      return;
    }
    const comparison = e.target.closest('[data-comparison]');
    if (comparison) {
      const form = $('#archive-filters');
      form.reset();
      form.dispatchEvent(new Event('change'));
      open('archive-dialog');
      document.getElementById(comparison.dataset.comparison).open = true;
      requestAnimationFrame(() => document.getElementById(comparison.dataset.comparison)?.scrollIntoView({ block: 'start' }));
      return;
    }
    const opener = e.target.closest('[data-open]');
    if (opener) { open(opener.dataset.open); return; }
    if (e.target.closest('[data-close]')) { e.target.closest('dialog').close(); return; }
    if (e.target instanceof HTMLDialogElement) { e.target.close(); return; }
    const link = e.target.closest('a[href^="#"]');
    if (link && link.hash.length > 1) {
      e.preventDefault();
      link.closest('dialog')?.close();
      go(link.hash.slice(1));
    }
  });
}

function wireTicket() {
  const enter = () => {
    $('.ticket').classList.add('is-torn');
    if (isOn()) playGuide('lobby');
    glide($('#zone-1'), 1800);
  };
  // Not awaited: on iOS the resume can stay pending, and the visit must start regardless.
  $('#enter-sound').addEventListener('click', () => { enable(); enter(); });
  $('#enter-silent').addEventListener('click', enter);
}

// Room sound per stop; zone 2 switches to the LAN cafe while its step is active.
const AMBIENCE = { 'zone-1': ['amb-sala'], 'zone-2': ['amb-street'], 'zone-3': ['amb-night'], void: ['amb-void'] };
const GUIDED = new Set(['zone-1', 'zone-2', 'zone-3', 'void']);
const STOP_MUSIC = { void: 'music-void', pause: 'music-finale' };
const streetBed = () => ($('#zone-2 [data-stage]').dataset.active === 'ao-09' ? ['amb-lan'] : ['amb-street']);

function wireSound() {
  let beds = [];
  const root = document.documentElement;
  const button = $('#hud-sound');
  button.addEventListener('click', () => (isOn() ? disable() : enable()));
  document.addEventListener('sound', ({ detail }) => {
    button.setAttribute('aria-pressed', String(detail.on));
    button.textContent = detail.on ? 'Sound on' : 'Sound off';
    root.classList.toggle('sound-on', detail.on);
    if (!detail.on) { stopGuide(); return; }
    setAmbience(beds);
    if (GUIDED.has(root.dataset.stop)) playGuide(root.dataset.stop);
    if (STOP_MUSIC[root.dataset.stop]) playMusic(STOP_MUSIC[root.dataset.stop]);
  });
  document.addEventListener('section:enter', ({ detail: { id } }) => {
    // onSection has already pointed the stage at the step on the middle line.
    beds = id === 'zone-2' ? streetBed() : AMBIENCE[id] ?? [];
    setAmbience(beds);
    playMusic(id === 'void' ? 'music-void' : null);
    if (isOn() && GUIDED.has(id)) playGuide(id);
  });
  document.addEventListener('step:enter', ({ detail: { zone } }) => {
    if (zone !== 2) return;
    beds = streetBed();
    setAmbience(beds);
  });
  document.addEventListener('stamp', () => { if (document.documentElement.dataset.effects === 'on') { sfx.stamp(); sfx.vibrate(15); } });
  // The bar shows the caption; an always-rendered region outside it announces it.
  const bar = $('#caption');
  const live = $('[data-captions]');
  document.addEventListener('caption', ({ detail }) => {
    bar.hidden = !detail.text;
    if (detail.text) $('#caption-text').textContent = detail.text;
    live.textContent = detail.text ?? '';
  });
  $('#caption-skip').addEventListener('click', stopGuide);
}

async function boot() {
  if (reduceMotion()) document.documentElement.classList.add('reduce-motion');
  renderSteps();
  renderMap();
  renderArchive();
  renderFinale();
  // The ticket and the HUD work before the asset index arrives, however slow the connection.
  wireDialogs();
  mountMedia();
  wireSound();
  wireTicket();
  await loadIndex();
  fillSlots();
  mountFeed($('#void'));
  mountTransitions();
  mountTV($('#zone-1'));
  mountStreet($('#zone-2'));
  mountNokia($('#zone-3'));
  mountChainText($('#zone-3'));
  for (const row of $$('.try')) row.closest('.label-interaction').hidden = row.childElementCount === 0;
  for (const z of ZONES) activate($(`#${z.id}`), z.id);
  lobby();
  setClock(null);
  tickNow();
  setInterval(tickNow, 15000);
  document.addEventListener('wallet', e => showWallet(e.detail));
  showWallet(wallet);
  watchStamps();
  watchSections(onSection);
  watchSteps(onStep);
  watchProgress();
  // A reload keeps the browser's restored position; only a fresh visit jumps to the link's target.
  const reload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  if (location.hash.length > 1 && !reload) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
}

boot();
