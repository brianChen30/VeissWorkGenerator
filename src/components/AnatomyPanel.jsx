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

  // This maps YOUR app's names to the library's SVG parts
  const muscleToSlug = {
    Chest: ["chest"],
    Core: ["abs", "obliques"],
    Shoulders: ["front-deltoids", "back-deltoids"],
    Biceps: ["biceps"],
    Forearms: ["forearm"],
    Quadriceps: ["quadriceps"],
    Trapezius: ["trapezius"],
    Lats: ["upper-back"],
    "Lower Back": ["lower-back"],
    Triceps: ["triceps"],
    Glutes: ["gluteal"],
    Hamstrings: ["hamstring"],
    Calves: ["calves"],
  };

  // This catches clicks on the library's SVG parts and maps them back to YOUR app.
  // Expanded to catch any weird plural/singular variations the library might throw!
  const slugToMuscle = {
    chest: "Chest",
    abs: "Core",
    obliques: "Core",

    // Catching every shoulder variation
    "front-deltoids": "Shoulders",
    "back-deltoids": "Shoulders",
    "front-deltoid": "Shoulders",
    "back-deltoid": "Shoulders",
    deltoids: "Shoulders",
    deltoid: "Shoulders",

    biceps: "Biceps",
    triceps: "Triceps",
    forearm: "Forearms",
    forearms: "Forearms",

    trapezius: "Trapezius",
    "upper-back": "Lats",
    "lower-back": "Lower Back",

    quadriceps: "Quadriceps",
    hamstring: "Hamstrings",
    hamstrings: "Hamstrings",
    calves: "Calves",
    calf: "Calves",
    gluteal: "Glutes",
    glutes: "Glutes",

    // Optional edge cases for legs
    adductor: "Quadriceps",
    abductors: "Glutes",
  };

  // NOTE: The annoying auto-spin useEffect has been completely deleted!
  // The model will now only flip when you click the Anterior/Posterior buttons.

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
          {displayedWorkout?.primary || selectedMuscles.join(", ")}
        </h4>
        <p className="secondary-label">Secondary Activation</p>
        <p className="muscle-secondary-text">
          {displayedWorkout?.secondary || "None logged"}
        </p>
      </div>
    </div>
  );
}
