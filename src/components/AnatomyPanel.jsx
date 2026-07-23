// src/components/AnatomyPanel.jsx
import React from "react";
import "./AnatomyPanel.css";

export default function AnatomyPanel({
  selectedMuscle,
  onBodyPartClick,
  displayedWorkout,
}) {
  return (
    <div className="anatomy-panel">
      <h3 className="panel-header">Muscle Focus</h3>

      <div className="anatomy-container">
        {/* Realistic Contour Anatomical SVG Wrapper */}
        <svg viewBox="0 0 240 360" className="anatomy-svg">
          {/* Head & Neck Contour */}
          <path
            d="M105,40 C105,25 135,25 135,40 C135,52 128,55 125,62 L124,72 L116,72 L115,62 C112,55 105,52 105,40 Z"
            className="anatomy-base-mesh"
          />

          {/* Traps / Upper Back Silhouette Frame */}
          <path
            d="M115,70 C100,74 88,83 82,92 L92,94 C96,88 106,83 120,83 C134,83 144,88 148,94 L158,92 C152,83 140,74 125,70 Z"
            className="anatomy-base-mesh"
          />

          {/* 🛡️ Shoulders (Deltoids) */}
          <path
            d="M80,93 C70,100 66,115 68,128 C70,135 76,134 82,125 C86,118 89,105 89,95 Z"
            className={`muscle-path ${selectedMuscle === "Shoulders" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Shoulders")}
          />
          <path
            d="M160,93 C170,100 174,115 172,128 C170,135 164,134 158,125 C154,118 151,105 151,95 Z"
            className={`muscle-path ${selectedMuscle === "Shoulders" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Shoulders")}
          />

          {/* 👕 Chest (Left & Right Pectorals matched perfectly to your image) */}
          <path
            d="M91,95 C102,96 114,99 119,105 L119,134 C108,134 94,128 85,124 C86,112 88,102 91,95 Z"
            className={`muscle-path ${selectedMuscle === "Chest" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Chest")}
          />
          <path
            d="M149,95 C138,96 126,99 121,105 L121,134 C132,134 146,128 155,124 C154,112 152,102 149,95 Z"
            className={`muscle-path ${selectedMuscle === "Chest" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Chest")}
          />

          {/* 💪 Biceps / Upper Arms */}
          <path
            d="M66,130 C62,142 60,155 61,168 C64,172 68,170 71,160 C74,150 78,138 77,128 Z"
            className={`muscle-path ${selectedMuscle === "Arms" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Arms")}
          />
          <path
            d="M174,130 C178,142 180,155 179,168 C176,172 172,170 169,160 C166,150 162,138 163,128 Z"
            className={`muscle-path ${selectedMuscle === "Arms" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Arms")}
          />

          {/* 🧱 Core / Abdominals (Realistic segmented pack structure) */}
          <path
            d="M90,138 C100,136 120,136 130,138 C132,155 132,175 128,195 C118,198 102,198 92,195 C88,175 88,155 90,138 Z"
            className={`muscle-path ${selectedMuscle === "Core" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Core")}
          />

          {/* 🦵 Quadriceps (Left & Right Thigh contours) */}
          <path
            d="M74,204 C88,202 98,206 102,215 C100,240 98,265 92,290 C84,290 76,270 72,250 C70,232 71,215 74,204 Z"
            className={`muscle-path ${selectedMuscle === "Quadriceps" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Quadriceps")}
          />
          <path
            d="M166,204 C152,202 142,206 138,215 C140,240 142,265 148,290 C156,290 164,270 168,250 C170,232 169,215 166,204 Z"
            className={`muscle-path ${selectedMuscle === "Quadriceps" ? "active-glow" : ""}`}
            onClick={() => onBodyPartClick("Quadriceps")}
          />
        </svg>

        <div className="interaction-badge">Interactive Mesh Matrix</div>
      </div>

      {/* Target Description Card Display */}
      <div className="muscle-info-card">
        <p className="primary-label">● Primary Muscle</p>
        <h4 className="muscle-title-text">{displayedWorkout?.primary}</h4>
        <p className="secondary-label">Secondary Activation</p>
        <p className="muscle-secondary-text">{displayedWorkout?.secondary}</p>
      </div>
    </div>
  );
}
