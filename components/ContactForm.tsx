"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }

    /* Reset du statut après 4s */
    setTimeout(() => setStatus("idle"), 4000);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(3,2,10,0.5)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    padding: "0.75rem 1rem",
    fontSize: "0.82rem",
    outline: "none",
    fontFamily: "var(--font-body)",
  };

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "var(--color-gold)";
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "rgba(201,168,92,0.12)";
  }

  return (
    <div
      className="decorative-corners"
      style={{
        border: "1px solid var(--color-border)",
        padding: "2.5rem",
        background: "var(--color-surface)",
      }}
    >
      <div
        className="text-xl tracking-widest text-[var(--color-text)] mb-8"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
      >
        Envoyer un message
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-xs tracking-widest"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(201,168,92,0.5)",
                letterSpacing: "0.2em",
                fontSize: "0.62rem",
              }}
            >
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Votre nom"
              required
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-xs tracking-widest"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(201,168,92,0.5)",
                letterSpacing: "0.2em",
                fontSize: "0.62rem",
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              required
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block mb-2 text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(201,168,92,0.5)",
              letterSpacing: "0.2em",
              fontSize: "0.62rem",
            }}
          >
            Sujet
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Projet, opportunité, question..."
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block mb-2 text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(201,168,92,0.5)",
              letterSpacing: "0.2em",
              fontSize: "0.62rem",
            }}
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Décrivez votre projet ou question..."
            rows={5}
            required
            style={{ ...inputStyle, resize: "none" }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <motion.button
          type="submit"
          className="gold-btn w-full py-4"
          disabled={status === "sending"}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          aria-label="Envoyer le message"
        >
          {status === "idle" && "→ Envoyer le message"}
          {status === "sending" && "Envoi en cours..."}
          {status === "success" && "✓ Message envoyé !"}
          {status === "error" && "✕ Erreur — Réessayez"}
        </motion.button>
      </form>
    </div>
  );
}
