// src/pages/seller/SellerMedicines.jsx

import { useEffect, useState } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiSearch, FiUpload, FiX, FiAlertTriangle, FiPackage } from "react-icons/fi";
import mediGet1 from "../../assets/mediget1.jpg";
import { useTheme } from "../../components/ThemeContext";

const BASE = "http://localhost:8080/api";

const emptyForm = {
  medicineName:"", description:"", quantity:"",
  price:"", discount:"", expiryDate:"",
};

// ── Extracted: single action icon button ─────────────────────────────────────
const ActionBtn = ({ icon: Icon, tip, color, onClick, t }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={tip}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:30, height:30, borderRadius:8, border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        background: hov ? `${color}20` : t.bgAlt,
        color: hov ? color : t.textMuted,
        transition:"all 0.15s",
      }}
    >
      <Icon size={13} />
    </button>
  );
};

// ── Extracted: single table row ───────────────────────────────────────────────
const MedicineRow = ({ med, i, t, GREEN, AMBER, RED, CYAN, stockStyle, setImageModal, openEdit, setDeleteConfirm }) => {
  const [hov, setHov] = useState(false);
  const stock = stockStyle(med.quantity);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom:`1px solid ${t.border}`,
        background: hov ? t.bgCardHov : (i % 2 === 1 ? t.bgAlt + "60" : "transparent"),
        transition:"background 0.15s",
      }}
    >
      {/* Medicine name + image */}
      <td style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:9, overflow:"hidden", flexShrink:0, border:`1px solid ${t.border}` }}>
            <img
              src={med.image ? `http://localhost:8080/images/${med.image}` : mediGet1}
              alt={med.medicineName}
              onError={e => { e.target.src = mediGet1; }}
              style={{ width:"100%", height:"100%", objectFit:"cover" }}
            />
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ color:t.text, fontWeight:600, fontSize:13, margin:"0 0 2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>
              {med.medicineName}
            </p>
            <p style={{ color:t.textMuted, fontSize:11, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>
              {med.description?.slice(0,32)}...
            </p>
          </div>
        </div>
      </td>

      <td style={{ padding:"12px 14px", color:t.textMuted }}>₹{med.price}</td>
      <td style={{ padding:"12px 14px", color:GREEN, fontWeight:700 }}>₹{med.specialPrice?.toFixed(2)}</td>

      <td style={{ padding:"12px 14px" }}>
        {med.discount > 0
          ? <span style={{ fontSize:11, fontWeight:700, color:RED, background:"rgba(239,68,68,0.1)", padding:"3px 8px", borderRadius:20 }}>{med.discount}% off</span>
          : <span style={{ color:t.textMuted }}>—</span>
        }
      </td>

      <td style={{ padding:"12px 14px" }}>
        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:stock.bg, color:stock.color }}>
          {med.quantity}
        </span>
      </td>

      <td style={{ padding:"12px 14px", color:t.textMuted, fontSize:12 }}>
        {med.expiryDate ? new Date(med.expiryDate).toLocaleDateString("en-IN") : "—"}
      </td>

      <td style={{ padding:"12px 14px" }}>
        {med.salesCount > 0
          ? <span style={{ color:AMBER, fontSize:12, fontWeight:700 }}>🔥 {med.salesCount}</span>
          : <span style={{ color:t.textMuted, fontSize:12 }}>0</span>
        }
      </td>

      <td style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6 }}>
          <ActionBtn icon={FiUpload} tip="Upload image" color={CYAN}  onClick={() => setImageModal(med.medicineId)} t={t} />
          <ActionBtn icon={FiEdit3}  tip="Edit"         color={GREEN} onClick={() => openEdit(med)}                  t={t} />
          <ActionBtn icon={FiTrash2} tip="Delete"       color={RED}   onClick={() => setDeleteConfirm(med)}          t={t} />
        </div>
      </td>
    </tr>
  );
};

// ── Extracted: single form field ──────────────────────────────────────────────
const FormField = ({ fieldKey, label, type, required, value, onChange, t, GREEN }) => {
  const [foc, setFoc] = useState(false);
  return (
    <div>
      <label style={{ fontSize:11, color:t.textMuted, fontWeight:600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {label}{required && " *"}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={type === "number" ? "0" : undefined}
        onFocus={() => setFoc(true)}
        onBlur={() => setFoc(false)}
        style={{
          width:"100%", padding:"10px 14px",
          borderRadius:10, background:t.bgAlt,
          border:`1px solid ${foc ? GREEN : t.border}`,
          color:t.text, fontSize:13,
          outline:"none", fontFamily:"'DM Sans',sans-serif",
          transition:"border-color 0.2s",
          boxSizing:"border-box",
        }}
      />
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const SellerMedicines = () => {
  const { t, dark } = useTheme();

  const [shopId,        setShopId]        = useState(null);
  const [medicines,     setMedicines]     = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [search,        setSearch]        = useState("");
  const [loading,       setLoading]       = useState(true);
  const [page,          setPage]          = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);

  const [showModal,     setShowModal]     = useState(false);
  const [editMode,      setEditMode]      = useState(false);
  const [editId,        setEditId]        = useState(null);
  const [form,          setForm]          = useState(emptyForm);
  const [saving,        setSaving]        = useState(false);

  const [imageModal,    setImageModal]    = useState(null);
  const [imageFile,     setImageFile]     = useState(null);
  const [uploading,     setUploading]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const GREEN = t.accent     || "#10b981";
  const BLUE  = t.blue       || "#2563eb";
  const CYAN  = t.accent2    || "#06b6d4";
  const RED   = "#ef4444";
  const AMBER = t.alertColor || "#f59e0b";

  const btnPrimary    = { padding:"11px 22px", borderRadius:10, background:GREEN, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:7 };
  const btnSecondary  = { padding:"11px 22px", borderRadius:10, background:t.bgAlt, color:t.text, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, border:`1px solid ${t.border}`, cursor:"pointer" };

  const overlay   = { position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)" };
  const modalBox  = (borderAccent) => ({
    background:t.bgCard, border:`1px solid ${borderAccent || t.border}`,
    borderRadius:20, padding:"28px 26px",
    width:"100%", maxWidth:480,
    maxHeight:"90vh", overflowY:"auto",
    boxShadow: dark ? "0 24px 80px rgba(0,0,0,0.6)" : "0 24px 80px rgba(0,0,0,0.12)",
  });

  const stockStyle = (qty) => {
    if (qty > 50) return { bg:`${GREEN}18`, color:GREEN };
    if (qty > 10) return { bg:`${AMBER}18`, color:AMBER };
    return { bg:"rgba(239,68,68,0.12)", color:RED };
  };

  useEffect(() => {
    const getShop = async () => {
      try {
        const res = await fetch(`${BASE}/seller/shop`, { credentials:"include" });
        if (res.ok) { const data = await res.json(); setShopId(data.shopId); }
      } catch {}
    };
    getShop();
  }, []);

  const fetchMedicines = async (p = 0) => {
    if (!shopId) return;
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/seller/shop/${shopId}/medicines?pageNumber=${p}&pageSize=12`, { credentials:"include" });
      const data = await res.json();
      setMedicines(data.content   || []);
      setFiltered(data.content    || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (shopId) fetchMedicines(page); }, [shopId, page]);

  useEffect(() => {
    setFiltered(search
      ? medicines.filter(m => m.medicineName.toLowerCase().includes(search.toLowerCase()))
      : medicines
    );
  }, [search, medicines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editMode
        ? `${BASE}/seller/shop/${shopId}/medicine/${editId}`
        : `${BASE}/seller/shop/${shopId}/medicine`;
      const res = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers:{ "Content-Type":"application/json" },
        credentials:"include",
        body: JSON.stringify({ ...form, quantity:Number(form.quantity), price:Number(form.price), discount:Number(form.discount)||0 }),
      });
      if (res.ok) { setShowModal(false); setForm(emptyForm); setEditMode(false); fetchMedicines(page); }
      else { const d = await res.json(); alert(d.message || "Failed"); }
    } catch { alert("Server error"); }
    finally { setSaving(false); }
  };

  const openEdit = (med) => {
    setForm({ medicineName:med.medicineName, description:med.description, quantity:med.quantity, price:med.price, discount:med.discount, expiryDate:med.expiryDate||"" });
    setEditId(med.medicineId);
    setEditMode(true);
    setShowModal(true);
  };

  const deleteMedicine = async (medId) => {
    try {
      await fetch(`${BASE}/seller/shop/${shopId}/medicine/${medId}`, { method:"DELETE", credentials:"include" });
      setDeleteConfirm(null);
      fetchMedicines(page);
    } catch { alert("Delete failed"); }
  };

  const uploadImage = async () => {
    if (!imageFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", imageFile);
      await fetch(`${BASE}/seller/shop/${shopId}/medicine/${imageModal}/image`, { method:"PUT", credentials:"include", body:fd });
      setImageModal(null); setImageFile(null);
      fetchMedicines(page);
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const formFields = [
    { key:"medicineName", label:"Medicine Name", type:"text",   required:true  },
    { key:"description",  label:"Description",   type:"text",   required:false },
    { key:"quantity",     label:"Quantity",       type:"number", required:true  },
    { key:"price",        label:"MRP (₹)",        type:"number", required:true  },
    { key:"discount",     label:"Discount (%)",   type:"number", required:false },
    { key:"expiryDate",   label:"Expiry Date",    type:"date",   required:false },
  ];

  return (
    <div style={{
      minHeight:  "100vh",
      padding:    "112px 8vw 80px",
      background: t.bg,
      color:      t.text,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.3s, color 0.3s",
    }}>

      {/* HEADER */}
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:16, marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${GREEN}18`, border:`1px solid ${GREEN}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FiPackage style={{ color:GREEN, fontSize:22 }} />
          </div>
          <div>
            <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"clamp(1.6rem,3.5vw,2.2rem)", margin:0, letterSpacing:"-0.03em" }}>
              Medicine Inventory
            </h1>
            <p style={{ color:t.textMuted, fontSize:13, margin:0 }}>
              {medicines.length} medicines listed · Manage your shop's stock
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditMode(false); setForm(emptyForm); }}
          style={btnPrimary}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.87"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <FiPlus /> Add Medicine
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ position:"relative", maxWidth:360, marginBottom:24 }}>
        <FiSearch style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:t.textMuted, pointerEvents:"none" }} />
        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width:"100%", padding:"10px 14px", paddingLeft:40,
            borderRadius:10, background:t.bgAlt,
            border:`1px solid ${t.border}`,
            color:t.text, fontSize:13,
            outline:"none", fontFamily:"'DM Sans',sans-serif",
            boxSizing:"border-box",
          }}
          onFocus={e => e.target.style.borderColor = GREEN}
          onBlur={e  => e.target.style.borderColor = t.border}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", border:`4px solid ${GREEN}`, borderTopColor:"transparent", animation:"sm-spin 0.8s linear infinite" }} />
          <style>{`@keyframes sm-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"64px 0", color:t.textMuted }}>
          <FiPackage style={{ fontSize:44, opacity:0.2, marginBottom:12 }} />
          <p style={{ fontWeight:600, fontSize:15 }}>No medicines found</p>
          <p style={{ fontSize:13 }}>Add your first medicine using the button above</p>
        </div>
      ) : (
        <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${t.border}`, background:t.bgAlt }}>
                  {["Medicine","MRP","Special Price","Discount","Stock","Expiry","Sold","Actions"].map(h => (
                    <th key={h} style={{
                      padding:"12px 14px",
                      textAlign: h === "Actions" ? "right" : "left",
                      fontSize:11, fontWeight:700,
                      color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.06em",
                      whiteSpace:"nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((med, i) => (
                  <MedicineRow
                    key={med.medicineId}
                    med={med}
                    i={i}
                    t={t}
                    GREEN={GREEN}
                    AMBER={AMBER}
                    RED={RED}
                    CYAN={CYAN}
                    stockStyle={stockStyle}
                    setImageModal={setImageModal}
                    openEdit={openEdit}
                    setDeleteConfirm={setDeleteConfirm}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:24, flexWrap:"wrap" }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}
            style={{ ...btnSecondary, opacity: page === 0 ? 0.4 : 1, cursor: page === 0 ? "not-allowed" : "pointer" }}>
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              style={{ ...btnSecondary, background: page === i ? GREEN : t.bgAlt, color: page === i ? "#fff" : t.text, fontWeight: page === i ? 700 : 500, borderColor: page === i ? GREEN : t.border }}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}
            style={{ ...btnSecondary, opacity: page === totalPages - 1 ? 0.4 : 1, cursor: page === totalPages - 1 ? "not-allowed" : "pointer" }}>
            Next →
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modalBox()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:17, color:t.text, margin:"0 0 3px" }}>
                  {editMode ? "Edit Medicine" : "Add New Medicine"}
                </h2>
                <p style={{ color:t.textMuted, fontSize:12, margin:0 }}>
                  {editMode ? "Update medicine details below" : "Fill in details to add to your inventory"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, padding:4 }}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {formFields.map(({ key, label, type, required }) => (
                <FormField
                  key={key}
                  fieldKey={key}
                  label={label}
                  type={type}
                  required={required}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  t={t}
                  GREEN={GREEN}
                />
              ))}

              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="submit" disabled={saving}
                  style={{ flex:1, ...btnPrimary, justifyContent:"center", opacity:saving?0.6:1 }}>
                  {saving ? "Saving..." : editMode ? "Update Medicine" : "Add Medicine"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex:1, ...btnSecondary, textAlign:"center" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE UPLOAD MODAL */}
      {imageModal && (
        <div style={overlay}>
          <div style={modalBox(`${CYAN}40`)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:17, color:t.text, margin:"0 0 3px" }}>Upload Image</h2>
                <p style={{ color:t.textMuted, fontSize:12, margin:0 }}>Upload a product photo for this medicine</p>
              </div>
              <button onClick={() => { setImageModal(null); setImageFile(null); }} style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted }}>
                <FiX size={20} />
              </button>
            </div>

            <div style={{ border:`2px dashed ${imageFile ? GREEN : t.border}`, borderRadius:12, padding:"24px 16px", textAlign:"center", marginBottom:16, background:`${imageFile ? GREEN : t.blue}08`, transition:"all 0.2s" }}>
              <FiUpload style={{ fontSize:28, color: imageFile ? GREEN : t.textMuted, marginBottom:10 }} />
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                style={{ display:"block", margin:"0 auto", color:t.textMuted, fontSize:13, cursor:"pointer" }}
              />
              {imageFile && (
                <p style={{ color:GREEN, fontSize:13, fontWeight:600, marginTop:10, marginBottom:0 }}>
                  📎 {imageFile.name}
                </p>
              )}
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={uploadImage} disabled={!imageFile || uploading}
                style={{ flex:1, ...btnPrimary, justifyContent:"center", opacity:(!imageFile||uploading)?0.5:1, cursor:(!imageFile||uploading)?"not-allowed":"pointer" }}>
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
              <button onClick={() => { setImageModal(null); setImageFile(null); }}
                style={{ flex:1, ...btnSecondary, textAlign:"center" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div style={overlay}>
          <div style={modalBox("rgba(239,68,68,0.25)")}>
            <div style={{ textAlign:"center", padding:"8px 0 18px" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <FiAlertTriangle style={{ color:RED, fontSize:24 }} />
              </div>
              <h2 style={{ fontWeight:800, fontSize:17, color:t.text, margin:"0 0 8px" }}>Delete Medicine?</h2>
              <p style={{ color:t.textMuted, fontSize:13, lineHeight:1.65, margin:0 }}>
                You are about to permanently delete{" "}
                <strong style={{ color:t.text }}>{deleteConfirm.medicineName}</strong>.
                This action cannot be undone and will remove all associated stock data.
              </p>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={() => deleteMedicine(deleteConfirm.medicineId)}
                style={{ flex:1, padding:"11px 0", borderRadius:10, background:RED, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, border:"none", cursor:"pointer" }}>
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex:1, ...btnSecondary, textAlign:"center" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerMedicines;