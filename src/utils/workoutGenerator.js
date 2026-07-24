// src/utils/workoutGenerator.js
import { workoutDatabase, secondaryMuscleMap } from "../workoutDatabase";

// ⚡ Dynamic Time Calculator based on Sets and Workload Velocity
export function calculateExerciseTime(sets, velocity) {
  let minutesPerSet = 2; // Default baseline allocation

  // Slower/Heavier loads require longer recovery periods between sets
  if (velocity === "0.8 m/s" || velocity === "Controlled") {
    minutesPerSet = 3;
  }
  // Lighter velocities or bodyweight movements require less recovery
  else if (velocity === "1.2 m/s" || velocity === "Bodyweight") {
    minutesPerSet = 1.5;
  }

  return Math.ceil(sets * minutesPerSet);
}

export function generateSmartWorkout(muscleGroup, timeLimit) {
  const pool = workoutDatabase[muscleGroup] || [];
  const secondaryString =
    secondaryMuscleMap[muscleGroup] || "Stabilizer Core Mesh";

  let selectedExercises = [];
  let currentAccumulatedTime = 0;

  // 🧠 SMART DENSITY SCALING: If the global time window shrinks,
  // reduce the default workload sets so the user can fit more exercises.
  let defaultSets = 4;
  if (timeLimit <= 30) defaultSets = 2;
  else if (timeLimit <= 45) defaultSets = 3;

  for (const exercise of pool) {
    // Determine the baseline speed profile of the exercise
    const initialVelocity = exercise.velocity || "1.0 m/s";
    const dynamicEstTime = calculateExerciseTime(defaultSets, initialVelocity);

    // Check if this exercise fits within the user's allocated time block
    if (currentAccumulatedTime + dynamicEstTime <= timeLimit) {
      selectedExercises.push({
        ...exercise,
        sets: defaultSets,
        velocity: initialVelocity,
        estTime: dynamicEstTime,
      });
      currentAccumulatedTime += dynamicEstTime;
    }
  }

  // Safety fallback line
  if (selectedExercises.length === 0 && pool.length > 0) {
    const dynamicEstTime = calculateExerciseTime(
      defaultSets,
      pool[0].velocity || "1.0 m/s",
    );
    selectedExercises = [
      { ...pool[0], sets: defaultSets, estTime: dynamicEstTime },
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
