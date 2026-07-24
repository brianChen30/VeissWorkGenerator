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
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  onUpdateExercise(index, "name", e.target.value)
                }
                className="editable-exercise-name-input"
              />
            </div>

            <div className="exercise-metrics-grid">
              {/* SETS COLUMN */}
              <div className="metric-box">
                <label className="metric-label">Sets</label>
                <div className="input-with-unit-container">
                  <input
                    type="text"
                    list={`sets-${index}`}
                    value={item.sets}
                    onChange={(e) =>
                      onUpdateExercise(index, "sets", e.target.value)
                    }
                    className="hybrid-combobox-input spec-small"
                  />
                  <datalist id={`sets-${index}`}>
                    {["1", "2", "3", "4", "5", "6"].map((v) => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* REPS COLUMN */}
              <div className="metric-box">
                <label className="metric-label">Reps</label>
                <div className="input-with-unit-container">
                  <input
                    type="text"
                    list={`reps-${index}`}
                    value={item.reps}
                    onChange={(e) =>
                      onUpdateExercise(index, "reps", e.target.value)
                    }
                    className="hybrid-combobox-input spec-medium"
                  />
                  <datalist id={`reps-${index}`}>
                    {["5", "8", "10", "12", "15", "20"].map((v) => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* VELOCITY COLUMN (UNITS DISPLAYED OUTSIDE) */}
              <div className="metric-box">
                <label className="metric-label">Velocity</label>
                <div className="input-with-unit-container">
                  <input
                    type="text"
                    list={`vel-${index}`}
                    value={item.velocity}
                    onChange={(e) =>
                      onUpdateExercise(index, "velocity", e.target.value)
                    }
                    className="hybrid-combobox-input velocity-field"
                  />
                  <datalist id={`vel-${index}`}>
                    {["1.2", "1.1", "1.0", "0.9", "0.8"].map((v) => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                  <span className="outside-unit-label">m/s</span>
                </div>
              </div>

              {/* ESTIMATED TIME READOUT CARD */}
              <div className="metric-box">
                <label className="metric-label">Est. Time</label>
                <div className="input-with-unit-container">
                  <span className="calculated-time-text">{item.estTime}</span>
                  <span className="outside-unit-label text-gray">min</span>
                </div>
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
        </div>
      </div>
    </div>
  );
}
