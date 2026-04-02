"use client";

import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";
import { CONTACT_LINKS } from "@/lib/data";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="mesh-surface"
      style={{ padding: "clamp(4rem, 8vw, 6.5rem) 0", position: "relative" }}
    >
      <div className="container">
        <FadeIn>
          <div className="section-badge">Contact</div>
          <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>
            Travaillons ensemble
          </h2>
          <p
            style={{
              color: "var(--text-faint)",
              fontSize: "0.9rem",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              maxWidth: "420px",
            }}
          >
            Un projet, une opportunité, ou simplement envie d&apos;échanger ? Je réponds rapidement.
          </p>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 3rem)",
            alignItems: "start",
          }}
        >
          {/* ── Liens de contact ── */}
          <FadeIn delay={0.1}>
            <address style={{ fontStyle: "normal", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {CONTACT_LINKS.map(({ label, value, href, icon }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="contact-link"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <div
                    className="skill-icon skill-icon-blue"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-md)",
                      marginBottom: 0,
                      flexShrink: 0,
                      fontSize: "0.78rem",
                    }}
                  >
                    {icon ?? String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className="label-tag"
                      style={{ fontSize: "0.58rem", marginBottom: 2, opacity: 0.7 }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                  <span style={{ color: "var(--primary)", opacity: 0.5, fontSize: "0.85rem" }} aria-hidden="true">
                    →
                  </span>
                </motion.a>
              ))}

              {/* CTA CV */}
              <motion.a
                href="/cv.pdf"
                download
                className="btn-primary"
                style={{ padding: "0.9rem", marginTop: "0.5rem", borderRadius: "var(--radius-md)", textAlign: "center" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                ↓ Télécharger le CV (PDF)
              </motion.a>
            </address>
          </FadeIn>

          {/* ── Formulaire ── */}
          <FadeIn delay={0.18}>
            <div
              style={{
                background: "var(--bg-card-solid)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-xl)",
                padding: "clamp(1.5rem, 3vw, 2.25rem)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--text)",
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
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