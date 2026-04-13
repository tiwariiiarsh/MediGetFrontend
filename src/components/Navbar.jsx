// src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Theme-aware Navbar.
// Reads dark/toggle/t from ThemeContext — one toggle updates the entire app.
// No props needed. Fonts: Archivo.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logOutUser } from "../store/actions";
import { useTheme } from "../components/ThemeContext";

const Navbar = () => {
  const user     = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ── useTheme() gives dark state + toggle + token object ──────────────────
  // Calling toggle() here will re-render EVERY component that calls useTheme()
  const { dark, toggle, t } = useTheme();

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);

  // Hide on auth pages
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logOutUser(navigate));
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const role = user?.roles?.[0] || user?.role?.[0] || null;

  // ─── NAV LINKS PER ROLE ───────────────────────────────────────────────────
  const publicLinks = [["Home","/"],["Medicines","/medicines"],["About","/about"],["Contact","/contact"]];
  const sellerLinks = [["Dashboard","/seller"],["Inventory","/seller/medicines"],["Billing","/seller/billing"],["Analytics","/seller/analytics"]];
  const userLinks   = [["Home","/"],["Medicines","/medicines"],["About","/about"],["Contact","/contact"]];
  const activeLinks = !user ? publicLinks : role === "ROLE_SELLER" ? sellerLinks : userLinks;

  const isActive = (path) => location.pathname === path;

  // ─── STYLES ───────────────────────────────────────────────────────────────
  const linkStyle = (path) => ({
    fontFamily:     "'Archivo', sans-serif",
    fontSize:       13,
    fontWeight:     isActive(path) ? 700 : 400,
    color:          isActive(path) ? t.blue : t.textMuted,
    textDecoration: "none",
    borderBottom:   isActive(path) ? `2px solid ${t.blue}` : "2px solid transparent",
    paddingBottom:  2,
    cursor:         "pointer",
    transition:     "color 0.18s",
    background:     "none",
    border:         "none",
    padding:        "2px 0",
    borderBottom:   isActive(path) ? `2px solid ${t.blue}` : "2px solid transparent",
  });

  const navBg = scrolled
    ? t.navBg
    : dark ? "rgba(0,0,0,0)" : "rgba(245,242,235,0)";

  const navBorder = scrolled ? `1px solid ${t.border}` : "1px solid transparent";

  // ─── TOGGLE BUTTON ────────────────────────────────────────────────────────
  // This single button controls the theme for the ENTIRE application
  const ThemeToggleBtn = ({ mobile = false }) => (
    <button
      onClick={toggle}              // ← calls ThemeContext toggle → re-renders all
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          7,
        background:   t.bgCard,
        border:       `1px solid ${t.border}`,
        borderRadius: 100,
        padding:      mobile ? "11px 0" : "7px 15px",
        width:        mobile ? "100%" : "auto",
        justifyContent: mobile ? "center" : "flex-start",
        cursor:       "pointer",
        fontFamily:   "'Archivo', sans-serif",
        fontSize:     mobile ? 13 : 12,
        fontWeight:   600,
        color:        t.textMuted,
        transition:   "all 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.color = t.blue; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
    >
      <span style={{ fontSize: 14 }}>{dark ? "☀️" : "🌙"}</span>
      {dark ? (mobile ? "Light mode" : "Light") : (mobile ? "Dark mode" : "Dark")}
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes mc-slide-down {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .mc-nav-link:hover    { color: ${t.blue} !important; }
        .mc-mobile-link:hover { color: ${t.blue} !important; }
        @media (max-width: 768px) {
          .mc-hamburger { display: flex !important; }
          .mc-desktop-links { display: none !important; }
        }
      `}</style>

      <nav style={{
        position:       "fixed",
        top:            0,
        width:          "100%",
        zIndex:         100,
        background:     navBg,
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom:   navBorder,
        transition:     "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}>
        <div style={{
          maxWidth:       1280,
          margin:         "0 auto",
          padding:        "0 6vw",
          height:         62,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}>

          {/* ── LOGO ── */}
          <div
            onClick={() => navigate("/")}
            style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
          >
            <div style={{
              width:36, height:36,
              background:   t.blue,
              borderRadius: 9,
              display:      "flex", alignItems:"center", justifyContent:"center",
              fontFamily:   "'Archivo', sans-serif",
              fontWeight:   900, fontSize:20, color:"#fff",
            }}>+</div>
            <span style={{
              fontFamily:    "'Archivo', sans-serif",
              fontWeight:    800, fontSize:16,
              color:         t.text,
              letterSpacing: "-0.025em",
            }}>MediCare</span>
          </div>

          {/* ── DESKTOP LINKS ── */}
          <ul className="mc-desktop-links" style={{
            display:    "flex", alignItems:"center", gap:28,
            listStyle:  "none", padding:0, margin:0,
          }}>
            {activeLinks.map(([label, path]) => (
              <li key={path}>
                <span
                  className="mc-nav-link"
                  onClick={() => navigate(path)}
                  style={linkStyle(path)}
                >{label}</span>
              </li>
            ))}
          </ul>

          {/* ── RIGHT: TOGGLE + AUTH ── */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>

            {/* ── THEME TOGGLE — controls entire app ── */}
            <ThemeToggleBtn />

            {/* NOT LOGGED IN */}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding:    "9px 22px",
                  borderRadius: 12,
                  background: t.blue,
                  color:      "#fff",
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700, fontSize:13,
                  border:     "none",
                  cursor:     "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Login →</button>
            )}

            {/* LOGGED IN — avatar + dropdown */}
            {user && (
              <div style={{ position:"relative" }}>
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    width:36, height:36, borderRadius:"50%",
                    background: t.blue,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Archivo',sans-serif",
                    fontWeight:800, fontSize:14, color:"#fff",
                    cursor:"pointer",
                    border:`2px solid ${t.blueBorder}`,
                    transition:"opacity 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* PROFILE DROPDOWN */}
                {profileOpen && (
                  <div style={{
                    position:  "absolute", top:46, right:0,
                    background: t.bgCard,
                    border:     `1px solid ${t.border}`,
                    borderRadius: 14,
                    padding:    "8px 0",
                    minWidth:   180,
                    animation:  "mc-slide-down 0.2s ease",
                    boxShadow:  dark ? "0 8px 40px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.12)",
                    zIndex:     200,
                  }}>
                    <div style={{ padding:"10px 16px 8px", borderBottom:`1px solid ${t.border}` }}>
                      <p style={{ fontFamily:"'Archivo',sans-serif", fontWeight:700, fontSize:13, color:t.text, margin:0 }}>{user.username}</p>
                      <p style={{ fontFamily:"'Archivo',sans-serif", fontSize:11, color:t.textFaint, marginTop:2, marginBottom:0 }}>
                        {role === "ROLE_SELLER" ? "Pharmacy Owner" : "Patient"}
                      </p>
                    </div>

                    {[
                      ["My Profile", role === "ROLE_SELLER" ? "/seller" : "/user"],
                      ["Settings",   "/settings"],
                    ].map(([label, path]) => (
                      <div
                        key={path}
                        onClick={() => { navigate(path); setProfileOpen(false); }}
                        style={{ padding:"9px 16px", cursor:"pointer", fontFamily:"'Archivo',sans-serif", fontSize:13, color:t.textMuted, transition:"all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.blueBg; e.currentTarget.style.color = t.blue; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textMuted; }}
                      >{label}</div>
                    ))}

                    <div style={{ borderTop:`1px solid ${t.border}`, marginTop:4, paddingTop:4 }}>
                      <div
                        onClick={handleLogout}
                        style={{ padding:"9px 16px", cursor:"pointer", fontFamily:"'Archivo',sans-serif", fontSize:13, color:"#ef4444", transition:"background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >Logout</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE HAMBURGER */}
            <button
              className="mc-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display:    "none",
                background: "none",
                border:     `1px solid ${t.border}`,
                borderRadius: 8,
                padding:    "7px 10px",
                cursor:     "pointer",
                color:      t.textMuted,
                fontSize:   18,
                transition: "all 0.2s",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div style={{
            background:  t.bgCard,
            borderTop:   `1px solid ${t.border}`,
            padding:     "20px 6vw 24px",
            animation:   "mc-slide-down 0.2s ease",
          }}>
            <ul style={{ listStyle:"none", padding:0, margin:"0 0 20px", display:"flex", flexDirection:"column", gap:0 }}>
              {activeLinks.map(([label, path]) => (
                <li key={path}>
                  <span
                    className="mc-mobile-link"
                    onClick={() => { navigate(path); setMenuOpen(false); }}
                    style={{
                      display:    "block",
                      padding:    "12px 0",
                      borderBottom: `1px solid ${t.border}`,
                      fontFamily: "'Archivo',sans-serif",
                      fontSize:   14,
                      fontWeight: isActive(path) ? 700 : 400,
                      color:      isActive(path) ? t.blue : t.textMuted,
                      cursor:     "pointer",
                      transition: "color 0.15s",
                    }}
                  >{label}</span>
                </li>
              ))}
            </ul>

            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <ThemeToggleBtn mobile />

              {!user ? (
                <button
                  onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  style={{
                    flex:1, padding:"11px 0", borderRadius:10,
                    background: t.blue, color:"#fff",
                    fontFamily:"'Archivo',sans-serif", fontWeight:700,
                    fontSize:13, border:"none", cursor:"pointer",
                  }}
                >Login →</button>
              ) : (
                <button
                  onClick={handleLogout}
                  style={{
                    flex:1, padding:"11px 0", borderRadius:10,
                    background:"rgba(239,68,68,0.1)", color:"#ef4444",
                    fontFamily:"'Archivo',sans-serif", fontWeight:600,
                    fontSize:13, border:"1px solid rgba(239,68,68,0.2)", cursor:"pointer",
                  }}
                >Logout</button>
              )}
            </div>
          </div>
        )}

        {/* Click-outside overlay for profile dropdown */}
        {profileOpen && (
          <div
            style={{ position:"fixed", inset:0, zIndex:150 }}
            onClick={() => setProfileOpen(false)}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;