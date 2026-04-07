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
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }

        .skill-card:hover {
          transform: translateY(-6px);
        }

        /* Glossy overlay over the entire card */
        .skill-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.02) 100%);
          pointer-events: none;
          z-index: 0;
        }

        /* Type 1: Standard Light Glass */
        .skill-card-0 {
          background: linear-gradient(145deg, var(--bg-elevated), var(--bg));
          color: var(--text);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.2);
          border: 1px solid var(--border);
        }
        .skill-card-0 .skill-zone { border-top: 1px solid var(--border); }
        .skill-card-0 .skill-tag { 
          background: linear-gradient(145deg, var(--bg-layer), var(--bg));
          color: var(--text-secondary);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 6px -2px rgba(0,0,0,0.05);
          border: 1px solid var(--border);
        }

        /* Type 2: Elevated Blue/Gray Glass */
        .skill-card-1 {
          background: linear-gradient(145deg, var(--bg), var(--bg-elevated));
          color: var(--text);
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.3);
          border: 1px solid var(--border);
        }
        .skill-card-1 .skill-zone { border-top: 1px solid var(--border); }
        .skill-card-1 .skill-tag { 
           background: linear-gradient(145deg, var(--bg-elevated), var(--border));
           color: var(--text);
           box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 4px 10px -2px rgba(0,0,0,0.08);
           border: 1px solid var(--border);
        }

        /* Type 3: Deep Dark Glass */
        .skill-card-2 {
          background: linear-gradient(145deg, #2a2f35, #14171a);
          color: #ffffff;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .skill-card-2 .skill-zone { border-top: 1px solid rgba(255,255,255,0.1); }
        .skill-card-2 .skill-tag { 
          background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));
          color: #ffffff;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.25), 0 5px 12px -2px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* Shared tag glassy styling */
        .skill-tag {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
          padding: 0.4rem 0.9rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* Glossy reflection on the tag */
        .skill-tag::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);
          border-radius: inherit;
          pointer-events: none;
        }

        .skill-tag:hover {
           transform: translateY(-3px) scale(1.05);
           filter: brightness(1.1);
        }
        
        .skill-zone {
           position: relative;
           z-index: 10;
        }
        .skill-card h3 {
           position: relative;
           z-index: 10;
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
