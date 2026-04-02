"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { EXPERIENCES } from "@/lib/data";

export default function Experience() {
  return (
    <section
      id="experience"
      className="mesh-white"
      style={{ padding: "clamp(4rem, 8vw, 6.5rem) 0", position: "relative" }}
    >
      <div className="container">
        <FadeIn>
          <div className="section-badge">Parcours</div>
          <h2 className="section-heading" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            Expérience & Formation
          </h2>
        </FadeIn>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* Ligne verticale */}
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 12,
              bottom: 12,
              width: 1,
              background: "linear-gradient(to bottom, var(--primary), rgba(37,99,235,0.08))",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {EXPERIENCES.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingBottom: i < EXPERIENCES.length - 1 ? "2rem" : 0,
                    position: "relative",
                  }}
                >
                  {/* Dot */}
                  <div style={{ position: "absolute", left: "-2rem", top: 3 }}>
                    <div className={item.type === "work" ? "timeline-dot-filled" : "timeline-dot"} />
                  </div>

                  {/* Card */}
                  <motion.div
                    style={{
                      flex: 1,
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-card)",
                      borderRadius: "var(--radius-lg)",
                      padding: "1.25rem 1.5rem",
                      marginLeft: "-0.25rem",
                      boxShadow: "var(--shadow-xs)",
                      borderLeft: item.type === "work"
                        ? "3px solid var(--primary)"
                        : "3px solid rgba(37,99,235,0.18)",
                      borderRadius: "0 var(--radius-lg) var(--radius-lg) 0",
                    }}
                    whileHover={{
                      borderColor: "rgba(37,99,235,0.28)",
                      boxShadow: "var(--shadow-md)",
                      x: 2,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Date */}
                    <div
                      className="label-tag"
                      style={{ marginBottom: "0.45rem", opacity: 0.8 }}
                    >
                      {item.date}
                    </div>

                    {/* Titre */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                        letterSpacing: "-0.015em",
                        color: "var(--text)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Org */}
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--primary)",
                        fontWeight: 600,
                        marginBottom: item.desc || item.items ? "0.9rem" : "0.65rem",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {item.org}
                    </div>

                    {/* Description */}
                    {item.desc && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.75,
                          marginBottom: "0.9rem",
                          maxWidth: 580,
                        }}
                      >
                        {item.desc}
                      </p>
                    )}

                    {/* Bullet points */}
                    {item.items && (
                      <ul style={{ listStyle: "none", marginBottom: "0.9rem", display: "flex", flexDirection: "column", gap: "0.38rem" }}>
                        {item.items.slice(0, 4).map((li) => (
                          <li
                            key={li}
                            style={{
                              display: "flex",
                              gap: "0.55rem",
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                              lineHeight: 1.65,
                            }}
                          >
                            <span
                              style={{
                                color: "var(--primary)",
                                flexShrink: 0,
                                marginTop: "0.22rem",
                                fontSize: "0.55rem",
                              }}
                            >
                              ▸
                            </span>
                            {li}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tags */}
                    {item.tags && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem", alignItems: "center" }}>
                        {item.tags.map((t, ti) => (
                          <span
                            key={t}
                            className={`tag ${ti === 1 ? "tag-gray" : ti === 2 ? "tag-violet" : ""}`}
                            style={{ fontSize: "0.62rem" }}
                          >
                            {t}
                          </span>
                        ))}
                        {item.type === "work" && (
                          <span className="tag tag-green" style={{ fontSize: "0.62rem" }}>
                            Terminé
                          </span>
                        )}
                        {item.type === "education" && (
                          <span className="tag" style={{ fontSize: "0.62rem" }}>
                            Diplômé
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}