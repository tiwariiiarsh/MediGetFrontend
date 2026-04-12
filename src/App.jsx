// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import BlurBlob from "./components/BlurBlob";
// import Footer from "./components/Footer";
// import FooterBrand from "./components/FooterBrand";
// import Medicines from "./pages/Medicines";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import ShopDetails from "./pages/ShopDetails";

// function App() {
//   return (
//     <div className="bg-[#04111d] relative overflow-hidden min-h-screen text-white">

//       {/* Medical Glow Background */}
//       {/* <div className="absolute top-20 left-20 w-96 h-96 
//                       bg-emerald-500 opacity-20 
//                       blur-3xl rounded-full"></div> */}

//       {/* <div className="absolute bottom-20 right-20 w-96 h-96 
//                       bg-cyan-500 opacity-20 
//                       blur-3xl rounded-full"></div> */}

//       <Navbar />
//       <BlurBlob position={{ top: "40%", left: "20%" }} size={{ width: "500px", height: "400px" }} />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/medicines" element={<Medicines />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/shop/:shopId" element={<ShopDetails />} />
//       </Routes>
//       <FooterBrand  />
//       <Footer/>

//     </div>
//   );
// }

// export default App;



// src/App.jsx — UPDATED with Seller Routes
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BlurBlob from "./components/BlurBlob";
import Footer from "./components/Footer";
import FooterBrand from "./components/FooterBrand";
import Medicines from "./pages/Medicines";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ShopDetails from "./pages/ShopDetails";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerMedicines from "./pages/seller/SellerMedicines";
import SellerBilling from "./pages/seller/SellerBilling";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import { ThemeProvider } from "./components/ThemeContext";

function App() {
  return (
    <div className="bg-[#04111d] relative overflow-hidden min-h-screen text-white">
      <ThemeProvider>
      <Navbar />
      {/* <BlurBlob
        position={{ top: "80%", left: "40%" }}
        size={{ width: "500px", height: "400px" }}
      /> */}
      <BlurBlob
              blobs={[
                {
                  top: "13%",
                  left: "50%",
                  width: "750px",
                  height: "300px",
                  color: "bg-blue-500",
                  delay: "5s",
                },
              ]}
            />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop/:shopId" element={<ShopDetails />} />

        {/* SELLER */}
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/medicines" element={<SellerMedicines />} />
        <Route path="/seller/billing" element={<SellerBilling />} />
        <Route path="/seller/analytics" element={<SellerAnalytics />} />
      </Routes>
      {/* <FooterBrand /> */}
      <Footer />
      </ThemeProvider>
    </div>
  );
}

export default App;