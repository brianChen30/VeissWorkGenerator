// src/utils/workoutGenerator.js
import { workoutDatabase, secondaryMuscleMap } from "../workoutDatabase";

export function calculateExerciseTime(sets, reps, velocity) {
  const numSets = parseInt(sets, 10);
  const numReps = parseInt(reps, 10);
  const numVelocity = parseFloat(velocity);

  if (isNaN(numSets) || numSets <= 0) return 0;

  const finalReps = isNaN(numReps) ? 10 : numReps;
  const workSecondsPerSet = finalReps * 4; // 4 seconds per mechanical rep

  const finalVelocity = isNaN(numVelocity) ? 1.0 : numVelocity;
  let restSecondsPerSet = 90;

  if (finalVelocity <= 0.8) {
    restSecondsPerSet = 120; // Heavy/slow requires more rest
  } else if (finalVelocity >= 1.2) {
    restSecondsPerSet = 60; // High-speed explosive requires less rest
  }

  const totalSeconds = numSets * (workSecondsPerSet + restSecondsPerSet);
  return Math.ceil(totalSeconds / 60);
}

export function generateSmartWorkout(muscleGroup, timeLimit) {
  const pool = workoutDatabase[muscleGroup] || [];
  const secondaryString =
    secondaryMuscleMap[muscleGroup] || "Stabilizers Mapped";

  // 1. Load ALL available exercises from the pool at a baseline of 2 sets
  let selectedExercises = pool.map((exercise) => {
    const vel = exercise.velocity || "1.0";
    const rep = exercise.reps || "10";
    return {
      ...exercise,
      sets: "2",
      reps: String(rep),
      velocity: vel,
      estTime: calculateExerciseTime(2, rep, vel),
    };
  });

  // Calculate the initial baseline total time
  let currentTotal = selectedExercises.reduce((sum, ex) => sum + ex.estTime, 0);

  // 🧠 TIME OPTIMIZER LOOP: If we are under the target time, dynamically add sets
  // to exercises one by one until we get as close as possible without overshooting.
  let cycles = 0;
  let setsAdded = true;

  while (currentTotal < timeLimit && setsAdded && cycles < 10) {
    setsAdded = false;
    for (let i = 0; i < selectedExercises.length; i++) {
      const currentSets = parseInt(selectedExercises[i].sets, 10);

      // Limit exercises to a realistic maximum of 5 sets
      if (currentSets < 5) {
        const nextSets = currentSets + 1;
        const testTime = calculateExerciseTime(
          nextSets,
          selectedExercises[i].reps,
          selectedExercises[i].velocity,
        );
        const timeDifference = testTime - selectedExercises[i].estTime;

        // If adding this set keeps us under or exactly at the limit, commit it!
        if (currentTotal + timeDifference <= timeLimit) {
          selectedExercises[i].sets = String(nextSets);
          selectedExercises[i].estTime = testTime;
          currentTotal += timeDifference;
          setsAdded = true;
        }
      }
    }
    cycles++;
  }

  return {
    primary: muscleGroup,
    secondary: secondaryString,
    exercises: selectedExercises,
    totalTime: currentTotal,
  };
}
