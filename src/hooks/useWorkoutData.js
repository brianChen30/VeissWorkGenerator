// src/hooks/useWorkoutData.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
// 🚨 Import your new AI generator instead!
import { generateSmartWorkoutAI } from "../utils/aiGenerator";
import { calculateExerciseTime } from "../utils/workoutGenerator";

export function useWorkoutData() {
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [workoutTime, setWorkoutTime] = useState(60);
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  // 🚨 New loading state for the AI
  const [isGenerating, setIsGenerating] = useState(false);

  const [displayedWorkout, setDisplayedWorkout] = useState({
    primary: "None Selected",
    secondary: "-",
    exercises: [],
    totalTime: 0,
  });

  const [savedHistory, setSavedHistory] = useState([]);

  // (Keep your existing fetchLogs useEffect here exactly as it was)
  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from("workout_history")
        .select("*")
        .order("created_at", { ascending: false });
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

  const handleMuscleToggle = (muscle) => {
    setSelectedMuscles((prev) => {
      let newSelection = prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle];
      if (newSelection.length === 0) {
        setDisplayedWorkout({
          primary: "None Selected",
          secondary: "-",
          exercises: [],
          totalTime: 0,
        });
      }
      return newSelection;
    });
  };

  // 🚨 Updated to use the AI!
  const handleForceGenerate = async () => {
    if (selectedMuscles.length === 0) {
      alert("Please select at least one muscle group to generate a workout.");
      return;
    }

    // Turn on the loading spinner
    setIsGenerating(true);

    try {
      // Call Groq AI
      const aiWorkout = await generateSmartWorkoutAI(
        selectedMuscles,
        workoutTime,
      );
      if (aiWorkout) {
        setDisplayedWorkout(aiWorkout);
      }
    } catch (error) {
      alert("Failed to reach AI. Please try again.");
    } finally {
      // Turn off the loading spinner
      setIsGenerating(false);
    }
  };

  const handleUpdateExercise = (index, field, newValue) => {
    setDisplayedWorkout((prevWorkout) => {
      if (!prevWorkout || prevWorkout.exercises.length === 0)
        return prevWorkout;
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
    /* unchanged */
  };
  const handleClearHistory = async () => {
    /* unchanged */
  };

  return {
    selectedMuscles,
    workoutTime,
    setWorkoutTime,
    displayedWorkout,
    savedHistory,
    hoveredMuscle,
    setHoveredMuscle,
    isGenerating, // 👈 Export the new loading state
    handleMuscleToggle,
    handleForceGenerate,
    handleUpdateExercise,
    handleSaveActiveWorkout,
    handleClearHistory,
  };
}
