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

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from("workout_history")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        setSavedHistory(
          data.map((row) => ({
            id: row.id,
            timestamp:
              new Date(row.created_at).toLocaleDateString() +
              " " +
              new Date(row.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            primary: row.primary_muscle,
            totalTime: row.total_time,
            exercisesCount: row.exercises ? row.exercises.length : 0,
            exercises: row.exercises,
          })),
        );
      }
    }
    fetchLogs();
  }, []);

  // ⚡ Mutual sync channel
  const handleMuscleChange = (targetMuscle, timeContext = workoutTime) => {
    setSelectedMuscle(targetMuscle);
    const newRoutine = generateSmartWorkout(targetMuscle, timeContext);
    setDisplayedWorkout(newRoutine);
    setWorkoutTime(newRoutine.totalTime); // Sync left column timer immediately
  };

  const handleTimeChange = (newTimeMinutes) => {
    setWorkoutTime(newTimeMinutes);
    const newRoutine = generateSmartWorkout(selectedMuscle, newTimeMinutes);
    setDisplayedWorkout(newRoutine);
  };

  // ⚡ LIVE PARAMETER REFLECTOR ENGINE
  const handleUpdateExercise = (index, field, newValue) => {
    setDisplayedWorkout((prevWorkout) => {
      if (!prevWorkout) return prevWorkout;

      const updatedExercises = [...prevWorkout.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: newValue,
      };

      // Pass sanitized string keys directly into matrix rows
      updatedExercises[index].estTime = calculateExerciseTime(
        updatedExercises[index].sets,
        updatedExercises[index].reps,
        updatedExercises[index].velocity,
      );

      const freshTotalMinutes = updatedExercises.reduce(
        (sum, item) => sum + item.estTime,
        0,
      );

      // 🔗 UNIFIED SYNC LINE: Forces the left sidebar state to match the right side calculations
      setWorkoutTime(freshTotalMinutes);

      return {
        ...prevWorkout,
        exercises: updatedExercises,
        totalTime: freshTotalMinutes,
      };
    });
  };

  const handleSaveActiveWorkout = async () => {
    if (!displayedWorkout || displayedWorkout.exercises.length === 0) return;
    const { data } = await supabase
      .from("workout_history")
      .insert([
        {
          primary_muscle: displayedWorkout.primary,
          total_time: displayedWorkout.totalTime,
          exercises: displayedWorkout.exercises,
        },
      ])
      .select();

    if (data && data[0]) {
      const newRow = data[0];
      setSavedHistory((prev) => [
        {
          id: newRow.id,
          timestamp:
            new Date(newRow.created_at).toLocaleDateString() +
            " " +
            new Date(newRow.created_at).toLocaleTimeString([], {
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
            await supabase.from("workout_history").delete().neq("id", 0);
            setSavedHistory([]);
          }}
        />
      </div>
    </div>
  );
}
