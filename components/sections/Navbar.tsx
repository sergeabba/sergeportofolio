"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { smoothScrollTo, useDark } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/data";

/**
 * Hook personnalisé avec debounce pour optimiser les performances du scroll
 */
function useScrollThreshold(threshold: number = 48) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export default function Navbar() {
  const scrolled = useScrollThreshold(48);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, toggleDark] = useDark();

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Fermer le menu mobile sur Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Bloquer le scroll quand le menu mobile est ouvert */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function nav(id: string) {
    smoothScrollTo(id);
    setMenuOpen(false);
  }

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Navigation principale"
        className="nav-glass"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 64,
            gap: "1rem",
          }}
        >
          {/* ── Logo ── */}
          <motion.button
            onClick={() => nav("bio")}
            aria-label="Retour en haut"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              padding: "0.25rem 0",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "0.95rem",
                flexShrink: 0,
                boxShadow: "0 4px 14px var(--primary-glow)",
              }}
            >
              S
            </div>
            <div className="hidden sm:block">
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                Abba Serge{" "}
                <span style={{ color: "var(--primary)", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                  MBAITADJIM
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "var(--text-faint)",
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                }}
              >
                Data Analyst Junior
              </div>
            </div>
          </motion.button>

          {/* ── Desktop nav ── */}
          <div
            className="hidden md:flex"
            style={{ gap: "1.75rem", alignItems: "center" }}
          >
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} className="nav-link" onClick={() => nav(id)}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Right actions ── */}
          <div
            className="hidden md:flex"
            style={{ gap: "0.65rem", alignItems: "center" }}
          >
            {/* Dark toggle */}
            <button
              className="dark-toggle"
              onClick={toggleDark}
              aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              title={isDark ? "Mode clair" : "Mode sombre"}
            >
              <motion.span
                key={isDark ? "moon" : "sun"}
                initial={{ scale: 0.6, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: "1rem", display: "block" }}
              >
                {isDark ? "🌙" : "☀️"}
              </motion.span>
            </button>

            {/* CV download */}
            <motion.a
              href="/cv.pdf"
              download
              className="btn-primary"
              style={{ padding: "0.55rem 1.2rem", fontSize: "0.82rem" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Télécharger CV
            </motion.a>
          </div>

          {/* ── Mobile actions ── */}
          <div className="flex md:hidden" style={{ gap: "0.5rem", alignItems: "center" }}>
            <button
              className="dark-toggle"
              onClick={toggleDark}
              style={{ width: 36, height: 36 }}
              aria-label={isDark ? "Mode clair" : "Mode sombre"}
            >
              <span style={{ fontSize: "0.9rem" }}>{isDark ? "🌙" : "☀️"}</span>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              style={{
                background: menuOpen ? "var(--bg-hover)" : "none",
                border: "1px solid " + (menuOpen ? "var(--primary)" : "transparent"),
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                padding: "0.55rem",
                display: "flex",
                flexDirection: "column",
                gap: 5,
                minHeight: 48,
                minWidth: 48,
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{
                    display: "block",
                    width: 20,
                    height: 1.5,
                    background: menuOpen ? "var(--primary)" : "var(--text-muted)",
                    borderRadius: 2,
                    transformOrigin: "center",
                  }}
                  animate={
                    menuOpen
                      ? i === 1
                        ? { opacity: 0, scaleX: 0 }
                        : i === 0
                          ? { rotate: 45, y: 6.5 }
                          : { rotate: -45, y: -6.5 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.22 }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(2px)",
              }}
            />

            {/* Drawer */}
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(320px, 85vw)",
                zIndex: 50,
                background: "var(--bg-card-solid)",
                borderLeft: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem",
                paddingTop: "5rem",
                gap: "0.25rem",
                overflowY: "auto",
              }}
            >
              {/* Logo mini */}
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "var(--radius-sm)",
                    background: "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                  }}
                >
                  S
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.8rem", color: "var(--text)" }}>
                  Le Don
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "1rem",
                }}
              >
                ✕
              </button>

              {/* Nav links */}
              {NAV_LINKS.map(({ id, label }, i) => (
                <motion.button
                  key={id}
                  className="mobile-nav-link"
                  onClick={() => nav(id)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {label}
                </motion.button>
              ))}

              {/* Actions */}
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <a
                  href="/cv.pdf"
                  download
                  className="btn-primary"
                  style={{ padding: "0.85rem", textAlign: "center", borderRadius: "var(--radius-md)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  ↓ Télécharger CV
                </a>
                <button
                  onClick={toggleDark}
                  className="btn-ghost"
                  style={{ padding: "0.85rem", borderRadius: "var(--radius-md)", gap: "0.6rem" }}
                >
                  {isDark ? "☀️ Mode clair" : "🌙 Mode sombre"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}