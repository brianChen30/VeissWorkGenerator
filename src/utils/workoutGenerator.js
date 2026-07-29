// src/utils/workoutGenerator.js

export function calculateExerciseTime(sets, reps, velocity) {
  const numSets = parseInt(sets, 10);
  const numReps = parseInt(reps, 10);
  const numVelocity = parseFloat(velocity);

  if (isNaN(numSets) || numSets <= 0) return 0;

  const finalReps = isNaN(numReps) ? 10 : numReps;
  const workSecondsPerSet = finalReps * 4;

  const finalVelocity = isNaN(numVelocity) ? 1.0 : numVelocity;
  let restSecondsPerSet = 90;

  if (finalVelocity <= 0.8) {
    restSecondsPerSet = 120;
  } else if (finalVelocity >= 1.2) {
    restSecondsPerSet = 60;
  }

  const totalSeconds = numSets * (workSecondsPerSet + restSecondsPerSet);
  return Math.ceil(totalSeconds / 60);
}
