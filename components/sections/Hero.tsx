"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";
import Image from "next/image";
import { smoothScrollTo } from "@/lib/utils";

/* ── Compétences carte hero ── */
const HERO_SKILLS = [
  { label: "Power BI",                   val: 85, color: "#4F8EF7" },
  { label: "Python & Pandas",            val: 75, color: "#818CF8" },
  { label: "SQL",                        val: 75, color: "#4F8EF7" },
  { label: "IA Générative",             val: 92, color: "#F472B6" },
  { label: "Excel / Sheets",            val: 88, color: "#34D399" },
];

/* ── Counter animé ── */
export function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = Math.ceil(target / 55);
    const t = setInterval(() => {
      v = Math.min(v + step, target);
      setN(v);
      if (v >= target) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [inView, target]);

  return <span ref={ref}>{n}{suffix}</span>;
}

/* ── Barre de compétence dans la carte hero ── */
function HeroBar({ label, val, color, index }: { label: string; val: number; color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  return (
    <div ref={ref} style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.75rem", color: "rgba(200,215,255,0.8)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: "0.68rem", color: "rgba(150,175,220,0.6)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
          {val}%
        </span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}88` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${val}%` } : { width: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 + index * 0.1 }}
        />
      </div>
    </div>
  );
}

/* ── HERO ── */
export default function Hero() {
  return (
    <section
      id="bio"
      className="mesh-hero"
      style={{
        paddingTop: "clamp(5.5rem, 11vw, 8.5rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 6rem)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "center",
          }}
        >
          {/* ── Colonne gauche ── */}
          <div>
            {/* Badge disponible */}
            <FadeIn delay={0}>
              <div className="available-badge" style={{ marginBottom: "1.75rem" }}>
                <span
                  className="anim-pulse-dot"
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--green-500)",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                Disponible · Dakar, Sénégal
              </div>
            </FadeIn>

            {/* Nom */}
            <div style={{ overflow: "hidden", marginBottom: "0.1rem" }}>
              <motion.h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 0.95,
                  color: "var(--text)",
                }}
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                MBAITADJIM
              </motion.h1>
            </div>

            <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
              <motion.div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  background: "linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  paddingBottom: "6px",
                }}
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Abba Serge
              </motion.div>
            </div>

            {/* Rôle */}
            <FadeIn delay={0.32}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "0.4rem 0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.95rem", color: "var(--primary)" }}>
                  Data Analyst Junior
                </span>
                <span style={{ color: "var(--border)", fontSize: "1rem" }}>·</span>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  Power BI · Python · IA Générative
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                  Stage Wemoov · Juin–Oct. 2024 ·
                </span>
                <span
                  className="tag tag-green"
                  style={{ fontSize: "0.62rem" }}
                >
                  Diplômé
                </span>
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn delay={0.4}>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  maxWidth: "500px",
                  marginBottom: "2rem",
                }}
              >
                Fraîchement diplômé d&apos;un Master Big Data & Data Stratégie (ISM, Dakar),
                je transforme la donnée en décisions claires avec Power BI, Python, SQL et l&apos;IA générative.
              </p>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.48}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "2.25rem",
                }}
              >
                <motion.button
                  className="btn-primary"
                  style={{ padding: "0.8rem 1.65rem" }}
                  onClick={() => smoothScrollTo("realisations")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ▷ Voir mes projets
                </motion.button>
                <motion.button
                  className="btn-ghost"
                  style={{ padding: "0.8rem 1.5rem" }}
                  onClick={() => smoothScrollTo("contact")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Me contacter →
                </motion.button>
                <motion.a
                  href="/cv.pdf"
                  download
                  className="btn-primary"
                  style={{ padding: "0.8rem 1.5rem", background: "rgba(37,99,235,0.14)", color: "var(--primary)", border: "1px solid rgba(37,99,235,0.25)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  📄 CV PDF
                </motion.a>
              </div>
            </FadeIn>

            {/* Domaines */}
            <FadeIn delay={0.55}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                {[
                  { label: "Power BI · Excel", color: "var(--primary)" },
                  { label: "Python · SQL · Pandas", color: "#818CF8" },
                  { label: "IA Générative", color: "#F472B6" },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <div
                      style={{
                        width: 3,
                        height: 14,
                        borderRadius: 2,
                        background: color,
                        flexShrink: 0,
                        opacity: 0.85,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.78rem",
                        color: "var(--text-faint)",
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* ── Carte flottante compétences ── */}
          <motion.div
            className="hidden lg:block"
            style={{ width: 280, flexShrink: 0 }}
            initial={{ opacity: 0, x: 36, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge flottant au-dessus */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.6rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "0.38rem 0.9rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(8,14,30,0.92)",
                  border: "1px solid rgba(79,142,247,0.28)",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    display: "inline-block",
                    boxShadow: "0 0 8px var(--primary)",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "rgba(180,205,255,0.9)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Data Analyst
                </span>
              </div>
            </div>

            {/* Carte principale */}
            <motion.div
              className="hero-skill-card"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #132248 0%, #1A2E5A 100%)",
                  padding: "1.25rem 1.4rem",
                  borderBottom: "1px solid rgba(79,142,247,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "rgba(220,235,255,0.95)",
                      fontFamily: "var(--font-body)",
                      marginBottom: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    Mbaitadjim Abba Serge
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(140,175,230,0.6)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Big Data & Data Stratégie
                  </div>
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1D4ED8, #4F8EF7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "#fff",
                    flexShrink: 0,
                    boxShadow: "0 0 14px rgba(79,142,247,0.4)",
                  }}
                >
                  S
                </div>
              </div>

              {/* Bars */}
              <div style={{ padding: "1.1rem 1.4rem 0.9rem" }}>
                {HERO_SKILLS.map((skill, i) => (
                  <HeroBar key={skill.label} {...skill} index={i} />
                ))}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "0.75rem 1.4rem",
                  borderTop: "1px solid rgba(79,142,247,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.65rem", color: "rgba(130,165,225,0.5)", fontFamily: "var(--font-body)" }}>
                  ✦ ISM Digital Campus · Dakar, Sénégal
                </span>
              </div>
            </motion.div>

            {/* Badge gaming */}
            <div style={{ marginTop: "0.65rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(8,14,30,0.9)",
                  border: "1px solid rgba(79,142,247,0.22)",
                  padding: "0.38rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>🎮</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "rgba(165,195,255,0.75)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Gaming · IA · Création
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "1.75rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 1,
            height: 44,
            background: "linear-gradient(to bottom, var(--primary), transparent)",
            margin: "0 auto",
            opacity: 0.5,
          }}
        />
      </motion.div>
    </section>
  );
}