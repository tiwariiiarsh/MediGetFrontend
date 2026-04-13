// src/pages/Contact.jsx
import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";

const CONTACT_EMAIL = "arshtiwari1102@gmail.com";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/arsh-tiwari-586104321",
    color: "#1d4ed8",
    icon: (c) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mr_arshtiwari/",
    color: "#c2185b",
    icon: (c) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill={c}/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/arshtiwari91195",
    color: "#374151",
    icon: (c) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

const contactItems = [
  { icon: FiMapPin, label: "Address",      value: "Army Institute of Technology, Pune, Maharashtra" },
  { icon: FiMail,   label: "Email",        value: CONTACT_EMAIL,  href: `mailto:${CONTACT_EMAIL}` },
  { icon: FiPhone,  label: "Phone",        value: "+91 89579 89265" },
  { icon: FiClock,  label: "Response Time",value: "Within 24 hours on business days" },
];

const Contact = () => {
  const { t } = useTheme();
  const accent = t.accent;
  const blue   = t.blue;

  const [form,    setForm]    = useState({ name: "", email: "", subject: "", message: "" });
  const [sent,    setSent]    = useState(false);
  const [hovCard, setHovCard] = useState(null);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    // Opens mail client with pre-filled content
    const subject = encodeURIComponent(form.subject || "Contact from MediCare website");
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    borderRadius: 12, background: t.bgAlt,
    border: `1px solid ${t.border}`,
    color: t.text, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 700,
    color: t.textMuted, textTransform: "uppercase",
    letterSpacing: "0.09em", display: "block", marginBottom: 8,
  };

  const cardBase = (id) => ({
    background: t.bgCard,
    border: `1.5px solid ${hovCard === id ? blue : t.border}`,
    borderRadius: 20,
    transition: "border-color 0.22s, transform 0.22s, box-shadow 0.22s",
    transform: hovCard === id ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hovCard === id ? `0 10px 36px ${blue}18` : "none",
  });

  const disabled = !form.name || !form.email || !form.message;

  return (
    <div style={{
      minHeight: "100vh",
      background: t.bg, color: t.text,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.3s, color 0.3s",
      paddingBottom: 80,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ padding: "120px 8vw 64px", borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, marginBottom: 16 }}>
          Contact Us
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          lineHeight: 1.15, letterSpacing: "-0.02em",
          maxWidth: 640, margin: "0 0 20px", color: t.text,
        }}>
          We'd love to hear from you.
        </h1>
        <p style={{ color: t.textMuted, fontSize: 15, lineHeight: 1.8, maxWidth: 520, margin: 0 }}>
          Whether you're a patient, pharmacy partner, or investor — reach out and we'll respond within 24 hours.
        </p>
      </div>

      {/* MAIN GRID */}
      <div style={{
        padding: "56px 8vw",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24, alignItems: "start",
      }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Contact details */}
          <div
            onMouseEnter={() => setHovCard("details")}
            onMouseLeave={() => setHovCard(null)}
            style={{ ...cardBase("details"), padding: "26px 24px" }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted, marginBottom: 20 }}>
              Contact Details
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {contactItems.map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${accent}14`, border: `1px solid ${accent}28`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <item.icon style={{ color: accent, fontSize: 15 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, margin: "0 0 3px" }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} style={{ fontSize: 14, color: blue, textDecoration: "none", fontWeight: 600 }}>{item.value}</a>
                    ) : (
                      <p style={{ fontSize: 14, color: t.text, margin: 0, lineHeight: 1.5 }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div
            onMouseEnter={() => setHovCard("social")}
            onMouseLeave={() => setHovCard(null)}
            style={{ ...cardBase("social"), padding: "22px 24px" }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted, marginBottom: 16 }}>
              Connect on Social
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    fontSize: 13, fontWeight: 600,
                    color: s.color, textDecoration: "none",
                    padding: "8px 14px", borderRadius: 10,
                    border: `1px solid ${s.color}35`,
                    background: `${s.color}0a`,
                  }}
                >
                  {s.icon(s.color)}{s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Emergency */}
          <div
            onMouseEnter={() => setHovCard("emergency")}
            onMouseLeave={() => setHovCard(null)}
            style={{
              ...cardBase("emergency"),
              padding: "22px 24px",
              background: t.alertBg,
              border: `1.5px solid ${hovCard === "emergency" ? blue : t.alertBorder}`,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.alertColor, marginBottom: 10 }}>
              Emergency Support
            </p>
            <p style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.75, margin: "0 0 14px" }}>
              For urgent medicine requests, email directly for a priority response.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              style={{
                display: "inline-block", fontSize: 13, fontWeight: 700,
                color: t.alertColor, textDecoration: "none",
                padding: "9px 18px", borderRadius: 10,
                border: `1px solid ${t.alertBorder}`,
                background: t.bgCard,
              }}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div
          onMouseEnter={() => setHovCard("form")}
          onMouseLeave={() => setHovCard(null)}
          style={{ ...cardBase("form"), padding: "30px 28px" }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: `${accent}18`, border: `1px solid ${accent}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <FiSend style={{ color: accent, fontSize: 24 }} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text, margin: "0 0 10px" }}>
                Mail client opened!
              </h3>
              <p style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.75, margin: "0 0 24px" }}>
                Your message has been prepared. We'll reply to you at <strong style={{ color: t.text }}>{form.email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                style={{
                  padding: "10px 24px", borderRadius: 10,
                  background: t.bgAlt, border: `1px solid ${t.border}`,
                  color: t.text, fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: t.text, margin: "0 0 26px" }}>
                Send us a message
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Your Name</label>
                    <input
                      name="name" type="text" placeholder="Rahul Sharma"
                      value={form.name} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = accent)}
                      onBlur={(e)  => (e.target.style.borderColor = t.border)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      name="email" type="email" placeholder="you@email.com"
                      value={form.email} onChange={handleChange} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = accent)}
                      onBlur={(e)  => (e.target.style.borderColor = t.border)}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Subject</label>
                  <select
                    name="subject" value={form.subject} onChange={handleChange}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = accent)}
                    onBlur={(e)  => (e.target.style.borderColor = t.border)}
                  >
                    <option value="">Select a topic...</option>
                    <option value="Order / Prescription Query">Order / Prescription Query</option>
                    <option value="Pharmacy Partnership">Pharmacy Partnership</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing Issue">Billing Issue</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Your Message</label>
                  <textarea
                    name="message" rows={5} placeholder="Tell us how we can help..."
                    value={form.message} onChange={handleChange}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = accent)}
                    onBlur={(e)  => (e.target.style.borderColor = t.border)}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={disabled}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", padding: "13px 0", borderRadius: 12,
                    background: disabled ? t.bgAlt : accent,
                    color:      disabled ? t.textMuted : "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: 15,
                    border: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <FiSend size={15} />
                  Send Message
                </button>

                <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center", margin: 0 }}>
                  Sends to <span style={{ color: blue, fontWeight: 600 }}>{CONTACT_EMAIL}</span> · reply within 24 hours
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MAP PLACEHOLDER */}
      <div style={{ padding: "0 8vw" }}>
        <div
          style={{
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: 20, height: 160,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 8,
          }}
        >
          <FiMapPin style={{ color: accent, fontSize: 22 }} />
          <p style={{ fontSize: 14, color: t.textMuted, margin: 0 }}>Army Institute of Technology, Pune, Maharashtra</p>
          <a
            href="https://maps.google.com/?q=Army+Institute+of+Technology+Pune"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, fontWeight: 600, color: blue, textDecoration: "none", marginTop: 4 }}
          >
            View on Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;