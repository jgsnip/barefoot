import { ROOMS, CELL_OBJECTS, CHARACTERS, FINN, SOLUTION, getRoomKey } from '../gameData';

const ROOM_KEYS = Object.keys(ROOMS);

function getRoomStyle(row, col) {
  const key = getRoomKey(row, col);
  return key ? ROOMS[key] : null;
}

function getBorderClasses(row, col) {
  // Draw thick borders between rooms
  const borders = [];
  if (row === 0) borders.push('border-t-2');
  if (col === 0) borders.push('border-l-2');
  // right border
  if (col === 2 || col === 5) borders.push('border-r-2');
  // bottom border
  if (row === 2 || row === 5) borders.push('border-b-2');
  // inner room borders (thin)
  if (col !== 2 && col !== 5) borders.push('border-r');
  if (row !== 2 && row !== 5) borders.push('border-b');
  return borders.join(' ');
}

function ObjectIcon({ obj }) {
  if (!obj) return null;
  const icons = { table: '🪑', plant: '🌿', bed: '🛏️', carpet: '🟫', window: '🪟' };
  return (
    <span className="absolute top-0.5 right-0.5 text-xs opacity-60" title={obj.label}>
      {icons[obj.type] ?? '?'}
    </span>
  );
}

function charById(id) {
  if (id === 'finn') return FINN;
  return CHARACTERS.find(c => c.id === id) ?? null;
}

export default function Grid({ grid, selected, toggleCell, won }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Room labels */}
      <div className="grid grid-cols-2 gap-1 w-full max-w-sm text-xs font-semibold mb-1">
        {Object.values(ROOMS).map(room => (
          <div key={room.name} className={`${room.color} ${room.border} border rounded px-2 py-0.5 text-center`}>
            {room.emoji} {room.name}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid border-2 border-gray-700 rounded-xl overflow-hidden shadow-lg"
        style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', width: 'min(90vw, 360px)' }}
      >
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => {
            const room = getRoomStyle(row, col);
            const obj = CELL_OBJECTS[row]?.[col];
            const cellVal = grid[row][col];
            const char = cellVal && cellVal !== 'X' ? charById(cellVal) : null;
            const isX = cellVal === 'X';
            const isSolution = won && SOLUTION[selected] && SOLUTION[selected][0]===row && SOLUTION[selected][1]===col;

            let cellBg = room?.color ?? 'bg-gray-100';
            if (selected && !char && !isX) cellBg += ' cursor-pointer hover:brightness-90';

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => toggleCell(row, col)}
                className={`
                  relative aspect-square flex items-center justify-center
                  ${cellBg}
                  border-gray-400
                  ${getBorderClasses(row, col)}
                  transition-all duration-100
                  ${!won ? 'cursor-pointer active:scale-95' : ''}
                `}
              >
                <ObjectIcon obj={obj} />
                {isX && (
                  <span className="text-red-500 font-black select-none" style={{ fontSize: '1.1em' }}>✕</span>
                )}
                {char && (
                  <span
                    className={`select-none rounded-full flex items-center justify-center font-bold text-xs ${char.bg} ring-2 ${char.ring}`}
                    style={{ width: '80%', height: '80%', fontSize: '1.2em' }}
                    title={char.name}
                  >
                    {char.avatar}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Row/col legend */}
      <div className="text-xs text-gray-400 mt-1">
        Elke speler staat in een unieke rij én kolom
      </div>
    </div>
  );
}
