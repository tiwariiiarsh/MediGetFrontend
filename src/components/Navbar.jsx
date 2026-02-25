import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logOutUser } from "../store/actions";
import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    dispatch(logOutUser(navigate));
  };

  const role = user?.roles?.[0] || user?.role?.[0] || null;

  // Hide on login/signup
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItemClass =
    "hover:text-emerald-400 transition cursor-pointer";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#04111d]/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center text-white">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer tracking-wide"
        >
          <span className="text-emerald-400">Medi</span>
          <span className="text-cyan-400">Care</span>
        </div>

        {/* CENTER MENU */}
        <ul className="hidden md:flex space-x-8 font-medium text-gray-300">

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <li onClick={() => navigate("/")} className={navItemClass}>Home</li>
              <li onClick={() => navigate("/about")} className={navItemClass}>About</li>
              <li onClick={() => navigate("/contact")} className={navItemClass}>Contact</li>
            </>
          )}

          {/* SELLER */}
          {role === "ROLE_SELLER" && (
            <>
              <li onClick={() => navigate("/seller")} className={navItemClass}>Dashboard</li>
              <li onClick={() => navigate("/seller/medicines")} className={navItemClass}>Medicines</li>
              <li onClick={() => navigate("/seller/stocks")} className={navItemClass}>Stocks</li>
            </>
          )}

          {/* USER */}
          {role === "ROLE_USER" && (
            <>
              <li onClick={() => navigate("/")} className={navItemClass}>Home</li>
              <li onClick={() => navigate("/medicines")} className={navItemClass}>Medicines</li>
               <li onClick={() => navigate("/shop/:shopId")} className={navItemClass}>ShopDetails</li>
              <li onClick={() => navigate("/about")} className={navItemClass}>About</li>
              <li onClick={() => navigate("/contact")} className={navItemClass}>Contact</li>
            </>
          )}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-full 
                         bg-gradient-to-r from-emerald-400 to-cyan-400
                         text-black font-semibold
                         hover:scale-105 transition duration-300
                         shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-4">

              {/* Profile Circle */}
              <div
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-full 
                           bg-gradient-to-r from-emerald-400 to-cyan-400
                           flex items-center justify-center text-black font-bold shadow-md cursor-pointer">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500 transition"
              >
                Logout
              </button>
            </div>
          )}

          <div className="md:hidden text-2xl">
            <FiMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;