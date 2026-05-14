"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  name: string;
  subName?: string;
  onDone: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Preloader({ name, subName, onDone }: PreloaderProps) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done" | "exit">("loading");
  const [show, setShow] = useState(false);

  const stableDone = useCallback(onDone, []);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 2200;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPct(Math.round(eased * 100));

      if (progress >= 0.2 && !show) setShow(true);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        setTimeout(() => setPhase("exit"), 700);
        setTimeout(() => stableDone(), 1600);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stableDone]);

  // "Abba Serge" = name, "Mbaitadjim" = subName
  const mainName = subName || name;
  const subText = subName ? name : undefined;
  const words = mainName.split(" ");

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", background: "#191c1f", overflow: "hidden",
          }}
        >
          {/* Orb */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.13, 0.07] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", width: 700, height: 700, borderRadius: "50%",
              background: "radial-gradient(circle, #494fdf 0%, transparent 70%)",
              filter: "blur(120px)", pointerEvents: "none",
            }}
          />

          {/* Name block */}
          <div style={{
            position: "relative", zIndex: 1,
            display: "flex", flexDirection: "column", alignItems: "center",
            /* Enough vertical padding so descenders and ascenders never clip */
            padding: "0.5em 1em",
            gap: "0.15em",
          }}>
            {/* Sub-name (last name) — smaller, colored, appears first */}
            {subText && (
              <div style={{ overflow: "hidden", paddingTop: "0.2em", paddingBottom: "0.2em" }}>
                <motion.span
                  initial={{ y: "110%" }}
                  animate={show ? { y: "0%" } : { y: "110%" }}
                  transition={{ delay: 0.05, duration: 0.75, ease }}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.1rem, 3vw, 2.2rem)",
                    fontWeight: 400,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {subText}
                </motion.span>
              </div>
            )}

            {/* Main name words — large, staggered */}
            {words.map((word, wi) => (
              <div
                key={wi}
                style={{
                  overflow: "hidden",
                  paddingTop: "0.15em",
                  paddingBottom: "0.15em",
                }}
              >
                <motion.span
                  initial={{ y: "110%" }}
                  animate={show ? { y: "0%" } : { y: "110%" }}
                  transition={{ delay: 0.18 + wi * 0.12, duration: 0.85, ease }}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(3rem, 10vw, 7.5rem)",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              position: "relative", zIndex: 1, marginTop: "3rem",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
            }}
          >
            <div style={{ width: 180, height: 1.5, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.06, ease: "linear" }}
                style={{ height: "100%", background: "linear-gradient(90deg, #494fdf, #a78bfa)", borderRadius: 2 }}
              />
            </div>
            <span style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              fontSize: "0.65rem", fontWeight: 500,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.14em",
              fontVariantNumeric: "tabular-nums",
            }}>
              {String(pct).padStart(3, "0")}
            </span>
          </motion.div>

          {/* Done line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase === "done" ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease }}
            style={{
              position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)",
              width: 50, height: 1,
              background: "linear-gradient(90deg, transparent, #494fdf, transparent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
