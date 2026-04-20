"use client";

import { motion } from "framer-motion";
import { SKILL_CATEGORIES, TOOL_ENVIRONMENT } from "@/lib/data";

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
        .skill-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.02) 100%);
          pointer-events: none;
          z-index: 0;
        }
        .skill-card::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--revo-blue), var(--accent-soft, #a78bfa));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .skill-card:hover::after {
          transform: scaleX(1);
        }
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
          gap: 0.35rem;
        }
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
        .skill-zone { position: relative; z-index: 10; }
        .skill-card h3 { position: relative; z-index: 10; }
        .skill-icon-box {
          position: relative;
          z-index: 10;
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(73,79,223,0.08);
          border: 1px solid rgba(73,79,223,0.12);
          margin-bottom: 0.9rem;
          font-size: 1.1rem;
          color: var(--revo-blue);
        }
        .tag-icon {
          font-size: 0.85rem;
          line-height: 1;
          opacity: 0.7;
        }
        .tool-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.68rem;
          padding: 0.28rem 0.7rem;
          border-radius: 9999px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-weight: 500;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default;
          white-space: nowrap;
        }
        .tool-item i { font-size: 0.9rem; color: var(--revo-blue); }
        .tool-item:hover {
          border-color: var(--revo-blue);
          color: var(--revo-blue);
          transform: scale(1.08) translateY(-1px);
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
              const cardType = i % 3;

              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className={`skill-card skill-card-${cardType}`}
                >
                  <div className="skill-icon-box">
                    <i className={cat.icon || "ph-stack"} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      marginBottom: "auto",
                      paddingBottom: "1.5rem",
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
                        {(cat.tagIcons as Record<string, string>)?.[tag] && (
                          <i className={`${(cat.tagIcons as Record<string, string>)[tag]} tag-icon`} />
                        )}
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Outils et Environnement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: "rgba(73,79,223,0.08)", border: "1px solid rgba(73,79,223,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--revo-blue)", fontSize: "1rem",
              }}>
                <i className="ph-wrench" />
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(1rem, 1.3vw, 1.2rem)", letterSpacing: "-0.02em",
                color: "var(--text)",
              }}>
                Outils & Environnement
              </h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {TOOL_ENVIRONMENT.map((tool, i) => (
                <motion.span
                  key={tool.name}
                  className="tool-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <i className={tool.icon} />
                  {tool.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
