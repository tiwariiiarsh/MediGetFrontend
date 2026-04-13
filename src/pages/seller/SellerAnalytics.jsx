// src/pages/seller/SellerAnalytics.jsx

import { useEffect, useState } from "react";
import {
  FiTrendingUp, FiTrendingDown, FiAlertTriangle,
  FiDollarSign, FiBarChart2, FiPackage,
} from "react-icons/fi";
import { useTheme } from "../../components/ThemeContext";

const BASE = "http://localhost:8080/api";

const Panel = ({ children, t, style = {} }) => (
  <div style={{
    background:   t.bgCard,
    border:       `1px solid ${t.border}`,
    borderRadius: 18,
    padding:      "24px 22px",
    ...style,
  }}>
    {children}
  </div>
);

const PanelHead = ({ icon: Icon, label, color, t }) => (
  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:20 }}>
    <div style={{
      width:34, height:34, borderRadius:9,
      background: `${color}18`,
      border:     `1px solid ${color}30`,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <Icon style={{ color, fontSize:16 }} />
    </div>
    <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:t.text, margin:0 }}>{label}</p>
  </div>
);

// ── Extracted sub-components so hooks are called at the top level ──

const LeastSellingRow = ({ med, t, AMBER }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"12px 14px", borderRadius:11,
        background: hov ? t.bgCardHov : t.bgAlt,
        border:`1px solid ${hov ? AMBER + "50" : t.border}`,
        transition:"all 0.18s",
      }}>
      <div>
        <p style={{ fontSize:13, fontWeight:600, color:t.text, margin:"0 0 2px" }}>{med.medicineName}</p>
        <p style={{ fontSize:11, color:t.textMuted, margin:0 }}>Stock: {med.quantity} units</p>
      </div>
      <div style={{ textAlign:"right" }}>
        <p style={{ fontSize:13, fontWeight:700, color:AMBER, margin:"0 0 2px" }}>{med.salesCount} sold</p>
        <p style={{ fontSize:11, color:t.textMuted, margin:0 }}>₹{med.specialPrice}</p>
      </div>
    </div>
  );
};

const RevenueRow = ({ r, t, GREEN, BLUE }) => {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom:`1px solid ${t.border}`,
        background: hov ? t.bgCardHov : "transparent",
        transition:"background 0.15s",
      }}>
      <td style={{ padding:"10px 10px", color:t.text, fontWeight:500 }}>{r.medicineName}</td>
      <td style={{ padding:"10px 10px", textAlign:"right", color:GREEN, fontWeight:600 }}>{r.totalSold}</td>
      <td style={{ padding:"10px 10px", textAlign:"right", color:BLUE, fontWeight:700 }}>₹{r.revenue?.toFixed(2)}</td>
    </tr>
  );
};

// ── Main ──

const SellerAnalytics = () => {
  const { t } = useTheme();

  const [shopId,       setShopId]       = useState(null);
  const [topSelling,   setTopSelling]   = useState([]);
  const [leastSelling, setLeastSelling] = useState([]);
  const [revenue,      setRevenue]      = useState([]);
  const [lowStock,     setLowStock]     = useState([]);
  const [threshold,    setThreshold]    = useState(10);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    fetch(`${BASE}/seller/shop`, { credentials:"include" })
      .then(r => r.json())
      .then(s => setShopId(s.shopId));
  }, []);

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    Promise.all([
      fetch(`${BASE}/seller/shop/${shopId}/analytics/top-selling`,                      { credentials:"include" }).then(r=>r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/least-selling`,                    { credentials:"include" }).then(r=>r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/revenue`,                          { credentials:"include" }).then(r=>r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/low-stock?threshold=${threshold}`, { credentials:"include" }).then(r=>r.json()),
    ])
      .then(([top, least, rev, low]) => {
        setTopSelling(top   || []);
        setLeastSelling(least || []);
        setRevenue(rev      || []);
        setLowStock(low     || []);
      })
      .finally(() => setLoading(false));
  }, [shopId, threshold]);

  const maxSales     = Math.max(...topSelling.map(m => m.salesCount || 0), 1);
  const totalRevenue = revenue.reduce((s, r) => s + (r.revenue   || 0), 0);
  const totalSold    = revenue.reduce((s, r) => s + (r.totalSold || 0), 0);

  const GREEN = t.accent      || "#10b981";
  const BLUE  = t.blue        || "#2563eb";
  const AMBER = t.alertColor  || "#f59e0b";
  const CYAN  = t.accent2     || "#06b6d4";

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:t.bg }}>
      <div style={{ width:44, height:44, borderRadius:"50%", border:`4px solid ${t.accent}`, borderTopColor:"transparent", animation:"sa-spin 0.8s linear infinite" }} />
      <style>{`@keyframes sa-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight:  "100vh",
      padding:    "112px 8vw 80px",
      background: t.bg,
      color:      t.text,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.3s, color 0.3s",
    }}>
      <style>{`
        @keyframes sa-spin { to { transform: rotate(360deg); } }
        @keyframes sa-bar  { from { width: 0% } }
      `}</style>

      {/* PAGE HEADER */}
      <div style={{ marginBottom:40 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${GREEN}18`, border:`1px solid ${GREEN}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FiBarChart2 style={{ color:GREEN, fontSize:22 }} />
          </div>
          <div>
            <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"clamp(1.6rem,3.5vw,2.2rem)", margin:0, letterSpacing:"-0.03em" }}>Analytics</h1>
            <p style={{ color:t.textMuted, fontSize:13, margin:0 }}>Sales performance & inventory insights</p>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginTop:24 }}>
          {[
            { icon:FiTrendingUp,    label:"Top Sellers",     value:topSelling.length,            color:GREEN },
            { icon:FiDollarSign,    label:"Total Revenue",   value:`₹${totalRevenue.toFixed(0)}`, color:BLUE  },
            { icon:FiPackage,       label:"Units Sold",      value:totalSold,                     color:CYAN  },
            { icon:FiAlertTriangle, label:"Low Stock Items", value:lowStock.length,               color:AMBER },
          ].map(({ icon:Icon, label, value, color }) => (
            <div key={label} style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:14, padding:"16px 18px" }}>
              <Icon style={{ color, fontSize:18, marginBottom:8 }} />
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:24, color:t.text, lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:11, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", marginTop:5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:18 }}>

        {/* TOP SELLING */}
        <Panel t={t}>
          <PanelHead icon={FiTrendingUp} label="Top Selling Medicines" color={GREEN} t={t} />
          {topSelling.length === 0 && <p style={{ color:t.textMuted, fontSize:13, textAlign:"center", padding:"24px 0" }}>No data yet.</p>}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {topSelling.map((med, i) => (
              <div key={med.medicineId}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{
                      width:22, height:22, borderRadius:6,
                      background: i < 3 ? `${GREEN}20` : t.bgAlt,
                      color:      i < 3 ? GREEN : t.textMuted,
                      fontSize:10, fontWeight:800,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>#{i+1}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{med.medicineName}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:11, color:t.textMuted }}>₹{med.specialPrice}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:GREEN, background:`${GREEN}18`, padding:"2px 8px", borderRadius:20 }}>{med.salesCount} sold</span>
                  </div>
                </div>
                <div style={{ height:5, background:t.bgAlt, borderRadius:99, overflow:"hidden" }}>
                  <div style={{
                    height:"100%",
                    width:`${(med.salesCount / maxSales) * 100}%`,
                    background: GREEN, borderRadius:99,
                    animation:"sa-bar 0.8s ease both",
                    animationDelay:`${i * 80}ms`,
                    opacity: 0.85,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* LEAST SELLING */}
        <Panel t={t}>
          <PanelHead icon={FiTrendingDown} label="Least Selling Medicines" color={AMBER} t={t} />
          <p style={{ fontSize:12, color:t.textMuted, marginTop:-12, marginBottom:16 }}>
            Consider promotions or restocking decisions for these items.
          </p>
          {leastSelling.length === 0 && <p style={{ color:t.textMuted, fontSize:13, textAlign:"center", padding:"24px 0" }}>No data yet.</p>}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {leastSelling.map((med) => (
              <LeastSellingRow key={med.medicineId} med={med} t={t} AMBER={AMBER} />
            ))}
          </div>
        </Panel>

        {/* REVENUE TABLE */}
        <Panel t={t}>
          <PanelHead icon={FiDollarSign} label="Revenue Breakdown" color={BLUE} t={t} />
          <p style={{ fontSize:12, color:t.textMuted, marginTop:-12, marginBottom:16 }}>
            Total: <strong style={{ color:BLUE }}>₹{totalRevenue.toFixed(2)}</strong> across {revenue.length} medicines
          </p>
          {revenue.length === 0 && <p style={{ color:t.textMuted, fontSize:13, textAlign:"center", padding:"24px 0" }}>No revenue data yet.</p>}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${t.border}` }}>
                  {["Medicine","Sold","Revenue"].map(h => (
                    <th key={h} style={{
                      padding:"8px 10px",
                      textAlign: h === "Medicine" ? "left" : "right",
                      fontSize:11, fontWeight:700,
                      color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {revenue.map((r, i) => (
                  <RevenueRow key={i} r={r} t={t} GREEN={GREEN} BLUE={BLUE} />
                ))}
              </tbody>
              {revenue.length > 0 && (
                <tfoot>
                  <tr style={{ borderTop:`2px solid ${t.border}` }}>
                    <td style={{ padding:"10px 10px", fontWeight:700, color:t.text, fontSize:12 }}>TOTAL</td>
                    <td style={{ padding:"10px 10px", textAlign:"right", color:GREEN, fontWeight:700 }}>{totalSold}</td>
                    <td style={{ padding:"10px 10px", textAlign:"right", color:BLUE, fontWeight:800, fontSize:14 }}>₹{totalRevenue.toFixed(2)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Panel>

        {/* LOW STOCK */}
        <Panel t={t} style={{ background:t.alertBg, border:`1px solid ${t.alertBorder}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <PanelHead icon={FiAlertTriangle} label="Low Stock Alert" color={AMBER} t={t} />
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <label style={{ fontSize:10, color:t.textMuted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em" }}>Threshold</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                style={{
                  width:60, textAlign:"center",
                  padding:"6px 10px", borderRadius:8,
                  background:t.bgCard, border:`1px solid ${t.alertBorder}`,
                  color:t.text, fontSize:13, fontWeight:700,
                  outline:"none", fontFamily:"'DM Sans',sans-serif",
                }}
              />
            </div>
          </div>
          {lowStock.length === 0 ? (
            <div style={{ textAlign:"center", padding:"28px 0" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
              <p style={{ color:t.textMuted, fontSize:13, fontWeight:600 }}>All medicines are well-stocked!</p>
              <p style={{ color:t.textMuted, fontSize:12 }}>No items below threshold of {threshold}</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize:12, color:AMBER, marginBottom:14, fontWeight:600 }}>
                ⚠ {lowStock.length} medicine{lowStock.length > 1 ? "s" : ""} need restocking
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10 }}>
                {lowStock.map((med) => (
                  <div key={med.medicineId} style={{ padding:"12px 14px", borderRadius:11, background:t.bgCard, border:`1px solid ${t.alertBorder}` }}>
                    <p style={{ color:t.text, fontSize:13, fontWeight:700, margin:"0 0 4px" }}>{med.medicineName}</p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <p style={{ color:AMBER, fontSize:12, margin:0, fontWeight:600 }}>{med.quantity} left</p>
                      {med.quantity === 0 && (
                        <span style={{ fontSize:10, fontWeight:700, color:"#ef4444", background:"rgba(239,68,68,0.1)", padding:"2px 7px", borderRadius:20 }}>OUT</span>
                      )}
                    </div>
                    <div style={{ marginTop:8, height:3, background:t.bgAlt, borderRadius:99, overflow:"hidden" }}>
                      <div style={{
                        height:"100%",
                        width:`${Math.min((med.quantity / threshold) * 100, 100)}%`,
                        background: med.quantity === 0 ? "#ef4444" : AMBER,
                        borderRadius:99,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>

      </div>
    </div>
  );
};

export default SellerAnalytics;