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
  liveUrl?: string;
  gallery?: string[];
  tags?: string[];
  onClick?: () => void;
}

export default function BrowserMockup({
  src,
  alt,
  url,
  liveUrl,
  gallery,
  tags,
  onClick,
}: BrowserMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Intersection observer — charge l'iframe seulement quand visible
  useEffect(() => {
    if (!liveUrl || isMobile) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [liveUrl, isMobile]);

  // Reset quand liveUrl change
  useEffect(() => {
    setIframeBlocked(false);
    setIframeReady(false);
  }, [liveUrl]);

  // 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 280, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 280, damping: 24 });

  // Scroll animation (image only)
  const scrollY = useMotionValue(0);
  const scrollScale = useMotionValue(1);

  const showIframe = !!(liveUrl && !iframeBlocked && !isMobile && inView);
  const allImages = [src, ...(gallery || [])];

  useEffect(() => {
    if (showIframe) return; // pas d'animation scroll si iframe
    if (isHovered) {
      const sCtrl = animate(scrollScale, 1.08, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
      const yCtrl = animate(scrollY, -22, { duration: 2.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" });
      return () => { sCtrl.stop(); yCtrl.stop(); };
    }
    const sCtrl = animate(scrollScale, 1, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    const yCtrl = animate(scrollY, 0, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    return () => { sCtrl.stop(); yCtrl.stop(); };
  }, [isHovered, scrollY, scrollScale, showIframe]);

  // Cycle gallery (hover, image mode only)
  useEffect(() => {
    if (showIframe || !isHovered || allImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % allImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, allImages.length, showIframe]);

  useEffect(() => {
    if (!isHovered) {
      const t = setTimeout(() => setActiveIdx(0), 600);
      return () => clearTimeout(t);
    }
  }, [isHovered]);

  // Mobile auto-cycle
  useEffect(() => {
    if (!isMobile || allImages.length <= 1) return;
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

  const currentSrc = allImages[activeIdx] || src;

  // Timeout fallback : si l'iframe met trop longtemps, on considère qu'elle est bloquée
  useEffect(() => {
    if (!showIframe) return;
    const t = setTimeout(() => {
      if (!iframeReady) setIframeBlocked(true);
    }, 6000);
    return () => clearTimeout(t);
  }, [showIframe, iframeReady]);

  return (
    <div
      ref={containerRef}
      style={{ perspective: isMobile ? 600 : 900, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 1500)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); }
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
            ? { boxShadow: "0 0 0 1px var(--border-strong), 0 16px 40px -8px rgba(73,79,223,0.22)" }
            : { boxShadow: "0 0 0 1px var(--border), 0 0 0 rgba(73,79,223,0)" }
        }
        transition={{ duration: 0.3 }}
      >
        {/* ── Browser chrome bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.7rem", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          </div>
          <div style={{
            flex: 1,
            background: "var(--bg-layer)",
            borderRadius: "var(--r-pill)",
            padding: "0.2rem 0.65rem",
            fontSize: "0.55rem",
            color: showIframe ? "var(--text-secondary)" : "var(--text-tertiary)",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.3s",
          }}>
            {url || alt}
          </div>
          {/* Live dot */}
          {showIframe && iframeReady && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex", alignItems: "center", gap: 3,
                fontSize: "0.45rem", fontWeight: 700, letterSpacing: "0.06em",
                color: "#28c840", textTransform: "uppercase",
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ width: 5, height: 5, borderRadius: "50%", background: "#28c840", display: "inline-block" }}
              />
              live
            </motion.span>
          )}
          <div style={{ display: "flex", gap: 4, opacity: isHovered ? 1 : 0.3, transition: "opacity 0.3s" }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--text-tertiary)", display: "inline-block" }} />
            <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--text-tertiary)", display: "inline-block" }} />
          </div>
        </div>

        {/* ── Content area ── */}
        <div style={{ position: "relative", height: isMobile ? 180 : 240, overflow: "hidden", background: "var(--bg-layer)" }}>

          {/* IFRAME (always shown when available + in view + not blocked) */}
          {showIframe && (
            <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
              {/* Skeleton loader */}
              <AnimatePresence>
                {!iframeReady && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: "absolute", inset: 0, zIndex: 3,
                      background: "var(--bg-elevated)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: "2px solid var(--border)",
                      borderTopColor: "var(--revo-blue)",
                      animation: "spin 0.7s linear infinite",
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
              <iframe
                ref={iframeRef}
                src={liveUrl}
                title={`Aperçu live — ${alt}`}
                style={{
                  width: "200%",
                  height: "200%",
                  border: "none",
                  transform: "scale(0.5)",
                  transformOrigin: "top left",
                  pointerEvents: "none",
                  background: "#fff",
                  display: "block",
                }}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                onLoad={(e) => {
                  try {
                    const doc = (e.target as HTMLIFrameElement).contentDocument;
                    if (!doc || doc.location.href === "about:blank") {
                      setIframeBlocked(true);
                    } else {
                      setIframeReady(true);
                    }
                  } catch {
                    // Cross-origin : on suppose que c'est chargé
                    setIframeReady(true);
                  }
                }}
                onError={() => setIframeBlocked(true)}
              />
            </div>
          )}

          {/* IMAGE (fallback ou si pas de liveUrl) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeIdx}-${currentSrc}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: showIframe ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                inset: 0,
                y: scrollY,
                scale: scrollScale,
                transformOrigin: "center top",
                zIndex: 1,
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

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", display: "flex", gap: "0.25rem", flexWrap: "wrap", pointerEvents: "none", zIndex: 10 }}>
              {tags.slice(0, 3).map((t) => (
                <span key={t} style={{ background: "rgba(255,255,255,0.88)", color: "var(--revo-black)", borderRadius: 9999, padding: "0.15rem 0.5rem", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.04em", backdropFilter: "blur(4px)" }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Shimmer overlay hover */}
          <motion.div
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 30%, rgba(73,79,223,0.08) 50%, transparent 70%)", pointerEvents: "none", zIndex: 5 }}
          />

          {/* Gradient bottom */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.22) 100%)", pointerEvents: "none", zIndex: 4 }} />

          {/* Gallery dots (image mode) */}
          {!showIframe && allImages.length > 1 && (
            <div style={{ position: "absolute", bottom: "0.55rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.3rem", zIndex: 6 }}>
              {allImages.map((_, idx) => (
                <motion.span
                  key={idx}
                  animate={{ width: idx === activeIdx ? 14 : 5, background: idx === activeIdx ? "#ffffff" : "rgba(255,255,255,0.4)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  style={{ height: 5, borderRadius: 9999, display: "inline-block", cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
                />
              ))}
            </div>
          )}

          {/* "Explorer" hint (image, single image) */}
          <AnimatePresence>
            {isHovered && !showIframe && allImages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                style={{ position: "absolute", bottom: "0.6rem", left: "50%", transform: "translateX(-50%)", zIndex: 6, background: "rgba(0,0,0,0.55)", color: "#fff", padding: "0.25rem 0.7rem", borderRadius: "var(--r-pill)", fontSize: "0.55rem", fontWeight: 600, backdropFilter: "blur(8px)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Explorer
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
