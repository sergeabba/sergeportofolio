"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useMemo, useState } from "react";

import FadeIn from "@/components/FadeIn";
import Lightbox from "@/components/Lightbox";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";

import {
  NAV_LINKS,
  SKILL_CATEGORIES,
  SKILL_BARS,
  EXPERIENCES,
  CONTACT_LINKS,
  FILTER_CATEGORIES,
} from "@/lib/data";
import { smoothScrollTo } from "@/lib/utils";
import type { Projet } from "@/lib/types";
import { supabase } from "@/lib/supabase";

/* ── Hero card skill bars ── */
const HERO_SKILLS = [
  { label: "Power BI", val: 85 },
  { label: "Python & Pandas", val: 75 },
  { label: "SQL", val: 75 },
  { label: "IA Générative", val: 92 },
  { label: "Excel / Sheets", val: 88 },
];

/* ── Animated counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      v = Math.min(v + step, target);
      setN(v);
      if (v >= target) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ── Hero card progress bar ── */
function HeroBar({ label, val }: { label: string; val: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  return (
    <div ref={ref} style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
          {val}%
        </span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "#2563EB", borderRadius: "99px" }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${val}%` } : { width: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </div>
    </div>
  );
}

/* ── Project card ── */
function ProjectCard({ projet, index, onOpen }: {
  projet: Projet; index: number; onOpen: (s: string) => void;
}) {
  let safeSrc = projet.src?.trim() || "/projets/gaming/gaming-2.jpg";
  if (!safeSrc.startsWith("/") && !safeSrc.startsWith("http")) {
    safeSrc = "/" + safeSrc;
  }
  safeSrc = safeSrc.replace(/\\/g, "/");

  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-hidden cursor-pointer" style={{ height: 185 }} onClick={() => onOpen(safeSrc)}>
        <Image src={safeSrc} alt={projet.titre} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
          <span className="tag" style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.92)", color: "var(--primary)", border: "1px solid rgba(37,99,235,0.2)", fontWeight: 600 }}>
            {projet.cat}
          </span>
        </div>
      </div>
      <div style={{ padding: "1.1rem 1.25rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "0.4rem" }}>
          {projet.titre}
        </h3>
        <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", lineHeight: 1.6, marginBottom: "0.85rem" }} className="line-clamp-2">
          {projet.desc}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {projet.tags.slice(0, 4).map((t, i) => (
            <span key={t} className={`tag ${i === 1 ? "tag-gray" : i === 2 ? "tag-violet" : ""}`} style={{ fontSize: "0.6rem" }}>{t}</span>
          ))}
        </div>
        <div className="flex gap-2" style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
          <button onClick={() => onOpen(safeSrc)} className="btn-ghost" style={{ flex: 1, padding: "0.45rem", fontSize: "0.75rem" }}>Aperçu</button>
          {projet.lien && (
            <a href={projet.lien} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, padding: "0.45rem", fontSize: "0.75rem", textAlign: "center" }}>
              {projet.lienLabel ?? "Voir →"}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
export default function Home() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [projetsLoading, setProjetsLoading] = useState(true);

  useEffect(() => {
    const fetchProjets = async () => {
      const { data, error } = await supabase
        .from('projets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setProjets(data);
      } else {
        console.error("Erreur chargement projets", error);
      }
      setProjetsLoading(false);
    };
    fetchProjets();
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

  const filteredProjets = useMemo(
    () => filter === "Tous" ? projets : projets.filter(p => p.cat === filter),
    [filter, projets]
  );

  return (
    <main>

      {/* ══════ NAV ══════ */}
      <motion.nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,1)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.3s, box-shadow 0.3s",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
          {/* Logo */}
          <motion.button onClick={() => smoothScrollTo("bio")} style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "none", border: "none", cursor: "pointer" }}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>S</div>
            <div className="hidden sm:block">
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", letterSpacing: "-0.01em" }}>
                Abba Serge{" "}
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--primary)" }}>MBAITADJIM</span>
              </span>
            </div>
          </motion.button>

          {/* Desktop nav */}
          <motion.div className="hidden md:flex" style={{ gap: "1.75rem", alignItems: "center" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} className="nav-link" onClick={() => smoothScrollTo(id)}>{label}</button>
            ))}
          </motion.div>

          <motion.a href="/cv.pdf" download className="btn-primary hidden md:inline-flex"
            style={{ padding: "0.55rem 1.25rem", fontSize: "0.82rem" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Télécharger CV
          </motion.a>

          {/* Hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
            style={{ background: "none", border: "none", cursor: "pointer" }}>
            {[0, 1, 2].map(i => (
              <motion.span key={i} style={{ display: "block", width: 22, height: 1.5, background: "var(--text)", borderRadius: 2 }}
                animate={menuOpen ? (i === 1 ? { opacity: 0 } : i === 0 ? { rotate: 45, y: 7 } : { rotate: -45, y: -7 }) : { rotate: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.22 }} />
            ))}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }} className="overflow-hidden md:hidden"
              style={{ background: "white", borderTop: "1px solid var(--border)" }}>
              <div className="container flex flex-col gap-4 py-6">
                {NAV_LINKS.map(({ id, label }) => (
                  <button key={id} className="mobile-nav-link" onClick={() => { smoothScrollTo(id); setMenuOpen(false); }}>{label}</button>
                ))}
                <a href="/cv.pdf" download className="btn-primary py-3 text-center mt-2">Télécharger CV</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════ HERO ══════ */}
      <section id="bio" className="mesh-hero" style={{ paddingTop: "clamp(6rem,12vw,9rem)", paddingBottom: "clamp(4rem,8vw,6rem)", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">

            {/* Left */}
            <div>
              {/* Status badge */}
              <FadeIn delay={0}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", marginBottom: "2rem", padding: "0.35rem 1rem", borderRadius: "999px", border: "1px solid var(--border)", background: "transparent" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} className="anim-pulse-dot" />
                  <span className="label-tag" style={{ color: "var(--text-faint)", fontSize: "0.68rem" }}>Disponible · Dakar, Sénégal</span>
                </div>
              </FadeIn>

              {/* Name */}
              <div style={{ overflow: "hidden", marginBottom: "0.1rem" }}>
                <motion.h1 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(2.6rem, 6vw, 5.2rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 0.95,
                  color: "var(--text)",
                }} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                  MBAITADJIM
                </motion.h1>
              </div>
              <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
                <motion.div style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--violet) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  paddingBottom: "5px",
                }} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                  Abba Serge
                </motion.div>
              </div>

              {/* Role line */}
              <FadeIn delay={0.35}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem 0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--primary)" }}>
                    Data Analyst Junior
                  </span>
                  <span style={{ color: "var(--border-medium)", fontSize: "0.8rem" }}>·</span>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Power BI · Python · IA Générative
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-faint)" }}>
                    Stage Wemoov · Juin 2024 – Octobre 2025 ·
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--accent-red)", fontWeight: 600 }}>
                    Terminé
                  </span>
                </div>
              </FadeIn>

              {/* Bio */}
              <FadeIn delay={0.42}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "480px", marginBottom: "2rem" }}>
                  Fraîchement diplômé d&apos;un Master Big Data & Data Stratégie (ISM, Dakar),
                  je transforme la donnée en décisions claires avec Power BI, Python, SQL et l&apos;IA générative.
                </p>
              </FadeIn>

              {/* CTAs */}
              <FadeIn delay={0.5}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
                  <motion.button className="btn-primary" style={{ padding: "0.75rem 1.6rem" }}
                    onClick={() => smoothScrollTo("realisations")}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    ▷ Voir mes projets
                  </motion.button>
                  <motion.button className="btn-ghost" style={{ padding: "0.75rem 1.4rem" }}
                    onClick={() => smoothScrollTo("contact")}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Me contacter →
                  </motion.button>
                </div>
              </FadeIn>

              {/* Tech tags */}
              <FadeIn delay={0.58}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(225,230,245,0.7)" }}>
                  {[
                    { label: "Power BI · Excel", color: "var(--primary)" },
                    { label: "Python · SQL · Pandas", color: "var(--violet)" },
                    { label: "IA Générative", color: "var(--accent-red)" },
                  ].map(({ label, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 3, height: 16, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.8 }} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-faint)", fontWeight: 500 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Right  Photo frame */}
            <motion.div className="hidden lg:flex relative justify-center items-center"
              initial={{ opacity: 0, x: 30, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>

              {/* Decorative background shapes for photo */}
              <div style={{ position: "absolute", inset: "-10%", background: "radial-gradient(circle, var(--blue-light) 0%, transparent 60%)", filter: "blur(40px)", zIndex: 0 }} />

              <motion.div
                style={{
                  position: "relative",
                  width: "100%", maxWidth: "380px", aspectRatio: "4/5",
                  background: "var(--bg-card)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  borderRadius: 30,
                  boxShadow: "0 24px 60px rgba(37,99,235,0.15), 0 6px 20px rgba(0,0,0,0.05)",
                  overflow: "hidden", zIndex: 1
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>

                {/* Photo Image */}
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(235,240,255,0.8) 0%, rgba(255,255,255,0.2) 100%)", position: "relative" }}>
                  <img src="/photo.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
                </div>

                {/* Floating badge */}
                <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", padding: "0.6rem 1.25rem", borderRadius: "999px", display: "flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.8)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} className="anim-pulse-dot" />
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.75rem", color: "var(--text)" }}>Prêt à innover</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="sep" />

      {/* ══════ À PROPOS ══════ */}
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

            {/* Expérience & Formation */}
            <FadeIn delay={0.2}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                {/* Expérience Pro */}
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

                {/* Formation */}
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

          {/* Stats */}
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

      <div className="sep" />

      {/* ══════ COMPÉTENCES ══════ */}
      <section id="competences" className="mesh-white" style={{ padding: "clamp(4rem,8vw,6.5rem) 0", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <FadeIn>
            <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>Mes Compétences</h2>
            <p style={{ color: "var(--text-faint)", fontSize: "0.9rem", marginBottom: "clamp(2.5rem,5vw,4rem)", maxWidth: "440px" }}>
              Un ensemble de compétences couvrant la data, l&apos;IA et la création.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </section>

      <div className="sep" />

      {/* ══════ PROJETS ══════ */}
      <section id="realisations" className="mesh-surface" style={{ padding: "clamp(4rem,8vw,6.5rem) 0", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <FadeIn>
            <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>Mes Projets</h2>
            <p style={{ color: "var(--text-faint)", fontSize: "0.9rem", marginBottom: "clamp(2rem,4vw,3rem)", maxWidth: "400px" }}>
              Interfaces, visuels gaming, contenus IA et analyses data.
            </p>
          </FadeIn>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-7" role="tablist">
            {FILTER_CATEGORIES.map(cat => (
              <motion.button key={cat} role="tab" aria-selected={filter === cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "0.45rem 1.1rem", borderRadius: "999px", fontSize: "0.82rem",
                  fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer", border: "1px solid",
                  borderColor: filter === cat ? "var(--primary)" : "var(--border)",
                  background: filter === cat ? "var(--primary)" : "white",
                  color: filter === cat ? "white" : "var(--text-muted)",
                  transition: "all 0.2s",
                }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projetsLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton rounded-2xl h-[340px]" />)
              : filteredProjets.map((p: any, i) => (
                <ProjectCard key={p.id || p.titre} projet={p} index={i} onOpen={setLightbox} />
              ))}
          </div>

          {!projetsLoading && filteredProjets.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-faint)", fontSize: "0.9rem" }}>
              Aucun projet pour cette catégorie.
            </div>
          )}
        </div>
        <AnimatePresence>{lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>
      </section>

      <div className="sep" />

      {/* ══════ EXPÉRIENCE & FORMATION ══════ */}
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

      <div className="sep" />

      {/* ══════ CONTACT ══════ */}
      <section id="contact" style={{ padding: "clamp(4rem,8vw,6.5rem) 0", background: "var(--bg-surface)" }}>
        <div className="container">
          <FadeIn>
            <div className="label-tag" style={{ color: "var(--primary)", marginBottom: "0.75rem" }}>Contact</div>
            <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>Travaillons ensemble</h2>
            <p style={{ color: "var(--text-faint)", fontSize: "0.9rem", marginBottom: "clamp(2.5rem,5vw,4rem)", maxWidth: "420px" }}>
              Un projet, une opportunité, ou simplement envie d&apos;échanger ? Je réponds rapidement.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
            {/* Links */}
            <FadeIn delay={0.1}>
              <address className="not-italic flex flex-col gap-3">
                {CONTACT_LINKS.map(({ label, value, href, icon }) => (
                  <motion.a key={label} href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid var(--border)", background: "white", color: "inherit", textDecoration: "none" }}
                    whileHover={{ borderColor: "rgba(37,99,235,0.3)", x: 4, boxShadow: "0 4px 16px rgba(37,99,235,0.08)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--primary-xlight)", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: "var(--primary)" }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="label-tag" style={{ color: "var(--text-faint)", fontSize: "0.58rem" }}>{label}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                    </div>
                    <span style={{ color: "var(--primary)", opacity: 0.4, fontSize: "0.9rem" }}>→</span>
                  </motion.a>
                ))}
                <a href="/cv.pdf" download className="btn-primary" style={{ padding: "0.85rem", marginTop: "0.5rem", textAlign: "center", borderRadius: 12 }}>
                  ↓ Télécharger le CV (PDF)
                </a>
              </address>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.2}>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(1.5rem,3vw,2.2rem)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "1.5rem" }}>
                  Envoyez un message
                </h3>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <div className="sep" />
      <footer style={{ padding: "1.5rem 0", background: "var(--bg)" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-faint)" }}>
            © {new Date().getFullYear()} · Mbaitadjim Abba Serge  Le Don
          </span>
          <span className="label-tag" style={{ color: "rgba(37,99,235,0.35)" }}>

          </span>
        </div>
      </footer>
    </main>
  );
}