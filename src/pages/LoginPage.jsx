// src/pages/Login.jsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { authenticateSignInUser } from "../store/actions";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import medicalImg from "../assets/image.png";
import { useTheme } from "../components/ThemeContext";

const Login = () => {
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
    dispatch(authenticateSignInUser(data, toast, reset, navigate, setLoader));
  };

  // ── Mode-aware tokens ─────────────────────────────────────────────────────
  const m = dark ? {
    pageBg:      "#0f172a",
    text:        "#f1f5f9",
    textMuted:   "#94a3b8",
    inputBg:     "#1e293b",
    inputBorder: "#334155",
    inputText:   "#f1f5f9",
    placeholder: "#64748b",
    divider:     "#1e293b",
    logoBg:      "#0f172a",
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
    placeholder: "#94a3b8",
    divider:     "#e2e8f0",
    logoBg:      "#f1f5f9",
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
            Secure access to<br />your medical store
          </p>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginTop:12, lineHeight:1.65 }}>
            Inventory · Orders · Analytics
          </p>
        </div>
      </div>

      {/* RIGHT — form area */}
      <div style={{
        flex:            1,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "48px 24px",
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
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/>
              </svg>
            </div>
            <div>
              <p style={{ margin:0, fontWeight:800, fontSize:15, color:m.logoText, letterSpacing:"-0.01em" }}>MediGet</p>
              <p style={{ margin:0, fontSize:12, color:m.logoSub }}>Medical Supply Platform</p>
            </div>
          </div>

          {/* Heading */}
          <h1 style={{ fontWeight:800, fontSize:24, color:m.text, margin:"0 0 5px", letterSpacing:"-0.02em" }}>
            Sign in
          </h1>
          <p style={{ color:m.textMuted, fontSize:13, margin:"0 0 28px", lineHeight:1.5 }}>
            Welcome back — enter your credentials to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display:"flex", flexDirection:"column", gap:0 }}>

            {/* Username */}
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Username</label>
              <input
                placeholder="your_username"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                {...register("username", { required:"Username is required" })}
              />
              {errors.username && (
                <p style={{ color:"#f87171", fontSize:12, margin:"5px 0 0" }}>{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Email</label>
              <input
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                {...register("email", { required:"Email is required" })}
              />
              {errors.email && (
                <p style={{ color:"#f87171", fontSize:12, margin:"5px 0 0" }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom:24 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                {...register("password", {
                  required:  "Password is required",
                  minLength: { value:6, message:"Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <p style={{ color:"#f87171", fontSize:12, margin:"5px 0 0" }}>{errors.password.message}</p>
              )}
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
              {loader ? "Signing in…" : "Sign in"}
            </button>

          </form>

          {/* Divider + footer */}
          <div style={{ height:1, background:m.divider, margin:"24px 0 20px" }} />
          <p style={{ fontSize:13, textAlign:"center", margin:0, color:m.textMuted }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color:"#3b82f6", fontWeight:700, textDecoration:"none" }}>
              Create one
            </Link>
          </p>

        </div>
      </div>

      <style>{`@media(min-width:768px){.auth-left{display:flex !important}}`}</style>
    </div>
  );
};

export default Login;