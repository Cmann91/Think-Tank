// TaskList.jsx — add, complete, and delete tasks; calls onChange with full updated array

import { useState } from "react";

export function TaskList({ tasks, onChange }) {
  const [input, setInput] = useState("");

  function addTask() {
    const text = input.trim();
    if (!text) return;
    onChange([...tasks, { id: crypto.randomUUID(), text, done: false }]);
    setInput("");
  }

  function toggleTask(id) {
    onChange(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id) {
    onChange(tasks.filter(t => t.id !== id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* input row */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--accent)",
            color: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* task rows */}
      {tasks.map(task => (
        <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
            style={{ cursor: "pointer", accentColor: "var(--accent)" }}
          />
          <span style={{
            flex: 1,
            fontSize: "14px",
            color: task.done ? "var(--text-muted)" : "var(--text-primary)",
            textDecoration: task.done ? "line-through" : "none",
          }}>
            {task.text}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "16px",
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
