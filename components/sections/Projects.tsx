"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FILTER_CATEGORIES, PROJETS_DATA } from "@/lib/data";
import type { Projet } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { X, ExternalLink, ZoomIn } from "lucide-react";

function ProjectCard({ projet, index, onPreview }: { projet: Projet; index: number; onPreview: (p: Projet) => void }) {
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
      {/* Image (Clique -> Aperçu) */}
      <div
        onClick={() => onPreview({ ...projet, src: safeSrc })}
        className="project-img-wrapper"
        style={{
          position: "relative", height: 260, borderRadius: "var(--radius-card)",
          overflow: "hidden", marginBottom: "1.25rem", background: "var(--bg-elevated)", cursor: "pointer"
        }}
        role="button"
        tabIndex={0}
      >
        <Image
          src={safeSrc}
          alt={projet.titre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
          className="object-cover"
          style={{ transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
          loading="lazy"
        />
        <div
          className="project-img-overlay"
          style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", opacity: 0,
            transition: "opacity 0.3s", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <span style={{ background: "#ffffff", color: "#191c1f", padding: "0.5rem 1rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: 600 }}>
            <ZoomIn size={18} strokeWidth={2.5} /> Aperçu
          </span>
        </div>
        {/* Tags on top-left overlaying image */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", pointerEvents: "none" }}>
          {projet.tags.slice(0, 3).map(t => (
            <span key={t} style={{ background: "#ffffff", color: "var(--revo-black)", borderRadius: 9999, padding: "0.3rem 0.65rem", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.04em", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>{t}</span>
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

      {/* Actions (Aperçu + Lien) */}
      <div style={{ marginTop: "auto", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          onClick={() => onPreview({ ...projet, src: safeSrc })}
          className="btn-ghost"
          style={{ padding: "0.6rem 1.25rem", fontSize: "0.75rem", letterSpacing: "0.04em", borderRadius: "9999px", cursor: "pointer", border: "1px solid var(--border)", background: "transparent", color: "var(--text)" }}
        >
          Aperçu
        </button>

        {projet.lien ? (
          <a href={projet.lien} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", fontSize: "0.75rem", letterSpacing: "0.04em" }}>
            {projet.lienLabel || "Voir le site"} <ExternalLink size={14} strokeWidth={2.5} />
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

  // State pour la Preview Modal
  const [previewProjet, setPreviewProjet] = useState<Projet | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
     if(previewProjet) setActiveImage(previewProjet.src);
     else setActiveImage("");
  }, [previewProjet]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setProjetsLoading(true);
        let { data, error } = await supabase.from("projets").select("*").order("position", { ascending: true, nullsFirst: false });

        // S'il y a une erreur (colonne position manquante, etc), on essaie avec created_at
        if (error) {
          const fallback = await supabase.from("projets").select("*").order("created_at", { ascending: false });
          data = fallback.data;
        }

        if (!data || data.length === 0) setProjets(PROJETS_DATA);
        else setProjets(data);
      } catch {
        setProjets(PROJETS_DATA);
      } finally {
        setProjetsLoading(false);
      }
    };
    fetch();
  }, []);

  // Empêcher le scroll quand la modale est ouverte
  useEffect(() => {
    if (previewProjet) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [previewProjet]);

  const filteredProjets = useMemo(
    () => filter === "Tous" ? projets : projets.filter(p => p.cat === filter),
    [filter, projets]
  );

  return (
    <>
      <style>{`
        .project-img-wrapper:hover img { transform: scale(1.05); }
        .project-img-wrapper:hover .project-img-overlay { opacity: 1 !important; }
      `}</style>

      <section id="realisations" style={{ background: "var(--bg)", padding: "clamp(4rem, 8vw, 6.5rem) 0" }}>
        <div className="container">
          <p className="section-eyebrow">Réalisations</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.8rem, 3.5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", marginBottom: "1rem" }}>
            Mes projets.
          </h2>
          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", maxWidth: 500, lineHeight: 1.7, marginBottom: "2rem" }}>
            Interfaces Power BI, Miniature youtube , IA générative et designs Canva.
          </p>

          {/* Filter pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "2.5rem" }}>
            {FILTER_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? "var(--revo-black)" : "var(--bg-elevated)",
                  color: filter === cat ? "#ffffff" : "var(--text-secondary)",
                  borderRadius: 9999,
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.8rem",
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
                  <ProjectCard key={p.id || p.titre} projet={p} index={i} onPreview={setPreviewProjet} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* MODAL PREVIEW IMAGE */}
      <AnimatePresence>
        {previewProjet && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          >
            {/* Backdrop */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={() => setPreviewProjet(null)} />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: "relative", width: "100%", maxWidth: 1000, background: "var(--bg)", borderRadius: "var(--radius-xl)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "95vh", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            >
              {/* Close btn */}
              <button
                onClick={() => setPreviewProjet(null)}
                style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 10, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* Image large */}
              <div style={{ position: "relative", width: "100%", flexShrink: 0, height: "50vh", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)" }}>
                <Image
                  src={activeImage || previewProjet.src!}
                  alt={previewProjet.titre}
                  fill
                  className="object-contain" // Contain pour voir l'image entière sans couper
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Scrollable content below */}
              <div style={{ padding: "1.5rem 2rem", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto" }}>
                
                {/* Galerie Thumbnails (if any) */}
                {previewProjet.gallery && previewProjet.gallery.length > 0 && (
                   <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                      <div 
                         onClick={() => setActiveImage(previewProjet.src)}
                         style={{ flexShrink: 0, width: 80, height: 60, position: "relative", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: activeImage === previewProjet.src ? "2px solid var(--revo-blue)" : "2px solid transparent", opacity: activeImage === previewProjet.src ? 1 : 0.6, transition: "all 0.2s" }}
                      >
                         <img src={previewProjet.src} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      {previewProjet.gallery.map((gImg, idx) => (
                         <div 
                           key={idx}
                           onClick={() => setActiveImage(gImg)}
                           style={{ flexShrink: 0, width: 80, height: 60, position: "relative", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: activeImage === gImg ? "2px solid var(--revo-blue)" : "2px solid transparent", opacity: activeImage === gImg ? 1 : 0.6, transition: "all 0.2s" }}
                        >
                           <img src={gImg} alt={`Gallery ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                   </div>
                )}

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>{previewProjet.titre}</h3>
                    <span style={{ fontSize: "0.65rem", padding: "0.2rem 0.6rem", background: "var(--revo-blue)", color: "#ffffff", borderRadius: "9999px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{previewProjet.cat}</span>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 800 }}>{previewProjet.desc}</p>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--border)", marginTop: "0.25rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {previewProjet.tags.map(t => (
                      <span key={t} style={{ background: "var(--bg-layer)", color: "var(--text-secondary)", borderRadius: 9999, padding: "0.3rem 0.8rem", fontSize: "0.65rem", fontWeight: 500 }}>#{t}</span>
                    ))}
                  </div>

                  {previewProjet.lien && (
                    <a href={previewProjet.lien} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      {previewProjet.lienLabel || "Aller sur le site"} <ExternalLink size={16} strokeWidth={2.5} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
