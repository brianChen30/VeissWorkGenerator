import React from "react";
import "./Sidebar.css";

export default function Sidebar({
  selectedMuscle,
  setSelectedMuscle,
  workoutTime,
  setWorkoutTime,
  onGenerate,
}) {
  return (
    <div className="sidebar-container">
      {/* Top Heading Group */}
      <div className="header-group">
        <h2 className="section-title">Create Workout</h2>
        <p className="sub-text">
          Generate a complete workout in seconds using AI.
        </p>
      </div>

      {/* 1️⃣ Muscle Group Selection Row */}
      <div className="input-group">
        <label className="label">
          <span className="step-number">1</span> Muscle Group
        </label>
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
          className="select-input"
        >
          <option value="Chest">👕 Chest (Pectorals)</option>
          <option value="Back">📐 Back (Lats, Traps, Rhomboids)</option>
          <option value="Shoulders">🛡️ Shoulders (Deltoids)</option>
          <option value="Arms">💪 Arms (Biceps & Triceps)</option>
          <option value="Forearms">🤝 Forearms</option>
          <option value="Core">🧱 Core / Abdominals</option>
          <option value="Glutes">🍑 Glutes (Hips)</option>
          <option value="Quadriceps">🦵 Quadriceps (Front Thighs)</option>
          <option value="Hamstrings">🍗 Hamstrings (Back Thighs)</option>
          <option value="Calves">👣 Calves (Lower Legs)</option>
        </select>
      </div>

      {/* 2️⃣ Workout Time Selection Row */}
      <div className="input-group">
        <label className="label">
          <span className="step-number">2</span> Workout Time
        </label>
        <div className="time-input-wrapper">
          <span className="clock-icon">🕒</span>
          <input
            type="number"
            value={workoutTime}
            onChange={(e) => setWorkoutTime(e.target.value)}
            className="select-input time-input"
          />
          <span className="min-label">min ▾</span>
        </div>
      </div>

      {/* ✨ Action Button */}
      <button onClick={onGenerate} className="generate-btn">
        ✨ Generate Workout
      </button>

      {/* 🪄 AI Powered Info Card */}
      <div className="ai-card">
        <div className="ai-card-header">
          <span className="ai-sparkle-icon">✨</span>
          <h4 className="ai-card-title">AI Powered</h4>
        </div>
        <p className="ai-card-text">
          Our AI will create a personalized workout that targets your selected
          muscle group within the time frame you choose.
        </p>
      </div>
    </div>
  );
}
