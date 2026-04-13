// src/pages/seller/SellerDashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reads dark/t from ThemeContext — no props, no local theme state.
// When Navbar toggle is clicked, this page re-renders automatically.
// No gradients. Clean dark/light token system.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiPackage, FiTrendingUp, FiAlertTriangle, FiPlusCircle,
  FiEdit3, FiBarChart2, FiShoppingCart,
} from "react-icons/fi";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { useTheme } from "../../components/ThemeContext";

const BASE = "http://localhost:8080/api";

// ─── REUSABLE CARD ────────────────────────────────────────────────────────────
const Card = ({ children, t, alert = false, style = {}, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   alert ? t.alertBg   : t.bgCard,
        border:       `1px solid ${alert ? t.alertBorder : hov ? t.borderHov : t.border}`,
        borderRadius: 14,
        padding:      20,
        transform:    hov ? "scale(1.02)" : "scale(1)",
        boxShadow:    hov ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
        transition:   "all 0.2s",
        cursor:       onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const SellerDashboard = () => {
  const navigate = useNavigate();
  const user     = useSelector((s) => s.auth.user);

  // ── Pull theme from context — no props needed ────────────────────────────
  const { dark, t } = useTheme();

  const [shop,    setShop]    = useState(null);
  const [stats,   setStats]   = useState({ totalMedicines:0, totalStock:0, lowStock:[], topSelling:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchShop(); }, []);

  const fetchShop = async () => {
    try {
      const res = await fetch(`${BASE}/seller/shop`, { credentials:"include" });
      if (res.ok) {
        const data = await res.json();
        setShop(data);
        fetchStats(data.shopId);
      } else setShop(null);
    } catch { setShop(null); }
    finally   { setLoading(false); }
  };

  const fetchStats = async (shopId) => {
    try {
      const [lowRes, topRes, medsRes] = await Promise.all([
        fetch(`${BASE}/seller/shop/${shopId}/analytics/low-stock?threshold=10`, { credentials:"include" }),
        fetch(`${BASE}/seller/shop/${shopId}/analytics/top-selling`,            { credentials:"include" }),
        fetch(`${BASE}/seller/shop/${shopId}/medicines?pageSize=100`,           { credentials:"include" }),
      ]);
      const low      = await lowRes.json();
      const top      = await topRes.json();
      const meds     = await medsRes.json();
      const allMeds  = meds.content || [];
      const totalStock = allMeds.reduce((s, m) => s + (m.quantity || 0), 0);
      setStats({ totalMedicines:allMeds.length, totalStock, lowStock:low||[], topSelling:top||[] });
    } catch (err) { console.error(err); }
  };

  // ── Loading spinner ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:t.bg }}>
      <div style={{
        width:48, height:48, borderRadius:"50%",
        border:`4px solid ${t.spinnerBorder}`,
        borderTopColor:"transparent",
        animation:"sd-spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes sd-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Shared text styles ─────────────────────────────────────────────────────
  const label = { fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:6 };
  const val   = { fontFamily:"'DM Sans',sans-serif", fontSize:34, fontWeight:800, lineHeight:1, color:t.text };

  return (
    <div style={{
      minHeight:  "100vh",
      padding:    "112px 8vw 80px",
      background: t.bg,
      color:      t.text,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.3s, color 0.3s",
    }}>

      {/* ── HEADER ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:800, margin:0, color:t.text }}>
            Welcome back,{" "}
            <span style={{ color:t.accent }}>{user?.username}</span>
          </h1>
          <p style={{ color:t.textMuted, marginTop:6, fontSize:15, marginBottom:0 }}>
            Manage your pharmacy dashboard
          </p>
        </div>

        {/* Shop status pill */}
        {shop && (
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            padding:"8px 16px", borderRadius:10,
            background:t.bgCard, border:`1px solid ${t.border}`, fontSize:14,
            color:t.text,
          }}>
            <span style={{
              width:8, height:8, borderRadius:"50%", display:"inline-block",
              background:  shop.isOpen ? t.accent : "#ef4444",
              boxShadow:   shop.isOpen ? `0 0 0 3px ${t.blueBg}` : "none",
            }} />
            {shop.isOpen ? "Open" : "Closed"}
          </div>
        )}
      </div>

      {/* ── NO SHOP STATE ── */}
      {!shop && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"96px 0", gap:24 }}>
          <MdOutlineLocalPharmacy style={{ fontSize:72, color:t.textMuted }} />
          <h2 style={{ color:t.textMuted, fontWeight:500, margin:0 }}>No shop found</h2>
          <button style={{
            padding:"12px 28px", borderRadius:10,
            background:t.accent, color:"#fff",
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15,
            border:"none", cursor:"pointer",
          }}>Create Shop</button>
        </div>
      )}

      {/* ── DASHBOARD CONTENT ── */}
      {shop && (
        <>
          {/* STAT CARDS */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:32 }}>
            {[
              { icon:FiPackage,       label:"Medicines",   value:stats.totalMedicines   },
              { icon:FiBarChart2,     label:"Stock",       value:stats.totalStock       },
              { icon:FiAlertTriangle, label:"Low Stock",   value:stats.lowStock.length  },
              { icon:FiTrendingUp,    label:"Top Selling", value:stats.topSelling.length},
            ].map(({ icon:Icon, label:lbl, value }) => (
              <Card key={lbl} t={t}>
                <Icon style={{ fontSize:22, color:t.accent, marginBottom:10 }} />
                <div style={val}>{value}</div>
                <div style={label}>{lbl}</div>
              </Card>
            ))}
          </div>

          {/* ACTION CARDS */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:32 }}>
            {[
              { icon:FiPlusCircle,   label:"Add Medicine", path:"/seller/medicines" },
              { icon:FiShoppingCart, label:"Billing",      path:"/seller/billing"   },
              { icon:FiBarChart2,    label:"Analytics",    path:"/seller/analytics" },
              { icon:FiEdit3,        label:"Edit Shop",    path:null                },
            ].map(({ icon:Icon, label:lbl, path }) => (
              <Card key={lbl} t={t} onClick={() => path && navigate(path)} style={{ cursor:"pointer" }}>
                <Icon style={{ fontSize:20, color:t.accent2, marginBottom:8 }} />
                <div style={{ fontSize:14, fontWeight:600, color:t.text }}>{lbl}</div>
              </Card>
            ))}
          </div>

          {/* LOW STOCK ALERT */}
          {stats.lowStock.length > 0 && (
            <Card t={t} alert style={{ marginBottom:28 }}>
              <h3 style={{
                color:t.alertColor, fontWeight:700,
                margin:"0 0 16px",
                display:"flex", alignItems:"center", gap:8,
                fontFamily:"'DM Sans',sans-serif",
              }}>
                <FiAlertTriangle /> Low Stock Alert
              </h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
                {stats.lowStock.map((m) => (
                  <div key={m.medicineId} style={{
                    padding:"10px 14px", borderRadius:10,
                    background:t.bgCard, border:`1px solid ${t.alertBorder}`,
                  }}>
                    <p style={{ color:t.text, fontSize:14, margin:"0 0 4px", fontWeight:600 }}>{m.medicineName}</p>
                    <p style={{ color:t.alertColor, fontSize:12, margin:0 }}>Only {m.quantity} left</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TOP SELLING */}
          {stats.topSelling.length > 0 && (
            <Card t={t}>
              <h3 style={{
                color:t.accent, fontWeight:700,
                margin:"0 0 16px",
                display:"flex", alignItems:"center", gap:8,
                fontFamily:"'DM Sans',sans-serif",
              }}>
                <FiTrendingUp /> Top Selling
              </h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {stats.topSelling.map((m, i) => (
                  <div key={m.medicineId} style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"10px 14px", borderRadius:10,
                    background:t.bgAlt, border:`1px solid ${t.border}`,
                  }}>
                    <span style={{ fontSize:13, fontWeight:700, color:t.rankColor, minWidth:24 }}>#{i+1}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ color:t.text, fontSize:14, fontWeight:600, margin:"0 0 2px" }}>{m.medicineName}</p>
                      <p style={{ color:t.textMuted, fontSize:12, margin:0 }}>₹{m.specialPrice}</p>
                    </div>
                    <span style={{
                      fontSize:11, fontWeight:700,
                      padding:"4px 10px", borderRadius:20,
                      background:t.badgeBg, color:t.badgeText,
                    }}>
                      {m.salesCount} sold
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SellerDashboard;