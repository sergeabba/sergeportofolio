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

const SOCIAL_COLORS: Record<string, string> = {
  LinkedIn: "#0a66c2",
  GitHub: "#333",
  "YouTube Gaming": "#ff0000",
  Facebook: "#1877f2",
};

export default function Footer() {
  const socials = CONTACT_LINKS.filter((l) =>
    ["LinkedIn", "GitHub", "Facebook", "YouTube Gaming"].includes(l.label)
  );

  return (
    <footer style={{
      background: "var(--bg-layer)",
      borderTop: "1px solid var(--border)",
      padding: "clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3rem)",
    }}>
      <div className="container">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>

          {/* Logo + tagline */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--revo-black)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "0.75rem", color: "#fff", letterSpacing: "0.02em",
              boxShadow: "var(--shadow-md)",
            }}>
              AS
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-tertiary)", letterSpacing: "0.04em" }}>
              Data · IA · Design
            </span>
          </div>

          {/* Social icons avec badges */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {socials.map(({ label, href }) => {
              const Icon = LINK_ICONS[label] || LINK_ICONS["Facebook Gaming"];
              const color = SOCIAL_COLORS[label] || "var(--text-secondary)";
              return (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    boxShadow: "var(--shadow-sm)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = color;
                    e.currentTarget.style.borderColor = `${color}40`;
                    e.currentTarget.style.background = `${color}10`;
                    e.currentTarget.style.boxShadow = `var(--shadow-md), 0 0 0 1px ${color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--bg-elevated)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  {Icon && <Icon size={20} strokeWidth={1.6} />}
                </motion.a>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "var(--border)" }} />

          {/* Copyright */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
              &copy; {new Date().getFullYear()} Mbaitadjim Abba Serge
            </span>
            <svg width="22" height="15" viewBox="0 0 30 20" style={{ borderRadius: 2, flexShrink: 0 }}>
              <rect x="0" y="0" width="10" height="20" fill="#002664" />
              <rect x="10" y="0" width="10" height="20" fill="#FECB00" />
              <rect x="20" y="0" width="10" height="20" fill="#EA2839" />
            </svg>
          </div>

        </div>
      </div>
    </footer>
  );
}
