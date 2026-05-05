import { SOLUTION, ROOMS, getRoomKey } from '../gameData';

export default function WinScreen({ finder, onReset }) {
  const [fr, fc] = SOLUTION.finn;
  const finnRoomKey = getRoomKey(fr, fc);
  const finnRoom = ROOMS[finnRoomKey];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-bounce-in">
        {/* Confetti emojis */}
        <div className="text-4xl mb-2 flex justify-center gap-2">
          🎉 🙈 🎊
        </div>

        <h1 className="text-3xl font-black text-purple-700 mb-2">Gevonden!</h1>

        <p className="text-xl text-gray-700 mb-1">
          Finn zat verstopt in de
        </p>
        <p className={`text-2xl font-bold mb-4 ${finnRoom?.border?.replace('border','text') ?? 'text-gray-700'}`}>
          {finnRoom?.emoji} {finnRoom?.name}
        </p>

        {finder && (
          <div className={`rounded-2xl ${finder.bg} p-4 mb-6`}>
            <div className="text-4xl mb-1">{finder.avatar}</div>
            <p className={`text-xl font-black ${finder.label}`}>
              {finder.name} vond Finn!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Ze zaten in dezelfde kamer.
            </p>
          </div>
        )}

        <button
          onClick={onReset}
          className="bg-purple-600 hover:bg-purple-700 active:scale-95 transition text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg"
        >
          Opnieuw spelen
        </button>
      </div>
    </div>
  );
}
