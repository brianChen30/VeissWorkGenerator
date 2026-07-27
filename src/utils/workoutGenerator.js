// src/utils/workoutGenerator.js
import { workoutDatabase, secondaryMuscleMap } from "../workoutDatabase";

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

export function generateSmartWorkout(muscleGroups, timeLimit) {
  // Ensure we are always working with an array
  const groups = Array.isArray(muscleGroups) ? muscleGroups : [muscleGroups];

  let pool = [];
  let secondarySet = new Set();

  // Combine exercises and secondary muscles for all selected groups
  groups.forEach((group) => {
    if (workoutDatabase[group]) {
      pool = [...pool, ...workoutDatabase[group]];
    }
    if (secondaryMuscleMap[group]) {
      secondaryMuscleMap[group].split(", ").forEach((m) => secondarySet.add(m));
    }
  });

  // Failsafe if nothing is selected
  if (pool.length === 0) {
    return { primary: "None", secondary: "None", exercises: [], totalTime: 0 };
  }

  const secondaryString =
    Array.from(secondarySet).join(", ") || "Stabilizers Mapped";
  const primaryString = groups.join(", ");

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

  let currentTotal = selectedExercises.reduce((sum, ex) => sum + ex.estTime, 0);
  let cycles = 0;
  let setsAdded = true;

  while (currentTotal < timeLimit && setsAdded && cycles < 10) {
    setsAdded = false;
    for (let i = 0; i < selectedExercises.length; i++) {
      const currentSets = parseInt(selectedExercises[i].sets, 10);

      if (currentSets < 5) {
        const nextSets = currentSets + 1;
        const testTime = calculateExerciseTime(
          nextSets,
          selectedExercises[i].reps,
          selectedExercises[i].velocity,
        );
        const timeDifference = testTime - selectedExercises[i].estTime;

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
    primary: primaryString,
    secondary: secondaryString,
    exercises: selectedExercises,
    totalTime: currentTotal,
  };
}
