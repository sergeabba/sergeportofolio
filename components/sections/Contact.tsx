"use client";

import { motion, type Easing } from "framer-motion";
import ContactForm from "@/components/ContactForm";

const LINKS = [
  { label: "Email",          value: "abbaserge2@gmail.com",      href: "mailto:abbaserge2@gmail.com" },
  { label: "Téléphone",      value: "+221 78 546 08 74",          href: "tel:+221785460874" },
  { label: "LinkedIn",       value: "linkedin.com/in/sergeabba",  href: "https://linkedin.com/in/sergeabba" },
  { label: "GitHub",         value: "github.com/sergeabba",       href: "https://github.com/sergeabba" },
  { label: "YouTube Gaming", value: "@thelegendofdon4125",        href: "https://www.youtube.com/@thelegendofdon4125" },
  { label: "Facebook",       value: "The Legend of Don",          href: "https://www.facebook.com/thelegendofdon/followers" },
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
      {/* Subtle decorative orb */}
      <div
        style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "var(--revo-blue)", opacity: 0.04,
          filter: "blur(100px)", top: 0, right: "5%", pointerEvents: "none",
        }}
      />

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
            Parlons de votre projet
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              {LINKS.map(({ label, value, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease }}
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.9rem 0",
                    borderBottom: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--text)",
                    gap: "1rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--revo-blue)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                >
                  <span
                    style={{
                      fontSize: "0.63rem", fontWeight: 700,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "var(--text-tertiary)", minWidth: 92, flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.88rem", fontWeight: 500, color: "inherit",
                      textAlign: "right", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                  >
                    {value}
                  </span>
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
