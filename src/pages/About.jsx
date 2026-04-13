// src/pages/About.jsx
import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import { Link } from "react-router-dom";
import image from "../image/arsh.jpeg";

const founder = {
  name: "Arsh Tiwari",
  role: "Founder & CEO",
  bio: "Java Full Stack Developer pursuing Bachelor of Engineering (2024–2028) from Army Institute of Technology, Pune. Designed and built MediCare end-to-end — from Spring Boot APIs and JPA repositories to the React frontend and analytics dashboard.",
  photo: image ,
  initials: "AT",
  linkedin: "https://www.linkedin.com/in/arsh-tiwari-586104321",
  instagram: "https://www.instagram.com/mr_arshtiwari/",
  twitter: "https://x.com/arshtiwari91195",
};

const caseStudies = [
  {
    tag: "Case Study · Mumbai",
    title: "Emergency medicine wait time reduced by 68%",
    body: "City Hospital partnered with MediCare to digitise their pharmacy counter. Real-time inventory sync across 14 nearby pharmacies cut average patient wait time from 47 minutes to 15 minutes within 3 months.",
    stat: "68%",
    statLabel: "Faster access",
  },
  {
    tag: "Case Study · Pune",
    title: "3,200 prescriptions fulfilled in a single month for a rural clinic",
    body: "A Pune-based NGO clinic serving 8 remote villages used MediCare's seller network to source generic medicines at verified prices — eliminating counterfeit risk and reducing procurement cost by 31%.",
    stat: "31%",
    statLabel: "Cost reduction",
  },
  {
    tag: "Case Study · Bangalore",
    title: "MedPlus franchise increases revenue 2× using MediCare analytics",
    body: "A South Bangalore franchise used MediCare's low-stock alerts and top-selling analytics to optimise restocking cycles. Monthly revenue doubled in 6 months with zero stockout incidents.",
    stat: "2×",
    statLabel: "Revenue growth",
  },
];

// ── Reusable hover card ──────────────────────────────────────────────────────
const HoverCard = ({ children, style = {} }) => {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.bgCard,
        border: `1.5px solid ${hov ? t.blue : t.border}`,
        borderRadius: 20,
        padding: "28px 26px",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        transition: "border-color 0.22s, transform 0.22s, box-shadow 0.22s",
        boxShadow: hov ? `0 10px 36px ${t.blue}18` : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Founder card ─────────────────────────────────────────────────────────────
const FounderCard = () => {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  const accent = t.accent;
  const blue   = t.blue;
  const f      = founder;

  const socialBtn = (href, color, icon, label) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 7,
        fontSize: 13, fontWeight: 600,
        color: color, textDecoration: "none",
        padding: "8px 16px", borderRadius: 10,
        border: `1px solid ${color}35`,
        background: `${color}0b`,
      }}
    >
      {icon}{label}
    </a>
  );

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.bgCard,
        border: `1.5px solid ${hov ? blue : t.border}`,
        borderRadius: 24,
        padding: "34px 30px",
        maxWidth: 580,
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition: "border-color 0.22s, transform 0.22s, box-shadow 0.22s",
        boxShadow: hov ? `0 14px 44px ${blue}22` : "none",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 22, marginBottom: 22 }}>
        {f.photo ? (
          <img
            src={f.photo}
            alt={f.name}
            style={{ width: 82, height: 82, borderRadius: "50%", objectFit: "cover", border: `2px solid ${t.border}`, flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: 82, height: 82, borderRadius: "50%",
            background: `${accent}14`, border: `2px solid ${accent}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800, color: accent,
            letterSpacing: "0.04em", flexShrink: 0,
          }}>
            {f.initials}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 21, fontWeight: 800, color: t.text, margin: "0 0 5px", letterSpacing: "-0.01em" }}>{f.name}</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.11em", margin: "0 0 12px" }}>
            {f.role}
          </p>
          <span style={{
            fontSize: 12, fontWeight: 600, color: blue,
            background: `${blue}10`, border: `1px solid ${blue}28`,
            borderRadius: 8, padding: "4px 12px",
          }}>
            Java Full Stack Developer
          </span>
        </div>
      </div>

      <p style={{ color: t.textMuted, fontSize: 15, lineHeight: 1.8, margin: "0 0 18px" }}>{f.bio}</p>

      {/* Education */}
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        fontSize: 13, color: t.textMuted,
        marginBottom: 22, paddingBottom: 22,
        borderBottom: `1px solid ${t.border}`,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
        Army Institute of Technology, Pune · B.E. 2024–2028
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {socialBtn(
          f.linkedin, blue,
          <svg width="14" height="14" viewBox="0 0 24 24" fill={blue}>
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>,
          "LinkedIn"
        )}
        {socialBtn(
          f.instagram, "#c2185b",
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2185b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="#c2185b"/>
          </svg>,
          "Instagram"
        )}
        {socialBtn(
          f.twitter, t.textMuted,
          <svg width="14" height="14" viewBox="0 0 24 24" fill={t.textMuted}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>,
          "Twitter / X"
        )}
      </div>
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const About = () => {
  const { t } = useTheme();
  const accent   = t.accent;
  const blue     = t.blue;
  const mutedText = { color: t.textMuted, fontSize: 15, lineHeight: 1.8 };

  return (
    <div style={{
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.3s, color 0.3s",
      paddingBottom: 80,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{ padding: "120px 8vw 72px", borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, marginBottom: 16 }}>
          About MediCare
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
          lineHeight: 1.15, letterSpacing: "-0.02em",
          maxWidth: 760, margin: "0 0 24px", color: t.text,
        }}>
          Healthcare shouldn't be a privilege.<br />We're making it a certainty.
        </h1>
        <p style={{ ...mutedText, maxWidth: 620, margin: 0 }}>
          MediCare connects patients with verified pharmacies across India — bringing transparent pricing,
          real-time stock visibility, and dependable delivery to every household, not just urban centres.
        </p>
      </div>

      {/* MISSION / VISION / VALUES */}
      <div style={{ padding: "64px 8vw", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, borderBottom: `1px solid ${t.border}` }}>
        {[
          { label: "Our Mission", color: accent, body: "Simplify healthcare access by connecting patients to trusted pharmacies. Whether it's an emergency prescription or a monthly refill, MediCare ensures availability, authenticity, and speed." },
          { label: "Our Vision",  color: blue,   body: "A future where every person — regardless of location or income — can access genuine medicines at fair prices within minutes, backed by technology and a verified seller network." },
          { label: "Our Values",  color: t.accent2, body: "Transparency in pricing. Zero tolerance for counterfeit stock. Respect for patient privacy. These aren't talking points — they're constraints every product decision is measured against." },
        ].map((item) => (
          <HoverCard key={item.label}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: item.color, marginBottom: 12 }}>{item.label}</p>
            <p style={{ ...mutedText, margin: 0 }}>{item.body}</p>
          </HoverCard>
        ))}
      </div>

      {/* STATS */}
      <div style={{ padding: "64px 8vw", borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted, marginBottom: 32 }}>By the numbers</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          {[
            { value: "1,200+", label: "Verified pharmacies" },
            { value: "4.8M+",  label: "Prescriptions served" },
            { value: "220+",   label: "Cities covered" },
            { value: "99.3%",  label: "Stock authenticity rate" },
          ].map((s) => (
            <HoverCard key={s.label} style={{ padding: "22px 20px" }}>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: accent, margin: "0 0 6px", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: t.textMuted, margin: 0 }}>{s.label}</p>
            </HoverCard>
          ))}
        </div>
      </div>

      {/* CASE STUDIES */}
      <div style={{ padding: "64px 8vw", borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted, marginBottom: 8 }}>Real impact</p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 36px", color: t.text }}>
          Stories from the ground
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {caseStudies.map((cs) => (
            <HoverCard key={cs.title} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, margin: 0 }}>{cs.tag}</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, lineHeight: 1.4, color: t.text, margin: 0 }}>{cs.title}</p>
              <p style={{ ...mutedText, fontSize: 14, margin: 0, flex: 1 }}>{cs.body}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1 }}>{cs.stat}</span>
                <span style={{ fontSize: 13, color: t.textMuted }}>{cs.statLabel}</span>
              </div>
            </HoverCard>
          ))}
        </div>
      </div>

      {/* FOUNDER */}
     {/* FOUNDER */}
<div
  className="flex flex-col items-center text-center"
  style={{
    padding: "64px 8vw",
    borderBottom: `1px solid ${t.border}`,
  }}
>

  <h2 style={{
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    margin: "0 0 36px",
    color: t.text
  }}>
    The person behind MediCare
  </h2>

  <FounderCard />

</div>

      {/* CTA */}
      <div style={{ padding: "64px 8vw", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", color: t.text, marginBottom: 16 }}>
          Ready to experience better healthcare?
        </h2>
        <p style={{ ...mutedText, marginBottom: 32 }}>Browse verified medicines from trusted pharmacies near you.</p>
        <Link to="/medicines">
          <button style={{ padding: "14px 36px", borderRadius: 12, background: accent, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
            Explore Medicines →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;