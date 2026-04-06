"use client";

import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "@/lib/data";

export default function Skills() {
  return (
    <>
      <style>{`
        .skill-card {
          border-radius: var(--r-card);
          padding: clamp(1.5rem, 2.5vw, 2rem);
          min-height: 220px;
          display: flex;
          flex-direction: column;
        }

        /* Type 1: Standard background with border */
        .skill-card-0 {
          background: var(--bg);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .skill-card-0 .skill-zone { border-top: 1px solid var(--border); }
        .skill-card-0 .skill-tag { background: var(--bg-layer); color: var(--text-secondary); }

        /* Type 2: Elevated background */
        .skill-card-1 {
          background: var(--bg-elevated);
          color: var(--text);
          border: 1px solid transparent;
        }
        .skill-card-1 .skill-zone { border-top: 1px solid var(--border); }
        .skill-card-1 .skill-tag { background: var(--border); color: var(--text-secondary); }

        /* Type 3: Always Dark (Revolut black) */
        .skill-card-2 {
          background: #191c1f;
          color: #ffffff;
          border: 1px solid transparent;
        }
        .skill-card-2 .skill-zone { border-top: 1px solid rgba(255,255,255,0.1); }
        .skill-card-2 .skill-tag { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.75); }

        /* Shared tag styling */
        .skill-tag {
          border-radius: 9999px;
          padding: 0.25rem 0.75rem;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
      `}</style>
      
      <section
        id="competences"
        style={{
          background: "var(--bg-layer)",
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
              // Alternate through the 3 types of cards
              const cardType = i % 3;

              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className={`skill-card skill-card-${cardType}`}
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
                    className="skill-zone"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      paddingTop: "1rem",
                    }}
                  >
                    {cat.tags.map((tag) => (
                      <span key={tag} className="skill-tag">
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
    </>
  );
}
