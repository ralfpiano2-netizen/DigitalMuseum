import { esc } from './ui.js';

export const PRESENT_IMAGES = {
  "bini": {
    "id": "present-bini",
    "type": "image",
    "src": "https://data-corporate.abs-cbn.com/corp/medialibrary/dotcom/ncstpr%20abs%20music/082324%20-%20awit%20awards%202024/bini%20record%20of%20the%20year.jpg",
    "title": "BINI and Pantropiko · 2024",
    "alt": "BINI members in pastel outfits beneath a beach umbrella.",
    "caption": "Pantropiko promotional image in ABS-CBN’s August 2024 Awit Awards release. Connects the choreography comparison with a named P-pop example.",
    "credit": "BINI / ABS-CBN Music",
    "source": "https://corporate.abs-cbn.com/newsroom/news-releases/2024/8/23/abs-cbn-music-31-nominations-awit-awards?lang=en"
  },
  "netflix": {
    "id": "present-netflix",
    "type": "image",
    "src": "https://images.ctfassets.net/4cd45et68cgf/2IB4TZHFAOjYxVL0XzpMfl/e38f1241f9ea20d725245cb81009c94e/RCC_Main_KA_for_blog_post.jpg?w=2000",
    "title": "Filipino streaming drama · 2023",
    "alt": "Promotional artwork featuring the three leads of Replacing Chef Chico.",
    "caption": "Official key art for Replacing Chef Chico, announced in November 2023. An example of Filipino streaming drama, rather than an image of an autoplay control.",
    "credit": "Netflix / Replacing Chef Chico",
    "source": "https://about.netflix.com/en/news/a-recipe-for-romance-netflix-unveils-stunning-key-art-for-replacing-chef"
  },
  "grab": {
    "id": "present-grab",
    "type": "image",
    "src": "https://assets.grab.com/wp-content/uploads/sites/12/2024/01/25133349/PHOTO-RELEASE-GrabFood-Saver-Delivery.jpeg",
    "title": "App-based delivery · 2024",
    "alt": "GrabFood promotional photograph from its Saver Delivery announcement.",
    "caption": "Image from Grab Philippines’ January 2024 delivery announcement. Platform-supplied promotional material; it does not establish individual riders’ working hours or conditions.",
    "credit": "Grab Philippines",
    "source": "https://www.grab.com/ph/press/others/grab-outlines-new-affordable-solutions-so-you-can-enjoy-more-for-less/"
  },
  "phone": {
    "id": "present-phone",
    "type": "image",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Hand_holding_Smartphone.jpg/500px-Hand_holding_Smartphone.jpg",
    "title": "A handheld smartphone · 2021",
    "alt": "A hand holding a touchscreen smartphone.",
    "caption": "Photographed April 21, 2021. A device reference, not evidence of connectivity quality or a photograph identified as Philippine use. Image unchanged.",
    "credit": "Mictlancihuatl / Wikimedia Commons",
    "source": "https://commons.wikimedia.org/wiki/File:Hand_holding_Smartphone.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  "reels": {
    "id": "present-reels",
    "type": "image",
    "src": "https://about.fb.com/wp-content/uploads/2023/05/Facebook-Reels-Updates_Header.jpg",
    "title": "Recommended video feeds · 2023",
    "alt": "Meta’s interface illustration of Facebook Reels personalization controls.",
    "caption": "Meta’s May 2023 product illustration shows Reels personalization. It documents the platform’s interface, not an individual Filipino user’s feed.",
    "credit": "Meta Newsroom",
    "source": "https://about.fb.com/news/2023/05/discover-and-personalize-facebook-reels/"
  },
  "messenger": {
    "id": "present-messenger",
    "type": "image",
    "src": "https://about.fb.com/wp-content/uploads/2024/04/Messenger-Media-Improvements_Header.jpg",
    "title": "Shared photos and group chats · 2024",
    "alt": "Meta’s illustration of a shared photo album in Messenger.",
    "caption": "Official April 2024 product illustration of shared media in Messenger. The conversation shown is demonstration material, not a private conversation collected for the museum.",
    "credit": "Meta / Messenger",
    "source": "https://about.fb.com/news/2024/04/hd-photos-shared-albums-and-more-on-messenger/"
  },
  "selling": {
    "id": "present-selling",
    "type": "image",
    "src": "https://p16-ttark-useast8.tiktokcdn-us.com/tos-useast8-i-zr23xo8qx2-tx2/a36456f7bc767fcb17a0f72514ee4c5e.png~tplv-zr23xo8qx2-default%3A0%3A0%3Aq75.image",
    "title": "TikTok Shop live selling · 2025",
    "alt": "Lauren Young and Papanan presenting products in TikTok Shop livestreams.",
    "caption": "Creator sessions reproduced in TikTok’s January 2026 account of live commerce in 2025. Platform promotional material, identified as such.",
    "credit": "TikTok Shop Philippines",
    "source": "https://newsroom.tiktok.com/tiktok-shop-drives-200-increase-in-sales-for-local-sellers-in-2025?lang=en-PH"
  },
  "music-hub": {
    "id": "present-music-hub",
    "type": "image",
    "src": "https://storage.googleapis.com/pr-newsroom-wp/1/2024/11/02-Refreshed-Pinoy-Music-Hub-1024x683.jpg",
    "title": "Pinoy music playlists · 2024",
    "alt": "Spotify’s promotional image for its refreshed Pinoy Music hub.",
    "caption": "Spotify’s November 2024 Pinoy Music hub image illustrates playlist-based discovery. This is a platform illustration rather than a listener’s personal library.",
    "credit": "Spotify Newsroom",
    "source": "https://newsroom.spotify.com/2024-11-01/philippines-10-year-anniversary-ben-and-ben/"
  },
  "music-live": {
    "id": "present-music-live",
    "type": "image",
    "src": "https://storage.googleapis.com/pr-newsroom-wp/1/2024/11/05-Spotify-Lounge-Illest-Morena-1024x683.jpg",
    "title": "OPM on stage · Spotify Lounge, 2024",
    "alt": "Illest Morena performing at Spotify Lounge: Philippines Edition.",
    "caption": "A live-performance photograph in Spotify’s November 2024 Philippine anniversary report. Streaming promotion and physical performance appear together in this event.",
    "credit": "Spotify Newsroom / Spotify Lounge",
    "source": "https://newsroom.spotify.com/2024-11-01/philippines-10-year-anniversary-ben-and-ben/"
  },
  "wallet": {
    "id": "present-wallet",
    "type": "image",
    "src": "https://images.gmanews.tv/webpics/2024/01/640_GCash_PR_trust_rating_photo_2_2024_01_10_14_16_09.jpg",
    "title": "Digital-wallet checkout · 2024",
    "alt": "A shopper presents a phone at a checkout displaying GCash signage.",
    "caption": "GCash promotional photograph reproduced in a January 2024 GMA corporate bulletin. Illustrates a retail payment channel, not an overseas remittance transaction.",
    "credit": "GCash, via GMA News corporate bulletin",
    "source": "https://www.gmanetwork.com/news/cbb/content/893677/gcash-among-highly-recommended-philippine-brands-in-2023-with-92-net-promoter-score/story/"
  },
  "gathering": {
    "id": "present-gathering",
    "type": "image",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/UniTeam_2022_proclamation_rally_4.jpg/960px-UniTeam_2022_proclamation_rally_4.jpg",
    "title": "Political gathering · February 2022",
    "alt": "Supporters at the UniTeam proclamation rally at the Philippine Arena.",
    "caption": "Photographed February 8, 2022, in Bulacan. Shows a particular physical campaign gathering; the photograph alone does not establish how attendees were mobilized online. Image unchanged.",
    "credit": "Avito Dalan / Philippine News Agency, via Wikimedia Commons",
    "source": "https://commons.wikimedia.org/wiki/File:UniTeam_2022_proclamation_rally_4.jpg",
    "license": "Public domain in the Philippines",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Template:PD-PhilippinesGov"
  },
  "gaming": {
    "id": "present-gaming",
    "type": "image",
    "src": "https://i.ytimg.com/vi/oz2WBRrQWzE/hqdefault.jpg",
    "title": "Mobile Legends livestream · 2025",
    "alt": "Thumbnail of an official MPL Philippines tournament broadcast.",
    "caption": "Official MPL Philippines broadcast thumbnail from September 28, 2025. Promotional broadcast artwork, not a photograph of friends playing together.",
    "credit": "MPL Philippines / YouTube",
    "source": "https://www.youtube.com/watch?v=oz2WBRrQWzE"
  },
  "drag": {
    "id": "present-drag",
    "type": "image",
    "src": "assets/sources/eva-pageants.jpg",
    "title": "A pageant tradition discussed on Drag Race",
    "alt": "Drag performers talk together in a brightly colored Drag Race Philippines setting.",
    "caption": "A 2022 Drag Race Philippines image accompanying Eva Le Queen’s discussion of why pageants matter to the LGBT community. This is the exhibit’s 2020s counterpart, not a photograph of a 2000s barangay pageant.",
    "credit": "Drag Race Philippines, via ABS-CBN News",
    "source": "https://www.abs-cbn.com/entertainment/09/13/22/eva-le-queen-explains-why-pageants-matter-to-lgbt-community"
  }
};
export const PRESENT_MEDIA = {
  "ao-01": "bini",
  "ao-02": "netflix",
  "ao-03": "netflix",
  "ao-04": "netflix",
  "ao-05": "reels",
  "ao-06": "grab",
  "ao-07": "phone",
  "ao-08": "reels",
  "ao-09": "gaming",
  "ao-10": "selling",
  "ao-11": "drag",
  "ao-12": "music-live",
  "ao-13": "messenger",
  "ao-14": "wallet",
  "ao-15": "gathering",
  "ao-16": "messenger",
  "ao-17": "music-hub",
  "ao-18": "wallet"
};

export function presentMediaHTML(id) {
  const item = PRESENT_IMAGES[PRESENT_MEDIA[id]];
  if (!item) return '';
  return `<figure class="present-figure"><img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy" decoding="async"><figcaption><strong>${esc(item.title)}</strong><p>${esc(item.caption)}</p><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">${esc(item.credit)} · source ↗</a>${item.license ? ` · <a href="${esc(item.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(item.license)}</a>` : ''}</figcaption></figure>`;
}
