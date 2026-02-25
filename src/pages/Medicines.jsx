import { useEffect, useState } from "react";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);

  const userLat = 28.61;
  const userLng = 77.20;

  useEffect(() => {
    fetchAllMedicines();
  }, []);

  // ✅ SAFE DATA HANDLER
  const extractArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.content)) return data.content;
    return [];
  };

  // 🔥 FETCH ALL
  const fetchAllMedicines = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8080/api/public/medicines"
      );
      const data = await res.json();

      console.log("All Medicines Response:", data);

      setMedicines(extractArray(data));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🔥 SEARCH WITH RADIUS
  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/public/medicines/nearby?keyword=${keyword}&userLat=${userLat}&userLng=${userLng}&radiusKm=${radius}`
      );
      const data = await res.json();

      console.log("Search Response:", data);

      setMedicines(extractArray(data));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-[8vw] pt-32 pb-20 text-white">

      {/* 🔍 FILTER SECTION */}
      <div className="bg-[#0f172a] p-6 rounded-xl mb-12 border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search medicine..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#1e293b] outline-none border border-white/10"
          />

          <input
            type="number"
            placeholder="Radius (km)"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-32 px-4 py-3 rounded-lg bg-[#1e293b] outline-none border border-white/10"
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-lg font-semibold
                       bg-gradient-to-r from-emerald-400 to-cyan-400
                       text-black hover:scale-105 transition"
          >
            Search
          </button>

        </div>
      </div>

      {/* 🩺 MEDICINE GRID */}
      {loading ? (
        <p className="text-center text-gray-400">Loading medicines...</p>
      ) : medicines.length === 0 ? (
        <p className="text-center text-gray-400">
          No medicines found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {medicines.map((med) => (
            <div
              key={med.id}
              className="bg-[#0f172a] rounded-2xl overflow-hidden
                         border border-white/10
                         shadow-[0_0_30px_rgba(16,185,129,0.15)]
                         hover:scale-105 transition duration-300"
            >

              {/* Image */}
              <div className="h-48 bg-[#1e293b] flex items-center justify-center">
                <img
                  src={med.image}
                  alt={med.medicineName}
                  className="h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">

                <h2 className="text-lg font-semibold mb-2">
                  {med.medicineName}
                </h2>

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {med.description}
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-emerald-400">
                    ₹{med.specialPrice}
                  </span>

                  <span className="line-through text-gray-500 text-sm">
                    ₹{med.price}
                  </span>

                  <span className="text-red-400 text-sm">
                    {med.discount}% OFF
                  </span>
                </div>

                <button
                  className="w-full py-2 rounded-lg font-semibold
                             bg-gradient-to-r from-emerald-400 to-cyan-400
                             text-black hover:opacity-90 transition"
                >
                  Add to Cart
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Medicines;