// App.jsx — root component, manages routing between home and detail view

import { useState } from "react";
import { useProjects } from "./hooks/useProjects.js";
import { saveProjects } from "./storage.js";
import { STATUSES } from "./constants.js";
import { ProjectCard } from "./components/ProjectCard.jsx";
import { ProjectDetail } from "./components/ProjectDetail.jsx";

const LIGHT_THEME = `
  --bg: #f8f9fa;
  --card-bg: #ffffff;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-muted: #64748b;
  --input-bg: #ffffff;
  --tag-bg: #f1f5f9;
  --accent: #6366f1;
`;

const DARK_THEME = `
  --bg: #0f172a;
  --card-bg: #1e293b;
  --border: #334155;
  --text-primary: #f1f5f9;
  --text-muted: #94a3b8;
  --input-bg: #1e293b;
  --tag-bg: #334155;
  --accent: #6366f1;
`;

export default function App() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [statusFilter, setStatusFilter] = useState(null);

  function handleCreate() {
    const id = createProject();
    setActiveProjectId(id);
  }

  // compute the new array ourselves since state hasn't updated yet when we need to save
  function handleUpdate(id, changes) {
    updateProject(id, changes);
    const updated = projects.map(p => p.id === id ? { ...p, ...changes } : p);
    saveProjects(updated);
  }

  function handleDelete(id) {
    deleteProject(id);
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
  }

  const activeProject = projects.find(p => p.id === activeProjectId);

  const filteredProjects = statusFilter
    ? projects.filter(p => p.status === statusFilter)
    : projects;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
      <style>{`:root { ${theme === "light" ? LIGHT_THEME : DARK_THEME} }`}</style>

      {activeProject ? (
        // key forces a remount when switching projects so draft state is always fresh
        <ProjectDetail
          key={activeProjectId}
          project={activeProject}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onBack={() => setActiveProjectId(null)}
        />
      ) : (
        <>
          {/* navbar */}
          <nav style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "var(--card-bg)",
            borderBottom: "1px solid var(--border)",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span
              onClick={() => setActiveProjectId(null)}
              style={{ fontWeight: 700, fontSize: "18px", cursor: "pointer", color: "var(--text-primary)" }}
            >
              Think Tank
            </span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  padding: "6px 12px",
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>
              <button
                onClick={handleCreate}
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                + New Project
              </button>
            </div>
          </nav>

          <main style={{ padding: "24px" }}>
            {/* status filter buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
              <button
                onClick={() => setStatusFilter(null)}
                style={filterButtonStyle(statusFilter === null)}
              >
                All
              </button>
              {STATUSES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  style={filterButtonStyle(statusFilter === s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {loading && (
              <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "80px" }}>
                Loading...
              </p>
            )}

            {!loading && filteredProjects.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "80px", color: "var(--text-muted)" }}>
                <p style={{ fontSize: "18px", marginBottom: "12px" }}>
                  {statusFilter ? "No projects with this status." : "No projects yet."}
                </p>
                {!statusFilter && (
                  <button
                    onClick={handleCreate}
                    style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: "15px" }}
                  >
                    Create your first project →
                  </button>
                )}
              </div>
            )}

            {!loading && filteredProjects.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}>
                {filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setActiveProjectId(project.id)}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}

function filterButtonStyle(isActive) {
  return {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    backgroundColor: isActive ? "var(--accent)" : "transparent",
    color: isActive ? "#fff" : "var(--text-muted)",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: isActive ? 500 : 400,
  };
}
