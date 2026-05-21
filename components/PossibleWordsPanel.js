export default function PossibleWordsPanel({ puzzle, players }) {
  if (!puzzle?.validWords?.length) return null;

  const foundByAnyone = new Set();
  players.forEach((p) => {
    (p.wordsFound || []).forEach((w) => foundByAnyone.add(w.toLowerCase()));
  });

  const pangramSet = new Set((puzzle.pangrams || []).map((w) => w.toLowerCase()));
  const sorted = [...puzzle.validWords].sort((a, b) => a.localeCompare(b));
  const foundCount = sorted.filter((w) => foundByAnyone.has(w)).length;

  return (
    <div className="card mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-1">
        📚 All possible words ({sorted.length})
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Letters: {puzzle.letters.join(' ')} · Center:{' '}
        <span className="font-bold text-honey-600">{puzzle.centerLetter}</span>
        {' · '}
        Your group found <span className="font-semibold">{foundCount}</span> of {sorted.length}
      </p>
      <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap gap-2">
          {sorted.map((word) => {
            const found = foundByAnyone.has(word);
            const isPangram = pangramSet.has(word);
            return (
              <span
                key={word}
                className={`px-2.5 py-1 rounded-md text-sm font-medium ${
                  found
                    ? isPangram
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                      : 'bg-honey-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {word}
                {isPangram && ' ⭐'}
              </span>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Highlighted words were found by at least one player this hive
      </p>
    </div>
  );
}
