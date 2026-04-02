"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { smoothScrollTo, useDark } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, toggleDark] = useDark();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,1)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.3s, box-shadow 0.3s",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
        {/* Logo */}
        <motion.button
          onClick={() => smoothScrollTo("bio")}
          style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "none", border: "none", cursor: "pointer" }}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
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

        {/* Dark toggle - desktop */}
        <button onClick={toggleDark} className="hidden md:block p-2 ml-2" title={`Toggle dark mode (${isDark ? 'light' : 'dark'})`} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          style={{ background: "none", border: "none", cursor: "pointer", borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          <span>{isDark ? '🌙' : '☀️'}</span>
        </button>

        {/* Hamburger */}
        <button className="hamburger md:hidden flex flex-col gap-1.5 p-3" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
          style={{ background: "none", border: "none", cursor: "pointer", minHeight: 48 }}>


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
  );
}
