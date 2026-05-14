"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── SplitWords : chaque mot sort d'un masque clip ─── */
export function SplitWords({
  text,
  delay = 0,
  stagger = 0.08,
  duration = 0.75,
  className,
  style,
  as: Tag = "span",
}: {
  text: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const words = text.split(" ");

  return (
    <Tag className={className} style={{ display: "flex", flexWrap: "wrap", gap: "0 0.28em", ...style }}>
      {/* invisible sentinel for IntersectionObserver */}
      <span ref={ref} style={{ position: "absolute", pointerEvents: "none" }} aria-hidden />
      {words.map((word, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block", paddingBottom: "0.08em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{ delay: delay + i * stagger, duration, ease }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ─── SplitChars : chaque lettre sort du masque ─── */
export function SplitChars({
  text,
  delay = 0,
  stagger = 0.04,
  duration = 0.55,
  className,
  style,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", ...style }}
    >
      {text.split("").map((char, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span
            style={{ display: "inline-block", whiteSpace: "pre" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{ delay: delay + i * stagger, duration, ease }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── FadeUp : fondu vers le haut (paragraphes, labels) ─── */
export function FadeUp({
  children,
  delay = 0,
  duration = 0.65,
  y = 22,
  blur = false,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: blur ? "blur(6px)" : "none" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay, duration, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ─── SlideIn : glisse depuis la gauche/droite ─── */
export function SlideIn({
  children,
  delay = 0,
  duration = 0.6,
  from = "left",
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  from?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, x: from === "left" ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Eyebrow : label section avec ligne qui s'étend ─── */
export function EyebrowReveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "flex", alignItems: "center", gap: "0.6rem", ...style }}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.5, ease }}
    >
      <motion.span
        style={{ display: "inline-block", height: 2, background: "var(--revo-blue)", borderRadius: 2 }}
        initial={{ width: 0 }}
        animate={inView ? { width: 24 } : {}}
        transition={{ delay: delay + 0.15, duration: 0.45, ease }}
      />
      {children}
    </motion.div>
  );
}

/* ─── StaggerContainer : anime les enfants en cascade ─── */
export function StaggerContainer({
  children,
  delay = 0,
  stagger = 0.1,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── StaggerItem : enfant de StaggerContainer ─── */
export function StaggerItem({
  children,
  className,
  style,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}
