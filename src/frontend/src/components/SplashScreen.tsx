import React, { useEffect } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, oklch(0.07 0.015 250) 0%, oklch(0.10 0.025 255) 50%, oklch(0.07 0.015 250) 100%)",
        zIndex: 9999,
        maxWidth: 430,
        margin: "0 auto",
      }}
    >
      {/* Glow ring behind logo */}
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.58 0.22 254 / 0.2) 0%, transparent 70%)",
          animation: "glowPulse 2s ease-in-out infinite",
        }}
      />

      {/* Logo */}
      <div
        style={{
          animation: "splashFadeIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          opacity: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <img
          src="/assets/generated/tsn-ai-logo-transparent.dim_400x400.png"
          alt="TSN AI Logo"
          style={{ width: 120, height: 120, objectFit: "contain" }}
        />
      </div>

      {/* App Name */}
      <div
        style={{
          marginTop: 20,
          animation: "splashTextIn 0.7s ease 0.5s forwards",
          opacity: 0,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Rajdhani', 'Space Grotesk', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "oklch(0.95 0.01 250)",
            margin: 0,
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
        <p
          style={{
            marginTop: 6,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 13,
            color: "oklch(0.55 0.04 255)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Smart · Fast · Intelligent
        </p>
      </div>

      {/* Loading dots */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          gap: 8,
          animation: "splashTextIn 0.5s ease 1s forwards",
          opacity: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "oklch(0.58 0.22 254)",
              animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
