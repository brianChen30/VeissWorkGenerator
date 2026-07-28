// src/WorkoutDashboard.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import AnatomyPanel from "./components/AnatomyPanel";
import WorkoutPanel from "./components/WorkoutPanel";
import { useWorkoutData } from "./hooks/useWorkoutData";
import "./WorkoutDashboard.css";

export default function WorkoutDashboard() {
  const {
    selectedMuscles,
    workoutTime,
    setWorkoutTime,
    displayedWorkout,
    savedHistory,
    hoveredMuscle,
    setHoveredMuscle,
    isGenerating, // 👈 Destructured the new loading state from your hook
    handleMuscleToggle,
    handleForceGenerate,
    handleUpdateExercise,
    handleSaveActiveWorkout,
    handleClearHistory,
  } = useWorkoutData();

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        selectedMuscles={selectedMuscles}
        onMuscleToggle={handleMuscleToggle}
        workoutTime={workoutTime}
        onTimeChange={setWorkoutTime}
        onGenerateClick={handleForceGenerate}
        isGenerating={isGenerating} // 👈 Passed it down to the Sidebar component
      />

      <div className="dashboard-content-grid">
        <AnatomyPanel
          selectedMuscles={selectedMuscles}
          onBodyPartClick={handleMuscleToggle}
          displayedWorkout={displayedWorkout}
          hoveredMuscle={hoveredMuscle}
          onMuscleHover={setHoveredMuscle}
        />

        <WorkoutPanel
          displayedWorkout={displayedWorkout}
          onUpdateExercise={handleUpdateExercise}
          onSaveWorkout={handleSaveActiveWorkout}
          historyLogs={savedHistory}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
}
