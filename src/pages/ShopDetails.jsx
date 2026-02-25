import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShopDetails = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen px-[8vw] pt-32 pb-20 text-white">

      {/* ================= SHOP HEADER ================= */}
      <div className="grid md:grid-cols-2 gap-10 bg-[#0f172a] p-8 rounded-2xl border border-white/10 mb-16">

        {/* LEFT SIDE - SHOP DETAILS */}
        <div>
          <h1 className="text-3xl font-bold text-emerald-400 mb-6">
            {shop.shopName}
          </h1>

          <p className="text-gray-400 mb-2">
            🏢 {shop.buildingName}
          </p>

          <p className="text-gray-400 mb-2">
            📍 {shop.street}, {shop.city}
          </p>

          <p className="text-gray-400 mb-2">
            {shop.state}, {shop.country} - {shop.pincode}
          </p>

          <p className="text-gray-400 mb-6">
            🆔 Shop ID: {shop.shopId}
          </p>

          {/* LIVE LOCATION BUTTON */}
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`,
                "_blank"
              )
            }
            className="px-6 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-emerald-400 to-cyan-400
                       text-black hover:scale-105 transition"
          >
            📍 Go Live Location
          </button>
        </div>

        {/* RIGHT SIDE - DUMMY IMAGE */}
        <div className="h-72 bg-[#1e293b] rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1580281657521-9c10b9df9e4d"
            alt="Medical Store"
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* ================= MEDICINES SECTION ================= */}
      <h2 className="text-2xl font-semibold mb-10">
        Available Medicines
      </h2>

      {shop.medicines?.length === 0 ? (
        <p>No medicines available in this shop.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {shop.medicines?.map((med) => (
            <div
              key={med.medicineId}
              className="bg-[#0f172a] p-5 rounded-2xl border border-white/10
                         hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
                         hover:scale-105 transition duration-300"
            >
              <div className="h-40 bg-[#1e293b] rounded-xl overflow-hidden">
                <img
                  src={`http://localhost:8080/uploads/${med.image}`}
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

              <button
                className="mt-4 w-full py-2 rounded-xl
                           bg-gradient-to-r from-emerald-400 to-cyan-400
                           text-black font-semibold"
              >
                Add to Cart
              </button>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default ShopDetails;