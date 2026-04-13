import { useTheme } from "../components/ThemeContext";

export const FooterBrand = () => {
  const { dark, t } = useTheme();

  return (
    <div style={{
      position: "relative",
      width: "100%",
      overflow: "hidden",
      userSelect: "none",
      background: t.footerBg,
      borderTop: `1px solid ${t.border}`,
      padding: "100px 0 20px 0",
    }}>

      {/* 🔥 GLOW BACKGROUND */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "300px",
        background: dark
          ? "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
        filter: "blur(80px)",
        pointerEvents: "none",
      }}/>

      {/* 🔥 BRAND TEXT */}
      <h1 style={{
        textAlign:     "center",
        fontFamily:    "'Archivo',sans-serif",
        fontWeight:    900,
        letterSpacing: "0.05em",
        fontSize:      "clamp(90px, 18vw, 240px)",
        lineHeight:    0.9,
        color:         dark ? "#ffffff" : "#000000",
        
        // 🔥 FIXED OPACITY (more visible)
        opacity:       dark ? 0.09 : 0.08,

        // 🔥 SOFT GLOW
        textShadow: dark
          ? "0 0 40px rgba(37,99,235,0.25)"
          : "0 0 30px rgba(37,99,235,0.15)",

        pointerEvents: "none",
        margin:        0,
        whiteSpace:    "nowrap",
      }}>
        MEDIFIND
      </h1>
    </div>
  );
};

export default FooterBrand;