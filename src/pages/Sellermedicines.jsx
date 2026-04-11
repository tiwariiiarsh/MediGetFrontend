// src/pages/seller/SellerMedicines.jsx
// Complete CRUD: add, edit, delete, image upload, view all medicines
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiPlus, FiEdit3, FiTrash2, FiSearch, FiUpload, FiX, FiAlertTriangle } from "react-icons/fi";
import mediGet1 from "../../assets/mediget1.jpg";

const BASE = "http://localhost:8080/api";

const emptyForm = {
  medicineName: "", description: "", quantity: "",
  price: "", discount: "", expiryDate: "",
};

const SellerMedicines = () => {
  const user = useSelector((s) => s.auth.user);
  const [shopId, setShopId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [imageModal, setImageModal] = useState(null); // medicineId
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Get shop ID first ──
  useEffect(() => {
    const getShop = async () => {
      try {
        const res = await fetch(`${BASE}/seller/shop`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setShopId(data.shopId);
        }
      } catch { }
    };
    getShop();
  }, []);

  // ── Fetch medicines ──
  const fetchMedicines = async (p = 0) => {
    if (!shopId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE}/seller/shop/${shopId}/medicines?pageNumber=${p}&pageSize=12`,
        { credentials: "include" }
      );
      const data = await res.json();
      setMedicines(data.content || []);
      setFiltered(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (shopId) fetchMedicines(page); }, [shopId, page]);

  // ── Client search ──
  useEffect(() => {
    setFiltered(
      search
        ? medicines.filter(m => m.medicineName.toLowerCase().includes(search.toLowerCase()))
        : medicines
    );
  }, [search, medicines]);

  // ── Submit (Add/Edit) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editMode
        ? `${BASE}/seller/shop/${shopId}/medicine/${editId}`
        : `${BASE}/seller/shop/${shopId}/medicine`;
      const res = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
          discount: Number(form.discount) || 0,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm(emptyForm);
        setEditMode(false);
        fetchMedicines(page);
      } else {
        const d = await res.json();
        alert(d.message || "Failed");
      }
    } catch { alert("Server error"); }
    finally { setSaving(false); }
  };

  const openEdit = (med) => {
    setForm({
      medicineName: med.medicineName,
      description: med.description,
      quantity: med.quantity,
      price: med.price,
      discount: med.discount,
      expiryDate: med.expiryDate || "",
    });
    setEditId(med.medicineId);
    setEditMode(true);
    setShowModal(true);
  };

  const deleteMedicine = async (medId) => {
    try {
      await fetch(`${BASE}/seller/shop/${shopId}/medicine/${medId}`, {
        method: "DELETE",
        credentials: "include",
      });
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
      await fetch(`${BASE}/seller/shop/${shopId}/medicine/${imageModal}/image`, {
        method: "PUT",
        credentials: "include",
        body: fd,
      });
      setImageModal(null);
      setImageFile(null);
      fetchMedicines(page);
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const stockBadge = (qty) => {
    if (qty > 50) return "bg-emerald-400/10 text-emerald-400";
    if (qty > 10) return "bg-yellow-400/10 text-yellow-400";
    return "bg-red-400/10 text-red-400";
  };

  return (
    <div className="min-h-screen px-[8vw] pt-28 pb-20 text-white">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medicine Inventory</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your shop's medicines</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditMode(false); setForm(emptyForm); }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black
                     bg-gradient-to-r from-emerald-400 to-cyan-400
                     hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] transition"
        >
          <FiPlus /> Add Medicine
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative mb-7 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-sm
                     border border-white/10 focus:outline-none focus:border-emerald-400 transition"
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No medicines found.</div>
      ) : (
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="px-5 py-4 text-left">Medicine</th>
                  <th className="px-4 py-4 text-left">MRP</th>
                  <th className="px-4 py-4 text-left">Special</th>
                  <th className="px-4 py-4 text-left">Discount</th>
                  <th className="px-4 py-4 text-left">Stock</th>
                  <th className="px-4 py-4 text-left">Expiry</th>
                  <th className="px-4 py-4 text-left">Sold</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((med, i) => (
                  <tr key={med.medicineId}
                    className={`border-b border-white/5 hover:bg-white/5 transition ${
                      i % 2 === 0 ? "" : "bg-white/[0.02]"
                    }`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={med.image ? `http://localhost:8080/images/${med.image}` : mediGet1}
                            alt={med.medicineName}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = mediGet1; }}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">{med.medicineName}</p>
                          <p className="text-gray-500 text-xs line-clamp-1">{med.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">₹{med.price}</td>
                    <td className="px-4 py-4 text-emerald-400 font-semibold">₹{med.specialPrice?.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      {med.discount > 0 ? (
                        <span className="bg-red-400/10 text-red-400 text-xs px-2 py-1 rounded-full">
                          {med.discount}%
                        </span>
                      ) : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stockBadge(med.quantity)}`}>
                        {med.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">
                      {med.expiryDate
                        ? new Date(med.expiryDate).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      {med.salesCount > 0 ? (
                        <span className="text-yellow-400 text-xs">🔥 {med.salesCount}</span>
                      ) : <span className="text-gray-600">0</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setImageModal(med.medicineId)}
                          title="Upload image"
                          className="p-2 rounded-lg bg-[#1e293b] hover:bg-cyan-400/20 hover:text-cyan-400 transition">
                          <FiUpload size={14} />
                        </button>
                        <button onClick={() => openEdit(med)}
                          className="p-2 rounded-lg bg-[#1e293b] hover:bg-emerald-400/20 hover:text-emerald-400 transition">
                          <FiEdit3 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(med)}
                          className="p-2 rounded-lg bg-[#1e293b] hover:bg-red-400/20 hover:text-red-400 transition">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-[#1e293b] rounded-lg disabled:opacity-30 hover:bg-[#334155] transition">
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`px-4 py-2 rounded-lg transition ${
                page === i ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold" : "bg-[#1e293b] hover:bg-[#334155]"
              }`}>{i + 1}</button>
          ))}
          <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-[#1e293b] rounded-lg disabled:opacity-30 hover:bg-[#334155] transition">
            Next →
          </button>
        </div>
      )}

      {/* ── ADD/EDIT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-7 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-emerald-400">
                {editMode ? "Edit Medicine" : "Add New Medicine"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FiX className="text-gray-400 hover:text-white transition" size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                ["medicineName", "Medicine Name", "text"],
                ["description", "Description", "text"],
                ["quantity", "Quantity", "number"],
                ["price", "MRP (₹)", "number"],
                ["discount", "Discount (%)", "number"],
                ["expiryDate", "Expiry Date", "date"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={key !== "discount" && key !== "expiryDate"}
                    min={type === "number" ? "0" : undefined}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e293b] text-white text-sm
                               border border-white/10 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl font-semibold text-black
                             bg-gradient-to-r from-emerald-400 to-cyan-400 hover:scale-[1.01] transition">
                  {saving ? "Saving..." : editMode ? "Update" : "Add Medicine"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#1e293b] border border-white/10 hover:bg-[#334155] transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── IMAGE UPLOAD MODAL ── */}
      {imageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-cyan-400">Upload Image</h2>
              <button onClick={() => { setImageModal(null); setImageFile(null); }}>
                <FiX className="text-gray-400 hover:text-white transition" />
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0 file:bg-[#1e293b] file:text-white
                         hover:file:bg-emerald-400/20 mb-4"
            />
            {imageFile && (
              <p className="text-emerald-400 text-sm mb-4">📎 {imageFile.name}</p>
            )}
            <div className="flex gap-3">
              <button onClick={uploadImage} disabled={!imageFile || uploading}
                className="flex-1 py-2.5 rounded-xl font-semibold text-black
                           bg-gradient-to-r from-emerald-400 to-cyan-400 disabled:opacity-50">
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <button onClick={() => { setImageModal(null); setImageFile(null); }}
                className="flex-1 py-2.5 rounded-xl bg-[#1e293b] border border-white/10">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-red-500/20 rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <FiAlertTriangle className="text-red-400 text-3xl mb-3" />
            <h2 className="text-lg font-bold mb-2">Delete Medicine?</h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white">{deleteConfirm.medicineName}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => deleteMedicine(deleteConfirm.medicineId)}
                className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 hover:bg-red-600 transition">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1e293b] border border-white/10">
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