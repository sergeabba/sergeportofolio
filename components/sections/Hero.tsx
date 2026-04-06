"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import type { Easing } from "framer-motion";
const ease: Easing = [0.22, 1, 0.36, 1];

const SKILLS_MARQUEE = [
  "Python", "Power BI", "SQL", "Pandas", "Matplotlib",
  "Big Data", "Scala", "Spark", "Tableau", "Excel",
  "Canva", "WordPress", "IA Générative", "Prompt Engineering",
  "Data Viz", "Machine Learning", "Numpy", "Scikit-learn",
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y       = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const scale   = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

  return (
    <section
      ref={containerRef}
      id="bio"
      style={{
        background: "var(--revo-black)",
        minHeight: "100svh",
        paddingTop: "clamp(6rem, 12vw, 9rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Grid overlay */}
      <div className="bg-grid-pattern" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {/* Animated orb */}
      <motion.div
        style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          background: "var(--revo-blue)", opacity: 0.07,
          filter: "blur(120px)", top: "-20%", right: "-15%",
          pointerEvents: "none", zIndex: 0,
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "#e61e49", opacity: 0.04,
          filter: "blur(100px)", bottom: "5%", left: "-10%",
          pointerEvents: "none", zIndex: 0,
        }}
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="container"
        style={{ position: "relative", zIndex: 1, opacity, y, scale }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "center",
          }}
        >
          {/* Left: Typography */}
          <div>
            {/* Status badge */}
            <motion.div
              className="status-badge"
              style={{ marginBottom: "2rem", width: "fit-content" }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease }}
            >
              <span className="dot" />
              <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
                Disponible
              </span>
            </motion.div>

            {/* Sub-name */}
            <motion.p
              style={{
                fontFamily: "var(--font-display)", fontWeight: 400,
                fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                letterSpacing: "-0.02em", color: "rgba(255,255,255,0.4)",
                marginBottom: "0.35rem",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease }}
            >
              Abba Serge
            </motion.p>

            {/* Billboard name */}
            <div style={{ overflow: "hidden", marginBottom: "0.25rem" }}>
              <motion.h1
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  fontSize: "clamp(3.5rem, 12vw, 10rem)",
                  letterSpacing: "-0.055em", lineHeight: 0.88,
                  color: "#ffffff", textTransform: "uppercase",
                }}
                initial={{ opacity: 0, y: "110%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.9, ease }}
              >
                MBAITADJIM
              </motion.h1>
            </div>

            {/* Role */}
            <motion.p
              style={{
                fontFamily: "var(--font-display)", fontWeight: 500,
                fontSize: "clamp(1rem, 2.2vw, 1.75rem)",
                letterSpacing: "-0.01em", color: "var(--revo-mint)",
                marginTop: "1rem", marginBottom: "2rem",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6, ease }}
            >
              Data Analyst & Prompt Engineer
            </motion.p>

            {/* Tags */}
            <motion.div
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.48, duration: 0.5 }}
            >
              {["Master Big Data", "Data Stratégie", "ISM Dakar"].map((t, i) => (
                <motion.span
                  key={t}
                  className="pill"
                  style={{
                    background: "transparent",
                    borderColor: "rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.7rem", letterSpacing: "0.05em", textTransform: "uppercase",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6, ease }}
            >
              <motion.a
                href="#realisations"
                className="btn-white"
                whileHover={{ scale: 1.03, opacity: 0.9 }}
                whileTap={{ scale: 0.97 }}
              >
                Voir mes projets
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ background: "rgba(255,255,255,0.12)" }}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "0.875rem 2rem", borderRadius: "9999px",
                  background: "rgba(255,255,255,0.06)",
                  color: "#ffffff",
                  fontFamily: "var(--font-body)", fontWeight: 500,
                  fontSize: "0.875rem", letterSpacing: "0.02em",
                  border: "1px solid rgba(255,255,255,0.2)",
                  textDecoration: "none", whiteSpace: "nowrap", minHeight: 48,
                  transition: "background 0.2s",
                }}
              >
                Me contacter
              </motion.a>
            </motion.div>
          </div>

          {/* Right: floating dashboard card */}
          <div className="hero-dashboard-card">
            <motion.div
              style={{
                background: "var(--revo-dark)",
                borderRadius: "var(--r-card)",
                padding: "1.25rem",
                border: "1px solid rgba(255,255,255,0.07)",
                width: "clamp(200px, 22vw, 320px)",
              }}
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                  Analytics
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--revo-mint)" }} />
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", marginBottom: "0.85rem" }}>
                {[
                  { bg: "var(--revo-black)", text: "#fff", label: "Model", val: "GPT-4" },
                  { bg: "var(--revo-blue)",  text: "#fff", label: "Score", val: "99.8%" },
                  { bg: "var(--revo-mint)",  text: "#191c1f", label: "Status", val: "Live" },
                ].map(({ bg, text, label, val }) => (
                  <div key={label} style={{ background: bg, borderRadius: 12, padding: "0.5rem 0.4rem" }}>
                    <div style={{ fontSize: "0.45rem", letterSpacing: "0.1em", textTransform: "uppercase", color: text === "#fff" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", marginBottom: "0.2rem" }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.65rem", color: text, letterSpacing: "-0.01em" }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Animated bar chart */}
              <div style={{ background: "var(--revo-black)", borderRadius: 14, padding: "0.75rem", display: "flex", alignItems: "flex-end", gap: "0.3rem", height: 90 }}>
                {[40, 65, 50, 90, 72, 58, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    style={{ flex: 1, borderRadius: "6px 6px 0 0", background: i === 3 ? "var(--revo-mint)" : i === 6 ? "var(--revo-blue)" : "rgba(73,79,223,0.35)" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.07, duration: 0.6, ease }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Skills marquee */}
      <motion.div
        style={{ marginTop: "clamp(3rem, 6vw, 5rem)", overflow: "hidden", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className="marquee-fade" style={{ overflow: "hidden" }}>
          <div className="marquee-track" style={{ display: "flex", gap: "2rem", width: "max-content" }}>
            {[...SKILLS_MARQUEE, ...SKILLS_MARQUEE].map((s, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "2rem", whiteSpace: "nowrap" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--revo-mint)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)", letterSpacing: "-0.01em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                  {s}
                </span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Responsive */}
      <style>{`
        .hero-dashboard-card { display: block; }
        @media (max-width: 900px) { .hero-dashboard-card { display: none; } }
      `}</style>
    </section>
  );
}
