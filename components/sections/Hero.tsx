"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";
import Image from "next/image";
import { smoothScrollTo } from "@/lib/utils";

/* ── Hero card skill bars data ── */
const HERO_SKILLS = [
  { label: "Power BI", val: 85 },
  { label: "Python & Pandas", val: 75 },
  { label: "SQL", val: 75 },
  { label: "IA Générative", val: 92 },
  { label: "Excel / Sheets", val: 88 },
];

/* ── Animated counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      v = Math.min(v + step, target);
      setN(v);
      if (v >= target) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);

  return <span ref={ref}>{n}{suffix}</span>;
}

/* ── Hero card progress bar ── */
function HeroBar({ label, val }: { label: string; val: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  return (
    <div ref={ref} style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
          {val}%
        </span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "#2563EB", borderRadius: "99px" }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${val}%` } : { width: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="bio" className="mesh-hero" style={{ paddingTop: "clamp(6rem,12vw,9rem)", paddingBottom: "clamp(4rem,8vw,6rem)", position: "relative", overflow: "hidden" }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">

          {/* Left */}
          <div>
            {/* Status badge */}
            <FadeIn delay={0}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", marginBottom: "2rem", padding: "0.35rem 1rem", borderRadius: "999px", border: "1px solid var(--border)", background: "transparent" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} className="anim-pulse-dot" />
                <span className="label-tag" style={{ color: "var(--text-faint)", fontSize: "0.68rem" }}>Disponible · Dakar, Sénégal</span>
              </div>
            </FadeIn>

            {/* Name */}
            <div style={{ overflow: "hidden", marginBottom: "0.1rem" }}>
              <motion.h1 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(2.6rem, 6vw, 5.2rem)",
                letterSpacing: "-0.035em",
                lineHeight: 0.95,
                color: "var(--text)",
              }} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                MBAITADJIM
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
              <motion.div style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                background: "linear-gradient(135deg, var(--primary) 0%, var(--violet) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                paddingBottom: "5px",
              }} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                Abba Serge
              </motion.div>
            </div>

            {/* Role line */}
            <FadeIn delay={0.35}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem 0.75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--primary)" }}>
                  Data Analyst Junior
                </span>
                <span style={{ color: "var(--border-medium)", fontSize: "0.8rem" }}>·</span>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Power BI · Python · IA Générative
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-faint)" }}>
                  Stage Wemoov · Juin 2024 – Octobre 2025 ·
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--accent-red)", fontWeight: 600 }}>
                  Terminé
                </span>
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn delay={0.42}>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "480px", marginBottom: "2rem" }}>
                Fraîchement diplômé d&apos;un Master Big Data & Data Stratégie (ISM, Dakar),
                je transforme la donnée en décisions claires avec Power BI, Python, SQL et l&apos;IA générative.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.5}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
                <motion.button className="btn-primary" style={{ padding: "0.75rem 1.6rem" }}
                  onClick={() => smoothScrollTo("realisations")}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  ▷ Voir mes projets
                </motion.button>
                <motion.button className="btn-ghost" style={{ padding: "0.75rem 1.4rem" }}
                  onClick={() => smoothScrollTo("contact")}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Me contacter →
                </motion.button>
                <motion.a href="/cv.pdf" download className="btn-primary" style={{ padding: "0.75rem 1.4rem" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  📄 CV PDF
                </motion.a>
              </div>
            </FadeIn>

            {/* Tech tags */}
            <FadeIn delay={0.58}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(225,230,245,0.7)" }}>
                {[
                  { label: "Power BI · Excel", color: "var(--primary)" },
                  { label: "Python · SQL · Pandas", color: "var(--violet)" },
                  { label: "IA Générative", color: "var(--accent-red)" },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 3, height: 16, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.8 }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-faint)", fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right  Photo frame */}
          <motion.div className="hidden lg:flex relative justify-center items-center"
            initial={{ opacity: 0, x: 30, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>

            {/* Decorative background shapes for photo */}
            <div style={{ position: "absolute", inset: "-10%", background: "radial-gradient(circle, var(--blue-light) 0%, transparent 60%)", filter: "blur(40px)", zIndex: 0 }} />

            <motion.div
              style={{
                position: "relative",
                width: "100%", maxWidth: "380px", aspectRatio: "4/5",
                background: "var(--bg-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: 30,
                boxShadow: "0 24px 60px rgba(37,99,235,0.15), 0 6px 20px rgba(0,0,0,0.05)",
                overflow: "hidden", zIndex: 1
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>

              {/* Photo Image */}
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(235,240,255,0.8) 0%, rgba(255,255,255,0.2) 100%)", position: "relative" }}>
                <Image
                  src="/photo.jpg"
                  alt="Mbaitadjim Abba Serge"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Floating badge */}
              <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", padding: "0.6rem 1.25rem", borderRadius: "999px", display: "flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.8)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} className="anim-pulse-dot" />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.75rem", color: "var(--text)" }}>Prêt à innover</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Re-export Counter for use in other sections if needed, though defined here for layout reasons.
export { Counter };
