import { TypeAnimation } from "react-type-animation";
import Tilt from "react-parallax-tilt";
import medicalImage from "../assets/image.png";
import FooterBrand from "../components/FooterBrand";

const Home = () => {
  return (
    <div className=" mt-0">
      {/* <FooterBrand /> */}
    <section className=" px-[8vw] mt-45  mb-10 py-15 flex flex-col-reverse md:flex-row items-center justify-between text-white">

      {/* LEFT SIDE */}
      <div className="md:w-1/2 mt-10 md:mt-0">

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Your Trusted
        </h1>

        <h2 className="text-5xl md:text-7xl font-bold mb-6 
                       bg-gradient-to-r from-emerald-400 to-cyan-400 
                       bg-clip-text text-transparent">
          Medical Partner
        </h2>

        <h3 className="text-2xl md:text-3xl font-semibold mb-6">
          <span className="text-white">We provide </span>

          <TypeAnimation
            sequence={[
              "Online Medicine Delivery",
              2000,
              "Verified Medical Stocks",
              2000,
              "24/7 Health Support",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          />
        </h3>

        <p className="text-gray-400 text-lg leading-relaxed mb-10">
          MediCare connects users and sellers with trusted medical supplies.
          Fast delivery, verified medicines, and seamless stock management
          all in one powerful platform.
        </p>

        <button
          className="px-8 py-3 rounded-full font-bold text-black
          bg-gradient-to-r from-emerald-400 to-cyan-400
          hover:scale-105 transition duration-300
          shadow-[0_0_40px_rgba(16,185,129,0.5)]"
        >
          Explore Medicines
        </button>

      </div>

      {/* RIGHT SIDE MEDICAL PLUS IMAGE */}
      <div className="md:w-1/2 flex justify-center">

        <Tilt
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          perspective={1000}
          scale={1.05}
        >
          <div className="relative w-64 h-64 md:w-[28rem] md:h-[28rem]">

            {/* Vertical Bar */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2
                            w-1/3 h-full overflow-hidden
                            rounded-2xl border-4 border-emerald-400
                            shadow-[0_0_40px_rgba(16,185,129,0.6)]">

              <img
                src={medicalImage}
                alt="Medical"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Horizontal Bar */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2
                            h-1/3 w-full overflow-hidden
                            rounded-2xl border-4 border-cyan-400
                            shadow-[0_0_40px_rgba(34,211,238,0.6)]">

              <img
                src={medicalImage}
                alt="Medical"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </Tilt>

      </div>
      
    </section>
    {/* <FooterBrand  /> */}
    </div>
  );
};

export default Home;