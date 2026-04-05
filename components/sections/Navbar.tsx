"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { smoothScrollTo } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import { Sun, Moon } from "lucide-react";

function useScrollThreshold(threshold: number = 48) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { setScrolled(window.scrollY > threshold); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const scrolled = useScrollThreshold();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleMobileMenuTab = useCallback((e: KeyboardEvent) => {
    if (!menuOpen || e.key !== "Tab") return;
    const focusable = mobileMenuRef.current?.querySelectorAll(
      "button, a, [tabindex]:not([tabindex=\"-1\"])"
    ) as NodeListOf<HTMLElement> | undefined;
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) document.addEventListener("keydown", handleMobileMenuTab);
    return () => document.removeEventListener("keydown", handleMobileMenuTab);
  }, [menuOpen, handleMobileMenuTab]);

  function nav(id: string) {
    smoothScrollTo(id);
    setMenuOpen(false);
  }

  const SHORT_LABELS: Record<string, string> = {
    quisuisje: "À propos",
    competences: "Skills",
    realisations: "Projets",
  };

  return (
    <>
      <motion.div style={{ transformOrigin: "left", scaleX, position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "var(--revo-blue)", zIndex: 101, pointerEvents: "none" }} />

      {/* Navbar */}
      <nav className="nav-glass" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 clamp(1.25rem, 5vw, 3.5rem)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "clamp(3.5rem, 5vw, 4.25rem)", maxWidth: 1400, margin: "0 auto" }}>
          {/* Logo */}
          <a href="#bio" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#ffffff", color: "var(--revo-black)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>AS</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", letterSpacing: "-0.02em", color: "#ffffff" }}>Abba Serge</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "2rem" }}>
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} onClick={() => nav(id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.02em", color: "rgba(255,255,255,0.65)", padding: "0.5rem 0", position: "relative", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
              >
                {SHORT_LABELS[id] || label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={toggle} aria-label="Basculer le thème" style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.65)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s, color 0.2s" }}>
              {theme === "dark" ? <Moon size={14} strokeWidth={1.5} /> : <Sun size={14} strokeWidth={1.5} />}
            </button>
            <a href="/cv.pdf" download style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.45rem 1.25rem", borderRadius: "9999px", background: "#ffffff", color: "var(--revo-black)", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.78rem", textDecoration: "none", transition: "opacity 0.25s" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >CV</a>

            {/* Mobile hamburger */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex", flexDirection: "column", gap: 4, minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span key={i} style={{ display: "block", width: 16, height: 1.5, background: "#ffffff", borderRadius: 2, transformOrigin: "center" }} animate={menuOpen ? i === 1 ? { opacity: 0, scaleX: 0 } : i === 0 ? { rotate: 45, y: 5 } : { rotate: -45, y: -5 } : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.6)" }} />
            <motion.div ref={mobileMenuRef} role="dialog" aria-modal="true" aria-label="Menu de navigation" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ position: "fixed", top: 48, right: "clamp(1.25rem, 5vw, 3.5rem)", zIndex: 95, background: "var(--revo-black)", borderRadius: 16, border: "1px solid var(--border)", padding: "1.5rem", width: "calc(100vw - 2.5rem)", maxWidth: 320 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {NAV_LINKS.map(({ id, label }) => (
                  <button key={id} onClick={() => nav(id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 500, padding: "0.75rem 0", cursor: "pointer", textAlign: "left", borderBottom: "1px solid var(--border)", transition: "color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", alignItems: "center" }}>
                <button onClick={toggle} aria-label="Basculer le thème" style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "rgba(255,255,255,0.65)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {theme === "dark" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
                </button>
                <a href="/cv.pdf" download onClick={() => setMenuOpen(false)} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.75rem 1.25rem", borderRadius: "9999px", background: "#ffffff", color: "var(--revo-black)", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.85rem", textDecoration: "none" }}>Télécharger CV</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
