"use client";

import { motion } from "framer-motion";
import { SplitWords, FadeUp, EyebrowReveal, StaggerContainer, StaggerItem } from "@/components/TextReveal";
import {
  BarChart3, Brain, Code2, Monitor, Pen, FileText,
  Database, Table2, Calculator, PieChart, LineChart, Donut,
  Sparkles, Image, Video, Music,
  Terminal, Cpu,
  Wrench, GitBranch, Globe, Atom, Package, Send,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SkillCat {
  title: string;
  icon: LucideIcon;
  tags: { label: string; icon?: LucideIcon }[];
}

const SKILL_CATS: SkillCat[] = [
  {
    title: "Analyse & Visu. Données",
    icon: BarChart3,
    tags: [
      { label: "SQL", icon: Database },
      { label: "Pandas", icon: Table2 },
      { label: "NumPy", icon: Calculator },
      { label: "SciPy" },
      { label: "Power BI", icon: PieChart },
      { label: "Matplotlib", icon: LineChart },
      { label: "Seaborn", icon: Donut },
      { label: "Geoplotlib" },
    ],
  },
  {
    title: "IA Générative & Prompt",
    icon: Brain,
    tags: [
      { label: "Midjourney", icon: Sparkles },
      { label: "NanoBanana Pro" },
      { label: "DALL-E", icon: Image },
      { label: "Sora", icon: Video },
      { label: "Suno", icon: Music },
      { label: "Riffusion" },
    ],
  },
  {
    title: "Programmation",
    icon: Code2,
    tags: [
      { label: "Python", icon: Terminal },
      { label: "C++", icon: Cpu },
      { label: "C", icon: Cpu },
    ],
  },
  {
    title: "Systèmes & OS",
    icon: Monitor,
    tags: [
      { label: "Windows", icon: Monitor },
      { label: "Linux Mint", icon: Terminal },
      { label: "VirtualBox", icon: Package },
      { label: "Scripting Shell", icon: Terminal },
      { label: "Spark", icon: Sparkles },
      { label: "PySpark", icon: Sparkles },
    ],
  },
  {
    title: "Design & UI/UX",
    icon: Pen,
    tags: [
      { label: "Photoshop", icon: Image },
      { label: "Illustrator", icon: Pen },
      { label: "Adobe XD", icon: Layers },
      { label: "Figma", icon: Pen },
      { label: "Canva", icon: Pen },
    ],
  },
  {
    title: "Bureautique & Réseaux",
    icon: FileText,
    tags: [
      { label: "Word", icon: FileText },
      { label: "Excel", icon: Table2 },
      { label: "Sheets", icon: Table2 },
      { label: "TikTok IA & Gaming", icon: Video },
    ],
  },
];

interface ToolItem {
  name: string;
  icon: LucideIcon;
}

const TOOLS: ToolItem[] = [
  { name: "VS Code", icon: Code2 },
  { name: "Git", icon: GitBranch },
  { name: "GitHub", icon: GitBranch },
  { name: "Vercel", icon: Globe },
  { name: "Figma", icon: Pen },
  { name: "Supabase", icon: Database },
  { name: "Next.js", icon: Globe },
  { name: "React", icon: Atom },
  { name: "Node.js", icon: Terminal },
  { name: "Terminal", icon: Terminal },
  { name: "Docker", icon: Package },
  { name: "Postman", icon: Send },
];

export default function Skills() {
  return (
    <>
      <style>{`
        .skill-card {
          border-radius: var(--r-card);
          padding: clamp(1.5rem, 2.5vw, 2rem);
          min-height: 220px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .skill-card:hover { transform: translateY(-6px); }
        .skill-card::before {
          content: "";
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.02) 100%);
          pointer-events: none; z-index: 0;
        }
        .skill-card::after {
          content: "";
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--revo-blue), var(--accent-soft, #a78bfa));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .skill-card:hover::after { transform: scaleX(1); }
        /* Card type 0 — bleu */
        .skill-card-0 {
          background: var(--bg-elevated);
          color: var(--text);
          box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.9);
          border: 1px solid rgba(73,79,223,0.14);
        }
        .skill-card-0::before { background: linear-gradient(135deg, rgba(73,79,223,0.07) 0%, transparent 55%) !important; }
        .skill-card-0 .skill-zone { border-top: 1px solid rgba(73,79,223,0.10); }
        .skill-card-0 .skill-icon-wrap { background: rgba(73,79,223,0.08); border-color: rgba(73,79,223,0.18); }
        .skill-card-0 .skill-tag {
          background: rgba(73,79,223,0.07);
          color: var(--revo-blue);
          box-shadow: var(--shadow-xs);
          border: 1px solid rgba(73,79,223,0.15);
        }
        /* Card type 1 — violet */
        .skill-card-1 {
          background: var(--bg-elevated);
          color: var(--text);
          box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.9);
          border: 1px solid rgba(168,85,247,0.14);
        }
        .skill-card-1::before { background: linear-gradient(135deg, rgba(168,85,247,0.07) 0%, transparent 55%) !important; }
        .skill-card-1 .skill-zone { border-top: 1px solid rgba(168,85,247,0.10); }
        .skill-card-1 .skill-icon-wrap { background: rgba(168,85,247,0.08); border-color: rgba(168,85,247,0.18); }
        .skill-card-1 .skill-tag {
          background: rgba(168,85,247,0.07);
          color: #a855f7;
          box-shadow: var(--shadow-xs);
          border: 1px solid rgba(168,85,247,0.15);
        }
        /* Card type 2 — vert mint */
        .skill-card-2 {
          background: var(--bg-elevated);
          color: var(--text);
          box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.9);
          border: 1px solid rgba(0,168,126,0.14);
        }
        .skill-card-2::before { background: linear-gradient(135deg, rgba(0,168,126,0.07) 0%, transparent 55%) !important; }
        .skill-card-2 .skill-zone { border-top: 1px solid rgba(0,168,126,0.10); }
        .skill-card-2 .skill-icon-wrap { background: rgba(0,168,126,0.08); border-color: rgba(0,168,126,0.18); }
        .skill-card-2 .skill-tag {
          background: rgba(0,168,126,0.07);
          color: var(--revo-mint);
          box-shadow: var(--shadow-xs);
          border: 1px solid rgba(0,168,126,0.15);
        }
        .skill-tag {
          position: relative; overflow: hidden;
          border-radius: 9999px; padding: 0.4rem 0.9rem;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;
        }
        .skill-tag::after {
          content: "";
          position: absolute; top: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%);
          border-radius: inherit; pointer-events: none;
        }
        .skill-tag:hover { transform: translateY(-3px) scale(1.05); filter: brightness(1.1); }
        .skill-zone { position: relative; z-index: 10; }
        .skill-card h3 { position: relative; z-index: 10; }
        .tool-item {
          display: flex; align-items: center; gap: 0.45rem;
          font-size: 0.72rem; padding: 0.35rem 0.85rem;
          border-radius: 9999px; background: var(--bg-elevated);
          border: 1px solid var(--border); color: var(--text-secondary);
          font-weight: 500; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default; white-space: nowrap;
        }
        .tool-item:hover {
          border-color: var(--revo-blue); color: var(--revo-blue);
          transform: scale(1.06) translateY(-1px);
        }
      `}</style>

      <section id="competences" style={{ background: "var(--bg)", padding: "clamp(5rem, 10vw, 8rem) 0", position: "relative", overflow: "hidden" }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "var(--revo-blue)", opacity: 0.04, filter: "blur(130px)", top: "-10%", right: "-15%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#a855f7", opacity: 0.04, filter: "blur(100px)", bottom: "5%", left: "-5%", pointerEvents: "none" }} />
        <div className="container">
          <div>
            <EyebrowReveal delay={0.05}>
              <span className="section-label" style={{ margin: 0 }}>Compétences</span>
            </EyebrowReveal>
            <SplitWords
              text="Outils, langages & plateformes."
              delay={0.12}
              stagger={0.07}
              duration={0.8}
              as="h2"
              className="section-heading"
              style={{ marginTop: "0.5rem", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
            />
          </div>

          <StaggerContainer stagger={0.09} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {SKILL_CATS.map((cat, i) => {
              const cardType = i % 3;
              const CatIcon = cat.icon;

              return (
                <StaggerItem key={cat.title} y={28}>
                <motion.div
                  className={`skill-card skill-card-${cardType}`}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="skill-icon-wrap" style={{
                    position: "relative", zIndex: 10,
                    width: 40, height: 40, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid",
                    marginBottom: "1rem",
                    transition: "transform 0.3s",
                  }}>
                    <CatIcon size={20} strokeWidth={1.8} style={{ color: "currentColor", opacity: 0.85 }} />
                  </div>

                  <h3 style={{
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)", letterSpacing: "-0.02em",
                    lineHeight: 1.2, marginBottom: "auto", paddingBottom: "1.5rem",
                  }}>
                    {cat.title}
                  </h3>

                  <div className="skill-zone" style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingTop: "1rem" }}>
                    {cat.tags.map((tag) => {
                      const TagIcon = tag.icon;
                      return (
                        <motion.span
                          key={tag.label}
                          className="skill-tag"
                          whileHover={{ y: -3, scale: 1.06, filter: "brightness(1.12)" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        >
                          {TagIcon && <TagIcon size={12} strokeWidth={2} style={{ opacity: 0.6, flexShrink: 0 }} />}
                          {tag.label}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Outils et Environnement */}
          <FadeUp delay={0.1} style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: "rgba(73,79,223,0.08)", border: "1px solid rgba(73,79,223,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Wrench size={16} strokeWidth={1.8} style={{ color: "var(--revo-blue)" }} />
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(1rem, 1.3vw, 1.2rem)", letterSpacing: "-0.02em",
                color: "var(--text)",
              }}>
                Outils & Environnement
              </h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {TOOLS.map((tool, i) => {
                const ToolIcon = tool.icon;
                return (
                  <motion.span
                    key={tool.name}
                    className="tool-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    whileHover={{ y: -2, scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ToolIcon size={13} strokeWidth={1.8} style={{ color: "var(--revo-blue)", flexShrink: 0 }} />
                    {tool.name}
                  </motion.span>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
