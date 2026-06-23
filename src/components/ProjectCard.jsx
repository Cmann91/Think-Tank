// ProjectCard.jsx — card component shown in the home grid

import { useState } from "react";
import { PRIORITIES, FEATURE_STATUSES } from "../constants.js";
import { StatusBadge } from "./StatusBadge.jsx";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "just now";
  if (hours < 1) return `${minutes}m`;
  if (days < 1) return `${hours}h`;
  if (months < 1) return `${days}d`;
  if (years < 1) return `${months}mo`;
  return `${years}y`;
}

export function ProjectCard({ project, onClick, onUpdate }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const priority = PRIORITIES.find(p => p.id === project.priority);
  const tasksDone = project.tasks.filter(t => t.done).length;
  const featuresBuilt = project.features.filter(f => f.status === "built").length;
  const hasTasksOrFeatures = project.tasks.length > 0 || project.features.length > 0;

  function toggleTask(taskId) {
    const updated = project.tasks.map(t =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    onUpdate(project.id, { tasks: updated });
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "var(--card-bg)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "12px",
        padding: "16px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "border-color 0.15s",
      }}
    >
      {/* header: title + time */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", lineHeight: "1.3" }}>
          {project.title || "Untitled Project"}
        </h3>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {timeAgo(project.createdAt)}
        </span>
      </div>

      {/* priority + status badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {priority && (
          <span style={{ fontSize: "12px", fontWeight: 500, color: priority.color }}>
            {priority.label}
          </span>
        )}
        <StatusBadge statusId={project.status} />
      </div>

      {/* description */}
      {project.description && (
        <p style={{
          margin: 0,
          fontSize: "13px",
          color: "var(--text-muted)",
          lineHeight: "1.5",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {project.description}
        </p>
      )}

      {/* tags */}
      {project.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              backgroundColor: "var(--tag-bg)",
              color: "var(--text-muted)",
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "4px",
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* counts row + expand toggle */}
      {hasTasksOrFeatures && (
        <div style={{ display: "flex", alignItems: "center", marginTop: "auto", paddingTop: "4px" }}>
          <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)", flex: 1 }}>
            {project.tasks.length > 0 && (
              <span>{tasksDone}/{project.tasks.length} tasks</span>
            )}
            {project.features.length > 0 && (
              <span>{featuresBuilt}/{project.features.length} features</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: "14px",
              padding: "0 2px",
              lineHeight: 1,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▾
          </button>
        </div>
      )}

      {/* expanded panel: tasks + features */}
      {expanded && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {project.tasks.length > 0 && (
            <div>
              <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Tasks
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {project.tasks.map(task => (
                  <label
                    key={task.id}
                    style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      style={{ cursor: "pointer", accentColor: "var(--accent)", flexShrink: 0 }}
                    />
                    <span style={{
                      fontSize: "13px",
                      color: task.done ? "var(--text-muted)" : "var(--text-primary)",
                      textDecoration: task.done ? "line-through" : "none",
                    }}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {project.features.length > 0 && (
            <div>
              <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Features
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {project.features.map(feature => {
                  const fStatus = FEATURE_STATUSES.find(s => s.id === feature.status);
                  return (
                    <div key={feature.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                        {feature.name || "Unnamed feature"}
                      </span>
                      {fStatus && (
                        <span style={{
                          backgroundColor: fStatus.bg,
                          color: fStatus.color,
                          padding: "2px 6px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}>
                          {fStatus.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
