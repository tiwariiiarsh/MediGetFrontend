// src/components/Footer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Theme-aware Footer + FooterBrand — dark/light, blue + black + white only.
// No gradients. Uses ThemeContext.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";


// ─── MAIN FOOTER ──────────────────────────────────────────────────────────────
const Footer = () => {
  const { t } = useTheme();

  const colHead = {
    fontFamily: "'Archivo',sans-serif",
    fontSize:   10.5, fontWeight:700,
    letterSpacing:"0.12em", textTransform:"uppercase",
    color: t.textFaint, marginBottom:16,
  };

  const linkStyle = {
    display:    "block",
    fontFamily: "'Archivo',sans-serif",
    fontSize:   13.5,
    color:      t.textMuted,
    textDecoration: "none",
    marginBottom: 10,
    transition: "color 0.15s",
  };

  return (
    <footer style={{ background:t.footerBg, borderTop:`1px solid ${t.border}`, marginTop:0 }}>

      {/* BIG BG BRAND TEXT */}

      {/* TOP DIVIDER */}
      <div style={{ height:1, background:t.border, marginBottom:0 }} />

      {/* FOOTER BODY */}
      <div style={{
        maxWidth:   1280,
        margin:     "0 auto",
        padding:    "52px 8vw 28px",
      }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"1.6fr 1fr 1fr 1fr",
          gap:44,
          marginBottom:44,
        }}>

          {/* ── BRAND COL ── */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, background:t.blue, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Archivo',sans-serif", fontWeight:900, fontSize:20, color:"#fff" }}>+</div>
              <span style={{ fontFamily:"'Archivo',sans-serif", fontWeight:800, fontSize:16, color:t.text, letterSpacing:"-0.02em" }}>MediCare</span>
            </div>
            <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:13, color:t.textMuted, lineHeight:1.75, maxWidth:220, marginBottom:18 }}>
              Connecting patients and pharmacies with reliable medicines, real-time stock updates — your health, simplified.
            </p>

            {/* Status badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, border:`1px solid ${t.border}`, borderRadius:100, padding:"5px 14px" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
              <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:11, fontWeight:600, color:t.textMuted }}>System Operational</span>
            </div>
          </div>

          {/* ── EXPLORE ── */}
          <div>
            <p style={colHead}>Explore</p>
            {[["Home","/"],["Medicines","/medicines"],["About","/about"],["Contact","/contact"]].map(([label,path])=>(
              <Link key={path} to={path} style={linkStyle}
                onMouseEnter={e=>e.currentTarget.style.color=t.blue}
                onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}
              >{label}</Link>
            ))}
          </div>

          {/* ── ACCOUNT ── */}
          <div>
            <p style={colHead}>Account</p>
            {[["Login","/login"],["Sign Up","/signup"],["Your Profile","/user"],["Register Pharmacy","/signup"]].map(([label,path])=>(
              <Link key={label} to={path} style={linkStyle}
                onMouseEnter={e=>e.currentTarget.style.color=t.blue}
                onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}
              >{label}</Link>
            ))}
          </div>

          {/* ── SUPPORT ── */}
          <div>
            <p style={colHead}>Support</p>
            <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:13.5, color:t.textMuted, lineHeight:1.7, marginBottom:12 }}>
              Need help or have questions?
            </p>
            <a
              href="mailto:support@medicare.com"
              style={{ ...linkStyle, color:t.blue, fontWeight:600, marginBottom:8 }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.75"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >support@medicare.com</a>
            <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:12, color:t.textFaint, marginTop:6 }}>Mon–Sat · 10:00–19:00 IST</p>

            {/* Social icons row */}
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              {[
                { label:"in", href:"#" },
                { label:"ig", href:"#" },
                { label:"wa", href:"#" },
              ].map(({label,href})=>(
                <a key={label} href={href} style={{
                  width:32, height:32, borderRadius:"50%",
                  border:`1px solid ${t.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Archivo',sans-serif", fontSize:10, fontWeight:700,
                  color:t.textMuted, textDecoration:"none",
                  transition:"all 0.2s",
                  textTransform:"uppercase",
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=t.blue; e.currentTarget.style.color=t.blue; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.textMuted; }}
                >{label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:22, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:12, color:t.textFaint }}>
            © {new Date().getFullYear()} MediCare. All rights reserved.
          </p>
          <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:12, color:t.textFaint }}>
            🇮🇳 Made in India · Built for Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;