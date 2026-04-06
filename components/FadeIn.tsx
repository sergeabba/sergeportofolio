"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  once?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  y = 20,
  x = 0,
  className,
  style,
  duration = 0.65,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0 });
  const [mounted, setMounted] = useState(false);
  const [alreadyVisible, setAlreadyVisible] = useState(false);

  useEffect(() => {
    // If element is already in the viewport when mounted (e.g. anchor navigation),
    // skip the fade animation entirely — show it immediately.
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 40 && rect.bottom > -40) {
        setAlreadyVisible(true);
      }
    }
    setMounted(true);
  }, []);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Before mount or if already visible on page load → render without animation
  if (!mounted || alreadyVisible || reducedMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : undefined}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
