import React, { useState } from "react";
import { Loader2, Eye, EyeOff, User, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AuthScreenProps {
  onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { login, isLoggingIn, isLoginSuccess } = useInternetIdentity();

  // When login succeeds, call onLogin
  React.useEffect(() => {
    if (isLoginSuccess) {
      onLogin();
    }
  }, [isLoginSuccess, onLogin]);

  function handleIILogin() {
    setFormError("");
    login();
  }

  function handleGuestLogin() {
    onLogin();
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (mode === "signup") {
      if (!name.trim()) { setFormError("Please enter your name"); return; }
      if (password !== confirmPassword) { setFormError("Passwords do not match"); return; }
    }
    if (!email.trim()) { setFormError("Please enter your email"); return; }
    if (password.length < 6) { setFormError("Password must be at least 6 characters"); return; }
    // In demo mode, just proceed
    onLogin();
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, oklch(0.07 0.015 250) 0%, oklch(0.10 0.025 255) 100%)",
        display: "flex",
        flexDirection: "column",
        maxWidth: 430,
        margin: "0 auto",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(180deg, oklch(0.10 0.03 254 / 0.9) 0%, transparent 100%)",
          padding: "48px 24px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.58 0.22 254 / 0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <img
          src="/assets/generated/tsn-ai-logo-transparent.dim_400x400.png"
          alt="TSN AI"
          style={{ width: 80, height: 80, objectFit: "contain", margin: "0 auto", display: "block", position: "relative", zIndex: 1 }}
        />
        <h1
          style={{
            marginTop: 12,
            fontFamily: "'Rajdhani', 'Space Grotesk', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: "oklch(0.95 0.01 250)",
            letterSpacing: "0.04em",
          }}
        >
          TSN{" "}
          <span
            style={{
              background: "linear-gradient(135deg, oklch(0.65 0.22 254), oklch(0.72 0.18 200))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Assistant
          </span>
        </h1>
        <p style={{ marginTop: 4, fontSize: 13, color: "oklch(0.55 0.04 255)" }}>
          Your smart AI companion for every need
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            background: "oklch(0.12 0.02 250)",
            borderRadius: 12,
            padding: 4,
            gap: 4,
          }}
        >
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setFormError(""); }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                transition: "all 0.2s ease",
                background: mode === m
                  ? "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.5 0.2 254))"
                  : "transparent",
                color: mode === m ? "oklch(0.98 0 0)" : "oklch(0.55 0.04 255)",
                boxShadow: mode === m ? "0 2px 12px oklch(0.58 0.22 254 / 0.3)" : "none",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div style={{ padding: "20px 24px", flex: 1 }}>
        <div
          style={{
            background: "oklch(0.12 0.02 250)",
            borderRadius: 20,
            border: "1px solid oklch(0.22 0.03 250)",
            padding: "24px 20px",
          }}
        >
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "oklch(0.55 0.04 255)",
                  }}
                />
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    paddingLeft: 38,
                    background: "oklch(0.09 0.02 250)",
                    border: "1px solid oklch(0.25 0.03 250)",
                    color: "oklch(0.95 0.01 250)",
                    borderRadius: 10,
                  }}
                />
              </div>
            )}

            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "oklch(0.55 0.04 255)",
                }}
              />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  paddingLeft: 38,
                  background: "oklch(0.09 0.02 250)",
                  border: "1px solid oklch(0.25 0.03 250)",
                  color: "oklch(0.95 0.01 250)",
                  borderRadius: 10,
                }}
              />
            </div>

            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "oklch(0.55 0.04 255)",
                }}
              />
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  paddingLeft: 38,
                  paddingRight: 44,
                  background: "oklch(0.09 0.02 250)",
                  border: "1px solid oklch(0.25 0.03 250)",
                  color: "oklch(0.95 0.01 250)",
                  borderRadius: 10,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "oklch(0.55 0.04 255)",
                  display: "flex",
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === "signup" && (
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "oklch(0.55 0.04 255)",
                  }}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    paddingLeft: 38,
                    background: "oklch(0.09 0.02 250)",
                    border: "1px solid oklch(0.25 0.03 250)",
                    color: "oklch(0.95 0.01 250)",
                    borderRadius: 10,
                  }}
                />
              </div>
            )}

            {formError && (
              <p style={{ color: "oklch(0.65 0.2 27)", fontSize: 13, margin: 0 }}>{formError}</p>
            )}

            <button
              type="submit"
              style={{
                padding: "13px 0",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.52 0.2 254))",
                color: "oklch(0.98 0 0)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 4px 16px oklch(0.58 0.22 254 / 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "oklch(0.22 0.03 250)" }} />
            <span style={{ fontSize: 12, color: "oklch(0.45 0.04 255)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "oklch(0.22 0.03 250)" }} />
          </div>

          {/* Internet Identity Login */}
          <button
            type="button"
            onClick={handleIILogin}
            disabled={isLoggingIn}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 12,
              border: "1px solid oklch(0.58 0.22 254 / 0.4)",
              cursor: isLoggingIn ? "not-allowed" : "pointer",
              background: "transparent",
              color: "oklch(0.75 0.15 254)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s ease",
              opacity: isLoggingIn ? 0.7 : 1,
            }}
          >
            {isLoggingIn ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Sparkles size={16} />
            )}
            {isLoggingIn ? "Connecting..." : "Login with Internet Identity"}
          </button>
        </div>

        {/* Guest Button */}
        <button
          type="button"
          onClick={handleGuestLogin}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "12px 0",
            borderRadius: 12,
            border: "1px solid oklch(0.22 0.03 250)",
            cursor: "pointer",
            background: "transparent",
            color: "oklch(0.55 0.04 255)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            transition: "all 0.2s ease",
          }}
        >
          Continue as Guest (Demo Mode)
        </button>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "oklch(0.4 0.03 255)" }}>
          Demo mode: data may not persist across sessions
        </p>
      </div>
    </div>
  );
}
