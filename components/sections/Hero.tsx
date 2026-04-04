"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";
import { smoothScrollTo } from "@/lib/utils";

const HERO_SKILLS = [
  { label: "Power BI",         val: 85, color: "#4F8EF7" },
  { label: "Python & Pandas",  val: 75, color: "#818CF8" },
  { label: "SQL",              val: 75, color: "#4F8EF7" },
  { label: "IA Générative",    val: 92, color: "#F472B6" },
  { label: "Excel / Sheets",   val: 88, color: "#34D399" },
];

export function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => { v = Math.min(v + step, target); setN(v); if (v >= target) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);

  return <span ref={ref}>{n}{suffix}</span>;
}

function HeroBar({ label, val, color, index }: { label: string; val: number; color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  return (
    <div ref={ref} style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.72rem", color: "rgba(200,215,255,0.65)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: "0.68rem", color: "rgba(150,175,220,0.45)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
          {val}%
        </span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.04)", borderRadius: 99, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}66, 0 0 16px ${color}33` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${val}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 + index * 0.1 }}
        />
      </div>
    </div>
  );
}

/* ── Word-reveal animation ── */
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const words = text.split(" ");

  return (
    <div ref={ref} style={{ overflow: "hidden", marginBottom: "0.05rem" }}>
      <div>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: "120%" }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: "120%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28, delay: delay + i * 0.07 }}
            style={{ display: "inline-block", marginRight: "0.25em" }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  return (
    <section
      id="bio"
      style={{
        paddingTop: "clamp(7rem, 13vw, 11rem)",
        paddingBottom: "clamp(4rem, 7vw, 7rem)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Orbs — morphing organic shapes via CSS */}
      <motion.div className="orb orb-blue orb-1 orb-morph" style={{ width: 700, height: 700, top: "-15%", right: "-20%" }} />
      <motion.div className="orb orb-indigo orb-2 orb-morph" style={{ width: 500, height: 500, bottom: "0%", left: "-15%" }} />
      <motion.div className="orb orb-rose orb-3 orb-morph" style={{ width: 350, height: 350, top: "30%", right: "15%" }} />

      <motion.div className="container" style={{ position: "relative", zIndex: 1, width: "100%", opacity: heroOpacity, y: heroY }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            {/* Status badge — spring entrance */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="status-badge" style={{ marginBottom: "2.5rem" }}>
                <span className="status-dot" aria-hidden="true" />
                Disponible pour de nouvelles opportunités
              </div>
            </motion.div>

            {/* Name — WordReveal */}
            <WordReveal text="MBAITADJIM" delay={0.2} />

            {/* First name — iridescent gradient */}
            <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
              <motion.div
                className="text-gradient-irid"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Abba Serge
              </motion.div>
            </div>

            {/* Role line */}
            <FadeIn delay={0.6}>
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "1rem", color: "var(--text-secondary)" }}>
                  Data Analyst{" "}
                  <span style={{ color: "var(--border-strong)" }}>/</span>{" "}
                  Power BI{" "}
                  <span style={{ color: "var(--border-strong)" }}>/</span>{" "}
                  Python{" "}
                  <span style={{ color: "var(--border-strong)" }}>/</span>{" "}
                  IA Générative
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.68}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
                  Stage Wemoov{" "}
                  <span style={{ margin: "0 0.3rem" }}>&middot;</span>
                  Juin &ndash; Oct. 2024
                </span>
                <span className="pill pill-accent" style={{ fontSize: "0.58rem" }}>Diplômé</span>
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn delay={0.75}>
              <p style={{
                fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.75,
                maxWidth: "540px", marginBottom: "2.5rem",
              }}>
                Fraîchement diplômé d&apos;un Master Big Data &amp; Data Stratégie (ISM, Dakar),
                je transforme la donnée en décisions claires avec Power BI, Python, SQL et l&apos;IA générative.
              </p>
            </FadeIn>

            {/* CTA — staggered spring */}
            <FadeIn delay={0.85}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "3rem" }}>
                <motion.button className="btn-primary" style={{ padding: "0.85rem 2rem" }} onClick={() => smoothScrollTo("realisations")}>
                  Voir mes projets
                </motion.button>
                <motion.button className="btn-glass" style={{ padding: "0.85rem 1.6rem" }} onClick={() => smoothScrollTo("contact")}>
                  Me contacter
                </motion.button>
                <motion.a href="/cv.pdf" download className="btn-glass" style={{ padding: "0.85rem 1.6rem" }}>
                  CV PDF
                </motion.a>
              </div>
            </FadeIn>

            {/* Domaines */}
            <FadeIn delay={0.95}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
                {[
                  { label: "Power BI, Excel", color: "var(--accent)" },
                  { label: "Python, SQL, Pandas", color: "var(--accent-warm)" },
                  { label: "IA Générative", color: "var(--accent-rose)" },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 3, height: 10, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.6 }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right — floating skill card */}
          <motion.div
            className="hidden lg:block"
            style={{ width: 260, flexShrink: 0 }}
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top badge */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
              <motion.div
                className="glass"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", boxShadow: "0 0 6px var(--accent)" }} />
                <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "rgba(200,215,255,0.75)", fontFamily: "var(--font-body)" }}>
                  Data Analyst
                </span>
              </motion.div>
            </div>

            {/* Main card — float animation + liquid glass */}
            <motion.div
              className="liquid-card liquid-glow"
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Header */}
              <div style={{ padding: "1.2rem 1.3rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", marginBottom: 2, lineHeight: 1.3, fontFamily: "var(--font-body)" }}>
                    Mbaitadjim A. S.
                  </div>
                  <div style={{ fontSize: "0.66rem", color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}>
                    Big Data &amp; Stratégie
                  </div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.85rem", color: "var(--bg)", flexShrink: 0 }}>
                  S
                </div>
              </div>

              {/* Bars */}
              <div style={{ padding: "1rem 1.3rem" }}>
                {HERO_SKILLS.map((skill, i) => <HeroBar key={skill.label} {...skill} index={i} />)}
              </div>

              {/* Footer */}
              <div style={{ padding: "0.65rem 1.3rem", borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}>
                  ISM Digital Campus &middot; Dakar
                </span>
              </div>
            </motion.div>

            {/* Gaming pill */}
            <motion.div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <div className="glass" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0.3rem 0.7rem", borderRadius: "var(--radius-full)" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}>
                  Gaming &middot; IA &middot; Création
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 1 }} animate={{ y: [0, 6, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }} aria-hidden="true">
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, var(--accent-soft), transparent)", margin: "0 auto", opacity: 0.25 }} />
      </motion.div>
    </section>
  );
}
