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
    <footer style={{ padding: "clamp(2rem, 4vw, 3rem) 0 1.5rem", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        {/* Social links row */}
        <motion.div
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {CONTACT_LINKS.filter((l) => !["Email", "Téléphone"].includes(l.label)).map(({ label, href }, i) => {
            const Icon = LINK_ICONS[label];
            return (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass"
                style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, borderRadius: "50%" }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.15, y: -3 }}
                aria-label={label}
              >
                {Icon && <Icon style={{ color: "var(--text-tertiary)" }} size={16} strokeWidth={1.5} />}
              </motion.a>
            );
          })}
        </motion.div>

        {/* Copyright row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
            Copyright {new Date().getFullYear()} &middot; Mbaitadjim Abba Serge &mdash; Le Don
          </span>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--text-tertiary)", opacity: 0.5 }}>
              Next.js &middot; Tailwind &middot; Framer Motion
            </span>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border-strong)", opacity: 0.3 }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--text-tertiary)", opacity: 0.5 }}>
              Dakar, Sénégal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
