// src/context/ThemeContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for dark/light theme.
// Wrap your entire <App /> with <ThemeProvider>.
// Any component can call useTheme() to get { dark, toggle, t }.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
export const DARK = {
  bg:         "#000000",
  bgAlt:      "#0a0a0a",
  bgCard:     "#111111",
  bgCardHov:  "#161616",
  border:     "rgba(255,255,255,0.08)",
  borderHov:  "rgba(37,99,235,0.45)",
  text:       "#ffffff",
  textMuted:  "rgba(255,255,255,0.45)",
  textFaint:  "rgba(255,255,255,0.2)",
  blue:       "#2563eb",
  blueLight:  "#3b82f6",
  blueBg:     "rgba(37,99,235,0.1)",
  blueBorder: "rgba(37,99,235,0.25)",
  tagBg:      "rgba(37,99,235,0.12)",
  tagText:    "#3b82f6",
  navBg:      "rgba(0,0,0,0.9)",
  inputBg:    "#111111",
  footerBg:   "#000000",
  tickerBg:   "rgba(255,255,255,0.018)",
  tickerBdr:  "rgba(255,255,255,0.06)",
  tickerTxt:  "rgba(255,255,255,0.3)",
};

export const LIGHT = {
  bg:         "#f5f2eb",
  bgAlt:      "#edeae3",
  bgCard:     "#ffffff",
  bgCardHov:  "#f8f8f6",
  border:     "rgba(0,0,0,0.09)",
  borderHov:  "rgba(37,99,235,0.35)",
  text:       "#0a0a0a",
  textMuted:  "rgba(0,0,0,0.5)",
  textFaint:  "rgba(0,0,0,0.24)",
  blue:       "#1d4ed8",
  blueLight:  "#2563eb",
  blueBg:     "rgba(37,99,235,0.07)",
  blueBorder: "rgba(37,99,235,0.18)",
  tagBg:      "rgba(37,99,235,0.07)",
  tagText:    "#1d4ed8",
  navBg:      "rgba(245,242,235,0.92)",
  inputBg:    "#f0ede6",
  footerBg:   "#edeae3",
  tickerBg:   "rgba(0,0,0,0.018)",
  tickerBdr:  "rgba(0,0,0,0.08)",
  tickerTxt:  "rgba(0,0,0,0.35)",
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);
  const toggle = () => setDark((d) => !d);
  const t = dark ? DARK : LIGHT;
  return (
    <ThemeContext.Provider value={{ dark, toggle, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);