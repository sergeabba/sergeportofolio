"use client";

import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";
import { CONTACT_LINKS } from "@/lib/data";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" style={{ padding: "clamp(4rem,8vw,6.5rem) 0", background: "var(--bg-surface)" }}>
      <div className="container">
        <FadeIn>
          <div className="label-tag" style={{ color: "var(--primary)", marginBottom: "0.75rem" }}>Contact</div>
          <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>Travaillons ensemble</h2>
          <p style={{ color: "var(--text-faint)", fontSize: "0.9rem", marginBottom: "clamp(2.5rem,5vw,4rem)", maxWidth: "420px" }}>
            Un projet, une opportunité, ou simplement envie d&apos;échanger ? Je réponds rapidement.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
          {/* Links */}
          <FadeIn delay={0.1}>
            <address className="not-italic flex flex-col gap-3">
              {CONTACT_LINKS.map(({ label, value, href, icon }) => (
                <motion.a key={label} href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid var(--border)", background: "white", color: "inherit", textDecoration: "none" }}
                  whileHover={{ borderColor: "rgba(37,99,235,0.3)", x: 4, boxShadow: "0 4px 16px rgba(37,99,235,0.08)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--primary-xlight)", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: "var(--primary)" }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="label-tag" style={{ color: "var(--text-faint)", fontSize: "0.58rem" }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                  </div>
                  <span style={{ color: "var(--primary)", opacity: 0.4, fontSize: "0.9rem" }}>→</span>
                </motion.a>
              ))}
              <a href="/cv.pdf" download className="btn-primary" style={{ padding: "0.85rem", marginTop: "0.5rem", textAlign: "center", borderRadius: 12 }}>
                ↓ Télécharger le CV (PDF)
              </a>
            </address>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={0.2}>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(1.5rem,3vw,2.2rem)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "1.5rem" }}>
                Envoyez un message
              </h3>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
