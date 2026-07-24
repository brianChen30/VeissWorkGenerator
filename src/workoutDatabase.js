// src/workoutDatabase.js
export const workoutDatabase = {
  Chest: [
    {
      name: "Barbell Bench Press",
      sets: "4",
      reps: "8",
      velocity: "1.0",
      estTime: 9,
    },
    {
      name: "Incline Dumbbell Press",
      sets: "4",
      reps: "10",
      velocity: "1.0",
      estTime: 9,
    },
    {
      name: "Dumbbell Fly",
      sets: "4",
      reps: "12",
      velocity: "0.8",
      estTime: 12,
    },
    { name: "Push Up", sets: "4", reps: "15", velocity: "1.0", estTime: 7 },
  ],
  Core: [
    {
      name: "Hanging Knee Raises",
      sets: "3",
      reps: "15",
      velocity: "1.0",
      estTime: 8,
    },
    {
      name: "Ab Wheel Rollouts",
      sets: "3",
      reps: "10",
      velocity: "0.8",
      estTime: 9,
    },
    { name: "Plank Hold", sets: "3", reps: "12", velocity: "1.0", estTime: 6 },
  ],
  Shoulders: [
    {
      name: "Overhead Barbell Press",
      sets: "4",
      reps: "8",
      velocity: "0.9",
      estTime: 12,
    },
    {
      name: "Dumbbell Lateral Raises",
      sets: "4",
      reps: "12",
      velocity: "1.2",
      estTime: 8,
    },
    { name: "Face Pulls", sets: "3", reps: "15", velocity: "1.0", estTime: 6 },
  ],
  Biceps: [
    {
      name: "Barbell Bicep Curls",
      sets: "4",
      reps: "10",
      velocity: "1.0",
      estTime: 10,
    },
    {
      name: "Hammer Curls",
      sets: "3",
      reps: "12",
      velocity: "1.1",
      estTime: 8,
    },
  ],
  Forearms: [
    {
      name: "Behind-the-Back Wrist Curls",
      sets: "3",
      reps: "15",
      velocity: "1.0",
      estTime: 6,
    },
    {
      name: "Farmer's Walks",
      sets: "3",
      reps: "12",
      velocity: "0.8",
      estTime: 8,
    },
  ],
  Quadriceps: [
    {
      name: "Barbell Back Squats",
      sets: "4",
      reps: "8",
      velocity: "0.8",
      estTime: 15,
    },
    { name: "Leg Press", sets: 3, reps: "10", velocity: "0.9", estTime: 10 },
  ],
  Trapezius: [
    {
      name: "Barbell Shrugs",
      sets: "4",
      reps: "12",
      velocity: "0.8",
      estTime: 10,
    },
  ],
  Lats: [
    {
      name: "Wide-Grip Pull Ups",
      sets: "4",
      reps: "8",
      velocity: "1.0",
      estTime: 10,
    },
    {
      name: "Barbell Bent Over Rows",
      sets: "3",
      reps: "8",
      velocity: "1.0",
      estTime: 9,
    },
  ],
  "Lower Back": [
    {
      name: "Barbell Good Mornings",
      sets: "3",
      reps: "10",
      velocity: "0.8",
      estTime: 9,
    },
  ],
  Triceps: [
    {
      name: "Close-Grip Bench Press",
      sets: "3",
      reps: "8",
      velocity: "1.0",
      estTime: 10,
    },
    {
      name: "Cable Tricep Pushdowns",
      sets: "4",
      reps: "12",
      velocity: "1.2",
      estTime: 8,
    },
  ],
  Glutes: [
    {
      name: "Barbell Hip Thrusts",
      sets: "4",
      reps: "10",
      velocity: "0.9",
      estTime: 12,
    },
    {
      name: "Romanian Deadlifts",
      sets: "3",
      reps: "10",
      velocity: "0.8",
      estTime: 10,
    },
  ],
  Hamstrings: [
    {
      name: "Lying Leg Curls",
      sets: "4",
      reps: "10",
      velocity: "1.0",
      estTime: 8,
    },
  ],
  Calves: [
    {
      name: "Standing Calf Raises",
      sets: "4",
      reps: "15",
      velocity: "1.1",
      estTime: 8,
    },
  ],
};

export const secondaryMuscleMap = {
  Chest: "Anterior Deltoids, Triceps",
  Core: "Obliques, Transverse Abdominis",
  Shoulders: "Triceps, Upper Trapezius",
  Biceps: "Forearms, Brachialis",
  Forearms: "Brachioradialis, Grip Dynamics",
  Quadriceps: "Glutes, Hamstrings",
  Trapezius: "Rear Deltoids, Rhomboids",
  Lats: "Biceps, Rear Deltoids",
  "Lower Back": "Glutes, Hamstrings",
  Triceps: "Anterior Deltoids, Chest",
  Glutes: "Hamstrings, Erector Spinae",
  Hamstrings: "Glutes, Calves",
  Calves: "Soleus, Gastrocnemius",
};
