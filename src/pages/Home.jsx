// src/pages/Home.jsx
// ─────────────────────────────────────────────────────────────────────────────
// MediCare Home — consumes theme from ThemeContext (no local dark state).
// Toggle in Navbar updates this page automatically.
//
// Fonts (add to index.html):
// <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import Tilt from "react-parallax-tilt";
import medicalImage from "../assets/image.png";
import BlurBlob from "../components/BlurBlob";
import ShapeGrid from "../components/ShapeGrid";
import { useTheme } from "../components/ThemeContext";

// ─── TICKER ────────────────────────────────────────────────────────────────────
const Ticker = ({ t }) => {
  const items = ["✦ 15,000+ Patients Served","✦ 350+ Verified Pharmacies","✦ GPS-Based Live Search","✦ Real-Time Stock Updates","✦ Instant Billing System","✦ Smart Medicine Alternatives","✦ 98% Customer Satisfaction"];
  return (
    <div style={{ overflow:"hidden", borderBottom:`1px solid ${t.tickerBdr}`, padding:"9px 0", background:t.tickerBg }}>
      <div style={{ display:"flex", gap:56, whiteSpace:"nowrap", animation:"mc-tick 28s linear infinite" }}>
        {[...items,...items].map((item,i)=>(
          <span key={i} style={{ fontFamily:"'Archivo',sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.1em", color:t.tickerTxt }}>{item}</span>
        ))}
      </div>
    </div>
  );
};

// ─── COUNT UP ──────────────────────────────────────────────────────────────────
const CountUp = ({ to, suffix="", t }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(!e.isIntersecting) return;
      obs.disconnect();
      let n=0; const step=to/60;
      const iv=setInterval(()=>{ n+=step; if(n>=to){setVal(to);clearInterval(iv);}else setVal(Math.floor(n)); },18);
    },{threshold:0.4});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[to]);
  return (
    <span ref={ref} style={{ fontFamily:"'Archivo',sans-serif", fontWeight:900, fontSize:"clamp(2rem,4vw,3rem)", color:t.blue, letterSpacing:"-0.04em" }}>
      {val.toLocaleString()}{suffix}
    </span>
  );
};

// ─── EYEBROW ───────────────────────────────────────────────────────────────────
const Eyebrow = ({ label, t, center=false }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, justifyContent:center?"center":"flex-start" }}>
    <div style={{ width:28, height:1, background:t.textFaint }} />
    <span style={{ fontFamily:"'Archivo',sans-serif", fontSize:10.5, fontWeight:700, letterSpacing:"0.16em", color:t.textMuted, textTransform:"uppercase" }}>{label}</span>
    {center && <div style={{ width:28, height:1, background:t.textFaint }} />}
  </div>
);

// ─── ITALIC BLUE ───────────────────────────────────────────────────────────────
const IB = ({ children, t }) => (
  <span style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontWeight:700, color:t.blue }}>{children}</span>
);

// ─── BIG H2 ────────────────────────────────────────────────────────────────────
const H2 = ({ children, t, center=false }) => (
  <h2 style={{ fontFamily:"'Archivo',sans-serif", fontWeight:900, fontSize:"clamp(2rem,4.2vw,3.6rem)", lineHeight:1.05, letterSpacing:"-0.04em", color:t.text, textAlign:center?"center":"left" }}>
    {children}
  </h2>
);

// ─── FEATURE CARD ──────────────────────────────────────────────────────────────
const FCard = ({ icon, title, desc, t, hl=false }) => {
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      background: hl ? t.blueBg : (h ? t.bgCardHov : t.bgCard),
      border:`1px solid ${h||hl ? t.borderHov : t.border}`,
      borderRadius:18, padding:"28px 24px",
      transition:"all 0.25s",
      transform: h?"translateY(-3px)":"none",
      cursor:"default",
    }}>
      <div style={{ width:44,height:44,background:t.blueBg,border:`1px solid ${t.blueBorder}`,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,fontSize:20 }}>{icon}</div>
      <h3 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:700,fontSize:15,color:t.text,marginBottom:8 }}>{title}</h3>
      <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:13,color:t.textMuted,lineHeight:1.7 }}>{desc}</p>
    </div>
  );
};

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const FaqItem = ({ q, a, t }) => {
  const [open,setOpen]=useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${t.border}` }}>
      <div onClick={()=>setOpen(!open)} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0",cursor:"pointer",fontFamily:"'Archivo',sans-serif",fontSize:15.5,fontWeight:600,color:open?t.blue:t.text,transition:"color 0.2s" }}>
        {q}
        <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,border:`1.5px solid ${open?t.blue:t.border}`,background:open?t.blue:"transparent",color:open?"#fff":t.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"all 0.2s" }}>
          {open?"−":"+"}
        </div>
      </div>
      {open && <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:14,color:t.textMuted,lineHeight:1.75,paddingBottom:20 }}>{a}</p>}
    </div>
  );
};

// ─── THE LEAK SECTION (always dark) ───────────────────────────────────────────
const TheLeakSection = () => {
  const leakItems = [
    { num:"01", icon:"📵", title:"Medicine out of stock — no alert", desc:"A patient drives to your pharmacy. The medicine they need is empty. No warning was sent. They leave frustrated and never come back." },
    { num:"02", icon:"🕐", title:"After-hours searches vanish",       desc:"Someone searches for Paracetamol at 10 PM. No pharmacy is responding. That patient walks to whoever answers first — not you." },
    { num:"03", icon:"📞", title:"Patients call five pharmacies",     desc:"Without live stock visibility, patients dial every pharmacy they know. Most give up before finding you. Your footfall drops week after week." },
    { num:"04", icon:"💸", title:"Billing errors lose revenue",       desc:"Manual billing means wrong pricing, missed discounts, and stock that doesn't deduct. Small errors compound into serious losses every month." },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(()=>{
    const iv = setInterval(()=>setActiveIdx(p=>(p+1)%leakItems.length), 3400);
    return ()=>clearInterval(iv);
  },[]);

  return (
    <section style={{ background:"#000000", padding:"84px 8vw", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize:"64px 64px", pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,display:"flex" }}>
        <div style={{ width:"38%",height:"100%",background:"#ef4444",opacity:0.8 }} />
        <div style={{ width:"46%",height:"100%",background:"#2563eb",marginLeft:8 }} />
      </div>

      <div style={{ position:"relative",zIndex:1 }}>
        <div style={{ display:"inline-flex",alignItems:"center",border:"1px solid rgba(255,255,255,0.14)",borderRadius:100,padding:"5px 16px",marginBottom:28,background:"rgba(255,255,255,0.03)" }}>
          <span style={{ fontFamily:"'Archivo',sans-serif",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:"0.14em",textTransform:"uppercase" }}>THE LEAK</span>
        </div>

        <h2 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:"clamp(2.4rem,5vw,4.2rem)",lineHeight:1.03,letterSpacing:"-0.04em",color:"#fff",marginBottom:20,maxWidth:700 }}>
          Your pharmacy is losing{" "}
          <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontWeight:700,color:"#2563eb" }}>₹2–4 Lakhs</span>
          <br />every month. Here's where.
        </h2>

        <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:14.5,color:"rgba(255,255,255,0.38)",lineHeight:1.75,maxWidth:500,marginBottom:56 }}>
          Most pharmacy owners know they miss patients. Almost none know how much it actually costs. These are the four gaps bleeding revenue every single day.
        </p>

        <div style={{ display:"flex",gap:"clamp(32px,6vw,80px)",alignItems:"flex-start",flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 340px",maxWidth:620 }}>
            {leakItems.map((item,i)=>(
              <div key={i} onClick={()=>setActiveIdx(i)} style={{ display:"flex",gap:0,cursor:"pointer",position:"relative" }}>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:52,flexShrink:0,paddingTop:6 }}>
                  <div style={{ width:38,height:24,borderRadius:100,border:`1px solid ${activeIdx===i?"#2563eb":"rgba(255,255,255,0.15)"}`,background:activeIdx===i?"rgba(37,99,235,0.14)":"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Archivo',sans-serif",fontWeight:700,fontSize:10.5,color:activeIdx===i?"#2563eb":"rgba(255,255,255,0.35)",letterSpacing:"0.06em",transition:"all 0.3s",flexShrink:0,zIndex:1,marginBottom:8 }}>{item.num}</div>
                  {i<leakItems.length-1&&(<div style={{ width:1,flex:1,minHeight:40,background:activeIdx>i?"rgba(37,99,235,0.4)":"rgba(255,255,255,0.07)",transition:"background 0.4s",marginBottom:8 }}/>)}
                </div>
                <div style={{ flex:1,background:activeIdx===i?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.01)",border:`1px solid ${activeIdx===i?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.05)"}`,borderRadius:18,padding:"20px 22px",marginBottom:i<leakItems.length-1?10:0,transition:"all 0.3s" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:12 }}>
                    <div style={{ width:40,height:40,borderRadius:"50%",background:activeIdx===i?"rgba(37,99,235,0.18)":"rgba(255,255,255,0.05)",border:`1px solid ${activeIdx===i?"rgba(37,99,235,0.35)":"rgba(255,255,255,0.08)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,transition:"all 0.3s" }}>{item.icon}</div>
                    <h3 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:700,fontSize:"clamp(0.95rem,1.6vw,1.1rem)",color:activeIdx===i?"#fff":"rgba(255,255,255,0.5)",lineHeight:1.25,transition:"color 0.3s" }}>{item.title}</h3>
                  </div>
                  <div style={{ maxHeight:activeIdx===i?120:0,overflow:"hidden",opacity:activeIdx===i?1:0,transition:"all 0.4s ease" }}>
                    <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:13.5,color:"rgba(255,255,255,0.35)",lineHeight:1.75 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex:"1 1 260px",display:"flex",flexDirection:"column",gap:14,position:"relative" }}>
            <div style={{ position:"absolute",left:-1,top:0,bottom:0,width:1,background:"linear-gradient(to bottom, transparent, rgba(37,99,235,0.4) 30%, rgba(37,99,235,0.4) 70%, transparent)" }}/>
            <div style={{ position:"absolute",left:-5,top:"38%",width:10,height:10,borderRadius:"50%",background:"#ef4444",boxShadow:"0 0 8px #ef4444",zIndex:2 }}/>
            <div style={{ background:"#0a0a0a",border:"1px solid rgba(37,99,235,0.22)",borderRadius:20,padding:"28px 24px",transition:"all 0.4s" }}>
              <div style={{ width:48,height:48,borderRadius:13,background:"rgba(37,99,235,0.11)",border:"1px solid rgba(37,99,235,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:16 }}>{leakItems[activeIdx].icon}</div>
              <div style={{ fontFamily:"'Archivo',sans-serif",fontSize:10,fontWeight:700,color:"rgba(37,99,235,0.65)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10 }}>REVENUE LEAK #{leakItems[activeIdx].num}</div>
              <h3 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:"clamp(1rem,1.8vw,1.3rem)",color:"#fff",lineHeight:1.2,letterSpacing:"-0.025em",marginBottom:12 }}>{leakItems[activeIdx].title}</h3>
              <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:13,color:"rgba(255,255,255,0.38)",lineHeight:1.75 }}>{leakItems[activeIdx].desc}</p>
              <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#ef4444",boxShadow:"0 0 6px #ef4444" }}/>
                <span style={{ fontFamily:"'Archivo',sans-serif",fontSize:11,color:"rgba(255,255,255,0.28)",fontWeight:600 }}>MediCare plugs this gap automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── YOUR MOVE SECTION (always dark) ──────────────────────────────────────────
const YourMoveSection = ({ navigate }) => (
  <section style={{ background:"#000000",position:"relative",overflow:"hidden" }}>
    <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,backgroundSize:"60px 60px",opacity:0.4,pointerEvents:"none" }}/>
    <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"900px",height:"500px",background:"radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0.15) 40%, transparent 70%)",filter:"blur(60px)",pointerEvents:"none" }}/>
    <div style={{ position:"absolute",inset:0,background:"radial-gradient(circle at center, transparent 40%, black 90%)",pointerEvents:"none" }}/>

    <BlurBlob blobs={[{ top:"40%",left:"50%",width:"900px",height:"400px",color:"bg-blue-500",delay:"0s" },{ top:"60%",left:"50%",width:"700px",height:"300px",color:"bg-purple-500",delay:"3s" }]} />

    <div style={{ position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"110px 8vw",minHeight:"94vh" }}>
      <div style={{ position:"absolute",inset:0,zIndex:0,pointerEvents:"none" }}>
        <ShapeGrid speed={0.5} direction="diagonal" borderColor="#271E37" hoverFillColor="#222222" shape="square" hoverTrailAmount={0} />
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"900px",height:"500px",background:"radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0.1) 50%, transparent 80%)",filter:"blur(60px)" }}/>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(circle at center, transparent 40%, black 90%)" }}/>
      </div>

      <div style={{ position:"relative",zIndex:2 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,justifyContent:"center",marginBottom:28 }}>
          <div style={{ width:38,height:1,background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}/>
          <span style={{ fontFamily:"'Archivo',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.18em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase" }}>YOUR MOVE</span>
          <div style={{ width:38,height:1,background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}/>
        </div>

        <h2 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:"clamp(3rem,6.5vw,5.8rem)",lineHeight:1.02,letterSpacing:"-0.045em",color:"#fff",marginBottom:26,maxWidth:700,textShadow:"0 0 40px rgba(37,99,235,0.35)" }}>
          Stop losing<br/>patients{" "}
          <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontWeight:700,color:"#f97316" }}>today.</span>
        </h2>

        <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:16,color:"rgba(255,255,255,0.5)",lineHeight:1.75,maxWidth:520,margin:"0 auto 48px" }}>
          Somewhere right now, a patient is searching for medicine in your area and no pharmacy is showing up. That patient is worth ₹6,000–₹12,000 over their lifetime. With MediCare, your pharmacy gets found, that patient books, that revenue is yours.
        </p>

        <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:36 }}>
          <button style={{ background:"#fff",color:"#000",padding:"16px 40px",borderRadius:100,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"'Archivo',sans-serif" }}>Find Medicine Nearby →</button>
          <button style={{ background:"transparent",color:"rgba(255,255,255,0.7)",padding:"16px 40px",borderRadius:100,fontWeight:600,cursor:"pointer",border:"1px solid rgba(255,255,255,0.18)",fontFamily:"'Archivo',sans-serif" }}>Register Your Pharmacy</button>
        </div>
      </div>
    </div>
  </section>
);

// ─── DARK TOKENS (for sections that are always dark) ──────────────────────────
const DARK_STATIC = {
  blue:       "#2563eb",
  blueLight:  "#3b82f6",
  blueBg:     "rgba(37,99,235,0.1)",
  blueBorder: "rgba(37,99,235,0.25)",
  tagBg:      "rgba(37,99,235,0.12)",
  tagText:    "#3b82f6",
  bgCard:     "#111111",
  border:     "rgba(255,255,255,0.08)",
  borderHov:  "rgba(37,99,235,0.45)",
  text:       "#ffffff",
  textMuted:  "rgba(255,255,255,0.45)",
  textFaint:  "rgba(255,255,255,0.2)",
  bgAlt:      "#0a0a0a",
};

// ─── MAIN HOME ─────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  // ── Read from context — no local state needed ─────────────────────────────
  const { dark, t } = useTheme();

  const btnP = { background:t.blue,color:"#fff",padding:"13px 28px",borderRadius:12,fontFamily:"'Archivo',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",border:"none",display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.2s" };
  const btnS = { background:"transparent",color:t.text,padding:"13px 28px",borderRadius:12,fontFamily:"'Archivo',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",border:`1px solid ${t.border}`,display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.2s" };

  return (
    <div style={{ background:t.bg, color:t.text, fontFamily:"'Archivo',sans-serif", overflowX:"hidden", transition:"background 0.35s, color 0.35s" }}>

      <style>{`
        @keyframes mc-tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes mc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.8)} }
        @keyframes mc-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ paddingTop:62 }}><Ticker t={t} /></div>

      {/* ══ HERO ══ */}
      <section style={{ padding:"80px 8vw 90px",display:"flex",flexWrap:"wrap",alignItems:"center",gap:"clamp(40px,6vw,80px)",background:t.bg,animation:"mc-in 0.6s ease both" }}>
        <div style={{ flex:"1 1 360px",maxWidth:580 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:t.tagBg,border:`1px solid ${t.blueBorder}`,borderRadius:100,padding:"5px 16px",marginBottom:26 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:t.blue,animation:"mc-pulse 2s infinite" }} />
            <span style={{ fontFamily:"'Archivo',sans-serif",fontSize:11,fontWeight:600,color:t.tagText,letterSpacing:"0.1em" }}>GPS-POWERED · LIVE IN MAHARASHTRA</span>
          </div>
          <h1 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:"clamp(2.8rem,5.8vw,5rem)",lineHeight:1.02,letterSpacing:"-0.04em",color:t.text,marginBottom:6 }}>Find Medicine.</h1>
          <h1 style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontWeight:700,fontSize:"clamp(2.8rem,5.8vw,5rem)",lineHeight:1.02,letterSpacing:"-0.02em",color:t.blue,marginBottom:6 }}>Find Nearby.</h1>
          <h1 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:"clamp(2.8rem,5.8vw,5rem)",lineHeight:1.02,letterSpacing:"-0.04em",color:t.text,marginBottom:24 }}>Feel Better.</h1>
          <p style={{ fontFamily:"'Archivo',sans-serif",fontWeight:300,fontSize:"clamp(1rem,1.8vw,1.12rem)",color:t.textMuted,marginBottom:10,lineHeight:1.6 }}>
            Powered by GPS —{" "}
            <TypeAnimation
              sequence={["real-time stock visibility.",2000,"nearby pharmacy search.",2000,"smart medicine alternatives.",2000,"instant billing system.",2000]}
              wrapper="span" speed={60} repeat={Infinity}
              style={{ color:t.blue,fontWeight:600 }}
            />
          </p>
          <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:14,color:t.textMuted,lineHeight:1.75,maxWidth:430,marginBottom:36 }}>
            Search any medicine, see which pharmacy nearby has it in stock right now, compare prices, then navigate there instantly.
          </p>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginBottom:30 }}>
            <button style={btnP} onClick={()=>navigate("/medicines")} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Search Medicines →</button>
            <button style={btnS} onClick={()=>navigate("/signup")} onMouseEnter={e=>{ e.currentTarget.style.borderColor=t.blue; e.currentTarget.style.color=t.blue; }} onMouseLeave={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.text; }}>Register Pharmacy</button>
          </div>
          <div style={{ display:"flex",gap:22,flexWrap:"wrap" }}>
            {["✓ Free to use","✓ GPS-enabled","✓ Verified shops"].map(x=>(
              <span key={x} style={{ fontFamily:"'Archivo',sans-serif",fontSize:12,color:t.textFaint,fontWeight:500 }}>{x}</span>
            ))}
          </div>
        </div>

        <div style={{ flex:"1 1 300px",display:"flex",flexDirection:"column",alignItems:"center",gap:24 }}>
          <Tilt tiltMaxAngleX={9} tiltMaxAngleY={9} perspective={900} scale={1.02}>
            <div style={{ position:"relative",width:"clamp(200px,26vw,310px)",height:"clamp(200px,26vw,310px)" }}>
              <div style={{ position:"absolute",left:"50%",top:0,transform:"translateX(-50%)",width:"33%",height:"100%",borderRadius:18,border:`1px solid ${dark?"rgba(37,99,235,0.45)":"rgba(37,99,235,0.3)"}`,overflow:"hidden" }}>
                <img src={medicalImage} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",filter:dark?"grayscale(20%) brightness(0.75)":"grayscale(10%) brightness(0.92)" }} />
                <div style={{ position:"absolute",inset:0,background:dark?"rgba(0,0,0,0.3)":"rgba(255,255,255,0.1)" }} />
              </div>
              <div style={{ position:"absolute",top:"50%",left:0,transform:"translateY(-50%)",height:"33%",width:"100%",borderRadius:18,border:`1px solid ${dark?"rgba(37,99,235,0.35)":"rgba(37,99,235,0.22)"}`,overflow:"hidden" }}>
                <img src={medicalImage} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",filter:dark?"grayscale(20%) brightness(0.75)":"grayscale(10%) brightness(0.92)" }} />
                <div style={{ position:"absolute",inset:0,background:dark?"rgba(0,0,0,0.3)":"rgba(255,255,255,0.1)" }} />
              </div>
              <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:50,height:50,borderRadius:13,background:t.blue,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:26,color:"#fff" }}>+</div>
              <div style={{ position:"absolute",top:-10,right:-24,background:t.bgCard,border:`1px solid ${t.border}`,borderRadius:12,padding:"7px 14px" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:17,color:t.blue }}>1,200+</div>
                <div style={{ fontFamily:"'Archivo',sans-serif",fontSize:10,color:t.textMuted,marginTop:1 }}>Medicines</div>
              </div>
              <div style={{ position:"absolute",bottom:-10,left:-24,background:t.bgCard,border:`1px solid ${t.border}`,borderRadius:12,padding:"7px 14px" }}>
                <div style={{ fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:17,color:t.blue }}>350+</div>
                <div style={{ fontFamily:"'Archivo',sans-serif",fontSize:10,color:t.textMuted,marginTop:1 }}>Medicines</div>
              </div>
            </div>
          </Tilt>
        </div>
      </section>

      {/* ══ STATS (always dark) ══ */}
      <div style={{ background:"#000",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"44px 8vw",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:32,textAlign:"center" }}>
        {[{n:15000,s:"+",l:"Patients Served"},{n:350,s:"+",l:"Verified Pharmacies"},{n:1200,s:"+",l:"Medicines Listed"},{n:98,s:"%",l:"Satisfaction Rate"}].map(({n,s,l})=>(
          <div key={l}>
            <CountUp to={n} suffix={s} t={DARK_STATIC} />
            <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:5 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* ══ THE LEAK (always dark) ══ */}
      <TheLeakSection />

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding:"96px 8vw",background:t.bg }}>
        <div style={{ textAlign:"center",marginBottom:72 }}>
          <Eyebrow label="The Protocol" t={t} center />
          <h2 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:"clamp(2.4rem,5.2vw,4.2rem)",lineHeight:1.04,letterSpacing:"-0.045em",color:t.text,marginBottom:18 }}>
            Four steps.{" "}<span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:t.blue,fontWeight:700 }}>Live by Friday.</span>
          </h2>
          <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:16,color:t.textMuted,lineHeight:1.7,maxWidth:560,margin:"0 auto" }}>No hardware. No changes for your staff.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"clamp(20px,3vw,32px)",alignItems:"start" }}>
          {[
            { num:"01",icon:"📋",title:"Register your pharmacy",desc:"Fill in your details and drug license number. Verification takes under 24 hours." },
            { num:"02",icon:"📦",title:"List your live inventory",desc:"Add medicines with stock counts, pricing, and discounts. Real-time sync across all devices." },
            { num:"03",icon:"🔍",title:"Patients find you instantly",desc:"Every nearby patient searching for your medicines sees your pharmacy — with stock and price." },
            { num:"04",icon:"📊",title:"Track sales & restock smart",desc:"Billing auto-deducts stock on every sale. Low-stock alerts fire before you run out." },
          ].map(({ num,icon,title,desc },i)=>(
            <div key={i} style={{ display:"flex",flexDirection:"column" }}>
              <div style={{ width:96,height:96,borderRadius:22,border:`2px solid ${t.border}`,background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:17,letterSpacing:"0.05em",color:t.textMuted,marginBottom:32 }}>{num}</div>
              <div style={{ width:40,height:40,borderRadius:11,background:t.blueBg,border:`1px solid ${t.blueBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:20 }}>{icon}</div>
              <div style={{ width:"100%",height:0,borderTop:`1.5px dashed ${t.border}`,marginBottom:20 }}/>
              <h3 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:"clamp(1rem,1.5vw,1.15rem)",color:t.text,lineHeight:1.25,letterSpacing:"-0.02em",marginBottom:10 }}>{title}</h3>
              <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:13.5,color:t.textMuted,lineHeight:1.78 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FOR WHO ══ */}
      <section style={{ padding:"84px 8vw",background:t.bgAlt,borderTop:`1px solid ${t.border}`,borderBottom:`1px solid ${t.border}` }}>
        <Eyebrow label="Who It's For" t={t} />
        <H2 t={t}>Built for patients <IB t={t}>and owners.</IB></H2>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginTop:48 }}>
          <div style={{ background:t.bgCard,border:`1px solid ${t.border}`,borderRadius:22,padding:"36px 32px" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif",fontSize:10.5,fontWeight:700,letterSpacing:"0.14em",color:t.tagText,textTransform:"uppercase",display:"block",marginBottom:16 }}>For Patients</span>
            <h3 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:"clamp(1.3rem,2.5vw,1.75rem)",color:t.text,lineHeight:1.15,marginBottom:14,letterSpacing:"-0.025em" }}>Stop calling pharmacies one by one</h3>
            <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:13.5,color:t.textMuted,lineHeight:1.75,marginBottom:22 }}>Search once and see every verified pharmacy nearby that has your medicine in stock.</p>
            <ul style={{ listStyle:"none",padding:0,margin:"0 0 28px",display:"flex",flexDirection:"column",gap:10 }}>
              {["Search any medicine in seconds","Compare prices across pharmacies","One-tap Google Maps directions","Smart alternatives if out of stock"].map(item=>(
                <li key={item} style={{ display:"flex",gap:10,fontFamily:"'Archivo',sans-serif",fontSize:13.5,color:t.textMuted }}>
                  <span style={{ color:t.blue,flexShrink:0,fontWeight:700 }}>→</span>{item}
                </li>
              ))}
            </ul>
            <button style={btnP} onClick={()=>navigate("/medicines")} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Find Medicines Now →</button>
          </div>

          <div style={{ background:"#000",border:"1px solid rgba(37,99,235,0.18)",borderRadius:22,padding:"36px 32px" }}>
            <span style={{ fontFamily:"'Archivo',sans-serif",fontSize:10.5,fontWeight:700,letterSpacing:"0.14em",color:"rgba(255,255,255,0.35)",textTransform:"uppercase",display:"block",marginBottom:16 }}>For Pharmacy Owners</span>
            <h3 style={{ fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:"clamp(1.3rem,2.5vw,1.75rem)",color:"#fff",lineHeight:1.15,marginBottom:14,letterSpacing:"-0.025em" }}>A full business dashboard, free</h3>
            <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:13.5,color:"rgba(255,255,255,0.45)",lineHeight:1.75,marginBottom:22 }}>Register your pharmacy, list your inventory, get discovered by patients instantly.</p>
            <ul style={{ listStyle:"none",padding:0,margin:"0 0 28px",display:"flex",flexDirection:"column",gap:10 }}>
              {["Manage inventory with real-time stock","Billing with auto stock deduction","Monthly revenue & sales analytics","Low stock alerts and expiry tracking"].map(item=>(
                <li key={item} style={{ display:"flex",gap:10,fontFamily:"'Archivo',sans-serif",fontSize:13.5,color:"rgba(255,255,255,0.45)" }}>
                  <span style={{ color:DARK_STATIC.blue,flexShrink:0,fontWeight:700 }}>→</span>{item}
                </li>
              ))}
            </ul>
            <button style={{ background:"transparent",color:"#fff",padding:"13px 28px",borderRadius:12,fontFamily:"'Archivo',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",border:"1px solid rgba(255,255,255,0.18)",display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.2s" }}
              onClick={()=>navigate("/signup")}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=DARK_STATIC.blue; e.currentTarget.style.color=DARK_STATIC.blueLight; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; e.currentTarget.style.color="#fff"; }}
            >Register Your Pharmacy →</button>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding:"84px 8vw",background:t.bg }}>
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <Eyebrow label="Proof" t={t} center />
          <H2 t={t} center>Trusted by patients & <IB t={t}>pharmacy owners.</IB></H2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16 }}>
          {[
            { init:"AK",name:"Arjun Kulkarni",role:"Patient · Aurangabad",text:"Found a rare blood pressure medicine 0.8 km away in two minutes. This is genuinely a lifesaver.",pill:"FOUND IN 2 MIN",avBg:t.blueBg,avColor:t.blue,avBorder:t.blueBorder },
            { init:"PM",name:"Priya Mehta",role:"Pharmacy Owner · Pune",text:"The billing dashboard replaced all my paperwork. Stock updates automatically with every single sale.",pill:"2 HRS SAVED DAILY",avBg:t.bgAlt,avColor:t.text,avBorder:t.border },
            { init:"RD",name:"Rahul Desai",role:"Patient · Nashik",text:"Three pharmacies had my prescription. I picked the closest with the biggest discount.",pill:"3 PHARMACIES COMPARED",avBg:"rgba(239,68,68,0.1)",avColor:"#ef4444",avBorder:"rgba(239,68,68,0.2)" },
          ].map(({ init,name,role,text,pill,avBg,avColor,avBorder })=>{
            const [hov,setHov]=useState(false);
            return (
              <div key={name} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
                style={{ background:t.bgCard,border:`1px solid ${hov?t.blue:t.border}`,borderRadius:18,padding:"28px 24px",position:"relative",transition:"border-color 0.25s,transform 0.25s",transform:hov?"translateY(-3px)":"none",cursor:"default" }}>
                <div style={{ position:"absolute",top:14,right:20,fontFamily:"'Instrument Serif',serif",fontSize:60,lineHeight:1,color:t.blueBg,fontWeight:700,userSelect:"none" }}>"</div>
                <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:13.5,color:t.textMuted,lineHeight:1.75,marginBottom:20,fontStyle:"italic" }}>"{text}"</p>
                <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:t.tagBg,border:`1px solid ${t.blueBorder}`,borderRadius:100,padding:"4px 13px",marginBottom:18 }}>
                  <span style={{ width:5,height:5,borderRadius:"50%",background:t.blue }} />
                  <span style={{ fontFamily:"'Archivo',sans-serif",fontSize:10,fontWeight:700,color:t.tagText,letterSpacing:"0.08em" }}>{pill}</span>
                </div>
                <div style={{ borderTop:`1px solid ${t.border}`,paddingTop:14,display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:12,flexShrink:0,background:avBg,color:avColor,border:`1px solid ${avBorder}` }}>{init}</div>
                  <div>
                    <p style={{ fontFamily:"'Archivo',sans-serif",fontWeight:700,fontSize:13,color:t.text,margin:0 }}>{name}</p>
                    <p style={{ fontFamily:"'Archivo',sans-serif",fontSize:11,color:t.textFaint,marginTop:1,marginBottom:0 }}>{role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section style={{ padding:"84px 8vw",background:t.bgAlt,borderTop:`1px solid ${t.border}` }}>
        <div style={{ textAlign:"center" }}>
          <Eyebrow label="Questions" t={t} center />
          <H2 t={t} center>The answers you <IB t={t}>came here for.</IB></H2>
        </div>
        <div style={{ maxWidth:760,margin:"48px auto 0" }}>
          <FaqItem q="How does GPS search work?" a="Your browser shares your location (with permission). We instantly scan all verified pharmacies within your chosen radius — 1 km, 3 km, or 5 km — and show who has your medicine in stock right now, sorted by distance." t={t} />
          <FaqItem q="Is MediCare free for patients?" a="Completely free for patients. Always. You search, compare, and navigate at no cost." t={t} />
          <FaqItem q="How do pharmacies keep stock accurate?" a="Every sale through our billing system automatically deducts stock. Low-stock alerts notify owners before they run out." t={t} />
          <FaqItem q="What if my medicine is not found nearby?" a="We show smart generic alternatives sorted by sales volume and price. You can also expand your search radius up to 10 km." t={t} />
          <FaqItem q="How do I register my pharmacy?" a="Click Register Pharmacy, fill in your details and drug license number. Verification takes under 24 hours." t={t} />
        </div>
      </section>

      {/* ══ YOUR MOVE (always dark) ══ */}
      <YourMoveSection navigate={navigate} />
    </div>
  );
};

export default Home;