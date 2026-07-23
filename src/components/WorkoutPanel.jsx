import React from "react";
import "./WorkoutPanel.css";

export default function WorkoutPanel({ workoutTime, displayedWorkout }) {
  return (
    <div className="workout-panel">
      <div className="workout-header">
        <h2 className="workout-title">Generated Workout</h2>
        <span className="time-badge">⏱️ {workoutTime} min</span>
      </div>

      <div className="exercise-list">
        {displayedWorkout?.exercises?.map((exercise, index) => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-index">{index + 1}</div>
            <div className="exercise-name-container">
              <h4 className="exercise-name">{exercise.name}</h4>
            </div>
            <div className="metric-box">
              <span className="metric-label">Sets</span>
              <span className="metric-val">{exercise.sets}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Reps</span>
              <span className="metric-val">{exercise.reps}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Velocity</span>
              <span className="metric-val">{exercise.velocity}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Est. Time</span>
              <span className="metric-val">{exercise.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
