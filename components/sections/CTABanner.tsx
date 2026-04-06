"use client";

import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section
      style={{
        background: "var(--revo-black)",
        color: "#ffffff",
        padding: "clamp(5rem, 10vw, 8rem) 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "var(--revo-blue)",
          opacity: 0.07,
          filter: "blur(120px)",
          top: "-30%",
          right: "-10%",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#ffffff",
              marginBottom: "2rem",
              maxWidth: "24ch",
              marginInline: "auto",
            }}
          >
            Prêt à transformer la donnée en&nbsp;décisions&nbsp;?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.65)",
              marginBottom: "2.5rem",
              lineHeight: 1.7,
            }}
          >
            Disponible pour un stage, un projet freelance ou une opportunité.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/cv.pdf" download className="btn-white">
              Télécharger le CV
            </a>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.875rem 2rem",
                borderRadius: "9999px",
                background: "rgba(244,244,244,0.1)",
                color: "#f4f4f4",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.875rem",
                border: "1.5px solid rgba(244,244,244,0.35)",
                cursor: "pointer",
                textDecoration: "none",
                whiteSpace: "nowrap",
                minHeight: 48,
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(244,244,244,0.18)";
                e.currentTarget.style.borderColor = "rgba(244,244,244,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(244,244,244,0.1)";
                e.currentTarget.style.borderColor = "rgba(244,244,244,0.35)";
              }}
            >
              Me contacter
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
