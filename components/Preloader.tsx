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

      if (progress >= 0.3 && !showLetters) setShowLetters(true);

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
            background: "#0d0c1d",
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
              background: "radial-gradient(circle, var(--revo-blue) 0%, transparent 70%)",
              filter: "blur(100px)",
              pointerEvents: "none",
            }}
          />

          {/* Name */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.15rem",
            }}
          >
            {/* Main name - word by word reveal */}
            <div style={{ overflow: "hidden" }}>
              <motion.div
                style={{ display: "flex", gap: "0.3em" }}
              >
                {mainName.split(" ").map((word, wi) => (
                  <motion.span
                    key={wi}
                    initial={{ y: "110%", rotateX: 40, opacity: 0 }}
                    animate={
                      showLetters
                        ? { y: "0%", rotateX: 0, opacity: 1 }
                        : { y: "110%", rotateX: 40, opacity: 0 }
                    }
                    transition={{
                      delay: 0.1 + wi * 0.12,
                      duration: 0.8,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                      fontWeight: 900,
                      color: "#ffffff",
                      letterSpacing: "-0.04em",
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Sub name */}
            {subText && (
              <div style={{ overflow: "hidden" }}>
                <motion.div style={{ display: "flex" }}>
                  {subText.split(" ").map((word, wi) => (
                    <motion.span
                      key={wi}
                      initial={{ y: "110%", opacity: 0 }}
                      animate={
                        showLetters
                          ? { y: "0%", opacity: 1 }
                          : { y: "110%", opacity: 0 }
                      }
                      transition={{
                        delay: 0.25 + wi * 0.1,
                        duration: 0.7,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.3rem, 3.5vw, 2.5rem)",
                        fontWeight: 500,
                        fontStyle: "italic",
                        background: "linear-gradient(135deg, var(--revo-blue), #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        letterSpacing: "-0.03em",
                        marginRight: "0.25em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
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
            {/* Bar */}
            <div
              style={{
                width: 220,
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
                  background:
                    "linear-gradient(90deg, var(--revo-blue), #a78bfa, #f43f5e)",
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Pct */}
            <span
              style={{
                fontFamily:
                  "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                fontSize: "0.72rem",
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
              background: "linear-gradient(90deg, transparent, var(--revo-blue), transparent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
