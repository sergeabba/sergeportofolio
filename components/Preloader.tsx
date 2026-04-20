"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  name: string;
  subName?: string;
  onDone: () => void;
}

export default function Preloader({ name, subName, onDone }: PreloaderProps) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done" | "exit">("loading");
  const [showLetters, setShowLetters] = useState(false);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 2400;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPct(Math.round(eased * 100));

      if (progress >= 0.25 && !showLetters) setShowLetters(true);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        setTimeout(() => setPhase("exit"), 800);
        setTimeout(() => onDone(), 1700);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone, showLetters]);

  const mainName = subName || name;
  const subText = subName ? name : undefined;

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "2.5rem",
            background: "#191c1f",
            overflow: "hidden",
          }}
        >
          {/* Gradient orb */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.14, 0.08],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, #494fdf 0%, transparent 70%)",
              filter: "blur(100px)",
              pointerEvents: "none",
            }}
          />

          {/* Name container - no overflow hidden, use clipPath instead */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
              perspective: 600,
            }}
          >
            {/* Main name */}
            {mainName.split(" ").map((word, wi) => (
              <div key={wi} style={{ overflow: "hidden", paddingTop: "0.15em", paddingBottom: "0.15em" }}>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={showLetters ? { y: "0%" } : { y: "100%" }}
                  transition={{
                    delay: 0.1 + wi * 0.15,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.4rem, 7vw, 5rem)",
                    fontWeight: 900,
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

            {/* Sub name */}
            {subText && (
              <div style={{ overflow: "hidden", paddingTop: "0.1em", paddingBottom: "0.1em" }}>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={showLetters ? { y: "0%" } : { y: "100%" }}
                  transition={{
                    delay: 0.35,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    background: "linear-gradient(135deg, #494fdf, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.03em",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {subText}
                </motion.span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <div
              style={{
                width: 200,
                height: 2,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #494fdf, #a78bfa)",
                  borderRadius: 2,
                }}
              />
            </div>

            <span
              style={{
                fontFamily:
                  "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                fontSize: "0.7rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.12em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(pct).padStart(2, "0")}%
            </span>
          </div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase === "done" ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "12%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 1,
              background: "linear-gradient(90deg, transparent, #494fdf, transparent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
