"use client";

import { motion, type Easing } from "framer-motion";
import { Mail, Phone, Linkedin, Github, Youtube, Facebook } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const LINKS = [
  { label: "Email", value: "abbaserge2@gmail.com", href: "mailto:abbaserge2@gmail.com", icon: Mail, color: "#ea4335" },
  { label: "Téléphone", value: "+221 78 546 08 74", href: "tel:+221785460874", icon: Phone, color: "var(--revo-mint)" },
  { label: "LinkedIn", value: "linkedin.com/in/sergeabba", href: "https://linkedin.com/in/sergeabba", icon: Linkedin, color: "#0a66c2" },
  { label: "GitHub", value: "github.com/sergeabba", href: "https://github.com/sergeabba", icon: Github, color: "var(--text)" },
  { label: "YouTube Gaming", value: "@thelegendofdon4125", href: "https://www.youtube.com/@thelegendofdon4125", icon: Youtube, color: "#ff0000" },
  { label: "Facebook", value: "The Legend of Don", href: "https://www.facebook.com/thelegendofdon/followers", icon: Facebook, color: "#1877f2" },
];

const ease: Easing = [0.22, 1, 0.36, 1];

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        background: "var(--bg)",
        padding: "clamp(5rem, 10vw, 8rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "var(--revo-blue)", opacity: 0.07, filter: "blur(110px)", top: "-10%", right: "0%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "var(--revo-mint)", opacity: 0.05, filter: "blur(90px)", bottom: "0%", left: "5%", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <span className="section-label">Contact</span>
          <h2 className="section-heading" style={{ maxWidth: "16ch" }}>
            Construisons quelque chose ensemble
          </h2>
        </motion.div>

        {/* Two-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "clamp(3rem, 6vw, 6rem)",
            alignItems: "start",
          }}
        >
          {/* ── Left: Info + Links ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
          >
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                marginBottom: "2.5rem",
                maxWidth: "38ch",
              }}
            >
              Disponible pour un stage, une mission freelance ou une opportunité en entreprise.
              Je vous réponds sous&nbsp;24&nbsp;h.
            </p>

            {/* Contact rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {LINKS.map(({ label, value, href, icon: Icon, color }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease }}
                  whileHover={{ x: 5 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--r-md)",
                    textDecoration: "none",
                    color: "var(--text)",
                    gap: "0.85rem",
                    border: "1px solid transparent",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-elevated)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icon badge */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: `${color}12`,
                    border: `1px solid ${color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} strokeWidth={1.8} style={{ color }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.05rem", minWidth: 0 }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", lineHeight: 1 }}>
                      {label}
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {value}
                    </span>
                  </div>
                  <svg style={{ marginLeft: "auto", color: "var(--text-tertiary)", flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease }}
              style={{ marginTop: "2rem" }}
            >
              <a href="/cv.pdf" download className="btn-primary">
                Télécharger le CV →
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease }}
          >
            <div
              style={{
                background: "var(--bg-elevated)",
                borderRadius: "var(--r-card)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 3vw, 2.25rem)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "1.15rem",
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  marginBottom: "1.5rem",
                }}
              >
                Envoyer un message direct
              </h3>
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
