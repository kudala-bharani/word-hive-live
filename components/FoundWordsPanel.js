import { isPangram } from '../lib/wordValidator';

export default function FoundWordsPanel({ words, puzzleLetters, className = '' }) {
  return (
    <div className={`card flex flex-col h-full min-h-[280px] lg:min-h-[480px] lg:max-h-[calc(100vh-12rem)] ${className}`}>
      <h3 className="text-lg font-bold mb-3 text-gray-800 shrink-0">
        Your Words ({words.length})
      </h3>
      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
        {words.length === 0 ? (
          <div className="text-gray-500 text-sm">No words found yet. Start typing!</div>
        ) : (
          <div className="flex flex-col gap-2">
            {words.map((word, index) => {
              const wordIsPangram = puzzleLetters && isPangram(word, puzzleLetters);
              return (
                <span
                  key={`${word}-${index}`}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium w-fit ${
                    wordIsPangram
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                      : 'bg-honey-100 text-honey-800'
                  }`}
                >
                  {word}
                  {wordIsPangram && ' ⭐'}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
