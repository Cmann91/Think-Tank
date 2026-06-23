// StatusBadge.jsx — pill badge for a project or feature status

import { STATUSES } from "../constants.js";

export function StatusBadge({ statusId }) {
  const status = STATUSES.find(s => s.id === statusId);

  if (!status) return null;

  return (
    <span
      style={{
        backgroundColor: status.bg,
        color: status.color,
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {status.label}
    </span>
  );
}
