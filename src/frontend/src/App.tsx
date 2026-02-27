import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Home, Radio, Brain, Crown, User } from "lucide-react";
import { HomeTab } from "./components/HomeTab";
import { LiveTab } from "./components/LiveTab";
import { AIPredictionTab } from "./components/AIPredictionTab";
import { FantasyTab } from "./components/FantasyTab";
import { ProfileTab } from "./components/ProfileTab";
import { useActor } from "./hooks/useActor";
import { useAllMatches } from "./hooks/useQueries";
import { MatchStatus } from "./backend.d";
import { seedIfNeeded } from "./utils/seedData";

type Tab = "home" | "live" | "predict" | "fantasy" | "profile";

const NAV_ITEMS: { key: Tab; label: string; icon: React.FC<{ size: number; className?: string }> }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "live", label: "Live", icon: Radio },
  { key: "predict", label: "AI Predict", icon: Brain },
  { key: "fantasy", label: "Fantasy", icon: Crown },
  { key: "profile", label: "Profile", icon: User },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isDark, setIsDark] = useState(true);
  const { actor } = useActor();
  const { data: matches = [] } = useAllMatches();

  const liveCount = matches.filter((m) => m.status === MatchStatus.live).length;

  // Apply dark/light theme to html element
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark]);

  // Initialize with dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Seed data on startup
  useEffect(() => {
    if (!actor) return;
    void seedIfNeeded(actor);
  }, [actor]);

  return (
    <div className="app-container">
      {/* Main Content Area */}
      <main className="scroll-content">
        <div
          className={activeTab === "home" ? "" : "hidden"}
        >
          <HomeTab />
        </div>
        <div className={activeTab === "live" ? "" : "hidden"}>
          <LiveTab />
        </div>
        <div className={activeTab === "predict" ? "" : "hidden"}>
          <AIPredictionTab />
        </div>
        <div className={activeTab === "fantasy" ? "" : "hidden"}>
          <FantasyTab />
        </div>
        <div className={activeTab === "profile" ? "" : "hidden"}>
          <ProfileTab isDark={isDark} onThemeToggle={() => setIsDark((d) => !d)} />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav" aria-label="Main navigation">
        <div className="flex items-stretch h-[62px]">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            const IconComponent = item.icon;
            const showLiveDot = item.key === "live" && liveCount > 0;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all touch-target py-1"
                style={{
                  color: isActive ? "oklch(var(--primary))" : "oklch(var(--sport-muted))",
                }}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator: top accent line */}
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? "2rem" : "0",
                    backgroundColor: "oklch(var(--primary))",
                    opacity: isActive ? 1 : 0,
                    boxShadow: isActive ? "0 0 8px oklch(var(--primary) / 0.8)" : "none",
                  }}
                />

                {/* Icon with active pill bubble */}
                <div
                  className="relative flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{
                    width: 40,
                    height: 32,
                    background: isActive
                      ? "linear-gradient(135deg, oklch(var(--primary) / 0.18), oklch(var(--accent) / 0.1))"
                      : "transparent",
                    boxShadow: isActive ? "0 0 12px oklch(var(--primary) / 0.2)" : "none",
                  }}
                >
                  <IconComponent
                    size={19}
                    className={isActive ? "nav-glow" : ""}
                  />
                  {showLiveDot && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-live-pulse border border-sport-nav" />
                  )}
                </div>

                <span
                  className="text-[10px] font-heading font-semibold tracking-wide transition-all duration-200"
                  style={{
                    color: isActive ? "oklch(var(--primary))" : "oklch(var(--sport-muted))",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  );
}
