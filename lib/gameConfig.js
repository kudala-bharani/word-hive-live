export const TOTAL_ROUNDS = 5;
export const ROUND_DURATION_MINUTES = 2;
export const ROUND_DURATION_MS = ROUND_DURATION_MINUTES * 60 * 1000;
export const TOTAL_GAME_MINUTES = TOTAL_ROUNDS * ROUND_DURATION_MINUTES;

export function getRoundLabel(round) {
  return `Hive ${round} of ${TOTAL_ROUNDS}`;
}
