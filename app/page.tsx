"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import BackToTop from "@/components/BackToTop";
import SkipLink from "@/components/SkipLink";

const MARQUEE_SKILLS = [
  "Power BI", "Python", "SQL", "Pandas", "Spark",
  "IA Générative", "Prompt Engineering", "Figma", "Photoshop",
  "Data Visualization", "WordPress", "Scala", "Big Data",
];

const MARQUEE_ICONS: Record<string, string> = {
  "Power BI": "ph-chart-polar",
  "Python": "ph-code",
  "SQL": "ph-database",
  "Pandas": "ph-table",
  "Spark": "ph-lightning",
  "IA Générative": "ph-brain",
  "Prompt Engineering": "ph-sparkle",
  "Figma": "ph-pen-nib",
  "Photoshop": "ph-image",
  "Data Visualization": "ph-chart-bar",
  "WordPress": "ph-globe",
  "Scala": "ph-terminal",
  "Big Data": "ph-stack",
};

export default function Home() {
  const doubled = [...MARQUEE_SKILLS, ...MARQUEE_SKILLS];

  return (
    <>
      <SkipLink />
      <main>
        <Navbar />

        <Hero />

        {/* Marquee Tech Ticker */}
        <TechTicker items={doubled} iconMap={MARQUEE_ICONS} />

        <About />

        <Skills />

        <Projects />

        <Experience />

        {/* CTA Banner */}
        <CTABanner />

        <Contact />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}

/* ── Marquee Tech Ticker ── */
function TechTicker({ items, iconMap }: { items: string[]; iconMap: Record<string, string> }) {
  return (
    <section style={{ background: "var(--revo-mint)", overflow: "hidden", borderTop: "1px solid var(--revo-black)", borderBottom: "1px solid var(--revo-black)", padding: "0.85rem 0" }}>
      <div className="marquee-track" style={{ display: "flex", alignItems: "center", gap: "2.5rem", width: "max-content" }}>
        {items.map((item, i) => (
          <span key={`${item}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.05rem", letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--revo-black)", whiteSpace: "nowrap" }}>
            <i className={`ph ${iconMap[item] ?? "ph-dot"}`} style={{ fontSize: "0.75rem" }} />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── CTA Banner ── */
function CTABanner() {
  return (
    <section style={{ background: "var(--revo-blue)", color: "#fff", padding: "clamp(4rem, 8vw, 6.5rem) 0", overflow: "hidden" }}>
      <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "#ffffff", marginBottom: "2.5rem", maxWidth: "30ch", marginInline: "auto" }}>
            Prêt à transformer la donnée en décisions&nbsp;?
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/cv.pdf" download className="btn-white">Télécharger CV</a>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.85rem 2.5rem", borderRadius: "9999px", background: "transparent", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.02em", border: "2px solid #fff", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap", minHeight: 48, transition: "background 0.25s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >Démarrer un projet</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
