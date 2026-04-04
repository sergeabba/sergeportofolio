"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import FadeIn from "@/components/FadeIn";
import MouseSpotCard from "@/components/MouseSpotCard";
import { SKILL_CATEGORIES, SKILL_BARS } from "@/lib/data";

function SkillBar({ label, level, accent = false, index = 0 }: {
  label: string; level: number; accent?: boolean; index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  return (
    <div ref={ref} style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.82rem", color: "var(--text)" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, color: accent ? "var(--accent-soft)" : "var(--text-tertiary)" }}>
          {level}%
        </span>
      </div>
      <div className="skill-track">
        <motion.div
          style={{ height: "100%", borderRadius: 99, background: accent ? "linear-gradient(90deg, var(--accent), var(--accent-soft))" : "linear-gradient(90deg, rgba(59,130,246,0.3), rgba(96,165,250,0.5))" }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 + index * 0.07 }}
        />
      </div>
    </div>
  );
}

const CATEGORY_ICONS = [
  { initials: "DA", color: "var(--accent)" },
  { initials: "IA", color: "var(--accent-warm)" },
  { initials: "PY", color: "var(--accent-rose)" },
  { initials: "BD", color: "var(--accent-soft)" },
  { initials: "UI", color: "rgba(245,245,247,0.45)" },
  { initials: "OF", color: "rgba(245,245,247,0.3)" },
];

export default function Skills() {
  return (
    <section id="competences" style={{ padding: "clamp(6rem, 10vw, 9rem) 0", position: "relative", overflow: "hidden" }}>
      <div className="orb orb-indigo orb-2" style={{ width: 450, height: 450, top: "0%", left: "-15%" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <FadeIn y={30}>
          <div className="section-label">Compétences</div>
          <h2 className="section-heading">Savoir-faire</h2>
          <p className="section-desc" style={{ marginTop: "0.6rem" }}>
            Un ensemble de compétences couvrant la data, l&apos;IA et la création.
          </p>
        </FadeIn>

        <div className="container" style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
          {/* Grid of skill cards — staggered */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
            {SKILL_CATEGORIES.map((cat, i) => {
              const { initials, color } = CATEGORY_ICONS[i] || { initials: "//", color: "var(--text-tertiary)" };
              return (
                <motion.div
                  key={cat.title}
                  className="liquid-card shimmer-card"
                  style={{ padding: "1.4rem 1.4rem" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Icon + Title */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <motion.div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: `${color}10`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 800, color, flexShrink: 0 }} whileHover={{ scale: 1.08 }} transition={{ duration: 0.25 }}>
                      {initials}
                    </motion.div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)" }}>
                      {cat.title}
                    </div>
                  </div>
                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {cat.tags.map((t) => (
                      <span key={t} className="pill" style={{ fontSize: "0.62rem" }}>{t}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mastery bars panel */}
          <motion.div
            className="liquid-accent"
            style={{ padding: "clamp(1.5rem, 3vw, 2.25rem)", marginTop: "clamp(2.5rem, 5vw, 4rem)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.35rem" }}>
              Niveaux de maîtrise
            </h3>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.82rem", marginBottom: "2.5rem" }}>
              Auto-évaluation basée sur les projets et formations réalisés.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem 3.5rem" }}>
              <div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <span className="pill pill-accent" style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Data &amp; Analyse
                  </span>
                </div>
                {SKILL_BARS.data.map((s, i) => (
                  <SkillBar key={s.label} {...s} index={i} />
                ))}
              </div>
              <div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <span className="pill" style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Créatif &amp; No-Code
                  </span>
                </div>
                {SKILL_BARS.creative.map((s, i) => (
                  <SkillBar key={s.label} accent={s.accent} label={s.label} level={s.level} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
