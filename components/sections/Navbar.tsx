"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { smoothScrollTo } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import { Sun, Moon, ArrowUpRight } from "lucide-react";

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

const NAV_LABELS: Record<string, string> = {
  bio: "Bio",
  quisuisje: "À propos",
  competences: "Skills",
  experience: "Parcours",
  realisations: "Projets",
  contact: "Contact",
};

const NAV_NUMBERS: Record<string, string> = {
  bio: "00",
  quisuisje: "01",
  competences: "02",
  realisations: "03",
  experience: "04",
  contact: "05",
};

const springOut = { type: "spring", stiffness: 300, damping: 30 };
const staggerItem = {
  initial: { opacity: 0, x: -40, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -40, filter: "blur(8px)" },
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
          height: 2,
          background: "linear-gradient(90deg, var(--revo-blue), var(--accent-soft, #a78bfa))",
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
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", zIndex: menuOpen ? 200 : 1 }}
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

          {/* Desktop Links */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", zIndex: menuOpen ? 200 : 1 }}>
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
              className="nav-cv-btn"
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

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 150,
              background: "var(--revo-black)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            {/* Nav links */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              width: "100%",
              maxWidth: 400,
            }}>
              {NAV_LINKS.map(({ id, label }, i) => {
                const isActive = active === id;
                return (
                  <motion.button
                    key={id}
                    onClick={() => nav(id)}
                    {...staggerItem}
                    transition={{
                      delay: 0.15 + i * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: "-0.03em",
                      padding: "0.4rem 0",
                      cursor: "pointer",
                      textAlign: "center",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      position: "relative",
                      transition: "color 0.2s",
                    }}
                    whileHover={{ color: "#ffffff", x: 8 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{
                      fontSize: "0.6rem",
                      fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                      color: "var(--revo-blue)",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      opacity: 0.7,
                    }}>
                      {NAV_NUMBERS[id]}
                    </span>
                    {NAV_LABELS[id] || label}
                    {isActive && (
                      <motion.span
                        layoutId="mobActiveDot"
                        style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "var(--revo-blue)",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "2.5rem",
                alignItems: "center",
              }}
            >
              <button
                onClick={toggle}
                aria-label="Basculer le thème"
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                {theme === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              </button>
              <a
                href="/cv.pdf" download onClick={() => setMenuOpen(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 2rem", borderRadius: "9999px",
                  background: "#ffffff", color: "#191c1f",
                  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Télécharger CV <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
            </motion.div>

            {/* Decorative background text */}
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(6rem, 20vw, 12rem)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.02)",
                letterSpacing: "-0.05em",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              AS
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        .nav-desktop-links { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-cv-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
