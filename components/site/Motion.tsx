"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Moteur d'animation du site :
 * défilement fluide (Lenis), apparitions au scroll, parallaxe du hero,
 * panneaux qui s'ouvrent, compteurs, barre de progression, nav qui se masque.
 * Tout est désactivé si l'utilisateur préfère réduire les animations.
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Apparitions ── */
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-split]"));
    const countEls = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));

    const runCount = (el: HTMLElement) => {
      const raw = el.dataset.count ?? el.textContent ?? "";
      const m = raw.match(/\d+/);
      if (!m || reduce) return;
      const target = Number(m[0]);
      const from = target > 1000 ? target - 24 : 0;
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const t = clamp((now - start) / dur);
        el.textContent = raw.replace(m[0], String(Math.round(from + (target - from) * easeOut(t))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-visible");
          if (el.dataset.count !== undefined) runCount(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    [...revealEls, ...countEls].forEach((el) => io.observe(el));

    if (reduce) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return () => io.disconnect();
    }

    /* ── Défilement fluide ── */
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      anchors: { offset: -96 },
      autoRaf: true,
      prevent: (node) => node.closest?.("dialog") !== null,
    });
    window.__lenis = lenis;

    /* ── Effets liés au scroll ── */
    const hero = document.querySelector<HTMLElement>(".hero");
    const scalers = Array.from(document.querySelectorAll<HTMLElement>("[data-scale]"));
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      root.style.setProperty("--progress", String(max > 0 ? y / max : 0));

      // Nav : masquée en descendant, visible en remontant
      if (Math.abs(y - lastY) > 6) {
        root.classList.toggle("nav-hidden", y > lastY && y > vh * 0.6);
        lastY = y;
      }

      if (hero && y < vh * 1.2) hero.style.setProperty("--hy", String(y));

      for (const el of scalers) {
        const r = el.getBoundingClientRect();
        if (r.top > vh || r.bottom < 0) continue;
        el.style.setProperty("--p", clamp((vh - r.top) / (vh * 0.75)).toFixed(3));
      }
    };
    lenis.on("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    /* ── Parallaxe du hero à la souris ── */
    const onMove = (e: PointerEvent) => {
      if (!hero || e.pointerType !== "mouse") return;
      hero.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
    };
    hero?.addEventListener("pointermove", onMove);

    return () => {
      io.disconnect();
      lenis.destroy();
      delete window.__lenis;
      window.removeEventListener("resize", onScroll);
      hero?.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div className="progress" aria-hidden="true" />;
}
