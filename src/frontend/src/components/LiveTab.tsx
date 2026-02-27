import React, { useState } from "react";
import { Radio } from "lucide-react";
import { Sport, MatchStatus } from "../backend.d";
import { useAllMatches } from "../hooks/useQueries";
import { getSportIcon, getSportLabel, getSportColor, ALL_SPORTS } from "../utils/helpers";
import { MatchCard } from "./MatchCard";
import { SkeletonList } from "./SkeletonCard";

interface LiveTabProps {
  onMatchSelect?: (matchId: string) => void;
}

export function LiveTab({ onMatchSelect }: LiveTabProps) {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const { data: matches = [], isLoading } = useAllMatches();

  const liveMatches = matches.filter((m) => m.status === MatchStatus.live);
  const upcomingMatches = matches.filter((m) => m.status === MatchStatus.upcoming);
  const completedMatches = matches.filter((m) => m.status === MatchStatus.completed);

  const filterBySport = (arr: typeof matches) =>
    selectedSport ? arr.filter((m) => m.sport === selectedSport) : arr;

  const filteredLive = filterBySport(liveMatches);
  const filteredUpcoming = filterBySport(upcomingMatches);
  const filteredCompleted = filterBySport(completedMatches);

  return (
    <div className="page-fade">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-sport-nav/95 backdrop-blur-sm border-b border-sport-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Radio size={16} className="text-red-400" />
            </div>
            <div>
              <h1
                className="font-heading font-black text-sport-text leading-none"
                style={{ fontSize: "1.25rem", letterSpacing: "0.06em" }}
              >
                LIVE SCORES
              </h1>
              <p className="text-[10px] text-sport-muted font-heading tracking-widest mt-0.5">
                REAL-TIME UPDATES
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {liveMatches.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
                <span className="text-xs font-bold text-red-400 font-heading">
                  {liveMatches.length} LIVE
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sport Filter */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedSport(null)}
            className={`sport-pill shrink-0 ${selectedSport === null ? "text-white" : "text-sport-muted"}`}
            style={
              selectedSport === null
                ? { background: "linear-gradient(135deg, #2563eb, #0ea5e9)", border: "1px solid #3b82f660" }
                : { backgroundColor: "oklch(var(--sport-surface))", border: "1px solid oklch(var(--sport-border))" }
            }
          >
            🏆 All
          </button>
          {ALL_SPORTS.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => setSelectedSport(selectedSport === sport ? null : sport)}
              className="sport-pill shrink-0"
              style={
                selectedSport === sport
                  ? {
                      backgroundColor: `${getSportColor(sport)}22`,
                      border: `1px solid ${getSportColor(sport)}60`,
                      color: getSportColor(sport),
                    }
                  : {
                      backgroundColor: "oklch(var(--sport-surface))",
                      border: "1px solid oklch(var(--sport-border))",
                      color: "oklch(var(--sport-muted))",
                    }
              }
            >
              {getSportIcon(sport)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="px-4">
          <SkeletonList count={4} />
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {/* Live Matches */}
          {filteredLive.length > 0 && (
            <section>
              <SectionHeader
                icon={<span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-live-pulse" />}
                label="LIVE"
                count={filteredLive.length}
                color="#ef4444"
              />
              <div className="space-y-3">
                {filteredLive.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => onMatchSelect?.(match.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {filteredUpcoming.length > 0 && (
            <section>
              <SectionHeader
                icon={<span className="text-base">⏰</span>}
                label="UPCOMING"
                count={filteredUpcoming.length}
                color="#3b82f6"
              />
              <div className="space-y-3">
                {filteredUpcoming.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => onMatchSelect?.(match.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {filteredCompleted.length > 0 && (
            <section>
              <SectionHeader
                icon={<span className="text-base">✅</span>}
                label="COMPLETED"
                count={filteredCompleted.length}
                color="#6b7280"
              />
              <div className="space-y-3">
                {filteredCompleted.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    compact
                    onClick={() => onMatchSelect?.(match.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredLive.length === 0 && filteredUpcoming.length === 0 && filteredCompleted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-sport-muted">
              <span className="text-4xl mb-3">🏟️</span>
              <p className="font-heading font-bold text-base">No matches found</p>
              <p className="text-sm mt-1">
                {selectedSport ? `No ${getSportLabel(selectedSport)} matches available` : "No matches scheduled"}
              </p>
            </div>
          )}

          <div className="pb-4" />
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  count,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2
        className="font-heading font-black text-sm tracking-widest uppercase"
        style={{ color }}
      >
        {label}
      </h2>
      <span
        className="text-xs font-score px-2 py-0.5 rounded-full"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {count}
      </span>
    </div>
  );
}
