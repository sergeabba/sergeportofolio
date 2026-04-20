"use client";

import { MARQUEE_SKILLS, MARQUEE_ICONS } from "@/lib/data";
import {
  ChartPolar, Code, Database, Table, Lightning, Brain, Sparkle,
  PenNib, Image as ImageIcon, ChartBar, Globe, WindowsLogo, LinuxLogo,
  HardDrives, Stack, Circle
} from "@phosphor-icons/react";

const IconMap: Record<string, React.ElementType> = {
  "ph-chart-polar": ChartPolar,
  "ph-code": Code,
  "ph-database": Database,
  "ph-table": Table,
  "ph-lightning": Lightning,
  "ph-brain": Brain,
  "ph-sparkle": Sparkle,
  "ph-pen-nib": PenNib,
  "ph-image": ImageIcon,
  "ph-chart-bar": ChartBar,
  "ph-globe": Globe,
  "ph-windows-logo": WindowsLogo,
  "ph-linux-logo": LinuxLogo,
  "ph-hard-drives": HardDrives,
  "ph-stack": Stack,
  "ph-dot": Circle,
};

export default function TechTicker() {
  const items = [...MARQUEE_SKILLS, ...MARQUEE_SKILLS];

  return (
    <section style={{ background: "var(--revo-mint)", overflow: "hidden", borderTop: "1px solid var(--revo-black)", borderBottom: "1px solid var(--revo-black)", padding: "0.85rem 0" }}>
      <div className="marquee-track" style={{ display: "flex", alignItems: "center", gap: "2.5rem", width: "max-content" }}>
        {items.map((item, i) => {
          const iconString = MARQUEE_ICONS[item] ?? "ph-dot";
          const IconComponent = IconMap[iconString] || Circle;
          return (
            <span key={`${item}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.05rem", letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--revo-black)", whiteSpace: "nowrap" }}>
              <IconComponent size={14} weight="bold" />
              {item}
            </span>
          );
        })}
      </div>
    </section>
  );
}
