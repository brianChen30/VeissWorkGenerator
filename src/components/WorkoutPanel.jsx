// src/components/WorkoutPanel.jsx
import React from "react";
import "./WorkoutPanel.css";

export default function WorkoutPanel({
  displayedWorkout,
  onUpdateExercise,
  onSaveWorkout,
  historyLogs,
  onClearHistory,
}) {
  return (
    <div className="workout-panel-container">
      <div className="panel-header-row">
        <div className="header-meta">
          <h3>Generated Workout</h3>
          <span className="time-badge">
            ⏱️ {displayedWorkout?.totalTime || 0} min total
          </span>
        </div>
        <button className="save-workout-btn" onClick={onSaveWorkout}>
          Save Workout
        </button>
      </div>

      <div className="exercise-list-stack">
        {displayedWorkout?.exercises?.map((item, index) => (
          <div key={index} className="exercise-card">
            <div className="exercise-title-area">
              <span className="exercise-index">{index + 1}</span>
              <strong className="exercise-name">{item.name}</strong>
            </div>

            {/* 🛠️ ADJUSTABLE PARAMETER GRID INTERACTIVE DROPDOWNS */}
            <div className="exercise-metrics-grid">
              {/* SETS SELECTOR */}
              <div className="metric-box">
                <label className="metric-label">Sets</label>
                <select
                  value={item.sets}
                  onChange={(e) =>
                    onUpdateExercise(index, "sets", Number(e.target.value))
                  }
                  className="card-dropdown"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* REPS SELECTOR */}
              <div className="metric-box">
                <label className="metric-label">Reps</label>
                <select
                  value={item.reps}
                  onChange={(e) =>
                    onUpdateExercise(index, "reps", e.target.value)
                  }
                  className="card-dropdown"
                >
                  {["5", "8", "10", "12", "15", "AMRAP"].map((rep) => (
                    <option key={rep} value={rep}>
                      {rep}
                    </option>
                  ))}
                </select>
              </div>

              {/* VELOCITY / LOAD ADJUSTER */}
              <div className="metric-box">
                <label className="metric-label">Velocity</label>
                <select
                  value={item.velocity}
                  onChange={(e) =>
                    onUpdateExercise(index, "velocity", e.target.value)
                  }
                  className="card-dropdown velocity-dropdown"
                >
                  <option value="Bodyweight">Bodyweight</option>
                  <option value="1.2 m/s">1.2 m/s</option>
                  <option value="1.0 m/s">1.0 m/s</option>
                  <option value="0.9 m/s">0.9 m/s</option>
                  <option value="0.8 m/s">0.8 m/s</option>
                  <option value="Controlled">Controlled</option>
                </select>
              </div>

              {/* ESTIMATED DURATION READOUT CARD */}
              <div className="metric-box dynamic-readout">
                <label className="metric-label">Est. Time</label>
                <div className="static-time-display">{item.estTime} min</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-history-section">
        <div className="analytics-header">
          <h4>📊 History Analysis Log ({historyLogs.length})</h4>
          {historyLogs.length > 0 && (
            <button className="clear-log-btn" onClick={onClearHistory}>
              Clear Logs
            </button>
          )}
        </div>
        <div className="history-timeline-scroll">
          {historyLogs.map((log) => (
            <div key={log.id} className="history-log-item">
              <div className="log-meta">
                <span className="log-date">{log.timestamp}</span>
                <span className="log-muscle-tag">{log.primary} Target</span>
              </div>
              <div className="log-summary">
                <span>⚡ {log.exercisesCount} Moves</span>
                <span>⏱️ {log.totalTime} min</span>
              </div>
            </div>
          ))}
          {historyLogs.length === 0 && (
            <div className="empty-history-placeholder">
              Save workouts above to track analytics history profiles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
