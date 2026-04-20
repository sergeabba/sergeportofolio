"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

type Theme = "dark" | "light";

interface ThemeCtxVal {
  theme: Theme;
  toggle: (e?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeCtxVal | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);
  const togglingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = useCallback((e?: React.MouseEvent) => {
    if (togglingRef.current) return;
    togglingRef.current = true;

    const nextTheme = theme === "dark" ? "light" : "dark";
    const isDark = nextTheme === "dark";

    if (!e || !document.startViewTransition) {
      setTheme(nextTheme);
      togglingRef.current = false;
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const maxDist = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxDist}px at ${x}px ${y}px)`,
    ];

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath : clipPath.reverse(),
        },
        {
          duration: 550,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        }
      );
    }).finally(() => {
      togglingRef.current = false;
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "light", toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
