"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { smoothScrollTo } from "@/lib/utils";

/**
 * Bouton "Retour en haut" - apparaît après scroll
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    smoothScrollTo("bio");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={handleClick}
          aria-label="Retour en haut de page"
          title="Retour en haut"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            width: 48,
            height: 48,
            borderRadius: "var(--radius-full)",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            zIndex: 40,
            boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
            transition: "background 0.2s, transform 0.2s",
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
