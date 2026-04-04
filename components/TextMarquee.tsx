"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  label?: string;
}

export default function TextMarquee({ items, speed = 25, direction = "left", label }: MarqueeProps) {
  // Duplicate items for seamless loop
  const track = [...items, ...items];

  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "1rem 0" }} aria-label={label || undefined}>
      {label && (
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <span className="pill" style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{label}</span>
        </div>
      )}
      <div className="marquee-track" style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content", animationDuration: `${speed}s`, animationDirection: direction === "right" ? "normal" : undefined, animationPlayState: "running" }}>
        {track.map((item, i) => (
          <span key={i} style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--text-tertiary)", flexShrink: 0 }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
