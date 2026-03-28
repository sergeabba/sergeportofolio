"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

/* ── Composants ── */
import TypeWriter from "@/components/TypeWriter";
import FadeIn from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import SkillBar from "@/components/SkillBar";
import Lightbox from "@/components/Lightbox";
import ContactForm from "@/components/ContactForm";

/* ── Données & utilitaires ── */
import {
  NAV_LINKS,
  HERO_ROLES,
  SKILL_CATEGORIES,
  EXPERIENCES,
  CONTACT_LINKS,
  FILTER_CATEGORIES,
} from "@/lib/data";
import { smoothScrollTo, padIndex } from "@/lib/utils";
import type { Projet } from "@/lib/types";

/* ══════════════════════════════════════════════════════ */
export default function Home() {
  /* ── State ── */
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [projetsLoading, setProjetsLoading] = useState(true);

  /* ── Refs ── */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* ── Chargement projets ── */
  useEffect(() => {
    fetch("/projets/data.json")
      .then((r) => {
        if (!r.ok) throw new Error("Échec du chargement");
        return r.json();
      })
      .then((data: Projet[]) => {
        setProjets(data);
        setProjetsLoading(false);
      })
      .catch(() => {
        setProjets([]);
        setProjetsLoading(false);
      });
  }, []);

  /* ── Scroll listener ── */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* ── Fermer menu mobile au resize ── */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* ── Projets filtrés ── */
  const filteredProjets =
    filter === "Tous" ? projets : projets.filter((p) => p.cat === filter);

  return (
    <main className="grain-overlay" style={{ cursor: "default" }}>
      {/* ══════ NAVIGATION ══════ */}
      <motion.nav
        className="fixed top-0 w-full z-50"
        style={{
          background: scrolled ? "rgba(3,2,10,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
          transition: "all 0.6s ease",
        }}
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex justify-between items-center">
          {/* Logo */}
          <motion.button
            className="flex items-center gap-3 bg-transparent border-none cursor-pointer"
            onClick={() => smoothScrollTo("bio")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            aria-label="Retour en haut"
          >
            <div
              className="w-[38px] h-[38px] flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold-light))",
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                color: "var(--color-bg)",
                letterSpacing: "0.05em",
              }}
            >
              S
            </div>
            <div>
              <div
                className="leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  letterSpacing: "0.12em",
                  color: "var(--color-text)",
                }}
              >
                Mbaitadjim{" "}
                <span className="text-[var(--color-gold)]">Abba Serge</span>
              </div>
              <div
                className="mt-px uppercase"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  color: "var(--color-text-faint)",
                }}
              >
                Data · IA · Créateur
              </div>
            </div>
          </motion.button>

          {/* Liens — desktop */}
          <motion.div
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                className="nav-link"
                onClick={() => smoothScrollTo(id)}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* CTA — desktop */}
          <motion.a
            href="/cv.pdf"
            download
            className="hidden md:block gold-btn px-6 py-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Télécharger CV
          </motion.a>

          {/* Burger — mobile */}
          <button
            className="md:hidden flex flex-col gap-[7px] p-2 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block w-[22px] h-px"
                style={{ background: "var(--color-gold)" }}
                animate={
                  menuOpen
                    ? i === 1
                      ? { opacity: 0 }
                      : i === 0
                        ? { rotate: 45, y: 8 }
                        : { rotate: -45, y: -8 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.3 }}
              />
            ))}
          </button>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden md:hidden"
              style={{
                background: "rgba(3,2,10,0.98)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div className="px-8 py-6 flex flex-col gap-5">
                {NAV_LINKS.map(({ id, label }) => (
                  <button
                    key={id}
                    className="nav-link text-left text-xl"
                    onClick={() => {
                      smoothScrollTo(id);
                      setMenuOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
                <a href="/cv.pdf" download className="gold-btn px-6 py-3 text-center mt-2">
                  Télécharger CV
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════ HERO ══════ */}
      <section
        id="bio"
        ref={heroRef}
        className="relative min-h-screen flex items-end overflow-hidden"
      >
        {/* Image de fond — parallaxe */}
<motion.div className="absolute inset-0" style={{ y: heroImgY }}>
  <div className="absolute inset-0" style={{ height: "110%", position: "relative" }}>
    <Image
      src="/zelda-bg.jpg"
      alt=""
      fill
      sizes="100vw"
      priority
      className="object-cover"
      style={{
        opacity: 0.3,
        filter: "saturate(0.6) sepia(0.3)",
      }}
    />
  </div>
</motion.div>

        {/* Dégradés */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(3,2,10,0.98) 35%, rgba(3,2,10,0.65) 70%, rgba(3,2,10,0.85) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(3,2,10,1) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(3,2,10,0.6) 0%, transparent 20%)",
          }}
        />

        {/* Glow or */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "10%",
            left: "5%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(201,168,92,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Numéro décoratif */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block select-none"
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20rem",
            lineHeight: 1,
            color: "rgba(201,168,92,0.03)",
            letterSpacing: "-0.05em",
          }}
        >
          01
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-6 md:px-8 pb-24 pt-40 w-full relative z-10"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge disponible */}
            <motion.div
              className="inline-flex items-center gap-2.5 mb-10"
              style={{
                background: "rgba(201,168,92,0.07)",
                border: "1px solid var(--color-border)",
                borderRadius: "1px",
                padding: "0.4rem 1rem",
              }}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span
                className="animate-pulse-slow inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "#4ade80" }}
                aria-hidden="true"
              />
              <span
                className="uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  color: "var(--color-text-muted)",
                }}
              >
                Disponible · Dakar, Sénégal
              </span>
            </motion.div>

            {/* Titre */}
            <header className="mb-6">
              <motion.div
                className="uppercase mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1rem, 2vw, 1.4rem)",
                  letterSpacing: "0.5em",
                  color: "rgba(201,168,92,0.5)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Je suis
              </motion.div>
              <motion.h1
                style={{
                  fontFamily: "var(--font-display)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.01em",
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span
                  className="block"
                  style={{
                    fontSize: "clamp(4rem, 10vw, 9.5rem)",
                    color: "var(--color-text)",
                  }}
                >
                  Mbaitadjim
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: "clamp(4rem, 10vw, 9.5rem)",
                    color: "var(--color-gold)",
                  }}
                >
                  Abba Serge
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                    color: "rgba(232,224,208,0.18)",
                    letterSpacing: "0.4em",
                    marginTop: "0.5rem",
                  }}
                >
                  — Le Don —
                </span>
              </motion.h1>
            </header>

            {/* Typewriter */}
            <div
              className="mb-8"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "var(--color-text-muted)",
                fontWeight: 300,
                letterSpacing: "0.02em",
                minHeight: "2rem",
              }}
            >
              <TypeWriter texts={HERO_ROLES} />
            </div>

            <p
              className="mb-12"
              style={{
                maxWidth: "560px",
                color: "rgba(232,224,208,0.45)",
                lineHeight: 1.8,
                fontSize: "0.95rem",
                fontWeight: 300,
              }}
            >
              Master en Big Data & Data Stratégie. Passionné par l'intelligence
              artificielle générative, le gaming et la création de contenu. Je
              transforme la donnée en décisions, et les idées en produits.
            </p>

            <div className="flex gap-4 flex-wrap mb-16">
              <button
                className="gold-btn px-8 py-4"
                onClick={() => smoothScrollTo("experience")}
              >
                Voir mon parcours →
              </button>
              <button
                className="ghost-btn px-8 py-4"
                onClick={() => smoothScrollTo("contact")}
              >
                Me contacter
              </button>
            </div>

            {/* Stats */}
            <div
              className="flex gap-12 flex-wrap pt-7"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              {[
                { val: "Master", sub: "Big Data & IA" },
                { val: "1 an", sub: "Expérience pro" },
                { val: "3+", sub: "Projets livrés" },
              ].map(({ val, sub }) => (
                <div key={sub}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      color: "var(--color-gold)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    className="uppercase mt-0.5"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      color: "var(--color-text-faint)",
                    }}
                  >
                    {sub}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          aria-hidden="true"
        >
          <div
            className="mx-auto"
            style={{
              width: "1px",
              height: "50px",
              background:
                "linear-gradient(to bottom, var(--color-gold), transparent)",
            }}
          />
        </motion.div>
      </section>

      <div className="gold-separator gold-separator--strong" />

      {/* ══════ QUI SUIS-JE ══════ */}
      <section
        id="quisuisje"
        className="py-36"
        style={{ background: "var(--color-bg-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            {/* Colonne gauche */}
            <div className="lg:col-span-5">
              <FadeIn>
                <SectionLabel>À propos</SectionLabel>
                <h2
                  className="mb-10"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(3rem, 6vw, 5.5rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.01em",
                    color: "var(--color-text)",
                  }}
                >
                  Qui
                  <br />
                  <span className="text-[var(--color-gold)]">suis-je</span>
                  <br />
                  vraiment ?
                </h2>
              </FadeIn>

              {/* Carte identité */}
              <FadeIn delay={0.15}>
                <div
                  className="decorative-corners"
                  style={{
                    border: "1px solid var(--color-border)",
                    padding: "1.75rem",
                    background: "rgba(201,168,92,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.5rem",
                      color: "var(--color-gold)",
                      letterSpacing: "0.05em",
                      lineHeight: 1,
                    }}
                  >
                    Le Don
                  </div>
                  <div
                    className="uppercase"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.2em",
                      color: "var(--color-text-faint)",
                      margin: "0.5rem 0 1.25rem",
                    }}
                  >
                    Identité · Dakar, Sénégal
                  </div>

                  {[
                    { key: "Formation", val: "Master Big Data & Data Stratégie" },
                    { key: "École", val: "ISM Digital Campus" },
                    { key: "Stack", val: "Python · SQL · Power BI · IA Gen" },
                    { key: "Passion", val: "Gaming · IA · Création de contenu" },
                  ].map(({ key, val }) => (
                    <div
                      key={key}
                      className="flex gap-4 mb-2.5 pb-2.5"
                      style={{
                        borderBottom: "1px solid rgba(201,168,92,0.07)",
                      }}
                    >
                      <span
                        className="uppercase shrink-0 pt-px"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.7rem",
                          letterSpacing: "0.15em",
                          color: "rgba(201,168,92,0.5)",
                          minWidth: "80px",
                        }}
                      >
                        {key}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(232,224,208,0.6)",
                          fontWeight: 300,
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Colonne droite */}
            <div className="lg:col-span-7">
              <FadeIn delay={0.2}>
                <div
                  className="space-y-6"
                  style={{
                    color: "rgba(232,224,208,0.5)",
                    fontSize: "1rem",
                    lineHeight: 1.85,
                    fontWeight: 300,
                  }}
                >
                  <p>
                    Je suis{" "}
                    <strong className="text-[var(--color-text)] font-medium">
                      Mbaitadjim Abba Serge
                    </strong>
                    , connu sous le nom de{" "}
                    <strong className="text-[var(--color-gold)] font-medium">
                      « Le Don »
                    </strong>{" "}
                    — une référence à ma philosophie : l'excellence comme don
                    naturel cultivé par le travail.
                  </p>
                  <p>
                    Titulaire d'une{" "}
                    <span className="text-[rgba(232,224,208,0.8)]">
                      Licence en Informatique Appliquée à la Gestion
                    </span>{" "}
                    et d'un{" "}
                    <span className="text-[var(--color-gold)]">
                      Master en Big Data & Data Stratégie
                    </span>{" "}
                    de l'ISM Digital Campus de Dakar.
                  </p>
                  <p>
                    Passionné de{" "}
                    <span className="text-[rgba(232,224,208,0.8)]">
                      jeux vidéo
                    </span>
                    , d'
                    <span className="text-[var(--color-gold)]">
                      intelligence artificielle générative
                    </span>{" "}
                    et de systèmes — Windows, Linux, architecture machine. Je
                    crée du contenu gaming sur TikTok et YouTube, et utilise l'IA
                    au quotidien pour produire visuels, musique et vidéos.
                  </p>
                  <p>
                    Mon objectif : contribuer à des projets à fort impact, à
                    l'intersection de la{" "}
                    <span className="text-[var(--color-gold)]">data</span>, de
                    l'<span className="text-[var(--color-gold)]">IA</span> et du{" "}
                    <span className="text-[var(--color-gold)]">digital</span>.
                  </p>
                </div>
              </FadeIn>

              {/* Stats grid */}
              <FadeIn delay={0.3}>
                <div className="grid grid-cols-2 gap-4 mt-12">
                  {[
                    { val: "Master", label: "Big Data & Data Stratégie", accent: true },
                    { val: "1 an", label: "Expérience professionnelle", accent: false },
                    { val: "Licence", label: "Informatique de gestion", accent: false },
                    { val: "Créateur", label: "Contenu gaming & IA", accent: true },
                  ].map(({ val, label, accent }, i) => (
                    <motion.div
                      key={label}
                      className="p-6 relative"
                      style={{
                        border: `1px solid ${accent ? "var(--color-border)" : "rgba(255,255,255,0.05)"}`,
                        background: accent
                          ? "rgba(201,168,92,0.04)"
                          : "var(--color-surface)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -3 }}
                    >
                      {accent && (
                        <div
                          className="absolute top-0 left-0 w-6 h-px"
                          style={{ background: "var(--color-gold)" }}
                        />
                      )}
                      <div
                        className="mb-2"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "2rem",
                          color: accent
                            ? "var(--color-gold)"
                            : "var(--color-text)",
                          letterSpacing: "0.05em",
                          lineHeight: 1,
                        }}
                      >
                        {val}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--color-text-faint)",
                          letterSpacing: "0.05em",
                          lineHeight: 1.5,
                        }}
                      >
                        {label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <div className="gold-separator" />

      {/* ══════ COMPÉTENCES ══════ */}
      <section id="competences" className="py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <FadeIn>
            <SectionLabel>Savoir-faire</SectionLabel>
            <h2
              className="mb-20"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                lineHeight: 0.9,
                color: "var(--color-text)",
              }}
            >
              Compé<span className="text-[var(--color-gold)]">tences</span>
            </h2>
          </FadeIn>

          {/* Barres de compétences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <FadeIn delay={0.1}>
              <div
                className="uppercase mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  color: "rgba(201,168,92,0.4)",
                }}
              >
                Data & Analyse
              </div>
              <SkillBar label="Power BI" level={85} />
              <SkillBar label="Python & Pandas" level={75} />
              <SkillBar label="SQL" level={75} />
              <SkillBar label="Excel / Google Sheets" level={85} />
              <SkillBar label="Big Data — Spark, PySpark" level={65} />
            </FadeIn>
            <FadeIn delay={0.2}>
              <div
                className="uppercase mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  color: "rgba(201,168,92,0.4)",
                }}
              >
                Créatif & No-Code
              </div>
              <SkillBar label="IA Générative & Prompt Engineering" level={92} accent />
              <SkillBar label="Canva / Photoshop / Illustrator" level={85} accent />
              <SkillBar label="WordPress" level={82} accent />
              <SkillBar label="Figma / Adobe XD" level={75} accent />
              <SkillBar label="Windows / Linux (usage avancé)" level={80} accent />
            </FadeIn>
          </div>

          {/* Tag cloud */}
          <FadeIn delay={0.1}>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ border: "1px solid var(--color-border)" }}
            >
              {SKILL_CATEGORIES.map((card, i) => (
                <motion.div
                  key={card.title}
                  className="p-8"
                  style={{
                    background: "var(--color-surface)",
                    borderRight: "1px solid var(--color-border)",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                  whileHover={{ background: "rgba(201,168,92,0.04)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="uppercase mb-5"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.2em",
                      color: "var(--color-gold)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")} · {card.title}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((t) => (
                      <span key={t} className="tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="gold-separator" />

      {/* ══════ RÉALISATIONS ══════ */}
      <section
        id="realisations"
        className="py-36 relative overflow-clip"
        style={{ background: "var(--color-bg-alt)" }}
      >
        {/* Grid décoratif */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            opacity: 0.4,
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          aria-hidden="true"
          style={{
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(201,168,92,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <FadeIn>
            <SectionLabel>Créations</SectionLabel>
            <div className="flex justify-between items-end mb-12 flex-wrap gap-6">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  lineHeight: 0.9,
                  color: "var(--color-text)",
                }}
              >
                Mes
                <br />
                <span className="text-[var(--color-gold)]">Réalisations</span>
              </h2>
              <p
                style={{
                  maxWidth: "320px",
                  color: "var(--color-text-faint)",
                  fontSize: "0.875rem",
                  fontWeight: 300,
                  lineHeight: 1.7,
                }}
              >
                Visuels gaming, créations Canva et contenus IA générés.
              </p>
            </div>
          </FadeIn>

          {/* Filtres */}
          <FadeIn delay={0.1}>
            <div className="flex gap-2 flex-wrap mb-12" role="tablist" aria-label="Filtrer les projets">
              {FILTER_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  role="tab"
                  aria-selected={filter === cat}
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    padding: "0.6rem 1.5rem",
                    background:
                      filter === cat ? "var(--color-gold)" : "transparent",
                    color:
                      filter === cat
                        ? "var(--color-bg)"
                        : "var(--color-text-muted)",
                    border: `1px solid ${filter === cat ? "var(--color-gold)" : "var(--color-border)"}`,
                    cursor: "pointer",
                    borderRadius: "1px",
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </FadeIn>

          {/* Grille projets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projetsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse"
                    style={{
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      height: "380px",
                    }}
                  >
                    <div
                      className="h-[220px]"
                      style={{ background: "rgba(201,168,92,0.04)" }}
                    />
                    <div className="p-6 space-y-3">
                      <div
                        className="h-4 w-3/4 rounded"
                        style={{ background: "rgba(201,168,92,0.08)" }}
                      />
                      <div
                        className="h-3 w-full rounded"
                        style={{ background: "rgba(201,168,92,0.05)" }}
                      />
                      <div
                        className="h-3 w-1/2 rounded"
                        style={{ background: "rgba(201,168,92,0.05)" }}
                      />
                    </div>
                  </div>
                ))
              : filteredProjets.map((p, i) => (
                  <FadeIn key={p.src} delay={i * 0.07}>
                    <article
                      className="card-hover flex flex-col"
                      style={{
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Image */}
                      <button
                        className="relative h-[220px] overflow-hidden bg-transparent border-none p-0 cursor-pointer"
                        style={{ background: "rgba(201,168,92,0.04)" }}
                        onClick={() => setLightbox(p.src)}
                        aria-label={`Voir ${p.titre} en grand`}
                      >
                        <Image
                          src={p.src}
                          alt={p.titre}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        {/* Index */}
                        <div
                          className="absolute top-3 left-3"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.15em",
                            color: "var(--color-gold)",
                            background: "rgba(3,2,10,0.8)",
                            padding: "0.2rem 0.5rem",
                          }}
                        >
                          {padIndex(i + 1, filteredProjets.length)} /{" "}
                          {padIndex(filteredProjets.length, filteredProjets.length)}
                        </div>
                        {/* Catégorie */}
                        <div
                          className="absolute top-3 right-3"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.15em",
                            color: "var(--color-bg)",
                            background: "var(--color-gold)",
                            padding: "0.2rem 0.6rem",
                          }}
                        >
                          {p.cat}
                        </div>
                      </button>

                      {/* Contenu */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3
                          className="mb-2"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.2rem",
                            letterSpacing: "0.05em",
                            color: "var(--color-text)",
                          }}
                        >
                          {p.titre}
                        </h3>
                        <p
                          className="flex-1 mb-4"
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--color-text-faint)",
                            lineHeight: 1.7,
                            fontWeight: 300,
                          }}
                        >
                          {p.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.tags.map((t) => (
                            <span key={t} className="tag-pill">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div
                          className="flex gap-2 pt-4"
                          style={{
                            borderTop: "1px solid var(--color-border)",
                          }}
                        >
                          <motion.button
                            className="flex-1 uppercase"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "0.7rem",
                              letterSpacing: "0.15em",
                              padding: "0.6rem",
                              background: "transparent",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-text-muted)",
                              cursor: "pointer",
                            }}
                            whileHover={{
                              borderColor: "var(--color-gold)",
                              color: "var(--color-gold)",
                            }}
                            onClick={() => setLightbox(p.src)}
                          >
                            Voir
                          </motion.button>
                          {p.lien && (
                            <motion.a
                              href={p.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center no-underline uppercase"
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.15em",
                                padding: "0.6rem",
                                background: "var(--color-gold-dim)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-gold)",
                                cursor: "pointer",
                              }}
                              whileHover={{
                                background: "rgba(201,168,92,0.2)",
                                borderColor: "var(--color-gold)",
                              }}
                            >
                              {p.lienLabel}
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </article>
                  </FadeIn>
                ))}
          </div>

          {/* Message si aucun résultat */}
          {!projetsLoading && filteredProjets.length === 0 && (
            <FadeIn>
              <div
                className="text-center py-20"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  letterSpacing: "0.1em",
                }}
              >
                Aucune réalisation dans cette catégorie.
              </div>
            </FadeIn>
          )}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
          )}
        </AnimatePresence>
      </section>

      <div className="gold-separator" />

      {/* ══════ EXPÉRIENCE ══════ */}
      <section id="experience" className="py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <FadeIn>
            <SectionLabel>Parcours</SectionLabel>
            <h2
              className="mb-20"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                lineHeight: 0.9,
                color: "var(--color-text)",
              }}
            >
              Expérience &
              <br />
              <span className="text-[var(--color-gold)]">Formation</span>
            </h2>
          </FadeIn>

          <div
            className="flex flex-col gap-px"
            style={{ border: "1px solid var(--color-border)" }}
          >
            {EXPERIENCES.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.article
                  className="relative overflow-hidden p-8 md:p-10"
                  style={{
                    background: "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                  whileHover={{ background: "rgba(201,168,92,0.03)" }}
                >
                  {/* Index décoratif */}
                  <div
                    className="absolute right-8 top-1/2 -translate-y-1/2 select-none"
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "6rem",
                      color: "rgba(201,168,92,0.03)",
                      lineHeight: 1,
                    }}
                  >
                    {item.index}
                  </div>

                  <div className="flex justify-between items-start flex-wrap gap-4 mb-4 relative z-10">
                    <div>
                      <div
                        className="uppercase mb-1"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.2em",
                          color: "var(--color-gold)",
                        }}
                      >
                        {item.index} · {item.org}
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                          letterSpacing: "0.03em",
                          color: "var(--color-text)",
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <time
                      className="shrink-0"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        color: "var(--color-text-faint)",
                        border: "1px solid var(--color-border)",
                        padding: "0.3rem 0.8rem",
                      }}
                    >
                      {item.date}
                    </time>
                  </div>

                  {item.items && (
                    <ul className="relative z-10 list-none p-0 mb-5">
                      {item.items.map((li) => (
                        <li
                          key={li}
                          className="flex gap-4 mb-1.5"
                          style={{
                            fontSize: "0.82rem",
                            color: "var(--color-text-muted)",
                            fontWeight: 300,
                            lineHeight: 1.6,
                          }}
                        >
                          <span
                            className="shrink-0 mt-0.5"
                            style={{ color: "var(--color-gold)" }}
                            aria-hidden="true"
                          >
                            —
                          </span>
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.desc && (
                    <p
                      className="relative z-10"
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--color-text-muted)",
                        lineHeight: 1.75,
                        fontWeight: 300,
                      }}
                    >
                      {item.desc}
                    </p>
                  )}

                  {item.tags && (
                    <div className="flex gap-2 flex-wrap mt-4 relative z-10">
                      {item.tags.map((t) => (
                        <span key={t} className="tag-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-separator" />

      {/* ══════ CONTACT ══════ */}
      <section
        id="contact"
        className="py-36"
        style={{ background: "var(--color-bg-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <FadeIn>
            <SectionLabel>Parlons-en</SectionLabel>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                lineHeight: 0.9,
                color: "var(--color-text)",
              }}
            >
              Travaillons
              <br />
              <span className="text-[var(--color-gold)]">ensemble</span>
            </h2>
            <p
              className="mb-20"
              style={{
                color: "var(--color-text-faint)",
                fontWeight: 300,
                fontSize: "0.95rem",
              }}
            >
              Un projet, une opportunité, une question ? Je réponds rapidement.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Liens de contact */}
            <FadeIn delay={0.1}>
              <address className="not-italic flex flex-col gap-3">
                {CONTACT_LINKS.map(({ label, value, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-5 p-4 no-underline"
                    style={{
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      transition: "all 0.3s",
                    }}
                    whileHover={{
                      x: 4,
                      borderColor: "var(--color-gold)",
                      background: "rgba(201,168,92,0.04)",
                    }}
                  >
                    <div
                      className="w-7 text-center shrink-0"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        color: "var(--color-gold)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {padIndex(i + 1, CONTACT_LINKS.length)}
                    </div>
                    <div
                      className="shrink-0"
                      style={{
                        width: "1px",
                        height: "32px",
                        background: "var(--color-border)",
                      }}
                    />
                    <div>
                      <div
                        className="uppercase mb-0.5"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.2em",
                          color: "var(--color-text-faint)",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "rgba(232,224,208,0.7)",
                          fontWeight: 300,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                    <div
                      className="ml-auto opacity-50"
                      style={{
                        color: "var(--color-gold)",
                        fontSize: "0.9rem",
                      }}
                      aria-hidden="true"
                    >
                      →
                    </div>
                  </motion.a>
                ))}
              </address>
            </FadeIn>

            {/* Formulaire */}
            <FadeIn delay={0.2}>
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <div className="gold-separator" />
      <footer className="py-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div
            className="uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "var(--color-text-faint)",
            }}
          >
            © {new Date().getFullYear()} · Mbaitadjim Abba Serge
          </div>
          <div
            className="uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "rgba(201,168,92,0.3)",
            }}
          >
            Next.js · Tailwind · Framer Motion
          </div>
        </div>
      </footer>
    </main>
  );
}
