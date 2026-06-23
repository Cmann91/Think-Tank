// ProjectDetail.jsx — full project editor with local draft state

import { useState } from "react";
import { STATUSES, PRIORITIES, FEATURE_STATUSES } from "../constants.js";
import { TaskList } from "./TaskList.jsx";

export function ProjectDetail({ project, onUpdate, onDelete, onBack }) {
  const [draft, setDraft] = useState(project);

  const isNew = !project.title;
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(project);

  // convenience wrapper so every field doesn't need the full setDraft spread
  function set(changes) {
    setDraft(prev => ({ ...prev, ...changes }));
  }

  function addTag(raw) {
    const tag = raw.trim().replace(/,+$/, "");
    if (!tag || draft.tags.includes(tag)) return;
    set({ tags: [...draft.tags, tag] });
  }

  function removeTag(tag) {
    set({ tags: draft.tags.filter(t => t !== tag) });
  }

  function addFeature() {
    set({
      features: [...draft.features, {
        id: crypto.randomUUID(),
        name: "",
        status: "planned",
        description: "",
      }],
    });
  }

  function updateFeature(id, changes) {
    set({
      features: draft.features.map(f => f.id === id ? { ...f, ...changes } : f),
    });
  }

  function deleteFeature(id) {
    set({ features: draft.features.filter(f => f.id !== id) });
  }

  function handleDelete() {
    if (!confirm("Delete this project? This can't be undone.")) return;
    onDelete(project.id);
    onBack();
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 20px" }}>

      {/* header: back button + unsaved/new badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "22px", padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        {isNew && (
          <span style={{ backgroundColor: "#ede9fe", color: "#6d28d9", padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 }}>
            New project
          </span>
        )}
        {!isNew && hasChanges && (
          <span style={{ backgroundColor: "#fef3c7", color: "#d97706", padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 }}>
            Unsaved changes
          </span>
        )}
      </div>

      {/* title */}
      <input
        type="text"
        value={draft.title}
        onChange={e => set({ title: e.target.value })}
        placeholder="Project title"
        style={{
          width: "100%",
          fontSize: "28px",
          fontWeight: 700,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          color: "var(--text-primary)",
          marginBottom: "20px",
          padding: 0,
          boxSizing: "border-box",
        }}
      />

      {/* status + priority */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <select value={draft.status} onChange={e => set({ status: e.target.value })} style={selectStyle}>
          {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={draft.priority} onChange={e => set({ priority: e.target.value })} style={selectStyle}>
          {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      {/* description */}
      <label style={labelStyle}>Description</label>
      <textarea
        value={draft.description}
        onChange={e => set({ description: e.target.value })}
        placeholder="What's this project about?"
        rows={3}
        style={{ ...textareaStyle, marginBottom: "24px" }}
      />

      {/* notes — brainstorming section, sits right after description */}
      <label style={labelStyle}>Notes</label>
      <textarea
        value={draft.notes}
        onChange={e => set({ notes: e.target.value })}
        placeholder="Brain dump — aesthetics, features, ideas, anything..."
        rows={4}
        style={{ ...textareaStyle, marginBottom: "24px" }}
      />

      {/* tags */}
      <label style={labelStyle}>Tags</label>
      {draft.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
          {draft.tags.map(tag => (
            <span key={tag} style={{
              backgroundColor: "var(--tag-bg)",
              color: "var(--text-muted)",
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              {tag}
              <button
                onClick={() => removeTag(tag)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, fontSize: "14px", lineHeight: 1 }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        placeholder="Add tag — press Enter or comma"
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(e.target.value);
            e.target.value = "";
          }
        }}
        onBlur={e => {
          addTag(e.target.value);
          e.target.value = "";
        }}
        style={{ ...inputStyle, marginBottom: "24px" }}
      />

      {/* tasks */}
      <label style={labelStyle}>Tasks</label>
      <div style={{ marginBottom: "24px" }}>
        <TaskList tasks={draft.tasks} onChange={tasks => set({ tasks })} />
      </div>

      {/* features */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Features</label>
        <button onClick={addFeature} style={ghostButtonStyle}>+ Add feature</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
        {draft.features.map(feature => {
          const fStatus = FEATURE_STATUSES.find(s => s.id === feature.status);
          return (
            <div key={feature.id} style={{
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              backgroundColor: "var(--card-bg)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  value={feature.name}
                  onChange={e => updateFeature(feature.id, { name: e.target.value })}
                  placeholder="Feature name"
                  style={{ ...inputStyle, flex: 1 }}
                />
                {fStatus && (
                  <span style={{
                    backgroundColor: fStatus.bg,
                    color: fStatus.color,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}>
                    {fStatus.label}
                  </span>
                )}
                <select
                  value={feature.status}
                  onChange={e => updateFeature(feature.id, { status: e.target.value })}
                  style={selectStyle}
                >
                  {FEATURE_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button
                  onClick={() => deleteFeature(feature.id)}
                  style={{ ...ghostButtonStyle, color: "#dc2626", borderColor: "transparent" }}
                >
                  Delete
                </button>
              </div>
              <textarea
                value={feature.description}
                onChange={e => updateFeature(feature.id, { description: e.target.value })}
                placeholder="What does this feature do?"
                rows={2}
                style={textareaStyle}
              />
            </div>
          );
        })}
      </div>

      {/* save / discard / delete */}
      <div style={{ display: "flex", gap: "10px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
        <button onClick={() => onUpdate(project.id, draft)} style={primaryButtonStyle}>Save</button>
        <button onClick={onBack} style={ghostButtonStyle}>Discard</button>
        {!isNew && (
          <button
            onClick={handleDelete}
            style={{ ...ghostButtonStyle, color: "#dc2626", marginLeft: "auto" }}
          >
            Delete project
          </button>
        )}
      </div>

    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "6px",
};

const inputStyle = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--input-bg)",
  color: "var(--text-primary)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--input-bg)",
  color: "var(--text-primary)",
  fontSize: "14px",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const selectStyle = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--input-bg)",
  color: "var(--text-primary)",
  fontSize: "14px",
  outline: "none",
  cursor: "pointer",
};

const primaryButtonStyle = {
  padding: "8px 20px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "var(--accent)",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
};

const ghostButtonStyle = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  backgroundColor: "transparent",
  color: "var(--text-primary)",
  fontSize: "14px",
  cursor: "pointer",
};
