"use client";

import { MARQUEE_SKILLS, MARQUEE_ICONS } from "@/lib/data";

export default function TechTicker() {
  const items = [...MARQUEE_SKILLS, ...MARQUEE_SKILLS];

  return (
    <section style={{ background: "var(--revo-mint)", overflow: "hidden", borderTop: "1px solid var(--revo-black)", borderBottom: "1px solid var(--revo-black)", padding: "0.85rem 0" }}>
      <div className="marquee-track" style={{ display: "flex", alignItems: "center", gap: "2.5rem", width: "max-content" }}>
        {items.map((item, i) => (
          <span key={`${item}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.05rem", letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--revo-black)", whiteSpace: "nowrap" }}>
            <i className={`ph ${MARQUEE_ICONS[item] ?? "ph-dot"}`} style={{ fontSize: "0.75rem" }} />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
