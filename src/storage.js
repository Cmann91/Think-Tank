// storage.js — read and write projects to localStorage

import { STORAGE_KEY } from "./constants.js";

export async function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load projects from storage:", e);
    return [];
  }
}

export async function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
