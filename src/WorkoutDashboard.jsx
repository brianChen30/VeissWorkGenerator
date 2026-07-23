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

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("workout_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [displayedWorkout, setDisplayedWorkout] = useState(() =>
    generateSmartWorkout("Chest", 60, []),
  );

  useEffect(() => {
    localStorage.setItem("workout_history", JSON.stringify(history));
  }, [history]);

  // Unified dynamic generation engine
  const handleGenerateWorkout = (muscleTarget = selectedMuscle) => {
    const timeLimit = parseInt(workoutTime, 10) || 45;
    const dynamicPlan = generateSmartWorkout(muscleTarget, timeLimit, history);
    setDisplayedWorkout(dynamicPlan);
  };

  // ⚡ The Magic Trick: This handles clicking directly on a body element shape
  const handleBodyPartClick = (muscleName) => {
    setSelectedMuscle(muscleName); // 1. Lights up the graphic & sets dropdown choice
    handleGenerateWorkout(muscleName); // 2. Instantly generates the new plan out of the pool
  };

  const handleCompleteWorkout = () => {
    if (!displayedWorkout.exercises.length) return;
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      muscleGroup: selectedMuscle,
      exercises: displayedWorkout.exercises,
    };
    setHistory((prev) => [newRecord, ...prev]);
    alert(`💪 Workout logged!`);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        selectedMuscle={selectedMuscle}
        setSelectedMuscle={setSelectedMuscle}
        workoutTime={workoutTime}
        setWorkoutTime={setWorkoutTime}
        onGenerate={() => handleGenerateWorkout(selectedMuscle)}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 3,
          gap: "20px",
        }}
      >
        {displayedWorkout.isAdaptive && (
          <div className="ai-notification-banner">
            🤖 <strong>AI Optimization Active:</strong> Plan customized based on
            your history.
          </div>
        )}

        <div style={{ display: "flex", gap: "20px", flex: 1 }}>
          <AnatomyPanel
            selectedMuscle={selectedMuscle}
            onBodyPartClick={handleBodyPartClick} // Passing the specialized handler down
            displayedWorkout={displayedWorkout}
          />

          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <WorkoutPanel
              workoutTime={workoutTime}
              displayedWorkout={displayedWorkout}
            />
            <button
              onClick={handleCompleteWorkout}
              className="complete-workout-btn"
            >
              ✅ Complete & Log This Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
