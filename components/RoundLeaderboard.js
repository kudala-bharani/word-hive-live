export default function RoundLeaderboard({ players, currentPlayerId, title, subtitle }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">{title}</h2>
      {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}
      <div className="space-y-3">
        {sorted.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              player.id === currentPlayerId
                ? 'bg-honey-50 border-2 border-honey-300'
                : index === 0
                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
              <div>
                <div className="font-bold text-lg text-gray-800">{player.name}</div>
                <div className="text-sm text-gray-600">
                  {player.wordsFound?.length ?? 0} words this hive
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-honey-700">{player.score}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">Total score carries into the next hive</p>
    </div>
  );
}
