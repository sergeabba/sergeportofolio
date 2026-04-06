"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { smoothScrollTo } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import { Sun, Moon } from "lucide-react";

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { setScrolled(window.scrollY > threshold); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

// Short display labels for nav
const NAV_LABELS: Record<string, string> = {
  bio: "Bio",
  quisuisje: "À propos",
  competences: "Skills",
  experience: "Parcours",
  realisations: "Projets",
  contact: "Contact",
};

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const scrolled = useScrolled();
  const active = useActiveSection();
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

  const handleMobileTab = useCallback((e: KeyboardEvent) => {
    if (!menuOpen || e.key !== "Tab") return;
    const focusable = mobileMenuRef.current?.querySelectorAll("button, a") as NodeListOf<HTMLElement> | undefined;
    if (!focusable || !focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) document.addEventListener("keydown", handleMobileTab);
    return () => document.removeEventListener("keydown", handleMobileTab);
  }, [menuOpen, handleMobileTab]);

  function nav(id: string) { smoothScrollTo(id); setMenuOpen(false); }

  // Filter to show only main sections
  const mainLinks = NAV_LINKS.filter(l =>
    ["quisuisje", "competences", "realisations", "experience", "contact"].includes(l.id)
  );

  return (
    <>
      {/* Progress bar */}
      <motion.div
        style={{
          transformOrigin: "left", scaleX,
          position: "fixed", top: 0, left: 0, right: 0,
          height: 2, background: "var(--revo-blue)",
          zIndex: 101, pointerEvents: "none",
        }}
      />

      <motion.nav
        className="nav-glass"
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 100, padding: "0 clamp(1.25rem, 4vw, 3rem)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          transition: "border-color 0.3s",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            height: "clamp(3.5rem, 5vw, 4rem)",
            maxWidth: 1160, margin: "0 auto",
          }}
        >
          {/* Logo */}
          <motion.a
            href="#bio"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}
            whileHover={{ opacity: 0.8 }}
          >
            <span
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#ffffff", color: "#191c1f",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 800, fontFamily: "var(--font-display)",
                flexShrink: 0,
              }}
            >
              AS
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)", fontWeight: 500,
                fontSize: "1rem", letterSpacing: "-0.02em", color: "#ffffff",
              }}
            >
              Abba Serge
            </span>
          </motion.a>

          {/* ── Desktop Links ── */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "0.25rem",
            }}
            className="nav-desktop-links"
          >
            {mainLinks.map(({ id }) => {
              const isActive = active === id;
              return (
                <motion.button
                  key={id}
                  onClick={() => nav(id)}
                  style={{
                    background: isActive ? "rgba(255,255,255,0.10)" : "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "6px",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  whileHover={{ color: "#ffffff", background: "rgba(255,255,255,0.08)" } as never}
                >
                  {NAV_LABELS[id] || id}
                </motion.button>
              );
            })}
          </div>

          {/* Right: theme + CV + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <motion.button
              onClick={toggle}
              aria-label="Basculer le thème"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.7)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {theme === "dark" ? <Moon size={13} strokeWidth={1.5} /> : <Sun size={13} strokeWidth={1.5} />}
            </motion.button>

            <motion.a
              href="/cv.pdf" download
              whileHover={{ opacity: 0.85, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0.4rem 1.2rem", borderRadius: "9999px",
                background: "#ffffff", color: "#191c1f",
                fontFamily: "var(--font-body)", fontWeight: 600,
                fontSize: "0.78rem", textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              CV
            </motion.a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer" : "Menu"}
              aria-expanded={menuOpen}
              className="nav-hamburger"
              style={{
                background: "transparent", border: "none",
                cursor: "pointer", padding: "0.5rem",
                display: "flex", flexDirection: "column",
                gap: 5, minHeight: 44, minWidth: 44,
                alignItems: "center", justifyContent: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{ display: "block", width: 18, height: 1.5, background: "#ffffff", borderRadius: 2, transformOrigin: "center" }}
                  animate={
                    menuOpen
                      ? i === 1 ? { opacity: 0, scaleX: 0 }
                        : i === 0 ? { rotate: 45, y: 6.5 }
                        : { rotate: -45, y: -6.5 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                />
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
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.65)" }}
            />
            <motion.div
              key="menu"
              ref={mobileMenuRef}
              role="dialog" aria-modal="true" aria-label="Menu de navigation"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", top: 56,
                right: "clamp(1.25rem, 5vw, 3rem)",
                zIndex: 95, background: "#1e2226",
                borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
                padding: "1.25rem", width: "min(calc(100vw - 2.5rem), 300px)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                {NAV_LINKS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => nav(id)}
                    style={{
                      background: active === id ? "rgba(255,255,255,0.07)" : "none",
                      border: "none", color: active === id ? "#ffffff" : "rgba(255,255,255,0.6)",
                      fontFamily: "var(--font-body)", fontSize: "0.95rem",
                      fontWeight: active === id ? 600 : 400,
                      padding: "0.75rem 0.85rem", cursor: "pointer",
                      textAlign: "left", borderRadius: 8, transition: "all 0.15s",
                      width: "100%",
                    }}
                  >
                    {NAV_LABELS[id] || label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button
                  onClick={toggle}
                  aria-label="Basculer le thème"
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.7)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}
                >
                  {theme === "dark" ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
                </button>
                <a
                  href="/cv.pdf" download onClick={() => setMenuOpen(false)}
                  style={{
                    flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "0.75rem", borderRadius: "9999px",
                    background: "#ffffff", color: "#191c1f",
                    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Télécharger CV
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Responsive CSS — inline to avoid CSS compilation issues */}
      <style>{`
        .nav-desktop-links { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
