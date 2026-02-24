import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-15">

      {/* TOP SOFT DIVIDER */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-5" />

      {/* FOOTER BODY */}
      <div
        className="
          max-w-7xl mx-auto
          px-10 py-14
          backdrop-blur-xl
         bg-[#04111d68]
          
          
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-white">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              MEDICARE
            </h2>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              “Connecting patients and pharmacies with reliable medicines, real-time stock updates, and fast delivery — your health, simplified.”
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/" className="hover:text-white"> Medicines</Link></li>
              <li><Link to="/" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white">Signup</Link></li>
              <li><Link to="/user" className="hover:text-white">Your Profile</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <p className="text-gray-400 text-sm">
              Need help or have questions?
            </p>
            <p className="mt-2 text-sm font-semibold text-indigo-400">
              support@medicare.com
            </p>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Medicare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
