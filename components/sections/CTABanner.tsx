"use client";

import { motion } from "framer-motion";
import { SplitWords, FadeUp } from "@/components/TextReveal";

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
      {/* Grid overlay */}
      <div className="bg-grid-pattern" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {/* Orbs */}
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "var(--revo-blue)", opacity: 0.10, filter: "blur(130px)", top: "-30%", right: "-10%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#a855f7", opacity: 0.07, filter: "blur(100px)", bottom: "-20%", left: "-5%", pointerEvents: "none" }} />

      {/* Top separator */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(73,79,223,0.5) 50%, transparent)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div>
          <SplitWords
            text="Prêt à transformer la donnée en décisions ?"
            delay={0.05}
            stagger={0.055}
            duration={0.85}
            as="h2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#ffffff",
              marginBottom: "2rem",
              justifyContent: "center",
            }}
          />
          <FadeUp delay={0.45} blur>
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
          </FadeUp>
          <FadeUp delay={0.6}>
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
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
