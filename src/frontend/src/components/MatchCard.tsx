import React from "react";
import { Match, MatchStatus } from "../backend.d";
import {
  getStatusLabel,
  getStatusColor,
  formatMatchDate,
  getTeamInitials,
  getSportColor,
} from "../utils/helpers";
import { SportBadge } from "./SportBadge";
import { MapPin, Clock } from "lucide-react";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  onClick?: () => void;
}

const TEAM_COLORS: [string, string][] = [
  ["#1e40af", "#3b82f6"],
  ["#7c3aed", "#a78bfa"],
  ["#15803d", "#4ade80"],
  ["#b45309", "#fbbf24"],
  ["#be123c", "#f87171"],
  ["#0f766e", "#2dd4bf"],
];

function getTeamColor(teamName: string): [string, string] {
  const hash = teamName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TEAM_COLORS[hash % TEAM_COLORS.length];
}

export function MatchCard({ match, compact = false, onClick }: MatchCardProps) {
  const isLive = match.status === MatchStatus.live;
  const statusColor = getStatusColor(match.status);
  const sportColor = getSportColor(match.sport);
  const [homeLight, homeDark] = getTeamColor(match.homeTeam);
  const [awayLight, awayDark] = getTeamColor(match.awayTeam);

  return (
    <button
      type="button"
      className={`match-card card-hover rounded-xl border cursor-pointer select-none transition-all w-full text-left bg-sport-card`}
      style={{
        borderColor: isLive ? "rgba(239,68,68,0.25)" : undefined,
        boxShadow: isLive
          ? `0 0 0 1px rgba(239,68,68,0.12), inset 3px 0 0 #ef4444, 0 4px 24px rgba(0,0,0,0.35), 0 0 32px rgba(239,68,68,0.06)`
          : "0 2px 12px rgba(0,0,0,0.2)",
      }}
      onClick={onClick}
    >
      {/* Top gradient stripe for live — bolder */}
      {isLive && (
        <div
          className="h-[3px] rounded-t-xl"
          style={{ background: `linear-gradient(90deg, #ef4444 0%, ${sportColor} 60%, transparent 100%)` }}
        />
      )}

      <div className={compact ? "p-3" : "p-4"}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <SportBadge sport={match.sport} showLabel />
          <div className="flex items-center gap-2">
            {isLive ? (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-heading font-black tracking-widest px-2.5 py-1 rounded-full live-badge-pulse"
                style={{
                  color: "#ff4444",
                  backgroundColor: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  textShadow: "0 0 8px rgba(239,68,68,0.6)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse"
                />
                LIVE
              </span>
            ) : (
              <span
                className="text-xs font-heading font-bold tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  color: statusColor,
                  backgroundColor: `${statusColor}18`,
                  border: `1px solid ${statusColor}40`,
                }}
              >
                {getStatusLabel(match.status)}
              </span>
            )}
          </div>
        </div>

        {/* Teams and Scores */}
        <div className="flex items-center justify-between gap-2">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div
              className="team-circle text-white font-heading font-black"
              style={{
                width: compact ? 44 : 52,
                height: compact ? 44 : 52,
                background: `linear-gradient(135deg, ${homeDark}, ${homeLight})`,
                fontSize: compact ? 12 : 14,
                boxShadow: `0 0 12px ${homeLight}44`,
              }}
            >
              {getTeamInitials(match.homeTeam)}
            </div>
            <span className="text-xs font-medium text-sport-text text-center leading-tight truncate w-full text-center">
              {match.homeTeam}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1 px-2">
            {match.status === MatchStatus.upcoming ? (
              <div className="flex flex-col items-center">
                <span className="text-sport-muted text-lg font-score font-medium">VS</span>
                <div className="flex items-center gap-1 text-sport-muted mt-1">
                  <Clock size={10} />
                  <span className="text-xs">{formatMatchDate(match.matchDate)}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className="font-score font-medium text-sport-text"
                  style={{ fontSize: compact ? 22 : 28 }}
                >
                  {Number(match.homeScore)}
                </span>
                <span className="text-sport-muted font-score" style={{ fontSize: compact ? 14 : 18 }}>—</span>
                <span
                  className="font-score font-medium text-sport-text"
                  style={{ fontSize: compact ? 22 : 28 }}
                >
                  {Number(match.awayScore)}
                </span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div
              className="team-circle text-white font-heading font-black"
              style={{
                width: compact ? 44 : 52,
                height: compact ? 44 : 52,
                background: `linear-gradient(135deg, ${awayDark}, ${awayLight})`,
                fontSize: compact ? 12 : 14,
                boxShadow: `0 0 12px ${awayLight}44`,
              }}
            >
              {getTeamInitials(match.awayTeam)}
            </div>
            <span className="text-xs font-medium text-sport-text text-center leading-tight truncate w-full text-center">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {/* Venue */}
        {!compact && (
          <div className="flex items-center gap-1 mt-3 text-sport-muted">
            <MapPin size={10} />
            <span className="text-xs truncate">{match.venue}</span>
          </div>
        )}
      </div>
    </button>
  );
}
