import React, { useEffect, useState } from "react";
import {
  Settings, Moon, Sun, Bell, Info, LogOut,
  Star, Zap, Shield, MessageSquare, Wrench, Flame
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useActor } from "../hooks/useActor";

interface ProfileTabProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
}

function SettingsSheet({ onClose, isDark, onThemeToggle }: {
  onClose: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}) {
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifStocks, setNotifStocks] = useState(false);
  const [notifDaily, setNotifDaily] = useState(true);

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="bottom"
        style={{
          background: "oklch(var(--ai-card))",
          border: "1px solid oklch(var(--ai-border))",
          borderRadius: "24px 24px 0 0",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "20px",
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        <SheetHeader style={{ marginBottom: 20 }}>
          <SheetTitle style={{ color: "oklch(var(--ai-text))", fontFamily: "'Rajdhani', sans-serif", fontSize: 20 }}>
            Settings
          </SheetTitle>
        </SheetHeader>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Appearance */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(var(--ai-muted))", margin: "0 0 8px" }}>
            Appearance
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid oklch(var(--ai-border))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isDark ? <Moon size={18} style={{ color: "oklch(0.68 0.18 200)" }} /> : <Sun size={18} style={{ color: "oklch(0.72 0.18 55)" }} />}
              <span style={{ fontSize: 14, color: "oklch(var(--ai-text))" }}>Dark Mode</span>
            </div>
            <Switch checked={isDark} onCheckedChange={onThemeToggle} />
          </div>

          {/* Notifications */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(var(--ai-muted))", margin: "16px 0 8px" }}>
            Notifications
          </p>
          {[
            { label: "Match alerts", value: notifMatches, set: setNotifMatches },
            { label: "Stock updates", value: notifStocks, set: setNotifStocks },
            { label: "Daily motivation", value: notifDaily, set: setNotifDaily },
          ].map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid oklch(var(--ai-border))" }}
            >
              <span style={{ fontSize: 14, color: "oklch(var(--ai-text))" }}>{item.label}</span>
              <Switch checked={item.value} onCheckedChange={item.set} />
            </div>
          ))}

          {/* App Info */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(var(--ai-muted))", margin: "16px 0 8px" }}>
            App Info
          </p>
          <div style={{ padding: "12px", borderRadius: 12, background: "oklch(var(--ai-surface))" }}>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "oklch(var(--ai-text))", fontWeight: 600 }}>TSN AI Assistant</p>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "oklch(var(--ai-muted))" }}>Version 1.0.0</p>
            <p style={{ margin: 0, fontSize: 12, color: "oklch(var(--ai-muted))" }}>Built on Internet Computer Protocol</p>
          </div>

          <button
            type="button"
            style={{
              marginTop: 8,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid oklch(var(--ai-border))",
              background: "transparent",
              color: "oklch(0.58 0.22 254)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Contact Support
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ProfileTab({ isDark, onThemeToggle, onLogout }: ProfileTabProps) {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const [msgCount, setMsgCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (!actor) return;
    void (async () => {
      try {
        const [count, profile] = await Promise.all([
          actor.getCallerMessageCount(),
          actor.getCallerUserProfile(),
        ]);
        setMsgCount(Number(count));
        if (profile?.name) setUserName(profile.name);
      } catch {
        // ignore
      }
    })();
  }, [actor]);

  const principal = identity?.getPrincipal().toString();
  const initials = userName.slice(0, 2).toUpperCase();
  const isPremium = false; // placeholder

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      color: "oklch(0.58 0.22 254)",
      action: () => setShowSettings(true),
    },
    {
      icon: isDark ? Sun : Moon,
      label: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
      color: "oklch(0.68 0.18 200)",
      action: onThemeToggle,
    },
    {
      icon: Bell,
      label: "Notifications",
      color: "oklch(0.65 0.18 55)",
      action: () => {},
    },
    {
      icon: Info,
      label: "About TSN AI",
      color: "oklch(0.55 0.18 145)",
      action: () => {},
    },
    {
      icon: LogOut,
      label: "Logout",
      color: "oklch(0.59 0.24 27)",
      action: () => {
        clear();
        onLogout();
      },
    },
  ];

  return (
    <div className="page-fade" style={{ paddingBottom: 8 }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 24px",
          background: "linear-gradient(180deg, oklch(0.10 0.025 254 / 0.8) 0%, transparent 100%)",
          textAlign: "center",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.5 0.2 254))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: "0 0 24px oklch(0.58 0.22 254 / 0.4)",
            fontSize: 28,
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            color: "oklch(0.98 0 0)",
          }}
        >
          {initials}
        </div>

        <h2
          style={{
            margin: "0 0 4px",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "oklch(var(--ai-text))",
          }}
        >
          {userName}
        </h2>
        {principal && (
          <p style={{ margin: "0 0 10px", fontSize: 11, color: "oklch(var(--ai-muted))" }}>
            {principal.slice(0, 20)}...
          </p>
        )}

        {/* Plan Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 12px",
            borderRadius: 99,
            background: isPremium
              ? "linear-gradient(135deg, oklch(0.65 0.18 55 / 0.3), oklch(0.72 0.18 55 / 0.2))"
              : "oklch(var(--ai-surface))",
            border: isPremium
              ? "1px solid oklch(0.65 0.18 55 / 0.4)"
              : "1px solid oklch(var(--ai-border))",
          }}
        >
          <Star
            size={12}
            style={{ color: isPremium ? "oklch(0.72 0.18 55)" : "oklch(var(--ai-muted))" }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: isPremium ? "oklch(0.72 0.18 55)" : "oklch(var(--ai-muted))",
            }}
          >
            {isPremium ? "Premium Member" : "Free Plan"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          {[
            { icon: MessageSquare, value: String(msgCount || 0), label: "Messages", color: "oklch(0.58 0.22 254)" },
            { icon: Wrench, value: "8", label: "Tools Used", color: "oklch(0.68 0.18 200)" },
            { icon: Flame, value: "7", label: "Day Streak", color: "oklch(0.65 0.18 55)" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  borderRadius: 14,
                  background: "oklch(var(--ai-card))",
                  border: "1px solid oklch(var(--ai-border))",
                  padding: "14px 10px",
                  textAlign: "center",
                }}
              >
                <Icon size={20} style={{ color: stat.color, margin: "0 auto 6px", display: "block" }} />
                <p
                  style={{
                    margin: "0 0 2px",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "oklch(var(--ai-text))",
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "oklch(var(--ai-muted))" }}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            background: "oklch(var(--ai-card))",
            borderRadius: 16,
            border: "1px solid oklch(var(--ai-border))",
            overflow: "hidden",
          }}
        >
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "15px 16px",
                  background: "transparent",
                  border: "none",
                  borderBottom: i < menuItems.length - 1 ? "1px solid oklch(var(--ai-border))" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: item.label === "Logout" ? "oklch(0.59 0.24 27)" : "oklch(var(--ai-text))",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${item.color} / 0.12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} style={{ color: item.color }} />
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  {item.label}
                </span>
                {item.label !== "Logout" && (
                  <span style={{ fontSize: 18, color: "oklch(var(--ai-muted))" }}>›</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Premium Upgrade Card */}
      {!isPremium && (
        <div style={{ padding: "0 16px 24px" }}>
          <div
            style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, oklch(0.16 0.04 254), oklch(0.12 0.03 254))",
              border: "1px solid oklch(0.58 0.22 254 / 0.3)",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 32px oklch(0.58 0.22 254 / 0.15)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, oklch(0.58 0.22 254 / 0.15), transparent)",
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Zap size={18} style={{ color: "oklch(0.72 0.18 55)" }} />
              <h3
                style={{
                  margin: 0,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "oklch(0.95 0.01 250)",
                }}
              >
                Unlock All Features
              </h3>
            </div>

            <ul style={{ margin: "0 0 16px", padding: "0 0 0 4px", listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "🔍 Advanced image analysis",
                "📊 Real-time stock signals",
                "🤖 GPT-4 powered responses",
                "📱 Priority support",
              ].map((perk) => (
                <li key={perk} style={{ fontSize: 13, color: "oklch(0.8 0.05 255)", display: "flex", gap: 8 }}>
                  <Shield size={14} style={{ color: "oklch(0.68 0.18 200)", flexShrink: 0, marginTop: 1 }} />
                  <span>{perk.slice(2)}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.58 0.16 55))",
                color: "oklch(0.1 0.02 55)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 4px 16px oklch(0.65 0.18 55 / 0.35)",
              }}
            >
              Upgrade Now — $4.99/mo
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsSheet
          onClose={() => setShowSettings(false)}
          isDark={isDark}
          onThemeToggle={onThemeToggle}
        />
      )}
    </div>
  );
}
