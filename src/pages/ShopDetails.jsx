// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import arshMedicalStore from "../assets/arsh.jpeg";
// import mediGet1 from "../assets/mediget1.jpg";
// const ShopDetails = () => {
//   const { shopId } = useParams();
//   const [shop, setShop] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const medicinesPerPage = 8;

//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:8080/api/public/shop/${shopId}`
//         );

//         if (!res.ok) throw new Error("Shop not found");

//         const data = await res.json();
//         setShop(data);
//       } catch (err) {
//         console.error(err);
//         setShop(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShop();
//   }, [shopId]);

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Loading shop details...
//       </div>
//     );

//   if (!shop)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Shop not found.
//       </div>
//     );

//   // 🔎 SEARCH FILTER
//   const filteredMedicines = shop.medicines?.filter((med) =>
//     med.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // 📄 PAGINATION LOGIC
//   const indexOfLast = currentPage * medicinesPerPage;
//   const indexOfFirst = indexOfLast - medicinesPerPage;
//   const currentMedicines = filteredMedicines?.slice(
//     indexOfFirst,
//     indexOfLast
//   );

//   const totalPages = Math.ceil(
//     (filteredMedicines?.length || 0) / medicinesPerPage
//   );

//   return (
//     <div className="min-h-screen px-[8vw] pt-32 pb-20 text-white">

//       {/* ================= SHOP HEADER ================= */}
//       <div className="grid md:grid-cols-2 gap-10 bg-[#0f172a] p-8 rounded-2xl border border-white/10 mb-16">

//         <div>
//           <h1 className="text-3xl font-bold text-emerald-400 mb-6">
//             {shop.shopName}
//           </h1>

//           <p className="text-gray-400 mb-2">🏢 {shop.buildingName}</p>
//           <p className="text-gray-400 mb-2">
//             📍 {shop.street}, {shop.city}
//           </p>
//           <p className="text-gray-400 mb-2">
//             {shop.state}, {shop.country} - {shop.pincode}
//           </p>

//           {/* 🚗 Directions Button */}
//           <button
//             onClick={() => {
//               if (!navigator.geolocation) {
//                 alert("Geolocation not supported");
//                 return;
//               }

//               navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                   const userLat = position.coords.latitude;
//                   const userLng = position.coords.longitude;

//                   const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${shop.latitude},${shop.longitude}&travelmode=driving`;

//                   window.open(url, "_blank");
//                 },
//                 () => {
//                   alert("Please allow location access");
//                 }
//               );
//             }}
//             className="mt-6 px-6 py-3 rounded-xl font-semibold
//                        bg-gradient-to-r from-emerald-400 to-cyan-400
//                        text-black hover:scale-105 transition"
//           >
//             🚗 Get Directions
//           </button>
//         </div>

//         {/* 🏥 Static Shop Image */}
//         <div className="h-96 bg-[#1e293b] rounded-xl overflow-hidden">
//           <img
//             src={arshMedicalStore}
//             alt={shop.shopName}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>

//       {/* ================= MEDICINES SECTION ================= */}
//       <h2 className="text-2xl font-semibold mb-6">
//         Available Medicines
//       </h2>

//       {/* 🔎 SEARCH BAR */}
//       <div className="mb-8">
//         <input
//           type="text"
//           placeholder="Search medicine..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-3 w-72 rounded-lg bg-[#1e293b] text-white outline-none"
//         />
//       </div>

//       {/* 💊 MEDICINE GRID */}
//       {currentMedicines?.length === 0 ? (
//         <p>No medicines found.</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {currentMedicines?.map((med) => (
//             <div
//               key={med.medicineId}
//               className="bg-[#0f172a] p-5 rounded-2xl border border-white/10
//                          hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
//                          hover:scale-105 transition duration-300"
//             >
//               <div className="h-40 bg-[#1e293b] rounded-xl overflow-hidden">
//                 <img
//                   // src={
//                   //   med.image
//                   //     ? `http://localhost:8080/images/${med.image}`
//                   //     : "https://via.placeholder.com/200"
//                   // }
//                   src={mediGet1}
//                   alt={med.medicineName}
//                   className="h-full w-full object-cover"
//                 />
//               </div>

//               <h3 className="mt-4 text-lg font-semibold text-emerald-400">
//                 {med.medicineName}
//               </h3>

//               <p className="text-gray-400 text-sm line-clamp-2">
//                 {med.description}
//               </p>

//               <div className="mt-3 flex items-center gap-2">
//                 <span className="text-white font-bold">
//                   ₹{med.specialPrice}
//                 </span>
//                 <span className="line-through text-gray-500 text-sm">
//                   ₹{med.price}
//                 </span>
//                 <span className="text-red-400 text-sm">
//                   {med.discount}% OFF
//                 </span>
//               </div>

//               <p className="mt-2 text-sm text-gray-400">
//                 Stock: {med.quantity}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 📄 PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-12 gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//             className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
//           >
//             Prev
//           </button>

//           {[...Array(totalPages)].map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-4 py-2 rounded ${
//                 currentPage === index + 1
//                   ? "bg-emerald-400 text-black"
//                   : "bg-gray-700"
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(currentPage + 1)}
//             className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShopDetails;


// src/pages/ShopDetails.jsx — UPDATED with real images + better UI
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiArrowLeft } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import mediGet1 from "../assets/mediget1.jpg";

const ShopDetails = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const medicinesPerPage = 8;

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/public/shop/${shopId}`);
        if (!res.ok) throw new Error("Shop not found");
        const data = await res.json();
        setShop(data);
      } catch (err) {
        setShop(null);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!shop) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
      <p className="text-2xl">Shop not found</p>
      <button onClick={() => navigate(-1)}
        className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold">
        Go Back
      </button>
    </div>
  );

  const getDirections = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${shop.latitude},${shop.longitude}&travelmode=driving`;
        window.open(url, "_blank");
      },
      () => alert("Please allow location access")
    );
  };

  const filteredMedicines = shop.medicines?.filter((med) =>
    med.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const indexOfLast = currentPage * medicinesPerPage;
  const indexOfFirst = indexOfLast - medicinesPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);

  const stockColor = (qty) =>
    qty > 50 ? "text-emerald-400" : qty > 10 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen px-[8vw] pt-28 pb-20 text-white">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition" />
        Back to Medicines
      </button>

      {/* ── SHOP HEADER ── */}
      <div className="grid md:grid-cols-2 gap-8 bg-[#0f172a] p-8 rounded-3xl
                      border border-white/10
                      shadow-[0_0_60px_rgba(16,185,129,0.1)] mb-14">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${shop.isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            <span className={`text-sm font-medium ${shop.isOpen ? "text-emerald-400" : "text-red-400"}`}>
              {shop.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-5">{shop.shopName}</h1>

          <div className="space-y-2 text-gray-400 text-sm mb-6">
            <p>🏢 {shop.buildingName}</p>
            <p>📍 {shop.street}, {shop.city}</p>
            <p>{shop.state}, {shop.country} — {shop.pincode}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={getDirections}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                         bg-gradient-to-r from-emerald-400 to-cyan-400
                         text-black hover:scale-105 transition
                         shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <MdDirectionsCar size={20} />
              Get Directions
            </button>

            {shop.latitude && shop.longitude && (
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`;
                  window.open(url, "_blank");
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                           bg-[#1e293b] border border-white/10
                           hover:border-cyan-400/40 hover:text-cyan-400 transition"
              >
                <FiMapPin />
                View on Map
              </button>
            )}
          </div>
        </div>

        {/* Shop Image */}
        <div className="h-72 md:h-80 rounded-2xl overflow-hidden">
          <img
            src={shop.image ? `http://localhost:8080/images/${shop.image}` : mediGet1}
            alt={shop.shopName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = mediGet1; }}
          />
        </div>
      </div>

      {/* ── MEDICINES SECTION ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          Available Medicines
          <span className="ml-3 text-sm font-normal text-gray-500">
            ({filteredMedicines.length})
          </span>
        </h2>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search in this shop..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-4 py-2.5 w-72 rounded-xl bg-[#1e293b] text-white text-sm
                       border border-white/10 focus:outline-none focus:border-emerald-400 transition"
          />
        </div>
      </div>

      {/* GRID */}
      {currentMedicines.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No medicines found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentMedicines.map((med) => (
            <div
              key={med.medicineId}
              className="group bg-[#0f172a] rounded-2xl border border-white/10
                         hover:border-emerald-400/40
                         hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
                         transition duration-300 overflow-hidden"
            >
              <div className="h-40 bg-[#1e293b] overflow-hidden relative">
                <img
                  src={med.image ? `http://localhost:8080/images/${med.image}` : mediGet1}
                  alt={med.medicineName}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => { e.target.src = mediGet1; }}
                />
                {med.discount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {med.discount}% OFF
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-emerald-400 font-semibold text-sm mb-1">
                  {med.medicineName}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{med.description}</p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-bold">₹{med.specialPrice?.toFixed(2)}</span>
                  {med.price !== med.specialPrice && (
                    <span className="line-through text-gray-600 text-sm">₹{med.price}</span>
                  )}
                </div>

                <p className={`text-xs font-medium ${stockColor(med.quantity)}`}>
                  📦 Stock: {med.quantity}
                </p>

                {med.expiryDate && (
                  <p className="text-xs text-gray-600 mt-1">
                    Exp: {new Date(med.expiryDate).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-[#1e293b] rounded-lg disabled:opacity-30 hover:bg-[#334155] transition"
          >
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold"
                  : "bg-[#1e293b] hover:bg-[#334155]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-[#1e293b] rounded-lg disabled:opacity-30 hover:bg-[#334155] transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopDetails;