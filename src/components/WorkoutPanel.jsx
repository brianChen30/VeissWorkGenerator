import React from "react";
import EditableDropdown from "./EditableDropdown";
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
              <div className="metric-box">
                <label className="metric-label">Sets</label>
                <EditableDropdown
                  value={item.sets}
                  options={["1", "2", "3", "4", "5", "6"]}
                  onChange={(val) => onUpdateExercise(index, "sets", val)}
                  className="spec-small"
                />
              </div>

              <div className="metric-box">
                <label className="metric-label">Reps</label>
                <EditableDropdown
                  value={item.reps}
                  options={["5", "8", "10", "12", "15", "20", "AMRAP"]}
                  onChange={(val) => onUpdateExercise(index, "reps", val)}
                  className="spec-medium"
                />
              </div>

              <div className="metric-box">
                <label className="metric-label">Velocity</label>
                <EditableDropdown
                  value={item.velocity}
                  options={["1.2", "1.1", "1.0", "0.9", "0.8"]}
                  onChange={(val) => onUpdateExercise(index, "velocity", val)}
                  className="velocity-field"
                  unit="m/s"
                />
              </div>

              <div className="metric-box">
                <label className="metric-label">Est. Time</label>
                <div className="input-unit-wrapper static-readout-padding">
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
