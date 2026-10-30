// Original media from the group's source sheet, kept distinct from the pixel reconstructions.
import { esc } from './ui.js';
import { disable, enable, isOn } from './audio.js';

const image = (id, file, title, alt, caption, credit, source, extra = {}) => ({ id, type: 'image', src: `assets/sources/${file}`, title, alt, caption, credit, source, ...extra });
const video = (id, youtube, title, caption, credit) => ({ id, type: 'video', youtube, title, caption, credit, source: `https://www.youtube.com/watch?v=${youtube}` });

export const MEDIA = [
  image('friendster', 'friendster-pink-hearts.jpg', 'A profile you could make your own', 'A Friendster profile customized with a pink heart background, colored panels, friends and testimonials.', '“Pink Hearts,” a Friendster layout submitted on October 29, 2007. A surviving example of the CSS customization described in this exhibit.', 'LoisLaneIeroWay / CreateBlog', 'https://www.createblog.com/friendster-layouts/22751-pink-hearts/'),
  image('dota', 'dota-gameplay.jpeg', 'Dota, before the standalone sequel', 'A Warcraft III Dota match showing the battlefield, minimap and hero inventory.', 'The Warcraft III-era interface illustrates online play associated with LAN cafés. This image was posted in a 2015 retrospective; it does not document a Philippine café.', 'Nerdville, “DotA: Humble Beginnings”', 'https://nerdvillage.wordpress.com/tag/dota-1/'),
  video('netopia', 'sHsNMrjFESs', 'Inside a Netopia internet café', 'A look inside Netopia at Liceo University, shared as “Netopia Internet Cafe Liceo University.”', 'Jan Mckingley Hilado / YouTube'),
  video('ragnarok', 'z9gs8Eutip4', 'Ragnarok arrives on Philippine television', 'Philippine Ragnarok Online First TVC, shared by LevelUp Philippines. The upload date is not the original broadcast date.', 'LevelUp Philippines / YouTube'),
  image('trinoma', 'trinoma.webp', 'The mall as a place to gather', 'An exterior view of the TriNoma shopping complex.', 'TriNoma, documented on its architect’s project page. The building illustrates the mall setting; the photograph’s capture date is not established.', 'GFP Architects, Ayala Malls TriNoma project', 'https://gfparchitects.com/project/ayala-malls-trinoma/'),
  image('moa', 'moa-postcard.jpg', 'Mall of Asia on a postcard', 'A postcard showing the SM Mall of Asia shopping complex.', 'A Mall of Asia postcard shared on a collector’s blog in 2019. The mall opened in 2006; the date of the postcard image itself is not established.', 'MY POSTCARD-PAGE', 'https://mypostcard-page.blogspot.com/2019/06/philippines-sm-mall-of-asia-manila.html'),
  image('opm', 'opm-artists.jpg', 'The sound of 2000s OPM', 'A retrospective collage of Filipino singers and bands.', 'Artists pictured in Ling’s retrospective on OPM from the 2000s. This later collage provides music context, rather than a photograph of a particular live gig.', 'Ling, “Greatest OPM from the 2000s”', 'https://ling-app.com/blog/opm-from-the-2000s/'),
  image('nokia', 'nokia.jpg', 'The keypad, up close', 'A white and blue Nokia keypad phone with a small monochrome screen.', 'A later photograph of a Nokia handset, illustrating the physical keypad and small screen. The accompanying article concerns Nokia’s later licensing business, not Philippine SMS statistics.', 'Thomas Kohler / Flickr, via MakeUseOf', 'https://www.makeuseof.com/nokia-hasnt-made-a-phone-in-over-a-decade-and-its-still-making-billions-from-every-one-sold/'),
  image('estrada', 'estrada-rally.jpeg', 'Before EDSA II: a November 2000 rally', 'A newspaper photograph of the anti-Estrada protest at the EDSA Shrine.', 'A prayer rally reported on November 5, 2000, before the January 2001 EDSA II protests. Historical context for the exhibit, not a photograph of the later chain-text event.', 'AFP, via Taipei Times', 'https://www.taipeitimes.com/News/front/archives/2000/11/05/0000059970'),
  image('ondoy', 'ondoy.jpg', 'Ondoy, September 2009', 'Residents cope with lingering floodwater after Typhoon Ondoy.', 'Residents of Los Baños and Bay, Laguna, on September 29, 2009. The World Bank account also describes relief organized through SMS, Facebook and Twitter during this period.', 'Bill Sta. Clara / IRRI Images, DSC_3038-b', 'https://www.flickr.com/photos/ricephotos/3965703426/', { license: 'CC BY-NC-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/2.0/', related: 'https://blogs.worldbank.org/en/eastasiapacific/philippines-surviving-tropical-storm-ondoy-ketsana', domain: 'Environmental', era: '2000s', lens: 'Space' }),
  image('cycling', 'cycling.webp', 'A different everyday commute', 'A masked cyclist rides along an urban bicycle path in the Philippines.', 'An image accompanying an account of pandemic-era cycling and Philippine bike-lane expansion. It belongs with the Archive’s 2020s active-mobility comparison.', 'As reproduced by Emission Impossible, “From crisis to opportunity”', 'https://www.emissionimpossible.co.nz/news-archive/from-crisis-to-opportunity', { domain: 'Environmental', era: '2020s', lens: 'Technology' }),
];

const SETS = {
  'ao-08': { title: 'Friendster profile', ids: ['friendster'] },
  'ao-09': { title: 'LAN café', ids: ['dota', 'netopia', 'ragnarok'] },
  'ao-10': { title: 'The mall and the Y2K look', ids: ['trinoma', 'moa'] },
  'ao-12': { title: 'OPM band gig', ids: ['opm'] },
  'ao-13': { title: 'Nokia texting', ids: ['nokia'] },
  'ao-15': { title: 'Chain text to EDSA II', ids: ['estrada'] },
};
const BY_ID = Object.fromEntries(MEDIA.map(m => [m.id, m]));
const sourceLink = (url, text) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)}<span class="sr-only"> (opens in a new tab)</span></a>`;

function previewCard(key, item, count = 1, hasVideo = false) {
  return `<button class="media-preview" type="button" data-media-set="${esc(key)}" aria-haspopup="dialog" aria-label="View original media: ${esc(item.title)}">
    <img src="${esc(item.src)}" alt="" loading="lazy" decoding="async" width="160" height="100">
    <span><small>From the source collection</small><strong>${esc(item.title)}</strong><span>View ${count > 1 ? `${count} ${hasVideo ? 'images & videos' : 'images'}` : 'image & source'} <span aria-hidden="true">↗</span></span></span>
  </button>`;
}

export function artifactMediaHTML(id) {
  const set = SETS[id];
  return set ? previewCard(id, BY_ID[set.ids[0]], set.ids.length, set.ids.some(id => BY_ID[id].type === 'video')) : '';
}

export function archiveMediaHTML(domain = '', lens = '', era = '') {
  const items = MEDIA.filter(m => m.domain && (!domain || domain === m.domain) && (!lens || lens === m.lens) && (!era || era === m.era));
  if (!items.length) return '';
  return `<section class="archive-media" aria-labelledby="archive-media-title"><h3 id="archive-media-title">From the source collection</h3><p>Photographs related to the archive entries below.</p><div class="archive-media-grid">${items.map(m => previewCard(m.id, m)).join('')}</div></section>`;
}

function figureHTML(item) {
  const visual = item.type === 'image'
    ? `<img class="media-original" src="${esc(item.src)}" alt="${esc(item.alt)}" decoding="async" loading="lazy">`
    : `<div class="media-video" data-video-container="${esc(item.id)}"><button class="media-play" type="button" data-play-video="${esc(item.id)}"><span class="media-play-symbol" aria-hidden="true">▶</span><span>Load video: ${esc(item.title)}</span><small>Loads a YouTube player. Press Play in the player to start.</small></button></div>`;
  return `<figure class="media-figure"><h3>${esc(item.title)}</h3>${visual}<figcaption><p>${esc(item.caption)}</p><p class="media-credit">${esc(item.credit)} · ${sourceLink(item.source, item.type === 'video' ? 'Watch on YouTube' : 'View source')}${item.related ? ` · ${sourceLink(item.related, 'Read the account')}` : ''}${item.license ? `<br>${sourceLink(item.licenseUrl, item.license)} · image unchanged` : ''}</p></figcaption></figure>`;
}

export function mediaCreditsHTML() {
  return `<section class="media-credits"><h4>Original images and videos</h4><p>The galleries contain documentary and reference media from the group’s source collection. Dates, creators and context are credited beside each item; the surrounding pixel scenes remain reconstructions.</p><ul>${MEDIA.map(m => `<li>${sourceLink(m.source, m.title)} — ${esc(m.credit)}${m.license ? ` · ${sourceLink(m.licenseUrl, m.license)}` : ''}</li>`).join('')}</ul></section>`;
}

export function mountMedia() {
  const dialog = document.createElement('dialog');
  dialog.id = 'media-dialog';
  dialog.className = 'sheet sheet--wide';
  dialog.setAttribute('aria-labelledby', 'media-title');
  dialog.innerHTML = `<div class="sheet-head"><h2 id="media-title">Original media</h2><button class="btn btn--plain" type="button" data-close>Close</button></div><div class="sheet-body" id="media-body"></div>`;
  document.body.append(dialog);
  let returnDialog = null;
  let returnFocus = null;
  let restoreSound = false;
  dialog.addEventListener('close', () => {
    // Removing the player stops playback on Close, Escape, and backdrop dismissal.
    dialog.querySelector('#media-body').replaceChildren();
    if (restoreSound) enable();
    restoreSound = false;
    if (returnDialog?.isConnected && !returnDialog.open) returnDialog.showModal();
    returnFocus?.focus({ preventScroll: true });
    returnDialog = null;
    returnFocus = null;
  });
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-media-set]');
    if (opener) {
      const key = opener.dataset.mediaSet;
      const set = SETS[key] ?? { title: BY_ID[key]?.title, ids: [key] };
      if (!set.ids.every(id => BY_ID[id])) return;
      returnDialog = opener.closest('dialog');
      returnFocus = opener;
      returnDialog?.close();
      restoreSound = isOn();
      if (restoreSound) disable();
      dialog.querySelector('#media-title').textContent = `Original media · ${set.title}`;
      dialog.querySelector('#media-body').innerHTML = set.ids.map(id => figureHTML(BY_ID[id])).join('');
      dialog.showModal();
      return;
    }
    const play = e.target.closest('[data-play-video]');
    if (play && dialog.open) {
      const item = BY_ID[play.dataset.playVideo];
      if (!item || item.type !== 'video') return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${item.youtube}?rel=0`;
      iframe.title = item.title;
      iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      play.replaceWith(iframe);
      iframe.focus();
    }
  });
  // A missing image still leaves a working, titled source card.
  document.addEventListener('error', e => {
    if (e.target instanceof HTMLImageElement && e.target.closest('.media-preview')) e.target.hidden = true;
  }, true);
}
