"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import MouseSpotCard from "@/components/MouseSpotCard";
import { ABOUT_FACTS } from "@/lib/data";

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (ref.current) ref.current.textContent = Math.floor(start).toString() + suffix;
      if (start >= target) {
        if (ref.current) ref.current.textContent = target.toString() + suffix;
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const ease = [0.22, 1, 0.36, 1] as const;

function GitHubStatsManager() {
  const [repos, setRepos] = useState<number>(3); // Fallback à 3
  
  useEffect(() => {
    fetch("https://api.github.com/users/sergeabba")
      .then(res => res.json())
      .then(data => {
        if (data.public_repos) setRepos(data.public_repos);
      })
      .catch(() => {});
  }, []);

  return <div style={{ display: "none" }} id="github-stats-bridge" data-repos={repos} />;
}

export default function About() {
  const [reposCount, setReposCount] = useState(3);

  useEffect(() => {
    const checkStats = setInterval(() => {
      const el = document.getElementById("github-stats-bridge");
      if (el) {
        const val = parseInt(el.getAttribute("data-repos") || "3");
        if (val !== reposCount) setReposCount(val);
      }
    }, 500);
    return () => clearInterval(checkStats);
  }, [reposCount]);

  return (
    <section id="quisuisje" style={{ background: "var(--bg)", padding: "clamp(6rem, 10vw, 9rem) 0", position: "relative", overflow: "hidden" }}>
      {/* Floating orbes */}
      <div className="orb orb-blue orb-2" style={{ width: 500, height: 500, top: "5%", right: "-20%" }} />
      <div className="orb orb-rose" style={{ width: 300, height: 300, bottom: "10%", left: "-8%", opacity: 0.1 }} />

      <GitHubStatsManager />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="section-label">À propos</span>
          <h2 className="section-heading">Qui suis-je&nbsp;?</h2>
          <p className="section-desc" style={{ marginTop: "0.6rem" }}>
            Data Analyst junior & IT Support, passionné par la donnée, l&apos;IA et la création visuelle.
          </p>
        </div>
      </motion.div>

      {/* Glow line separator */}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="glow-line" style={{ marginTop: "3rem" }} />
      </div>

      {/* Bio + Formation row */}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(2.5rem, 5vw, 5rem)",
            alignItems: "start",
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
              {[
                {
                  parts: [
                    { text: "Je suis ", color: "var(--text-secondary)" },
                    { text: "Mbaitadjim Abba Serge", color: "var(--text)", weight: 700 },
                    { text: ", connu sous l'alias ", color: "var(--text-secondary)" },
                    { text: '"Le Don"', color: "var(--accent-soft)", weight: 600 },
                    { text: "  une référence à ma philosophie : cultiver l'excellence par le travail acharné.", color: "var(--text-secondary)" },
                  ],
                },
                {
                  parts: [
                    { text: "Titulaire d'un ", color: "var(--text-secondary)" },
                    { text: "Master Big Data", color: "var(--accent-soft)", weight: 600 },
                    { text: ", de l'ISM Digital Campus (Dakar), j'ai acquis une première expérience concrète chez ", color: "var(--text-secondary)" },
                    { text: "Wemoov", color: "var(--text)", weight: 600 },
                    { text: ", où j'ai créé des tableaux de bord Power BI.", color: "var(--text-secondary)" },
                  ],
                },
                {
                  parts: [
                    { text: "Fasciné par l'", color: "var(--text-secondary)" },
                    { text: "IA générative", color: "var(--accent-rose)", weight: 600 },
                    { text: ", j'utilise les outils data et design pour donner vie à des idées percutantes. Gaming, création, systèmes  j'y mets la même énergie.", color: "var(--text-secondary)" },
                  ],
                },
              ].map((block, bi) => (
                <motion.p
                  key={bi}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + bi * 0.08, ease }}
                  style={{ fontSize: "0.93rem", lineHeight: 1.8 }}
                >
                  {block.parts.map((part, pi) => (
                    <span key={pi} style={{ color: part.color, fontWeight: part.weight || 400 }}>
                      {part.text}
                    </span>
                  ))}
                </motion.p>
              ))}

              {/* Identity facts */}
              <motion.div
                className="liquid-card"
                style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
              >
                {ABOUT_FACTS.map(({ key, val }) => (
                  <div key={key} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "var(--accent-soft)", textTransform: "uppercase", minWidth: 72, flexShrink: 0, paddingTop: 2, opacity: 0.6 }}>
                      {key}
                    </span>
                    <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5, fontFamily: "var(--font-body)" }}>
                      {val}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Formation & exp */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {/* Experience */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease }}
              >
                <div style={{ marginBottom: "0.85rem" }}>
                  <span className="pill pill-accent" style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Expérience pro.</span>
                </div>
                <motion.div className="glass" style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "1rem 1.1rem" }} whileHover={{ x: 4, borderColor: "var(--glass-border-h)" }} transition={{ duration: 0.3 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#FCA5A5", flexShrink: 0 }}>
                    W
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.83rem", color: "var(--text)", marginBottom: "0.15rem" }}>
                      Stage &mdash; Data Analyse
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="mono" style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Juin &ndash; Oct. 2024</span>
                      <span className="pill" style={{ fontSize: "0.55rem", background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.18)", color: "#86EFAC" }}>Termine</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Formation */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease }}
              >
                <div style={{ marginBottom: "0.85rem" }}>
                  <span className="pill pill-accent" style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Formation</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { abbr: "M", title: "Master Big Data & Data Strategie", sub: "2021 &ndash; 2023", place: "Digital Campus", color: "var(--accent)" },
                    { abbr: "L", title: "Licence LIAGE", sub: "2018 &ndash; 2021", place: "Ecole d'Ingenieurs ISM", color: "var(--accent-warm)" },
                    { abbr: "B", title: "Baccalaureat Litteraire", sub: "2017 &ndash; 2018", place: "Lycee Saint-Etienne", color: "var(--text-tertiary)" },
                  ].map(({ abbr, title, sub, place, color }, i) => (
                    <motion.div
                      key={title}
                      className="glass"
                      style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem" }}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease }}
                      whileHover={{ x: 3, borderColor: "var(--glass-border-h)" }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: `${color}10`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 800, color, flexShrink: 0 }}>
                        {abbr}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.82rem", color: "var(--text)", marginBottom: "0.1rem" }}>{title}</div>
                        <div className="mono" style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }} dangerouslySetInnerHTML={{ __html: `${sub} &middot; ${place}` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bento row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease }}
        >
          <MouseSpotCard style={{ borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
            <div
              className="glass"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", padding: "0.75rem", marginTop: "clamp(3rem, 6vw, 5rem)" }}
            >
              {[
                { val: 1, suffix: " an", label: "d'expérience pro" },
                { val: 5, suffix: "+", label: "outils data maîtrisés" },
                { val: 92, suffix: "%", label: "IA & Prompt Eng." },
                { val: reposCount, suffix: "", label: "repositories GitHub" },
              ].map(({ val, suffix, label }, i) => (
                <motion.div
                  key={label}
                  className="liquid-card liquid-glow"
                  style={{ padding: "1.4rem 1rem", textAlign: "center" }}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.07, ease }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.35rem" }}>
                    <Counter target={val} suffix={suffix} />
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </MouseSpotCard>
        </motion.div>

        {/* GitHub Graph - Extra Vibe for Vibecoder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.65, delay: 0.5, ease }}
          style={{ marginTop: "1.5rem" }}
        >
          <div className="glass" style={{ padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--glass-border-h)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
                  Live GitHub Activity
                </span>
              </div>
              <a 
                href="https://github.com/sergeabba" 
                target="_blank" 
                rel="noopener noreferrer"
                className="pill"
                style={{ fontSize: "0.6rem", textDecoration: "none", background: "rgba(255,255,255,0.05)" }}
              >
                @sergeabba
              </a>
            </div>
            
            <div style={{ overflowX: "auto", overflowY: "hidden", padding: "0.5rem 0" }}>
              <img 
                src="https://ghchart.rshah.org/191c1f/sergeabba" 
                alt="GitHub Contributions" 
                style={{ 
                  filter: "invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.1)", 
                  minWidth: "700px",
                  height: "auto",
                  opacity: 0.8
                }} 
              />
            </div>
            
            <p style={{ marginTop: "1rem", fontSize: "0.65rem", color: "var(--text-tertiary)", textAlign: "center", fontStyle: "italic" }}>
              "Vibecoding : Transformer le café en commits, un prompt à la fois."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
