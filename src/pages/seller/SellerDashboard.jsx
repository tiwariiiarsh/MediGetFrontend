// SellerDashboard.jsx (Premium UI Version)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiPackage, FiTrendingUp, FiAlertTriangle, FiPlusCircle,
  FiEdit3, FiBarChart2, FiShoppingCart
} from "react-icons/fi";
import { MdOutlineLocalPharmacy } from "react-icons/md";

const BASE = "http://localhost:8080/api";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalStock: 0,
    lowStock: [],
    topSelling: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchShop(); }, []);

  const fetchShop = async () => {
    try {
      const res = await fetch(`${BASE}/seller/shop`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setShop(data);
        fetchStats(data.shopId);
      } else setShop(null);
    } catch {
      setShop(null);
    } finally {
      setLoading(false);
    }
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
        lowStock: low || [],
        topSelling: top || [],
      });

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen px-[8vw] pt-28 pb-20 text-white
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">

      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back,
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent ml-2">
              {user?.username}
            </span>
          </h1>
          <p className="text-gray-400 mt-1">Manage your pharmacy dashboard</p>
        </div>

        {shop && (
          <div className="flex items-center gap-2 px-4 py-1 rounded-xl
            bg-white/5 backdrop-blur border border-white/10">
            <span className={`w-2 h-2 rounded-full ${shop.isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-sm">{shop.isOpen ? "Open" : "Closed"}</span>
          </div>
        )}
      </div>

      {/* NO SHOP */}
      {!shop && (
        <div className="flex flex-col items-center py-24 gap-6">
          <MdOutlineLocalPharmacy className="text-7xl text-gray-600" />
          <h2 className="text-xl text-gray-400">No shop found</h2>
          <button className="px-6 py-3 rounded-xl font-semibold text-black
            bg-gradient-to-r from-emerald-400 to-cyan-400
            shadow-lg shadow-emerald-500/30 hover:scale-105 transition">
            Create Shop
          </button>
        </div>
      )}

      {/* DASHBOARD */}
      {shop && (
        <>
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {[
              { icon: FiPackage, label: "Medicines", value: stats.totalMedicines },
              { icon: FiBarChart2, label: "Stock", value: stats.totalStock },
              { icon: FiAlertTriangle, label: "Low Stock", value: stats.lowStock.length },
              { icon: FiTrendingUp, label: "Top Selling", value: stats.topSelling.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10
                shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-300">

                <Icon className="text-emerald-400 text-2xl mb-2" />

                <div className="text-3xl font-extrabold">{value}</div>
                <div className="text-xs text-gray-400 uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: FiPlusCircle, label: "Add Medicine", path: "/seller/medicines" },
              { icon: FiShoppingCart, label: "Billing", path: "/seller/billing" },
              { icon: FiBarChart2, label: "Analytics", path: "/seller/analytics" },
              { icon: FiEdit3, label: "Edit Shop" },
            ].map(({ icon: Icon, label, path }) => (
              <button key={label}
                onClick={() => path && navigate(path)}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10
                hover:scale-[1.03] hover:shadow-xl transition-all duration-300">

                <Icon className="text-cyan-400 text-xl mb-2" />
                <div className="text-sm">{label}</div>
              </button>
            ))}
          </div>

          {/* LOW STOCK */}
          {stats.lowStock.length > 0 && (
            <div className="p-6 mb-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
              <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                <FiAlertTriangle /> Low Stock Alert
              </h3>

              <div className="grid md:grid-cols-3 gap-3">
                {stats.lowStock.map((m) => (
                  <div key={m.medicineId}
                    className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                    <p className="text-white text-sm">{m.medicineName}</p>
                    <p className="text-yellow-400 text-xs">Only {m.quantity} left</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOP SELLING */}
          {stats.topSelling.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
              <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <FiTrendingUp /> Top Selling
              </h3>

              <div className="space-y-3">
                {stats.topSelling.map((m, i) => (
                  <div key={m.medicineId}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#1e293b]">

                    <span className="text-sm font-bold text-gray-400">#{i + 1}</span>

                    <div className="flex-1">
                      <p className="text-white text-sm">{m.medicineName}</p>
                      <p className="text-gray-400 text-xs">₹{m.specialPrice}</p>
                    </div>

                    <span className="text-xs px-2 py-1 rounded-full
                      bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold">
                      {m.salesCount} sold
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerDashboard;