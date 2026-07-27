// src/components/Sidebar.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Sidebar.css";

const anteriorOptions = [
  "Chest",
  "Core",
  "Shoulders",
  "Biceps",
  "Forearms",
  "Quadriceps",
];
const posteriorOptions = [
  "Trapezius",
  "Lats",
  "Lower Back",
  "Triceps",
  "Glutes",
  "Hamstrings",
  "Calves",
];

export default function Sidebar({
  selectedMuscles,
  onMuscleToggle,
  workoutTime,
  onTimeChange,
  onGenerateClick,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">Create Workout</h2>
      <p className="sidebar-subtitle">
        Generate a complete workout in seconds using AI.
      </p>

      <div className="setup-step">
        <label className="step-label">
          <span className="step-number">1</span> Muscle Groups
        </label>

        {/* Custom Multi-Select Dropdown */}
        <div className="multi-select-container" ref={dropdownRef}>
          <div
            className={`modern-select ${isDropdownOpen ? "active" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedMuscles.length === 1
              ? selectedMuscles[0]
              : `${selectedMuscles.length} Groups Selected`}
          </div>

          {isDropdownOpen && (
            <div className="multi-select-menu">
              <div className="multi-select-group-title">Anterior (Front)</div>
              {anteriorOptions.map((muscle) => (
                <div
                  key={muscle}
                  className={`multi-select-item ${selectedMuscles.includes(muscle) ? "selected" : ""}`}
                  onClick={() => onMuscleToggle(muscle)}
                >
                  <div className="checkbox-ui"></div>
                  {muscle}
                </div>
              ))}

              <div className="multi-select-group-title">Posterior (Back)</div>
              {posteriorOptions.map((muscle) => (
                <div
                  key={muscle}
                  className={`multi-select-item ${selectedMuscles.includes(muscle) ? "selected" : ""}`}
                  onClick={() => onMuscleToggle(muscle)}
                >
                  <div className="checkbox-ui"></div>
                  {muscle}
                </div>
              ))}
            </div>
          )}
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

      <button className="ai-generate-btn" onClick={onGenerateClick}>
        ✨ Generate Workout
      </button>
    </div>
  );
}
