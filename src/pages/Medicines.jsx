import { useEffect, useState } from "react";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState(5);
  const [isSearching, setIsSearching] = useState(false);

  const userLat = 28.61;
  const userLng = 77.2;

  // ================= FETCH PAGINATED =================
  const fetchMedicines = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setIsSearching(false);

      const res = await fetch(
        `http://localhost:8080/api/public/medicines?pageNumber=${pageNumber}&pageSize=4`
      );

      const data = await res.json();

      setMedicines(data.content || []);
      setTotalPages(data.totalPages || 0);

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
      setIsSearching(true);
      setPage(0);

      const res = await fetch(
        `http://localhost:8080/api/public/medicines/nearby?keyword=${keyword}&userLat=${userLat}&userLng=${userLng}&radiusKm=${radius}`
      );

      const data = await res.json();

      setMedicines(Array.isArray(data) ? data : []);
      setTotalPages(0); // pagination off in search

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Load pagination only if not searching
  useEffect(() => {
    if (!isSearching) {
      fetchMedicines(page);
    }
  }, [page]);

  return (
    <div className="min-h-screen px-[8vw] pt-32 pb-20 text-white">

      {/* ================= SEARCH SECTION ================= */}
      <div className="bg-[#0f172a] p-6 rounded-xl mb-12 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search medicine..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#1e293b]"
          />

          <input
            type="number"
            placeholder="Radius (km)"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-32 px-4 py-3 rounded-lg bg-[#1e293b]"
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-lg font-semibold
                       bg-gradient-to-r from-emerald-400 to-cyan-400
                       text-black hover:scale-105 transition"
          >
            Search
          </button>

          <button
            onClick={() => {
              setKeyword("");
              setRadius(5);
              setIsSearching(false);
              fetchMedicines(0);
            }}
            className="px-6 py-3 rounded-lg bg-red-700"
          >
            Reset
          </button>

        </div>
      </div>

      {/* ================= GRID ================= */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {medicines.length === 0 ? (
              <p>No medicines found</p>
            ) : (
              medicines.map((med) => (
                <div
                  key={med.medicineId}
                  className="bg-[#0f172a] p-5 rounded-2xl border border-white/10
                             hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
                             hover:scale-105 transition duration-300"
                >
                  {/* IMAGE */}
                  <div className="h-40 bg-[#1e293b] rounded-xl overflow-hidden">
                    <img
                      src={med.image}
                      alt={med.medicineName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-emerald-400">
                    {med.medicineName}
                  </h2>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {med.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-white font-bold">
                      ₹{med.specialPrice}
                    </span>

                    <span className="line-through text-gray-500 text-sm">
                      ₹{med.price}
                    </span>

                    <span className="text-red-400 text-sm">
                      {med.discount}% OFF
                    </span>
                  </div>

                  {/* SHOP INFO */}
                  <div className="mt-3 text-sm text-gray-400">
                    <p>
                      🏥 <span className="text-white">
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

                  <button
                    className="mt-4 w-full py-2 rounded-xl
                               bg-gradient-to-r from-emerald-400 to-cyan-400
                               text-black font-semibold"
                  >
                    Check Shop
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ================= PAGINATION ================= */}
          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-3">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(page + 1)}
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