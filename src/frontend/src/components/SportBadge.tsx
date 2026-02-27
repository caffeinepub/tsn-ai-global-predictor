import React from "react";
import { Sport } from "../backend.d";
import { getSportIcon, getSportLabel, getSportColor } from "../utils/helpers";

interface SportBadgeProps {
  sport: Sport;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function SportBadge({ sport, size = "sm", showLabel = false }: SportBadgeProps) {
  const icon = getSportIcon(sport);
  const label = getSportLabel(sport);
  const color = getSportColor(sport);

  const baseClasses = size === "sm"
    ? "text-xs px-2 py-0.5 rounded-full font-heading font-semibold tracking-wide"
    : "text-sm px-3 py-1 rounded-full font-heading font-semibold tracking-wide";

  return (
    <span
      className={`inline-flex items-center gap-1 ${baseClasses}`}
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      <span>{icon}</span>
      {showLabel && <span className="uppercase">{label}</span>}
    </span>
  );
}
