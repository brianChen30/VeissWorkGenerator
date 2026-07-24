// src/utils/workoutGenerator.js
import { workoutDatabase, secondaryMuscleMap } from "../workoutDatabase";

export function generateSmartWorkout(muscleGroup, timeLimit) {
  const pool = workoutDatabase[muscleGroup] || [];
  const secondaryString =
    secondaryMuscleMap[muscleGroup] || "Stabilizer Core Mesh";

  let selectedExercises = [];
  let currentAccumulatedTime = 0;

  // Add items one by one until the total estimated time reaches the limit
  for (const exercise of pool) {
    if (currentAccumulatedTime + exercise.estTime <= timeLimit) {
      selectedExercises.push(exercise);
      currentAccumulatedTime += exercise.estTime;
    }
  }

  // Fallback state logic to prevent empty application panels
  if (selectedExercises.length === 0 && pool.length > 0) {
    selectedExercises = [pool[0]];
    currentAccumulatedTime = pool[0].estTime;
  }

  return {
    primary: muscleGroup,
    secondary: secondaryString,
    exercises: selectedExercises,
    totalTime: currentAccumulatedTime,
  };
}
