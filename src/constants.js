// constants.js — app-wide enums and default project shape

export const STATUSES = [
  { id: "concept",     label: "Concept",     bg: "#e0e7ff", color: "#4338ca" },
  { id: "in_progress", label: "In Progress", bg: "#dbeafe", color: "#1d4ed8" },
  { id: "complete",    label: "Complete",    bg: "#dcfce7", color: "#15803d" },
  { id: "on_hold",     label: "On Hold",     bg: "#fef9c3", color: "#a16207" },
  { id: "abandoned",   label: "Abandoned",   bg: "#f1f5f9", color: "#64748b" },
];

export const PRIORITIES = [
  { id: "low",    label: "Low",    color: "#16a34a" },
  { id: "medium", label: "Medium", color: "#d97706" },
  { id: "high",   label: "High",   color: "#dc2626" },
];

export const FEATURE_STATUSES = [
  { id: "planned",     label: "Planned",     bg: "#dbeafe", color: "#1d4ed8" },
  { id: "in_progress", label: "In Progress", bg: "#ede9fe", color: "#6d28d9" },
  { id: "testing",     label: "Testing",     bg: "#fef9c3", color: "#a16207" },
  { id: "built",       label: "Built",       bg: "#dcfce7", color: "#15803d" },
  { id: "dropped",     label: "Dropped",     bg: "#f1f5f9", color: "#64748b" },
];

export const DEFAULT_PROJECT = {
  id: "",
  title: "",
  description: "",
  status: "concept",
  priority: "medium",
  tags: [],
  tasks: [],
  notes: "",
  features: [],
  createdAt: "",
};

export const STORAGE_KEY = "thinktank_projects_v1";
