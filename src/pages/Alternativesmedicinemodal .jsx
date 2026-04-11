// src/components/AlternativesMedicineModal.jsx
// Shows alternatives for a medicine, sorted by sales count
import { useEffect, useState } from "react";
import { FiX, FiRefreshCw } from "react-icons/fi";
import vitaminc from "../assets/vitamin c.jpeg";

const AlternativesMedicineModal = ({ medicine, userLocation, onClose, onViewShop }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        const params = userLocation
          ? `?userLat=${userLocation.lat}&userLng=${userLocation.lng}`
          : "";
        const res = await fetch(
          `http://localhost:8080/api/public/medicines/${medicine.medicineId}/alternatives${params}`
        );
        const data = await res.json();
        setAlternatives(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setAlternatives([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlternatives();
  }, [medicine.medicineId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
         onClick={onClose}>
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* MODAL */}
      <div
        className="relative z-10 w-full max-w-2xl bg-[#0f172a] border border-white/10
                   rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.2)] p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Alternatives for{" "}
              <span className="text-emerald-400">{medicine.medicineName}</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Sorted by popularity — most sold first
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-red-500/20 hover:text-red-400 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : alternatives.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FiRefreshCw className="mx-auto text-4xl mb-3 text-gray-600" />
            <p>No alternatives found nearby.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alternatives.map((alt) => (
              <div
                key={alt.medicineId}
                className="bg-[#1e293b] rounded-xl border border-white/10
                           hover:border-emerald-400/30 transition p-4 flex gap-4"
              >
                <img
                  src={alt.image || vitaminc}
                  alt={alt.medicineName}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = vitaminc; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-emerald-400 font-semibold text-sm truncate">
                    {alt.medicineName}
                  </h3>
                  <div className="flex items-center gap-2 my-1">
                    <span className="text-white font-bold text-sm">₹{alt.specialPrice?.toFixed(2)}</span>
                    {alt.discount > 0 && (
                      <span className="text-red-400 text-xs">{alt.discount}% OFF</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">🏥 {alt.shopName}</p>
                  {alt.distance != null && (
                    <p className="text-cyan-400 text-xs">🚗 {alt.distance.toFixed(1)} km</p>
                  )}
                  {alt.salesCount > 0 && (
                    <p className="text-yellow-400 text-xs">🔥 {alt.salesCount} sold</p>
                  )}
                  <button
                    onClick={() => { onViewShop(alt.shopId); onClose(); }}
                    className="mt-2 text-xs px-3 py-1.5 rounded-lg
                               bg-gradient-to-r from-emerald-400 to-cyan-400
                               text-black font-semibold hover:scale-105 transition"
                  >
                    View Shop
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlternativesMedicineModal;