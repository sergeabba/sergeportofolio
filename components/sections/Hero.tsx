"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.12], [0, -40]);

  return (
    <section id="bio" style={{ background: "var(--revo-black)", minHeight: "100svh", paddingTop: "clamp(7rem, 12vw, 10rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Subtle grid pattern */}
      <div className="bg-grid-pattern" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      <motion.div className="container" style={{ position: "relative", zIndex: 1, width: "100%", opacity, y, maxWidth: 1400 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "center" }}>

          {/* Left: Typography & CTAs */}
          <div>
            {/* Status badge */}
            <div className="status-badge" style={{ marginBottom: "2.5rem" }}>
              <span className="dot" />
              <span style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Disponible</span>
            </div>

            {/* Sub-name */}
            <motion.h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.5rem, 3vw, 2.5rem)", letterSpacing: "-0.03em", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              Abba Serge
            </motion.h2>

            {/* Billboard name */}
            <motion.h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(3.5rem, 12vw, 11rem)", letterSpacing: "-0.06em", lineHeight: 0.85, color: "#ffffff", textTransform: "uppercase" }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              MBAITADJIM
            </motion.h1>

            {/* Subtitle */}
            <motion.p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.2rem, 2.5vw, 2rem)", letterSpacing: "-0.02em", color: "var(--revo-mint)", marginTop: "0.75rem", marginBottom: "2.5rem" }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              Data Analyst & Prompt Engineer
            </motion.p>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
              {["Master Big Data", "Data Stratégie", "ISM Dakar"].map((t) => (
                <span key={t} className="pill" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{t}</span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <a href="#realisations" className="btn-white" style={{ letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.78rem" }}>Voir mes projets</a>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.85rem 2rem", borderRadius: "9999px", background: "transparent", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.5)", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap", minHeight: 48, transition: "background 0.25s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >Me contacter</a>
            </div>
          </div>

          {/* Right: Dashboard Card */}
          <div className="hidden lg:block" style={{ width: "clamp(220px, 22vw, 340px)", flexShrink: 0 }}>
            <motion.div style={{ background: "var(--revo-dark)", borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0, y: [0, -8, 0] }} transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1], y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>System Analytics</span>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--revo-mint)" }} />
                </div>
              </div>

              {/* Mini Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
                <StatCard bg="var(--revo-black)" text="#fff" label="Models" value="GPT-4" />
                <StatCard bg="var(--revo-blue)" text="#fff" label="Accuracy" value="99.8%" />
                <StatCard bg="var(--revo-mint)" text="var(--revo-black)" label="Status" value="Active" />
              </div>

              {/* Bar Chart */}
              <div style={{ background: "var(--revo-black)", borderRadius: 16, padding: "1rem", display: "flex", alignItems: "end", gap: "0.35rem", height: 100 }}>
                {[40, 65, 50, 90, 75, 60].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "9999px 9999px 0 0", background: i === 3 ? "var(--revo-mint)" : "var(--revo-blue)", transition: "height 1s ease", transitionDelay: `${0.8 + i * 0.1}s` }} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function StatCard({ bg, text, label, value }: { bg: string; text: string; label: string; value: string }) {
  return (
    <div style={{ background: bg, borderRadius: 14, padding: "0.6rem", textAlign: "left" }}>
      <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: text === "#fff" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginBottom: "0.15rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "-0.02em", color: text }}>{value}</div>
    </div>
  );
}
