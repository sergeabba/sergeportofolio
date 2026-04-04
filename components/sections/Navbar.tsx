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
  const { theme, toggle: toggleTheme } = useTheme();
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

  // Focus trap for mobile menu
  const handleMobileMenuTab = useCallback((e: KeyboardEvent) => {
    if (!menuOpen || e.key !== "Tab") return;
    const focusable = mobileMenuRef.current?.querySelectorAll(
      "button, a, [tabindex]:not([tabindex=\"-1\"])"
    ) as NodeListOf<HTMLElement> | undefined;
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
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

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX, transformOrigin: "left" }}
      />

      <motion.nav
        role="navigation"
        aria-label="Navigation principale"
        className="nav-glass"
        style={{ position: "fixed", top: 0, width: "100%", zIndex: 100 }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 56, gap: "1rem" }}>
          {/* Logo */}
          <button onClick={() => nav("bio")} aria-label="Retour en haut" style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0" }}>
            <div style={{ width: 28, height: 28, borderRadius: "6px", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bg)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.8rem" }}>
              S
            </div>
            <div className="hidden sm:block">
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem", color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Serge Abba</div>
              <div style={{ fontSize: "0.58rem", color: "var(--text-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1 }}>Data Analyst</div>
            </div>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex" style={{ gap: "0.2rem", alignItems: "center" }}>
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} className="nav-pill" onClick={() => nav(id)}>{label}</button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex" style={{ gap: "0.5rem", alignItems: "center" }}>
            <button
              onClick={toggleTheme}
              aria-label="Basculer le thème"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-tertiary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                flexShrink: 0,
              }}
            >
              {theme === "dark" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>
            <a href="/cv.pdf" download className="btn-primary" style={{ padding: "0.48rem 1rem", fontSize: "0.78rem" }}>CV</a>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden" style={{ gap: "0.4rem", alignItems: "center" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", padding: "0.5rem", display: "flex", flexDirection: "column", gap: 4, minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span key={i} style={{ display: "block", width: 18, height: 1.5, background: "var(--text-tertiary)", borderRadius: 2, transformOrigin: "center" }} animate={menuOpen ? i === 1 ? { opacity: 0, scaleX: 0 } : i === 0 ? { rotate: 45, y: 5.5 } : { rotate: -45, y: -5.5 } : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 95, background: "rgba(5,5,5,0.97)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border)", padding: "1rem clamp(1.25rem, 5vw, 3rem)", paddingBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.1rem" }}
            >
              {NAV_LINKS.map(({ id, label }, i) => (
                <motion.button key={id} onClick={() => nav(id)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: "0.92rem", fontWeight: 500, padding: "0.7rem 0", cursor: "pointer", textAlign: "left", borderBottom: "1px solid var(--border)", transition: "color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}>
                  {label}
                </motion.button>
              ))}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", alignItems: "center" }}>
                <button
                  onClick={toggleTheme}
                  aria-label="Basculer le thème"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--text-tertiary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {theme === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
                </button>
                <a href="/cv.pdf" download className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: "0.8rem", textAlign: "center" }} onClick={() => setMenuOpen(false)}>Telecharger CV</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}