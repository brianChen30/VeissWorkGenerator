// src/WorkoutDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AnatomyPanel from "./components/AnatomyPanel";
import WorkoutPanel from "./components/WorkoutPanel";
import { generateSmartWorkout } from "./utils/workoutGenerator";
import { supabase } from "./supabaseClient"; // 🔗 Import your new cloud client
import "./WorkoutDashboard.css";

export default function WorkoutDashboard() {
  const [selectedMuscle, setSelectedMuscle] = useState("Chest");
  const [workoutTime, setWorkoutTime] = useState(60);
  const [displayedWorkout, setDisplayedWorkout] = useState(() =>
    generateSmartWorkout("Chest", 60),
  );
  const [savedHistory, setSavedHistory] = useState([]);

  // ☁️ FETCH: Load your historical logs from Supabase on startup
  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from("workout_history")
        .select("*")
        .order("created_at", { ascending: false }); // Newest logs first

      if (error) {
        console.error("Error fetching logs from Supabase:", error.message);
      } else if (data) {
        // Map database columns back to your frontend state format
        const formattedLogs = data.map((row) => ({
          id: row.id,
          timestamp: new Date(row.created_at).toLocaleString([], {
            dateStyle: "short",
            timeStyle: "short",
          }),
          primary: row.primary_muscle,
          totalTime: row.total_time,
          exercisesCount: row.exercises ? row.exercises.length : 0,
          exercises: row.exercises,
        }));
        setSavedHistory(formattedLogs);
      }
    }

    fetchLogs();
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

  // ☁️ INSERT: Save your current parameters directly to the cloud database row
  const handleSaveActiveWorkout = async () => {
    if (!displayedWorkout || displayedWorkout.exercises.length === 0) return;

    // 1. Prepare data mapping directly matching your Supabase columns
    const dbPayload = {
      primary_muscle: displayedWorkout.primary,
      total_time: displayedWorkout.totalTime,
      exercises: displayedWorkout.exercises, // JSONB automatically handles this array!
    };

    const { data, error } = await supabase
      .from("workout_history")
      .insert([dbPayload])
      .select(); // Returns the newly inserted row containing its database ID and timestamp

    if (error) {
      alert("Failed to save to cloud database: " + error.message);
    } else if (data && data[0]) {
      // 2. Optimistically update local state so the UI updates instantly
      const newRow = data[0];
      const snapshotToRender = {
        id: newRow.id,
        timestamp: new Date(newRow.created_at).toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
          dateStyle: "short",
        }),
        primary: newRow.primary_muscle,
        totalTime: newRow.total_time,
        exercisesCount: newRow.exercises.length,
        exercises: newRow.exercises,
      };

      setSavedHistory([snapshotToRender, ...savedHistory]);
    }
  };

  // ☁️ DELETE: Clear all historical logs from the cloud table
  const handleClearHistory = async () => {
    if (
      window.confirm(
        "Are you sure you want to wipe all logs from the cloud database?",
      )
    ) {
      const { error } = await supabase
        .from("workout_history")
        .delete()
        .neq("id", 0); // Deletes all rows where ID doesn't equal 0 (everything)

      if (error) {
        alert("Deletion failed: " + error.message);
      } else {
        setSavedHistory([]);
      }
    }
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
          onUpdateExercise={(index, field, val) => {
            // Reuses the dynamic exercise updater engine we wrote previously
            setDisplayedWorkout((prev) => {
              if (!prev) return prev;
              const updated = [...prev.exercises];
              updated[index][field] = val;
              return { ...prev, exercises: updated };
            });
          }}
          onSaveWorkout={handleSaveActiveWorkout}
          historyLogs={savedHistory}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
}
