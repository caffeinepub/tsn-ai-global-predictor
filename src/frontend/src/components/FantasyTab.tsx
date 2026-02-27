import React, { useState } from "react";
import { Crown, Star, Users } from "lucide-react";
import { useAllMatches, useFantasyByMatchId } from "../hooks/useQueries";
import { getSportIcon, getSportLabel } from "../utils/helpers";
import { SkeletonList } from "./SkeletonCard";

export function FantasyTab() {
  const { data: matches = [], isLoading: matchesLoading } = useAllMatches();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) ?? matches[0] ?? null;
  const effectiveMatchId = selectedMatch?.id ?? null;

  const { data: fantasy, isLoading: fantasyLoading } = useFantasyByMatchId(effectiveMatchId);

  const isLoading = matchesLoading || fantasyLoading;

  return (
    <div className="page-fade">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-sport-nav/95 backdrop-blur-sm border-b border-sport-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Crown size={18} className="text-yellow-400" />
          </div>
          <div>
            <h1
              className="font-heading font-black text-sport-text leading-none"
              style={{ fontSize: "1.25rem", letterSpacing: "0.06em" }}
            >
              FANTASY BUILDER
            </h1>
            <p className="text-[10px] text-sport-muted font-heading tracking-widest mt-0.5">
              AI TEAM SUGGESTIONS
            </p>
          </div>
        </div>
      </header>

      {/* Match Selector */}
      <div className="px-4 py-3">
        <p className="text-xs font-heading font-bold text-sport-muted uppercase tracking-widest mb-2">
          Select Match
        </p>
        {matchesLoading ? (
          <div className="h-12 skeleton-shimmer rounded-xl" />
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {matches.map((match) => (
              <button
                key={match.id}
                type="button"
                onClick={() => setSelectedMatchId(match.id)}
                className="shrink-0 px-3 py-2 rounded-xl border text-xs font-heading font-semibold transition-all"
                style={
                  (selectedMatchId === match.id || (!selectedMatchId && match.id === matches[0]?.id))
                    ? {
                        background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                        border: "1px solid #3b82f660",
                        color: "white",
                      }
                    : {
                        backgroundColor: "oklch(var(--sport-card))",
                        border: "1px solid oklch(var(--sport-border))",
                        color: "oklch(var(--sport-muted))",
                      }
                }
              >
                <span className="mr-1">{getSportIcon(match.sport)}</span>
                {match.homeTeam} vs {match.awayTeam}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fantasy Suggestion */}
      <div className="px-4 pb-6">
        {isLoading ? (
          <SkeletonList count={3} />
        ) : !selectedMatch ? (
          <div className="flex flex-col items-center justify-center py-16 text-sport-muted">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="font-heading font-bold">No matches available</p>
            <p className="text-sm mt-1">Matches will appear here once created</p>
          </div>
        ) : !fantasy ? (
          <div className="flex flex-col items-center justify-center py-16 text-sport-muted">
            <Crown size={40} className="mb-3 opacity-30 text-yellow-500" />
            <p className="font-heading font-bold">No fantasy suggestion yet</p>
            <p className="text-sm mt-1">
              AI hasn&apos;t generated a team for {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
            </p>
          </div>
        ) : (
          <>
            {/* Team Header */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                background: "linear-gradient(135deg, oklch(0.15 0.06 265), oklch(0.18 0.08 255))",
                border: "1px solid oklch(0.25 0.06 265)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 font-heading uppercase tracking-widest">
                    {getSportIcon(selectedMatch.sport)} {getSportLabel(selectedMatch.sport)} Fantasy XI
                  </p>
                  <h2 className="font-heading font-black text-base text-white mt-0.5">
                    {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-400 font-heading uppercase">Total Credits</p>
                  <p className="font-score font-medium text-xl text-yellow-400">
                    {Number(fantasy.totalCredits)}
                  </p>
                </div>
              </div>
            </div>

            {/* Captain & Vice-Captain */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <CaptainCard
                name={fantasy.captainName}
                label="Captain"
                icon={<Crown size={16} className="text-yellow-400" />}
                color="#eab308"
                borderColor="#eab308"
              />
              <CaptainCard
                name={fantasy.viceCaptainName}
                label="Vice Captain"
                icon={<Star size={16} className="text-gray-300" />}
                color="#9ca3af"
                borderColor="#6b7280"
              />
            </div>

            {/* Player Grid */}
            <div className="mb-4">
              <p className="text-xs font-heading font-bold text-sport-muted uppercase tracking-widest mb-3">
                Suggested XI
              </p>
              <div className="grid grid-cols-2 gap-2">
                {fantasy.suggestedPlayers.map(([playerId, playerName]) => {
                  const isCaptain = playerId === fantasy.captainId;
                  const isViceCaptain = playerId === fantasy.viceCaptainId;
                  return (
                    <PlayerChip
                      key={playerId}
                      name={playerName}
                      isCaptain={isCaptain}
                      isViceCaptain={isViceCaptain}
                    />
                  );
                })}
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="rounded-xl border border-sport-border bg-sport-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <p className="text-xs font-heading font-bold text-sport-text uppercase tracking-wide">
                  AI Reasoning
                </p>
              </div>
              <p className="text-xs text-sport-muted leading-relaxed">{fantasy.reasoning}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CaptainCard({
  name,
  label,
  icon,
  color,
  borderColor,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-xl p-3 flex flex-col items-center gap-2"
      style={{
        backgroundColor: `${borderColor}12`,
        border: `1px solid ${borderColor}40`,
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-heading font-black text-white"
        style={{ background: `linear-gradient(135deg, ${borderColor}80, ${color})` }}
      >
        {initials}
      </div>
      <div className="text-center">
        <p className="text-xs font-heading font-bold text-sport-text leading-snug">{name}</p>
        <div className="flex items-center justify-center gap-1 mt-0.5" style={{ color }}>
          {icon}
          <span className="text-xs font-heading font-semibold">{label}</span>
        </div>
      </div>
    </div>
  );
}

function PlayerChip({
  name,
  isCaptain,
  isViceCaptain,
}: {
  name: string;
  isCaptain: boolean;
  isViceCaptain: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2 p-2.5 rounded-lg border"
      style={{
        backgroundColor: isCaptain
          ? "oklch(0.15 0.08 55 / 0.3)"
          : isViceCaptain
            ? "oklch(0.2 0.02 0 / 0.3)"
            : "oklch(var(--sport-surface))",
        borderColor: isCaptain
          ? "#eab30840"
          : isViceCaptain
            ? "#6b728040"
            : "oklch(var(--sport-border))",
      }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-black text-white shrink-0"
        style={{
          background: isCaptain
            ? "linear-gradient(135deg, #b45309, #eab308)"
            : isViceCaptain
              ? "linear-gradient(135deg, #374151, #9ca3af)"
              : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
        }}
      >
        {name.substring(0, 1).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-heading font-semibold text-sport-text truncate leading-none">
          {name}
        </p>
        {(isCaptain || isViceCaptain) && (
          <p
            className="text-xs font-heading font-bold mt-0.5"
            style={{ color: isCaptain ? "#eab308" : "#9ca3af" }}
          >
            {isCaptain ? "C" : "VC"}
          </p>
        )}
      </div>
    </div>
  );
}
