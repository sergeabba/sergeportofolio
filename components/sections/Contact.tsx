"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";
import { CONTACT_LINKS } from "@/lib/data";

import type { ReactNode } from "react";

const CONTACT_ICONS: Record<string, ReactNode> = {
  "Email": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 4 12 13 2 4"/></svg>
  ),
  "Telephone": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.81.32 1.6.55 2.38a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.78.23 1.57.43 2.38.55A2 2 0 0 1 22 16.92z"/></svg>
  ),
  "LinkedIn": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0 2 2 0 0 0-2-2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
  ),
  "GitHub": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
  ),
};

export default function Contact() {
  return (
    <section id="contact" style={{ padding: "clamp(6rem, 10vw, 9rem) 0", position: "relative", overflow: "hidden", background: "var(--bg)" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <FadeIn y={30}>
          <div className="section-label">Contact</div>
          <h2 className="section-heading">Travaillons ensemble</h2>
          <p className="section-desc" style={{ marginTop: "0.6rem" }}>
            Un projet, une opportunité, ou simplement envie d&apos;échanger ? Je réponds rapidement.
          </p>
        </FadeIn>

        <div className="container" style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
          <div className="glow-line" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(2.5rem, 5vw, 4rem)",
            alignItems: "start",
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {/* Links */}
          <FadeIn delay={0.1}>
            <address style={{ fontStyle: "normal", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {CONTACT_LINKS.map(({ label, value, href }, i) => {
                const icon = CONTACT_ICONS[label] || (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                );
                return (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="contact-item"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Icon */}
                    <div style={{ width: 34, height: 34, borderRadius: "8px", flexShrink: 0, background: "var(--bg-layer)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-soft)" }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.58rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                        {label}
                      </div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {value}
                      </div>
                    </div>
                    <span style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  </motion.a>
                );
              })}

              {/* CV */}
              <motion.a
                href="/cv.pdf"
                download
                className="btn-glass"
                style={{ marginTop: "0.5rem", justifyContent: "center", padding: "0.9rem" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Télécharger le CV (PDF)
              </motion.a>
            </address>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={0.2}>
            <motion.div
              className="glass-strong"
              style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "1.75rem", letterSpacing: "-0.02em" }}>
                Envoyez un message
              </h3>
              <ContactForm />
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
