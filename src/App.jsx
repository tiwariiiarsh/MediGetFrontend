import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BlurBlob from "./components/BlurBlob";
import Footer from "./components/Footer";
import FooterBrand from "./components/FooterBrand";

function App() {
  return (
    <div className="bg-[#04111d] relative overflow-hidden min-h-screen text-white">

      {/* Medical Glow Background */}
      {/* <div className="absolute top-20 left-20 w-96 h-96 
                      bg-emerald-500 opacity-20 
                      blur-3xl rounded-full"></div> */}

      {/* <div className="absolute bottom-20 right-20 w-96 h-96 
                      bg-cyan-500 opacity-20 
                      blur-3xl rounded-full"></div> */}

      <Navbar />
      <BlurBlob position={{ top: "40%", left: "20%" }} size={{ width: "500px", height: "400px" }} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <FooterBrand  />
      <Footer/>

    </div>
  );
}

export default App;