// src/pages/Signup.jsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../store/actions";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import medicalImg from "../assets/image.png";
import { useTheme } from "../components/ThemeContext";

const Signup = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { dark }    = useTheme();
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
      email:    data.email,
      password: data.password,
      role:     [data.role],
    };
    dispatch(registerNewUser(payload, toast, reset, navigate, setLoader));
  };

  // ── Mode-aware tokens ─────────────────────────────────────────────────────
  const m = dark ? {
    pageBg:      "#0f172a",
    text:        "#f1f5f9",
    textMuted:   "#94a3b8",
    inputBg:     "#1e293b",
    inputBorder: "#334155",
    inputText:   "#f1f5f9",
    chipBg:      "#1e293b",
    chipBorder:  "#334155",
    chipText:    "#f1f5f9",
    chipSub:     "#64748b",
    divider:     "#1e293b",
    logoText:    "#f1f5f9",
    logoSub:     "#64748b",
    btnBg:       "#2563eb",
    btnHover:    "#1d4ed8",
  } : {
    pageBg:      "#f1f5f9",
    text:        "#0f172a",
    textMuted:   "#64748b",
    inputBg:     "#ffffff",
    inputBorder: "#e2e8f0",
    inputText:   "#0f172a",
    chipBg:      "#ffffff",
    chipBorder:  "#e2e8f0",
    chipText:    "#0f172a",
    chipSub:     "#64748b",
    divider:     "#e2e8f0",
    logoText:    "#0f172a",
    logoSub:     "#64748b",
    btnBg:       "#1d4ed8",
    btnHover:    "#1e40af",
  };

  const BLUE       = "#2563eb";
  const FOCUS_RING = "0 0 0 3px rgba(37,99,235,0.18)";

  const inputStyle = {
    width:        "100%",
    padding:      "11px 14px",
    borderRadius: 9,
    background:   m.inputBg,
    border:       `1.5px solid ${m.inputBorder}`,
    color:        m.inputText,
    fontSize:     14,
    outline:      "none",
    fontFamily:   "'DM Sans', sans-serif",
    boxSizing:    "border-box",
    transition:   "border-color 0.18s, box-shadow 0.18s",
  };

  const labelStyle = {
    fontSize:      11,
    fontWeight:    700,
    color:         m.textMuted,
    display:       "block",
    marginBottom:  6,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = BLUE;
    e.target.style.boxShadow   = FOCUS_RING;
  };
  const onBlur = (e) => {
    e.target.style.borderColor = m.inputBorder;
    e.target.style.boxShadow   = "none";
  };

  return (
    <div style={{
      minHeight:  "100vh",
      display:    "flex",
      background: m.pageBg,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.3s",
    }}>

      {/* LEFT IMAGE */}
      <div className="auth-left" style={{ display:"none", width:"50%", position:"relative", overflow:"hidden" }}>
        <img src={medicalImg} alt="Medical"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"rgba(8,14,32,0.62)" }} />
        <div style={{ position:"absolute", bottom:52, left:52 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.13)",
            borderRadius:10, padding:"8px 16px", marginBottom:20,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/>
            </svg>
            <span style={{ color:"#fff", fontSize:13, fontWeight:600, letterSpacing:"0.04em" }}>MediGet</span>
          </div>
          <p style={{ color:"#f1f5f9", fontSize:27, fontWeight:800, margin:0, lineHeight:1.3, letterSpacing:"-0.02em" }}>
            Join our medical<br />supply network
          </p>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginTop:12, lineHeight:1.65 }}>
            Sellers · Buyers · Admins
          </p>
        </div>
      </div>

      {/* RIGHT — form area */}
      <div style={{
        flex:           1,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "48px 24px",
      }}>
        <div style={{ width:"100%", maxWidth:400 }}>

          {/* Logo row */}
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:30 }}>
            <div style={{
              width:40, height:40, borderRadius:10,
              background:"#1d4ed8",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <div>
              <p style={{ margin:0, fontWeight:800, fontSize:15, color:m.logoText, letterSpacing:"-0.01em" }}>MediGet</p>
              <p style={{ margin:0, fontSize:12, color:m.logoSub }}>Medical Supply Platform</p>
            </div>
          </div>

          {/* Heading */}
          <h1 style={{ fontWeight:800, fontSize:24, color:m.text, margin:"0 0 5px", letterSpacing:"-0.02em" }}>
            Create account
          </h1>
          <p style={{ color:m.textMuted, fontSize:13, margin:"0 0 28px", lineHeight:1.5 }}>
            Set up your MediGet account in seconds
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display:"flex", flexDirection:"column", gap:0 }}>

            {/* Username */}
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Username</label>
              <input placeholder="your_username" style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                {...register("username", { required:"Username is required" })} />
              {errors.username && <p style={{ color:"#f87171", fontSize:12, margin:"5px 0 0" }}>{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Email</label>
              <input placeholder="you@example.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                {...register("email", { required:"Email is required" })} />
              {errors.email && <p style={{ color:"#f87171", fontSize:12, margin:"5px 0 0" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                {...register("password", {
                  required:  "Password is required",
                  minLength: { value:6, message:"Minimum 6 characters" },
                })} />
              {errors.password && <p style={{ color:"#f87171", fontSize:12, margin:"5px 0 0" }}>{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div style={{ marginBottom:24 }}>
              <label style={labelStyle}>Role</label>
              <select
                style={{ ...inputStyle, cursor:"pointer" }}
                onFocus={onFocus}
                onBlur={onBlur}
                {...register("role")}
              >
                <option value="ROLE_SELLER">Seller</option>
                <option value="ROLE_BUYER">Buyer</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>

              {/* Role hint chips */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
                {[
                  { role:"Seller", desc:"List & sell medicines" },
                  { role:"Buyer",  desc:"Browse & order stock"  },
                ].map(({ role, desc }) => (
                  <div key={role} style={{
                    padding:      "10px 12px",
                    borderRadius: 9,
                    background:   m.chipBg,
                    border:       `1.5px solid ${m.chipBorder}`,
                  }}>
                    <p style={{ margin:0, fontSize:12, fontWeight:700, color:m.chipText }}>{role}</p>
                    <p style={{ margin:0, fontSize:11, color:m.chipSub, lineHeight:1.4 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loader}
              style={{
                width:        "100%",
                padding:      "12px 0",
                borderRadius: 9,
                background:   loader ? (dark ? "#1e293b" : "#e2e8f0") : m.btnBg,
                color:        loader ? m.textMuted : "#fff",
                fontFamily:   "'DM Sans', sans-serif",
                fontWeight:   700,
                fontSize:     14,
                border:       "none",
                cursor:       loader ? "not-allowed" : "pointer",
                transition:   "background 0.18s",
                letterSpacing:"0.01em",
              }}
              onMouseEnter={e => { if (!loader) e.currentTarget.style.background = m.btnHover; }}
              onMouseLeave={e => { if (!loader) e.currentTarget.style.background = m.btnBg; }}
            >
              {loader ? "Creating account…" : "Create account"}
            </button>

          </form>

          {/* Divider + footer */}
          <div style={{ height:1, background:m.divider, margin:"24px 0 20px" }} />
          <p style={{ fontSize:13, textAlign:"center", margin:0, color:m.textMuted }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color:"#3b82f6", fontWeight:700, textDecoration:"none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <style>{`@media(min-width:768px){.auth-left{display:flex !important}}`}</style>
    </div>
  );
};

export default Signup;