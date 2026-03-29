import type { ReactNode } from "react";

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="section-label">
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.68rem",
          letterSpacing: "0.28em",
          color: "var(--color-gold)",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}