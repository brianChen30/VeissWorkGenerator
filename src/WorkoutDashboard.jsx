// src/WorkoutDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AnatomyPanel from "./components/AnatomyPanel";
import WorkoutPanel from "./components/WorkoutPanel";
import {
  generateSmartWorkout,
  calculateExerciseTime,
} from "./utils/workoutGenerator"; // 🔗 Imported math function
import "./WorkoutDashboard.css";

export default function WorkoutDashboard() {
  const [selectedMuscle, setSelectedMuscle] = useState("Chest");
  const [workoutTime, setWorkoutTime] = useState(60);
  const [displayedWorkout, setDisplayedWorkout] = useState(() =>
    generateSmartWorkout("Chest", 60),
  );
  const [savedHistory, setSavedHistory] = useState([]);

  useEffect(() => {
    const localData = localStorage.getItem("veiss_workout_history");
    if (localData) setSavedHistory(JSON.parse(localData));
  }, []);

  const handleMuscleChange = (targetMuscle, timeContext = workoutTime) => {
    setSelectedMuscle(targetMuscle);
    const newRoutine = generateSmartWorkout(targetMuscle, timeContext);
    setDisplayedWorkout(newRoutine);
  };

  const handleTimeChange = (newTimeMinutes) => {
    setWorkoutTime(newTimeMinutes);
    handleMuscleChange(selectedMuscle, newTimeMinutes);
  };

  // ⚡ DYNAMIC PARAMETER RE-CALCULATOR ENGINE
  const handleUpdateExercise = (index, field, newValue) => {
    setDisplayedWorkout((prevWorkout) => {
      if (!prevWorkout) return prevWorkout;

      const updatedExercises = [...prevWorkout.exercises];
      const targetExercise = { ...updatedExercises[index] };

      // 1. Commit the raw field adjustment to state
      targetExercise[field] = newValue;

      // 2. Extract current values to process the workload scaling math
      const currentSets =
        field === "sets" ? Number(newValue) : Number(targetExercise.sets);
      const currentVelocity =
        field === "velocity" ? newValue : targetExercise.velocity;

      // 3. Recompute the specific card duration matching the load properties
      targetExercise.estTime = calculateExerciseTime(
        currentSets,
        currentVelocity,
      );
      updatedExercises[index] = targetExercise;

      // 4. Sum up all individual exercise times to find the new live workout length
      const freshTotalMinutes = updatedExercises.reduce(
        (sum, item) => sum + item.estTime,
        0,
      );

      return {
        ...prevWorkout,
        exercises: updatedExercises,
        totalTime: freshTotalMinutes,
      };
    });
  };

  const handleSaveActiveWorkout = () => {
    if (!displayedWorkout || displayedWorkout.exercises.length === 0) return;
    const snapshotToSave = {
      id: Date.now(),
      timestamp:
        new Date().toLocaleDateString() +
        " @ " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      primary: displayedWorkout.primary,
      totalTime: displayedWorkout.totalTime,
      exercisesCount: displayedWorkout.exercises.length,
      exercises: displayedWorkout.exercises,
    };
    const updatedHistory = [snapshotToSave, ...savedHistory];
    setSavedHistory(updatedHistory);
    localStorage.setItem(
      "veiss_workout_history",
      JSON.stringify(updatedHistory),
    );
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        selectedMuscle={selectedMuscle}
        onMuscleChange={(m) => handleMuscleChange(m)}
        workoutTime={workoutTime}
        onTimeChange={handleTimeChange}
      />
      <div className="dashboard-content-grid">
        <AnatomyPanel
          selectedMuscle={selectedMuscle}
          onBodyPartClick={(m) => handleMuscleChange(m)}
          displayedWorkout={displayedWorkout}
        />
        <WorkoutPanel
          displayedWorkout={displayedWorkout}
          onUpdateExercise={handleUpdateExercise}
          onSaveWorkout={handleSaveActiveWorkout}
          historyLogs={savedHistory}
          onClearHistory={() => {
            if (window.confirm("Clear logs?")) {
              setSavedHistory([]);
              localStorage.removeItem("veiss_workout_history");
            }
          }}
        />
      </div>
    </div>
  );
}
