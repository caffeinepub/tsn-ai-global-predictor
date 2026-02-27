import React, { useState } from "react";
import { Moon, Sun, Bell, Shield, LogOut, LogIn, ChevronRight, BarChart2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserProfile, useIsAdmin, useAllPlayers } from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getSportLabel, getSportIcon, ALL_SPORTS } from "../utils/helpers";
import { Sport } from "../backend.d";
import { PlayerAnalytics } from "./PlayerAnalytics";
import { AdminPanel } from "./AdminPanel";

interface ProfileTabProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function ProfileTab({ isDark, onThemeToggle }: ProfileTabProps) {
  const { data: profile } = useUserProfile();
  const { data: isAdmin } = useIsAdmin();
  const { data: players = [] } = useAllPlayers();
  const { identity, login, clear, isLoggingIn, isInitializing } = useInternetIdentity();

  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [notifMatchAlerts, setNotifMatchAlerts] = useState(true);
  const [notifScoreUpdates, setNotifScoreUpdates] = useState(true);
  const [notifPredictions, setNotifPredictions] = useState(false);

  const principal = identity?.getPrincipal().toString();
  const displayName = profile?.name || (principal ? `${principal.substring(0, 8)}...` : "Guest User");
  const initials = displayName.substring(0, 2).toUpperCase();
  const isLoggedIn = !!identity;

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="page-fade">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-sport-nav/95 backdrop-blur-sm border-b border-sport-border px-4 py-3">
        <h1
          className="font-heading font-black text-sport-text"
          style={{ fontSize: "1.25rem", letterSpacing: "0.06em" }}
        >
          PROFILE
        </h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* User Card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.08 255))",
            border: "1px solid oklch(0.28 0.06 265)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-heading font-black text-white"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                boxShadow: "0 0 24px rgba(59,130,246,0.3)",
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-black text-lg text-white truncate">{displayName}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-heading font-bold mt-1">
                  <Shield size={10} /> ADMIN
                </span>
              )}
              {!isAdmin && isLoggedIn && (
                <span className="text-xs text-blue-400 font-heading">Logged in</span>
              )}
              {!isLoggedIn && (
                <span className="text-xs text-sport-muted font-heading">Not logged in</span>
              )}
            </div>
          </div>

          {!isLoggedIn ? (
            <button
              type="button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="mt-4 w-full py-3 rounded-xl font-heading font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}
            >
              <LogIn size={16} />
              {isLoggingIn ? "Logging in…" : "Login with Internet Identity"}
            </button>
          ) : (
            <button
              type="button"
              onClick={clear}
              className="mt-4 w-full py-2.5 rounded-xl font-heading font-bold text-sm tracking-wide text-red-400 flex items-center justify-center gap-2 transition-all border border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>

        {/* Theme Toggle */}
        <Section title="Appearance">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-sport-surface">
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-yellow-400" />}
              <div>
                <p className="text-sm font-heading font-semibold text-sport-text">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </p>
                <p className="text-xs text-sport-muted">Toggle app theme</p>
              </div>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={onThemeToggle}
              id="theme-toggle"
            />
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <div className="space-y-2">
            <NotifRow
              icon={<Bell size={16} className="text-red-400" />}
              label="Live Match Alerts"
              checked={notifMatchAlerts}
              onChange={setNotifMatchAlerts}
            />
            <NotifRow
              icon={<span className="text-base">📊</span>}
              label="Score Updates"
              checked={notifScoreUpdates}
              onChange={setNotifScoreUpdates}
            />
            <NotifRow
              icon={<span className="text-base">🤖</span>}
              label="AI Predictions"
              checked={notifPredictions}
              onChange={setNotifPredictions}
            />
          </div>
        </Section>

        {/* Favorite Sport */}
        <Section title="Favorite Sport">
          <div className="flex flex-wrap gap-2 pt-1">
            {ALL_SPORTS.map((sport: Sport) => (
              <span
                key={sport}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-heading font-semibold border border-sport-border text-sport-muted bg-sport-surface"
              >
                {getSportIcon(sport)} {getSportLabel(sport)}
              </span>
            ))}
          </div>
        </Section>

        {/* Player Analytics */}
        {players.length > 0 && (
          <Section title="Player Analytics">
            <div className="mb-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {players.slice(0, 8).map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => setSelectedPlayerId(selectedPlayerId === player.id ? null : player.id)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-heading font-semibold transition-all"
                    style={
                      selectedPlayerId === player.id
                        ? { background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", color: "white", border: "1px solid #3b82f660" }
                        : { backgroundColor: "oklch(var(--sport-card))", border: "1px solid oklch(var(--sport-border))", color: "oklch(var(--sport-muted))" }
                    }
                  >
                    <BarChart2 size={12} />
                    {player.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
            {selectedPlayer && <PlayerAnalytics player={selectedPlayer} />}
            {!selectedPlayer && (
              <div className="text-center py-4 text-sport-muted text-sm font-heading">
                Tap a player to see analytics
              </div>
            )}
          </Section>
        )}

        {/* Admin Panel Button */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => setAdminOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, oklch(0.15 0.08 55), oklch(0.18 0.1 45))",
              border: "1px solid oklch(0.3 0.08 50)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Shield size={18} className="text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="font-heading font-black text-sm text-yellow-400">Admin Panel</p>
                <p className="text-xs text-yellow-600">Manage matches, news, players</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-yellow-600" />
          </button>
        )}

        {/* Footer */}
        <div className="text-center py-4 text-sport-muted text-xs">
          <p>TSN Sports AI Pro v1.0</p>
          <p className="mt-1">
            © 2026. Built with ❤️ using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>

      {/* Admin Panel Modal */}
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-heading font-black text-sport-muted uppercase tracking-widest mb-2 px-1">
        {title}
      </p>
      {children}
    </div>
  );
}

function NotifRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = `notif-${label.toLowerCase().replace(/\s/g, "-")}`;
  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-sport-surface">
      <div className="flex items-center gap-3">
        {icon}
        <Label htmlFor={id} className="text-sm font-heading font-semibold text-sport-text cursor-pointer">
          {label}
        </Label>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
