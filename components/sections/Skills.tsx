"use client";

import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "@/lib/data";


/* Revolut alternating palette: white / gray / black */
const PALETTES = [
  { bg: "#ffffff",          text: "#191c1f" },
  { bg: "var(--bg-elevated)", text: "var(--text)" },
  { bg: "#191c1f",          text: "#ffffff" },
  { bg: "var(--bg-elevated)", text: "var(--text)" },
  { bg: "#ffffff",          text: "#191c1f" },
  { bg: "#191c1f",          text: "#ffffff" },
];

export default function Skills() {
  return (
    <section
      id="competences"
      style={{
        background: "var(--bg-elevated)",
        padding: "clamp(5rem, 10vw, 8rem) 0",
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Compétences</span>
          <h2 className="section-heading" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            Outils, langages & plateformes.
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {SKILL_CATEGORIES.map((cat, i) => {
            const p = PALETTES[i % PALETTES.length];
            const isDark = p.bg === "#191c1f";
            const tagBg = isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(25,28,31,0.07)";
            const tagColor = isDark
              ? "rgba(255,255,255,0.75)"
              : "rgba(25,28,31,0.65)";

            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: p.bg,
                  color: p.text,
                  borderRadius: "var(--r-card)",
                  padding: "clamp(1.5rem, 2.5vw, 2rem)",
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    marginBottom: "auto",
                    paddingBottom: "1rem",
                  }}
                >
                  {cat.title}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    paddingTop: "1rem",
                    borderTop: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(25,28,31,0.07)",
                  }}
                >
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: tagBg,
                        color: tagColor,
                        borderRadius: "9999px",
                        padding: "0.25rem 0.75rem",
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
    </section>
  );
}
