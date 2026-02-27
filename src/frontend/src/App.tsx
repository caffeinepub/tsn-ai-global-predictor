import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Home, MessageCircle, Grid2x2, User } from "lucide-react";
import { SplashScreen } from "./components/SplashScreen";
import { AuthScreen } from "./components/AuthScreen";
import { HomeTab } from "./components/HomeTab";
import { ChatTab } from "./components/ChatTab";
import { ToolsTab } from "./components/ToolsTab";
import { ProfileTab } from "./components/ProfileTab";

type AppState = "splash" | "auth" | "app";
type Tab = "home" | "chat" | "tools" | "profile";

const NAV_ITEMS: { key: Tab; label: string; Icon: React.FC<{ size: number; className?: string }> }[] = [
  { key: "home", label: "Home", Icon: Home },
  { key: "chat", label: "Chat", Icon: MessageCircle },
  { key: "tools", label: "Tools", Icon: Grid2x2 },
  { key: "profile", label: "Profile", Icon: User },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isDark, setIsDark] = useState(true);

  // Apply dark/light theme
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark]);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (appState === "splash") {
    return (
      <>
        <SplashScreen onDone={() => setAppState("auth")} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (appState === "auth") {
    return (
      <>
        <AuthScreen onLogin={() => setAppState("app")} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Main Content */}
      <main className="scroll-content">
        <div className={activeTab === "home" ? "" : "hidden"}>
          <HomeTab
            onNavigateToChat={() => setActiveTab("chat")}
            onNavigateToTools={() => setActiveTab("tools")}
          />
        </div>
        <div className={activeTab === "chat" ? "" : "hidden"}>
          <ChatTab />
        </div>
        <div className={activeTab === "tools" ? "" : "hidden"}>
          <ToolsTab />
        </div>
        <div className={activeTab === "profile" ? "" : "hidden"}>
          <ProfileTab
            isDark={isDark}
            onThemeToggle={() => setIsDark((d) => !d)}
            onLogout={() => setAppState("auth")}
          />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav" aria-label="Main navigation">
        <div style={{ display: "flex", alignItems: "stretch", height: 62 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            const { Icon } = item;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all touch-target py-1"
                style={{
                  color: isActive ? "oklch(var(--ai-primary))" : "oklch(var(--ai-muted))",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active top line */}
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: 2,
                    borderRadius: 99,
                    width: isActive ? "2rem" : 0,
                    background: "linear-gradient(90deg, oklch(0.58 0.22 254), oklch(0.68 0.18 200))",
                    opacity: isActive ? 1 : 0,
                    boxShadow: isActive ? "0 0 8px oklch(0.58 0.22 254 / 0.8)" : "none",
                    transition: "all 0.3s ease",
                  }}
                />

                {/* Icon container */}
                <div
                  style={{
                    width: 40,
                    height: 30,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    background: isActive
                      ? "linear-gradient(135deg, oklch(0.58 0.22 254 / 0.18), oklch(0.68 0.18 200 / 0.1))"
                      : "transparent",
                    boxShadow: isActive ? "0 0 12px oklch(0.58 0.22 254 / 0.2)" : "none",
                  }}
                >
                  <Icon
                    size={19}
                    className={isActive ? "nav-glow" : ""}
                  />
                </div>

                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.05em",
                    transition: "all 0.2s ease",
                    color: isActive ? "oklch(var(--ai-primary))" : "oklch(var(--ai-muted))",
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
