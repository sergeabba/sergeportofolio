"use client";

import { useState, useEffect, useCallback } from "react";

export function smoothScrollTo(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function padIndex(n: number, total: number): string {
  const digits = String(total).length;
  return String(n).padStart(Math.max(digits, 2), "0");
}

/**
 * Scroll progress normalized 0-1
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(scrollHeight > 0 ? window.scrollY / scrollHeight : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/**
 * Element-in-view hook with parallax offset
 */
export function useParallax(factor = 0.3): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset(window.scrollY * factor);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);

  return offset;
}

/**
 * Smooth mouse position — for cursor glow effects
 */
export function useMousePosition(): { x: number; y: number } {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const onMouse = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPos({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  return pos;
}
