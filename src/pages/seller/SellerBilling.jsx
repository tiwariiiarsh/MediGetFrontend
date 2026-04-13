// src/pages/seller/SellerBilling.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reads theme from ThemeContext. No Tailwind. Full dark/light support.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from "react";
import { FiSearch, FiTrash2, FiPrinter, FiCheckCircle, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { MdReceiptLong } from "react-icons/md";
import mediGet1 from "../../assets/mediget1.jpg";
import { useTheme } from "../../components/ThemeContext";

const BASE = "http://localhost:8080/api";

// ✅ Add this OUTSIDE SellerBilling component (at the top of the file)
const MedSearchItem = ({ med, onAdd, t, GREEN, mediGet1 }) => {
  const [hov, setHov] = useState(false);

  return (
    <div
      key={med.medicineId}
      onClick={() => onAdd(med)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "10px 14px", borderRadius: 12,
        background: hov ? t.bgCardHov : t.bgAlt,
        border: `1px solid ${hov ? GREEN + "50" : t.border}`,
        cursor: "pointer", transition: "all 0.18s",
      }}
    >
      <img
        src={med.image ? `http://localhost:8080/images/${med.image}` : mediGet1}
        alt={med.medicineName}
        onError={(e) => { e.target.src = mediGet1; }}
        style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: t.text, fontWeight: 600, fontSize: 13, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {med.medicineName}
        </p>
        <p style={{ color: t.textMuted, fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {med.description?.slice(0, 40)}...
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ color: GREEN, fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>₹{med.specialPrice?.toFixed(2)}</p>
        <p style={{ color: t.textMuted, fontSize: 11, margin: 0 }}>Stock: {med.quantity}</p>
      </div>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${GREEN}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <FiPlus style={{ color: GREEN, fontSize: 14 }} />
      </div>
    </div>
  );
};


const SellerBilling = () => {
  const { t, dark } = useTheme();

  const [shopId,      setShopId]      = useState(null);
  const [shopName,    setShopName]    = useState("");
  const [allMedicines,setAllMedicines]= useState([]);
  const [searchResult,setSearchResult]= useState([]);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [cart,        setCart]        = useState([]);
  const [bill,        setBill]        = useState(null);
  const [generating,  setGenerating]  = useState(false);
  const [loading,     setLoading]     = useState(true);
  const billRef = useRef(null);

  // ─── Accent colours from context ──────────────────────────────────────────
  const GREEN = t.accent  || "#10b981";
  const BLUE  = t.blue    || "#2563eb";
  const RED   = "#ef4444";

  useEffect(() => {
    const init = async () => {
      try {
        const r = await fetch(`${BASE}/seller/shop`, { credentials:"include" });
        if (r.ok) {
          const s = await r.json();
          setShopId(s.shopId);
          setShopName(s.shopName);
          const mr = await fetch(`${BASE}/seller/shop/${s.shopId}/medicines?pageSize=100`, { credentials:"include" });
          if (mr.ok) { const md = await mr.json(); setAllMedicines(md.content || []); }
        }
      } catch {}
      finally { setLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) { setSearchResult([]); return; }
    const q = searchTerm.toLowerCase();
    setSearchResult(allMedicines.filter(m => m.medicineName.toLowerCase().includes(q) && m.quantity > 0).slice(0, 6));
  }, [searchTerm, allMedicines]);

  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(c => c.medicineId === med.medicineId);
      if (existing) {
        if (existing.quantity >= med.quantity) return prev;
        return prev.map(c => c.medicineId === med.medicineId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { medicineId:med.medicineId, medicineName:med.medicineName, price:med.specialPrice, maxStock:med.quantity, quantity:1 }];
    });
    setSearchTerm("");
    setSearchResult([]);
  };

  const updateQty = (medicineId, delta) => {
    setCart(prev => prev.map(c => c.medicineId === medicineId ? { ...c, quantity:Math.max(1,Math.min(c.maxStock,c.quantity+delta)) } : c));
  };

  const removeFromCart = (medicineId) => setCart(prev => prev.filter(c => c.medicineId !== medicineId));

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const generateBill = async () => {
    if (!cart.length) return;
    setGenerating(true);
    try {
      const res = await fetch(`${BASE}/seller/shop/${shopId}/bill`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        credentials:"include",
        body:JSON.stringify(cart.map(c => ({ medicineId:c.medicineId, quantity:c.quantity }))),
      });
      if (res.ok) {
        const data = await res.json();
        setBill(data);
        setCart([]);
        const mr = await fetch(`${BASE}/seller/shop/${shopId}/medicines?pageSize=100`, { credentials:"include" });
        if (mr.ok) { const md = await mr.json(); setAllMedicines(md.content || []); }
      } else {
        const d = await res.json();
        alert(d.message || "Billing failed");
      }
    } catch { alert("Server error"); }
    finally { setGenerating(false); }
  };

  const printBill = () => {
    const content = billRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Bill - ${bill.billId}</title>
      <style>body{font-family:monospace;padding:20px;max-width:400px;margin:0 auto;}table{width:100%;border-collapse:collapse;}th,td{padding:6px;border-bottom:1px solid #ccc;text-align:left;}.total{font-size:1.2em;font-weight:bold;}</style>
      </head><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  // ── Shared input style ─────────────────────────────────────────────────────
  const inputStyle = {
    width:"100%", padding:"11px 14px 11px 40px",
    borderRadius:11, background:t.bgAlt,
    border:`1px solid ${t.border}`,
    color:t.text, fontSize:14,
    outline:"none", fontFamily:"'DM Sans',sans-serif",
    transition:"border-color 0.2s",
    boxSizing:"border-box",
  };

  const btnPrimary = (disabled = false) => ({
    padding:"12px 0", width:"100%", borderRadius:11,
    background: disabled ? t.bgAlt : GREEN,
    color:      disabled ? t.textMuted : "#fff",
    fontFamily: "'DM Sans',sans-serif",
    fontWeight: 700, fontSize:14,
    border:     "none", cursor: disabled ? "not-allowed" : "pointer",
    opacity:    disabled ? 0.5 : 1,
    transition: "opacity 0.2s",
  });

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:t.bg }}>
      <div style={{ width:44, height:44, borderRadius:"50%", border:`4px solid ${GREEN}`, borderTopColor:"transparent", animation:"sb-spin 0.8s linear infinite" }} />
      <style>{`@keyframes sb-spin{to{transform:rotate(360deg)}}`}</style>
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

      {/* ── HEADER ── */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${GREEN}18`, border:`1px solid ${GREEN}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <MdReceiptLong style={{ color:GREEN, fontSize:22 }} />
          </div>
          <div>
            <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"clamp(1.6rem,3.5vw,2.2rem)", margin:0, letterSpacing:"-0.03em" }}>
              Billing Counter
            </h1>
            <p style={{ color:t.textMuted, fontSize:13, margin:0 }}>Search medicines, add to cart, generate bill</p>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24, alignItems:"start" }}>

        {/* ── LEFT: SEARCH + CART ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

          {/* SEARCH PANEL */}
          <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:18, padding:"22px 20px" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:t.text, marginBottom:14 }}>
              Add Medicine to Cart
            </p>

            {/* Search input */}
            <div style={{ position:"relative" }}>
              <FiSearch style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:t.textMuted, fontSize:15, pointerEvents:"none" }} />
              <input
                type="text"
                placeholder="Search by medicine name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = GREEN}
                onBlur={e  => e.target.style.borderColor = t.border}
              />
            </div>

            {/* Search results */}
            {/* {searchResult.length > 0 && (
              <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
                {searchResult.map(med => {
                  const [hov, setHov] = useState(false);
                  return (
                    <div key={med.medicineId}
                      onClick={() => addToCart(med)}
                      onMouseEnter={() => setHov(true)}
                      onMouseLeave={() => setHov(false)}
                      style={{
                        display:"flex", alignItems:"center", gap:14,
                        padding:"10px 14px", borderRadius:12,
                        background: hov ? t.bgCardHov : t.bgAlt,
                        border:`1px solid ${hov ? GREEN + "50" : t.border}`,
                        cursor:"pointer", transition:"all 0.18s",
                      }}>
                      <img
                        src={med.image ? `http://localhost:8080/images/${med.image}` : mediGet1}
                        alt={med.medicineName}
                        onError={(e) => { e.target.src = mediGet1; }}
                        style={{ width:44, height:44, borderRadius:10, objectFit:"cover", flexShrink:0 }}
                      />
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ color:t.text, fontWeight:600, fontSize:13, margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{med.medicineName}</p>
                        <p style={{ color:t.textMuted, fontSize:11, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{med.description?.slice(0,40)}...</p>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <p style={{ color:GREEN, fontWeight:700, fontSize:14, margin:"0 0 2px" }}>₹{med.specialPrice?.toFixed(2)}</p>
                        <p style={{ color:t.textMuted, fontSize:11, margin:0 }}>Stock: {med.quantity}</p>
                      </div>
                      <div style={{ width:26, height:26, borderRadius:7, background:`${GREEN}20`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <FiPlus style={{ color:GREEN, fontSize:14 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )} */}
{/* 
            // ✅ CORRECT — use the new component in .map() */}
{searchResult.length > 0 && (
  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
    {searchResult.map(med => (
      <MedSearchItem
        key={med.medicineId}
        med={med}
        onAdd={addToCart}
        t={t}
        GREEN={GREEN}
        mediGet1={mediGet1}
      />
    ))}
  </div>
)}

            {searchTerm && searchResult.length === 0 && (
              <p style={{ color:t.textMuted, fontSize:13, textAlign:"center", marginTop:16, padding:"12px 0" }}>
                No available medicines found for "{searchTerm}"
              </p>
            )}
          </div>

          {/* CART PANEL */}
          <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:18, padding:"22px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:t.text, margin:0 }}>
                Cart
              </p>
              {cart.length > 0 && (
                <span style={{ fontSize:11, fontWeight:700, color:GREEN, background:`${GREEN}18`, padding:"3px 10px", borderRadius:20 }}>
                  {cart.length} item{cart.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:t.textMuted }}>
                <FiShoppingCart style={{ fontSize:36, marginBottom:10, opacity:0.3 }} />
                <p style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Cart is empty</p>
                <p style={{ fontSize:12 }}>Search and add medicines above</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {cart.map(item => (
                  <div key={item.medicineId} style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"11px 14px", borderRadius:12,
                    background:t.bgAlt, border:`1px solid ${t.border}`,
                  }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ color:t.text, fontSize:13, fontWeight:600, margin:"0 0 2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.medicineName}</p>
                      <p style={{ color:GREEN, fontSize:12, margin:0, fontWeight:500 }}>₹{item.price?.toFixed(2)} each</p>
                    </div>

                    {/* Qty control */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, background:t.bgCard, borderRadius:9, padding:"5px 10px", border:`1px solid ${t.border}` }}>
                      <button onClick={() => updateQty(item.medicineId, -1)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, display:"flex", alignItems:"center", padding:2 }}>
                        <FiMinus size={11} />
                      </button>
                      <span style={{ color:t.text, fontWeight:700, fontSize:13, minWidth:18, textAlign:"center" }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.medicineId, 1)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, display:"flex", alignItems:"center", padding:2 }}>
                        <FiPlus size={11} />
                      </button>
                    </div>

                    <span style={{ fontWeight:700, fontSize:13, color:t.text, minWidth:70, textAlign:"right" }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button onClick={() => removeFromCart(item.medicineId)}
                      style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, padding:4, display:"flex", alignItems:"center", transition:"color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = RED}
                      onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <div style={{ position:"sticky", top:84 }}>
          <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:18, padding:"22px 20px" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:t.text, marginBottom:18 }}>
              Order Summary
            </p>

            {cart.length === 0 ? (
              <p style={{ color:t.textMuted, fontSize:13, textAlign:"center", padding:"16px 0 20px" }}>No items added yet.</p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>
                {cart.map(item => (
                  <div key={item.medicineId} style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                    <span style={{ color:t.textMuted }}>
                      {item.medicineName} <span style={{ fontSize:11 }}>×{item.quantity}</span>
                    </span>
                    <span style={{ color:t.text, fontWeight:600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:14, marginBottom:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:700, fontSize:15, color:t.text }}>Total</span>
                <span style={{ fontWeight:800, fontSize:20, color:GREEN }}>₹{cartTotal.toFixed(2)}</span>
              </div>
              {cart.length > 0 && (
                <p style={{ fontSize:11, color:t.textMuted, marginTop:6, marginBottom:0 }}>
                  {cart.length} item{cart.length > 1 ? "s" : ""} · Stock will be deducted on generation
                </p>
              )}
            </div>

            <button
              onClick={generateBill}
              disabled={!cart.length || generating}
              style={btnPrimary(!cart.length || generating)}
              onMouseEnter={e => { if (cart.length && !generating) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {generating ? "Generating..." : "Generate Bill →"}
            </button>

            {/* Quick note */}
            <p style={{ fontSize:11, color:t.textMuted, textAlign:"center", marginTop:12, marginBottom:0 }}>
              Inventory updates automatically after bill generation
            </p>
          </div>
        </div>
      </div>

      {/* ── BILL MODAL ── */}
      {bill && (
        <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)" }}>
          <div style={{
            background:   t.bgCard,
            border:       `1px solid ${GREEN}40`,
            borderRadius: 20,
            padding:      "28px 26px",
            width:"100%", maxWidth:440,
            boxShadow:    `0 0 60px ${GREEN}20`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <FiCheckCircle style={{ color:GREEN, fontSize:24 }} />
              <div>
                <h2 style={{ fontWeight:800, fontSize:18, color:GREEN, margin:0 }}>Bill Generated!</h2>
                <p style={{ color:t.textMuted, fontSize:12, margin:0 }}>Bill #{bill.billId} · {new Date(bill.billDate).toLocaleDateString("en-IN")}</p>
              </div>
            </div>

            {/* Printable section */}
            <div ref={billRef} style={{
              background:   t.bgAlt,
              border:       `1px solid ${t.border}`,
              borderRadius: 14,
              padding:      "18px 16px",
              marginBottom: 18,
              fontFamily:   "monospace",
            }}>
              <div style={{ textAlign:"center", marginBottom:14, paddingBottom:14, borderBottom:`1px dashed ${t.border}` }}>
                <p style={{ fontWeight:700, fontSize:16, color:t.text, margin:"0 0 4px" }}>{shopName || "Medical Store"}</p>
                <p style={{ color:t.textMuted, fontSize:11, margin:0 }}>Tax Invoice · Bill #{bill.billId}</p>
              </div>

              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${t.border}` }}>
                    {["Medicine","Qty","Price","Total"].map(h=>(
                      <th key={h} style={{ padding:"6px 4px", textAlign:h==="Medicine"?"left":"right", color:t.textMuted, fontWeight:600, fontSize:10, textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bill.items?.map((item, i) => (
                    <tr key={i} style={{ borderBottom:`1px solid ${t.border}` }}>
                      <td style={{ padding:"7px 4px", color:t.text }}>{item.medicineName}</td>
                      <td style={{ padding:"7px 4px", textAlign:"right", color:t.textMuted }}>{item.quantity}</td>
                      <td style={{ padding:"7px 4px", textAlign:"right", color:t.textMuted }}>₹{item.price?.toFixed(2)}</td>
                      <td style={{ padding:"7px 4px", textAlign:"right", color:GREEN, fontWeight:700 }}>₹{item.totalPrice?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop:`2px solid ${t.border}`, marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:700, fontSize:13, color:t.text }}>TOTAL</span>
                <span style={{ fontWeight:800, fontSize:16, color:GREEN }}>₹{bill.totalAmount?.toFixed(2)}</span>
              </div>

              <p style={{ textAlign:"center", color:t.textMuted, fontSize:10, marginTop:14, marginBottom:0 }}>Thank you for your purchase!</p>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={printBill} style={{
                flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                padding:"11px 0", borderRadius:11,
                background:t.bgAlt, border:`1px solid ${t.border}`,
                color:t.text, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13,
                cursor:"pointer",
              }}>
                <FiPrinter size={15} /> Print Receipt
              </button>
              <button onClick={() => setBill(null)} style={{
                flex:1, padding:"11px 0", borderRadius:11,
                background:GREEN, color:"#fff",
                fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13,
                border:"none", cursor:"pointer",
              }}>
                Done ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerBilling;