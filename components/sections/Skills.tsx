"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { SKILL_CATEGORIES } from "@/lib/data";

export default function Skills() {
  return (
    <section id="competences" className="mesh-white" style={{ padding: "clamp(4rem,8vw,6.5rem) 0", position: "relative", overflow: "hidden" }}>
      <div className="container">
        <FadeIn>
          <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>Mes Compétences</h2>
          <p style={{ color: "var(--text-faint)", fontSize: "0.9rem", marginBottom: "clamp(2.5rem,5vw,4rem)", maxWidth: "440px" }}>
            Un ensemble de compétences couvrant la data, l&apos;IA et la création.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {SKILL_CATEGORIES.map((cat, i) => {
            const iconDefs = [
              { abbr: "DA", cls: "skill-icon-blue" },
              { abbr: "IA", cls: "skill-icon-violet" },
              { abbr: "DG", cls: "skill-icon-red" },
              { abbr: "WB", cls: "skill-icon-gray" },
              { abbr: "SY", cls: "skill-icon-blue" },
              { abbr: "CR", cls: "skill-icon-violet" },
            ];
            const { abbr, cls } = iconDefs[i] || { abbr: "//", cls: "skill-icon-gray" };
            const tagClass = i % 3 === 1 ? "tag-violet" : i % 3 === 2 ? "tag-gray" : "";
            
            return (
              <motion.div key={cat.title} className="skill-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: (i % 3) * 0.07, duration: 0.55 }}>
                <div className={`skill-icon ${cls}`}>{abbr}</div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: "0.85rem" }}>
                  {cat.title}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.tags.map((t, j) => (
                    <span key={t} className={`tag ${j % 4 === 1 ? "tag-red" : j % 4 === 2 ? tagClass : j % 4 === 3 ? "tag-gray" : ""}`} style={{ fontSize: "0.65rem" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <FadeIn delay={0.3}>
          <h3 className="section-heading" style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)", marginBottom: "1.5rem", color: "var(--primary)" }}>Niveaux de maîtrise</h3>
          <div className="max-w-2xl mx-auto">
            {SKILL_BARS.all.map((skill, i) => (
              <div key={skill.label} className="mb-6 last:mb-0" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.8rem", height: "1.1rem" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.88rem", color: "var(--text)" }}>
                    {skill.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-faint)" }}>
                    {skill.level}%
                  </span>
                </div>
                <div style={{ height: "8px", background: "var(--bg-card)", borderRadius: "4px", overflow: "hidden" }}>
                  <motion.div 
                    className="relative"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ 
                      height: "100%", 
                      background: skill.accent ? "linear-gradient(90deg, var(--accent-red), var(--violet))" : "var(--primary)", 
                      borderRadius: "4px" 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
import { SKILL_BARS } from "@/lib/data";

