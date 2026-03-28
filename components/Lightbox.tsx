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
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      style={{
        background: "rgba(3,2,10,0.98)",
        backdropFilter: "blur(24px)",
      }}
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
        style={{ height: "85vh" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Réalisation en vue agrandie"
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </motion.div>

      <motion.button
        className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center"
        style={{
          background: "var(--color-gold-dim)",
          border: "1px solid var(--color-border)",
          color: "var(--color-gold)",
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        whileHover={{ background: "rgba(201,168,92,0.25)" }}
        onClick={onClose}
        aria-label="Fermer la vue agrandie"
      >
        ✕
      </motion.button>
    </motion.div>
  );
}
