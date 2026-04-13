// src/pages/Medicines.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiMapPin, FiRefreshCw,
  FiAlertCircle, FiPackage, FiCrosshair,
} from "react-icons/fi";
import { RiMedicineBottleLine } from "react-icons/ri";
import { useTheme } from "../components/ThemeContext";
import AlternativesMedicineModal from "../components/AlternativesMedicineModal";
import vitaminc from "../assets/vitamin c.jpeg";

// ─── Stock badge styles using theme tokens ────────────────────────────────────
const stockStyle = (qty, t, dark) => {
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
const Medicines = () => {
  const navigate = useNavigate();
  const { dark, t } = useTheme();

  const [medicines,     setMedicines]    = useState([]);
  const [page,          setPage]         = useState(0);
  const [totalPages,    setTotalPages]   = useState(0);
  const [loading,       setLoading]      = useState(false);
  const [keyword,       setKeyword]      = useState("");
  const [radius,        setRadius]       = useState(5);
  const [isSearching,   setIsSearching]  = useState(false);
  const [userLocation,  setUserLocation] = useState(null);
  const [locationError, setLocationError]= useState("");
  const [selectedMed,   setSelectedMed]  = useState(null);
  const [showAlt,       setShowAlt]      = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) { setLocationError("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()    => setLocationError("Location permission denied.")
    );
  }, []);

  const fetchMedicines = async (pageNumber = 0) => {
    try {
      setLoading(true); setIsSearching(false);
      const res  = await fetch(`http://localhost:8080/api/public/medicines?pageNumber=${pageNumber}&pageSize=12`);
      const data = await res.json();
      setMedicines(data.content || []); setTotalPages(data.totalPages || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!userLocation) { alert("Please enable location."); return; }
    try {
      setLoading(true); setIsSearching(true); setPage(0);
      const res  = await fetch(`http://localhost:8080/api/public/medicines/nearby?keyword=${keyword}&userLat=${userLocation.lat}&userLng=${userLocation.lng}&radiusKm=${radius}`);
      const data = await res.json();
      setMedicines(Array.isArray(data) ? data : []); setTotalPages(0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setKeyword(""); setRadius(5); setIsSearching(false); setPage(0); fetchMedicines(0);
  };

  useEffect(() => { if (!isSearching) fetchMedicines(page); }, [page]);

  // ─── Styles derived from live t tokens ─────────────────────────────────────
  const s = {
    page: {
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      padding: "8rem 8vw 5rem",
      transition: "background 0.3s, color 0.3s",
    },
    panel: {
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      borderRadius: 20,
      padding: "20px 22px",
      marginBottom: "2.5rem",
      boxShadow: dark
        ? "0 4px 32px rgba(0,0,0,0.55)"
        : "0 2px 16px rgba(0,0,0,0.06)",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      paddingLeft: 42,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
      borderRadius: 12,
      background: t.inputBg,
      border: `1px solid ${t.border}`,
      color: t.text,
      fontSize: 14,
      outline: "none",
      transition: "border 0.2s, box-shadow 0.2s",
    },
    btnPrimary: {
      padding: "12px 28px",
      borderRadius: 12,
      background: t.blue,
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      border: "none",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background 0.2s, transform 0.15s",
      boxShadow: `0 2px 12px ${dark ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.2)"}`,
    },
    btnGhost: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 20px",
      borderRadius: 12,
      background: "transparent",
      border: `1px solid ${t.border}`,
      color: t.textMuted,
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "all 0.2s",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
      gap: 20,
    },
    pagRow: {
      display: "flex",
      justifyContent: "center",
      marginTop: "3rem",
      gap: 8,
      flexWrap: "wrap",
    },
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cardGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
          50%      { box-shadow: 0 0 0 4px rgba(37,99,235,0.15); }
        }
        .med-card-hover { animation: cardGlow 1.6s ease infinite; }
        input::placeholder { color: ${t.textMuted}; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
          <div style={{ width: 3, height: 22, background: t.blue, borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: t.blue }}>
            MediFind
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, color: t.text, margin: 0, lineHeight: 1.1 }}>
          Find Medicines
        </h1>
        <p style={{ color: t.textMuted, marginTop: 8, fontSize: 15 }}>
          Search nearby pharmacies with live stock &amp; location data
        </p>
      </div>

      {/* ── LOCATION BANNERS ── */}
      {locationError && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: dark ? "rgba(239,68,68,0.1)" : "#fef2f2",
          border: `1px solid ${dark ? "rgba(239,68,68,0.25)" : "#fecaca"}`,
          borderRadius: 12, padding: "12px 18px", marginBottom: 14,
          color: dark ? "#f87171" : "#b91c1c", fontSize: 13,
        }}>
          <FiAlertCircle size={15} /> {locationError}
        </div>
      )}
      {userLocation && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.blue, fontSize: 13, marginBottom: 20, fontWeight: 500 }}>
          <FiCrosshair size={14} /> Location detected — ready to search nearby pharmacies
        </div>
      )}

      {/* ── SEARCH PANEL ── */}
      <div style={s.panel}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>

          {/* keyword */}
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <FiSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }} size={15} />
            <input
              type="text"
              placeholder="Search medicine name..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              style={s.input}
              onFocus={e => { e.target.style.borderColor = t.blue; e.target.style.boxShadow = `0 0 0 3px ${t.blueBg}`; }}
              onBlur={e  => { e.target.style.borderColor = t.border; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* radius */}
          <div style={{ position: "relative", flex: "0 0 148px" }}>
            <FiMapPin style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }} size={15} />
            <input
              type="number"
              placeholder="Radius km"
              value={radius}
              onChange={e => setRadius(e.target.value)}
              style={s.input}
              onFocus={e => { e.target.style.borderColor = t.blue; e.target.style.boxShadow = `0 0 0 3px ${t.blueBg}`; }}
              onBlur={e  => { e.target.style.borderColor = t.border; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <button
            style={s.btnPrimary}
            onClick={handleSearch}
            onMouseEnter={e => { e.currentTarget.style.background = t.blueLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.blue; e.currentTarget.style.transform = "none"; }}
          >
            Search Nearby
          </button>

          <button
            style={s.btnGhost}
            onClick={handleReset}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
          >
            <FiRefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 16 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            border: `3px solid ${t.border}`,
            borderTopColor: t.blue,
            animation: "spin .75s linear infinite",
          }} />
          <span style={{ color: t.textMuted, fontSize: 14 }}>Loading medicines...</span>
        </div>
      ) : medicines.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 12, color: t.textMuted }}>
          <RiMedicineBottleLine size={56} style={{ opacity: 0.25 }} />
          <p style={{ fontSize: 15 }}>No medicines found. Try a different keyword or radius.</p>
        </div>
      ) : (
        <>
          <div style={s.grid}>
            {medicines.map(med => (
              <MedicineCard
                key={med.medicineId}
                med={med}
                dark={dark}
                t={t}
                onViewShop={() => med.shopId ? navigate(`/shop/${med.shopId}`) : alert("Shop ID not available")}
                onAlternatives={() => { setSelectedMed(med); setShowAlt(true); }}
              />
            ))}
          </div>

          {!isSearching && totalPages > 1 && (
            <div style={s.pagRow}>
              <PagBtn disabled={page === 0} onClick={() => setPage(p => p - 1)} t={t} dark={dark}>← Prev</PagBtn>
              {[...Array(Math.min(totalPages, 7))].map((_, i) => (
                <PagBtn key={i} active={page === i} onClick={() => setPage(i)} t={t} dark={dark}>{i + 1}</PagBtn>
              ))}
              <PagBtn disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} t={t} dark={dark}>Next →</PagBtn>
            </div>
          )}
        </>
      )}

      {showAlt && selectedMed && (
        <AlternativesMedicineModal
          medicine={selectedMed}
          userLocation={userLocation}
          onClose={() => setShowAlt(false)}
          onViewShop={id => navigate(`/shop/${id}`)}
        />
      )}
    </div>
  );
};

// ─── Medicine Card ─────────────────────────────────────────────────────────────
const MedicineCard = ({ med, dark, t, onViewShop, onAlternatives }) => {
  const [hov, setHov] = useState(false);
  const sk = stockStyle(med.quantity, t, dark);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={hov ? "med-card-hover" : ""}
      style={{
        background: t.bgCard,
        border: `2px solid ${hov ? t.blue : t.border}`,
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.25s ease, transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease",
        transform: hov ? "translateY(-5px)" : "none",
        // box-shadow handled by cardGlow animation when hov, otherwise static
        ...(hov ? {} : {
          boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.5)" : "0 2px 10px rgba(0,0,0,0.06)",
        }),
      }}
    >
      {/* ── Top accent bar (visual card separator) ── */}
      <div style={{
        height: 3,
        flexShrink: 0,
        background: hov
          ? t.blue
          : `linear-gradient(90deg, transparent, ${t.blueBorder}, transparent)`,
        transition: "background 0.3s ease",
      }} />

      {/* ── Image ── */}
      <div style={{ position: "relative", height: 170, overflow: "hidden", background: t.inputBg, flexShrink: 0 }}>
        <img
          src={med.image || vitaminc}
          alt={med.medicineName}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.45s ease",
            transform: hov ? "scale(1.08)" : "scale(1)",
          }}
          onError={e => { e.target.src = vitaminc; }}
        />
        {med.discount > 0 && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            background: t.blue, color: "#fff",
            fontSize: 11, fontWeight: 800,
            padding: "4px 11px", borderRadius: 20,
            boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
          }}>
            {med.discount}% OFF
          </span>
        )}
        {/* bottom fade for seamless card body join */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 28,
          background: `linear-gradient(to top, ${t.bgCard}, transparent)`,
        }} />
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Name */}
        <p style={{ fontSize: 13, fontWeight: 800, color: t.blue, margin: "0 0 4px", lineHeight: 1.3 }}>
          {med.medicineName}
        </p>

        {/* Description */}
        <p style={{
          fontSize: 12, color: t.textMuted, margin: "0 0 12px", lineHeight: 1.5,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {med.description}
        </p>

        {/* ── separator: dashed ── */}
        <div style={{ borderTop: `1px dashed ${t.border}`, marginBottom: 12 }} />

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: t.text }}>
            ₹{med.specialPrice?.toFixed(2)}
          </span>
          {med.price !== med.specialPrice && (
            <span style={{ fontSize: 12, color: t.textFaint, textDecoration: "line-through" }}>
              ₹{med.price}
            </span>
          )}
        </div>

        {/* Shop info */}
        <div style={{ fontSize: 12, color: t.textMuted, display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
          {med.shopName  && <span>🏥 {med.shopName}</span>}
          {med.shopCity  && <span>📍 {med.shopCity}</span>}
          {med.distance != null && (
            <span style={{ color: t.blue, fontWeight: 600 }}>
              🚗 {med.distance.toFixed(1)} km away
            </span>
          )}
        </div>

        {/* ── separator: solid thin ── */}
        <div style={{ borderTop: `1px solid ${t.border}`, marginBottom: 12, opacity: 0.5 }} />

        {/* Stock badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          borderRadius: 8, padding: "4px 10px",
          fontSize: 11, fontWeight: 700,
          width: "fit-content", marginBottom: 14,
          ...sk,
        }}>
          <FiPackage size={11} /> Stock: {med.quantity ?? "N/A"}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
          <button
            onClick={onViewShop}
            style={{
              padding: "11px 0", borderRadius: 11,
              background: t.blue, color: "#fff",
              fontWeight: 700, fontSize: 13,
              border: "none", cursor: "pointer",
              transition: "background 0.2s, transform 0.15s",
              boxShadow: `0 2px 10px ${dark ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.18)"}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = t.blueLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.blue; e.currentTarget.style.transform = "none"; }}
          >
            View Shop
          </button>
          <button
            onClick={onAlternatives}
            style={{
              padding: "10px 0", borderRadius: 11,
              background: "transparent", color: t.textMuted,
              fontWeight: 500, fontSize: 13,
              border: `1px solid ${t.border}`, cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.color = t.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
          >
            View Alternatives
          </button>
        </div>
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
      padding: "8px 16px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      cursor: disabled ? "not-allowed" : "pointer",
      background: active ? t.blue : t.bgCard,
      color: active ? "#fff" : t.textMuted,
      border: `1px solid ${active ? t.blue : t.border}`,
      opacity: disabled ? 0.35 : 1,
      transition: "all 0.18s",
      boxShadow: active
        ? `0 2px 8px ${dark ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.2)"}`
        : "none",
    }}
  >
    {children}
  </button>
);

export default Medicines;