"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SplitWords, FadeUp, EyebrowReveal } from "@/components/TextReveal";
import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { FILTER_CATEGORIES, PROJETS_DATA } from "@/lib/data";
import type { Projet } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { X, ExternalLink, ChevronLeft, ChevronRight, Globe, Image as ImageIcon } from "lucide-react";
import BrowserMockup from "@/components/BrowserMockup";

function ProjectCard({ projet, index, onPreview }: { projet: Projet; index: number; onPreview: (p: Projet) => void }) {
  let safeSrc = projet.src?.trim() || "/projets/gaming/gaming-2.jpg";
  if (!safeSrc.startsWith("/") && !safeSrc.startsWith("http")) safeSrc = "/" + safeSrc;
  safeSrc = safeSrc.replace(/\\/g, "/");
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex", flexDirection: "column", position: "relative",
        background: "var(--bg-elevated)",
        borderRadius: "var(--r-card)",
        border: "1px solid var(--border)",
        padding: "1.25rem",
        boxShadow: "var(--shadow-md)",
        transition: "box-shadow 0.3s, transform 0.3s",
      }}
      whileHover={{ y: -4, boxShadow: "var(--shadow-xl)" } as never}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Index number */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0.4, x: hovered ? 0 : -4 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute", top: "1rem", right: "1.25rem",
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "0.6rem", letterSpacing: "0.1em",
          color: "var(--revo-blue)", textTransform: "uppercase",
          zIndex: 2,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {/* Browser Mockup (Interactive Preview) */}
      <div style={{ marginBottom: "1.25rem" }}>
        <BrowserMockup
          src={safeSrc}
          alt={projet.titre}
          url={projet.lien}
          liveUrl={projet.liveUrl ?? (projet.lien && !projet.lien.includes("github.com") ? projet.lien : undefined)}
          gallery={projet.gallery}
          tags={projet.tags}
          onClick={() => onPreview({ ...projet, src: safeSrc })}
        />
      </div>

      {/* Content */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.4rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)" }}>
          {projet.titre}
        </h3>
        <span style={{ flexShrink: 0, fontSize: "0.6rem", padding: "0.2rem 0.65rem", background: "var(--bg-layer)", color: "var(--text-secondary)", borderRadius: "9999px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.1rem" }}>
          {projet.cat}
        </span>
      </div>
      <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
        {projet.desc}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
        {projet.tags.slice(0, 3).map((t, ti) => {
          const tagColors = [
            { bg: "rgba(73,79,223,0.08)", color: "var(--revo-blue)", border: "rgba(73,79,223,0.18)" },
            { bg: "rgba(168,85,247,0.08)", color: "#a855f7", border: "rgba(168,85,247,0.18)" },
            { bg: "rgba(0,168,126,0.08)", color: "var(--revo-mint)", border: "rgba(0,168,126,0.18)" },
          ];
          const c = tagColors[ti % 3];
          return (
            <span key={t} style={{ fontSize: "0.62rem", padding: "0.2rem 0.65rem", background: c.bg, color: c.color, borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 600, border: `1px solid ${c.border}` }}>
              #{t}
            </span>
          );
        })}
      </div>

      {/* Actions */}
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
  const [modalTab, setModalTab] = useState<"gallery" | "live">("gallery");

  const allImages = useMemo(() => {
    if (!previewProjet) return [];
    return [previewProjet.src, ...(previewProjet.gallery || [])].filter(Boolean);
  }, [previewProjet]);

  const currentImageIndex = useMemo(() => {
    return allImages.indexOf(activeImage);
  }, [allImages, activeImage]);

  const nextImage = useCallback(() => {
    setActiveImage(allImages[(currentImageIndex + 1) % allImages.length]);
  }, [allImages, currentImageIndex]);

  const prevImage = useCallback(() => {
    setActiveImage(allImages[(currentImageIndex - 1 + allImages.length) % allImages.length]);
  }, [allImages, currentImageIndex]);

  useEffect(() => {
    if (previewProjet) {
      setActiveImage(previewProjet.src);
      setModalTab("gallery");
    } else {
      setActiveImage("");
    }
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

  // Focus trap dans la modale
  useEffect(() => {
    if (!previewProjet) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"]), input, textarea, select'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [previewProjet]);

  const filteredProjets = useMemo(
    () => filter === "Tous" ? projets : projets.filter(p => p.cat === filter),
    [filter, projets]
  );

  return (
    <>
      <section id="realisations" style={{ background: "var(--bg)", padding: "clamp(4rem, 8vw, 6.5rem) 0" }}>
        <div className="container">
          <div>
            <EyebrowReveal delay={0.05}>
              <span className="section-eyebrow" style={{ margin: 0 }}>Réalisations</span>
            </EyebrowReveal>
            <SplitWords
              text="Mes projets."
              delay={0.12}
              stagger={0.12}
              duration={0.8}
              as="h2"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 500,
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)", letterSpacing: "-0.03em",
                lineHeight: 1.1, color: "var(--text)",
                marginTop: "0.5rem", marginBottom: "0.75rem",
              }}
            />
            <FadeUp delay={0.3} blur>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", maxWidth: 500, lineHeight: 1.7, marginBottom: "2rem" }}>
                Interfaces Power BI, miniatures YouTube, IA générative et designs Canva.
              </p>
            </FadeUp>
          </div>

          {/* Filter pills + project count */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "3rem", alignItems: "center" }}>
            {FILTER_CATEGORIES.map(cat => {
              const isActive = filter === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    position: "relative",
                    background: "transparent",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    borderRadius: 9999,
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.8rem",
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: isActive ? "transparent" : "var(--border)",
                    zIndex: 0,
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filterActivePill"
                      style={{
                        position: "absolute", inset: 0,
                        borderRadius: 9999,
                        background: "var(--revo-black)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  {cat}
                </motion.button>
              );
            })}
            <AnimatePresence mode="wait">
              <motion.span
                key={filter}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-tertiary)", fontFamily: "var(--font-body)", fontWeight: 500 }}
              >
                {filteredProjets.length} projet{filteredProjets.length > 1 ? "s" : ""}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Grid */}
          {projetsLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="skeleton" style={{ height: 240, borderRadius: "var(--radius-card)" }} />
                  <div className="skeleton" style={{ height: 22, width: "65%", borderRadius: 6 }} />
                  <div className="skeleton" style={{ height: 14, width: "90%", borderRadius: 6 }} />
                  <div className="skeleton" style={{ height: 14, width: "70%", borderRadius: 6 }} />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <div className="skeleton" style={{ height: 34, width: 80, borderRadius: 9999 }} />
                    <div className="skeleton" style={{ height: 34, width: 100, borderRadius: 9999 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjets.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-tertiary)", padding: "3rem 0" }}>Aucun projet pour cette catégorie.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "clamp(1.5rem, 3vw, 2.5rem)", paddingTop: "1.6rem" }}>
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
              className="relative w-full max-w-5xl bg-[var(--bg)] rounded-[var(--radius-xl)] overflow-hidden flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
              style={{ maxHeight: "95vh" }}
              role="dialog"
              aria-modal="true"
              aria-label={`Aperçu du projet ${previewProjet.titre}`}
            >
              {/* Close btn */}
              <button
                onClick={() => setPreviewProjet(null)}
                style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 50, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
                aria-label="Fermer l'aperçu"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

               {/* === DESKTOP LAYOUT (Hidden on mobile) === */}
               <div className="hidden md:flex flex-col w-full h-full" style={{ maxHeight: "95vh" }}>

                {/* Tab bar */}
                <div style={{ display: "flex", gap: "0.25rem", padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)", flexShrink: 0 }}>
                  <button
                    onClick={() => setModalTab("gallery")}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.4rem 1rem", borderRadius: 9999, border: "none", cursor: "pointer",
                      fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.02em",
                      background: modalTab === "gallery" ? "var(--revo-black)" : "transparent",
                      color: modalTab === "gallery" ? "#fff" : "var(--text-secondary)",
                      transition: "all 0.2s",
                    }}
                  >
                    <ImageIcon size={13} /> Captures
                  </button>
                  {previewProjet.lien && (
                    <button
                      onClick={() => setModalTab("live")}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.4rem 1rem", borderRadius: 9999, border: "none", cursor: "pointer",
                        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.02em",
                        background: modalTab === "live" ? "var(--revo-blue)" : "transparent",
                        color: modalTab === "live" ? "#fff" : "var(--text-secondary)",
                        transition: "all 0.2s",
                      }}
                    >
                      <Globe size={13} /> Aperçu live
                    </button>
                  )}
                </div>

                {/* Live iframe tab */}
                {modalTab === "live" && previewProjet.lien ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* Browser chrome bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 1rem", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                      </div>
                      <div style={{ flex: 1, background: "var(--bg-layer)", borderRadius: 9999, padding: "0.25rem 0.75rem", fontSize: "0.65rem", color: "var(--text-tertiary)", fontFamily: "ui-monospace, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {previewProjet.lien}
                      </div>
                      <a href={previewProjet.lien} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-tertiary)", display: "flex", alignItems: "center" }}>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                    <iframe
                      src={previewProjet.lien}
                      title={`Aperçu live — ${previewProjet.titre}`}
                      style={{ flex: 1, border: "none", width: "100%", minHeight: "55vh", background: "#fff" }}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <>
                    {/* Image large */}
                    <div style={{ position: "relative", width: "100%", flexShrink: 0, height: "50vh", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)" }}>
                      <Image
                        src={activeImage || previewProjet.src!}
                        alt={previewProjet.titre}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                      />

                      {/* Navigation Arrows */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)", transition: "all 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}
                            aria-label="Image précédente"
                          >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)", transition: "all 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}
                            aria-label="Image suivante"
                          >
                            <ChevronRight size={24} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Scrollable content below */}
                    <div style={{ padding: "1.5rem 2rem", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto", flexGrow: 1 }}>
                      {/* Galerie Thumbnails (if any) */}
                      {previewProjet.gallery && previewProjet.gallery.length > 0 && (
                        <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                          <div
                            onClick={() => setActiveImage(previewProjet.src!)}
                            style={{ flexShrink: 0, width: 100, height: 70, position: "relative", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: activeImage === previewProjet.src ? "2px solid var(--revo-blue)" : "2px solid transparent", opacity: activeImage === previewProjet.src ? 1 : 0.6, transition: "all 0.2s" }}
                          >
                            <Image src={previewProjet.src!} alt="Cover" fill className="object-cover" sizes="100px" />
                          </div>
                          {previewProjet.gallery.map((gImg, idx) => (
                            <div
                              key={idx}
                              onClick={() => setActiveImage(gImg)}
                              style={{ flexShrink: 0, width: 100, height: 70, position: "relative", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: activeImage === gImg ? "2px solid var(--revo-blue)" : "2px solid transparent", opacity: activeImage === gImg ? 1 : 0.6, transition: "all 0.2s" }}
                            >
                              <Image src={gImg} alt={`Gallery ${idx}`} fill className="object-cover" sizes="100px" />
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

                      {/* Desktop Gallery Feed */}
                      {previewProjet.gallery && previewProjet.gallery.length > 0 && (
                        <div className="flex flex-col gap-6 mt-10 pt-8 border-t border-[var(--border)]">
                          <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Galerie complète</h4>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                            {allImages.map((img, idx) => (
                              <div
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                style={{ position: "relative", borderRadius: "var(--radius-card)", overflow: "hidden", cursor: "pointer", border: activeImage === img ? "2px solid var(--revo-blue)" : "2px solid transparent", transition: "all 0.3s", aspectRatio: "4/3", background: "var(--bg-elevated)" }}
                                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                              >
                                <Image src={img} alt={`Project visual ${idx}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                                {activeImage === img && (
                                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,255,0.1)", pointerEvents: "none" }} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* === MOBILE LAYOUT (Hidden on desktop) === */}
              {/* On mobile, everything is simply stacked vertically and fully scrollable, creating a natural reading experience for many images. */}
              <div className="flex md:hidden flex-col w-full h-full overflow-y-auto" style={{ maxHeight: "95vh" }}>
                <div style={{ position: "relative", width: "100%", height: "40vh", flexShrink: 0, background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                  <Image
                    src={previewProjet.src!}
                    alt={previewProjet.titre}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>

                <div style={{ padding: "1.25rem 1rem", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.25rem", color: "var(--text)", margin: 0 }}>{previewProjet.titre}</h3>
                      <span style={{ fontSize: "0.65rem", padding: "0.2rem 0.6rem", background: "var(--revo-blue)", color: "#ffffff", borderRadius: "9999px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{previewProjet.cat}</span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{previewProjet.desc}</p>
                  </div>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {previewProjet.tags.map(t => (
                      <span key={t} style={{ background: "var(--bg-layer)", color: "var(--text-secondary)", borderRadius: 9999, padding: "0.3rem 0.7rem", fontSize: "0.6rem", fontWeight: 500 }}>#{t}</span>
                    ))}
                  </div>

                  {previewProjet.lien && (
                    <a href={previewProjet.lien} target="_blank" rel="noopener noreferrer" className="btn-primary w-fit mt-1" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", fontSize: "0.8rem" }}>
                      {previewProjet.lienLabel || "Aller sur le site"} <ExternalLink size={14} strokeWidth={2.5} />
                    </a>
                  )}
                  
                  {/* Gallery Feed (All Images Stacked) */}
                  {previewProjet.gallery && previewProjet.gallery.length > 0 && (
                    <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-[var(--border)]">
                      <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Galerie</h4>
                      {previewProjet.gallery.map((gImg, idx) => (
                         <div key={idx} style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "var(--bg-elevated)", borderRadius: "8px", overflow: "hidden", display: "flex", justifyContent: "center" }}>
                           <Image 
                             src={gImg} 
                             alt={`Gallery ${idx}`} 
                             fill 
                             className="object-contain"
                             sizes="100vw"
                             loading="lazy"
                           />
                         </div>
                      ))}
                    </div>
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
