// SellerAnalytics.jsx (Premium UI)

import { useEffect, useState } from "react";
import {
  FiTrendingUp, FiTrendingDown, FiAlertTriangle, FiDollarSign
} from "react-icons/fi";

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
    fetch(`${BASE}/seller/shop`, { credentials: "include" })
      .then(r => r.json())
      .then(s => setShopId(s.shopId));
  }, []);

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);

    Promise.all([
      fetch(`${BASE}/seller/shop/${shopId}/analytics/top-selling`, { credentials: "include" }).then(r => r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/least-selling`, { credentials: "include" }).then(r => r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/revenue`, { credentials: "include" }).then(r => r.json()),
      fetch(`${BASE}/seller/shop/${shopId}/analytics/low-stock?threshold=${threshold}`, { credentials: "include" }).then(r => r.json()),
    ])
      .then(([top, least, rev, low]) => {
        setTopSelling(top || []);
        setLeastSelling(least || []);
        setRevenue(rev || []);
        setLowStock(low || []);
      })
      .finally(() => setLoading(false));

  }, [shopId, threshold]);

  const maxSales = Math.max(...topSelling.map(m => m.salesCount || 0), 1);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen px-[8vw] pt-28 pb-20 text-white
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiTrendingUp className="text-emerald-400" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Track sales, revenue & inventory insights</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* TOP SELLING */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
          <h2 className="text-emerald-400 font-bold mb-5 flex items-center gap-2">
            <FiTrendingUp /> Top Selling
          </h2>

          {topSelling.map((med, i) => (
            <div key={med.medicineId} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{med.medicineName}</span>
                <span className="text-xs text-emerald-400 font-bold">
                  {med.salesCount} sold
                </span>
              </div>

              <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  style={{ width: `${(med.salesCount / maxSales) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* LEAST SELLING */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
          <h2 className="text-yellow-400 font-bold mb-5 flex items-center gap-2">
            <FiTrendingDown /> Least Selling
          </h2>

          {leastSelling.map((med) => (
            <div key={med.medicineId}
              className="flex justify-between p-3 rounded-xl bg-[#1e293b] mb-3 hover:scale-[1.02] transition">

              <div>
                <p className="text-sm text-white">{med.medicineName}</p>
                <p className="text-xs text-gray-400">Stock: {med.quantity}</p>
              </div>

              <div className="text-right">
                <p className="text-yellow-400 text-sm">{med.salesCount}</p>
                <p className="text-xs text-gray-400">₹{med.specialPrice}</p>
              </div>
            </div>
          ))}
        </div>

        {/* REVENUE */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
          <h2 className="text-cyan-400 font-bold mb-5 flex items-center gap-2">
            <FiDollarSign /> Revenue
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="py-2 text-left">Medicine</th>
                <th className="py-2 text-right">Sold</th>
                <th className="py-2 text-right">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {revenue.map((r, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 text-white">{r.medicineName}</td>
                  <td className="py-2 text-right text-emerald-400">{r.totalSold}</td>
                  <td className="py-2 text-right text-cyan-400">
                    ₹{r.revenue?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LOW STOCK */}
        <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 shadow-lg">
          <div className="flex justify-between mb-5">
            <h2 className="text-yellow-400 font-bold flex gap-2">
              <FiAlertTriangle /> Low Stock
            </h2>

            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-16 text-center bg-[#1e293b] rounded-lg"
            />
          </div>

          {lowStock.map((med) => (
            <div key={med.medicineId}
              className="flex justify-between p-3 rounded-xl bg-yellow-500/5 mb-3">

              <div>
                <p className="text-white text-sm">{med.medicineName}</p>
              </div>

              <span className="text-yellow-400 text-xs">
                {med.quantity} left
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SellerAnalytics;