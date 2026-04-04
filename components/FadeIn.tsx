"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  once?: boolean;
  stagger?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  y = 40,
  x = 0,
  className,
  style,
  duration = 0.85,
  once = true,
  stagger = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  // Respect prefers-reduced-motion
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (stagger) {
    return (
      <div ref={ref} className={className} style={style}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
        {/* children should be <motion.*> with their own variants */}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reducedMotion ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      animate={inView || reducedMotion ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 260, damping: 28, duration, delay }
      }
    >
      {children}
    </motion.div>
  );
}