// src/utils/exerciseImages.js

const customImages = {
  // You can manually link real images here later!
  // "Barbell Bench Press": "https://your-server.com/bench.png",
  "Barbell Bench Press": "/exercises/BarbellBenchPress.png",
  "Incline Dumbbell Press": "/exercises/InclineDumbbellPress.png",
  "Dumbbell Flyes": "/exercises/DumbbellFlyes.png",
};

export function getExerciseImage(exerciseName) {
  if (!exerciseName) {
    return "https://placehold.co/120x120/1f2937/ffffff?text=Move";
  }

  if (customImages[exerciseName]) {
    return customImages[exerciseName];
  }

  const urlSafeText = exerciseName.replace(/\s+/g, "+");
  return `https://placehold.co/120x120/1f2937/ffffff?text=${urlSafeText}&font=Montserrat`;
}
