// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import vitaminc from "../assets/vitamin c.jpeg";

// const Medicines = () => {
//   const navigate = useNavigate();
//   const [medicines, setMedicines] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [keyword, setKeyword] = useState("");
//   const [radius, setRadius] = useState(5);
//   const [isSearching, setIsSearching] = useState(false);

//   const [userLocation, setUserLocation] = useState(null);
//   const [locationError, setLocationError] = useState("");

//   // ================= GET USER LOCATION =================
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setLocationError("Geolocation not supported by browser.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       (error) => {
//         setLocationError("Location permission denied.");
//         console.error(error);
//       }
//     );
//   }, []);

//   // ================= FETCH PAGINATED =================
//   const fetchMedicines = async (pageNumber = 0, pageSize = 12) => {
//     try {
//       setLoading(true);
//       setIsSearching(false);

//       const res = await fetch(
//         `http://localhost:8080/api/public/medicines?pageNumber=${pageNumber}&pageSize=${pageSize}`
//       );

//       const data = await res.json();

//       setMedicines(data.content || []);
//       setTotalPages(data.totalPages || 0);

//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   // ================= SEARCH NEARBY =================
//   const handleSearch = async () => {
//     if (!userLocation) {
//       alert("Please enable location to search nearby medicines.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setIsSearching(true);
//       setPage(0);

//       const res = await fetch(
//         `http://localhost:8080/api/public/medicines/nearby?keyword=${keyword}&userLat=${userLocation.lat}&userLng=${userLocation.lng}&radiusKm=${radius}`
//       );

//       const data = await res.json();

//       setMedicines(Array.isArray(data) ? data : []);
//       setTotalPages(0);

//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   // ================= RESET =================
//   const handleReset = () => {
//     setKeyword("");
//     setRadius(5);
//     setIsSearching(false);
//     setPage(0);
//     fetchMedicines(0);
//   };

//   // ================= AUTO LOAD PAGINATION =================
//   useEffect(() => {
//     if (!isSearching) {
//       fetchMedicines(page);
//     }
//   }, [page]);

//   return (
//     <div className="min-h-screen px-[8vw] pt-32 pb-20 text-white">

//       {/* ================= LOCATION STATUS ================= */}
//       {locationError && (
//         <p className="text-red-400 mb-4">{locationError}</p>
//       )}

//       {/* ================= SEARCH SECTION ================= */}
//       <div className="bg-[#0f172a] p-6 rounded-xl mb-12 border border-white/10">
//         <div className="flex flex-col md:flex-row gap-4">

//           <input
//             type="text"
//             placeholder="Search medicine..."
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             className="flex-1 px-4 py-3 rounded-lg bg-[#1e293b]"
//           />

//           <input
//             type="number"
//             placeholder="Radius (km)"
//             value={radius}
//             onChange={(e) => setRadius(e.target.value)}
//             className="w-32 px-4 py-3 rounded-lg bg-[#1e293b]"
//           />

//           <button
//             onClick={handleSearch}
//             className="px-6 py-3 rounded-lg font-semibold
//                        bg-gradient-to-r from-emerald-400 to-cyan-400
//                        text-black hover:scale-105 transition"
//           >
//             Search Nearby
//           </button>

//           <button
//             onClick={handleReset}
//             className="px-6 py-3 rounded-lg bg-red-700"
//           >
//             Reset
//           </button>

//         </div>
//       </div>

//       {/* ================= GRID ================= */}
//       {loading ? (
//         <p className="text-center text-gray-400">Loading...</p>
//       ) : (
//         <>
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

//             {medicines.length === 0 ? (
//               <p>No medicines found</p>
//             ) : (
//               medicines.map((med) => (
//                 <div
//                   key={med.medicineId}
//                   className="bg-[#0f172a] p-5 rounded-2xl border border-white/10
//                              hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
//                              hover:scale-105 transition duration-300"
//                 >
//                   <div className="h-40 bg-[#1e293b] rounded-xl overflow-hidden">
//                     <img
//                       // src={med.image}
//                       src={vitaminc}
//                       alt={med.medicineName}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>

//                   <h2 className="mt-4 text-lg font-semibold text-emerald-400">
//                     {med.medicineName}
//                   </h2>

//                   <p className="text-gray-400 text-sm line-clamp-2">
//                     {med.description}
//                   </p>

//                   <div className="mt-3 flex items-center gap-2">
//                     <span className="text-white font-bold">
//                       ₹{med.specialPrice}
//                     </span>

//                     <span className="line-through text-gray-500 text-sm">
//                       ₹{med.price}
//                     </span>

//                     <span className="text-red-400 text-sm">
//                       {med.discount}% OFF
//                     </span>
//                   </div>

//                   <div className="mt-3 text-sm text-gray-400">
//                     <p>🏥 {med.shopName}</p>
//                     <p>📍 {med.shopCity}</p>

//                     {med.distance !== null &&
//                       med.distance !== undefined && (
//                         <p className="text-cyan-400">
//                           🚗 {med.distance.toFixed(2)} km away
//                         </p>
//                       )}
//                   </div>

//                   {/* <button
//                     className="mt-4 w-full py-2 rounded-xl
//                                bg-gradient-to-r from-emerald-400 to-cyan-400
//                                text-black font-semibold"
//                   >
//                     Check Shop
//                   </button> */}
//                   {/* console.log(med); */}
//                  <button
//   onClick={() => {
//     if (med.shopId) {
//       navigate(`/shop/${med.shopId}`);
//     } else {
//       alert("Shop ID not available");
//     }
//   }}
//   className="mt-4 w-full py-2 rounded-xl
//              bg-gradient-to-r from-emerald-400 to-cyan-400
//              text-black font-semibold"
// >
//   Check Shop
// </button>

                  
//                 </div>
//               ))
//             )}
//           </div>

//           {/* ================= PAGINATION ================= */}
//           {!isSearching && totalPages > 1 && (
//             <div className="flex justify-center mt-12 gap-3">
//               <button
//                 disabled={page === 0}
//                 onClick={() => setPage(page - 1)}
//                 className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
//               >
//                 Prev
//               </button>

//               {[...Array(totalPages)].map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setPage(index)}
//                   className={`px-4 py-2 rounded ${
//                     page === index
//                       ? "bg-emerald-400 text-black"
//                       : "bg-gray-700"
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}

//               <button
//                 disabled={page === totalPages - 1}
//                 onClick={() => setPage(page + 1)}
//                 className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Medicines;



// // import { FaExclamationTriangle } from "react-icons/fa";
// // import { useSelector } from "react-redux";
// // import Filter from "../components/Filter";
// // import MedicineCard from "../components/MedicineCard";
// // import Loader from "../shared/Loader";
// // import Paginations from "../components/Pagination";

// // const Medicines = () => {

// //   const { medicines, pagination } = useSelector(
// //     (state) => state.medicine
// //   );

// //   const { isLoading, errorMessage } = useSelector(
// //     (state) => state.error
// //   );

// //   // 🔥 Custom hook handles fetching
// //   Filter();

// //   return (
// //     <div className="lg:px-14 sm:px-8 px-4 py-14 bg-gray-800 min-h-screen">

// //       {/* FILTER */}
// //       <Filter />

// //       {isLoading ? (
// //         <Loader />
// //       ) : errorMessage ? (
// //         <div className="flex justify-center items-center h-[200px]">
// //           <FaExclamationTriangle className="text-slate-800 text-3xl mr-2" />
// //           <span className="text-slate-800 text-lg font-medium">
// //             {errorMessage}
// //           </span>
// //         </div>
// //       ) : (
// //         <div className="min-h-[700px]">

// //           {/* GRID */}
// //           <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-4 sm:grid-cols-3 gap-y-6 gap-x-6">
// //             {medicines &&
// //               medicines.map((item) => (
// //                 <MedicineCard key={item.medicineId} {...item} />
// //               ))}
// //           </div>

// //           {/* PAGINATION */}
// //           <div className="flex justify-center pt-10">
// //             <Paginations
// //               numberOfPage={pagination?.totalPages}
// //               totalProducts={pagination?.totalElements}
// //             />
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Medicines;



// src/pages/Medicines.jsx — UPDATED with alternatives, better UI
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import AlternativesMedicineModal from "../components/AlternativesMedicineModal";
import vitaminc from "../assets/vitamin c.jpeg";

const Medicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState(5);
  const [isSearching, setIsSearching] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Alternatives modal
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location permission denied.")
    );
  }, []);

  const fetchMedicines = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setIsSearching(false);
      const res = await fetch(
        `http://localhost:8080/api/public/medicines?pageNumber=${pageNumber}&pageSize=12`
      );
      const data = await res.json();
      setMedicines(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!userLocation) {
      alert("Please enable location to search nearby medicines.");
      return;
    }
    try {
      setLoading(true);
      setIsSearching(true);
      setPage(0);
      const res = await fetch(
        `http://localhost:8080/api/public/medicines/nearby?keyword=${keyword}&userLat=${userLocation.lat}&userLng=${userLocation.lng}&radiusKm=${radius}`
      );
      const data = await res.json();
      setMedicines(Array.isArray(data) ? data : []);
      setTotalPages(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setRadius(5);
    setIsSearching(false);
    setPage(0);
    fetchMedicines(0);
  };

  useEffect(() => {
    if (!isSearching) fetchMedicines(page);
  }, [page]);

  const openAlternatives = (med) => {
    setSelectedMedicine(med);
    setShowAlternatives(true);
  };

  return (
    <div className="min-h-screen px-[8vw] pt-32 pb-20 text-white">

      {/* ── HEADER ── */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Find <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Medicines
          </span>
        </h1>
        <p className="text-gray-400 mt-2">
          Search nearby pharmacies in real-time with live stock info
        </p>
      </div>

      {/* ── LOCATION BANNER ── */}
      {locationError && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 mb-6 text-red-400">
          <FiAlertCircle />
          <span>{locationError}</span>
        </div>
      )}
      {userLocation && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm mb-6">
          <FiMapPin className="animate-pulse" />
          <span>Location detected — searching nearby pharmacies</span>
        </div>
      )}

      {/* ── SEARCH BAR ── */}
      <div className="bg-[#0f172a]/80 backdrop-blur border border-white/10 rounded-2xl p-5 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicine name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1e293b] text-white
                         border border-white/10 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <div className="relative w-44">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Radius (km)"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1e293b] text-white
                         border border-white/10 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-7 py-3 rounded-xl font-semibold text-black
                       bg-gradient-to-r from-emerald-400 to-cyan-400
                       hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]
                       hover:scale-[1.02] transition duration-200"
          >
            Search Nearby
          </button>

          <button
            onClick={handleReset}
            className="px-5 py-3 rounded-xl bg-[#1e293b] border border-white/10
                       hover:bg-red-500/20 hover:border-red-500/40 transition flex items-center gap-2"
          >
            <FiRefreshCw />
            Reset
          </button>
        </div>
      </div>

      {/* ── GRID ── */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {medicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MdOutlineLocalPharmacy className="text-6xl mb-4 text-gray-600" />
              <p>No medicines found. Try a different keyword or radius.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {medicines.map((med) => (
                <MedicineCard
                  key={med.medicineId}
                  med={med}
                  onViewShop={() => med.shopId
                    ? navigate(`/shop/${med.shopId}`)
                    : alert("Shop ID not available")}
                  onAlternatives={() => openAlternatives(med)}
                />
              ))}
            </div>
          )}

          {/* ── PAGINATION ── */}
          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-[#1e293b] rounded-lg disabled:opacity-30 hover:bg-[#334155] transition"
              >
                ← Prev
              </button>

              {[...Array(Math.min(totalPages, 7))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    page === index
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black"
                      : "bg-[#1e293b] hover:bg-[#334155]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-[#1e293b] rounded-lg disabled:opacity-30 hover:bg-[#334155] transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── ALTERNATIVES MODAL ── */}
      {showAlternatives && selectedMedicine && (
        <AlternativesMedicineModal
          medicine={selectedMedicine}
          userLocation={userLocation}
          onClose={() => setShowAlternatives(false)}
          onViewShop={(shopId) => navigate(`/shop/${shopId}`)}
        />
      )}
    </div>
  );
};

// ── MEDICINE CARD COMPONENT (inline) ──────────────────────────────────────────
const MedicineCard = ({ med, onViewShop, onAlternatives }) => {
  const stockColor =
    med.quantity > 50 ? "text-emerald-400" :
    med.quantity > 10 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="group bg-[#0f172a] rounded-2xl border border-white/10
                    hover:border-emerald-400/40
                    hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]
                    transition duration-300 overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div className="h-44 bg-[#1e293b] overflow-hidden relative">
        <img
          src={med.image || vitaminc}
          alt={med.medicineName}
          className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => { e.target.src = vitaminc; }}
        />
        {med.discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {med.discount}% OFF
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-base font-bold text-emerald-400 leading-tight mb-1">
          {med.medicineName}
        </h2>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{med.description}</p>

        {/* PRICE */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-bold text-lg">₹{med.specialPrice?.toFixed(2)}</span>
          {med.price !== med.specialPrice && (
            <span className="line-through text-gray-600 text-sm">₹{med.price}</span>
          )}
        </div>

        {/* META */}
        <div className="text-xs text-gray-500 space-y-1 mb-3">
          {med.shopName && <p className="flex items-center gap-1"><span>🏥</span>{med.shopName}</p>}
          {med.shopCity && <p className="flex items-center gap-1"><span>📍</span>{med.shopCity}</p>}
          {med.distance != null && (
            <p className="text-cyan-400 font-medium flex items-center gap-1">
              🚗 {med.distance.toFixed(1)} km away
            </p>
          )}
          <p className={`font-medium ${stockColor}`}>
            Stock: {med.quantity ?? "N/A"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={onViewShop}
            className="w-full py-2 rounded-xl text-sm font-semibold text-black
                       bg-gradient-to-r from-emerald-400 to-cyan-400
                       hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition"
          >
            View Shop
          </button>
          <button
            onClick={onAlternatives}
            className="w-full py-2 rounded-xl text-sm font-medium
                       bg-[#1e293b] border border-white/10
                       hover:border-cyan-400/40 hover:text-cyan-400 transition"
          >
            Alternatives
          </button>
        </div>
      </div>
    </div>
  );
};

export default Medicines;