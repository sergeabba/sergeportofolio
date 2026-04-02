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
 * Hook dark mode — lit localStorage, applique la classe html.dark,
 * et met à jour colorScheme pour que les éléments natifs suivent.
 */
export function useDark(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Valeur initiale synchrone (SSR safe)
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
  }, [isDark]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return [isDark, toggleDark];
}