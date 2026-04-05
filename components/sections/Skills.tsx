"use client";

import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "@/lib/data";

const CARD_BGS = [
  { bg: "#ffffff", text: "var(--revo-black)" },
  { bg: "var(--revo-gray)", text: "var(--revo-black)" },
  { bg: "var(--revo-black)", text: "#ffffff" },
  { bg: "var(--revo-gray)", text: "var(--revo-black)" },
  { bg: "#ffffff", text: "var(--revo-black)" },
  { bg: "var(--revo-black)", text: "#ffffff" },
];

export default function Skills() {
  return (
    <section id="competences" style={{ background: "var(--bg)", padding: "clamp(4rem, 8vw, 6.5rem) 0" }}>
      <div className="container">
        <p className="section-eyebrow">Comp\u00e9tences</p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--text)",
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          Outils, langages et plateformes.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(0.75rem, 1.5vw, 1rem)",
          }}
          className="skills-grid"
        >
          {SKILL_CATEGORIES.map((cat, i) => {
            const palette = CARD_BGS[i % CARD_BGS.length];
            const isDark = palette.bg === "var(--revo-black)";
            const tagBg = isDark ? "var(--revo-dark)" : "var(--revo-gray)";
            const tagColor = isDark ? "var(--text-tertiary)" : "var(--text-secondary)";

            return (
              <motion.div
                key={cat.title}
                style={{
                  background: palette.bg,
                  color: palette.text,
                  borderRadius: "var(--radius-card)",
                  padding: "clamp(1.25rem, 2.5vw, 2rem)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 220,
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    marginBottom: "0.5rem",
                  }}
                >
                  {cat.title}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    marginTop: "auto",
                    paddingTop: "1rem",
                  }}
                >
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: tagBg,
                        color: tagColor,
                        borderRadius: "9999px",
                        padding: "0.3rem 0.85rem",
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
