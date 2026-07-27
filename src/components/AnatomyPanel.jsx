// src/components/AnatomyPanel.jsx
import React, { useState } from "react";
import Body from "react-muscle-highlighter";
import "./AnatomyPanel.css";

export default function AnatomyPanel({
  selectedMuscles,
  onBodyPartClick,
  displayedWorkout,
}) {
  const [viewSide, setViewSide] = useState("front");

  const muscleToSlug = {
    Chest: ["chest"],
    Core: ["abs"],
    Obliques: ["obliques"],
    Shoulders: ["deltoids"],
    Biceps: ["biceps"],
    Forearms: ["forearm"],
    Hands: ["hands"],
    Quadriceps: ["quadriceps"],
    Adductors: ["adductors"],
    Tibialis: ["tibialis"],
    Knees: ["knees"],
    Ankles: ["ankles"],
    Feet: ["feet"],
    Head: ["head"],
    Neck: ["neck"],
    Trapezius: ["trapezius"],
    "Upper Back": ["upper-back"],
    Lats: ["upper-back"],
    "Lower Back": ["lower-back"],
    Triceps: ["triceps"],
    Glutes: ["gluteal"],
    Hamstrings: ["hamstring"],
    Calves: ["calves"],
    Hair: ["hair"],
  };

  const slugToMuscle = {
    abs: "Core",
    adductors: "Adductors",
    ankles: "Ankles",
    biceps: "Biceps",
    calves: "Calves",
    chest: "Chest",
    deltoids: "Shoulders",
    feet: "Feet",
    forearm: "Forearms",
    gluteal: "Glutes",
    hamstring: "Hamstrings",
    hands: "Hands",
    hair: "Hair",
    head: "Head",
    knees: "Knees",
    "lower-back": "Lower Back",
    neck: "Neck",
    obliques: "Obliques",
    quadriceps: "Quadriceps",
    tibialis: "Tibialis",
    trapezius: "Trapezius",
    triceps: "Triceps",
    "upper-back": "Upper Back",
  };

  const handleComponentClick = (part) => {
    if (!part?.slug) return;

    const coreAppName = slugToMuscle[part.slug];
    if (coreAppName) {
      onBodyPartClick(coreAppName);
    }
  };

  const highlightData = selectedMuscles.flatMap((muscle) => {
    const slugs = muscleToSlug[muscle] || [];
    return slugs.map((slug) => ({ slug, color: "#FFB800" }));
  });

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
          data={highlightData}
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
          {displayedWorkout?.primary === "None" || selectedMuscles.length === 0
            ? "None Selected"
            : displayedWorkout?.primary || selectedMuscles.join(", ")}
        </h4>
        <p className="secondary-label">Secondary Activation</p>
        <p className="muscle-secondary-text">
          {displayedWorkout?.secondary || "-"}
        </p>
      </div>
    </div>
  );
}
