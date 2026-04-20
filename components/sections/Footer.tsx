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
    <footer style={{ padding: "clamp(2.5rem, 5vw, 4rem) 0 clamp(2rem, 4vw, 3rem)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

          <div style={{ display: "flex", gap: "1.75rem" }}>
            {CONTACT_LINKS.filter((l) => ["LinkedIn", "GitHub", "Facebook", "YouTube Gaming"].includes(l.label)).map(({ label, href }, i) => {
              const Icon = LINK_ICONS[label] || LINK_ICONS["Facebook Gaming"];
              return (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--revo-blue)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  {Icon && <Icon size={32} strokeWidth={1.5} />}
                </motion.a>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-tertiary)" }}>
               &copy; {new Date().getFullYear()} Mbaitadjim Abba Serge.
            </span>
            <div style={{ display: "flex", gap: 0, borderRadius: 3, overflow: "hidden", width: 30, height: 20, flexShrink: 0 }}>
              <div style={{ flex: 1, background: "#002664" }} />
              <div style={{ flex: 1, background: "#FECB00" }} />
              <div style={{ flex: 1, background: "#EA2839" }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
