// src/components/Sidebar.jsx
import React from "react";
import "./Sidebar.css";

export default function Sidebar({
  selectedMuscle,
  onMuscleChange,
  workoutTime,
  onTimeChange,
  onGenerateClick,
}) {
  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">Create Workout</h2>
      <p className="sidebar-subtitle">
        Generate a complete workout in seconds using AI.
      </p>

      <div className="setup-step">
        <label className="step-label">
          <span className="step-number">1</span> Muscle Group
        </label>
        <div className="select-wrapper">
          <select
            value={selectedMuscle}
            onChange={(e) => onMuscleChange(e.target.value)}
            className="modern-select"
          >
            <optgroup label="Anterior (Front View)">
              <option value="Chest">Chest</option>
              <option value="Core">Core / Abs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Biceps">Biceps</option>
              <option value="Forearms">Forearms</option>
              <option value="Quadriceps">Quadriceps</option>
            </optgroup>
            <optgroup label="Posterior (Back View)">
              <option value="Trapezius">Trapezius (Traps)</option>
              <option value="Lats">Lats / Back</option>
              <option value="Lower Back">Lower Back</option>
              <option value="Triceps">Triceps</option>
              <option value="Glutes">Glutes</option>
              <option value="Hamstrings">Hamstrings</option>
              <option value="Calves">Calves</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div className="setup-step">
        <label className="step-label">
          <span className="step-number">2</span> Workout Time
        </label>
        <div className="time-input-wrapper">
          <input
            type="number"
            value={workoutTime}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            className="modern-input"
            min="10"
            max="180"
          />
          <span className="input-unit-tag">min</span>
        </div>
      </div>

      {/* 🔗 Bound directly to the dedicated generator algorithm controller */}
      <button className="ai-generate-btn" onClick={onGenerateClick}>
        ✨ Generate Workout
      </button>
    </div>
  );
}
