"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";

/**
 * Wrapper qui ajoute un spot iridescent au survol.
 * Passe --mx et --my en CSS custom props pour position,
 * et --spot-hue en CSS pour la couleur qui change doucement.
 */
export default function MouseSpotCard({ children, className, style, ...rest }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const hueRef = useRef(0);

  const hueTick = useCallback(() => {
    if (activeRef.current) {
      hueRef.current = (hueRef.current + 0.4) % 360;
      ref.current?.style.setProperty("--spot-hue", String(hueRef.current.toFixed(1)));
      rafRef.current = requestAnimationFrame(hueTick);
    }
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${x.toFixed(1)}%`);
    ref.current.style.setProperty("--my", `${y.toFixed(1)}%`);
  }, []);

  const onEnter = useCallback(() => {
    activeRef.current = true;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(hueTick);
  }, [hueTick]);

  const onLeave = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
    ref.current?.style.removeProperty("--spot-hue");
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </div>
  );
}