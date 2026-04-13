// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ThemeProvider wraps the entire app.
// Any component just calls useTheme() — no prop drilling needed.
// The single toggle button in Navbar updates the WHOLE site instantly.
// ─────────────────────────────────────────────────────────────────────────────

import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";

import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";
// import FooterBrand  from "./components/FooterBrand";

import Home          from "./pages/Home";
import LoginPage     from "./pages/LoginPage";
import SignupPage    from "./pages/SignupPage";
import Medicines     from "./pages/Medicines";
import About         from "./pages/About";
import Contact       from "./pages/Contact";
import ShopDetails   from "./pages/ShopDetails";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerMedicines from "./pages/seller/SellerMedicines";
import SellerBilling   from "./pages/seller/SellerBilling";
import SellerAnalytics from "./pages/seller/SellerAnalytics";

function App() {
  return (
    // ── ThemeProvider is the ONLY place theme state lives ──────────────────
    // Every child — Navbar, Home, SellerDashboard, etc. — reads it via useTheme()
    // No props need to be passed. Toggle in Navbar = whole site updates.
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

// Separate shell so ThemeProvider is fully mounted before children render
const AppShell = () => {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <Routes>
        {/* ── PUBLIC ── */}
        <Route path="/"              element={<Home />}        />
        <Route path="/login"         element={<LoginPage />}   />
        <Route path="/signup"        element={<SignupPage />}  />
        <Route path="/medicines"     element={<Medicines />}   />
        <Route path="/about"         element={<About />}       />
        <Route path="/contact"       element={<Contact />}     />
        <Route path="/shop/:shopId"  element={<ShopDetails />} />

        {/* ── SELLER ── */}
        <Route path="/seller"            element={<SellerDashboard />} />
        <Route path="/seller/medicines"  element={<SellerMedicines />} />
        <Route path="/seller/billing"    element={<SellerBilling />}   />
        <Route path="/seller/analytics"  element={<SellerAnalytics />} />
      </Routes>

      {/* <FooterBrand /> */}
      <Footer />
    </div>
  );
};

export default App;