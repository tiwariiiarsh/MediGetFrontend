import { Link } from "react-router-dom";
import medicalImage from "../assets/medicalAbout.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-[#04111d] text-white px-6 md:px-20 py-25">

      {/* 🔥 HERO SECTION */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          About <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            MediCare
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          MediCare is your trusted online medical marketplace connecting patients 
          with verified pharmacies. We ensure safe, fast, and reliable access to 
          essential medicines anytime, anywhere.
        </p>
      </div>

      {/* 🏥 IMAGE + CONTENT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">

        <div>
          <img
            src={medicalImage}
            alt="Medical"
            className="rounded-2xl shadow-lg hover:scale-105 transition duration-500"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-emerald-400">
            Our Mission
          </h2>

          <p className="text-gray-400">
            Our mission is to simplify healthcare accessibility by bringing
            trusted pharmacies closer to you. Whether it's emergency medicine
            or regular prescriptions, MediCare ensures seamless delivery
            and verified stock availability.
          </p>

          <h2 className="text-3xl font-semibold text-cyan-400">
            Our Vision
          </h2>

          <p className="text-gray-400">
            We envision a world where healthcare is accessible, transparent,
            and affordable. By leveraging technology and verified seller networks,
            MediCare aims to transform the medical supply chain.
          </p>
        </div>
      </div>

      {/* 💊 WHY CHOOSE US */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose MediCare?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-[#0f172a] p-8 rounded-2xl border border-white/10 
                          hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">
              Verified Pharmacies
            </h3>
            <p className="text-gray-400">
              We partner only with authenticated and licensed pharmacies 
              to ensure safe and genuine medicines.
            </p>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-2xl border border-white/10 
                          hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">
              Fast Delivery
            </h3>
            <p className="text-gray-400">
              Get medicines delivered quickly with real-time stock tracking 
              and nearby pharmacy search.
            </p>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-2xl border border-white/10 
                          hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold text-red-400 mb-4">
              24/7 Support
            </h3>
            <p className="text-gray-400">
              Our support team is available round-the-clock to assist you 
              with orders and medical queries.
            </p>
          </div>

        </div>
      </div>

      {/* 🚀 CTA SECTION */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Join the MediCare Family
        </h3>

        <p className="text-gray-400 mb-6">
          Discover trusted medicines, verified shops, and seamless healthcare services.
        </p>

        <Link to="/medicines">
          <button className="px-8 py-3 rounded-full font-semibold 
                             bg-gradient-to-r from-emerald-400 to-cyan-400 
                             text-black hover:scale-105 transition duration-300
                             shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            Explore Medicines
          </button>
        </Link>
      </div>

    </div>
  );
};

export default About;