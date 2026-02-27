import React, { useEffect, useState } from "react";
import { Bell, MessageCircle, BookOpen, Trophy, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import { useActor } from "../hooks/useActor";
import type { MotivationalQuote } from "../backend.d";

const DEFAULT_QUOTES: MotivationalQuote[] = [
  {
    id: "q1",
    quoteText: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "motivation",
  },
  {
    id: "q2",
    quoteText: "Education is the passport to the future.",
    author: "Malcolm X",
    category: "study",
  },
  {
    id: "q3",
    quoteText: "Champions keep playing until they get it right.",
    author: "Billie Jean King",
    category: "sports",
  },
  {
    id: "q4",
    quoteText: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
    category: "success",
  },
  {
    id: "q5",
    quoteText: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation",
  },
];

const STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: "189.45", change: "+2.3%", positive: true },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "141.22", change: "-0.8%", positive: false },
  { symbol: "TSLA", name: "Tesla Inc.", price: "248.90", change: "+5.1%", positive: true },
  { symbol: "MSFT", name: "Microsoft", price: "378.65", change: "+1.2%", positive: true },
];

const SPORTS_SNAPSHOTS = [
  { sport: "🏏", label: "Cricket", match: "IND vs AUS", status: "Live", score: "280/6" },
  { sport: "⚽", label: "Football", match: "MAN CITY vs PSG", status: "HT", score: "1 - 0" },
  { sport: "🏀", label: "NBA", match: "LAL vs GSW", status: "Q3", score: "89 - 84" },
];

interface HomeTabProps {
  onNavigateToChat: () => void;
  onNavigateToTools: () => void;
}

export function HomeTab({ onNavigateToChat, onNavigateToTools }: HomeTabProps) {
  const { actor } = useActor();
  const [dailyQuote, setDailyQuote] = useState<MotivationalQuote | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!actor) return;
    void (async () => {
      try {
        const quotes = await actor.getAllQuotes();
        if (quotes.length === 0) {
          await Promise.all(DEFAULT_QUOTES.map((q) => actor.addQuote(q)));
          const dayIdx = Math.floor(Date.now() / 86400000) % DEFAULT_QUOTES.length;
          setDailyQuote(DEFAULT_QUOTES[dayIdx]);
        } else {
          const dayIdx = Math.floor(Date.now() / 86400000) % quotes.length;
          setDailyQuote(quotes[dayIdx]);
        }
      } catch {
        const dayIdx = Math.floor(Date.now() / 86400000) % DEFAULT_QUOTES.length;
        setDailyQuote(DEFAULT_QUOTES[dayIdx]);
      }
    })();
  }, [actor]);

  const quickActions = [
    {
      label: "Chat with AI",
      icon: MessageCircle,
      gradient: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.5 0.2 254))",
      glow: "oklch(0.58 0.22 254 / 0.3)",
      action: onNavigateToChat,
    },
    {
      label: "Homework Helper",
      icon: BookOpen,
      gradient: "linear-gradient(135deg, oklch(0.52 0.18 300), oklch(0.45 0.16 300))",
      glow: "oklch(0.52 0.18 300 / 0.3)",
      action: onNavigateToTools,
    },
    {
      label: "Sports Info",
      icon: Trophy,
      gradient: "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.48 0.16 145))",
      glow: "oklch(0.55 0.18 145 / 0.3)",
      action: onNavigateToTools,
    },
    {
      label: "Stock Info",
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.58 0.16 55))",
      glow: "oklch(0.65 0.18 55 / 0.3)",
      action: onNavigateToTools,
    },
  ];

  return (
    <div className="page-fade" style={{ paddingBottom: 8 }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(180deg, oklch(0.10 0.025 254 / 0.6) 0%, transparent 100%)",
        }}
      >
        <div>
          <p style={{ fontSize: 13, color: "oklch(var(--ai-muted))", margin: 0 }}>{greeting} 👋</p>
          <h1
            style={{
              margin: "2px 0 0",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "oklch(var(--ai-text))",
            }}
          >
            Welcome Back!
          </h1>
        </div>
        <button
          type="button"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid oklch(var(--ai-border))",
            background: "oklch(var(--ai-card))",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "oklch(var(--ai-muted))",
          }}
        >
          <Bell size={18} />
        </button>
      </div>

      {/* Daily Quote Card */}
      {dailyQuote && (
        <div style={{ padding: "0 16px 16px" }}>
          <div
            style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, oklch(0.20 0.04 50 / 0.9), oklch(0.18 0.035 55 / 0.85))",
              border: "1px solid oklch(0.65 0.18 55 / 0.3)",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 24px oklch(0.65 0.18 55 / 0.15)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, oklch(0.72 0.18 55 / 0.15), transparent)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Sparkles size={14} style={{ color: "oklch(0.72 0.18 55)" }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "oklch(0.72 0.18 55)",
                }}
              >
                Daily Motivation • {dailyQuote.category}
              </span>
            </div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "oklch(0.93 0.02 60)",
                lineHeight: 1.55,
                margin: "0 0 10px",
                fontStyle: "italic",
              }}
            >
              &ldquo;{dailyQuote.quoteText}&rdquo;
            </p>
            <p style={{ fontSize: 13, color: "oklch(0.72 0.18 55)", margin: 0, fontWeight: 600 }}>
              — {dailyQuote.author}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ padding: "0 16px 16px" }}>
        <h2
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "oklch(var(--ai-text))",
            margin: "0 0 12px",
            letterSpacing: "0.04em",
          }}
        >
          QUICK ACTIONS
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={action.action}
                className="card-hover"
                style={{
                  borderRadius: 16,
                  background: "oklch(var(--ai-card))",
                  border: "1px solid oklch(var(--ai-border))",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: action.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${action.glow}`,
                  }}
                >
                  <Icon size={20} style={{ color: "oklch(0.98 0 0)" }} />
                </div>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "oklch(var(--ai-text))",
                  }}
                >
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Stocks */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "oklch(var(--ai-text))",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            TRENDING STOCKS
          </h2>
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: 12,
              color: "oklch(var(--ai-primary))",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div
          style={{
            background: "oklch(var(--ai-card))",
            borderRadius: 16,
            border: "1px solid oklch(var(--ai-border))",
            overflow: "hidden",
          }}
        >
          {STOCKS.map((stock, i) => (
            <div
              key={stock.symbol}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: i < STOCKS.length - 1 ? "1px solid oklch(var(--ai-border))" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "oklch(var(--ai-surface))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "oklch(var(--ai-primary))",
                  }}
                >
                  {stock.symbol.slice(0, 2)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "oklch(var(--ai-text))" }}>
                    {stock.symbol}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "oklch(var(--ai-muted))" }}>{stock.name}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "oklch(var(--ai-text))",
                  }}
                >
                  ${stock.price}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: stock.positive ? "oklch(0.62 0.2 145)" : "oklch(0.59 0.24 27)",
                  }}
                >
                  {stock.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sports Snapshot */}
      <div style={{ padding: "0 16px 24px" }}>
        <h2
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "oklch(var(--ai-text))",
            margin: "0 0 12px",
            letterSpacing: "0.04em",
          }}
        >
          SPORTS SNAPSHOT
        </h2>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {SPORTS_SNAPSHOTS.map((snap) => (
            <div
              key={snap.label}
              style={{
                minWidth: 150,
                borderRadius: 16,
                background: "oklch(var(--ai-card))",
                border: "1px solid oklch(var(--ai-border))",
                padding: "14px",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{snap.sport}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 99,
                    background: "oklch(0.59 0.24 27 / 0.2)",
                    color: "oklch(0.65 0.22 27)",
                    letterSpacing: "0.06em",
                    animation: "glowPulse 2s ease-in-out infinite",
                  }}
                >
                  {snap.status}
                </span>
              </div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 11,
                  color: "oklch(var(--ai-muted))",
                  fontWeight: 500,
                }}
              >
                {snap.label}
              </p>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 12,
                  color: "oklch(var(--ai-text))",
                  fontWeight: 600,
                }}
              >
                {snap.match}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14,
                  color: "oklch(var(--ai-primary))",
                  fontWeight: 700,
                }}
              >
                {snap.score}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
