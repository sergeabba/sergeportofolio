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
  variant?: "fade" | "3d" | "blur";
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
  variant = "fade",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0 });
  const [mounted, setMounted] = useState(false);
  const [alreadyVisible, setAlreadyVisible] = useState(false);

  useEffect(() => {
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

  if (!mounted || alreadyVisible || reducedMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  const getInitial = () => {
    switch (variant) {
      case "3d":
        return {
          opacity: 0,
          y: 40,
          rotateX: 12,
          transformPerspective: 800,
        };
      case "blur":
        return { opacity: 0, y, x, filter: "blur(8px)" };
      default:
        return { opacity: 0, y, x };
    }
  };

  const getAnimate = () => {
    if (!inView) return undefined;
    switch (variant) {
      case "3d":
        return { opacity: 1, y: 0, x: 0, rotateX: 0, transformPerspective: 800 };
      case "blur":
        return { opacity: 1, y: 0, x: 0, filter: "blur(0px)" };
      default:
        return { opacity: 1, y: 0, x: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={getInitial()}
      animate={getAnimate()}
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
