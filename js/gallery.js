import { COMPARISONS, DOCUMENT_REFERENCES, DOCUMENT_SCOPE, CLOSING } from './exhibit-text.js?v=exhibit-text-2';
import { MEDIA } from './media.js?v=exhibit-text-2';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TOPICS = [
  { domain: 'Social', title: 'Staying connected', description: 'Friendship and play, across places and screens.' },
  { domain: 'Economic', title: 'Working and shopping', description: 'The places we work, the things we buy, and how money moves.' },
  { domain: 'Political', title: 'Participating in public life', description: 'Messages, recordings, and the question of whom we trust.' },
  { domain: 'Cultural', title: 'Stories and performances', description: 'The shows, dances, and performers we follow together.' },
  { domain: 'Environmental', title: 'Living with environmental change', description: 'Shared spaces, everyday choices, and exposure to risk.' },
  { domain: 'Aesthetics', title: 'Expressing identity', description: 'Music, style, and the ways we choose to be seen.' },
];
const MEDIA_FOR = {
  'comparison-01': ['friendster'], 'comparison-02': ['nokia'],
  'comparison-03': ['dota','netopia','ragnarok'], 'comparison-05': ['trinoma','moa'],
  'comparison-07': ['estrada'], 'comparison-15': ['ondoy'],
  'comparison-17': ['cycling'], 'comparison-18': ['opm'],
};
const mediaById = Object.fromEntries(MEDIA.map(m => [m.id, m]));
const mediaFor = c => (MEDIA_FOR[c.id] || []).map(id => mediaById[id]);
const topic = document.getElementById('topic');
const dialog = document.getElementById('artifact-dialog');
const detail = document.getElementById('artifact-detail');
let currentTopic = 0;
let returnFocus = null;

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

function renderCollection() {
  const selected = TOPICS[currentTopic];
  const entries = COMPARISONS.filter(c => c.domain === selected.domain);
  topic.value = selected.domain;
  document.getElementById('collection-title').textContent = selected.title;
  document.getElementById('topic-description').textContent = selected.description;
  document.getElementById('section-number').textContent = `${String(currentTopic + 1).padStart(2, '0')} / 06`;
  document.getElementById('collection-count').textContent = `${entries.length} artifacts in this topic · 21 in the collection`;
  document.getElementById('artifact-list').innerHTML = entries.map(c => {
    const number = c.id.slice(-2);
    const preview = mediaFor(c).find(m => m.type === 'image');
    return `<article class="artifact-card"><div class="artifact-visual">${preview ? `<img src="${esc(preview.src)}" alt="${esc(preview.alt)}" loading="lazy">` : `<span class="artifact-number" aria-hidden="true">${number}</span>`}</div><span class="eyebrow">Artifact ${number}</span><h3>${esc(c.title)}</h3><p>${esc(c.intro)}</p><button class="read-artifact" type="button" data-artifact="${c.id}" aria-label="Read ${esc(c.title)}" aria-haspopup="dialog">Read the story <span aria-hidden="true">↗</span></button></article>`;
  }).join('');
  const previous = document.getElementById('previous-topic');
  const next = document.getElementById('next-topic');
  previous.hidden = currentTopic === 0;
  next.hidden = currentTopic === TOPICS.length - 1;
  previous.textContent = `← Previous topic`;
  next.textContent = currentTopic < TOPICS.length - 1 ? `Next: ${TOPICS[currentTopic + 1].title} →` : '';
}

function sourceLink(url, label) {
  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
}
function mediaHTML(item) {
  const visual = item.type === 'image'
    ? `<img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy">`
    : `<div class="video-box"><button class="load-video" type="button" data-video="${esc(item.id)}">▶ Load video: ${esc(item.title)}<small>Opens a YouTube player here. Playback starts when you press Play.</small></button></div>`;
  return `<figure class="media-figure">${visual}<figcaption><p>${esc(item.caption)}</p><p>${esc(item.credit)} · ${sourceLink(item.source, 'View source')}${item.license ? ` · ${sourceLink(item.licenseUrl,item.license)} · image unchanged` : ''}</p></figcaption></figure>`;
}

function openArtifact(id, opener) {
  const c = COMPARISONS.find(c => c.id === id);
  if (!c) return;
  returnFocus = opener || null;
  const selected = TOPICS.find(t => t.domain === c.domain);
  document.getElementById('dialog-category').textContent = `${selected.title} · ${c.id.slice(-2)}`;
  const media = mediaFor(c);
  detail.innerHTML = `<h2 id="artifact-title">${esc(c.title)}</h2><p class="detail-intro">${esc(c.intro)}</p>
    <section class="detail-section"><h3>2000s</h3><p>${documentText(c.past)}</p></section>
    <section class="detail-section"><h3>2020s</h3><p>${documentText(c.present)}</p></section>
    <section class="detail-section"><h3>What connects them</h3><p>${documentText(c.synthesis)}</p></section>
    ${media.length ? `<section class="detail-section"><h3>Images & videos</h3><div class="media-list">${media.map(mediaHTML).join('')}</div></section>` : ''}
    <p class="detail-note">Exhibit text from the supplied Philippine Pop Culture Museum document. Author–date links lead to the supporting sources. Reference images retain their source dates and scope.</p>`;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.getElementById('close-artifact').focus({preventScroll:true});
}

function changeTopic(index) {
  currentTopic = Math.max(0,Math.min(TOPICS.length - 1,index));
  renderCollection();
  document.getElementById('collection').scrollIntoView({block:'start',behavior:'instant'});
  topic.focus({preventScroll:true});
}
topic.addEventListener('change', () => { currentTopic = TOPICS.findIndex(t => t.domain === topic.value); renderCollection(); });
document.getElementById('previous-topic').addEventListener('click', () => changeTopic(currentTopic - 1));
document.getElementById('next-topic').addEventListener('click', () => changeTopic(currentTopic + 1));
document.getElementById('close-artifact').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => { detail.replaceChildren(); returnFocus?.focus({preventScroll:true}); returnFocus=null; });
document.addEventListener('click', e => {
  const opener = e.target.closest('[data-artifact]');
  if (opener) openArtifact(opener.dataset.artifact,opener);
  const play = e.target.closest('[data-video]');
  if (play) {
    const item = mediaById[play.dataset.video];
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${item.youtube}?rel=0`;
    iframe.title = item.title;
    iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    play.parentElement.replaceChildren(iframe);
  }
});

document.getElementById('closing-copy').innerHTML = CLOSING.map(text => `<p>${esc(text)}</p>`).join('');
document.getElementById('research-notes').innerHTML = `<p>${esc(DOCUMENT_SCOPE)}</p><p>The photographs, profile layouts, and videos are credited beside each item. The optional animated tour contains AI-generated pixel reconstructions and additional curatorial scenes.</p><ul>${DOCUMENT_REFERENCES.map(r => `<li>${r.url ? sourceLink(r.url,r.apa) : esc(r.apa)}</li>`).join('')}</ul>`;
renderCollection();
