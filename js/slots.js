// Every asset slot the site can use. A slot is filled once tools/assets.mjs has processed
// a matching file from assets-src/ into assets/; until then the page shows a placeholder
// (images) or a synthesized stand-in or silence (audio).
//   img:   w×h is the native pixel size; alpha keeps transparency; hd skips the pixel pass (WebP).
//   audio: mix sets the loudness target; loop marks ambience beds.

const scene = alt => ({ kind: 'img', w: 180, h: 320, alt });
const tv = alt => ({ kind: 'img', w: 64, h: 48, alt });
const hd = alt => ({ kind: 'img', w: 720, h: 1280, hd: true, alt });
const sound = (mix, loop = false) => ({ kind: 'audio', mix, loop });

export const SLOTS = {
  'bg-sala': scene('A Filipino sala at noon: capiz windows, a wall clock, a CRT television on a wooden cabinet, an electric fan and a plastic-covered sofa.'),
  'fg-sala': { kind: 'img', w: 180, h: 320, alpha: true, alt: '' },
  'tv-noontime': tv('A noontime variety show: dancers in matching outfits on a bright studio stage.'),
  'tv-asianovela': tv('A dubbed Asian drama: two young leads on a campus bench under falling leaves.'),
  'tv-teleserye': tv('A primetime teleserye: a tearful confrontation in a mansion living room.'),
  'tv-reality': tv('A reality show: housemates seated on a couch in a brightly lit house.'),
  'tv-boxing': tv('A live boxing broadcast: two fighters in a ring under arena lights.'),
  'bg-street': scene('A barangay street after school: a sari-sari store with a PisoNet cabinet, an internet café sign and a parked tricycle.'),
  'bg-lan': scene('Inside a LAN café: rows of CRT monitors, teenagers in school uniforms, a time slip on the counter.'),
  'bg-mall': scene('A mall atrium on a weekend: escalators, shop fronts and teenagers strolling in Y2K outfits.'),
  'bg-parlor': scene('A neighborhood beauty parlor beside a small barangay pageant stage with string lights.'),
  'bg-gig': scene('A small bar during an OPM band gig: a cramped stage, amplifiers and a wall of photocopied flyers.'),
  'bg-bedroom': scene('A bedroom at night: a teenager under a blanket lit by the green glow of a keypad phone.'),
  'bg-edsa': scene('The EDSA Shrine at dusk, the road filled with a crowd seen from behind.'),
  'void-lockscreen': hd('An abstract modern phone wallpaper in deep blues and violets.'),
  'void-dance': hd('A silhouetted dancer filming in front of a ring light in a dark bedroom.'),
  'void-livesell': hd('A live-selling setup: a ring light, a phone on a tripod, products stacked on a table.'),
  'void-esports': hd('A mobile esports arena: a stage of players lit by huge screens, the crowd in shadow.'),
  'void-drag': hd('A drag performer seen from behind on a stage washed in pink light.'),
  'void-concert': hd('A P-pop concert crowd holding up glowing phones and light sticks.'),
  'void-rider': hd('A delivery rider on a motorbike at night in the rain, city lights blurred behind.'),

  'amb-sala': sound('amb', true),
  'amb-street': sound('amb', true),
  'amb-lan': sound('amb', true),
  'amb-night': sound('amb', true),
  'amb-void': sound('amb', true),
  'sfx-dialup': sound('sfx'),
  'sfx-coin-slot': sound('sfx'),
  'sfx-crowd-cheer': sound('sfx'),
  'sfx-scratch': sound('sfx'),
  'sfx-crt-on': sound('sfx'),
  'sfx-door': sound('sfx'),
  'sfx-fight-bell': sound('sfx'),
  'music-noontime': sound('music'),
  'music-teleserye': sound('music'),
  'music-profile': sound('music'),
  'music-gig': sound('music'),
  'music-novelty': sound('music'),
  'music-void': sound('music', true),
  'music-finale': sound('music'),
  'voice-lobby': sound('voice'),
  'voice-zone-1': sound('voice'),
  'voice-zone-2': sound('voice'),
  'voice-zone-3': sound('voice'),
  'voice-void': sound('voice'),
};
