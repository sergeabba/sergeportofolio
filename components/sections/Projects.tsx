"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Lightbox from "@/components/Lightbox";
import { FILTER_CATEGORIES, PROJETS_DATA } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Projet } from "@/lib/types";


/* ── Project card component ── */
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
        <Image 
          src={safeSrc} 
          alt={projet.titre} 
          fill 
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" 
          className="object-cover transition-transform duration-500 hover:scale-105" 
        />
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
        const { data, error: sbError } = await supabase
          .from('projets')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (sbError) {
          console.log("Supabase unavailable, using fallback data");
          setProjets(PROJETS_DATA);
        } else if (data && data.length > 0) {
          setProjets(data);
        } else {
          console.log("No DB data, using fallback");
          setProjets(PROJETS_DATA);
        }
      } catch (err: any) {
        console.error("Erreur Supabase:", err);
        console.log("Using fallback data");
        setProjets(PROJETS_DATA);
      } finally {
        setProjetsLoading(false);
      }
    };
    fetchProjets();
  }, []);

  const filteredProjets = useMemo(
    () => filter === "Tous" ? projets : projets.filter(p => p.cat === filter),
    [filter, projets]
  );

  return (
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

        {error && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--accent-red)", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projetsLoading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton rounded-2xl h-[340px]" />)
            : filteredProjets.map((p, i) => (
                <ProjectCard key={p.id || p.titre} projet={p} index={i} onOpen={setLightbox} />
              ))}
        </div>

        {!projetsLoading && filteredProjets.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-faint)", fontSize: "0.9rem" }}>
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
