// 6x6 grid, rows 0-5, cols 0-5
// Rooms:
//   Woonkamer:  rows 0-2, cols 0-2
//   Keuken:     rows 0-2, cols 3-5
//   Eetkamer:   rows 3-5, cols 0-2
//   Slaapkamer: rows 3-5, cols 3-5

export const ROOMS = {
  woonkamer:  { name: 'Woonkamer',        color: 'bg-amber-100',  border: 'border-amber-400',  emoji: '🛋️', rows: [0,1,2], cols: [0,1,2] },
  keuken:     { name: 'Keuken',           color: 'bg-green-100',  border: 'border-green-400',  emoji: '🍳', rows: [0,1,2], cols: [3,4,5] },
  eetkamer:   { name: 'Eetkamer',         color: 'bg-blue-100',   border: 'border-blue-400',   emoji: '🪑', rows: [3,4,5], cols: [0,1,2] },
  slaapkamer: { name: 'Grote Slaapkamer', color: 'bg-purple-100', border: 'border-purple-400', emoji: '🛏️', rows: [3,4,5], cols: [3,4,5] },
};

// Objects grid: null or { type, label }
// Hideable spots: 'bed', 'carpet', 'window'
// Decoration only: 'table', 'plant'
export const CELL_OBJECTS = [
  //col:  0                           1                           2     3                           4     5
  /* r0 */[null,                       { type:'window',label:'Raam' }, null, { type:'table', label:'Tafel'},null, null                         ],
  /* r1 */[null,                       { type:'plant', label:'Plant'}, null, null,                         null, { type:'plant', label:'Plant'}],
  /* r2 */[{ type:'table',label:'Tafel'},null,                         null, null,                         null, null                         ],
  /* r3 */[null,                       { type:'table', label:'Tafel'}, null, null,                         { type:'window',label:'Raam' },null ],
  /* r4 */[null,                       null,                          null, null,                          { type:'bed',  label:'Bed'   },null ],
  /* r5 */[{ type:'carpet',label:'Tapijt'},null,                       null, null,                         null, null                         ],
];

export const HIDEABLES = new Set(['bed', 'carpet', 'window']);

export function getRoomKey(row, col) {
  for (const [key, room] of Object.entries(ROOMS)) {
    if (room.rows.includes(row) && room.cols.includes(col)) return key;
  }
  return null;
}

export function getRoomName(row, col) {
  const key = getRoomKey(row, col);
  return key ? ROOMS[key].name : null;
}

// Characters (the seekers / hiders who are found first)
export const CHARACTERS = [
  { id: 'adam',  name: 'Adam',  avatar: '👦🏽', bg: 'bg-red-200',    ring: 'ring-red-400',    label: 'text-red-800'   },
  { id: 'bella', name: 'Bella', avatar: '👧🏻', bg: 'bg-pink-200',   ring: 'ring-pink-400',   label: 'text-pink-800'  },
  { id: 'cora',  name: 'Cora',  avatar: '🧒🏾', bg: 'bg-orange-200', ring: 'ring-orange-400', label: 'text-orange-800'},
  { id: 'david', name: 'David', avatar: '👦🏼', bg: 'bg-cyan-200',   ring: 'ring-cyan-400',   label: 'text-cyan-800'  },
  { id: 'ella',  name: 'Ella',  avatar: '👧🏿', bg: 'bg-lime-200',   ring: 'ring-lime-400',   label: 'text-lime-800'  },
];

export const FINN = { id: 'finn', name: 'Finn', avatar: '🙈', bg: 'bg-yellow-200', ring: 'ring-yellow-400', label: 'text-yellow-800' };

// Solution: [row, col] for each id — unique row AND unique column
// adam[0,4] bella[1,0] cora[2,5] david[3,2] ella[4,3] finn[5,1]
// Rows: 0,1,2,3,4,5  Cols: 4,0,5,2,3,1  → all unique ✓
export const SOLUTION = {
  adam:  [0, 4],
  bella: [1, 0],
  cora:  [2, 5],
  david: [3, 2],
  ella:  [4, 3],
  finn:  [5, 1],
};

function adjHas(row, col, type) {
  return [[row-1,col],[row+1,col],[row,col-1],[row,col+1]]
    .some(([r,c]) => r>=0&&r<6&&c>=0&&c<6 && CELL_OBJECTS[r]?.[c]?.type === type);
}

// Clue sets — enough to pin each character to exactly one cell
export const CLUE_SETS = {
  adam: [
    { text: 'Adam verstopte zich in de Keuken.' ,       ok: (r,c) => getRoomKey(r,c) === 'keuken' },
    { text: 'Adam zat in de bovenste rij van het huis.',ok: (r,c) => r === 0 },
    { text: 'Adam stond naast een tafel.',              ok: (r,c) => adjHas(r,c,'table') },
  ],
  bella: [
    { text: 'Bella was NIET in de Keuken.',             ok: (r,c) => getRoomKey(r,c) !== 'keuken' },
    { text: 'Bella zat in de bovenste helft van het huis.', ok: (r,c) => r < 3 },
    { text: 'Bella stond in de eerste kolom.',          ok: (r,c) => c === 0 },
    { text: 'Bella stond naast een plant.',             ok: (r,c) => adjHas(r,c,'plant') },
  ],
  cora: [
    { text: 'Cora verstopte zich in de Keuken.',        ok: (r,c) => getRoomKey(r,c) === 'keuken' },
    { text: 'Cora zat in de onderste rij van de Keuken.', ok: (r,c) => r === 2 },
    { text: 'Cora stond naast een plant.',              ok: (r,c) => adjHas(r,c,'plant') },
  ],
  david: [
    { text: 'David was in de Eetkamer.',                ok: (r,c) => getRoomKey(r,c) === 'eetkamer' },
    { text: 'David stond in de derde kolom.',           ok: (r,c) => c === 2 },
    { text: 'David stond naast een tafel.',             ok: (r,c) => adjHas(r,c,'table') },
  ],
  ella: [
    { text: 'Ella was in de Grote Slaapkamer.',         ok: (r,c) => getRoomKey(r,c) === 'slaapkamer' },
    { text: 'Ella stond in de eerste kolom van de Slaapkamer.', ok: (r,c) => c === 3 },
    { text: 'Ella stond naast een bed.',                ok: (r,c) => adjHas(r,c,'bed') },
  ],
};

// Pre-compute valid cells per character given all clues
export function getValidCells(charId) {
  const clues = CLUE_SETS[charId] || [];
  const cells = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      if (clues.every(cl => cl.ok(r, c))) cells.push([r, c]);
    }
  }
  return cells;
}

// Whoever shares Finn's room is the finder
export function getFinder() {
  const [fr, fc] = SOLUTION.finn;
  const finnRoom = getRoomKey(fr, fc);
  for (const ch of CHARACTERS) {
    const [r, c] = SOLUTION[ch.id];
    if (getRoomKey(r, c) === finnRoom) return ch;
  }
  return null;
}
