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
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mb-5"
      role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100}
      aria-label={`${label}: ${level}%`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.88rem", color: "var(--color-text)" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.75rem",
          color: accent ? "var(--color-blue-light)" : "rgba(107,147,255,0.5)" }}>
          {level}%
        </span>
      </div>
      <div className="skill-track">
        <motion.div
          style={{
            position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 3,
            background: accent
              ? "linear-gradient(90deg, #2150CC, #6B93FF)"
              : "linear-gradient(90deg, rgba(59,111,232,0.4), rgba(107,147,255,0.7))",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}