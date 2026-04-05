"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FILTER_CATEGORIES, PROJETS_DATA } from "@/lib/data";
import type { Projet } from "@/lib/types";
import { supabase } from "@/lib/supabase";

function ProjectCard({ projet, index }: { projet: Projet; index: number }) {
  let safeSrc = projet.src?.trim() || "/projets/gaming/gaming-2.jpg";
  if (!safeSrc.startsWith("/") && !safeSrc.startsWith("http")) safeSrc = "/" + safeSrc;
  safeSrc = safeSrc.replace(/\\/g, "/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 260, borderRadius: "var(--radius-card)", overflow: "hidden", marginBottom: "1.25rem", background: "var(--bg-elevated)" }}>
        <Image
          src={safeSrc}
          alt={projet.titre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
          className="object-cover"
          style={{ transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          loading="lazy"
        />
        {/* Tags on left */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
          {projet.tags.slice(0, 3).map(t => (
            <span key={t} style={{ background: "#ffffff", color: "var(--revo-black)", borderRadius: 9999, padding: "0.2rem 0.55rem", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.04em" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)", marginBottom: "0.5rem" }}>
        {projet.titre}
      </h3>
      <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
        {projet.desc}
      </p>
      <div style={{ marginTop: "auto" }}>
        {projet.lien ? (
          <a href={projet.lien} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.72rem", letterSpacing: "0.04em" }}>
            {projet.lienLabel || "Voir plus"}
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("Tous");
  const [projets, setProjets] = useState<Projet[]>([]);
  const [projetsLoading, setProjetsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setProjetsLoading(true);
        const { data, error } = await supabase.from("projets").select("*").order("created_at", { ascending: false });
        if (error || !data || data.length === 0) setProjets(PROJETS_DATA);
        else setProjets(data);
      } catch {
        setProjets(PROJETS_DATA);
      } finally {
        setProjetsLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredProjets = useMemo(
    () => filter === "Tous" ? projets : projets.filter(p => p.cat === filter),
    [filter, projets]
  );

  return (
    <section id="realisations" style={{ background: "var(--bg)", padding: "clamp(4rem, 8vw, 6.5rem) 0" }}>
      <div className="container">
        <p className="section-eyebrow">Réalisations</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.8rem, 3.5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", marginBottom: "1rem" }}>
          Mes projets.
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", maxWidth: 500, lineHeight: 1.7, marginBottom: "2rem" }}>
          Interfaces Power BI, scripts Python, IA générative et designs Canva.
        </p>

        {/* Filter pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "2.5rem" }}>
          {FILTER_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? "var(--revo-black)" : "var(--bg-elevated)",
                color: filter === cat ? "#ffffff" : "var(--text-secondary)",
                borderRadius: 9999,
                padding: "0.4rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >{cat}</button>
          ))}
        </div>

        {/* Grid */}
        {projetsLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ height: 420, borderRadius: "var(--radius-card)", background: "var(--bg-elevated)" }} />
            ))}
          </div>
        ) : filteredProjets.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-tertiary)", padding: "3rem 0" }}>Aucun projet pour cette catégorie.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            <AnimatePresence mode="popLayout">
              {filteredProjets.map((p, i) => (
                <ProjectCard key={p.id || p.titre} projet={p} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
