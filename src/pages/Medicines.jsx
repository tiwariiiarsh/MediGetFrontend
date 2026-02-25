import { useEffect, useState } from "react";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const userLat = 28.61;
  const userLng = 77.2;

  useEffect(() => {
    fetchAllMedicines(page);
  }, [page]);

  // ================= FETCH PAGINATED =================
  const fetchAllMedicines = async (pageNumber = 0) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/public/medicines?pageNumber=${pageNumber}&pageSize=8&sortBy=medicineId&sortOrder=asc`
      );

      const data = await res.json();

      console.log("PAGINATED RESPONSE:", data);

      setMedicines(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.pageNumber || 0);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ================= SEARCH NEARBY =================
  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/public/medicines/nearby?keyword=${keyword}&userLat=${userLat}&userLng=${userLng}&radiusKm=${radius}`
      );

      const data = await res.json();

      console.log("SEARCH RESPONSE:", data);

      setMedicines(Array.isArray(data) ? data : []);
      setTotalPages(0); // disable pagination on search

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-[4vw] pt-32 pb-20 text-white">

      {/* ================= FILTER SECTION ================= */}
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

      {/* ================= MEDICINE GRID ================= */}
      {loading ? (
        <p className="text-center text-gray-400">Loading medicines...</p>
      ) : medicines.length === 0 ? (
        <p className="text-center text-gray-400">
          No medicines found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {medicines.map((med) => (
              <div
                key={med.medicineId}
                className="bg-[#0f172a] rounded-2xl overflow-hidden
                           border border-white/10
                           shadow-[0_0_30px_rgba(16,185,129,0.12)]
                           hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]
                           transition duration-300"
              >

                {/* IMAGE */}
                <div className="h-48 bg-[#1e293b] flex items-center justify-center overflow-hidden">
                  <img
                    src={med.image}
                    alt={med.medicineName}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h2 className="text-lg font-semibold mb-2 text-emerald-400">
                    {med.medicineName}
                  </h2>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {med.description}
                  </p>

                  {/* PRICE */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl font-bold text-white">
                      ₹{med.specialPrice}
                    </span>

                    <span className="line-through text-gray-500 text-sm">
                      ₹{med.price}
                    </span>

                    <span className="text-red-400 text-sm font-semibold">
                      {med.discount}% OFF
                    </span>
                  </div>

                  {/* SHOP INFO */}
                  <div className="text-sm text-gray-400 mb-3">
                    <p>
                      🏥 <span className="text-white font-medium">
                        {med.shopName}
                      </span>
                    </p>

                    <p>📍 {med.shopCity}</p>

                    {med.distance !== null &&
                      med.distance !== undefined && (
                        <p className="text-cyan-400">
                          🚗 {med.distance.toFixed(2)} km away
                        </p>
                      )}
                  </div>

                  {/* BUTTON */}
                  <button
                    className="w-full py-2 rounded-lg font-semibold
                               bg-gradient-to-r from-emerald-400 to-cyan-400
                               text-black hover:scale-105 transition"
                  >
                    Check Shop
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-3">

              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`px-4 py-2 rounded ${
                    page === index
                      ? "bg-emerald-400 text-black"
                      : "bg-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}

        </>
      )}
    </div>
  );
};

export default Medicines;