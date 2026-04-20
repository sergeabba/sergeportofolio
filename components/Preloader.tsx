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
  const [phase, setPhase] = useState<"loading" | "revealing" | "exiting">("loading");
  const [lettersReady, setLettersReady] = useState(false);

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

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setLettersReady(true);
        setTimeout(() => setPhase("revealing"), 600);
        setTimeout(() => setPhase("exiting"), 1400);
        setTimeout(() => onDone(), 2200);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  const nameChars = (subName || name).split("");
  const subChars = subName ? name.split("") : [];

  return (
    <AnimatePresence>
      {phase !== "exiting" && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "var(--revo-black)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {/* Name reveal */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.3rem",
              overflow: "hidden",
            }}
          >
            {/* Main name row */}
            <div style={{ display: "flex", overflow: "hidden" }}>
              {nameChars.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={lettersReady || pct > 30 ? { y: "0%" } : { y: "110%" }}
                  transition={{
                    delay: 0.15 + i * 0.04,
                    duration: 0.65,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5.5vw, 4rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "-0.04em",
                    whiteSpace: "pre",
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Sub name row */}
            {subName && (
              <div style={{ display: "flex", overflow: "hidden" }}>
                {subChars.map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%" }}
                    animate={
                      lettersReady || pct > 50 ? { y: "0%" } : { y: "110%" }
                    }
                    transition={{
                      delay: 0.25 + i * 0.04,
                      duration: 0.65,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem, 4vw, 3rem)",
                      fontWeight: 500,
                      fontStyle: "italic",
                      color: "var(--revo-blue)",
                      letterSpacing: "-0.03em",
                      whiteSpace: "pre",
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{
              width: 200,
              height: 2,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 1,
              overflow: "hidden",
              transformOrigin: "left",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background:
                  "linear-gradient(90deg, var(--revo-blue), var(--accent-soft, #a78bfa))",
                borderRadius: 1,
                transition: "width 0.05s linear",
              }}
            />
          </motion.div>

          {/* Percentage */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily:
                "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
            }}
          >
            {pct}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
