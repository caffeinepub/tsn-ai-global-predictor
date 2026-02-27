import React, { useState } from "react";
import { Bell, TrendingUp, Zap, Calendar } from "lucide-react";
import { Sport, MatchStatus } from "../backend.d";
import { useAllMatches, useAllNews } from "../hooks/useQueries";
import { getSportIcon, getSportLabel, getSportColor, formatTimeAgo, truncateText, ALL_SPORTS } from "../utils/helpers";
import { MatchCard } from "./MatchCard";
import { SkeletonList } from "./SkeletonCard";
import { NotificationDrawer } from "./NotificationDrawer";

interface HomeTabProps {
  onMatchSelect?: (matchId: string) => void;
}

export function HomeTab({ onMatchSelect }: HomeTabProps) {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: matches = [], isLoading: matchesLoading } = useAllMatches();
  const { data: news = [], isLoading: newsLoading } = useAllNews();

  const liveCount = matches.filter((m) => m.status === MatchStatus.live).length;
  const todayCount = matches.length;
  const predAvail = matches.length;

  const filteredMatches = selectedSport
    ? matches.filter((m) => m.sport === selectedSport)
    : matches;

  const liveMatches = filteredMatches.filter((m) => m.status === MatchStatus.live);
  const upcomingMatches = filteredMatches.filter((m) => m.status === MatchStatus.upcoming);
  const recentNews = [...news].sort((a, b) =>
    Number(b.publishedAt - a.publishedAt),
  );

  return (
    <div className="page-fade">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-sport-nav/95 backdrop-blur-sm border-b border-sport-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/tsn-logo-transparent.dim_120x120.png"
              alt="TSN Logo"
              className="w-9 h-9 rounded-xl"
              style={{ filter: "drop-shadow(0 0 6px rgba(96,165,250,0.5))" }}
            />
            <div>
              <h1
                className="font-heading font-black leading-none gradient-text"
                style={{
                  fontSize: "1.5rem",
                  letterSpacing: "0.08em",
                  textShadow: "0 0 20px rgba(96,165,250,0.3)",
                }}
              >
                TSN SPORTS
              </h1>
              <p
                className="font-heading font-bold text-sport-muted"
                style={{ fontSize: "0.6rem", letterSpacing: "0.22em", marginTop: 1 }}
              >
                ✦ AI PRO ✦
              </p>
            </div>
          </div>
          <button
            type="button"
            className="relative p-2 rounded-xl bg-sport-surface touch-target flex items-center justify-center"
            onClick={() => setNotifOpen(true)}
            aria-label="Notifications"
          >
            <Bell size={20} className="text-sport-text" />
            {liveCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {liveCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        <StatChip icon={<Calendar size={14} />} value={todayCount} label="Matches" color="#3b82f6" />
        <StatChip
          icon={<span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />}
          value={liveCount}
          label="Live Now"
          color="#ef4444"
        />
        <StatChip icon={<Zap size={14} />} value={predAvail} label="Predictions" color="#f59e0b" />
      </div>

      {/* Sport Filter Pills */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setSelectedSport(null)}
            className={`sport-pill shrink-0 ${
              selectedSport === null
                ? "text-white"
                : "text-sport-muted"
            }`}
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
              className={`sport-pill shrink-0`}
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

      {/* Live Matches Section */}
      {(liveMatches.length > 0 || matchesLoading) && (
        <section className="px-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
            <h2 className="font-heading font-bold text-sm tracking-widest text-sport-text uppercase">
              Live Now
            </h2>
            <span className="text-xs text-red-400 font-score">({liveMatches.length})</span>
          </div>
          {matchesLoading ? (
            <SkeletonList count={2} />
          ) : (
            <div className="space-y-3">
              {liveMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClick={() => onMatchSelect?.(match.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Upcoming Matches Section */}
      <section className="px-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-primary" />
          <h2 className="font-heading font-bold text-sm tracking-widest text-sport-text uppercase">
            Upcoming
          </h2>
        </div>
        {matchesLoading ? (
          <SkeletonList count={3} />
        ) : upcomingMatches.length === 0 ? (
          <EmptyState icon="📅" message="No upcoming matches" />
        ) : (
          <div className="space-y-3">
            {upcomingMatches.slice(0, 4).map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => onMatchSelect?.(match.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* News Feed */}
      <section className="px-4 mt-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">📰</span>
          <h2 className="font-heading font-bold text-sm tracking-widest text-sport-text uppercase">
            Latest News
          </h2>
        </div>
        {newsLoading ? (
          <SkeletonList count={3} />
        ) : recentNews.length === 0 ? (
          <EmptyState icon="📰" message="No news available" />
        ) : (
          <div className="space-y-3">
            {recentNews.slice(0, 5).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="px-4 py-4 text-center text-sport-muted text-xs">
        <span>© 2026. Built with ❤️ using </span>
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

function StatChip({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-3 rounded-xl bg-sport-card border border-sport-border"
      style={{ borderColor: `${color}30` }}
    >
      <div className="flex items-center gap-1" style={{ color }}>
        {icon}
        <span className="font-score font-medium text-lg leading-none">{value}</span>
      </div>
      <span className="text-xs text-sport-muted font-heading font-semibold tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}

function NewsCard({ article }: { article: { id: string; title: string; content: string; sport: Sport; imageUrl: string; publishedAt: bigint; author: string } }) {
  const color = getSportColor(article.sport);
  return (
    <div className="rounded-xl border border-sport-border bg-sport-card overflow-hidden card-hover">
      {article.imageUrl && (
        <div className="relative h-32 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span
            className="absolute bottom-2 left-2 text-xs font-heading font-bold tracking-widest px-2 py-0.5 rounded-full uppercase"
            style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}44` }}
          >
            {getSportIcon(article.sport)} {getSportLabel(article.sport)}
          </span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-heading font-bold text-sm text-sport-text leading-snug mb-1">
          {article.title}
        </h3>
        <p className="text-xs text-sport-muted leading-relaxed">
          {truncateText(article.content, 100)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-sport-muted">{article.author}</span>
          <span className="text-xs text-sport-muted">{formatTimeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-sport-muted">
      <span className="text-3xl mb-2">{icon}</span>
      <p className="text-sm font-heading">{message}</p>
    </div>
  );
}
