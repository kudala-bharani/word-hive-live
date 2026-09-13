import { approvedWords } from './approvedWords.js';

const approvedWordSet = new Set(approvedWords);

// Only reviewed vocabulary is eligible, even if an old or generated list contains more words.
export function isAllowedWord(word) {
  return typeof word === 'string' && approvedWordSet.has(word.toLowerCase());
}

export function filterAllowedWords(words = []) {
  return words.filter(isAllowedWord);
}
