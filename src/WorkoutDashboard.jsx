// src/WorkoutDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AnatomyPanel from "./components/AnatomyPanel";
import WorkoutPanel from "./components/WorkoutPanel";
import { generateSmartWorkout } from "./utils/workoutGenerator";
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

  // ⚡ LIVE EXERCISE PARAMETER TWEAKER SWITCH ENGINE
  const handleUpdateExercise = (index, field, newValue) => {
    setDisplayedWorkout((prevWorkout) => {
      if (!prevWorkout) return prevWorkout;

      // Deep copy exercises array to avoid state mutation side effects
      const updatedExercises = [...prevWorkout.exercises];
      const targetExercise = { ...updatedExercises[index] };

      // Update the targeted property field
      targetExercise[field] = newValue;

      // Recalculate estimated execution times if sets change
      if (field === "sets") {
        const basePerSetTime = Math.round(
          updatedExercises[index].estTime / updatedExercises[index].sets,
        );
        targetExercise.estTime = Number(newValue) * (basePerSetTime || 2);
      }

      updatedExercises[index] = targetExercise;

      // Recalculate total combined routing duration dynamically
      const totalAccumulatedMinutes = updatedExercises.reduce(
        (acc, curr) => acc + curr.estTime,
        0,
      );

      return {
        ...prevWorkout,
        exercises: updatedExercises,
        totalTime: totalAccumulatedMinutes,
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
          onUpdateExercise={handleUpdateExercise} // Hook interactive function parameters
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
