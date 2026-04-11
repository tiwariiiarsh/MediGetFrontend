// src/pages/seller/SellerAnalytics.jsx
// Monthly revenue, best/least selling, low stock visualized
import { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiAlertTriangle, FiDollarSign } from "react-icons/fi";

const BASE = "http://localhost:8080/api";

const SellerAnalytics = () => {
  const [shopId, setShopId] = useState(null);
  const [topSelling, setTopSelling] = useState([]);
  const [leastSelling, setLeastSelling] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const r = await fetch(`${BASE}/seller/shop`, { credentials: "include" });
      if (r.ok) {
        const s = await r.json();
        setShopId(s.shopId);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    Promise.all([
      fetch(`${BASE}/seller/shop/${shopId}/analytics/top-selling`, { credentials: "include" }).then(r => r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/least-selling`, { credentials: "include" }).then(r => r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/revenue`, { credentials: "include" }).then(r => r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/low-stock?threshold=${threshold}`, { credentials: "include" }).then(r => r.json()),
    ]).then(([top, least, rev, low]) => {
      setTopSelling(Array.isArray(top) ? top : []);
      setLeastSelling(Array.isArray(least) ? least : []);
      setRevenue(Array.isArray(rev) ? rev : []);
      setLowStock(Array.isArray(low) ? low : []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [shopId, threshold]);

  const maxSales = Math.max(...topSelling.map(m => m.salesCount || 0), 1);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen px-[8vw] pt-28 pb-20 text-white">

      <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FiTrendingUp className="text-emerald-400" /> Analytics
        </h1>
        <p className="text-gray-400 text-sm mt-1">Monthly performance — sales, revenue, stock insights</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* ── TOP SELLING ── */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-emerald-400 mb-5 flex items-center gap-2">
            <FiTrendingUp /> Top Selling Medicines
          </h2>
          {topSelling.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No sales data yet.</p>
          ) : (
            <div className="space-y-4">
              {topSelling.map((med, i) => (
                <div key={med.medicineId}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold w-6 ${
                        i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500"
                      }`}>#{i + 1}</span>
                      <span className="text-white text-sm">{med.medicineName}</span>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold">
                      {med.salesCount || 0} sold
                    </span>
                  </div>
                  {/* BAR */}
                  <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${((med.salesCount || 0) / maxSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── LEAST SELLING ── */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-yellow-400 mb-5 flex items-center gap-2">
            <FiTrendingDown /> Least Selling Medicines
          </h2>
          {leastSelling.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {leastSelling.map((med) => (
                <div key={med.medicineId}
                  className="flex items-center justify-between bg-[#1e293b] rounded-xl px-4 py-3">
                  <div>
                    <p className="text-white text-sm font-medium">{med.medicineName}</p>
                    <p className="text-gray-500 text-xs">Stock: {med.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 text-sm font-bold">{med.salesCount || 0} sold</p>
                    <p className="text-gray-500 text-xs">₹{med.specialPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── MONTHLY REVENUE ── */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-cyan-400 mb-5 flex items-center gap-2">
            <FiDollarSign /> Monthly Sales Report
          </h2>
          {revenue.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No sales this month.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="py-2 text-left">Medicine</th>
                    <th className="py-2 text-right">Qty Sold</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-2.5 text-white">{row.medicineName}</td>
                      <td className="py-2.5 text-right text-emerald-400 font-bold">
                        {row.totalSold}
                      </td>
                      <td className="py-2.5 text-right text-cyan-400">
                        {row.revenue ? `₹${row.revenue.toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── LOW STOCK ── */}
        <div className="bg-[#0f172a] border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-yellow-400 flex items-center gap-2">
              <FiAlertTriangle /> Low Stock Alert
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Threshold:</span>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-lg bg-[#1e293b] text-white text-center
                           border border-white/10 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {lowStock.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-emerald-400">✅ All medicines are well stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStock.map((med) => (
                <div key={med.medicineId}
                  className="flex items-center justify-between bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-white text-sm font-medium">{med.medicineName}</p>
                    <p className="text-gray-500 text-xs">{med.description?.slice(0, 50)}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
                      {med.quantity} left
                    </span>
                    {med.expiryDate && (
                      <p className="text-gray-600 text-xs mt-1">
                        Exp: {new Date(med.expiryDate).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SellerAnalytics;