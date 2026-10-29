// Pixel people, always seen from behind: no faces, the same few figures reused across the wing.
// Each figure is a pixel map at the scene art's own scale, one map pixel to one art pixel (CSS sizes
// it with --px). Letters name a role and the figure's look colors it from the art's palette:
//   h hair    H hair sheen    s skin    S skin shade    t top    T top shade
//   b bottom  B bottom shade  k slippers
// and a few only drawn for some looks:
//   u U bun (else empty)      q long hair (else empty)
//   g G n N long hair (else top, top shade, skin, skin shade)      l L ID lace (else top, top shade)
// The outline is traced around whatever is filled. Seated, a second frame is the arms-up dance pose;
// standing figures can also walk, two strides that each lift one slipper.

const SEATED = [[
  '..........uuuu..........',
  '.........uUuuuu.........',
  '.........uuuuuu.........',
  '.........hhhhhh.........',
  '........hhHHhhhh........',
  '.......hHHhhhhhhh.......',
  '.......hHhhhhhhhh.......',
  '......shhhhhhhhhhS......',
  '......shhhhhhhhhhS......',
  '.......hhhhhhhhhh.......',
  '.......hhhhhhhhhh.......',
  '.......qhhhhhhhhq.......',
  '.......qqhhhhhhqq.......',
  '.......qqqnnnNqqq.......',
  '.......qqgnnnNGqq.......',
  '.....tlgggggggGGGLT.....',
  '....ttlgggggggGGGLTT....',
  '....tttgggggggGGGTTT....',
  '....tttgggggggGGGTTT....',
  '....sstgggggggGGGTSS....',
  '....sstgggggggGGGTSS....',
  '....ssttggggggGGTTSS....',
  '....sstttgggggGTTTSS....',
  '....ssttttttttTTTTSS....',
  '....ssttttttttTTTTSS....',
  '....ssttttttttTTTTSS....',
  '...sssttttttttTTTTSSS...',
  '..sssbbbbbbbbbbbBBBSSS..',
  '.bbbbbbbbbbbbbbbbBBBBBB.',
  'bbbbbbbbbbbbbbbbbbBBBBBB',
  'bbbbbbbbbbbbbbbbbbBBBBBB',
  'bbbbbbbbbbbbbbbbbBBBBBBB',
  '.bbbbbbbbbbbbbbbBBBBBBB.',
  '..BBBBBBBBBBBBBBBBBBBB..',
], [
  '..........uuuu..........',
  '.........uUuuuu.........',
  '.........uuuuuu.........',
  '.........hhhhhh.........',
  '...ss...hhHHhhhh...SS...',
  '...ss..hHHhhhhhhh..SS...',
  '...ss..hHhhhhhhhh..SS...',
  '...ss.shhhhhhhhhhS.SS...',
  '...ss.shhhhhhhhhhS.SS...',
  '...ss..hhhhhhhhhh..SS...',
  '...tt..hhhhhhhhhh..TT...',
  '...tt..qhhhhhhhhq..TT...',
  '...tt..qqhhhhhhqq..TT...',
  '...ttt.qqqnnnNqqq.TTT...',
  '....tttqqgnnnNGqqTTT....',
  '.....tlgggggggGGGLT.....',
  '.....tlgggggggGGGLT.....',
  '.....ttgggggggGGGTT.....',
  '.....ttgggggggGGGTT.....',
  '.....ttgggggggGGGTT.....',
  '.....ttgggggggGGGTT.....',
  '.....tttggggggGGTTT.....',
  '.....ttttgggggGTTTT.....',
  '.....tttttttttTTTTT.....',
  '.....tttttttttTTTTT.....',
  '.....tttttttttTTTTT.....',
  '.....tttttttttTTTTT.....',
  '...bbbbbbbbbbbbbBBBBB...',
  '.bbbbbbbbbbbbbbbbBBBBBB.',
  'bbbbbbbbbbbbbbbbbbBBBBBB',
  'bbbbbbbbbbbbbbbbbbBBBBBB',
  'bbbbbbbbbbbbbbbbbBBBBBBB',
  '.bbbbbbbbbbbbbbbBBBBBBB.',
  '..BBBBBBBBBBBBBBBBBBBB..',
]];

const CHILD = [[
  '..................',
  '..................',
  '......hhhhhh......',
  '.....hHHhhhhh.....',
  '.....hHhhhhhh.....',
  '....shhhhhhhhS....',
  '....shhhhhhhhS....',
  '.....hhhhhhhh.....',
  '......hhhhhh......',
  '.......sssS.......',
  '....tttttttTTT....',
  '...ttttttttTTTT...',
  '...ttttttttTTTT...',
  '...ssttttttTTSS...',
  '...ssttttttTTSS...',
  '...ssttttttTTSS...',
  '...ssttttttTTSS...',
  '..sssttttttTTSSS..',
  '..sssbbbbbbBBSSS..',
  '.bbbbbbbbbbbBBBBB.',
  'bbbbbbbbbbbbbBBBBB',
  'bbbbbbbbbbbbbBBBBB',
  '.bbbbbbbbbbbBBBBB.',
  '..BBBBBBBBBBBBBB..',
], [
  '..................',
  '..................',
  '.ss...hhhhhh...SS.',
  '.ss..hHHhhhhh..SS.',
  '.ss..hHhhhhhh..SS.',
  '.ss.shhhhhhhhS.SS.',
  '.tt.shhhhhhhhS.TT.',
  '.tt..hhhhhhhh..TT.',
  '.ttt..hhhhhh..TTT.',
  '..ttt..sssS..TTT..',
  '...ttttttttTTTT...',
  '....ttttttTTTT....',
  '....ttttttTTTT....',
  '....ttttttTTTT....',
  '....ttttttTTTT....',
  '....ttttttTTTT....',
  '....ttttttTTTT....',
  '....ttttttTTTT....',
  '...bbbbbbbbBBBB...',
  '.bbbbbbbbbbbBBBBB.',
  'bbbbbbbbbbbbbBBBBB',
  'bbbbbbbbbbbbbBBBBB',
  '.bbbbbbbbbbbBBBBB.',
  '..BBBBBBBBBBBBBB..',
]];

// Standing figures share one body; only the legs change between standing still and walking.
const BODY = [
  '..................',
  '..................',
  '......hhhhhh......',
  '.....hHHhhhhh.....',
  '.....hHhhhhhh.....',
  '....shhhhhhhhS....',
  '....shhhhhhhhS....',
  '.....hhhhhhhh.....',
  '.....hhhhhhhh.....',
  '.....qhhhhhhq.....',
  '.....qqnnnNqq.....',
  '....tlgggggGGL....',
  '..tttlggggggGLTT..',
  '..ttttggggggGTTT..',
  '..ssttggggggGTSS..',
  '..ssttggggggGTSS..',
  '..ssttggggggGTSS..',
  '..ssttggggggGTSS..',
  '..sstttgggggTTSS..',
  '..ssttttgggtTTSS..',
  '..ssttttttttTTSS..',
  '..ssttttttttTTSS..',
  '..ssttttttttTTSS..',
  '..ssttttttttTTSS..',
  '..ssttttttttTTSS..',
  '..ssttttttttTTSS..',
  '..ssbbbbbbbbBBSS..',
  '...sbbbbbbbbBBS...',
  '....bbbbbbbbBB....',
  '....bbbbbbbbBB....',
];
const LEG = '....bbbb..bbBB....';
const STANDING = [[...BODY, ...Array(11).fill(LEG), '....kkkk..kkkk....', '....kkkk..kkkk....']];
const WALKING = [
  [...BODY, ...Array(9).fill(LEG), '....kkkk..bbBB....', '....kkkk..bbBB....', '..........kkkk....', '..........kkkk....'],
  [...BODY, ...Array(9).fill(LEG), '....bbbb..kkkk....', '....bbbb..kkkk....', '....kkkk..........', '....kkkk..........'],
];

// Shades and sheens, each a darker or lighter neighbor in the art's 32-color palette.
const SHADE = {
  '#d94f8a': '#b23a2e', '#f7f2e6': '#c0c4c8', '#7fa650': '#4f7a3a', '#2c3e66': '#1b2a4a',
  '#f2d24b': '#c9a46a', '#3f6fc9': '#2c3e66', '#e5793b': '#b23a2e', '#9fd3ff': '#7ec8e3',
  '#b23a2e': '#9c2f25', '#c0c4c8': '#8e959c', '#e2b84a': '#c9a46a', '#1b2a4a': '#1e1e1e',
  '#355fae': '#2c3e66', '#5a5a5a': '#1e1e1e', '#4a2a12': '#1e1e1e',
  '#e0ac7e': '#c68a5e', '#c68a5e': '#8d5a3b', '#8d5a3b': '#6b3d1c',
};
const SHEEN = { '#1e1e1e': '#4a2a12', '#c0c4c8': '#fdf6e3', '#4a2a12': '#8b5a2b' };
const OUTLINE = '#1e1e1e';
const LACE = '#b23a2e';
const SLIPPERS = '#4a2a12';

// One <path> per color, each a set of rectangles: runs along a row, stacked while the rows repeat.
function paint(rows, color) {
  const w = rows[0].length + 2;
  const h = rows.length + 2;
  const grid = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => color[rows[y - 1]?.[x - 1]] ?? null));
  const filled = (x, y) => Boolean(grid[y]?.[x]) && grid[y][x] !== OUTLINE;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!grid[y][x] && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) grid[y][x] = OUTLINE;
    }
  }
  const paths = {};
  let open = {};
  for (let y = 0; y <= h; y++) {
    const runs = {};
    for (let x = 0; y < h && x < w;) {
      const c = grid[y][x];
      let end = x + 1;
      while (end < w && grid[y][end] === c) end++;
      if (c) runs[`${c} ${x} ${end - x}`] = { c, x, n: end - x };
      x = end;
    }
    for (const [key, r] of Object.entries(open)) {
      if (runs[key]) { runs[key].y = r.y; continue; }
      paths[r.c] = (paths[r.c] ?? '') + `M${r.x} ${r.y}h${r.n}v${y - r.y}h-${r.n}z`;
    }
    for (const r of Object.values(runs)) r.y ??= y;
    open = runs;
  }
  return Object.entries(paths).map(([c, d]) => `<path fill="${c}" d="${d}"/>`).join('');
}

export function person({ hair = '#1e1e1e', top = '#3f6fc9', bottom = null, skin = '#c68a5e', bun = false, long = false, lace = false, standing = false, walking = false, child = false } = {}) {
  const pose = standing ? (walking ? WALKING : STANDING) : child ? CHILD : SEATED;
  // Seated, an unset bottom continues the top as a dress or duster; standing, it is dark trousers.
  const under = bottom ?? (standing ? '#2c3e66' : top);
  const shade = c => SHADE[c] ?? c;
  const color = {
    h: hair, H: SHEEN[hair] ?? hair, s: skin, S: shade(skin), t: top, T: shade(top), b: under, B: shade(under), k: SLIPPERS,
    u: bun ? hair : null, U: bun ? SHEEN[hair] ?? hair : null, q: long ? hair : null,
    g: long ? hair : top, G: long ? hair : shade(top), n: long ? hair : skin, N: long ? hair : shade(skin),
    l: lace ? LACE : top, L: lace ? LACE : shade(top),
  };
  const w = pose[0][0].length + 2;
  const h = pose[0].length + 2;
  // The dance frame stands one pixel taller, a small hop; the walking strides stay on the floor.
  const hop = walking ? '' : ' transform="translate(0 -1)"';
  const frames = pose.map((rows, i) => (i ? `<g class="pose-b"${hop}>` : '<g class="pose-a">') + paint(rows, color) + '</g>');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="--cols:${w}" shape-rendering="crispEdges" aria-hidden="true">${frames.join('')}</svg>`;
}

// The sala's household: Lola in a duster, Tatay in a sando, Ate in office clothes with her ID lace.
export const FAMILY = {
  lola: { hair: '#c0c4c8', top: '#d94f8a', bun: true },
  tatay: { top: '#f7f2e6', bottom: '#2c3e66', skin: '#8d5a3b' },
  nanay: { top: '#7fa650', bun: true },
  ate: { hair: '#4a2a12', top: '#2c3e66', long: true, lace: true, skin: '#e0ac7e' },
  bunso: { top: '#f2d24b', bottom: '#3f6fc9', child: true },
};

// Neighbors who squeeze in for fight night.
export const NEIGHBORS = [
  { top: '#e5793b' }, { top: '#9fd3ff', hair: '#4a2a12', bottom: '#5a5a5a' }, { top: '#b23a2e', skin: '#8d5a3b' },
  { top: '#c0c4c8', bottom: '#4a2a12' }, { top: '#7fa650', hair: '#4a2a12' }, { top: '#e2b84a', skin: '#e0ac7e', bottom: '#355fae' },
];
