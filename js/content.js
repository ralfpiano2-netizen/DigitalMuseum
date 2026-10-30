import { COMPARISONS } from './exhibit-text.js?v=exhibit-text-2';
// Museum text: zones, the 18 artifact labels, guide captions, notifications and credits.
// `cite` holds REFERENCES ids from sheet.js. A label with no listed source carries a
// "Curatorial note:" instead. Research text that is quoted verbatim lives in sheet.js.

export const SITE = {
  title: 'Always-On',
  subtitle: 'The Philippine Pop Culture Time Machine',
  project: 'Tracing the Pop: A Review of a Decade in PH Popular Culture',
  group: 'Group 8',
  wing2000: 'Piso, Text, at Tambayan',
  wing2020: 'The Always-On Void',
};

export const ZONES = [
  {
    n: 1, id: 'zone-1', title: 'Temporal Rhythms', place: 'The sala, from noon to primetime', clock: '12:00',
    intro: 'In the 2000s the television kept the hours of the day. Families gathered at noon, at primetime and on fight Sundays, and the whole country watched the same thing at the same time.',
    guide: 'zone-1',
  },
  {
    n: 2, id: 'zone-2', title: 'Spatial Transformations', place: 'The street, after school', clock: '15:00',
    intro: 'The tambayan went online without leaving the neighborhood: a coin-operated PC outside the sari-sari store, rows of café monitors, the parlor, the mall. Being online still meant being somewhere, with someone.',
    guide: 'zone-2',
  },
  {
    n: 3, id: 'zone-3', title: 'Mobilization and Technology', place: 'Under the kumot, 9 PM', clock: '21:00',
    intro: 'Prepaid load and sturdy keypad phones made the Philippines the text capital of the world. One hundred sixty characters at a time, Filipinos flirted, gossiped, sent money home and, once, filled EDSA.',
    guide: 'zone-3',
  },
];

const NO_SOURCE = 'Curatorial note: written from the group’s research brief. No entry in the reference list covers this artifact yet.';

export const ARTIFACTS = [
  {
    n: 1, id: 'ao-01', zone: 1, title: 'Noontime show dance craze', when: 'Early 2000s', medium: 'Pixel reconstruction of a broadcast', clock: '12:00',
    body: 'At noon the whole country ate lunch in front of the same show. Variety programs turned novelty songs into nationwide dance crazes, like the SexBomb Girls’ “The Spageti Song”. You learned the steps by tuning in at the right hour, because the moment aired once, for everyone at the same time.',
    cite: ['gloria2026', 'sanchez2022'], note: null,
    now: { title: 'TikTok dance trends, 24/7', body: 'Dance crazes now cycle through short-form video feeds around the clock, learned and recreated on demand in personal micro-moments instead of at noon.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['tv-noontime', 'music-noontime', 'music-novelty'],
  },
  {
    n: 2, id: 'ao-02', zone: 1, title: 'Dubbed Asianovela', when: 'Early 2000s', medium: 'Pixel reconstruction of a broadcast', clock: '16:00',
    body: 'Networks imported Asian dramas and dubbed them into Filipino before broadcast. Meteor Garden reached living rooms speaking everyday Tagalog, its foreign story arriving through a local channel, a local schedule and a local voice. Global culture came in, but only after it had been translated and timed for a national audience.',
    cite: ['gloria2026', 'sanchez2022'], note: null,
    now: { title: 'Subtitled K-drama binges', body: 'Global streaming platforms carry the original audio with subtitles, whole seasons at once, watched on personal screens whenever the viewer chooses.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['tv-asianovela'],
  },
  {
    n: 3, id: 'ao-03', zone: 1, title: 'Primetime teleserye', when: 'Early 2000s', medium: 'Pixel reconstruction of a broadcast', clock: '19:00',
    body: 'Primetime belonged to the teleserye. Families gathered every weeknight for dramas like Pangako Sa ’Yo, and each episode stopped on a cliffhanger with one word on screen: Abangan. Nobody could skip ahead. The next chapter aired tomorrow at the same hour, for the whole country at once.',
    cite: ['gloria2026', 'sanchez2022'], note: null,
    now: { title: 'Autoplay: next episode in 5', body: 'Streaming queues the next episode automatically. The cliffhanger lasts five seconds, and the schedule belongs to each viewer instead of the nation.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['tv-teleserye', 'music-teleserye'],
  },
  {
    n: 4, id: 'ao-04', zone: 1, title: 'Reality-show SMS voting', when: 'Mid-2000s', medium: 'Simulated interface', clock: '21:00',
    body: 'Talent searches like StarStruck and local reality formats like Pinoy Big Brother turned viewers into voters. Audiences decided who stayed by texting their votes, each one paid from prepaid load. The family still watched together at a fixed hour, but now the living room could talk back to the screen.',
    cite: ['gloria2026', 'sanchez2022'], note: null,
    now: { title: 'P-pop fandom streaming goals', body: 'Fandoms now organize streaming and voting online around the clock, pushing groups like SB19 and BINI to global audiences without a network gatekeeper.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['tv-reality'],
  },
  {
    n: 5, id: 'ao-05', zone: 1, title: 'Pacquiao fight Sunday', when: '2000s', medium: 'Pixel reconstruction', clock: 'Sun 11:00',
    body: 'On fight Sundays, households and neighbors crowded around whichever television carried the live bout. A Pacquiao fight aired once, live, commercial breaks and all, and everyone who cared watched it together. For as long as the rounds lasted, the street outside went quiet.',
    cite: [], note: NO_SOURCE,
    now: { title: 'Everyone streaming alone', body: 'Big live moments now dissolve into on-demand clips and personal feeds, watched in daily micro-moments rather than at one shared broadcast appointment.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['tv-boxing', 'sfx-fight-bell'],
  },
  {
    n: 6, id: 'ao-06', zone: 1, title: 'BPO night shift', when: 'Late 2000s', medium: 'Pixel reconstruction', clock: '21:30',
    body: 'As the family settled in for primetime, the eldest child left for work. The call center boom put over 500,000 Filipinos on night shifts timed to foreign clients’ business hours, an inverted lifestyle that stretched urban economic life across the night. The country’s first 24/7 schedule started at the office.',
    cite: ['ilo2010'], note: null,
    now: { title: 'Riders on a 24/7 map', body: 'Work now runs on platform apps and remote freelancing: asynchronous, always on, with riders and freelancers keeping personal schedules at every hour.', cite: ['worldbank2020'] },
    slots: ['sfx-door'],
  },
  {
    n: 7, id: 'ao-07', zone: 2, title: 'PisoNet machine', when: 'Late 2000s', medium: 'Pixel reconstruction', clock: '15:00',
    body: 'Outside the sari-sari store stood a plywood cabinet with a coin slot and a monitor. A peso bought a few minutes online, so time on the internet was counted, shared and queued for. Even as home computers spread, cheap neighborhood computer shops stayed the place where young Filipinos went online together.',
    cite: ['glasner2005', 'toral2013'], note: null,
    now: { title: 'Unlimited data, no timer', body: 'Online time no longer runs out. Smartphones and mobile data keep everyone connected anywhere, at any hour, with no coin slot and no queue.', cite: ['gabrillo2024', 'worldbank2020'] },
    slots: ['bg-street', 'sfx-coin-slot'],
  },
  {
    n: 8, id: 'ao-08', zone: 2, title: 'Friendster profile', when: 'Mid-2000s', medium: 'Simulated interface', clock: '15:30',
    body: 'Friendster turned free time into scheduled sessions of self-presentation. On rented café hours, young Filipinos edited their profiles’ HTML, picked a profile song, wrote testimonials and browsed friends of friends. Socializing online was a routine with a start and an end: when the hour was up, so was the session.',
    cite: ['glasner2005', 'toral2013'], note: null,
    now: { title: 'Algorithmic profiles', body: 'Profiles now live inside feeds that never close, curated by algorithms and checked in every spare moment of the day.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['music-profile'],
  },
  {
    n: 9, id: 'ao-09', zone: 2, title: 'LAN café', when: 'Mid-2000s', medium: 'Pixel reconstruction', clock: '16:30',
    body: 'Rows of monitors, rented by the hour. After school, internet café chains like Netopia and neighborhood shops filled with players of Ragnarok Online, DOTA and Counter-Strike, shouting to teammates a few chairs away. The game happened online, but the barkada was right there in the room.',
    cite: ['glasner2005', 'toral2013'], note: null,
    now: { title: 'Mobile Legends lobbies and Discord', body: 'Squads now meet in mobile gaming lobbies and Discord servers at any hour, and MPL Philippines set a peak viewership record in 2024.', cite: ['esports2024', 'gabrillo2024'] },
    slots: ['bg-lan', 'amb-lan'],
  },
  {
    n: 10, id: 'ao-10', zone: 2, title: 'The mall and the Y2K look', when: 'Mid-2000s', medium: 'Pixel reconstruction', clock: '17:30',
    body: 'On weekends the tambayan was the mall. Multi-hectare complexes like SM Mall of Asia and TriNoma became places to shop, eat and simply be seen, and style was worn in person: the Asian shag haircut, ultra-low-waist denim, looks borrowed from celebrities. The mall was the runway, and everyone had to show up.',
    cite: ['smprime2006', 'toledo2023'], note: null,
    now: { title: 'Live-selling budol and micro-trends', body: 'Shopping moved into e-commerce apps and live-stream “budol” selling, and style now cycles through micro-trends on video feeds faster than any mall season.', cite: ['worldbank2020', 'bsp2024', 'gabrillo2024'] },
    slots: ['bg-mall'],
  },
  {
    n: 11, id: 'ao-11', zone: 2, title: 'Parlor and barangay pageant', when: '2000s', medium: 'Pixel reconstruction', clock: '18:00',
    body: 'The neighborhood beauty parlor was more than a salon. Together with barangay Miss Gay pageants, it formed what researchers call Mala-Baklang Espasyo: local queer safe spaces for performance, bonding and affirmation. Identity was performed live, on a makeshift stage, in front of neighbors who came to cheer.',
    cite: ['alli2020'], note: null,
    now: { title: 'Drag Race Philippines and online drag', body: 'Queer performance now reaches borderless, international audiences through mainstream digital drag and hybrid online viewing parties.', cite: ['alli2020'] },
    slots: ['bg-parlor', 'sfx-crowd-cheer'],
  },
  {
    n: 12, id: 'ao-12', zone: 2, title: 'OPM band gig', when: 'Mid-2000s', medium: 'Pixel reconstruction', clock: '18:30',
    body: 'Youth leisure ran on a gig calendar. Live OPM band nights, part of the decade’s rock revival, set the rhythm of the week, and personal style grew slowly through shared scenes: the venue, the band shirt, the friends you went with. To hear something new, you had to show up.',
    cite: ['toledo2023'], note: null,
    now: { title: 'Algorithmic playlists and global P-pop', body: 'Streaming algorithms now deliver music before anyone goes looking, and P-pop groups like SB19 and BINI reach global audiences without a broadcast gatekeeper.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['bg-gig', 'music-gig'],
  },
  {
    n: 13, id: 'ao-13', zone: 3, title: 'Nokia texting', when: '2000s', medium: 'Simulated interface', clock: '21:00',
    body: 'Durable keypad phones and cheap prepaid SIMs made the Philippines the Text Messaging Capital of the World, with 30 to 70 million SMS sent a day. Every message had 160 characters and cost load, so Generation Txt wrote in shorthand: musta, d2 n me, txt u l8r.',
    cite: ['lichauco2001', 'rafael2003'], note: null,
    now: { title: 'Voice notes and “Seen”', body: 'Cloud messaging on 5G smartphones carries voice notes, video calls and endless group chats, with no character limit and no cost per message.', cite: ['gabrillo2024', 'worldbank2020'] },
    slots: [],
  },
  {
    n: 14, id: 'ao-14', zone: 3, title: 'Prepaid load card', when: '2000s', medium: 'Simulated object', clock: '21:20',
    body: 'Load came on a card. You scratched off the silver strip, typed the PIN into your phone and watched the balance rise, then spent it one text at a time. Prepaid scratch cards, including game cards like Level Up!, taught a cash economy to buy digital access in small amounts.',
    cite: ['toral2013'], note: null,
    now: { title: 'GCash load, unli data', body: 'Top-ups now happen inside e-wallets in seconds, and e-payments make up over 57% of the country’s monthly retail payment volume.', cite: ['bsp2024'] },
    slots: ['sfx-scratch'],
  },
  {
    n: 15, id: 'ao-15', zone: 3, title: 'Chain text to EDSA II', when: 'January 2001', medium: 'Network simulation', clock: '22:00',
    body: 'In January 2001 a forwarded text spread from phone to phone: Go 2 EDSA. Wear blck. Without waiting for newspapers or networks, people used 2G SMS to coordinate crowds that gathered at the EDSA Shrine during the protests that unseated a president. The text capital learned what a text could do.',
    cite: ['rafael2003', 'lichauco2001'], note: null,
    now: { title: 'Hashtags and troll networks', body: 'Political messages now travel through algorithmic feeds, micro-targeting and coordinated online networks, running continuously instead of in one decisive week.', cite: ['tsek2022'] },
    slots: ['bg-edsa'],
  },
  {
    n: 16, id: 'ao-16', zone: 3, title: '3GP over Bluetooth', when: 'Late 2000s', medium: 'Simulated interface', clock: '22:30',
    body: 'Before streaming, video traveled hand to hand. Friends paired handsets over Bluetooth or infrared and waited while a grainy 3GP clip crept across, a few kilobytes at a time. Funny videos, music videos and dance covers spread through classrooms and jeepneys one transfer bar at a time.',
    cite: [], note: NO_SOURCE,
    now: { title: 'Instant HD reposts', body: 'Video now moves in high definition across cloud platforms in seconds, reposted to thousands before a Bluetooth bar would have reached ten percent.', cite: ['gabrillo2024'] },
    slots: [],
  },
  {
    n: 17, id: 'ao-17', zone: 3, title: 'MP3 player, one earphone each', when: 'Mid-2000s', medium: 'Pixel reconstruction', clock: '23:00',
    body: 'Music was something you carried and shared. A cheap MP3 player held a few dozen songs, from OPM hits to novelty tunes, and the most intimate gesture of the decade was offering someone one of your earphones. Two people, one song, a single cord between them.',
    cite: [], note: NO_SOURCE,
    now: { title: 'Two phones, two playlists', body: 'Each listener now has a personal stream and an algorithm of their own, with wireless earbuds in both ears.', cite: ['gabrillo2024', 'gloria2026'] },
    slots: ['music-novelty', 'music-gig'],
  },
  {
    n: 18, id: 'ao-18', zone: 3, title: 'Padala from abroad', when: '2000s', medium: 'Simulated interface', clock: '23:30',
    body: 'For OFW families, love arrived as a text and a claim stub. A parent abroad sent money through an over-the-counter pawnshop wire transfer, then texted home: napadala ko na. The next day someone lined up at the counter with an ID and a reference number to claim it in cash.',
    cite: ['toral2013'], note: null,
    now: { title: 'GCash and QR Ph', body: 'Money now moves between e-wallets and QR codes instantly, and e-payments carry over half of the country’s monthly retail payment volume.', cite: ['bsp2024', 'worldbank2020'] },
    slots: [],
  },
];

// Keep the interactive accession numbers stable while using the supplied exhibit text.
const DOCUMENT_MATCHES = { 'ao-01': 10, 'ao-02': 11, 'ao-03': 11, 'ao-04': 11,
  'ao-06': 4, 'ao-08': 1, 'ao-09': 3, 'ao-10': 5, 'ao-11': 12, 'ao-12': 18,
  'ao-13': 2, 'ao-14': 6, 'ao-15': 7, 'ao-16': 2, 'ao-18': 6 };
const PRESENT_TITLES = { 1: 'Profiles and recommended feeds', 2: 'Group chats and richer mobile media',
  3: 'Mobile games and social relationships', 4: 'Freelancing and platform work',
  5: 'Shopping feeds and live selling', 6: 'Digital wallets and payment channels',
  7: 'Messages, gatherings and sustained participation', 10: 'TikTok choreography and Pantropiko',
  11: 'Streaming alongside scheduled television', 12: 'Drag, streaming and community',
  18: 'OPM and contemporary fan communities' };
for (const a of ARTIFACTS) {
  const n = DOCUMENT_MATCHES[a.id];
  if (!n) continue;
  const comparison = COMPARISONS[n - 1];
  a.comparison = comparison.id;
  if (a.id === 'ao-14') a.title = 'Prepaid access card';
  a.body = comparison.past;
  if (a.id === 'ao-02') a.body = 'Meteor Garden became a Philippine viewing phenomenon in 2003 (Flores, 2003). Television schedules gave audiences shared references for following its story and stars.';
  if (a.id === 'ao-03') a.body = "Pangako Sa ’Yo attracted audiences during its original 2000–2002 run (ABS-CBN, 2022; Anarcon & Maglipon, 2020). Following a story meant making room for it in the day’s television schedule.";
  if (a.id === 'ao-04') a.body = 'StarStruck launched in 2003 (Anarcon, 2019), followed by Pinoy Big Brother in 2005 (Sabio, 2025). Reality formats gave viewers reasons to keep following performers and participants as their stories developed.';
  if (a.id === 'ao-14') a.body = 'Level Up! prepaid cards gave Ragnarok players paid access to the game (Gokongwei-Cheng, 2003). A scratch card and a code connected physical money with access to a digital world.';
  if (a.id === 'ao-18') a.body = 'Remittance counters offered ways to move value across distance, including between overseas workers and their families (Torres, 2006). Contemporary reporting described Cebuana Lhuillier expanding its transfer partnerships in 2006 (Torres, 2006).';
  if (a.id === 'ao-16') a.body = 'Nokia’s 2003 announcement for the 6600 described video clips and local sharing through Bluetooth and infrared (Nokia, 2003). Phones carried media as well as messages, allowing files to pass between nearby handsets.';
  a.synthesis = comparison.synthesis;
  a.cite = [];
  a.note = 'From the supplied museum exhibit text. Full comparison and references in the Archive.';
  a.now = { title: PRESENT_TITLES[n], body: comparison.present, cite: [] };
}
// These three interactive scenes are supplemental to the document's 21 comparisons.
for (const id of ['ao-05', 'ao-07', 'ao-17']) {
  const a = ARTIFACTS.find(a => a.id === id);
  a.cite = [];
  a.note = 'Supplemental interactive scene: curatorial interpretation, outside the supplied document’s 21 comparisons.';
}
ARTIFACTS.find(a => a.id === 'ao-05').now = { title: 'Live events across more screens', body: 'Streaming and clips offer more ways to follow an event. Live broadcasts and shared viewing continue alongside personal feeds.', cite: [] };
ARTIFACTS.find(a => a.id === 'ao-07').now = { title: 'Mobile access, with continuing limits', body: 'Mobile devices add routes to online activity. Device cost, coverage and connectivity still shape who can participate.', cite: [] };
ARTIFACTS.find(a => a.id === 'ao-17').now = { title: 'Music across recordings, clips and concerts', body: 'Listeners can share music through more media while continuing to find belonging through songs, performances and fan communities.', cite: [] };
ZONES[0].intro = 'Television schedules helped organize household routines. Following dramas, performances and personalities gave audiences shared references; scheduled and shared viewing continue alongside on-demand services.';
ZONES[1].intro = 'Computer shops, malls and community venues brought digital activity and social life into shared physical settings. Newer platforms add routes to participation while these places remain relevant.';
ZONES[2].intro = 'Prepaid access and keypad phones shaped everyday communication. Messages, local media sharing and remittance services show earlier ways to connect across distance, alongside continuing questions of access and trust.';

// Guide voice lines (Taglish). The ElevenLabs scripts use this text exactly.
export const GUIDE = {
  lobby: { slot: 'voice-lobby', caption: 'Welcome sa Always-On. Museum ito ng isang dekada: ang 2000s, noong may oras pa ang lahat. May schedule ang TV, may load ang cellphone, may timer ang PisoNet. Mag-scroll ka, at babalik tayo sa 2005.' },
  'zone-1': { slot: 'voice-zone-1', caption: 'Alas-dose na! Sa sala, sabay-sabay ang buong pamilya. Noontime show sa tanghali, teleserye sa gabi, at tuwing laban ni Pacquiao, tahimik ang buong kalye. Ang TV ang orasan ng bahay.' },
  'zone-2': { slot: 'voice-zone-2', caption: 'Alas-tres, uwian na. Diretso sa tambayan: piso sa PisoNet, isang oras sa LAN café, o tambay sa parlor. Online ka na, pero katabi mo pa rin ang barkada.' },
  'zone-3': { slot: 'voice-zone-3', caption: 'Alas-nuwebe ng gabi, sa ilalim ng kumot. Isang text, isang piso, kaya bawat salita binibilang. Pero sa 160 characters, may nagkakilala, nag-away, nagbati, at minsan, napuno ang EDSA.' },
  void: { slot: 'voice-void', caption: 'Ito na ang 2020s. Walang pader, walang orasan, walang dulo. Hindi na nauubos ang load, at hindi na natatapos ang feed. Ang tanong na lang: kailan ka titigil?' },
};

export const LOBBY_NOTES = [
  { app: 'GCash', text: 'You received ₱500.00 from Mama' },
  { app: 'Messenger', text: 'Barkada GC: 47 new messages' },
  { app: 'TikTok', text: 'Your friends posted 23 new videos' },
  { app: 'Shopee', text: 'Your parcel is out for delivery' },
  { app: 'Calendar', text: 'Tracing the Pop: final submission, Nov 13' },
];

export const VOID_NOTES = [
  { app: 'Messenger', text: 'Seen 3:07 AM' },
  { app: 'Grab', text: 'Your rider is 2 minutes away' },
  { app: 'Lazada', text: 'Flash sale ends in 09:59' },
  { app: 'TikTok', text: 'A sound you used is trending again' },
  { app: 'Discord', text: '@everyone ranked tonight?' },
  { app: 'Maya', text: 'Cashback of ₱12.00 received' },
  { app: 'YouTube', text: 'Next episode in 5' },
  { app: 'Facebook', text: 'You have a memory from 2009' },
  { app: 'Spotify', text: 'Made for you: a new mix' },
  { app: 'GCash', text: 'You sent ₱150.00 via QR Ph' },
  { app: 'Shopee', text: 'Live now: 2.1K watching' },
  { app: 'Instagram', text: '3 people viewed your story' },
];

export const CREDITS = {
  members: [
    { name: 'Member 1', role: 'Curation and copywriting' },
    { name: 'Member 2', role: 'Asset prototyping and web integration' },
    { name: 'Member 3', role: 'Quality assurance and final report' },
  ],
  // Names only what ships: when generated sound or the guide voice lands, it is added here.
  ai: 'The pixel reconstructions were generated with AI tools (OpenAI image generation), and the site was built with AI assistance. Original photographs, layout images and videos are credited separately in their galleries and below. Research and curation are the group’s own.',
};
