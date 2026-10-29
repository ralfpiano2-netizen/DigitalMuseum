// Placeholder scenes, drawn in the palette on the same 180x320 grid as the slot art, so an
// empty slot still reads as the room it stands for. Rects only, so pixels stay crisp.

const r = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const svg = (label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 320" width="180" height="320" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" role="img" aria-label="${label}">${body}</svg>`;
const repeat = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');

// A small figure seen from behind: hair, shirt, trousers.
const kid = (x, y, shirt = '#f7f2e6', pants = '#1b2a4a') => r(x + 1, y, 4, 4, '#1e1e1e') + r(x, y + 4, 6, 6, shirt) + r(x + 1, y + 10, 4, 6, pants);

const SCENES = {
  sala: () => svg('A Filipino sala at noon',
    r(0, 0, 180, 214, '#e7c48a') + r(0, 168, 180, 46, '#c9a46a') + r(0, 166, 180, 2, '#8b5a2b') +
    r(0, 214, 180, 106, '#8b5a2b') + repeat(4, i => r(0, 232 + i * 24, 180, 2, '#6b3d1c')) + repeat(6, i => r(i * 32 + 8, 214, 2, 106, '#7a4d24')) +
    // capiz window with light falling on the floor
    r(12, 34, 62, 74, '#6b3d1c') + repeat(16, i => r(16 + (i % 4) * 14, 38 + Math.floor(i / 4) * 17, 12, 15, '#f5ead0')) +
    r(18, 216, 54, 10, '#f2d24b') + r(26, 226, 52, 8, '#f2d24b') +
    // calendar and family photo (the wall clock and the TV are drawn by the exhibit)
    r(134, 40, 30, 22, '#6b3d1c') + r(136, 42, 26, 18, '#c68a5e') +
    r(138, 82, 22, 30, '#f7f2e6') + r(138, 82, 22, 7, '#b23a2e') +
    // cabinet with doily and Santo Nino; the TV sits here
    r(46, 150, 88, 64, '#6b3d1c') + r(48, 186, 84, 2, '#4a2a12') + r(66, 146, 48, 4, '#f7f2e6') +
    r(120, 128, 6, 18, '#b23a2e') + r(121, 123, 4, 5, '#e0ac7e') + r(120, 120, 6, 3, '#e2b84a') +
    // plastic-covered sofa and electric fan
    r(0, 186, 44, 42, '#b23a2e') + r(0, 180, 40, 10, '#9c2f25') + r(6, 192, 16, 2, '#f4b9b2') + r(24, 204, 12, 2, '#f4b9b2') +
    r(158, 166, 3, 56, '#1e1e1e') + r(150, 222, 20, 3, '#1e1e1e') + r(146, 140, 26, 26, '#2f6fb3') + r(157, 151, 4, 4, '#e7e7e7')),

  street: () => svg('A barangay street after school',
    r(0, 0, 180, 96, '#7ec8e3') + r(0, 34, 180, 1, '#1e1e1e') + r(0, 44, 180, 1, '#1e1e1e') + r(40, 34, 2, 30, '#5a5a5a') +
    // sari-sari store and the PisoNet cabinet beside it
    r(0, 84, 98, 14, '#8e959c') + repeat(7, i => r(i * 14, 84, 2, 14, '#c0c4c8')) + r(0, 98, 98, 168, '#e5793b') +
    r(8, 126, 76, 54, '#4a2a12') + repeat(6, i => r(12 + i * 12, 130, 8, 10, ['#d94f8a', '#f2d24b', '#7fa650'][i % 3])) + r(8, 180, 76, 8, '#8b5a2b') +
    r(72, 186, 24, 64, '#c9a46a') + r(76, 192, 16, 13, '#1b2a4a') + r(78, 194, 6, 2, '#7fa650') + r(82, 212, 4, 2, '#1e1e1e') +
    // house with the internet cafe on the ground floor, a blank tarpaulin, a tricycle
    r(104, 56, 76, 210, '#f7f2e6') + r(112, 72, 22, 26, '#3f6fc9') + r(146, 72, 22, 26, '#3f6fc9') + r(108, 166, 68, 14, '#3f6fc9') +
    r(122, 186, 32, 80, '#2c3e66') + r(24, 58, 60, 18, '#d94f8a') +
    r(0, 266, 180, 54, '#5a5a5a') + repeat(5, i => r(8 + i * 38, 292, 18, 3, '#f2d24b')) +
    r(118, 258, 44, 26, '#b23a2e') + r(122, 252, 30, 8, '#1e1e1e') + r(122, 282, 9, 9, '#1e1e1e') + r(150, 282, 9, 9, '#1e1e1e') +
    kid(30, 238) + kid(44, 240) + kid(92, 246)),

  lan: () => svg('Inside a LAN cafe',
    r(0, 0, 180, 320, '#1b2a4a') + r(0, 0, 180, 40, '#2c3e66') + r(80, 14, 20, 4, '#8e959c') + r(88, 8, 4, 8, '#8e959c') +
    repeat(2, row => r(0, 150 + row * 86, 180, 12, '#6b3d1c') +
      repeat(5, i => r(6 + i * 36, 120 + row * 86, 28, 22, '#c0c4c8') + r(9 + i * 36, 123 + row * 86, 22, 15, i % 2 ? '#7ec8e3' : '#7fa650') +
        r(12 + i * 36, 140 + row * 86 + 22, 16, 4, '#1e1e1e') + r(14 + i * 36, 160 + row * 86, 10, 12, '#f7f2e6') + r(15 + i * 36, 154 + row * 86, 8, 7, '#1e1e1e'))) +
    r(130, 60, 44, 36, '#4a2a12') + r(136, 66, 14, 10, '#e2b84a')),

  mall: () => svg('A mall atrium on a weekend',
    r(0, 0, 180, 320, '#f7f2e6') + r(30, 0, 120, 22, '#9fd3ff') + repeat(5, i => r(30 + i * 24, 0, 2, 22, '#c0c4c8')) +
    repeat(4, i => r(0, 40 + i * 62, 180, 6, '#c0c4c8') + repeat(4, j => r(6 + j * 44, 50 + i * 62, 36, 30, ['#3f6fc9', '#d94f8a', '#e2b84a', '#7fa650'][(i + j) % 4]))) +
    repeat(10, i => r(60 + i * 6, 170 + i * 10, 26, 6, '#8e959c')) + r(120, 280, 50, 14, '#9fd3ff') +
    kid(20, 292, '#d94f8a', '#3f6fc9') + kid(34, 290, '#f2d24b', '#3f6fc9') + kid(98, 294, '#1e1e1e', '#2c3e66')),

  parlor: () => svg('A neighborhood parlor beside a pageant stage',
    r(0, 0, 110, 320, '#d94f8a') + r(10, 40, 80, 70, '#c0c4c8') + r(14, 44, 72, 62, '#9fd3ff') +
    r(14, 150, 30, 40, '#b23a2e') + r(56, 150, 30, 40, '#b23a2e') + r(16, 120, 26, 20, '#c0c4c8') + r(58, 120, 26, 20, '#c0c4c8') +
    r(0, 230, 110, 90, '#e7c48a') + r(110, 0, 70, 320, '#1b2a4a') + repeat(8, i => r(116 + (i % 4) * 16, 40 + Math.floor(i / 4) * 10, 3, 3, '#f2d24b')) +
    r(112, 180, 68, 30, '#6b3d1c') + r(140, 150, 8, 30, '#f7f2e6') + r(141, 144, 6, 6, '#1e1e1e') +
    repeat(6, i => r(114 + (i % 3) * 22, 240 + Math.floor(i / 3) * 26, 14, 10, '#f7f2e6'))),

  gig: () => svg('A small bar during a band gig',
    r(0, 0, 180, 320, '#1e1e1e') + repeat(18, i => r((i % 6) * 30 + 2, 20 + Math.floor(i / 6) * 34, 26, 30, ['#e7c48a', '#d94f8a', '#f7f2e6', '#e2b84a'][i % 4])) +
    r(0, 170, 180, 40, '#4a2a12') + r(10, 140, 20, 30, '#3a3a3a') + r(150, 140, 20, 30, '#3a3a3a') +
    repeat(4, i => r(40 + i * 28, 132, 10, 38, '#26321c') + r(41 + i * 28, 124, 8, 8, '#26321c')) +
    repeat(12, i => r((i % 6) * 30 + 6, 240 + Math.floor(i / 6) * 30, 12, 20, '#2c3e66'))),

  bedroom: () => svg('A bedroom at night',
    r(0, 0, 180, 320, '#1b2a4a') + r(110, 30, 56, 70, '#2c3e66') + r(114, 34, 48, 62, '#0f1830') +
    repeat(9, i => r(118 + (i * 13) % 40, 70 + (i * 7) % 22, 2, 2, '#f2d24b')) + r(146, 40, 8, 8, '#fdf6e3') +
    r(14, 40, 40, 54, '#2c3e66') + r(62, 52, 30, 40, '#2c3e66') +
    r(0, 200, 180, 120, '#16213b') + r(8, 176, 130, 70, '#2c3e66') + repeat(10, i => r(12 + (i % 5) * 26, 182 + Math.floor(i / 5) * 22, 12, 12, '#3f6fc9')) +
    r(40, 166, 70, 24, '#3f6fc9') + r(60, 178, 22, 10, '#b7c79a') + r(150, 200, 26, 40, '#4a2a12')),

  edsa: () => svg('The EDSA Shrine at dusk, filled with a crowd',
    r(0, 0, 180, 60, '#2c3e66') + r(0, 60, 180, 40, '#d94f8a') + r(0, 100, 180, 40, '#e5793b') +
    r(60, 70, 60, 70, '#1e1e1e') + r(70, 60, 40, 10, '#1e1e1e') + r(86, 20, 8, 50, '#1e1e1e') + r(84, 14, 12, 8, '#1e1e1e') +
    r(0, 140, 180, 180, '#26321c') +
    repeat(60, i => r((i * 29) % 176, 150 + Math.floor(i / 6) * 17, 5, 5, '#1e1e1e')) +
    repeat(26, i => r((i * 41 + 7) % 174, 154 + ((i * 37) % 150), 2, 2, i % 3 ? '#b7c79a' : '#f2d24b'))),
};

export const placeholder = name => (SCENES[name] ? SCENES[name]() : '');

// Broadcast frames for the sala's CRT, 64x48, standing in for the tv- slots.
const frame = (label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 48" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" role="img" aria-label="${label}">${body}</svg>`;
const dancer = (x, y, outfit) => r(x + 1, y, 3, 3, '#1e1e1e') + r(x, y + 3, 5, 7, outfit) + r(x + 1, y + 10, 1, 4, '#e0ac7e') + r(x + 3, y + 10, 1, 4, '#e0ac7e');

const BROADCASTS = {
  noontime: () => frame('A noontime variety show',
    r(0, 0, 64, 48, '#d94f8a') + r(0, 32, 64, 16, '#f2d24b') + r(3, 4, 12, 22, '#3f6fc9') + r(49, 4, 12, 22, '#3f6fc9') + r(20, 2, 24, 7, '#e2b84a') +
    repeat(6, i => dancer(5 + i * 9, 17, i % 2 ? '#f7f2e6' : '#e2b84a')) + repeat(14, i => r((i * 23) % 62, (i * 11) % 30, 1, 1, ['#ffffff', '#9fd3ff', '#7fa650'][i % 3]))),
  asianovela: () => frame('A dubbed campus drama',
    r(0, 0, 64, 30, '#9fd3ff') + r(0, 30, 64, 18, '#7fa650') + r(40, 6, 20, 16, '#4f7a3a') + r(48, 22, 4, 10, '#6b3d1c') +
    r(8, 30, 30, 3, '#8b5a2b') + r(10, 33, 2, 5, '#6b3d1c') + r(34, 33, 2, 5, '#6b3d1c') +
    r(11, 22, 4, 4, '#1e1e1e') + r(10, 26, 6, 5, '#f7f2e6') + r(29, 22, 4, 4, '#1e1e1e') + r(28, 26, 6, 5, '#d94f8a') +
    repeat(7, i => r(30 + (i * 7) % 32, 8 + (i * 5) % 30, 1, 1, '#e5793b'))),
  teleserye: () => frame('A primetime teleserye confrontation',
    r(0, 0, 64, 48, '#2c3e66') + r(0, 36, 64, 12, '#4a2a12') + r(26, 0, 12, 2, '#e2b84a') + r(28, 2, 8, 5, '#f2d24b') +
    repeat(6, i => r(44 + i * 3, 36 - i * 5, 20, 2, '#8b5a2b')) + r(18, 16, 4, 4, '#1e1e1e') + r(17, 20, 6, 14, '#b23a2e') +
    r(30, 24, 4, 4, '#1e1e1e') + r(29, 28, 7, 8, '#f7f2e6')),
  reality: () => frame('A reality show house',
    r(0, 0, 64, 48, '#e5793b') + r(0, 34, 64, 14, '#c9a46a') + r(6, 26, 52, 10, '#3f6fc9') + r(6, 22, 52, 5, '#2f6fb3') +
    repeat(4, i => r(12 + i * 12, 16, 4, 5, '#1e1e1e') + r(11 + i * 12, 21, 6, 6, ['#f7f2e6', '#d94f8a', '#f2d24b', '#7fa650'][i])) +
    r(1, 1, 3, 2, '#1e1e1e') + r(60, 1, 3, 2, '#1e1e1e')),
  boxing: () => frame('A live boxing broadcast',
    r(0, 0, 64, 48, '#1b2a4a') + r(0, 30, 64, 18, '#c0c4c8') + r(0, 22, 64, 1, '#b23a2e') + r(0, 26, 64, 1, '#b23a2e') +
    repeat(5, i => r(6 + i * 13, 2, 3, 2, '#fdf6e3')) +
    r(20, 14, 4, 4, '#1e1e1e') + r(19, 18, 6, 7, '#e0ac7e') + r(19, 25, 6, 4, '#3f6fc9') + r(25, 19, 4, 3, '#b23a2e') +
    r(38, 14, 4, 4, '#1e1e1e') + r(37, 18, 6, 7, '#c68a5e') + r(37, 25, 6, 4, '#b23a2e') + r(33, 19, 4, 3, '#b23a2e')),
  news: () => frame('A late-night newscast',
    r(0, 0, 64, 48, '#3f6fc9') + r(4, 6, 24, 14, '#2f6fb3') + r(8, 9, 6, 4, '#7fa650') + r(16, 12, 8, 5, '#7fa650') +
    r(36, 14, 6, 6, '#1e1e1e') + r(34, 20, 10, 12, '#2c3e66') + r(38, 20, 2, 5, '#f7f2e6') + r(0, 32, 64, 16, '#8b5a2b') + r(0, 42, 64, 6, '#b23a2e')),
};

export const broadcast = name => (BROADCASTS[name] ? BROADCASTS[name]() : '');
