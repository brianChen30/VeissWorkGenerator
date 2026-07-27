// src/components/AnatomyPanel.jsx
import React, { useState, useEffect } from "react";
import Body from "react-muscle-highlighter";
import "./AnatomyPanel.css";

export default function AnatomyPanel({
  selectedMuscle,
  onBodyPartClick,
  displayedWorkout,
}) {
  const [viewSide, setViewSide] = useState("front");

  const muscleToSlug = {
    Chest: "chest",
    Core: "abs",
    Shoulders: "deltoids",
    Biceps: "biceps",
    Forearms: "forearm",
    Quadriceps: "quadriceps",
    Trapezius: "trapezius",
    Lats: "upper-back",
    "Lower Back": "lower-back",
    Triceps: "triceps",
    Glutes: "gluteal",
    Hamstrings: "hamstring",
    Calves: "calves",
  };

  const slugToMuscle = {
    chest: "Chest",
    abs: "Core",
    deltoids: "Shoulders",
    biceps: "Biceps",
    forearm: "Forearms",
    quadriceps: "Quadriceps",
    trapezius: "Trapezius",
    "upper-back": "Lats",
    "lower-back": "Lower Back",
    triceps: "Triceps",
    gluteal: "Glutes",
    hamstring: "Hamstrings",
    calves: "Calves",
  };

  const posteriorMuscles = [
    "Trapezius",
    "Lats",
    "Lower Back",
    "Triceps",
    "Glutes",
    "Hamstrings",
    "Calves",
  ];

  useEffect(() => {
    if (posteriorMuscles.includes(selectedMuscle)) {
      setViewSide("back");
    } else {
      setViewSide("front");
    }
  }, [selectedMuscle]);

  const handleComponentClick = (part) => {
    if (!part?.slug) return;
    const coreAppName = slugToMuscle[part.slug];
    if (coreAppName) {
      onBodyPartClick(coreAppName);
    }
  };

  return (
    <div className="anatomy-panel">
      <div className="view-toggle-tabs">
        <button
          className={`tab-btn ${viewSide === "front" ? "active-tab" : ""}`}
          onClick={() => setViewSide("front")}
        >
          Anterior (Front)
        </button>
        <button
          className={`tab-btn ${viewSide === "back" ? "active-tab" : ""}`}
          onClick={() => setViewSide("back")}
        >
          Posterior (Back)
        </button>
      </div>

      <div className="anatomy-container">
        <Body
          data={[
            { slug: muscleToSlug[selectedMuscle] || "chest", color: "#FFB800" },
          ]}
          onBodyPartPress={handleComponentClick}
          gender="male"
          side={viewSide}
          defaultFill="#e5e7eb"
          defaultStroke="#ffffff"
          defaultStrokeWidth={1.5}
        />
      </div>

      <div className="muscle-info-card">
        <p className="primary-label">● Target Muscle Group</p>
        <h4 className="muscle-title-text">
          {displayedWorkout?.primary || selectedMuscle}
        </h4>
        <p className="secondary-label">Secondary Activation</p>
        <p className="muscle-secondary-text">
          {displayedWorkout?.secondary || "None logged"}
        </p>
      </div>
    </div>
  );
}
