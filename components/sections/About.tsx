"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { Counter } from "./Hero";

export default function About() {
  return (
    <section id="quisuisje" style={{ padding: "clamp(4rem,8vw,6.5rem) 0", background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Heading */}
        <FadeIn>
          <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>Qui suis-je ?</h2>
          <p style={{ color: "var(--text-faint)", fontSize: "0.9rem", marginBottom: "clamp(2.5rem,5vw,4rem)", maxWidth: "460px" }}>
            Data Analyst junior, passionné par la donnée, l&apos;IA et la création visuelle.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-start mb-10">
          {/* Bio */}
          <FadeIn delay={0.1}>
            <div style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <p>
                Je suis <strong style={{ color: "var(--text)", fontWeight: 700 }}>Mbaitadjim Abba Serge</strong>, connu sous l&apos;alias{" "}
                <span style={{ color: "var(--primary)", fontWeight: 600 }}> "Du Don" </span>  une référence à ma philosophie : cultiver l&apos;excellence par le travail acharné et la joie de vivre.
              </p>
              <p>
                Titulaire d&apos;un{" "}
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>Master Big Data & Data Stratégie</span>{" "}
                de l&apos;ISM Digital Campus (Dakar), j&apos;ai acquis une première expérience concrète lors d&apos;un stage chez{" "}
                <strong style={{ color: "var(--text)", fontWeight: 600 }}>Wemoov</strong> (Juin 2024 – Oct. 2025),
                où j&apos;ai créé des tableaux de bord Power BI et analysé les performances des chauffeurs et la consommation des véhicules.
              </p>
              <p>
                Fasciné par l&apos;<span style={{ color: "var(--accent-red)", fontWeight: 600 }}>IA générative</span>,
                j&apos;utilise les outils data et de design pour donner vie à des idées percutantes.
                Que ce soit une base de données complexe ou un visuel gaming  j&apos;y mets la même énergie.
              </p>
            </div>
          </FadeIn>

          {/* Expérience & Formation summary */}
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Expérience Pro focus */}
              <div>
                <div className="label-tag" style={{ color: "var(--accent-red)", marginBottom: "1rem" }}>Expérience pro.</div>
                <div className="formation-card" style={{ borderColor: "rgba(239,68,68,0.15)" }}>
                  <div className="skill-icon skill-icon-red" style={{ borderRadius: 10, marginBottom: 0, flexShrink: 0, width: 36, height: 36 }}>W</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.83rem", color: "var(--text)", marginBottom: "0.2rem" }}>Stage  Data Analyse · Wemoov</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontFamily: "monospace" }}>Juin 2024 – Octobre 2025</span>
                      <span className="tag tag-green" style={{ fontSize: "0.58rem" }}>Terminé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formation grid */}
              <div>
                <div className="label-tag" style={{ color: "var(--primary)", marginBottom: "1rem" }}>Formation académique</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {[
                    { abbr: "M", title: "Master Big Data & Data Stratégie", sub: "2021 – 2023 · Digital Campus", iconClass: "skill-icon-blue" },
                    { abbr: "L", title: "Licence  LIAGE", sub: "2018 – 2021 · École d'Ingénieurs ISM", iconClass: "skill-icon-violet" },
                    { abbr: "B", title: "Baccalauréat Littéraire", sub: "2017 – 2018 · Lycée Saint Etienne", iconClass: "skill-icon-gray" },
                  ].map(({ abbr, title, sub, iconClass }) => (
                    <div key={title} className="formation-card">
                      <div className={`skill-icon ${iconClass}`} style={{ borderRadius: 10, marginBottom: 0, flexShrink: 0, width: 36, height: 36 }}>{abbr}</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.83rem", color: "var(--text)", marginBottom: "0.2rem" }}>{title}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", fontFamily: "monospace", letterSpacing: "0.01em" }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </FadeIn>
        </div>

        {/* Stats row */}
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { val: 1, suffix: " an", label: "d'expérience pro", color: "var(--primary)" },
              { val: 5, suffix: "+", label: "outils data maîtrisés", color: "var(--violet)" },
              { val: 92, suffix: "%", label: "IA & Prompt Eng.", color: "var(--accent-red)" },
              { val: 3, suffix: "", label: "projets réalisés", color: "var(--primary)" },
            ].map(({ val, suffix, label, color }, i) => (
              <motion.div key={label} className="stat-box"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07 }}
                whileHover={{ borderColor: color.replace(')', ', 0.25)').replace('var(', 'rgba(') }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.6rem,3.5vw,2.2rem)", color, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  <Counter target={val} suffix={suffix} />
                </div>
                <div className="label-tag" style={{ color: "var(--text-faint)", fontSize: "0.6rem", marginTop: "0.4rem" }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
