// src/utils/workoutGenerator.js
import { workoutDatabase, secondaryMuscleMap } from "../workoutDatabase";

export function calculateExerciseTime(sets, reps, velocity) {
  // 🛡️ SANITATION: If fields are blank while typing, fall back to safe baselines
  const numSets = parseInt(sets, 10);
  const numReps = parseInt(reps, 10);
  const numVelocity = parseFloat(velocity);

  if (isNaN(numSets) || numSets <= 0) return 0;

  // Compute rep duration (assume average of 4 seconds per mechanical repetition)
  const finalReps = isNaN(numReps) ? 10 : numReps;
  const workSecondsPerSet = finalReps * 4;

  // Determine recovery time based entirely on speed metrics
  const finalVelocity = isNaN(numVelocity) ? 1.0 : numVelocity;
  let restSecondsPerSet = 90;

  if (finalVelocity <= 0.8) {
    restSecondsPerSet = 120; // Heavy/slow movements require longer rest windows
  } else if (finalVelocity >= 1.2) {
    restSecondsPerSet = 60; // High-speed explosive work requires less rest
  }

  const totalSeconds = numSets * (workSecondsPerSet + restSecondsPerSet);
  return Math.ceil(totalSeconds / 60);
}

export function generateSmartWorkout(muscleGroup, timeLimit) {
  const pool = workoutDatabase[muscleGroup] || [];
  const secondaryString =
    secondaryMuscleMap[muscleGroup] || "Stabilizers Mapped";

  let selectedExercises = [];
  let currentAccumulatedTime = 0;

  let defaultSets = 4;
  if (timeLimit <= 30) defaultSets = 2;
  else if (timeLimit <= 45) defaultSets = 3;

  for (const exercise of pool) {
    const vel = exercise.velocity || "1.0";
    const rep = exercise.reps || "10";
    const dynamicEstTime = calculateExerciseTime(defaultSets, rep, vel);

    if (currentAccumulatedTime + dynamicEstTime <= timeLimit) {
      selectedExercises.push({
        ...exercise,
        sets: String(defaultSets),
        reps: String(rep),
        velocity: vel,
        estTime: dynamicEstTime,
      });
      currentAccumulatedTime += dynamicEstTime;
    }
  }

  if (selectedExercises.length === 0 && pool.length > 0) {
    const firstEx = pool[0];
    const dynamicEstTime = calculateExerciseTime(
      defaultSets,
      firstEx.reps,
      firstEx.velocity,
    );
    selectedExercises = [
      {
        ...firstEx,
        sets: String(defaultSets),
        reps: String(firstEx.reps),
        velocity: firstEx.velocity,
        estTime: dynamicEstTime,
      },
    ];
    currentAccumulatedTime = dynamicEstTime;
  }

  return {
    primary: muscleGroup,
    secondary: secondaryString,
    exercises: selectedExercises,
    totalTime: currentAccumulatedTime,
  };
}
