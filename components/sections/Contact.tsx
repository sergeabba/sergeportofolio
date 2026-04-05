"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section id="contact" style={{ background: "var(--bg)", padding: "clamp(4rem, 8vw, 6.5rem) 0" }}>
      {/* CTA Banner */}
      <div className="container" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <FadeIn y={30}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--text)", marginBottom: "1rem" }}>
            Prêt à transformer la donnée en&nbsp;décisions&nbsp;?
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 500, lineHeight: 1.7, margin: "0 auto" }}>
            Que ce soit pour un stage, un projet freelance, ou une opportunité en entreprise.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.75rem", justifyContent: "center" }}>
            <a href="/cv.pdf" download className="btn-primary">Télécharger CV</a>
            <a href="#contact-form" className="btn-glass">Me contacter</a>
          </div>
        </FadeIn>
      </div>

      <div className="divider" style={{ maxWidth: 1160, margin: "0 auto 3.5rem" }} />

      {/* Form Section */}
      <div className="container" id="contact-form" style={{ maxWidth: 1160 }}>
        <FadeIn y={30}>
          <div className="section-eyebrow">Contact</div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(2.5rem, 5vw, 5rem)", alignItems: "start" }}>
          {/* Left: Info */}
          <FadeIn y={30} delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { label: "Email", value: "abbaserge2@gmail.com", href: "mailto:abbaserge2@gmail.com" },
                { label: "Téléphone", value: "78 546 08 74", href: "tel:+221785460874" },
                { label: "LinkedIn", value: "linkedin.com/in/sergeabba", href: "https://linkedin.com/in/sergeabba" },
                { label: "GitHub", value: "github.com/sergeabba", href: "https://github.com/sergeabba" },
                { label: "YouTube", value: "@thelegendofdon4125", href: "https://www.youtube.com/@thelegendofdon4125" },
                { label: "Facebook", value: "The Legend of Don", href: "https://www.facebook.com/thelegendofdon/followers" },
              ].map(({ label, value, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") || href.startsWith("tel") ? undefined : "_blank"}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", borderBottom: `1px solid var(--border${i === 0 ? "-strong" : ""})`, textDecoration: "none", color: "var(--text)", transition: "color 0.2s, padding-left 0.2s" }}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--revo-blue)"; e.currentTarget.style.paddingLeft = "0.5rem"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.paddingLeft = "0"; }}
                >
                  <span style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-tertiary)", minWidth: 70 }}>{label}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, fontFamily: "var(--font-body)", color: "inherit" }}>{value}</span>
                </motion.a>
              ))}
            </div>
          </FadeIn>

          {/* Right: Form */}
          <FadeIn y={30} delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.4rem", letterSpacing: "-0.02em", color: "var(--text)" }}>
                Envoyez un message
              </h3>
              <div className="card-flat" style={{ padding: "clamp(1.25rem, 2.5vw, 2rem)", background: "var(--bg-elevated)" }}>
                <ContactForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
