"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";

import type { Easing } from "framer-motion";
const ease: Easing = [0.22, 1, 0.36, 1];

const SKILLS_MARQUEE = [
  "Python", "Power BI", "SQL", "Pandas", "Matplotlib",
  "Big Data", "Scala", "Spark", "Tableau", "Excel",
  "Canva", "WordPress", "IA Générative", "Prompt Engineering",
  "Data Viz", "Machine Learning", "Numpy", "Scikit-learn",
];

const STATS = [
  { value: 3, suffix: "+", label: "Projets livrés" },
  { value: 2, suffix: " ans", label: "d'expérience" },
  { value: 6, suffix: "+", label: "Outils maîtrisés" },
];

const ROLES = [
  "Data Analyst Junior",
  "Prompt Engineer",
  "IT Support",
  "Créateur de contenu",
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 40);
    return () => clearInterval(timer);
  }, [started, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* Floating badge data — position is relative to the photo card */
const BADGES = [
  {
    id: "b1",
    dot: "var(--revo-blue)",
    label: "Power BI · Data Viz",
    top: "8%",
    right: "-38%",
    delay: 0.7,
    rotate: 3,
  },
  {
    id: "b2",
    dot: "var(--revo-mint)",
    label: "IA Générative · Prompt",
    top: "38%",
    left: "-42%",
    delay: 0.85,
    rotate: -4,
  },
  {
    id: "b3",
    dot: "#a855f7",
    label: "Python · Pandas",
    bottom: "10%",
    right: "-36%",
    delay: 1.0,
    rotate: 2,
  },
];

function FloatingBadge({
  dot,
  label,
  delay,
  rotate,
  style,
}: {
  dot: string;
  label: string;
  delay: number;
  rotate: number;
  style: React.CSSProperties;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: 9999,
        padding: "0.45rem 0.9rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
        whiteSpace: "nowrap",
        zIndex: 4,
        rotate,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease }}
    >
      <motion.span
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ delay: delay + 0.5, duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0, display: "inline-block" }}
      />
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: "0.68rem",
          letterSpacing: "0.02em",
          color: "#191c1f",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

  /* 3-D tilt for photo card */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!photoRef.current) return;
      const rect = photoRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      id="bio"
      style={{
        background: "var(--revo-black)",
        minHeight: "100svh",
        paddingTop: "clamp(6rem, 12vw, 9rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid overlay */}
      <div
        className="bg-grid-pattern"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
      />

      {/* Orb 1 */}
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
      {/* Orb 2 */}
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
        <div className="hero-grid">
          {/* ─── Left: Typography ─── */}
          <div>
            {/* Status badge */}
            <motion.div
              className="status-badge hero-status-row"
              style={{ marginBottom: "2rem", width: "fit-content" }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease }}
            >
              <span className="dot" />
              <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
                Disponible · Dakar, Sénégal
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
              MBAITADJIM
            </motion.p>

            {/* Billboard name */}
            <div style={{ overflow: "hidden", marginBottom: "0.25rem" }}>
              <motion.h1
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  fontSize: "clamp(3.5rem, 12vw, 10rem)",
                  letterSpacing: "-0.055em", lineHeight: 0.88,
                  background: "linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.55) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textTransform: "uppercase",
                }}
                initial={{ opacity: 0, y: "110%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.9, ease }}
              >
                ABBA SERGE
              </motion.h1>
            </div>

            {/* Animated role */}
            <motion.div
              className="hero-role-box"
              style={{ marginTop: "1rem", marginBottom: "0.5rem", height: "clamp(1.5rem, 2.8vw, 2.2rem)", overflow: "hidden" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIdx}
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: 500,
                    fontSize: "clamp(1rem, 2.2vw, 1.75rem)",
                    letterSpacing: "-0.01em", color: "var(--revo-mint)",
                    lineHeight: 1.3,
                  }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease }}
                >
                  {ROLES[roleIdx]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Tags */}
            <motion.div
              className="hero-tags-row"
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
              className="hero-ctas-row"
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
                Me contacter →
              </motion.a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="hero-stats-row"
              style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.6, ease }}
            >
              {STATS.map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.8vw, 2rem)", color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── Right: Photo + Floating Badges ─── */}
          <div className="hero-photo-col">
            <div
              ref={photoRef}
              style={{ position: "relative" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Floating Badges — hidden on mobile */}
              <div className="hero-badges-wrap">
                {BADGES.map(({ id, dot, label, delay, rotate, top, right, bottom, left }) => (
                  <FloatingBadge
                    key={id}
                    dot={dot}
                    label={label}
                    delay={delay}
                    rotate={rotate}
                    style={{ top, right, bottom, left } as React.CSSProperties}
                  />
                ))}
              </div>

              {/* Photo card with 3D tilt */}
              <motion.div
                style={{
                  width: "clamp(160px, 40vw, 340px)",
                  borderRadius: "clamp(1.5rem, 3vw, 2.5rem)",
                  overflow: "hidden",
                  position: "relative",
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  border: "2px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0, x: 40, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.8, ease }}
              >
                {/* Gradient overlay at the top of the photo */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(73,79,223,0.18) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />

                {/* Pink/purple glow border effect */}
                <motion.div
                  style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: "inherit",
                    background: "linear-gradient(135deg, #e879f9 0%, #6366f1 50%, #06b6d4 100%)",
                    zIndex: -1,
                    opacity: 0.6,
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <Image
                  src="/photo.jpg"
                  alt="Mbaitadjim Abba Serge"
                  width={340}
                  height={440}
                  style={{
                    width: "100%",
                    height: "clamp(200px, 50vw, 430px)",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                    filter: "brightness(0.95) contrast(1.05)",
                  }}
                  priority
                />
              </motion.div>

              {/* Floating dot decoration */}
              <motion.div
                style={{
                  position: "absolute",
                  width: 10, height: 10, borderRadius: "50%",
                  background: "var(--revo-mint)",
                  top: "50%", left: "-8%",
                  zIndex: 5,
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </div>
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

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }
        .hero-photo-col { display: block; }
        .hero-badges-wrap { display: contents; }

        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-photo-col {
            display: flex;
            justify-content: center;
            order: -1;
            margin-bottom: 1.5rem;
          }
          .hero-badges-wrap { display: none; }
          .hero-status-row {
            justify-content: center !important;
          }
          .hero-tags-row {
            justify-content: center !important;
          }
          .hero-ctas-row {
            justify-content: center !important;
          }
          .hero-stats-row {
            justify-content: center !important;
          }
          .hero-role-box {
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
