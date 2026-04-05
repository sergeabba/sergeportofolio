"use client";

import { smoothScrollTo } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => smoothScrollTo("bio")}
          aria-label="Retour en haut de page"
          title="Retour en haut"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            width: 48,
            height: 48,
            borderRadius: "var(--radius-full)",
            background: "var(--revo-black)",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
            border: "1px solid var(--border-strong)",
            transition: "background 0.25s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--revo-blue)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--revo-black)"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
