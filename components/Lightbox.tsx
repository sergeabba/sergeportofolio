"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useCallback } from "react";

interface LightboxProps {
  src: string;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
      style={{ background: "rgba(4, 8, 20, 0.97)", backdropFilter: "blur(24px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vue agrandie de l'image"
    >
      <motion.div
        className="relative w-full max-w-5xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "relative", width: "100%", height: "80vh" }}>
          <Image
            src={src}
            alt="Réalisation agrandie"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Fermer la vue agrandie"
      >
        ✕
      </button>
    </motion.div>
  );
}