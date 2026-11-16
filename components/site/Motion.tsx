"use client";

import { useEffect } from "react";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Moteur d'animation piloté par le défilement (sans bibliothèque) :
 * - [data-reveal]  : apparition à l'entrée dans l'écran
 * - [data-count]   : compteur animé
 * - [data-stage]   : cadre d'images qui grandit jusqu'au plein écran
 * - [data-words]   : texte qui s'allume mot par mot
 * - .scard         : cartes qui s'empilent
 * - [data-hscroll] : défilement horizontal épinglé
 * - [data-line], [data-grow] : progression simple
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 900px)");
    const $ = <T extends HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

    /* ── Apparitions et compteurs ── */
    const runCount = (el: HTMLElement) => {
      const raw = el.dataset.count ?? "";
      const m = raw.match(/\d+/);
      if (!m || reduce) return;
      const target = Number(m[0]);
      const from = target > 1000 ? target - 24 : 0;
      const start = performance.now();
      const tick = (now: number) => {
        const t = clamp((now - start) / 1400);
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    $("[data-reveal], [data-count]").forEach((el) => io.observe(el));

    if (reduce) return () => io.disconnect();

    /* ── Scènes pilotées par le défilement ── */
    const stage = document.querySelector<HTMLElement>("[data-stage]");
    const stageBox = stage?.querySelector<HTMLElement>(".stage");
    const veil = stage?.querySelector<HTMLElement>(".stage__veil");
    const words = $("[data-words]");
    const cards = $(".scard");
    const lines = $("[data-line]");
    const grows = $("[data-grow]");
    const hs = document.querySelector<HTMLElement>("[data-hscroll]");
    const track = hs?.querySelector<HTMLElement>(".hs__track");
    const bar = hs?.querySelector<HTMLElement>(".hs__bar");
    let hsDistance = 0;

    const measure = () => {
      if (!hs || !track) return;
      if (!wide.matches) {
        hs.style.removeProperty("--hs-h");
        hsDistance = 0;
        return;
      }
      hsDistance = Math.max(0, track.scrollWidth - window.innerWidth);
      hs.style.setProperty("--hs-h", `${window.innerHeight + hsDistance}px`);
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;

      if (stage && stageBox) {
        const r = stage.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - vh));
        stageBox.style.setProperty("--p", easeInOut(clamp(p / 0.55)).toFixed(4));
        const v = clamp((p - 0.6) / 0.25);
        veil?.style.setProperty("--v", v.toFixed(3));
        veil?.classList.toggle("is-on", v > 0.9);
      }

      for (const el of words) {
        const r = el.getBoundingClientRect();
        if (r.top > vh || r.bottom < 0) continue;
        el.style.setProperty("--p", clamp((vh * 0.82 - r.top) / (vh * 0.5 + r.height * 0.5)).toFixed(3));
      }

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const top = card.getBoundingClientRect().top;
        const q = clamp((vh - next.getBoundingClientRect().top) / (vh - top));
        card.style.setProperty("--q", q.toFixed(3));
      });

      for (const el of lines) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--p", clamp((vh * 0.7 - r.top) / r.height).toFixed(3));
      }

      for (const el of grows) {
        const r = el.getBoundingClientRect();
        if (r.top > vh) continue;
        el.style.setProperty("--p", clamp((vh - r.top) / (vh * 0.7)).toFixed(3));
      }

      if (hs && track) {
        if (hsDistance > 0) {
          const r = hs.getBoundingClientRect();
          const p = clamp(-r.top / (r.height - vh));
          track.style.setProperty("--hs-x", (p * hsDistance).toFixed(1));
          bar?.style.setProperty("--p", p.toFixed(3));
        } else {
          track.style.setProperty("--hs-x", "0");
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    const ro = track ? new ResizeObserver(onResize) : null;
    if (track) ro?.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      io.disconnect();
      ro?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
