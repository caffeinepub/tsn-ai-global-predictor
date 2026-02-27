import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Brain } from "lucide-react";
import { Match, MatchPrediction } from "../backend.d";
import { usePredictionByMatchId, useSummaryByMatchId } from "../hooks/useQueries";
import { getTeamInitials, getConfidenceColor, getConfidenceLabel } from "../utils/helpers";

interface PredictionCardProps {
  match: Match;
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setWidth(value), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="flex-1 h-2 bg-sport-surface rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ProbabilityRow({
  label,
  value,
  color,
}: {
  label: string;
  value: bigint;
  color: string;
}) {
  const pct = Number(value);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-heading font-semibold text-sport-muted w-16 shrink-0 text-right">
        {label}
      </span>
      <AnimatedBar value={pct} color={color} />
      <span className="text-xs font-score font-medium w-10 shrink-0" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

export function PredictionCard({ match }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const { data: prediction, isLoading } = usePredictionByMatchId(match.id);
  const { data: summary, isLoading: summaryLoading } = useSummaryByMatchId(
    showSummary ? match.id : null,
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-sport-border bg-sport-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          <div className="h-2 skeleton-shimmer rounded" />
          <div className="h-2 w-5/6 skeleton-shimmer rounded" />
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="rounded-xl border border-sport-border bg-sport-card p-4 text-center text-sport-muted text-sm">
        No prediction available for this match
      </div>
    );
  }

  const confColor = getConfidenceColor(prediction.confidence);
  const confLabel = getConfidenceLabel(prediction.confidence);

  return (
    <div className="rounded-xl border border-sport-border bg-sport-card overflow-hidden">
      {/* Top accent */}
      <div className="h-0.5 bg-gradient-to-r from-primary to-accent" />

      <div className="p-4">
        {/* Match header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-sport-muted font-heading tracking-wide uppercase">AI Prediction</p>
              <p className="text-sm font-heading font-bold text-sport-text leading-none">
                {getTeamInitials(match.homeTeam)} vs {getTeamInitials(match.awayTeam)}
              </p>
            </div>
          </div>
          <span
            className="text-xs font-heading font-black tracking-widest px-3 py-1 rounded-full"
            style={{
              color: confColor,
              backgroundColor: `${confColor}18`,
              border: `1px solid ${confColor}40`,
            }}
          >
            {confLabel}
          </span>
        </div>

        {/* Probability Bars */}
        <div className="space-y-2.5 mb-4">
          <ProbabilityRow
            label={getTeamInitials(match.homeTeam)}
            value={prediction.homeWinProbability}
            color="#3b82f6"
          />
          {Number(prediction.drawProbability) > 0 && (
            <ProbabilityRow
              label="Draw"
              value={prediction.drawProbability}
              color="#f59e0b"
            />
          )}
          <ProbabilityRow
            label={getTeamInitials(match.awayTeam)}
            value={prediction.awayWinProbability}
            color="#a855f7"
          />
        </div>

        {/* Predicted Score */}
        {prediction.predictedScore && (
          <div className="px-3 py-2 rounded-lg bg-sport-surface mb-3">
            <p className="text-xs text-sport-muted font-heading uppercase tracking-wide mb-1">
              Predicted Score
            </p>
            <p className="text-sm font-score text-sport-text">{prediction.predictedScore}</p>
          </div>
        )}

        {/* Key Factors Collapsible */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full text-left py-1"
        >
          <span className="text-xs font-heading font-semibold text-primary tracking-wide uppercase">
            Key Factors
          </span>
          {expanded ? (
            <ChevronUp size={14} className="text-primary ml-auto" />
          ) : (
            <ChevronDown size={14} className="text-primary ml-auto" />
          )}
        </button>

        {expanded && (
          <div className="mt-2 text-xs text-sport-muted leading-relaxed bg-sport-surface rounded-lg p-3">
            {prediction.keyFactors}
          </div>
        )}

        {/* AI Summary Button */}
        <button
          type="button"
          onClick={() => setShowSummary(!showSummary)}
          className="mt-3 w-full py-2 rounded-lg text-xs font-heading font-bold tracking-wide uppercase transition-all"
          style={{
            background: showSummary ? "oklch(var(--sport-surface))" : "linear-gradient(135deg, oklch(0.52 0.22 260), oklch(0.6 0.22 215))",
            color: showSummary ? "oklch(var(--sport-muted))" : "white",
            border: "1px solid oklch(var(--sport-border))",
          }}
        >
          {showSummary ? "Hide Summary" : "🤖 AI Match Summary"}
        </button>

        {showSummary && (
          <div className="mt-3 rounded-lg bg-sport-surface p-3">
            {summaryLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 skeleton-shimmer rounded" />
                <div className="h-3 w-5/6 skeleton-shimmer rounded" />
                <div className="h-3 w-4/6 skeleton-shimmer rounded" />
              </div>
            ) : summary ? (
              <>
                <p className="text-xs text-sport-muted leading-relaxed mb-3">{summary.summary}</p>
                {summary.highlights.length > 0 && (
                  <>
                    <p className="text-xs font-heading font-bold text-sport-text mb-2 uppercase tracking-wide">
                      Highlights
                    </p>
                    <ul className="space-y-1">
                      {summary.highlights.map((h, idx) => (
                        <li
                          key={`highlight-${match.id}-${idx}`}
                          className="flex items-start gap-2 text-xs text-sport-muted"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p className="text-xs text-sport-muted text-center">No summary available yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
