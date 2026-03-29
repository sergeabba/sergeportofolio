"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

import TypeWriter from "@/components/TypeWriter";
import FadeIn from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import SkillBar from "@/components/SkillBar";
import Lightbox from "@/components/Lightbox";
import ContactForm from "@/components/ContactForm";

import {
  NAV_LINKS,
  HERO_ROLES,
  SKILL_CATEGORIES,
  SKILL_BARS,
  EXPERIENCES,
  CONTACT_LINKS,
  FILTER_CATEGORIES,
  ABOUT_FACTS,
} from "@/lib/data";
import { smoothScrollTo, padIndex } from "@/lib/utils";
import type { Projet } from "@/lib/types";

/* ── Compétences affichées dans la carte hero ── */
const HERO_SKILLS = [
  { label: "Data & Power BI",               pct: 85, color: "#3B6FE8" },
  { label: "Python · Pandas · SQL",         pct: 75, color: "#5B8AFF" },
  { label: "IA Générative & Prompt Eng.",   pct: 92, color: "#6B93FF" },
  { label: "Canva · Photoshop · Design",    pct: 85, color: "#3B6FE8" },
  { label: "Big Data — Spark · PySpark",    pct: 65, color: "#5B8AFF" },
];

/* ─────────────────────────────────────────── */
export default function Home() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [projetsLoading, setProjetsLoading] = useState(true);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY    = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    fetch("/projets/data.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Projet[]) => { setProjets(data); setProjetsLoading(false); })
      .catch(() => { setProjets([]); setProjetsLoading(false); });
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, []);

  const filteredProjets = filter === "Tous" ? projets : projets.filter((p) => p.cat === filter);

  /* ── shared inline style shortcuts ── */
  const S = {
    displayFont: { fontFamily: "var(--font-display)" } as React.CSSProperties,
  };

  return (
    <main className="grain-overlay">

      {/* ══════════════════════════════════
          NAVIGATION
      ══════════════════════════════════ */}
      <motion.nav
        className="fixed top-0 w-full z-50"
        style={{
          background: scrolled ? "rgba(11,15,26,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(59,111,232,0.15)" : "1px solid transparent",
          transition: "all 0.45s ease",
        }}
        aria-label="Navigation principale"
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1.1rem", paddingBottom: "1.1rem" }}>

          {/* Logo */}
          <motion.button
            onClick={() => smoothScrollTo("bio")}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "none", border: "none", cursor: "pointer" }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            aria-label="Retour en haut"
          >
            <div style={{
              width: 38, height: 38, flexShrink: 0, borderRadius: 8,
              background: "linear-gradient(135deg, #2150CC, #6B93FF)",
              fontFamily: "var(--font-display)", fontSize: "1.2rem",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(59,111,232,0.35)",
            }}>S</div>
            <div>
              <div style={{ ...S.displayFont, fontSize: "0.95rem", letterSpacing: "0.08em", color: "var(--color-text)", lineHeight: 1 }}>
                Mbaitadjim <span style={{ color: "var(--color-blue-light)" }}>Abba Serge</span>
              </div>
              <div style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--color-text-faint)", textTransform: "uppercase", marginTop: 2 }}>
                Data · IA · Créateur
              </div>
            </div>
          </motion.button>

          {/* Desktop nav */}
          <motion.div className="hidden md:flex" style={{ gap: "2rem", alignItems: "center" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} className="nav-link" onClick={() => smoothScrollTo(id)}>{label}</button>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.a href="/cv.pdf" download className="gold-btn hidden md:inline-flex"
            style={{ padding: "0.6rem 1.4rem", fontSize: "0.82rem" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Télécharger CV
          </motion.a>

          {/* Burger */}
          <button className="md:hidden"
            style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0.4rem", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer" : "Menu"} aria-expanded={menuOpen}>
            {[0, 1, 2].map((i) => (
              <motion.span key={i}
                style={{ display: "block", width: 22, height: 1.5, background: "var(--color-blue-light)", borderRadius: 2 }}
                animate={menuOpen ? i === 1 ? { opacity: 0 } : i === 0 ? { rotate: 45, y: 7.5 } : { rotate: -45, y: -7.5 } : { rotate: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.22 }}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ overflow: "hidden", background: "rgba(11,15,26,0.98)", borderBottom: "1px solid rgba(59,111,232,0.15)" }}>
              <div style={{ padding: "1.5rem 1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {NAV_LINKS.map(({ id, label }) => (
                  <button key={id} className="nav-link" style={{ fontSize: "1.2rem", textAlign: "left" }}
                    onClick={() => { smoothScrollTo(id); setMenuOpen(false); }}>{label}</button>
                ))}
                <a href="/cv.pdf" download className="gold-btn" style={{ padding: "0.9rem", textAlign: "center", marginTop: "0.5rem" }}>
                  Télécharger CV
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════════════════════════════════
          HERO — bleu marine + carte flottante
      ══════════════════════════════════ */}
      <section id="bio" ref={heroRef}
        style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: "var(--color-bg-hero)" }}>

        {/* Image de fond parallaxe */}
        <motion.div style={{ position: "absolute", inset: "-10% 0", y: heroImgY }}>
          <Image src="/zelda-bg.jpg" alt="" fill sizes="100vw" priority
            style={{ objectFit: "cover", opacity: 0.07, filter: "saturate(0.3) hue-rotate(180deg)" }} />
        </motion.div>

        {/* Mesh gradient bleu */}
        <div style={{ position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 70% at 15% 50%, rgba(21,45,110,0.7) 0%, transparent 65%), radial-gradient(ellipse 50% 60% at 80% 30%, rgba(30,55,140,0.35) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 100%, rgba(10,25,70,0.5) 0%, transparent 70%)",
          pointerEvents: "none" }} />

        {/* Glow points déco */}
        <div style={{ position: "absolute", top: "20%", left: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,111,232,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(59,111,232,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Points de grille déco */}
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} aria-hidden="true" />

        <motion.div className="container" style={{ position: "relative", zIndex: 10, width: "100%", opacity: heroOpacity,
          paddingTop: "clamp(6rem, 12vw, 10rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)" }}>

          {/* Layout 2 colonnes hero */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "center" }}>

            {/* ── Colonne gauche : texte ── */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>

              {/* Badge disponible */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(59,111,232,0.1)", border: "1px solid rgba(59,111,232,0.25)",
                padding: "0.38rem 1rem", borderRadius: 100, marginBottom: "2rem" }}>
                <span className="animate-pulse-dot" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} aria-hidden="true" />
                <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(180,200,255,0.8)", letterSpacing: "0.04em" }}>
                  Disponible · Dakar, Sénégal
                </span>
              </div>

              {/* Nom */}
              <h1 style={{ ...S.displayFont, lineHeight: 0.88, letterSpacing: "-0.01em", marginBottom: "1.5rem" }}>
                <span style={{ display: "block", fontSize: "clamp(3rem, 8vw, 8.5rem)", color: "var(--color-text)" }}>
                  Mbaitadjim
                </span>
                <span style={{ display: "block", fontSize: "clamp(3rem, 8vw, 8.5rem)",
                  background: "linear-gradient(135deg, #5B8AFF 0%, #93B8FF 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Abba Serge
                </span>
                <span style={{ display: "block", fontSize: "clamp(1.2rem, 3vw, 2.6rem)", color: "rgba(255,255,255,0.1)", letterSpacing: "0.4em", marginTop: "0.5rem", WebkitTextFillColor: "initial" }}>
                  — Le Don —
                </span>
              </h1>

              {/* Typewriter */}
              <div style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.18rem)", color: "var(--color-text-muted)", fontWeight: 300, minHeight: "1.8rem", marginBottom: "1.25rem" }}>
                <TypeWriter texts={HERO_ROLES} />
              </div>

              <p style={{ maxWidth: 500, color: "rgba(196,210,242,0.45)", lineHeight: 1.85, fontSize: "0.93rem", fontWeight: 300, marginBottom: "2.5rem" }}>
                Master en Big Data & Data Stratégie. Passionné par l&apos;IA générative, le gaming et la création de contenu —
                je transforme la donnée en décisions, les idées en produits.
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginBottom: "3rem" }}>
                <button className="gold-btn" style={{ padding: "0.95rem 2rem" }} onClick={() => smoothScrollTo("realisations")}>
                  ▶ Voir mes projets
                </button>
                <button className="ghost-btn" style={{ padding: "0.95rem 2rem" }} onClick={() => smoothScrollTo("contact")}>
                  Me contacter →
                </button>
              </div>

              {/* Tags domaines */}
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", paddingTop: "1.5rem", borderTop: "1px solid rgba(59,111,232,0.12)" }}>
                {["🛡 Cybersécurité", "‹/› Python · SQL", "◎ Big Data · IA"].map((tag) => (
                  <div key={tag} style={{ fontSize: "0.78rem", color: "rgba(180,200,255,0.5)", fontWeight: 400 }}>{tag}</div>
                ))}
              </div>
            </motion.div>

            {/* ── Carte flottante compétences — comme la référence ── */}
            <motion.div
              className="animate-float-card hidden lg:block"
              initial={{ opacity: 0, x: 40, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: 300, flexShrink: 0 }}
            >
              {/* Badge "Le Don" flottant au-dessus */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.6rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7,
                  background: "rgba(13,17,32,0.9)", border: "1px solid rgba(59,111,232,0.3)",
                  padding: "0.4rem 0.9rem", borderRadius: 100,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B6FE8", display: "inline-block", boxShadow: "0 0 8px #3B6FE8" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(180,200,255,0.9)" }}>Data Analyst</span>
                </div>
              </div>

              {/* Carte principale */}
              <div className="hero-skill-card">
                {/* Header */}
                <div className="hero-skill-card-header">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text)", marginBottom: 2 }}>
                        Mbaitadjim Abba Serge
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(180,200,255,0.55)", fontWeight: 400 }}>
                        Big Data & Data Stratégie
                      </div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%",
                      background: "linear-gradient(135deg, #2150CC, #6B93FF)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#fff",
                      boxShadow: "0 0 16px rgba(59,111,232,0.4)", flexShrink: 0 }}>
                      S
                    </div>
                  </div>
                </div>

                {/* Skills bars */}
                <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {HERO_SKILLS.map((skill, i) => (
                    <div key={skill.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                        <span style={{ fontSize: "0.75rem", color: "rgba(196,210,242,0.75)", fontWeight: 500 }}>
                          {skill.label}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "rgba(107,147,255,0.8)", fontWeight: 600 }}>
                          {skill.pct}%
                        </span>
                      </div>
                      <div className="hero-skill-bar-track">
                        <motion.div
                          className="hero-skill-bar-fill"
                          style={{ background: `linear-gradient(90deg, ${skill.color}cc, ${skill.color})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.pct}%` }}
                          transition={{ delay: 0.8 + i * 0.12, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer badge */}
                <div style={{ padding: "0.85rem 1.5rem", borderTop: "1px solid rgba(59,111,232,0.12)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(59,111,232,0.15)", border: "1px solid rgba(59,111,232,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>✦</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(180,200,255,0.5)", fontWeight: 500 }}>
                    ISM Digital Campus · Dakar
                  </span>
                </div>
              </div>

              {/* Badge JWT en bas à gauche */}
              <div style={{ marginTop: "0.7rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(13,17,32,0.9)", border: "1px solid rgba(59,111,232,0.25)",
                  padding: "0.38rem 0.85rem", borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.35)" }}>
                  <span style={{ fontSize: "0.9rem" }}>🎮</span>
                  <span style={{ fontSize: "0.73rem", fontWeight: 500, color: "rgba(180,200,255,0.7)" }}>
                    Gaming · IA · Création
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)" }}
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          aria-hidden="true">
          <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(59,111,232,0.6), transparent)", margin: "0 auto" }} />
        </motion.div>
      </section>

      <div className="gold-separator gold-separator--strong" />

      {/* ══════════════════════════════════
          À PROPOS
      ══════════════════════════════════ */}
      <section id="quisuisje" style={{ padding: "var(--section-pad) 0", background: "var(--color-bg-alt)" }}>
        <div className="container">
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
              <SectionLabel>À propos</SectionLabel>
              <h2 style={{ ...S.displayFont, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 0.9, color: "var(--color-text)" }}>
                Qui suis-je <span style={{ background: "linear-gradient(135deg, #5B8AFF, #93B8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>vraiment</span> ?
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem", alignItems: "start" }}>

            {/* Carte identité */}
            <FadeIn delay={0.05}>
              <div className="deco-corners" style={{ border: "1px solid var(--color-border)", padding: "2rem", background: "rgba(59,111,232,0.03)", borderRadius: 4, height: "100%" }}>
                <div style={{ ...S.displayFont, fontSize: "2rem", letterSpacing: "0.06em", lineHeight: 1,
                  background: "linear-gradient(135deg, #5B8AFF, #93B8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  marginBottom: "0.4rem" }}>Le Don</div>
                <div style={{ fontSize: "0.64rem", letterSpacing: "0.2em", color: "var(--color-text-faint)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  Identité · Dakar, Sénégal
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {ABOUT_FACTS.map(({ key, val }) => (
                    <div key={key} style={{ display: "flex", gap: "1rem", paddingBottom: "0.65rem", borderBottom: "1px solid rgba(59,111,232,0.07)" }}>
                      <span style={{ ...S.displayFont, fontSize: "0.64rem", letterSpacing: "0.14em", color: "rgba(107,147,255,0.5)", textTransform: "uppercase", minWidth: 72, flexShrink: 0, paddingTop: 2 }}>
                        {key}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 300, lineHeight: 1.5 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Bio texte */}
            <FadeIn delay={0.12}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", color: "var(--color-text-muted)", fontSize: "0.92rem", lineHeight: 1.9, fontWeight: 300 }}>
                <p>
                  Je suis <strong style={{ color: "var(--color-text)", fontWeight: 500 }}>Mbaitadjim Abba Serge</strong>,
                  connu sous le nom de <strong style={{ color: "var(--color-blue-light)", fontWeight: 500 }}>« Le Don »</strong> — une
                  référence à ma philosophie : l&apos;excellence comme don naturel cultivé par le travail.
                </p>
                <p>
                  Titulaire d&apos;un <span style={{ color: "var(--color-blue-light)" }}>Master en Big Data & Data Stratégie</span> de
                  l&apos;ISM Digital Campus de Dakar, je combine analyse de données, intelligence artificielle générative et création de contenu.
                </p>
                <p>
                  Passionné de <span style={{ color: "var(--color-text)" }}>jeux vidéo</span>, d&apos;
                  <span style={{ color: "var(--color-blue-light)" }}>IA générative</span> et de systèmes — Windows, Linux, architecture machine.
                  Je crée du contenu gaming sur TikTok et YouTube, et utilise l&apos;IA au quotidien pour produire visuels, musique et vidéos.
                </p>
                <p>
                  Mon objectif : contribuer à des projets à fort impact, à l&apos;intersection de la{" "}
                  <span style={{ color: "var(--color-blue-light)" }}>data</span>, de l&apos;
                  <span style={{ color: "var(--color-blue-light)" }}>IA</span> et du{" "}
                  <span style={{ color: "var(--color-blue-light)" }}>digital</span>.
                </p>
              </div>
            </FadeIn>

            {/* Chiffres clés */}
            <FadeIn delay={0.18}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { val: "Master", label: "Big Data & Data Stratégie", accent: true },
                  { val: "Licence", label: "Informatique de Gestion", accent: false },
                  { val: "1 an+", label: "Expérience professionnelle", accent: true },
                  { val: "Créateur", label: "Contenu gaming & IA", accent: false },
                ].map(({ val, label, accent }, i) => (
                  <motion.div key={label}
                    style={{ padding: "1.1rem 1.4rem", border: `1px solid ${accent ? "rgba(59,111,232,0.2)" : "rgba(255,255,255,0.05)"}`,
                      background: accent ? "rgba(59,111,232,0.06)" : "var(--color-surface)", position: "relative", overflow: "hidden", borderRadius: 4 }}
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ x: 4 }}>
                    {accent && <div style={{ position: "absolute", top: 0, left: 0, width: 28, height: 2, background: "linear-gradient(90deg, var(--color-blue), var(--color-blue-light))", borderRadius: "0 0 2px 0" }} />}
                    <div style={{ ...S.displayFont, fontSize: "1.5rem", color: accent ? "var(--color-blue-light)" : "var(--color-text)", letterSpacing: "0.05em", lineHeight: 1, marginBottom: "0.25rem" }}>{val}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-text-faint)", lineHeight: 1.5 }}>{label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="gold-separator" />

      {/* ══════════════════════════════════
          COMPÉTENCES
      ══════════════════════════════════ */}
      <section id="competences" style={{ padding: "var(--section-pad) 0" }}>
        <div className="container">
          <FadeIn>
            <SectionLabel>Savoir-faire</SectionLabel>
            <h2 style={{ ...S.displayFont, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 0.9, color: "var(--color-text)", marginBottom: "4rem" }}>
              Compé<span style={{ background: "linear-gradient(135deg, #5B8AFF, #93B8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>tences</span>
            </h2>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3.5rem", marginBottom: "4rem" }}>
            <FadeIn delay={0.08}>
              <p style={{ ...S.displayFont, fontSize: "0.68rem", letterSpacing: "0.28em", color: "rgba(107,147,255,0.4)", textTransform: "uppercase", marginBottom: "1.75rem" }}>Data & Analyse</p>
              {SKILL_BARS.data.map((s) => <SkillBar key={s.label} {...s} />)}
            </FadeIn>
            <FadeIn delay={0.16}>
              <p style={{ ...S.displayFont, fontSize: "0.68rem", letterSpacing: "0.28em", color: "rgba(107,147,255,0.4)", textTransform: "uppercase", marginBottom: "1.75rem" }}>Créatif & No-Code</p>
              {SKILL_BARS.creative.map((s) => <SkillBar key={s.label} accent={s.accent} label={s.label} level={s.level} />)}
            </FadeIn>
          </div>

          {/* Tag grid */}
          <FadeIn delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "rgba(59,111,232,0.1)", borderRadius: 4, overflow: "hidden" }}>
              {SKILL_CATEGORIES.map((card, i) => (
                <motion.div key={card.title}
                  style={{ padding: "1.6rem", background: "var(--color-bg)" }}
                  whileHover={{ background: "rgba(59,111,232,0.04)" }}
                  transition={{ duration: 0.22 }}>
                  <div style={{ ...S.displayFont, fontSize: "0.68rem", letterSpacing: "0.2em", color: "var(--color-blue-light)", textTransform: "uppercase", marginBottom: "0.9rem" }}>
                    {String(i + 1).padStart(2, "0")} · {card.title}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {card.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="gold-separator" />

      {/* ══════════════════════════════════
          RÉALISATIONS
      ══════════════════════════════════ */}
      <section id="realisations" style={{ padding: "var(--section-pad) 0", background: "var(--color-bg-alt)", position: "relative", overflow: "hidden" }}>
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,111,232,0.07) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <FadeIn>
            <SectionLabel>Créations</SectionLabel>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
              <h2 style={{ ...S.displayFont, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 0.9, color: "var(--color-text)" }}>
                Mes<br /><span style={{ background: "linear-gradient(135deg, #5B8AFF, #93B8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Réalisations</span>
              </h2>
              <p style={{ maxWidth: 280, color: "var(--color-text-faint)", fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.7 }}>
                Visuels gaming, créations Canva et contenus IA générés.
              </p>
            </div>
          </FadeIn>

          {/* Filtres */}
          <FadeIn delay={0.08}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }} role="tablist">
              {FILTER_CATEGORIES.map((cat) => (
                <motion.button key={cat} role="tab" aria-selected={filter === cat} onClick={() => setFilter(cat)}
                  style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.02em",
                    padding: "0.55rem 1.25rem",
                    background: filter === cat ? "linear-gradient(135deg, var(--color-blue-dark), var(--color-blue))" : "transparent",
                    color: filter === cat ? "#fff" : "var(--color-text-muted)",
                    border: `1px solid ${filter === cat ? "transparent" : "rgba(59,111,232,0.2)"}`,
                    cursor: "pointer", borderRadius: 6, transition: "all 0.2s",
                    boxShadow: filter === cat ? "0 0 20px rgba(59,111,232,0.3)" : "none" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {cat}
                </motion.button>
              ))}
            </div>
          </FadeIn>

          {/* Grille projets */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {projetsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ border: "1px solid rgba(59,111,232,0.1)", background: "var(--color-surface)", height: 340, borderRadius: 8 }}>
                    <div style={{ height: 200, background: "rgba(59,111,232,0.04)", borderRadius: "8px 8px 0 0" }} />
                    <div style={{ padding: "1.25rem" }}>
                      <div style={{ height: 14, width: "70%", background: "rgba(59,111,232,0.08)", marginBottom: 10, borderRadius: 3 }} />
                      <div style={{ height: 11, background: "rgba(59,111,232,0.05)", marginBottom: 6, borderRadius: 3 }} />
                      <div style={{ height: 11, width: "55%", background: "rgba(59,111,232,0.05)", borderRadius: 3 }} />
                    </div>
                  </div>
                ))
              : filteredProjets.map((p, i) => (
                  <FadeIn key={p.src} delay={i * 0.06}>
                    <article className="card-hover"
                      style={{ border: "1px solid rgba(59,111,232,0.12)", background: "var(--color-bg-card)", overflow: "hidden", display: "flex", flexDirection: "column", borderRadius: 8 }}>
                      <button onClick={() => setLightbox(p.src)} aria-label={`Voir ${p.titre} en grand`}
                        style={{ position: "relative", height: 200, background: "rgba(59,111,232,0.04)", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, overflow: "hidden" }}>
                        <Image src={p.src} alt={p.titre} fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
                        <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(11,15,26,0.85)", padding: "0.18rem 0.5rem", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.14em", color: "var(--color-blue-light)" }}>
                          {padIndex(i + 1, filteredProjets.length)} / {padIndex(filteredProjets.length, filteredProjets.length)}
                        </div>
                        <div style={{ position: "absolute", top: 10, right: 10, background: "linear-gradient(135deg, var(--color-blue-dark), var(--color-blue))", padding: "0.18rem 0.6rem", borderRadius: 3, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.6rem", letterSpacing: "0.06em", color: "#fff" }}>
                          {p.cat}
                        </div>
                      </button>

                      <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                        <h3 style={{ ...S.displayFont, fontSize: "1.05rem", letterSpacing: "0.05em", color: "var(--color-text)", marginBottom: "0.45rem" }}>{p.titre}</h3>
                        <p style={{ fontSize: "0.76rem", color: "var(--color-text-faint)", lineHeight: 1.7, fontWeight: 300, flex: 1, marginBottom: "0.8rem" }}>{p.desc}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.8rem" }}>
                          {p.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(59,111,232,0.1)" }}>
                          <motion.button onClick={() => setLightbox(p.src)}
                            style={{ flex: 1, fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.72rem", padding: "0.58rem", background: "transparent", border: "1px solid rgba(59,111,232,0.2)", color: "var(--color-text-muted)", cursor: "pointer", borderRadius: 5 }}
                            whileHover={{ borderColor: "var(--color-blue)", color: "var(--color-blue-light)" }}>
                            Voir
                          </motion.button>
                          {p.lien && (
                            <motion.a href={p.lien} target="_blank" rel="noopener noreferrer"
                              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.72rem", padding: "0.58rem", background: "var(--color-blue-dim)", border: "1px solid rgba(59,111,232,0.25)", color: "var(--color-blue-light)", cursor: "pointer", textDecoration: "none", borderRadius: 5 }}
                              whileHover={{ background: "rgba(59,111,232,0.2)", borderColor: "var(--color-blue)" }}>
                              {p.lienLabel ?? "Voir le projet"}
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </article>
                  </FadeIn>
                ))}
          </div>

          {!projetsLoading && filteredProjets.length === 0 && (
            <FadeIn>
              <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--color-text-muted)", fontSize: "1.1rem" }}>
                Aucune réalisation dans cette catégorie.
              </div>
            </FadeIn>
          )}
        </div>

        <AnimatePresence>
          {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
        </AnimatePresence>
      </section>

      <div className="gold-separator" />

      {/* ══════════════════════════════════
          EXPÉRIENCE
      ══════════════════════════════════ */}
      <section id="experience" style={{ padding: "var(--section-pad) 0" }}>
        <div className="container">
          <FadeIn>
            <SectionLabel>Parcours</SectionLabel>
            <h2 style={{ ...S.displayFont, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 0.9, color: "var(--color-text)", marginBottom: "4rem" }}>
              Expérience &<br />
              <span style={{ background: "linear-gradient(135deg, #5B8AFF, #93B8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Formation</span>
            </h2>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {EXPERIENCES.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.article
                  style={{ padding: "2.25rem clamp(1.5rem, 4vw, 2.5rem)", background: "var(--color-surface)",
                    borderLeft: `3px solid ${item.type === "work" ? "var(--color-blue)" : "rgba(59,111,232,0.2)"}`,
                    position: "relative", overflow: "hidden",
                    borderRadius: "0 4px 4px 0" }}
                  whileHover={{ background: "rgba(59,111,232,0.03)" }}>

                  <div aria-hidden="true" style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", ...S.displayFont, fontSize: "5rem", color: "rgba(59,111,232,0.04)", lineHeight: 1, userSelect: "none" }}>
                    {item.index}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "0.85rem", position: "relative" }}>
                    <div>
                      <div style={{ ...S.displayFont, fontSize: "0.62rem", letterSpacing: "0.2em", color: item.type === "work" ? "var(--color-blue-light)" : "rgba(107,147,255,0.4)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                        {item.index} · {item.type === "work" ? "Expérience" : "Formation"} · {item.org}
                      </div>
                      <h3 style={{ ...S.displayFont, fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)", letterSpacing: "0.03em", color: "var(--color-text)" }}>
                        {item.title}
                      </h3>
                    </div>
                    <time style={{ ...S.displayFont, fontSize: "0.62rem", letterSpacing: "0.18em", color: "var(--color-text-faint)", border: "1px solid rgba(59,111,232,0.15)", padding: "0.28rem 0.75rem", flexShrink: 0, alignSelf: "flex-start", borderRadius: 3 }}>
                      {item.date}
                    </time>
                  </div>

                  {item.items && (
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "0.85rem", position: "relative" }}>
                      {item.items.map((li) => (
                        <li key={li} style={{ display: "flex", gap: "0.85rem", marginBottom: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: 300, lineHeight: 1.65 }}>
                          <span style={{ color: "var(--color-blue)", flexShrink: 0, marginTop: 1 }} aria-hidden="true">—</span>
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.desc && (
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.8, fontWeight: 300, maxWidth: 640, position: "relative" }}>{item.desc}</p>
                  )}

                  {item.tags && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1rem", position: "relative" }}>
                      {item.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                    </div>
                  )}
                </motion.article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-separator" />

      {/* ══════════════════════════════════
          CONTACT
      ══════════════════════════════════ */}
      <section id="contact" style={{ padding: "var(--section-pad) 0", background: "var(--color-bg-alt)" }}>
        <div className="container">
          <FadeIn>
            <SectionLabel>Parlons-en</SectionLabel>
            <h2 style={{ ...S.displayFont, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 0.9, color: "var(--color-text)", marginBottom: "0.75rem" }}>
              Travaillons<br />
              <span style={{ background: "linear-gradient(135deg, #5B8AFF, #93B8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ensemble</span>
            </h2>
            <p style={{ color: "var(--color-text-faint)", fontWeight: 300, fontSize: "0.9rem", marginBottom: "4rem", maxWidth: 420 }}>
              Un projet, une opportunité, une question ? Je réponds rapidement depuis Dakar.
            </p>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start" }}>

            {/* Liens contact */}
            <FadeIn delay={0.08}>
              <address style={{ fontStyle: "normal", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {CONTACT_LINKS.map(({ label, value, href, icon }, i) => (
                  <motion.a key={label} href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.85rem 1rem", border: "1px solid rgba(59,111,232,0.12)", background: "var(--color-surface)", textDecoration: "none", borderRadius: 6, transition: "all 0.22s" }}
                    whileHover={{ x: 5, borderColor: "rgba(59,111,232,0.35)", background: "rgba(59,111,232,0.05)" }}>
                    <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-blue-dim)", border: "1px solid rgba(59,111,232,0.2)", color: "var(--color-blue-light)", fontFamily: "var(--font-display)", fontSize: "0.72rem", flexShrink: 0, borderRadius: 6 }}>
                      {icon ?? padIndex(i + 1, CONTACT_LINKS.length)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...S.displayFont, fontSize: "0.57rem", letterSpacing: "0.2em", color: "var(--color-text-faint)", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                    </div>
                    <span style={{ color: "rgba(107,147,255,0.4)", fontSize: "0.8rem" }} aria-hidden="true">→</span>
                  </motion.a>
                ))}

                <motion.a href="/cv.pdf" download className="gold-btn"
                  style={{ padding: "1rem", marginTop: "0.5rem", fontSize: "0.85rem" }}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  ↓ Télécharger le CV (PDF)
                </motion.a>
              </address>
            </FadeIn>

            {/* Formulaire */}
            <FadeIn delay={0.16}>
              <div className="deco-corners" style={{ border: "1px solid rgba(59,111,232,0.15)", padding: "clamp(1.5rem, 4vw, 2.25rem)", background: "rgba(59,111,232,0.03)", borderRadius: 4 }}>
                <div style={{ ...S.displayFont, fontSize: "1.1rem", letterSpacing: "0.1em", color: "var(--color-text)", marginBottom: "1.6rem" }}>
                  Envoyer un message
                </div>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="gold-separator" />
      <footer style={{ padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ ...S.displayFont, fontSize: "0.62rem", letterSpacing: "0.26em", color: "var(--color-text-faint)", textTransform: "uppercase" }}>
            © {new Date().getFullYear()} · Mbaitadjim Abba Serge — Le Don
          </div>
          <div style={{ ...S.displayFont, fontSize: "0.62rem", letterSpacing: "0.26em", color: "rgba(59,111,232,0.3)", textTransform: "uppercase" }}>
            Next.js · Tailwind · Framer Motion
          </div>
        </div>
      </footer>

    </main>
  );
}