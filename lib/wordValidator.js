// Word validation logic
export function validateWord(word, centerLetter, availableLetters, validWords) {
  const upperWord = word.toUpperCase();
  const upperCenter = centerLetter.toUpperCase();
  const upperAvailable = availableLetters.map(l => l.toUpperCase());

  // Check minimum length
  if (upperWord.length < 4) {
    return { valid: false, message: 'Word must be at least 4 letters long' };
  }

  // Check if contains center letter
  if (!upperWord.includes(upperCenter)) {
    return { valid: false, message: `Must include the center letter "${centerLetter}"` };
  }

  // Check if only uses available letters
  for (let char of upperWord) {
    if (!upperAvailable.includes(char)) {
      return { valid: false, message: 'Word contains letters not in the puzzle' };
    }
  }

  // Check if word is in the valid word list
  if (!validWords.includes(upperWord.toLowerCase())) {
    return { valid: false, message: 'Word not found in dictionary' };
  }

  return { valid: true, message: 'Valid word!' };
}

export function isPangram(word, letters) {
  const upperWord = word.toUpperCase();
  const uniqueLetters = new Set(letters.map(l => l.toUpperCase()));

  for (let letter of uniqueLetters) {
    if (!upperWord.includes(letter)) {
      return false;
    }
  }

  return true;
}

export function calculateScore(word, letters) {
  const length = word.length;
  let score = 0;

  // Base score
  if (length === 4) {
    score = 1;
  } else {
    score = length;
  }

  // Pangram bonus
  if (isPangram(word, letters)) {
    score += 7;
  }

  return score;
}
