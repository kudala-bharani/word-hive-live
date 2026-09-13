import { approvedWords } from './approvedWords.js';

// Seven unique letters per hive; answers always come from the reviewed vocabulary.
const puzzleDefinitions = [
  { id: 1, letters: ['G', 'R', 'I', 'N', 'D', 'E', 'A'], centerLetter: 'A' },
  { id: 2, letters: ['F', 'O', 'R', 'T', 'U', 'N', 'E'], centerLetter: 'O' },
  { id: 3, letters: ['C', 'A', 'P', 'T', 'U', 'R', 'E'], centerLetter: 'A' },
  { id: 4, letters: ['S', 'P', 'I', 'R', 'T', 'E', 'N'], centerLetter: 'E' },
  { id: 5, letters: ['S', 'T', 'A', 'P', 'L', 'E', 'R'], centerLetter: 'E' },
  { id: 6, letters: ['F', 'L', 'O', 'W', 'E', 'R', 'S'], centerLetter: 'O' },
  { id: 7, letters: ['P', 'A', 'S', 'T', 'R', 'I', 'E'], centerLetter: 'I' },
  { id: 8, letters: ['C', 'H', 'A', 'N', 'G', 'E', 'S'], centerLetter: 'A' },
  { id: 9, letters: ['P', 'L', 'A', 'Y', 'E', 'R', 'S'], centerLetter: 'L' },
  { id: 10, letters: ['S', 'P', 'A', 'R', 'K', 'L', 'E'], centerLetter: 'L' },
  { id: 11, letters: ['T', 'R', 'A', 'I', 'L', 'E', 'S'], centerLetter: 'S' },
  { id: 12, letters: ['W', 'I', 'N', 'T', 'E', 'R', 'S'], centerLetter: 'E' },
  { id: 13, letters: ['P', 'A', 'S', 'T', 'U', 'R', 'E'], centerLetter: 'T' },
  { id: 14, letters: ['S', 'H', 'A', 'P', 'E', 'L', 'Y'], centerLetter: 'A' },
  { id: 15, letters: ['S', 'M', 'A', 'R', 'T', 'E', 'N'], centerLetter: 'N' },
  { id: 16, letters: ['P', 'L', 'A', 'N', 'E', 'T', 'S'], centerLetter: 'P' },
  { id: 17, letters: ['L', 'E', 'A', 'T', 'H', 'R', 'S'], centerLetter: 'A' },
  { id: 18, letters: ['B', 'L', 'A', 'N', 'K', 'E', 'T'], centerLetter: 'L' },
  { id: 19, letters: ['P', 'A', 'I', 'N', 'T', 'E', 'R'], centerLetter: 'R' },
  { id: 20, letters: ['M', 'U', 'S', 'I', 'C', 'A', 'L'], centerLetter: 'A' },
  { id: 21, letters: ['T', 'H', 'U', 'N', 'D', 'E', 'R'], centerLetter: 'U' },
  { id: 22, letters: ['S', 'E', 'R', 'V', 'A', 'N', 'T'], centerLetter: 'T' },
  { id: 23, letters: ['T', 'E', 'A', 'C', 'H', 'R', 'S'], centerLetter: 'A' },
  { id: 24, letters: ['P', 'O', 'I', 'N', 'T', 'E', 'R'], centerLetter: 'E' },
  { id: 25, letters: ['G', 'R', 'A', 'N', 'I', 'T', 'E'], centerLetter: 'N' },
  { id: 26, letters: ['C', 'E', 'R', 'T', 'A', 'I', 'N'], centerLetter: 'R' },
  { id: 27, letters: ['G', 'A', 'R', 'D', 'E', 'N', 'S'], centerLetter: 'G' },
  { id: 28, letters: ['T', 'R', 'A', 'I', 'N', 'E', 'D'], centerLetter: 'A' },
  { id: 29, letters: ['A', 'R', 'T', 'I', 'C', 'L', 'E'], centerLetter: 'E' },
  { id: 30, letters: ['C', 'E', 'N', 'T', 'R', 'A', 'L'], centerLetter: 'A' },
  { id: 31, letters: ['M', 'A', 'R', 'K', 'E', 'T', 'S'], centerLetter: 'S' },
  { id: 32, letters: ['C', 'O', 'U', 'N', 'T', 'E', 'R'], centerLetter: 'T' },
  { id: 33, letters: ['P', 'A', 'N', 'T', 'H', 'E', 'R'], centerLetter: 'E' },
  { id: 34, letters: ['S', 'U', 'N', 'B', 'E', 'A', 'M'], centerLetter: 'M' },
  { id: 35, letters: ['H', 'A', 'M', 'P', 'E', 'R', 'S'], centerLetter: 'E' },
];

export const puzzles = puzzleDefinitions.map((definition) => {
  const letters = new Set(definition.letters.map(letter => letter.toLowerCase()));
  const center = definition.centerLetter.toLowerCase();
  const validWords = approvedWords.filter(word =>
    word.length >= 4 && word.includes(center) && [...word].every(letter => letters.has(letter))
  );
  const pangrams = validWords.filter(word => [...letters].every(letter => word.includes(letter)));
  return { ...definition, validWords, pangrams };
});

export function getRandomPuzzle() {
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

export function getRandomPuzzleExcluding(excludeIds = []) {
  const excluded = new Set(excludeIds.filter(Boolean));
  const pool = puzzles.filter((p) => !excluded.has(p.id));
  const source = pool.length > 0 ? pool : puzzles;
  return source[Math.floor(Math.random() * source.length)];
}

export function getPuzzleById(id) {
  return puzzles.find(p => p.id === id);
}
