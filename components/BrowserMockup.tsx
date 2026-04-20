"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  animate,
} from "framer-motion";

interface BrowserMockupProps {
  src: string;
  alt: string;
  url?: string;
  gallery?: string[];
  tags?: string[];
  onClick?: () => void;
}

export default function BrowserMockup({
  src,
  alt,
  url,
  gallery,
  tags,
  onClick,
}: BrowserMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 25,
  });

  const scrollY = useMotionValue(0);
  const scrollScale = useMotionValue(1);

  const allImages = [src, ...(gallery || [])];

  useEffect(() => {
    if (isHovered) {
      const sCtrl = animate(scrollScale, 1.1, {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      });
      const yCtrl = animate(scrollY, -25, {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      });
      return () => {
        sCtrl.stop();
        yCtrl.stop();
      };
    }
    const sCtrl = animate(scrollScale, 1, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    });
    const yCtrl = animate(scrollY, 0, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {
      sCtrl.stop();
      yCtrl.stop();
    };
  }, [isHovered, scrollY, scrollScale]);

  useEffect(() => {
    if (!isHovered || allImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % allImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  useEffect(() => {
    if (!isHovered) {
      const t = setTimeout(() => setActiveIdx(0), 600);
      return () => clearTimeout(t);
    }
  }, [isHovered]);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % allImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, allImages.length]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || isMobile) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY, isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleTouchStart = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setIsHovered(false), 1500);
  }, []);

  const currentSrc = allImages[activeIdx] || src;

  return (
    <div
      ref={containerRef}
      style={{ perspective: isMobile ? 600 : 800, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <motion.div
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: "preserve-3d",
          borderRadius: "var(--r-card)",
          overflow: "hidden",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
        }}
        animate={
          isHovered
            ? {
                boxShadow:
                  "0 0 0 1px var(--border-strong), 0 12px 32px -8px rgba(73,79,223,0.18)",
              }
            : {
                boxShadow:
                  "0 0 0 1px var(--border), 0 0 0 rgba(73,79,223,0)",
              }
        }
        transition={{ duration: 0.3 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.7rem",
            background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          </div>
          <div
            style={{
              flex: 1,
              background: "var(--bg-layer)",
              borderRadius: "var(--r-pill)",
              padding: "0.2rem 0.65rem",
              fontSize: "0.55rem",
              color: "var(--text-tertiary)",
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {url || alt}
          </div>
          <div style={{ display: "flex", gap: 4, opacity: isHovered ? 1 : 0.3, transition: "opacity 0.3s" }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--text-tertiary)", display: "inline-block" }} />
            <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--text-tertiary)", display: "inline-block" }} />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: isMobile ? 180 : 220,
            overflow: "hidden",
            background: "var(--bg-layer)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeIdx}-${currentSrc}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                inset: 0,
                y: scrollY,
                scale: scrollScale,
                transformOrigin: "center top",
              }}
            >
              <Image
                src={currentSrc}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                className="object-cover object-top"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>

          {tags && tags.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "0.5rem",
                left: "0.5rem",
                display: "flex",
                gap: "0.25rem",
                flexWrap: "wrap",
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    color: "var(--revo-black)",
                    borderRadius: 9999,
                    padding: "0.15rem 0.5rem",
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 70%, rgba(255,255,255,0.02) 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  bottom: "0.6rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 3,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  padding: "0.25rem 0.7rem",
                  borderRadius: "var(--r-pill)",
                  fontSize: "0.55rem",
                  fontWeight: 600,
                  backdropFilter: "blur(8px)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Explorer
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
