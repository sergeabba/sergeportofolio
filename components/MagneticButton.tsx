"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
}

/**
 * Magnetic effect — children follow cursor within a radius.
 */
export default function MagneticButton({ children, strength = 30 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }, []);

  const onReset = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
    ref.current.style.transform = "translate(0, 0)";
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = "";
    }, 600);
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onReset} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
