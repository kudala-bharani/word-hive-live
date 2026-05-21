const fs = require('fs');
const path = require('path');
const https = require('https');

const enablePath = path.join(__dirname, '../lib/enable1.txt');
const configs = [
  { id: 11, letters: ['C', 'O', 'M', 'P', 'U', 'T', 'E'], centerLetter: 'O' },
  { id: 12, letters: ['W', 'I', 'N', 'T', 'E', 'R', 'S'], centerLetter: 'E' },
  { id: 13, letters: ['J', 'U', 'M', 'P', 'I', 'N', 'G'], centerLetter: 'I' },
  { id: 14, letters: ['S', 'H', 'A', 'P', 'E', 'L', 'Y'], centerLetter: 'A' },
  { id: 15, letters: ['F', 'O', 'U', 'N', 'D', 'E', 'R'], centerLetter: 'U' },
];

function downloadEnable() {
  return new Promise((resolve, reject) => {
    https.get(
      'https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt',
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }
    ).on('error', reject);
  });
}

function formatWords(words, indent = '      ') {
  const lines = [];
  for (let i = 0; i < words.length; i += 8) {
    const chunk = words.slice(i, i + 8).map((w) => `'${w}'`).join(', ');
    lines.push(`${indent}${chunk},`);
  }
  return lines.join('\n');
}

async function main() {
  if (!fs.existsSync(enablePath)) {
    fs.writeFileSync(enablePath, await downloadEnable());
  }
  const dictionary = fs
    .readFileSync(enablePath, 'utf8')
    .split('\n')
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);

  const blocks = [];
  for (const c of configs) {
    const allowed = new Set(c.letters.map((l) => l.toUpperCase()));
    const center = c.centerLetter.toLowerCase();
    const validWords = dictionary
      .filter(
        (w) =>
          w.length >= 4 &&
          w.includes(center) &&
          [...w.toUpperCase()].every((ch) => allowed.has(ch))
      )
      .sort();
    const pangrams = validWords.filter((w) =>
      c.letters.every((l) => w.includes(l.toLowerCase()))
    );
    blocks.push(`  {
    id: ${c.id},
    letters: [${c.letters.map((l) => `'${l}'`).join(', ')}],
    centerLetter: '${c.centerLetter}',
    validWords: [
${formatWords(validWords)}
    ],
    pangrams: [${pangrams.map((w) => `'${w}'`).join(', ')}]
  }`);
    console.error(`Puzzle ${c.id}: ${validWords.length} words, ${pangrams.length} pangrams`);
  }
  console.log(blocks.join(',\n'));
}

main();
