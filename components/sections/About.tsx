"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { Counter } from "./Hero";
import { ABOUT_FACTS } from "@/lib/data";

export default function About() {
  return (
    <section
      id="quisuisje"
      className="mesh-surface"
      style={{ padding: "clamp(4rem, 8vw, 6.5rem) 0", position: "relative" }}
    >
      <div className="container">
        <FadeIn>
          <div className="section-badge">À propos</div>
          <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>
            Qui suis-je ?
          </h2>
          <p
            style={{
              color: "var(--text-faint)",
              fontSize: "0.9rem",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              maxWidth: "460px",
            }}
          >
            Data Analyst junior, passionné par la donnée, l&apos;IA et la création visuelle.
          </p>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            alignItems: "start",
            marginBottom: "3rem",
          }}
        >
          {/* ── Bio ── */}
          <FadeIn delay={0.1}>
            <div
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.85,
                color: "var(--text-muted)",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
              }}
            >
              <p>
                Je suis{" "}
                <strong style={{ color: "var(--text)", fontWeight: 700 }}>Mbaitadjim Abba Serge</strong>,
                connu sous l&apos;alias{" "}
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>"Le Don"</span> — une
                référence à ma philosophie : cultiver l&apos;excellence par le travail acharné.
              </p>
              <p>
                Titulaire d&apos;un{" "}
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                  Master Big Data & Data Stratégie
                </span>{" "}
                de l&apos;ISM Digital Campus (Dakar), j&apos;ai acquis une première expérience
                concrète lors d&apos;un stage chez{" "}
                <strong style={{ color: "var(--text)", fontWeight: 600 }}>Wemoov</strong>, où
                j&apos;ai créé des tableaux de bord Power BI et analysé les performances opérationnelles.
              </p>
              <p>
                Fasciné par l&apos;
                <span style={{ color: "#F472B6", fontWeight: 600 }}>IA générative</span>, j&apos;utilise
                les outils data et de design pour donner vie à des idées percutantes. Gaming, création
                visuelle, systèmes — j&apos;y mets la même énergie.
              </p>

              {/* Identité facts */}
              <div
                style={{
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.1rem",
                  background: "var(--bg-card)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  marginTop: "0.5rem",
                }}
              >
                {ABOUT_FACTS.map(({ key, val }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      alignItems: "flex-start",
                      paddingBottom: "0.6rem",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        color: "var(--primary)",
                        textTransform: "uppercase",
                        minWidth: 72,
                        flexShrink: 0,
                        paddingTop: 2,
                        opacity: 0.7,
                      }}
                    >
                      {key}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        fontWeight: 400,
                        lineHeight: 1.5,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── Formation & expérience ── */}
          <FadeIn delay={0.18}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Expérience pro */}
              <div>
                <div className="label-tag" style={{ marginBottom: "0.85rem" }}>
                  Expérience pro.
                </div>
                <div className="formation-card" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
                  <div
                    className="skill-icon skill-icon-red"
                    style={{ borderRadius: "var(--radius-md)", marginBottom: 0, flexShrink: 0, width: 36, height: 36 }}
                  >
                    W
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: "0.83rem",
                        color: "var(--text)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Stage — Data Analyse · Wemoov
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-faint)",
                          fontFamily: "monospace",
                        }}
                      >
                        Juin – Oct. 2024
                      </span>
                      <span className="tag tag-green" style={{ fontSize: "0.58rem" }}>
                        Terminé
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formation */}
              <div>
                <div className="label-tag" style={{ marginBottom: "0.85rem" }}>
                  Formation académique
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {[
                    { abbr: "M", title: "Master Big Data & Data Stratégie", sub: "2021 – 2023 · Digital Campus", cls: "skill-icon-blue" },
                    { abbr: "L", title: "Licence LIAGE", sub: "2018 – 2021 · École d'Ingénieurs ISM", cls: "skill-icon-violet" },
                    { abbr: "B", title: "Baccalauréat Littéraire", sub: "2017 – 2018 · Lycée Saint Etienne", cls: "skill-icon-gray" },
                  ].map(({ abbr, title, sub, cls }) => (
                    <div key={title} className="formation-card">
                      <div
                        className={`skill-icon ${cls}`}
                        style={{ borderRadius: "var(--radius-md)", marginBottom: 0, flexShrink: 0, width: 36, height: 36 }}
                      >
                        {abbr}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "0.82rem",
                            color: "var(--text)",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-faint)",
                            fontFamily: "monospace",
                          }}
                        >
                          {sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── Stats ── */}
        <FadeIn delay={0.28}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.85rem",
            }}
          >
            {[
              { val: 1, suffix: " an", label: "d'expérience pro", color: "var(--primary)" },
              { val: 5, suffix: "+", label: "outils data maîtrisés", color: "#818CF8" },
              { val: 92, suffix: "%", label: "IA & Prompt Eng.", color: "#F472B6" },
              { val: 3, suffix: "", label: "projets livrés", color: "var(--primary)" },
            ].map(({ val, suffix, label, color }, i) => (
              <motion.div
                key={label}
                className="stat-box"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + i * 0.06 }}
                whileHover={{ y: -3 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    color,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: "0.35rem",
                  }}
                >
                  <Counter target={val} suffix={suffix} />
                </div>
                <div
                  className="label-tag"
                  style={{ color: "var(--text-faint)", fontSize: "0.6rem" }}
                >
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}