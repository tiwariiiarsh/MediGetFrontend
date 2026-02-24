import { useState } from "react";
import { useDispatch } from "react-redux";
import { authenticateSignInUser } from "../store/actions";
import { useNavigate, Link } from "react-router-dom";
import medicalImg from "../assets/image.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    dispatch(authenticateSignInUser(form, navigate));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-900 via-slate-900 to-blue-950">

      {/* LEFT IMAGE SECTION */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">

        {/* Sharp Image */}
        <img
          src={medicalImg}
          alt="Medical"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Soft Medical Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/70 via-cyan-900/40 to-transparent"></div>

        <h1 className="absolute bottom-12 left-12 text-white text-3xl font-bold z-10">
          Secure Medical Access
        </h1>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <div className="w-full max-w-md 
                        bg-cyan-950/40 backdrop-blur-xl
                        p-8 rounded-3xl 
                        shadow-[0_0_50px_rgba(6,182,212,0.25)] 
                        border border-cyan-800/40">

          <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">
            Login
          </h2>

          <input
            className="w-full mb-4 px-4 py-3 rounded-xl 
                       bg-slate-900/80 text-white 
                       border border-cyan-700/40 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="w-full mb-6 px-4 py-3 rounded-xl 
                       bg-slate-900/80 text-white 
                       border border-cyan-700/40 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 
                       bg-cyan-500 text-black font-bold 
                       rounded-xl 
                       hover:bg-cyan-400 
                       transition duration-300 
                       shadow-lg shadow-cyan-500/30">
            Login
          </button>

          <p className="text-sm text-center mt-6 text-cyan-200">
            New here?{" "}
            <Link to="/signup" className="underline hover:text-white">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}