import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  generateSmartWorkout,
  calculateExerciseTime,
} from "../utils/workoutGenerator";

export function useWorkoutData() {
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

      if (error) {
        console.error("Error fetching logs:", error.message);
        return;
      }

      if (data) {
        setSavedHistory(
          data.map((row) => {
            const dateObj = new Date(row.created_at);
            return {
              id: row.id,
              timestamp: `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
              primary: row.primary_muscle,
              totalTime: row.total_time,
              exercisesCount: row.exercises?.length || 0,
              exercises: row.exercises,
            };
          }),
        );
      }
    }
    fetchLogs();
  }, []);

  const handleMuscleChange = (targetMuscle) => {
    setSelectedMuscle(targetMuscle);
    setDisplayedWorkout(generateSmartWorkout(targetMuscle, workoutTime));
  };

  const handleForceGenerate = () => {
    setDisplayedWorkout(generateSmartWorkout(selectedMuscle, workoutTime));
  };

  const handleUpdateExercise = (index, field, newValue) => {
    setDisplayedWorkout((prevWorkout) => {
      if (!prevWorkout) return prevWorkout;

      const updatedExercises = [...prevWorkout.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: newValue,
      };

      updatedExercises[index].estTime = calculateExerciseTime(
        updatedExercises[index].sets,
        updatedExercises[index].reps,
        updatedExercises[index].velocity,
      );

      const freshTotalMinutes = updatedExercises.reduce(
        (sum, item) => sum + item.estTime,
        0,
      );
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
      alert("Failed to save to cloud: " + error.message);
    } else if (data?.[0]) {
      const newRow = data[0];
      const dateObj = new Date(newRow.created_at);

      setSavedHistory((prev) => [
        {
          id: newRow.id,
          timestamp: `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          primary: newRow.primary_muscle,
          totalTime: newRow.total_time,
          exercisesCount: newRow.exercises.length,
          exercises: newRow.exercises,
        },
        ...prev,
      ]);
    }
  };

  const handleClearHistory = async () => {
    if (
      window.confirm("Are you sure you want to clear all cloud history logs?")
    ) {
      await supabase.from("workout_history").delete().neq("id", 0);
      setSavedHistory([]);
    }
  };

  return {
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
  };
}
