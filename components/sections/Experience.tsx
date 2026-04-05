"use client";

import { motion } from "framer-motion";
import { EXPERIENCES } from "@/lib/data";

const ACCENTS = ["var(--revo-blue)", "var(--revo-mint)", "var(--text-tertiary)", "var(--text-tertiary)"];

export default function Experience() {
  return (
    <section id="experience" style={{ background: "var(--bg-elevated)", padding: "clamp(4rem, 8vw, 6.5rem) 0" }}>
      <div className="container">
        <p className="section-eyebrow">Parcours</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.8rem, 3.5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          Expérience & Formation.
        </h2>

        <div style={{ position: "relative", maxWidth: 800, marginLeft: "calc(24px + 16px)" }}>
          {/* Vertical line */}
          <motion.div
            style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "var(--border-strong)" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>
            {EXPERIENCES.map((item, i) => {
              const accent = ACCENTS[i] ?? ACCENTS[0];
              const isCurrent = i === 0;
              return (
                <motion.div
                  key={item.title + item.org}
                  style={{ paddingLeft: "2rem", position: "relative" }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Timeline dot */}
                  <div style={{ position: "absolute", left: -5, top: "0.65rem", width: 12, height: 12, borderRadius: "50%", background: accent, boxShadow: isCurrent ? `0 0 16px ${accent}40` : "none" }} />

                  {/* Card */}
                  <div className="card-flat" style={{ background: "var(--bg)", padding: "clamp(1.25rem, 2.5vw, 2rem)" }}>
                    {/* Date badge */}
                    <span style={{
                      display: "inline-block",
                      background: isCurrent ? "var(--revo-blue)" : "var(--bg-elevated)",
                      color: isCurrent ? "#ffffff" : "var(--text-tertiary)",
                      borderRadius: 9999,
                      padding: "0.25rem 0.8rem",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      fontFamily: "monospace",
                      marginBottom: "0.75rem",
                    }}>
                      {item.date}
                    </span>

                    {/* Title */}
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "0.2rem" }}>
                      {item.title}
                    </h3>

                    {/* Org */}
                    {item.org && (
                      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: accent, marginBottom: item.items ? "0.75rem" : "0", marginTop: "0.2rem" }}>
                        {item.org}
                      </p>
                    )}

                    {/* Description (education) */}
                    {item.desc && (
                      <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                        {item.desc}
                      </p>
                    )}

                    {/* Bullet items (work) */}
                    {item.items && (
                      <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        {item.items.slice(0, 4).map((li, liIdx) => (
                          <li key={liIdx} style={{ display: "flex", gap: "0.5rem", fontSize: "0.88rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--revo-mint)", flexShrink: 0, marginTop: "0.15rem" }}>├</span>
                            {li}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tags */}
                    {item.tags && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {item.tags.slice(0, 5).map(t => (
                          <span key={t} className="pill">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
