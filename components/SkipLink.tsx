"use client";

import { smoothScrollTo } from "@/lib/utils";

/**
 * Skip link - permet aux utilisateurs de clavier/screen readers
 * de sauter directement au contenu principal
 */
export default function SkipLink() {
  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollTo("bio");
  };

  return (
    <a
      href="#bio"
      onClick={handleSkip}
      style={{
        position: "absolute",
        top: "-100px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--primary)",
        color: "#fff",
        padding: "0.75rem 1.5rem",
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: "0.875rem",
        textDecoration: "none",
        zIndex: 9999,
        transition: "top 0.2s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = "1rem";
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = "-100px";
      }}
    >
      Aller au contenu
    </a>
  );
}
