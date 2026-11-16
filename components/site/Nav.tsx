"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, CV_LINK } from "@/lib/data";
import { Close, Download, Menu } from "./Icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled || open ? " is-scrolled" : ""}`}>
      <div className="container">
        <div className="nav__bar">
          <a href="#top" className="nav__brand" aria-label="Retour en haut — Mbaitadjim Abba Serge">
            Abba Serge
          </a>

          <nav aria-label="Navigation principale">
            <ul className="nav__links">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <a href={CV_LINK} className="btn btn--dark btn--sm" download>
              Télécharger CV
            </a>
            <button
              type="button"
              className="icon-btn nav__menu-btn"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="nav__mobile">
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={CV_LINK} className="btn btn--dark" download>
              <Download /> Télécharger mon CV
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
