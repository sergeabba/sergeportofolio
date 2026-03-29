"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(3,2,9,0.6)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  padding: "0.85rem 1rem",
  fontSize: "0.85rem",
  outline: "none",
  fontFamily: "var(--font-body)",
  fontWeight: 300,
  borderRadius: "1px",
  transition: "border-color 0.25s",
};

function Field({
  id, label, children,
}: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "0.45rem",
          fontFamily: "var(--font-display)",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          color: "rgba(201,168,92,0.45)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 4500);
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "rgba(201,168,92,0.45)";
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "var(--color-border)";
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field id="name" label="Nom">
          <input
            id="name" name="name" type="text" placeholder="Votre nom"
            required style={inputBase} onFocus={onFocus} onBlur={onBlur}
          />
        </Field>
        <Field id="email" label="Email">
          <input
            id="email" name="email" type="email" placeholder="votre@email.com"
            required style={inputBase} onFocus={onFocus} onBlur={onBlur}
          />
        </Field>
      </div>

      <Field id="subject" label="Sujet">
        <input
          id="subject" name="subject" type="text"
          placeholder="Projet, opportunité, collaboration…"
          style={inputBase} onFocus={onFocus} onBlur={onBlur}
        />
      </Field>

      <Field id="message" label="Message">
        <textarea
          id="message" name="message" rows={5}
          placeholder="Décrivez votre projet ou votre question…"
          required
          style={{ ...inputBase, resize: "none", lineHeight: 1.7 }}
          onFocus={onFocus} onBlur={onBlur}
        />
      </Field>

      <motion.button
        type="submit"
        className="gold-btn"
        style={{ padding: "1rem", marginTop: "0.25rem", fontSize: "0.82rem" }}
        disabled={status === "sending"}
        whileHover={status === "idle" ? { scale: 1.01 } : {}}
        whileTap={status === "idle" ? { scale: 0.99 } : {}}
        aria-live="polite"
      >
        {status === "idle"    && "→ Envoyer le message"}
        {status === "sending" && "Envoi en cours…"}
        {status === "success" && "✓ Message envoyé !"}
        {status === "error"   && "✕ Erreur — Réessayez"}
      </motion.button>
    </form>
  );
}