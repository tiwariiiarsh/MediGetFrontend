// src/pages/ShopDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch, FiArrowLeft, FiExternalLink, FiPackage } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import { useTheme } from "../components/ThemeContext";
import mediGet1 from "../assets/mediget1.jpg";

// ─── Stock badge styles ───────────────────────────────────────────────────────
const stockStyle = (qty, dark) => {
  if (qty > 50) return {
    background: dark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.07)",
    color:      dark ? "#3b82f6" : "#1d4ed8",
    border:     `1px solid ${dark ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.2)"}`,
  };
  if (qty > 10) return {
    background: dark ? "rgba(245,158,11,0.1)" : "#fffbeb",
    color:      dark ? "#fbbf24" : "#b45309",
    border:     `1px solid ${dark ? "rgba(245,158,11,0.25)" : "#fcd34d"}`,
  };
  return {
    background: dark ? "rgba(239,68,68,0.1)" : "#fef2f2",
    color:      dark ? "#f87171" : "#b91c1c",
    border:     `1px solid ${dark ? "rgba(239,68,68,0.25)" : "#fecaca"}`,
  };
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ShopDetails = () => {
  const { shopId } = useParams();
  const navigate   = useNavigate();
  const { dark, t } = useTheme();

  const [shop,        setShop]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm,  setSearchTerm]  = useState("");
  const medicinesPerPage = 8;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/public/shop/${shopId}`);
        if (!res.ok) throw new Error();
        setShop(await res.json());
      } catch { setShop(null); }
      finally { setLoading(false); }
    })();
  }, [shopId]);

  const getDirections = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${shop.latitude},${shop.longitude}&travelmode=driving`,
        "_blank"
      ),
      () => alert("Please allow location access")
    );
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .3s" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${t.border}`, borderTopColor: t.blue, animation: "spin .75s linear infinite" }} />
    </div>
  );

  // ─── Not found ──────────────────────────────────────────────────────────────
  if (!shop) return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: t.textMuted, fontFamily: "system-ui,-apple-system,sans-serif", transition: "background .3s" }}>
      <p style={{ fontSize: 20, fontWeight: 700, color: t.text }}>Shop not found</p>
      <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", borderRadius: 12, background: t.blue, color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14 }}>
        ← Go Back
      </button>
    </div>
  );

  const filteredMeds = shop.medicines?.filter(m =>
    m.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const totalPages   = Math.ceil(filteredMeds.length / medicinesPerPage);
  const currentMeds  = filteredMeds.slice((currentPage - 1) * medicinesPerPage, currentPage * medicinesPerPage);
  const totalInStock = shop.medicines?.filter(m => m.quantity > 0).length ?? 0;
  const isOpen       = shop.isOpen;

  const s = {
    page: {
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      padding: "7rem 8vw 5rem",
      fontFamily: "system-ui,-apple-system,sans-serif",
      transition: "background .3s,color .3s",
    },
    btnPrimary: {
      display: "flex", alignItems: "center", gap: 8,
      padding: "12px 22px", borderRadius: 12,
      background: t.blue, color: "#fff",
      fontWeight: 700, fontSize: 14,
      border: "none", cursor: "pointer",
      transition: "background .2s, transform .15s",
      boxShadow: `0 2px 12px ${dark ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.2)"}`,
    },
    btnGhost: {
      display: "flex", alignItems: "center", gap: 8,
      padding: "12px 20px", borderRadius: 12,
      background: "transparent",
      border: `1px solid ${t.border}`,
      color: t.textMuted,
      fontWeight: 500, fontSize: 14,
      cursor: "pointer",
      transition: "all .2s",
    },
    statCard: {
      background: dark ? "rgba(37,99,235,0.07)" : "rgba(37,99,235,0.04)",
      border: `1px solid ${t.blueBorder}`,
      borderRadius: 12,
      padding: "10px 22px",
      textAlign: "center",
    },
    inputBase: {
      paddingLeft: 40,
      paddingRight: 16,
      paddingTop: 11,
      paddingBottom: 11,
      borderRadius: 12,
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      color: t.text,
      fontSize: 14,
      outline: "none",
      boxSizing: "border-box",
      transition: "border .2s, box-shadow .2s",
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 },
    pagRow: { display: "flex", justifyContent: "center", marginTop: "2.5rem", gap: 8, flexWrap: "wrap" },
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes cardGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
          50%      { box-shadow: 0 0 0 4px rgba(37,99,235,0.15); }
        }
        .med-card-hover { animation: cardGlow 1.6s ease infinite; }
        input::placeholder { color: ${t.textMuted}; }
      `}</style>

      {/* ── BACK BUTTON ── */}
      <button
        onClick={() => navigate(-1)}
        style={{ ...s.btnGhost, marginBottom: "2rem", fontSize: 13 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.color = t.blue; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
      >
        <FiArrowLeft size={15} /> Back to Medicines
      </button>

      {/* ── SHOP HERO CARD ── */}
      {/* Key fix: position:relative on wrapper, absolute-fill on image side */}
      <div style={{
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: "2.5rem",
        boxShadow: dark ? "0 4px 40px rgba(0,0,0,.55)" : "0 4px 24px rgba(37,99,235,.07)",
        display: "flex",          // ← flex not grid, so both sides stretch to same height
        flexDirection: "row",
        flexWrap: "wrap",
        position: "relative",
      }}>

        {/* Top accent bar spanning full width */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${t.blue}, ${t.blueLight}, ${t.blue})`,
          zIndex: 2,
        }} />

        {/* Left: info panel */}
        <div style={{
          flex: "1 1 300px",
          padding: "44px 40px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 1,
        }}>
          {/* Open / Closed badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
            background: isOpen
              ? (dark ? "rgba(34,197,94,0.1)" : "#f0fdf4")
              : (dark ? "rgba(239,68,68,0.1)" : "#fef2f2"),
            border: `1px solid ${isOpen
              ? (dark ? "rgba(34,197,94,0.3)" : "#bbf7d0")
              : (dark ? "rgba(239,68,68,0.3)" : "#fecaca")}`,
            borderRadius: 20, padding: "5px 14px", width: "fit-content",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", display: "block", flexShrink: 0,
              background: isOpen ? "#22c55e" : "#ef4444",
              animation: isOpen ? "pulse 2s infinite" : "none",
            }} />
            <span style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
              color: isOpen
                ? (dark ? "#4ade80" : "#15803d")
                : (dark ? "#f87171" : "#b91c1c"),
            }}>
              {isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(1.5rem,3.5vw,2.2rem)", fontWeight: 800, color: t.text, margin: "0 0 16px", lineHeight: 1.15 }}>
            {shop.shopName}
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, color: t.textMuted, marginBottom: 24 }}>
            {shop.buildingName && <span>🏢 {shop.buildingName}</span>}
            <span>📍 {shop.street}, {shop.city}</span>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{shop.state}, {shop.country} — {shop.pincode}</span>
          </div>

          <div style={{ borderTop: `1px dashed ${t.border}`, marginBottom: 20 }} />

          {/* Stat pills */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Total Medicines", value: shop.medicines?.length ?? 0 },
              { label: "In Stock",        value: totalInStock },
            ].map(st => (
              <div key={st.label} style={s.statCard}>
                <p style={{ fontSize: 24, fontWeight: 800, color: t.blue, margin: 0 }}>{st.value}</p>
                <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em" }}>{st.label}</p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              style={s.btnPrimary}
              onClick={getDirections}
              onMouseEnter={e => { e.currentTarget.style.background = t.blueLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = t.blue; e.currentTarget.style.transform = "none"; }}
            >
              <MdDirectionsCar size={18} /> Get Directions
            </button>
            {shop.latitude && shop.longitude && (
              <button
                style={s.btnGhost}
                onClick={() => window.open(`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`, "_blank")}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.color = t.blue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
              >
                <FiExternalLink size={15} /> View on Map
              </button>
            )}
          </div>
        </div>

        {/* Right: image — flex:1 so it stretches to match left panel height */}
        <div style={{
          flex: "1 1 300px",
          minHeight: 360,
          position: "relative",
          overflow: "hidden",
          background: t.inputBg,
        }}>
          <img
            src={shop.image ? `http://localhost:8080/images/${shop.image}` : mediGet1}
            alt={shop.shopName}
            style={{
              position: "absolute",   // ← absolute fill: always covers entire div
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",     // ← fills without stretching/distorting
              objectPosition: "center",
              display: "block",
            }}
            onError={e => { e.target.src = mediGet1; }}
          />
          {/* left fade for seamless join */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 48, zIndex: 1,
            background: `linear-gradient(to right, ${t.bgCard}, transparent)`,
          }} />
        </div>
      </div>

      {/* ── MEDICINES HEADER ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: t.text, margin: 0 }}>Available Medicines</h2>
          <p style={{ fontSize: 13, color: t.textMuted, margin: "4px 0 0" }}>{filteredMeds.length} items found</p>
        </div>
        <div style={{ position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: t.textMuted, width: 15, height: 15, pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search in this shop..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ ...s.inputBase, width: 260, paddingLeft: 40 }}
            onFocus={e => { e.target.style.borderColor = t.blue; e.target.style.boxShadow = `0 0 0 3px ${t.blueBg}`; }}
            onBlur={e  => { e.target.style.borderColor = t.border; e.target.style.boxShadow = "none"; }}
          />
        </div>
      </div>

      <div style={{ height: 1, background: t.border, marginBottom: 22, opacity: 0.5 }} />

      {/* ── MEDICINE GRID ── */}
      {currentMeds.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: t.textMuted, fontSize: 14 }}>
          No medicines match your search.
        </div>
      ) : (
        <div style={s.grid}>
          {currentMeds.map(med => (
            <ShopMedCard key={med.medicineId} med={med} t={t} dark={dark} />
          ))}
        </div>
      )}

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div style={s.pagRow}>
          <PagBtn disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} t={t} dark={dark}>← Prev</PagBtn>
          {[...Array(totalPages)].map((_, i) => (
            <PagBtn key={i} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)} t={t} dark={dark}>{i + 1}</PagBtn>
          ))}
          <PagBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} t={t} dark={dark}>Next →</PagBtn>
        </div>
      )}
    </div>
  );
};

// ─── Shop Medicine Card ────────────────────────────────────────────────────────
const ShopMedCard = ({ med, t, dark }) => {
  const [hov, setHov] = useState(false);
  const sk = stockStyle(med.quantity, dark);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={hov ? "med-card-hover" : ""}
      style={{
        background: t.bgCard,
        border: `2px solid ${hov ? t.blue : t.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "border-color .25s ease, transform .25s cubic-bezier(.34,1.56,.64,1)",
        transform: hov ? "translateY(-4px)" : "none",
        ...(hov ? {} : {
          boxShadow: dark ? "0 2px 10px rgba(0,0,0,.45)" : "0 1px 6px rgba(0,0,0,.05)",
        }),
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: 3,
        background: hov
          ? t.blue
          : `linear-gradient(90deg, transparent, ${t.blueBorder}, transparent)`,
        transition: "background .3s ease",
        flexShrink: 0,
      }} />

      {/* Image */}
      <div style={{ position: "relative", height: 150, overflow: "hidden", background: t.inputBg }}>
        <img
          src={med.image ? `http://localhost:8080/images/${med.image}` : mediGet1}
          alt={med.medicineName}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform .4s ease",
            transform: hov ? "scale(1.07)" : "scale(1)",
          }}
          onError={e => { e.target.src = mediGet1; }}
        />
        {med.discount > 0 && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            background: t.blue, color: "#fff",
            fontSize: 10, fontWeight: 800,
            padding: "3px 9px", borderRadius: 16,
            boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
          }}>
            {med.discount}% OFF
          </span>
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 24,
          background: `linear-gradient(to top, ${t.bgCard}, transparent)`,
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: t.blue, margin: "0 0 3px", lineHeight: 1.3 }}>
          {med.medicineName}
        </p>
        <p style={{
          fontSize: 11, color: t.textMuted, margin: "0 0 10px",
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.5,
        }}>
          {med.description}
        </p>

        <div style={{ borderTop: `1px dashed ${t.border}`, marginBottom: 10 }} />

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>
            ₹{med.specialPrice?.toFixed(2)}
          </span>
          {med.price !== med.specialPrice && (
            <span style={{ fontSize: 11, color: t.textFaint, textDecoration: "line-through" }}>
              ₹{med.price}
            </span>
          )}
        </div>

        <div style={{ borderTop: `1px solid ${t.border}`, marginBottom: 10, opacity: 0.5 }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          borderRadius: 7, padding: "3px 9px",
          fontSize: 11, fontWeight: 700,
          width: "fit-content",
          marginBottom: med.expiryDate ? 8 : 0,
          ...sk,
        }}>
          <FiPackage size={11} /> Stock: {med.quantity}
        </div>

        {med.expiryDate && (
          <p style={{ fontSize: 11, color: t.textMuted, margin: "4px 0 0" }}>
            Exp: {new Date(med.expiryDate).toLocaleDateString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Pagination Button ─────────────────────────────────────────────────────────
const PagBtn = ({ children, active, disabled, onClick, t, dark }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    style={{
      padding: "8px 16px", borderRadius: 10, fontSize: 13,
      fontWeight: active ? 700 : 500,
      cursor: disabled ? "not-allowed" : "pointer",
      background: active ? t.blue : t.bgCard,
      color: active ? "#fff" : t.textMuted,
      border: `1px solid ${active ? t.blue : t.border}`,
      opacity: disabled ? 0.35 : 1,
      transition: "all .18s",
      boxShadow: active
        ? `0 2px 8px ${dark ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.2)"}`
        : "none",
    }}
  >
    {children}
  </button>
);

export default ShopDetails;