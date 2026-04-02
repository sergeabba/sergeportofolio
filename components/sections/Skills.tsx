"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import FadeIn from "@/components/FadeIn";
import { SKILL_CATEGORIES, SKILL_BARS } from "@/lib/data";

/* ── Barre de compétence ── */
function SkillBar({ label, level, accent = false, index = 0 }: {
  label: string; level: number; accent?: boolean; index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  return (
    <div ref={ref} style={{ marginBottom: "1.1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: accent ? "var(--primary)" : "var(--text-faint)",
          }}
        >
          {level}%
        </span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          style={{
            height: "100%",
            borderRadius: 6,
            background: accent
              ? "linear-gradient(90deg, var(--primary-dark), var(--primary))"
              : "linear-gradient(90deg, rgba(37,99,235,0.45), rgba(79,142,247,0.7))",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.08 + index * 0.06 }}
        />
      </div>
    </div>
  );
}

const ICON_DEFS = [
  { abbr: "DA", cls: "skill-icon-blue" },
  { abbr: "IA", cls: "skill-icon-violet" },
  { abbr: "DG", cls: "skill-icon-red" },
  { abbr: "WB", cls: "skill-icon-gray" },
  { abbr: "SY", cls: "skill-icon-blue" },
  { abbr: "CR", cls: "skill-icon-violet" },
];

export default function Skills() {
  return (
    <section
      id="competences"
      className="mesh-white"
      style={{ padding: "clamp(4rem, 8vw, 6.5rem) 0", position: "relative" }}
    >
      <div className="container">
        <FadeIn>
          <div className="section-badge">Savoir-faire</div>
          <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>
            Mes Compétences
          </h2>
          <p
            style={{
              color: "var(--text-faint)",
              fontSize: "0.9rem",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              maxWidth: "440px",
            }}
          >
            Un ensemble de compétences couvrant la data, l&apos;IA et la création.
          </p>
        </FadeIn>

        {/* ── Skill cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            marginBottom: "3.5rem",
          }}
        >
          {SKILL_CATEGORIES.map((cat, i) => {
            const { abbr, cls } = ICON_DEFS[i] || { abbr: "//", cls: "skill-icon-gray" };
            return (
              <motion.div
                key={cat.title}
                className="skill-card"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: (i % 3) * 0.07, duration: 0.55 }}
              >
                <div className={`skill-icon ${cls}`} style={{ marginBottom: "1rem" }}>
                  {abbr}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: "var(--text)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {cat.title}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {cat.tags.map((t, j) => (
                    <span
                      key={t}
                      className={`tag ${j % 4 === 1 ? "tag-gray" : j % 4 === 2 ? "tag-violet" : j % 4 === 3 ? "tag-red" : ""}`}
                      style={{ fontSize: "0.64rem" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Niveaux de maîtrise ── */}
        <FadeIn delay={0.2}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-xl)",
              padding: "clamp(1.5rem, 3vw, 2.25rem)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                color: "var(--text)",
                marginBottom: "0.4rem",
              }}
            >
              Niveaux de maîtrise
            </h3>
            <p
              style={{
                color: "var(--text-faint)",
                fontSize: "0.82rem",
                marginBottom: "2rem",
              }}
            >
              Auto-évaluation basée sur les projets et formations réalisés.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem 3rem",
              }}
            >
              <div>
                <div
                  className="label-tag"
                  style={{ marginBottom: "1.25rem", display: "block" }}
                >
                  Data & Analyse
                </div>
                {SKILL_BARS.data.map((s, i) => (
                  <SkillBar key={s.label} {...s} index={i} />
                ))}
              </div>
              <div>
                <div
                  className="label-tag"
                  style={{ marginBottom: "1.25rem", display: "block" }}
                >
                  Créatif & No-Code
                </div>
                {SKILL_BARS.creative.map((s, i) => (
                  <SkillBar key={s.label} accent={s.accent} label={s.label} level={s.level} index={i} />
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}