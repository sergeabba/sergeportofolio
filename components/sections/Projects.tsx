"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Lightbox from "@/components/Lightbox";
import MouseSpotCard from "@/components/MouseSpotCard";
import { FILTER_CATEGORIES, PROJETS_DATA } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Projet } from "@/lib/types";


function ProjectCard({ projet, index, onOpen }: {
  projet: Projet; index: number; onOpen: (s: string) => void;
}) {
  let safeSrc = projet.src?.trim() || "/projets/gaming/gaming-2.jpg";
  if (!safeSrc.startsWith("/") && !safeSrc.startsWith("http")) safeSrc = "/" + safeSrc;
  safeSrc = safeSrc.replace(/\\/g, "/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      onMouseMove={useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        e.currentTarget.animate(
          { transform: `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)` },
          { duration: 300, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
        );
      }, [])}
      onMouseLeave={(e) => {
        e.currentTarget.animate(
          { transform: "perspective(800px) rotateX(0deg) rotateY(0deg)" },
          { duration: 400, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
        );
      }}
    >
      <div
        className="liquid-card shimmer-card"
        style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", padding: 0 }}
      >
        {/* Image */}
        <div className="relative overflow-hidden cursor-pointer" style={{ height: 200 }} onClick={() => onOpen(safeSrc)}>
          <Image
            src={safeSrc}
            alt={projet.titre}
            fill
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            className="object-cover"
            style={{ transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k="
            quality={85}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          />
          {/* Category */}
          <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
            <span className="pill pill-accent" style={{ fontSize: "0.6rem", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}>{projet.cat}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.15rem 1.3rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "0.35rem" }}>
            {projet.titre}
          </h3>
          <p className="truncate-2" style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", lineHeight: 1.6, marginBottom: "0.85rem" }}>
            {projet.desc}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
            {projet.tags.slice(0, 4).map((t) => (
              <span key={t} className="pill" style={{ fontSize: "0.6rem" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
            <button onClick={() => onOpen(safeSrc)} className="btn-glass" style={{ flex: 1, padding: "0.48rem", fontSize: "0.75rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Aperçu
            </button>
            {projet.lien && (
              <a href={projet.lien} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, padding: "0.48rem 0.75rem", fontSize: "0.75rem", textAlign: "center" }}>{projet.lienLabel || "Voir"}</a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [projetsLoading, setProjetsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        setProjetsLoading(true);
        const { data, error: sbError } = await supabase.from("projets").select("*").order("created_at", { ascending: false });
        if (sbError) { setProjets(PROJETS_DATA); }
        else if (data && data.length > 0) { setProjets(data); }
        else { setProjets(PROJETS_DATA); }
      } catch {
        setProjets(PROJETS_DATA);
      } finally {
        setProjetsLoading(false);
      }
    };
    fetchProjets();
  }, []);

  const filteredProjets = useMemo(
    () => filter === "Tous" ? projets : projets.filter((p) => p.cat === filter),
    [filter, projets]
  );

  return (
    <section id="realisations" style={{ padding: "clamp(6rem, 10vw, 9rem) 0", position: "relative", overflow: "hidden" }}>
      <div className="orb orb-blue orb-2" style={{ width: 550, height: 550, bottom: "-25%", right: "-12%" }} />

      <FadeIn y={30}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label">Réalisations</div>
          <h2 className="section-heading">Mes projets</h2>
          <p className="section-desc" style={{ marginTop: "0.6rem" }}>
            Interfaces, visuels gaming, contenus IA et analyses data.
          </p>
        </div>
      </FadeIn>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Glow line */}
        <div className="glow-line" style={{ marginTop: "2rem", marginBottom: "0" }} />
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2rem", marginBottom: "2.5rem" }}>
          {FILTER_CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              className={filter === cat ? "pill pill-accent" : "pill"}
              style={{ cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-body)", fontWeight: 500 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {error && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-tertiary)", fontSize: "0.9rem" }}>{error}</div>
        )}

        {/* Grid */}
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }} layout>
          <AnimatePresence mode="popLayout">
            {projetsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    style={{ height: 340, borderRadius: "var(--radius-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  />
                ))
              : filteredProjets.map((p, i) => (
                  <ProjectCard key={p.id || p.titre} projet={p} index={i} onOpen={setLightbox} />
                ))}
          </AnimatePresence>
        </motion.div>

        {!projetsLoading && filteredProjets.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-tertiary)", fontSize: "0.9rem" }}>
            Aucun projet pour cette catégorie.
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </section>
  );
}
