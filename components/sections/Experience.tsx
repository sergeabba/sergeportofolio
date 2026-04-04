"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { EXPERIENCES } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" style={{ padding: "clamp(6rem, 10vw, 9rem) 0", position: "relative", overflow: "hidden", background: "var(--bg-elevated)" }}>
      <FadeIn y={30}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label">Parcours</div>
          <h2 className="section-heading">Expérience &amp; Formation</h2>
          <p className="section-desc" style={{ marginTop: "0.6rem" }}>
            Mon parcours professionnel et académique.
          </p>
        </div>
      </FadeIn>

      <div className="container" style={{ position: "relative", zIndex: 1, marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="glow-line" />
      </div>

      {/* Timeline */}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", paddingLeft: "1.5rem", marginTop: "2.5rem" }}>
          {/* Line */}
          <div className="timeline-line" style={{ position: "absolute", left: 3, top: 0, bottom: 0 }} />

          {EXPERIENCES.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div style={{ display: "flex", gap: "1.25rem", paddingBottom: "2rem" }}>
                {/* Dot */}
                <motion.div style={{ position: "absolute", left: 0, top: 4 }} whileHover={{ scale: 1.4 }} transition={{ duration: 0.2 }}>
                  <div className={item.type === "work" ? "timeline-dot-filled" : "timeline-dot"} />
                </motion.div>

                {/* Card */}
                <motion.div
                  className="glass"
                  style={{ flex: 1, padding: "1.25rem 1.4rem", borderLeftWidth: "2px", borderLeftColor: item.type === "work" ? "var(--accent)" : "var(--border)" }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                >
                  <span className="pill" style={{ fontSize: "0.6rem", marginBottom: "0.65rem", display: "inline-block" }}>
                    {item.date}
                  </span>

                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(0.95rem, 2vw, 1.1rem)", letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "0.2rem" }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: "0.82rem", color: "var(--accent-soft)", fontWeight: 600, marginBottom: item.desc || item.items ? "0.85rem" : "0.6rem" }}>
                    {item.org}
                  </div>

                  {item.desc && (
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "0.85rem", maxWidth: 580 }}>
                      {item.desc}
                    </p>
                  )}

                  {item.items && (
                    <ul style={{ listStyle: "none", marginBottom: "0.85rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {item.items.slice(0, 4).map((li) => (
                        <li key={li} style={{ display: "flex", gap: "0.55rem", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                          <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.3rem", fontSize: "0.45rem" }}>&rarr;</span>
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.tags && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
                      {item.tags.map((t) => (
                        <span key={t} className="pill" style={{ fontSize: "0.6rem" }}>{t}</span>
                      ))}
                      {item.type === "work" && (
                        <span className="pill" style={{ fontSize: "0.55rem", background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)", color: "#16A34A" }}>
                          Terminé
                        </span>
                      )}
                      {item.type === "education" && (
                        <span className="pill pill-accent" style={{ fontSize: "0.55rem" }}>Diplômé</span>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
