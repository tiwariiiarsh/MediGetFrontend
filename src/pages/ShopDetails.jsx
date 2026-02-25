import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import arshMedicalStore from "../assets/arsh.jpeg";
import mediGet1 from "../assets/mediget1.jpg";
const ShopDetails = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const medicinesPerPage = 8;

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/public/shop/${shopId}`
        );

        if (!res.ok) throw new Error("Shop not found");

        const data = await res.json();
        setShop(data);
      } catch (err) {
        console.error(err);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading shop details...
      </div>
    );

  if (!shop)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Shop not found.
      </div>
    );

  // 🔎 SEARCH FILTER
  const filteredMedicines = shop.medicines?.filter((med) =>
    med.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 PAGINATION LOGIC
  const indexOfLast = currentPage * medicinesPerPage;
  const indexOfFirst = indexOfLast - medicinesPerPage;
  const currentMedicines = filteredMedicines?.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    (filteredMedicines?.length || 0) / medicinesPerPage
  );

  return (
    <div className="min-h-screen px-[8vw] pt-32 pb-20 text-white">

      {/* ================= SHOP HEADER ================= */}
      <div className="grid md:grid-cols-2 gap-10 bg-[#0f172a] p-8 rounded-2xl border border-white/10 mb-16">

        <div>
          <h1 className="text-3xl font-bold text-emerald-400 mb-6">
            {shop.shopName}
          </h1>

          <p className="text-gray-400 mb-2">🏢 {shop.buildingName}</p>
          <p className="text-gray-400 mb-2">
            📍 {shop.street}, {shop.city}
          </p>
          <p className="text-gray-400 mb-2">
            {shop.state}, {shop.country} - {shop.pincode}
          </p>

          {/* 🚗 Directions Button */}
          <button
            onClick={() => {
              if (!navigator.geolocation) {
                alert("Geolocation not supported");
                return;
              }

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const userLat = position.coords.latitude;
                  const userLng = position.coords.longitude;

                  const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${shop.latitude},${shop.longitude}&travelmode=driving`;

                  window.open(url, "_blank");
                },
                () => {
                  alert("Please allow location access");
                }
              );
            }}
            className="mt-6 px-6 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-emerald-400 to-cyan-400
                       text-black hover:scale-105 transition"
          >
            🚗 Get Directions
          </button>
        </div>

        {/* 🏥 Static Shop Image */}
        <div className="h-96 bg-[#1e293b] rounded-xl overflow-hidden">
          <img
            src={arshMedicalStore}
            alt={shop.shopName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ================= MEDICINES SECTION ================= */}
      <h2 className="text-2xl font-semibold mb-6">
        Available Medicines
      </h2>

      {/* 🔎 SEARCH BAR */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search medicine..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 w-72 rounded-lg bg-[#1e293b] text-white outline-none"
        />
      </div>

      {/* 💊 MEDICINE GRID */}
      {currentMedicines?.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentMedicines?.map((med) => (
            <div
              key={med.medicineId}
              className="bg-[#0f172a] p-5 rounded-2xl border border-white/10
                         hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
                         hover:scale-105 transition duration-300"
            >
              <div className="h-40 bg-[#1e293b] rounded-xl overflow-hidden">
                <img
                  // src={
                  //   med.image
                  //     ? `http://localhost:8080/images/${med.image}`
                  //     : "https://via.placeholder.com/200"
                  // }
                  src={mediGet1}
                  alt={med.medicineName}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-emerald-400">
                {med.medicineName}
              </h3>

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

              <p className="mt-2 text-sm text-gray-400">
                Stock: {med.quantity}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 📄 PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-emerald-400 text-black"
                  : "bg-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopDetails;