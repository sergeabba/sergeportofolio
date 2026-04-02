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
}

export default function FadeIn({
  children,
  delay = 0,
  y = 40,
  x = 0,
  className,
  style,
  duration = 0.7,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Margin négatif pour déclencher plus tôt l'animation
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
        // Désactiver les animations pour les utilisateurs qui préfèrent les réduire
        repeat: 0,
      }}
      // Accessibilité : réduire les animations si préféré
      data-reduce-motion={once ? "false" : "true"}
    >
      {children}
    </motion.div>
  );
}