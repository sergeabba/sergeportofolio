import type { ReactNode } from "react";

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-8 h-px bg-[var(--color-gold)]" />
      <span className="font-[var(--font-display)] text-xs tracking-[0.3em] text-[var(--color-gold)] uppercase"
        style={{ fontFamily: "var(--font-display)" }}>
        {children}
      </span>
    </div>
  );
}
