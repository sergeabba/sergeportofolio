"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

export default function CursorGlow() {
  const { theme } = useTheme();
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef<number>(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);

    const onMove = (e: MouseEvent) => {
      posRef.current.tx = e.clientX;
      posRef.current.ty = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!show) return;

    const tick = () => {
      const pos = posRef.current;
      pos.x += (pos.tx - pos.x) * 0.10;
      pos.y += (pos.ty - pos.y) * 0.10;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.x - 300}px, ${pos.y - 300}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [show]);

  if (!show || theme === "light") return null;

  return (
    <div
      ref={glowRef}
      style={{
        position: "fixed",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(129,140,248,0.04) 35%, rgba(244,114,182,0.02) 60%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 999,
        willChange: "transform",
        mixBlendMode: "screen",
      }}
    />
  );
}
