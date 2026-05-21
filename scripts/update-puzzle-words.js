/**
 * Regenerate validWords for each puzzle from ENABLE dictionary.
 * Run: node scripts/update-puzzle-words.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const enablePath = path.join(ROOT, 'lib', 'enable1.txt');
const puzzlesPath = path.join(ROOT, 'lib', 'puzzles.js');

if (!fs.existsSync(enablePath)) {
  console.error(
    'Missing lib/enable1.txt. Download ENABLE from:\n' +
      'https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt'
  );
  process.exit(1);
}

const puzzles = [
  { id: 1, letters: ['G', 'R', 'I', 'N', 'D', 'E', 'A'], centerLetter: 'A' },
  { id: 2, letters: ['T', 'H', 'O', 'U', 'G', 'R', 'N'], centerLetter: 'N' },
  { id: 3, letters: ['C', 'L', 'O', 'U', 'D', 'Y', 'R'], centerLetter: 'O' },
  { id: 4, letters: ['S', 'P', 'I', 'R', 'T', 'E', 'N'], centerLetter: 'E' },
  { id: 5, letters: ['M', 'A', 'K', 'I', 'N', 'G', 'W'], centerLetter: 'A' },
  { id: 6, letters: ['F', 'L', 'O', 'W', 'E', 'R', 'S'], centerLetter: 'O' },
  { id: 7, letters: ['B', 'R', 'I', 'G', 'H', 'T', 'L'], centerLetter: 'I' },
  { id: 8, letters: ['C', 'H', 'A', 'N', 'G', 'E', 'S'], centerLetter: 'A' },
  { id: 9, letters: ['P', 'L', 'A', 'Y', 'E', 'R', 'S'], centerLetter: 'L' },
  { id: 10, letters: ['M', 'O', 'U', 'N', 'T', 'I', 'A'], centerLetter: 'A' },
];

function getValidWords(letters, centerLetter, dictionary) {
  const allowed = new Set(letters.map((l) => l.toUpperCase()));
  const center = centerLetter.toLowerCase();

  return dictionary
    .filter(
      (w) =>
        w.length >= 4 &&
        w.includes(center) &&
        [...w.toUpperCase()].every((c) => allowed.has(c))
    )
    .sort();
}

function getPangrams(validWords, letters) {
  const letterSet = letters.map((l) => l.toLowerCase());
  return validWords.filter((w) => letterSet.every((l) => w.includes(l)));
}

function formatWordList(words, indent = '      ') {
  const lines = [];
  for (let i = 0; i < words.length; i += 8) {
    const chunk = words.slice(i, i + 8).map((w) => `'${w}'`).join(', ');
    lines.push(`${indent}${chunk},`);
  }
  return lines.join('\n');
}

const dictionary = fs
  .readFileSync(enablePath, 'utf8')
  .split('\n')
  .map((w) => w.trim().toLowerCase())
  .filter(Boolean);

let source = fs.readFileSync(puzzlesPath, 'utf8');

for (const puzzle of puzzles) {
  const validWords = getValidWords(puzzle.letters, puzzle.centerLetter, dictionary);
  const pangrams = getPangrams(validWords, puzzle.letters);

  const validBlock = `validWords: [\n${formatWordList(validWords)}\n    ]`;
  const pangramBlock = `pangrams: [${pangrams.map((w) => `'${w}'`).join(', ')}]`;

  const puzzleRegex = new RegExp(
    `(\\{\\s*id:\\s*${puzzle.id},[\\s\\S]*?)validWords:\\s*\\[[\\s\\S]*?\\],\\s*pangrams:\\s*\\[[^\\]]*\\]`,
    'm'
  );

  if (!puzzleRegex.test(source)) {
    console.error(`Could not find puzzle id ${puzzle.id} in puzzles.js`);
    process.exit(1);
  }

  source = source.replace(
    puzzleRegex,
    `$1${validBlock},\n    ${pangramBlock}`
  );

  console.log(`Puzzle ${puzzle.id}: ${validWords.length} words, ${pangrams.length} pangrams`);
}

fs.writeFileSync(puzzlesPath, source);
console.log('Updated lib/puzzles.js');
