export default function Leaderboard({ players, currentPlayerId }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 text-honey-800">🏆 Leaderboard</h3>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              player.id === currentPlayerId
                ? 'bg-honey-100 border-2 border-honey-400'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-honey-600">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
              <div>
                <div className="font-semibold text-gray-800">
                  {player.name}
                  {player.isHost && (
                    <span className="ml-2 text-xs bg-honey-500 text-white px-2 py-1 rounded">
                      HOST
                    </span>
                  )}
                  {player.id === currentPlayerId && (
                    <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {player.wordsFound.length} words
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-honey-700">
              {player.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
