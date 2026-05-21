import { TOTAL_GAME_MINUTES, TOTAL_ROUNDS, ROUND_DURATION_MINUTES } from '../lib/gameConfig';

export default function GameRules({ compact = false }) {
  const rules = [
    'Each game has 5 word hives, 2 minutes each (10 minutes total).',
    'Scores add up across all hives; the host starts each new hive.',
    'Words must be at least 4 letters long.',
    'Every word must include the center letter (highlighted in the hive).',
    'You may use any of the 7 letters, as many times as you want.',
    '4-letter words = 1 point; longer words = their length in points.',
    'Pangrams (all 7 letters in one word) earn +7 bonus points.',
  ];

  if (compact) {
    return (
      <ul className="text-sm text-gray-600 space-y-1">
        {rules.slice(2).map((rule) => (
          <li key={rule}>• {rule}</li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">📖 How to Play</h3>
      <ul className="text-sm text-gray-700 space-y-2">
        {rules.map((rule) => (
          <li key={rule} className="flex gap-2">
            <span className="text-honey-600 shrink-0">•</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-4">
        Format: {TOTAL_ROUNDS} hives × {ROUND_DURATION_MINUTES} min ({TOTAL_GAME_MINUTES} min total)
      </p>
    </div>
  );
}
