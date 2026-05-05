import { CHARACTERS, CLUE_SETS } from '../gameData';

export default function CharacterPanel({ selected, selectChar, grid }) {
  // Determine which chars are placed
  const placed = new Set();
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const v = grid[r][c];
      if (v && v !== 'X') placed.add(v);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-700 text-center">Spelers & Aanwijzingen</h2>
      {CHARACTERS.map(ch => {
        const isSelected = selected === ch.id;
        const isPlaced = placed.has(ch.id);
        const clues = CLUE_SETS[ch.id] ?? [];

        return (
          <div
            key={ch.id}
            className={`
              rounded-2xl border-2 p-3 transition-all
              ${isSelected ? `${ch.ring} ring-4 ring-offset-1 shadow-lg` : 'border-gray-200'}
              ${ch.bg}
            `}
          >
            <button
              className="flex items-center gap-2 w-full text-left"
              onClick={() => selectChar(ch.id)}
            >
              <span className="text-2xl">{ch.avatar}</span>
              <span className={`font-bold ${ch.label} text-base`}>{ch.name}</span>
              {isPlaced && <span className="ml-auto text-green-600 text-lg">✓</span>}
              {isSelected && !isPlaced && <span className="ml-auto text-blue-500 text-sm font-semibold">Plaatsen →</span>}
            </button>

            <ul className="mt-2 space-y-1">
              {clues.map((cl, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-1.5">
                  <span className="text-purple-400 mt-0.5">🔍</span>
                  <span>{cl.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="mt-2 rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🙈</span>
          <span className="font-bold text-yellow-700">Finn</span>
          <span className="ml-2 text-xs text-yellow-600 italic">de beste verstopper</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Finn's schuilplaats is de laatste cel die overblijft. Wie zit er in dezelfde kamer? Dat is de vinder!
        </p>
      </div>
    </div>
  );
}
