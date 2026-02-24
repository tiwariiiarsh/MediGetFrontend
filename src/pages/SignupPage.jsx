import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../store/actions";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import medicalImg from "../assets/image.png";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = (data) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: [data.role],
    };

    dispatch(registerNewUser(payload, toast, reset, navigate, setLoader));
  };

  return (
    <div className="min-h-screen flex bg-slate-900">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <img
          src={medicalImg}
          alt="Medical"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-cyan-950/30"></div>
        <h1 className="absolute bottom-12 left-12 text-cyan-400 text-3xl font-bold">
          Join Our Medical Platform
        </h1>
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md 
                     bg-slate-900/80 backdrop-blur-xl
                     p-8 rounded-3xl 
                     shadow-[0_0_60px_rgba(34,211,238,0.35)] 
                     border border-cyan-500/30"
        >

          <h2 className="text-3xl font-bold text-center text-cyan-500 mb-8">
            Create Account
          </h2>

          {/* Username */}
          <div className="mb-4">
            <input
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl 
                         bg-slate-800 text-white 
                         border border-cyan-500/30 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl 
                         bg-slate-800 text-white 
                         border border-cyan-500/30 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl 
                         bg-slate-800 text-white 
                         border border-cyan-500/30 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters required" },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <select
              className="w-full px-4 py-3 rounded-xl 
                         bg-slate-800 text-white 
                         border border-cyan-500/30 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500"
              {...register("role")}
            >
              <option value="ROLE_SELLER">Seller</option>
              <option value="ROLE_BUYER">Buyer</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loader}
            className="w-full py-3 
                       bg-cyan-500 text-slate-900 font-bold 
                       rounded-xl 
                       hover:bg-cyan-400 transition 
                       shadow-lg shadow-cyan-300/40"
          >
            {loader ? "Loading..." : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-6 text-cyan-200">
            Already have an account?{" "}
            <Link to="/login" className="underline hover:text-cyan-300">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Signup;