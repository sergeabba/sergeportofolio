"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SkillBarProps {
  label: string;
  level: number;
  accent?: boolean;
}

export default function SkillBar({ label, level, accent = false }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-6" role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${level}%`}>
      <div className="flex justify-between items-baseline mb-2">
        <span
          className="text-base tracking-wide text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </span>
        <span
          className="text-sm tracking-wider"
          style={{
            fontFamily: "var(--font-display)",
            color: accent ? "var(--color-gold)" : "rgba(201,168,92,0.5)",
          }}
        >
          {level}%
        </span>
      </div>
      <div className="relative h-px bg-[var(--color-border)] overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{
            background: accent
              ? "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))"
              : "linear-gradient(90deg, rgba(201,168,92,0.4), rgba(201,168,92,0.7))",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
