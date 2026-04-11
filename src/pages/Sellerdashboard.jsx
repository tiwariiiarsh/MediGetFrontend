// src/pages/seller/SellerDashboard.jsx
// Main seller overview with shop info, stats, quick actions
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiPackage, FiTrendingUp, FiAlertTriangle, FiPlusCircle,
  FiEdit3, FiDollarSign, FiBarChart2, FiShoppingCart
} from "react-icons/fi";
import { MdOutlineLocalPharmacy } from "react-icons/md";

const BASE = "http://localhost:8080/api";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState({ totalMedicines: 0, totalStock: 0, lowStock: [], topSelling: [] });
  const [loading, setLoading] = useState(true);
  const [showCreateShop, setShowCreateShop] = useState(false);
  const [shopForm, setShopForm] = useState({
    shopName: "", buildingName: "", street: "", city: "",
    state: "", country: "India", pincode: "", latitude: "", longitude: "", isOpen: true
  });

  const fetchShop = async () => {
    try {
      const res = await fetch(`${BASE}/seller/shop`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setShop(data);
        fetchStats(data.shopId);
      } else {
        setShop(null);
      }
    } catch { setShop(null); }
    finally { setLoading(false); }
  };

  const fetchStats = async (shopId) => {
    try {
      const [lowRes, topRes, medsRes] = await Promise.all([
        fetch(`${BASE}/seller/shop/${shopId}/analytics/low-stock?threshold=10`, { credentials: "include" }),
        fetch(`${BASE}/seller/shop/${shopId}/analytics/top-selling`, { credentials: "include" }),
        fetch(`${BASE}/seller/shop/${shopId}/medicines?pageSize=100`, { credentials: "include" }),
      ]);
      const low = await lowRes.json();
      const top = await topRes.json();
      const meds = await medsRes.json();
      const allMeds = meds.content || [];
      const totalStock = allMeds.reduce((sum, m) => sum + (m.quantity || 0), 0);
      setStats({
        totalMedicines: allMeds.length,
        totalStock,
        lowStock: Array.isArray(low) ? low : [],
        topSelling: Array.isArray(top) ? top : [],
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchShop(); }, []);

  const createShop = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE}/seller/shop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(shopForm),
      });
      if (res.ok) { setShowCreateShop(false); fetchShop(); }
      else { const d = await res.json(); alert(d.message || "Failed to create shop"); }
    } catch { alert("Server error"); }
  };

  const getLocation = () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      setShopForm(f => ({ ...f, latitude: coords.latitude.toString(), longitude: coords.longitude.toString() }));
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen px-[8vw] pt-28 pb-20 text-white">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.username}
            </span>
          </h1>
          <p className="text-gray-400 mt-1">Seller Dashboard — manage your pharmacy</p>
        </div>

        {shop && (
          <div className="flex items-center gap-2 bg-[#0f172a] border border-white/10 px-4 py-2 rounded-xl">
            <span className={`w-2.5 h-2.5 rounded-full ${shop.isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-sm">{shop.isOpen ? "Shop is Open" : "Shop is Closed"}</span>
          </div>
        )}
      </div>

      {/* ── NO SHOP YET ── */}
      {!shop && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <MdOutlineLocalPharmacy className="text-7xl text-gray-600" />
          <h2 className="text-2xl font-semibold text-gray-400">No shop registered yet</h2>
          <button
            onClick={() => setShowCreateShop(true)}
            className="px-8 py-3 rounded-xl font-semibold text-black
                       bg-gradient-to-r from-emerald-400 to-cyan-400
                       hover:scale-105 transition shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            Create My Shop
          </button>
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {shop && (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {[
              { icon: FiPackage, label: "Total Medicines", value: stats.totalMedicines, color: "emerald" },
              { icon: FiBarChart2, label: "Total Stock Units", value: stats.totalStock, color: "cyan" },
              { icon: FiAlertTriangle, label: "Low Stock Items", value: stats.lowStock.length, color: "yellow" },
              { icon: FiTrendingUp, label: "Best Sellers", value: stats.topSelling.length, color: "purple" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label}
                className="bg-[#0f172a] border border-white/10 rounded-2xl p-5
                           hover:border-white/20 transition">
                <Icon className={`text-${color}-400 text-2xl mb-3`} />
                <div className={`text-3xl font-bold text-${color}-400`}>{value}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: FiPlusCircle, label: "Add Medicine", color: "emerald", path: "/seller/medicines" },
              { icon: FiShoppingCart, label: "Generate Bill", color: "cyan", path: "/seller/billing" },
              { icon: FiBarChart2, label: "Analytics", color: "violet", path: "/seller/analytics" },
              { icon: FiEdit3, label: "Edit Shop", color: "orange", action: () => setShowCreateShop(true) },
            ].map(({ icon: Icon, label, color, path, action }) => (
              <button
                key={label}
                onClick={action || (() => navigate(path))}
                className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 text-left
                           hover:border-white/25 hover:scale-[1.02] transition group"
              >
                <Icon className={`text-${color}-400 text-2xl mb-2`} />
                <div className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  {label}
                </div>
              </button>
            ))}
          </div>

          {/* SHOP INFO */}
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 mb-10">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Shop Details</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
              <p>🏪 <span className="text-white font-medium">{shop.shopName}</span></p>
              <p>🏢 {shop.buildingName}</p>
              <p>📍 {shop.street}, {shop.city}</p>
              <p>🗺️ {shop.state}, {shop.country} — {shop.pincode}</p>
              {shop.latitude && <p>🌐 Lat: {shop.latitude}, Lng: {shop.longitude}</p>}
            </div>
          </div>

          {/* LOW STOCK ALERTS */}
          {stats.lowStock.length > 0 && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 mb-10">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                <FiAlertTriangle /> Low Stock Alert
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stats.lowStock.map((med) => (
                  <div key={med.medicineId}
                    className="bg-[#1e293b] rounded-xl p-3 border border-yellow-500/10">
                    <p className="text-white text-sm font-medium">{med.medicineName}</p>
                    <p className="text-yellow-400 text-xs mt-1">Only {med.quantity} left</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOP SELLING */}
          {stats.topSelling.length > 0 && (
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <FiTrendingUp /> Top Selling Medicines
              </h3>
              <div className="space-y-3">
                {stats.topSelling.map((med, i) => (
                  <div key={med.medicineId}
                    className="flex items-center gap-4 bg-[#1e293b] rounded-xl px-4 py-3">
                    <span className={`text-lg font-bold w-7 text-center ${
                      i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500"
                    }`}>#{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{med.medicineName}</p>
                      <p className="text-gray-500 text-xs">₹{med.specialPrice} — Stock: {med.quantity}</p>
                    </div>
                    {med.salesCount > 0 && (
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-full">
                        {med.salesCount} sold
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── CREATE/EDIT SHOP MODAL ── */}
      {showCreateShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-7 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-emerald-400 mb-6">
              {shop ? "Edit Shop Details" : "Create Your Shop"}
            </h2>
            <form onSubmit={createShop} className="space-y-4">
              {[
                ["shopName", "Shop Name"],
                ["buildingName", "Building Name"],
                ["street", "Street"],
                ["city", "City"],
                ["state", "State"],
                ["country", "Country"],
                ["pincode", "Pincode"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  <input
                    value={shopForm[key]}
                    onChange={(e) => setShopForm(f => ({ ...f, [key]: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e293b] text-white text-sm
                               border border-white/10 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Latitude</label>
                  <input value={shopForm.latitude}
                    onChange={(e) => setShopForm(f => ({ ...f, latitude: e.target.value }))}
                    placeholder="19.8762"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e293b] text-white text-sm
                               border border-white/10 focus:outline-none focus:border-emerald-400 transition" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Longitude</label>
                  <input value={shopForm.longitude}
                    onChange={(e) => setShopForm(f => ({ ...f, longitude: e.target.value }))}
                    placeholder="75.3433"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e293b] text-white text-sm
                               border border-white/10 focus:outline-none focus:border-emerald-400 transition" />
                </div>
              </div>
              <button type="button" onClick={getLocation}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline">
                📍 Use my current location
              </button>

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-black
                             bg-gradient-to-r from-emerald-400 to-cyan-400 hover:scale-[1.01] transition">
                  {shop ? "Update Shop" : "Create Shop"}
                </button>
                <button type="button" onClick={() => setShowCreateShop(false)}
                  className="flex-1 py-3 rounded-xl bg-[#1e293b] border border-white/10 hover:bg-[#334155] transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;