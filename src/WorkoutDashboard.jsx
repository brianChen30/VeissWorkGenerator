import React from "react";
import Sidebar from "./components/Sidebar";
import AnatomyPanel from "./components/AnatomyPanel";
import WorkoutPanel from "./components/WorkoutPanel";
import { useWorkoutData } from "./hooks/useWorkoutData";
import "./WorkoutDashboard.css";

export default function WorkoutDashboard() {
  const {
    selectedMuscle,
    workoutTime,
    setWorkoutTime,
    displayedWorkout,
    savedHistory,
    handleMuscleChange,
    handleForceGenerate,
    handleUpdateExercise,
    handleSaveActiveWorkout,
    handleClearHistory,
  } = useWorkoutData();

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        selectedMuscle={selectedMuscle}
        onMuscleChange={handleMuscleChange}
        workoutTime={workoutTime}
        onTimeChange={setWorkoutTime}
        onGenerateClick={handleForceGenerate}
      />

      <div className="dashboard-content-grid">
        <AnatomyPanel
          selectedMuscle={selectedMuscle}
          onBodyPartClick={handleMuscleChange}
          displayedWorkout={displayedWorkout}
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
