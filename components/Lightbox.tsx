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
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
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
      style={{ background: "rgba(3,2,9,0.97)", backdropFilter: "blur(20px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vue agrandie"
    >
      <motion.div
        className="relative w-full max-w-5xl"
        style={{ maxHeight: "88vh" }}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
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

      <motion.button
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center"
        style={{
          background: "rgba(201,168,92,0.1)",
          border: "1px solid rgba(201,168,92,0.25)",
          color: "var(--color-gold)",
          fontFamily: "var(--font-display)",
          fontSize: "0.9rem",
          cursor: "pointer",
          borderRadius: "1px",
        }}
        whileHover={{ background: "rgba(201,168,92,0.2)" }}
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </motion.button>
    </motion.div>
  );
}