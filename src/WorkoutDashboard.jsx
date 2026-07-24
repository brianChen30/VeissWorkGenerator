// src/WorkoutDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AnatomyPanel from "./components/AnatomyPanel";
import WorkoutPanel from "./components/WorkoutPanel";
import {
  generateSmartWorkout,
  calculateExerciseTime,
} from "./utils/workoutGenerator";
import { supabase } from "./supabaseClient";
import "./WorkoutDashboard.css";

export default function WorkoutDashboard() {
  const [selectedMuscle, setSelectedMuscle] = useState("Chest");
  const [workoutTime, setWorkoutTime] = useState(60);
  const [displayedWorkout, setDisplayedWorkout] = useState(() =>
    generateSmartWorkout("Chest", 60),
  );
  const [savedHistory, setSavedHistory] = useState([]);

  // ☁️ FETCH: Load historical tracking profiles from the cloud table on startup
  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from("workout_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Error fetching logs from cloud database:",
          error.message,
        );
      } else if (data) {
        setSavedHistory(
          data.map((row) => {
            const dateObj = new Date(row.created_at);
            return {
              id: row.id,
              timestamp:
                dateObj.toLocaleDateString() +
                " " +
                dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              primary: row.primary_muscle,
              totalTime: row.total_time,
              exercisesCount: row.exercises ? row.exercises.length : 0,
              exercises: row.exercises,
            };
          }),
        );
      }
    }
    fetchLogs();
  }, []);

  // 🔄 TARGET SWITCH: Changes targeted muscle group context cleanly
  const handleMuscleChange = (targetMuscle) => {
    setSelectedMuscle(targetMuscle);
    const newRoutine = generateSmartWorkout(targetMuscle, workoutTime);
    setDisplayedWorkout(newRoutine);
    // Left sidebar state remains preserved without automated database overrides
  };

  // ⏱️ INPUT LISTENER: Updates live as you type numbers inside the sidebar box
  const handleTimeChange = (newTimeMinutes) => {
    setWorkoutTime(newTimeMinutes);
  };

  // ⚡ GENERATE ENGINE: Explicitly fires only when clicking "Generate Workout"
  const handleForceGenerate = () => {
    const freshRoutine = generateSmartWorkout(selectedMuscle, workoutTime);
    setDisplayedWorkout(freshRoutine);

    // ❌ REMOVED: setWorkoutTime(freshRoutine.totalTime);
    // This allows the sidebar to retain your exact target value (e.g., 24)
    // while the algorithm fills out the card structure as close to it as possible!
  };

  // ✍️ LIVE PARAMETER REFLECTOR ENGINE
  const handleUpdateExercise = (index, field, newValue) => {
    setDisplayedWorkout((prevWorkout) => {
      if (!prevWorkout) return prevWorkout;

      const updatedExercises = [...prevWorkout.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: newValue,
      };

      // Recalculate runtime row using updated parameter string variables
      updatedExercises[index].estTime = calculateExerciseTime(
        updatedExercises[index].sets,
        updatedExercises[index].reps,
        updatedExercises[index].velocity,
      );

      // Sum up all active card durations
      const freshTotalMinutes = updatedExercises.reduce(
        (sum, item) => sum + item.estTime,
        0,
      );

      // 🔗 DYNAMIC MATCHING LINE: Manual parameter overrides update both headers instantly
      setWorkoutTime(freshTotalMinutes);

      return {
        ...prevWorkout,
        exercises: updatedExercises,
        totalTime: freshTotalMinutes,
      };
    });
  };

  // ☁️ INSERT: Pushes active layout snapshots to your remote Supabase cloud table
  const handleSaveActiveWorkout = async () => {
    if (!displayedWorkout || displayedWorkout.exercises.length === 0) return;

    const { data, error } = await supabase
      .from("workout_history")
      .insert([
        {
          primary_muscle: displayedWorkout.primary,
          total_time: displayedWorkout.totalTime,
          exercises: displayedWorkout.exercises,
        },
      ])
      .select();

    if (error) {
      alert("Failed to save to cloud database: " + error.message);
    } else if (data && data[0]) {
      const newRow = data[0];
      const dateObj = new Date(newRow.created_at);

      setSavedHistory((prev) => [
        {
          id: newRow.id,
          timestamp:
            dateObj.toLocaleDateString() +
            " " +
            dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          primary: newRow.primary_muscle,
          totalTime: newRow.total_time,
          exercisesCount: newRow.exercises.length,
          exercises: newRow.exercises,
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        selectedMuscle={selectedMuscle}
        onMuscleChange={handleMuscleChange}
        workoutTime={workoutTime}
        onTimeChange={handleTimeChange}
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
          onClearHistory={async () => {
            if (
              window.confirm(
                "Are you sure you want to clear all cloud history logs?",
              )
            ) {
              await supabase.from("workout_history").delete().neq("id", 0);
              setSavedHistory([]);
            }
          }}
        />
      </div>
    </div>
  );
}
