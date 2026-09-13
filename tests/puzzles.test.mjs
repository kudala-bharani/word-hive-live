import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { approvedWords } from '../lib/approvedWords.js';
import { puzzles, getPuzzleById, getRandomPuzzleExcluding } from '../lib/puzzles.js';
import { isAllowedWord } from '../lib/wordPolicy.js';
import { validateWord, isPangram, calculateScore } from '../lib/wordValidator.js';

const rejectedWords = [
  'kink', 'kinks', 'kinky', 'kinkier', 'kinkiest', 'kinkiness',
  'dildo', 'dildos', 'dildoe', 'dildoes', 'penis', 'penises', 'vagina',
  'anal', 'anus', 'semen', 'sperm', 'porn', 'porno', 'erotic', 'orgasm',
  'boob', 'boobs', 'booby', 'boobies', 'tits', 'tittie', 'titties',
  'fuck', 'fucking', 'shit', 'shits', 'piss', 'pisses', 'cunt', 'cock',
  'dick', 'dicks', 'asshole', 'bitch', 'whore', 'slut', 'wank', 'wanking',
  'nigger', 'nigga', 'kike', 'nitchie', 'spic', 'spics', 'faggot',
  'niggard', 'niggarded', 'niggarding', 'hashish', 'smut', 'pinup',
];

test('every hive has a distinct playable layout and reviewed answers', () => {
  assert.equal(puzzles.length, 35);
  assert.equal(new Set(puzzles.map(p => p.id)).size, puzzles.length);
  assert.equal(new Set(puzzles.map(p => [...p.letters].sort().join(''))).size, puzzles.length);
  assert.deepEqual(approvedWords, [...new Set(approvedWords)].sort());
  assert(approvedWords.every(word => /^[a-z]{4,}$/.test(word)));

  for (const puzzle of puzzles) {
    assert(Number.isInteger(puzzle.id) && puzzle.id > 0);
    assert.equal(puzzle.letters.length, 7);
    assert.equal(new Set(puzzle.letters).size, 7);
    assert(puzzle.letters.every(letter => /^[A-Z]$/.test(letter)));
    assert(puzzle.letters.includes(puzzle.centerLetter));
    assert(puzzle.validWords.length >= 20, `Hive ${puzzle.id} needs more everyday words`);
    assert(puzzle.pangrams.length > 0, `Hive ${puzzle.id} needs a pangram`);
    assert.equal(new Set(puzzle.validWords).size, puzzle.validWords.length);
    for (const word of puzzle.validWords) {
      assert(isAllowedWord(word), word);
      assert(validateWord(word, puzzle.centerLetter, puzzle.letters, puzzle.validWords).valid, word);
    }
    assert.deepEqual(puzzle.pangrams, puzzle.validWords.filter(word => isPangram(word, puzzle.letters)));
    for (const word of puzzle.pangrams) assert.equal(calculateScore(word, puzzle.letters), word.length + 7);
    assert.equal(getPuzzleById(puzzle.id), puzzle);
    assert.equal(getRandomPuzzleExcluding(puzzles.filter(p => p.id !== puzzle.id).map(p => p.id)), puzzle);
  }
});

test('inappropriate words are rejected even if a stale answer list includes them', () => {
  for (const word of rejectedWords) {
    assert.equal(isAllowedWord(word), false, word);
    assert(puzzles.every(p => !p.validWords.includes(word) && !p.pangrams.includes(word)), word);
    const letters = [...new Set(word.toUpperCase())];
    for (const input of [word, word.toUpperCase()]) {
      assert.equal(validateWord(input, letters[0], letters, [word]).valid, false, word);
    }
  }
  const staleLetters = ['D', 'E', 'I', 'K', 'L', 'N', 'O'];
  for (const word of ['kink', 'dildo']) {
    assert.equal(validateWord(word, 'I', staleLetters, ['kink', 'dildo']).valid, false);
  }
});

test('ordinary words remain accepted and still obey hive rules', () => {
  const musical = getPuzzleById(20);
  for (const word of ['class', 'CLASS', 'classic', 'musical', 'calm']) {
    assert(validateWord(word, musical.centerLetter, musical.letters, musical.validWords).valid, word);
  }
  assert.equal(validateWord('calm', 'A', musical.letters, []).valid, false);
  assert.equal(validateWord('call', 'I', musical.letters, ['call']).valid, false);
  assert.equal(validateWord('kitchen', 'A', musical.letters, ['kitchen']).valid, false);
  assert.equal(validateWord('cat', 'A', musical.letters, ['cat']).valid, false);
  assert.equal(validateWord('aciculums', 'A', musical.letters, ['aciculums']).valid, false);
});

test('puzzle export uses the approved catalog without importing a raw dictionary', () => {
  const output = execFileSync(process.execPath, ['scripts/gen-puzzle-block.js'], { encoding: 'utf8' });
  assert.deepEqual(JSON.parse(output), puzzles);
});
