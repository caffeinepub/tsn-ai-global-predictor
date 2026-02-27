import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Player } from "../backend.d";
import { getSportIcon, getSportLabel } from "../utils/helpers";

interface PlayerAnalyticsProps {
  player: Player;
}

export function PlayerAnalytics({ player }: PlayerAnalyticsProps) {
  const recentFormData = player.stats.recentForm.map((val, idx) => ({
    match: `M${idx + 1}`,
    value: Number(val),
  }));

  const initials = player.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-sport-border bg-sport-card overflow-hidden">
      {/* Player Header */}
      <div
        className="p-4"
        style={{
          background: "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 260))",
          borderBottom: "1px solid oklch(var(--sport-border))",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-heading font-black text-base"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
              boxShadow: "0 0 20px rgba(59,130,246,0.3)",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-black text-lg text-white leading-none truncate">
              {player.name}
            </h3>
            <p className="text-xs text-blue-300 mt-1">
              {player.position} · {player.team}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm">{getSportIcon(player.sport)}</span>
              <span className="text-xs text-blue-400">{getSportLabel(player.sport)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatBox
            label="Matches"
            value={Number(player.stats.matchesPlayed).toString()}
            color="#3b82f6"
          />
          <StatBox
            label="R/G/P"
            value={Number(player.stats.runsGoalsPoints).toLocaleString()}
            color="#22c55e"
          />
          <StatBox
            label="Average"
            value={player.stats.average.toFixed(1)}
            color="#f59e0b"
          />
        </div>

        {/* Recent Form Chart */}
        {recentFormData.length > 0 && (
          <div>
            <p className="text-xs font-heading font-bold text-sport-muted uppercase tracking-widest mb-3">
              Recent Form (Last {recentFormData.length} Matches)
            </p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentFormData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.03 265)" vertical={false} />
                  <XAxis
                    dataKey="match"
                    tick={{ fill: "oklch(0.55 0.04 255)", fontSize: 10, fontFamily: "'DM Mono'" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.55 0.04 255)", fontSize: 10, fontFamily: "'DM Mono'" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0.02 265)",
                      border: "1px solid oklch(0.25 0.04 265)",
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: "'DM Mono'",
                      color: "white",
                    }}
                    cursor={{ fill: "oklch(0.25 0.03 265 / 0.5)" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="oklch(0.55 0.22 255)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{
        backgroundColor: `${color}10`,
        border: `1px solid ${color}25`,
      }}
    >
      <p className="font-score font-medium text-lg leading-none" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-sport-muted font-heading font-semibold uppercase tracking-wide mt-1">
        {label}
      </p>
    </div>
  );
}
