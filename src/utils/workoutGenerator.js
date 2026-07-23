// src/utils/workoutGenerator.js
import { exercisePool, muscleInfo } from "../workoutDatabase";

export function generateSmartWorkout(
  muscleGroup,
  targetMinutes,
  userHistory = [],
) {
  const info = muscleInfo[muscleGroup] || {
    primary: "Unknown",
    secondary: "Unknown",
  };
  let pool = [...(exercisePool[muscleGroup] || [])];

  // 1. Scan history for the most recent session targeting this specific muscle group
  const muscleHistory = userHistory
    .filter((session) => session.muscleGroup === muscleGroup)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

  const lastSession = muscleHistory[0];

  // 2. APPLY AI INSIGHTS IF HISTORY EXISTS
  if (lastSession) {
    const lastExerciseNames = lastSession.exercises.map((e) => e.name);

    // Dynamic Rotation: Rotate exercises so the user doesn't hit a plateau.
    // Moves exercises they DID NOT do last time to the front of the line.
    pool.sort((a, b) => {
      const aWasDone = lastExerciseNames.includes(a.name);
      const bWasDone = lastExerciseNames.includes(b.name);
      return aWasDone - bWasDone;
    });
  }

  // 3. TIME-BUDGETING LOOP
  let generatedExercises = [];
  let currentTotalTime = 0;

  for (let i = 0; i < pool.length; i++) {
    const template = pool[i];
    const exerciseDuration = template.baseSets * template.timePerSet;

    if (currentTotalTime + exerciseDuration <= targetMinutes + 5) {
      let finalReps = template.reps;

      // Progressive Overload Logic: If they did this exact exercise last time,
      // push them by modifying reps or logging an intensity modifier notice.
      if (
        lastSession &&
        lastSession.exercises.some((e) => e.name === template.name)
      ) {
        finalReps =
          template.reps === "AMRAP"
            ? "AMRAP + 1"
            : `${template.reps} (+ 🔥 Overload)`;
      }

      generatedExercises.push({
        id: generatedExercises.length + 1,
        name: template.name,
        sets: template.baseSets,
        reps: finalReps,
        velocity: template.velocity,
        time: `${exerciseDuration} min`,
      });

      currentTotalTime += exerciseDuration;
    }

    if (currentTotalTime >= targetMinutes) break;
  }

  return {
    primary: info.primary,
    secondary: info.secondary,
    exercises: generatedExercises,
    isAdaptive: !!lastSession, // Flag to show in UI that AI optimization occurred
  };
}
