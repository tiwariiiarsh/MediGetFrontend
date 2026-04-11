// src/components/Navbar.jsx — UPDATED with billing + analytics nav links
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logOutUser } from "../store/actions";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => dispatch(logOutUser(navigate));

  const role = user?.roles?.[0] || user?.role?.[0] || null;

  const navItem = (label, path) => (
    <li
      key={path}
      onClick={() => { navigate(path); setMenuOpen(false); }}
      className={`cursor-pointer transition text-sm font-medium
        ${location.pathname === path
          ? "text-emerald-400"
          : "text-gray-300 hover:text-emerald-400"
        }`}
    >
      {label}
    </li>
  );

  const publicLinks = [
    navItem("Home", "/"),
    navItem("Medicines", "/medicines"),
    navItem("About", "/about"),
    navItem("Contact", "/contact"),
  ];

  const sellerLinks = [
    navItem("Dashboard", "/seller"),
    navItem("Inventory", "/seller/medicines"),
    navItem("Billing", "/seller/billing"),
    navItem("Analytics", "/seller/analytics"),
  ];

  const userLinks = [
    navItem("Home", "/"),
    navItem("Medicines", "/medicines"),
    navItem("About", "/about"),
    navItem("Contact", "/contact"),
  ];

  const activeLinks = !user ? publicLinks
    : role === "ROLE_SELLER" ? sellerLinks
    : userLinks;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#04111d]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div onClick={() => navigate("/")}
          className="text-2xl font-extrabold cursor-pointer tracking-tight">
          <span className="text-emerald-400">Medi</span>
          <span className="text-cyan-400">Care</span>
        </div>

        {/* CENTER LINKS (desktop) */}
        <ul className="hidden md:flex items-center space-x-7">
          {activeLinks}
        </ul>

        {/* RIGHT (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-full text-sm font-semibold text-black
                         bg-gradient-to-r from-emerald-400 to-cyan-400
                         hover:scale-105 transition shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div
                onClick={() => navigate("/seller")}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400
                           flex items-center justify-center text-black font-bold shadow-md cursor-pointer
                           hover:scale-110 transition"
              >
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/10 px-6 py-5 space-y-4">
          <ul className="flex flex-col gap-4">
            {activeLinks}
          </ul>
          {!user ? (
            <button
              onClick={() => { navigate("/login"); setMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-black
                         bg-gradient-to-r from-emerald-400 to-cyan-400"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl text-sm bg-red-500/20 text-red-400"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;