// src/pages/seller/SellerBilling.jsx
// Complete billing: search medicine, add to cart, generate bill, print receipt
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiTrash2, FiPrinter, FiCheckCircle, FiPlus, FiMinus } from "react-icons/fi";
import { MdReceiptLong } from "react-icons/md";
import mediGet1 from "../../assets/mediget1.jpg";

const BASE = "http://localhost:8080/api";

const SellerBilling = () => {
  const [shopId, setShopId] = useState(null);
  const [shopName, setShopName] = useState("");
  const [allMedicines, setAllMedicines] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [bill, setBill] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const billRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const r = await fetch(`${BASE}/seller/shop`, { credentials: "include" });
        if (r.ok) {
          const s = await r.json();
          setShopId(s.shopId);
          setShopName(s.shopName);
          // Load all medicines for this shop (unpaginated for billing)
          const mr = await fetch(
            `${BASE}/seller/shop/${s.shopId}/medicines?pageSize=100`,
            { credentials: "include" }
          );
          if (mr.ok) {
            const md = await mr.json();
            setAllMedicines(md.content || []);
          }
        }
      } catch { }
      finally { setLoading(false); }
    };
    init();
  }, []);

  // Live search
  useEffect(() => {
    if (!searchTerm.trim()) { setSearchResult([]); return; }
    const q = searchTerm.toLowerCase();
    setSearchResult(
      allMedicines.filter(m =>
        m.medicineName.toLowerCase().includes(q) && m.quantity > 0
      ).slice(0, 6)
    );
  }, [searchTerm, allMedicines]);

  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(c => c.medicineId === med.medicineId);
      if (existing) {
        if (existing.quantity >= med.quantity) return prev; // max stock
        return prev.map(c =>
          c.medicineId === med.medicineId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, {
        medicineId: med.medicineId,
        medicineName: med.medicineName,
        price: med.specialPrice,
        maxStock: med.quantity,
        quantity: 1,
      }];
    });
    setSearchTerm("");
    setSearchResult([]);
  };

  const updateQty = (medicineId, delta) => {
    setCart(prev => prev
      .map(c => c.medicineId === medicineId
        ? { ...c, quantity: Math.max(1, Math.min(c.maxStock, c.quantity + delta)) }
        : c
      )
    );
  };

  const removeFromCart = (medicineId) => {
    setCart(prev => prev.filter(c => c.medicineId !== medicineId));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const generateBill = async () => {
    if (!cart.length) return;
    setGenerating(true);
    try {
      const payload = cart.map(c => ({
        medicineId: c.medicineId,
        quantity: c.quantity,
      }));
      const res = await fetch(`${BASE}/seller/shop/${shopId}/bill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setBill(data);
        setCart([]);
        // Refresh medicines for updated stock
        const mr = await fetch(
          `${BASE}/seller/shop/${shopId}/medicines?pageSize=100`,
          { credentials: "include" }
        );
        if (mr.ok) {
          const md = await mr.json();
          setAllMedicines(md.content || []);
        }
      } else {
        const d = await res.json();
        alert(d.message || "Billing failed");
      }
    } catch { alert("Server error"); }
    finally { setGenerating(false); }
  };

  const printBill = () => {
    const content = billRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Bill - ${bill.billId}</title>
      <style>
        body { font-family: monospace; padding: 20px; max-width: 400px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 6px; border-bottom: 1px solid #ccc; text-align: left; }
        .total { font-size: 1.2em; font-weight: bold; }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen px-[8vw] pt-28 pb-20 text-white">

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MdReceiptLong className="text-emerald-400" /> Billing Counter
        </h1>
        <p className="text-gray-400 text-sm mt-1">Search medicines, add to cart, generate bill</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT — SEARCH + CART */}
        <div className="lg:col-span-2 space-y-6">

          {/* SEARCH */}
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-300 mb-3">Add Medicine to Cart</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by medicine name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1e293b] text-white
                           border border-white/10 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            {/* SEARCH RESULTS */}
            {searchResult.length > 0 && (
              <div className="mt-3 space-y-2">
                {searchResult.map(med => (
                  <div
                    key={med.medicineId}
                    onClick={() => addToCart(med)}
                    className="flex items-center gap-4 bg-[#1e293b] rounded-xl p-3
                               border border-white/10 hover:border-emerald-400/40
                               hover:bg-emerald-400/5 cursor-pointer transition"
                  >
                    <img
                      src={med.image ? `http://localhost:8080/images/${med.image}` : mediGet1}
                      alt={med.medicineName}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => { e.target.src = mediGet1; }}
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{med.medicineName}</p>
                      <p className="text-gray-500 text-xs">{med.description?.slice(0, 40)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">₹{med.specialPrice?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Stock: {med.quantity}</p>
                    </div>
                    <FiPlus className="text-emerald-400 text-lg flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {searchTerm && searchResult.length === 0 && (
              <p className="text-gray-600 text-sm mt-3 text-center">No available medicines found.</p>
            )}
          </div>

          {/* CART */}
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-300 mb-4">
              Cart
              <span className="ml-2 text-xs bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <FiSearch className="mx-auto text-4xl mb-2" />
                <p>Cart is empty. Search and add medicines above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.medicineId}
                    className="flex items-center gap-4 bg-[#1e293b] rounded-xl p-3 border border-white/5">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.medicineName}</p>
                      <p className="text-emerald-400 text-xs">₹{item.price?.toFixed(2)} each</p>
                    </div>

                    {/* QTY CONTROL */}
                    <div className="flex items-center gap-2 bg-[#0f172a] rounded-lg px-3 py-1.5">
                      <button onClick={() => updateQty(item.medicineId, -1)}
                        className="text-gray-400 hover:text-white transition">
                        <FiMinus size={12} />
                      </button>
                      <span className="text-white text-sm font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQty(item.medicineId, 1)}
                        className="text-gray-400 hover:text-white transition">
                        <FiPlus size={12} />
                      </button>
                    </div>

                    <span className="text-white font-bold text-sm w-20 text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button onClick={() => removeFromCart(item.medicineId)}
                      className="text-gray-600 hover:text-red-400 transition">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="space-y-5">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 sticky top-28">
            <h2 className="font-semibold text-gray-300 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              {cart.map(item => (
                <div key={item.medicineId} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.medicineName} × {item.quantity}</span>
                  <span className="text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 mb-5">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-emerald-400">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={generateBill}
              disabled={!cart.length || generating}
              className="w-full py-3 rounded-xl font-bold text-black
                         bg-gradient-to-r from-emerald-400 to-cyan-400
                         hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]
                         disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {generating ? "Generating..." : "Generate Bill"}
            </button>
          </div>
        </div>
      </div>

      {/* ── BILL MODAL ── */}
      {bill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-emerald-500/30 rounded-2xl p-7 w-full max-w-md
                          shadow-[0_0_50px_rgba(16,185,129,0.3)]">

            <div className="flex items-center gap-2 mb-5">
              <FiCheckCircle className="text-emerald-400 text-2xl" />
              <h2 className="text-xl font-bold text-emerald-400">Bill Generated!</h2>
            </div>

            {/* PRINTABLE SECTION */}
            <div ref={billRef} className="bg-[#1e293b] rounded-xl p-5 mb-5 font-mono">
              <div className="text-center mb-4">
                <p className="text-white font-bold text-lg">{shopName || "Medical Store"}</p>
                <p className="text-gray-400 text-xs">Bill #{bill.billId}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(bill.billDate).toLocaleDateString("en-IN")}
                </p>
              </div>

              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="py-1 text-left">Medicine</th>
                    <th className="py-1 text-right">Qty</th>
                    <th className="py-1 text-right">Price</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items?.map((item, i) => (
                    <tr key={i} className="text-gray-300 border-b border-white/5">
                      <td className="py-1.5">{item.medicineName}</td>
                      <td className="py-1.5 text-right">{item.quantity}</td>
                      <td className="py-1.5 text-right">₹{item.price?.toFixed(2)}</td>
                      <td className="py-1.5 text-right text-emerald-400">₹{item.totalPrice?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white">
                <span>TOTAL</span>
                <span className="text-emerald-400">₹{bill.totalAmount?.toFixed(2)}</span>
              </div>

              <p className="text-center text-gray-600 text-xs mt-4">Thank you for your purchase!</p>
            </div>

            <div className="flex gap-3">
              <button onClick={printBill}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                           bg-[#1e293b] border border-white/10 hover:bg-[#334155] transition">
                <FiPrinter size={16} /> Print
              </button>
              <button onClick={() => setBill(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-black
                           bg-gradient-to-r from-emerald-400 to-cyan-400 hover:scale-[1.01] transition">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerBilling;