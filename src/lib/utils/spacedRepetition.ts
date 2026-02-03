/**
 * SuperMemo-2 (SM-2) Algorithm Implementation
 *
 * Used to calculate the next review interval based on user performance.
 */

export interface RevisionData {
  easeFactor: number; // Default: 2.5
  interval: number; // Days until next review
  repetitionCount: number;
}

/**
 * Calculates the next review schedule based on the quality of the response.
 *
 * @param quality - Performance rating (0-5)
 *  5 - Perfect response
 *  4 - Correct response after a hesitation
 *  3 - Correct response recalled with serious difficulty
 *  2 - Incorrect response; where the correct one seemed easy to recall
 *  1 - Incorrect response; the correct one remembered
 *  0 - Complete blackout
 * @param current - Current revision state
 * @returns Updated revision state
 */
export function calculateNextRevision(
  quality: number,
  current: RevisionData = { easeFactor: 2.5, interval: 0, repetitionCount: 0 }
): RevisionData {
  let { easeFactor, interval, repetitionCount } = current;

  if (quality >= 3) {
    if (repetitionCount === 0) {
      interval = 1;
    } else if (repetitionCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitionCount++;
  } else {
    repetitionCount = 0;
    interval = 1; // Reset to 1 day for failed items
  }

  // Update ease factor
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor lower bound is 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    easeFactor,
    interval,
    repetitionCount,
  };
}
