import { approvedWords } from './approvedWords.js';

// Seven unique letters per hive; answers always come from the reviewed vocabulary.
const puzzleDefinitions = [
  { id: 1, letters: ['G', 'R', 'I', 'N', 'D', 'E', 'A'], centerLetter: 'A' },
  { id: 2, letters: ['F', 'O', 'R', 'T', 'U', 'N', 'E'], centerLetter: 'O' },
  { id: 3, letters: ['C', 'A', 'P', 'T', 'U', 'R', 'E'], centerLetter: 'A' },
  { id: 4, letters: ['S', 'P', 'I', 'R', 'T', 'E', 'N'], centerLetter: 'E' },
  { id: 5, letters: ['L', 'A', 'U', 'N', 'D', 'R', 'Y'], centerLetter: 'A' },
  { id: 6, letters: ['F', 'L', 'O', 'W', 'E', 'R', 'S'], centerLetter: 'O' },
  { id: 7, letters: ['N', 'E', 'T', 'W', 'O', 'R', 'K'], centerLetter: 'O' },
  { id: 8, letters: ['C', 'H', 'A', 'N', 'G', 'E', 'S'], centerLetter: 'A' },
  { id: 9, letters: ['P', 'L', 'A', 'Y', 'E', 'R', 'S'], centerLetter: 'L' },
  { id: 10, letters: ['M', 'O', 'U', 'N', 'T', 'I', 'A'], centerLetter: 'A' },
  { id: 11, letters: ['C', 'O', 'M', 'P', 'U', 'T', 'E'], centerLetter: 'O' },
  { id: 12, letters: ['W', 'I', 'N', 'T', 'E', 'R', 'S'], centerLetter: 'E' },
  { id: 13, letters: ['J', 'U', 'M', 'P', 'I', 'N', 'G'], centerLetter: 'I' },
  { id: 14, letters: ['S', 'H', 'A', 'P', 'E', 'L', 'Y'], centerLetter: 'A' },
  { id: 15, letters: ['F', 'O', 'U', 'N', 'D', 'E', 'R'], centerLetter: 'U' },
  { id: 16, letters: ['C', 'A', 'M', 'P', 'I', 'N', 'G'], centerLetter: 'M' },
  { id: 17, letters: ['K', 'I', 'T', 'C', 'H', 'E', 'N'], centerLetter: 'E' },
  { id: 18, letters: ['B', 'L', 'A', 'N', 'K', 'E', 'T'], centerLetter: 'L' },
  { id: 19, letters: ['D', 'O', 'L', 'P', 'H', 'I', 'N'], centerLetter: 'O' },
  { id: 20, letters: ['M', 'U', 'S', 'I', 'C', 'A', 'L'], centerLetter: 'A' },
  { id: 21, letters: ['T', 'H', 'U', 'N', 'D', 'E', 'R'], centerLetter: 'U' },
  { id: 22, letters: ['M', 'U', 'S', 'T', 'A', 'R', 'D'], centerLetter: 'T' },
  { id: 23, letters: ['C', 'O', 'U', 'R', 'A', 'G', 'E'], centerLetter: 'R' },
  { id: 24, letters: ['K', 'I', 'N', 'G', 'D', 'O', 'M'], centerLetter: 'I' },
  { id: 25, letters: ['F', 'L', 'A', 'M', 'I', 'N', 'G'], centerLetter: 'F' },
  { id: 26, letters: ['H', 'A', 'U', 'N', 'T', 'E', 'D'], centerLetter: 'H' },
  { id: 27, letters: ['P', 'I', 'C', 'T', 'U', 'R', 'E'], centerLetter: 'P' },
  { id: 28, letters: ['R', 'A', 'I', 'N', 'B', 'O', 'W'], centerLetter: 'A' },
  { id: 29, letters: ['B', 'I', 'C', 'Y', 'L', 'N', 'G'], centerLetter: 'I' },
  { id: 30, letters: ['G', 'L', 'A', 'C', 'I', 'E', 'R'], centerLetter: 'C' },
  { id: 31, letters: ['V', 'O', 'L', 'C', 'A', 'N', 'I'], centerLetter: 'V' },
  { id: 32, letters: ['C', 'O', 'K', 'W', 'A', 'R', 'E'], centerLetter: 'K' },
  { id: 33, letters: ['B', 'L', 'U', 'E', 'J', 'A', 'Y'], centerLetter: 'B' },
  { id: 34, letters: ['S', 'U', 'N', 'B', 'E', 'A', 'M'], centerLetter: 'M' },
  { id: 35, letters: ['S', 'P', 'I', 'N', 'A', 'C', 'H'], centerLetter: 'S' },
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
