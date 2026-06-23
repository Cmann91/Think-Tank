// useProjects.js — manages project state and exposes CRUD operations

import { useState, useEffect } from "react";
import { loadProjects, saveProjects } from "../storage.js";
import { DEFAULT_PROJECT } from "../constants.js";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  function createProject() {
    const newProject = {
      ...DEFAULT_PROJECT,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  }

  function updateProject(id, changes) {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...changes } : p))
    );
  }

  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  return { projects, loading, createProject, updateProject, deleteProject };
}
