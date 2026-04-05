"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, Youtube, Facebook } from "lucide-react";
import { CONTACT_LINKS } from "@/lib/data";

const LINK_ICONS: Record<string, typeof Mail> = {
  Email: Mail,
  Téléphone: Phone,
  LinkedIn: Linkedin,
  GitHub: Github,
  "YouTube Gaming": Youtube,
  "Facebook Gaming": Facebook,
};

export default function Footer() {
  return (
    <footer style={{ padding: "clamp(1.5rem, 3vw, 2rem) 0 clamp(1rem, 2vw, 1.5rem)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
            {new Date().getFullYear()} Mbaitadjim Abba Serge.
          </span>
          <div style={{ display: "flex", gap: "1rem" }}>
            {CONTACT_LINKS.filter((l) => l.label === "LinkedIn" || l.label === "GitHub").map(({ label, href }, i) => {
              const Icon = LINK_ICONS[label];
              return (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  style={{ color: "var(--text-tertiary)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
                >
                  {Icon && <Icon size={16} strokeWidth={1.5} />}
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
