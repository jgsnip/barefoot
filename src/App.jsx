import useGameState from './useGameState';
import Grid from './components/Grid';
import CharacterPanel from './components/CharacterPanel';
import WinScreen from './components/WinScreen';

export default function App() {
  const { grid, selected, selectChar, toggleCell, won, finder, resetGame } = useGameState();

  const selectedName = selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">🔍 Verstoppertje</h1>
            <p className="text-purple-100 text-xs mt-0.5">Vind alle kinderen — ontdek wie Finn vond!</p>
          </div>
          <button
            onClick={resetGame}
            className="bg-white/20 hover:bg-white/30 active:scale-95 transition text-white text-sm font-semibold px-3 py-1.5 rounded-full"
          >
            Herstart
          </button>
        </div>
      </header>

      {selected ? (
        <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
          Tik een vakje aan om <strong>{selectedName}</strong> te plaatsen — of tik opnieuw op de speler om te deselecteren
        </div>
      ) : (
        <div className="bg-gray-100 text-gray-500 text-center py-2 text-xs">
          Selecteer een speler om te plaatsen • Tik een leeg vakje aan voor ✕ (elimineer)
        </div>
      )}

      <main className="max-w-4xl mx-auto px-3 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <Grid grid={grid} selected={selected} toggleCell={toggleCell} won={won} />
        </section>
        <section>
          <CharacterPanel selected={selected} selectChar={selectChar} grid={grid} />
        </section>
      </main>

      {won && <WinScreen finder={finder} onReset={resetGame} />}
    </div>
  );
}
