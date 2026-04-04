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
import CursorGlow from "@/components/CursorGlow";
import TextMarquee from "@/components/TextMarquee";
import MagneticButton from "@/components/MagneticButton";

const MARQUEE_SKILLS = [
  "Power BI", "Python", "SQL", "Pandas", "Spark",
  "IA Generative", "Prompt Engineering", "Figma", "Photoshop",
  "Data Visualization", "WordPress", "Scala", "Big Data",
];

export default function Home() {
  return (
    <>
      <SkipLink />
      <CursorGlow />
      <main>
        <div className="noise" aria-hidden="true" />

        <Navbar />

        <Hero />
        <div className="divider" />

        <About />
        <div className="divider" />

        <Skills />
        <div className="divider" />

        {/* Marquee section */}
        <section className="marquee-fade" style={{ padding: "clamp(2rem, 4vw, 3.5rem) 0", position: "relative" }}>
          <TextMarquee items={MARQUEE_SKILLS} speed={30} label="Outils & Technologies" />
        </section>
        <div className="divider" />

        <Projects />
        <div className="divider" />

        <Experience />
        <div className="divider" />

        {/* CTA Section before Contact */}
        <CTABanner />
        <div className="divider" />

        <Contact />
        <div className="divider" />

        <Footer />
      </main>
      <BackToTop />
    </>
  );
}

function CTABanner() {
  return (
    <section style={{ padding: "clamp(4rem, 8vw, 6rem) 0", position: "relative", overflow: "hidden" }}>
      <div className="orb orb-blue orb" style={{ width: 500, height: 500, top: "-20%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="liquid-card liquid-glow" style={{ padding: "clamp(2.5rem, 5vw, 4rem)", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: 680, width: "100%" }}>
            <h3 className="text-gradient-irid" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Prêt à transformer la donnée en décisions&nbsp;?
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.65, maxWidth: 460 }}>
              Que ce soit pour un stage, un projet freelance, ou une opportunité en entreprise, je suis prêt à m&apos;investir.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <MagneticButton>
                <a href="/cv.pdf" download className="btn-primary" style={{ padding: "0.85rem 2rem" }}>
                  Télécharger le CV
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="#contact" className="btn-glass" style={{ padding: "0.85rem 2rem" }}>
                  Me contacter
                </a>
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
