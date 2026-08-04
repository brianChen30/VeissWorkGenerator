// src/utils/workoutTimeCalculator.js

function calculateWeight(exercise) {
  const sets = Number(exercise.sets) || 3;
  const reps = Number(exercise.reps) || 10;
  return sets * reps;
}

export function calculateWorkoutTime(workout, totalTime) {
  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return workout;
  }

  // Calculate workload weight for each exercise
  const totalWeight = workout.exercises.reduce((sum, ex) => {
    return sum + calculateWeight(ex);
  }, 0);

  let assigned = 0;

  workout.exercises.forEach((ex, index) => {
    const weight = calculateWeight(ex);

    if (index === workout.exercises.length - 1) {
      // The final exercise takes the remaining balance to guarantee 100% precision
      ex.estTime = totalTime - assigned;
    } else {
      // Assign time proportionally based on sets * reps
      ex.estTime = Math.round((totalTime * weight) / totalWeight);
      assigned += ex.estTime;
    }
  });

  workout.totalTime = Number(totalTime);
  workout.actualTotalTime = Number(totalTime);

  return workout;
}
