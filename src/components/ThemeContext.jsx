// src/components/ThemeContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Universal theme system for the entire app.
// One toggle in Navbar updates EVERY page instantly.
//
// Usage in any component:
//   import { useTheme } from "../components/ThemeContext";
//   const { dark, toggle, t } = useTheme();
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";

// ─── DARK TOKENS ──────────────────────────────────────────────────────────────
export const DARK = {
  bg:          "#000000",
  bgAlt:       "#0a0a0a",
  bgCard:      "#111111",
  bgCardHov:   "#161616",
  border:      "rgba(255,255,255,0.08)",
  borderHov:   "rgba(37,99,235,0.45)",
  text:        "#ffffff",
  textMuted:   "rgba(255,255,255,0.45)",
  textFaint:   "rgba(255,255,255,0.2)",
  blue:        "#2563eb",
  blueLight:   "#3b82f6",
  blueBg:      "rgba(37,99,235,0.1)",
  blueBorder:  "rgba(37,99,235,0.25)",
  tagBg:       "rgba(37,99,235,0.12)",
  tagText:     "#3b82f6",
  navBg:       "rgba(0,0,0,0.9)",
  tickerBg:    "rgba(255,255,255,0.018)",
  tickerBdr:   "rgba(255,255,255,0.06)",
  tickerTxt:   "rgba(255,255,255,0.3)",
  inputBg:     "#111111",
  footerBg:    "#000000",
  // Seller dashboard extras
  accent:      "#10b981",
  accent2:     "#06b6d4",
  alertBg:     "#1c1500",
  alertBorder: "#3d2e00",
  alertColor:  "#f59e0b",
  badgeBg:     "#064e3b",
  badgeText:   "#6ee7b7",
  rankColor:   "#475569",
  spinnerBorder: "#10b981",
};

// ─── LIGHT TOKENS ─────────────────────────────────────────────────────────────
export const LIGHT = {
  bg:          "#f5f2eb",
  bgAlt:       "#edeae3",
  bgCard:      "#ffffff",
  bgCardHov:   "#f8f8f6",
  border:      "rgba(0,0,0,0.09)",
  borderHov:   "rgba(37,99,235,0.35)",
  text:        "#0a0a0a",
  textMuted:   "rgba(0,0,0,0.5)",
  textFaint:   "rgba(0,0,0,0.24)",
  blue:        "#1d4ed8",
  blueLight:   "#2563eb",
  blueBg:      "rgba(37,99,235,0.07)",
  blueBorder:  "rgba(37,99,235,0.18)",
  tagBg:       "rgba(37,99,235,0.07)",
  tagText:     "#1d4ed8",
  navBg:       "rgba(245,242,235,0.92)",
  tickerBg:    "rgba(0,0,0,0.018)",
  tickerBdr:   "rgba(0,0,0,0.08)",
  tickerTxt:   "rgba(0,0,0,0.35)",
  inputBg:     "#f0ede6",
  footerBg:    "#edeae3",
  // Seller dashboard extras
  accent:      "#059669",
  accent2:     "#0284c7",
  alertBg:     "#fffbeb",
  alertBorder: "#fcd34d",
  alertColor:  "#b45309",
  badgeBg:     "#d1fae5",
  badgeText:   "#065f46",
  rankColor:   "#94a3b8",
  spinnerBorder: "#059669",
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Persist preference in localStorage
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("mc-theme");
      return saved ? saved === "dark" : true; // default dark
    } catch {
      return true;
    }
  });

  const toggle = () => setDark((prev) => !prev);

  // Apply CSS variables to :root on every change
  useEffect(() => {
    const tokens = dark ? DARK : LIGHT;
    const root = document.documentElement;

    // Map token keys to CSS var names
    const cssVarMap = {
      bg:            "--mc-bg",
      bgAlt:         "--mc-bg-alt",
      bgCard:        "--mc-bg-card",
      bgCardHov:     "--mc-bg-card-hov",
      border:        "--mc-border",
      borderHov:     "--mc-border-hov",
      text:          "--mc-text",
      textMuted:     "--mc-text-muted",
      textFaint:     "--mc-text-faint",
      blue:          "--mc-blue",
      blueLight:     "--mc-blue-light",
      blueBg:        "--mc-blue-bg",
      blueBorder:    "--mc-blue-border",
      tagBg:         "--mc-tag-bg",
      tagText:       "--mc-tag-text",
      navBg:         "--mc-nav-bg",
      accent:        "--mc-accent",
      accent2:       "--mc-accent2",
      alertBg:       "--mc-alert-bg",
      alertBorder:   "--mc-alert-border",
      alertColor:    "--mc-alert-color",
      badgeBg:       "--mc-badge-bg",
      badgeText:     "--mc-badge-text",
      rankColor:     "--mc-rank-color",
      spinnerBorder: "--mc-spinner",
    };

    Object.entries(cssVarMap).forEach(([key, cssVar]) => {
      if (tokens[key]) root.style.setProperty(cssVar, tokens[key]);
    });

    // Also set body background so no flash on page transitions
    document.body.style.background = tokens.bg;
    document.body.style.color      = tokens.text;
    document.body.style.transition = "background 0.3s, color 0.3s";

    // Persist
    try { localStorage.setItem("mc-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  const t = dark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ dark, toggle, t, DARK, LIGHT }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};

export default ThemeContext;