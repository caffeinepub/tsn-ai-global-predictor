import React, { useState } from "react";
import { Brain } from "lucide-react";
import { Sport } from "../backend.d";
import { useAllMatches } from "../hooks/useQueries";
import { getSportIcon, getSportLabel, getSportColor, ALL_SPORTS } from "../utils/helpers";
import { PredictionCard } from "./PredictionCard";
import { SkeletonList } from "./SkeletonCard";

export function AIPredictionTab() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const { data: matches = [], isLoading } = useAllMatches();

  const filteredMatches = selectedSport
    ? matches.filter((m) => m.sport === selectedSport)
    : matches;

  return (
    <div className="page-fade">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-sport-nav/95 backdrop-blur-sm border-b border-sport-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain size={18} className="text-primary" />
          </div>
          <div>
            <h1
              className="font-heading font-black text-sport-text leading-none"
              style={{ fontSize: "1.25rem", letterSpacing: "0.06em" }}
            >
              AI PREDICTIONS
            </h1>
            <p className="text-[10px] text-sport-muted font-heading tracking-widest mt-0.5">
              POWERED BY MACHINE LEARNING
            </p>
          </div>
        </div>
      </header>

      {/* AI Banner */}
      <div className="mx-4 mt-3 rounded-xl overflow-hidden">
        <div
          className="p-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, oklch(0.15 0.05 265), oklch(0.18 0.08 255))",
            border: "1px solid oklch(0.3 0.1 255)",
          }}
        >
          <span className="text-3xl">🤖</span>
          <div>
            <p className="font-heading font-black text-sm text-white">AI Analysis Engine</p>
            <p className="text-xs text-blue-300 mt-0.5">
              Analyzing form, H2H records & pitch conditions
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <span className="text-xs text-blue-400 font-score">{filteredMatches.length}</span>
            <span className="text-xs text-blue-500">predictions</span>
          </div>
        </div>
      </div>

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
              {getSportIcon(sport)} {getSportLabel(sport)}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions List */}
      <div className="px-4 space-y-3 pb-6">
        {isLoading ? (
          <SkeletonList count={4} />
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-sport-muted">
            <Brain size={40} className="mb-3 opacity-30" />
            <p className="font-heading font-bold">No predictions available</p>
            <p className="text-sm mt-1">Check back after matches are scheduled</p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id}>
              {/* Match label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{getSportIcon(match.sport)}</span>
                <span className="text-xs font-heading font-bold text-sport-muted uppercase tracking-wide">
                  {match.homeTeam} vs {match.awayTeam}
                </span>
              </div>
              <PredictionCard match={match} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
