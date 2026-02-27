import { Sport, MatchStatus, PredictionConfidence } from "../backend.d";

export function getSportIcon(sport: Sport): string {
  const icons: Record<Sport, string> = {
    [Sport.cricket]: "🏏",
    [Sport.football]: "⚽",
    [Sport.kabaddi]: "🤼",
    [Sport.basketball]: "🏀",
    [Sport.tennis]: "🎾",
  };
  return icons[sport] || "🏆";
}

export function getSportLabel(sport: Sport): string {
  const labels: Record<Sport, string> = {
    [Sport.cricket]: "Cricket",
    [Sport.football]: "Football",
    [Sport.kabaddi]: "Kabaddi",
    [Sport.basketball]: "Basketball",
    [Sport.tennis]: "Tennis",
  };
  return labels[sport] || sport;
}

export function getSportColor(sport: Sport): string {
  const colors: Record<Sport, string> = {
    [Sport.cricket]: "#22c55e",
    [Sport.football]: "#3b82f6",
    [Sport.kabaddi]: "#f97316",
    [Sport.basketball]: "#ef4444",
    [Sport.tennis]: "#eab308",
  };
  return colors[sport] || "#6366f1";
}

export function getStatusColor(status: MatchStatus): string {
  switch (status) {
    case MatchStatus.live: return "#ef4444";
    case MatchStatus.upcoming: return "#3b82f6";
    case MatchStatus.completed: return "#6b7280";
    default: return "#6b7280";
  }
}

export function getStatusLabel(status: MatchStatus): string {
  switch (status) {
    case MatchStatus.live: return "LIVE";
    case MatchStatus.upcoming: return "UPCOMING";
    case MatchStatus.completed: return "FT";
    default: return status;
  }
}

export function getConfidenceColor(conf: PredictionConfidence): string {
  switch (conf) {
    case PredictionConfidence.high: return "#22c55e";
    case PredictionConfidence.medium: return "#f59e0b";
    case PredictionConfidence.low: return "#ef4444";
    default: return "#6b7280";
  }
}

export function getConfidenceLabel(conf: PredictionConfidence): string {
  switch (conf) {
    case PredictionConfidence.high: return "HIGH";
    case PredictionConfidence.medium: return "MEDIUM";
    case PredictionConfidence.low: return "LOW";
    default: return conf;
  }
}

export function formatTimeAgo(timestampNs: bigint): string {
  const nowMs = Date.now();
  const thenMs = Number(timestampNs / BigInt(1_000_000));
  const diffMs = nowMs - thenMs;

  if (diffMs < 0) {
    // Future
    const futureDiffMs = -diffMs;
    const hrs = Math.floor(futureDiffMs / 3_600_000);
    const mins = Math.floor((futureDiffMs % 3_600_000) / 60_000);
    if (hrs > 0) return `In ${hrs}h ${mins}m`;
    return `In ${mins}m`;
  }

  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(thenMs).toLocaleDateString();
}

export function formatMatchDate(timestampNs: bigint): string {
  const ms = Number(timestampNs / BigInt(1_000_000));
  const date = new Date(ms);
  const now = new Date();
  const diffMs = ms - Date.now();

  if (Math.abs(diffMs) < 60_000) return "Now";

  if (diffMs > 0) {
    // Upcoming
    const hours = Math.floor(diffMs / 3_600_000);
    const mins = Math.floor((diffMs % 3_600_000) / 60_000);
    if (hours < 24) return `Today ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  // Past/Live
  if (date.toDateString() === now.toDateString()) {
    return `Today ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function getTeamInitials(teamName: string): string {
  const words = teamName.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function nowBigInt(): bigint {
  return BigInt(Date.now()) * BigInt(1_000_000);
}

export function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trimEnd() + "…";
}

export const ALL_SPORTS = [
  Sport.cricket,
  Sport.football,
  Sport.kabaddi,
  Sport.basketball,
  Sport.tennis,
] as const;
