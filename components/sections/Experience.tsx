"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { EXPERIENCES } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" style={{ padding: "clamp(4rem,8vw,6.5rem) 0", background: "var(--bg)" }}>
      <div className="container">
        <FadeIn>
          <div className="label-tag" style={{ color: "var(--primary)", marginBottom: "0.75rem" }}>Expérience & Formation</div>
          <h2 className="section-heading" style={{ marginBottom: "clamp(2.5rem,5vw,4rem)" }}>Parcours</h2>
        </FadeIn>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "6px", top: 12, bottom: 12,
            width: "1px",
            background: "linear-gradient(to bottom, var(--primary), rgba(37,99,235,0.12))",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            {EXPERIENCES.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div style={{ display: "flex", gap: "1.5rem", paddingBottom: i < EXPERIENCES.length - 1 ? "2.5rem" : 0, position: "relative" }}>
                  {/* Dot */}
                  <div style={{ position: "absolute", left: "-2rem", top: 2 }}>
                    <div className={item.type === "work" ? "timeline-dot-filled" : "timeline-dot"} />
                  </div>

                  {/* Content */}
                  <motion.div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.25rem 1.5rem", marginLeft: "-0.5rem" }}
                    whileHover={{ borderColor: "rgba(37,99,235,0.25)", boxShadow: "0 4px 20px rgba(37,99,235,0.07)" }}
                    transition={{ duration: 0.2 }}>
                    {/* Date */}
                    <div className="label-tag" style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
                      {item.date}
                    </div>
                    {/* Title */}
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.015em", color: "var(--text)", marginBottom: "0.2rem" }}>
                      {item.title}
                    </h3>
                    {/* Org */}
                    <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 500, marginBottom: item.desc || item.items ? "0.85rem" : "0.6rem" }}>
                      {item.org}
                      {item.type === "work" ? " · Déploiement & analyse data" : " · Dakar"}
                    </div>
                    {/* Description */}
                    {item.desc && (
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "0.85rem" }}>
                        {item.desc}
                      </p>
                    )}
                    {item.items && (
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.85rem" }}>
                        {item.items.slice(0, 3).map(li => (
                          <li key={li} style={{ display: "flex", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                            <span style={{ color: "var(--primary-dark)", flexShrink: 0, marginTop: "0.2rem", fontSize: "0.6rem" }}>▸</span>
                            {li}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Tags + status */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
                      {item.tags?.map((t, ti) => (
                        <span key={t} className={`tag ${ti === 1 ? "tag-gray" : ti === 2 ? "tag-violet" : ""}`} style={{ fontSize: "0.62rem" }}>{t}</span>
                      ))}
                      {item.type === "work" && (
                        <span className="tag tag-green" style={{ fontSize: "0.62rem" }}>Terminé</span>
                      )}
                      {item.type === "education" && (
                        <span className="tag" style={{ fontSize: "0.62rem" }}>Diplômé</span>
                      )}
                    </div>
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
