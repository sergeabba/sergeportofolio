"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "0.4rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.6rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(124,58,237,0.6)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function getStatusMessage(status: FormStatus): string {
  switch (status) {
    case "sending": return "Envoi en cours…";
    case "success": return "✓ Votre message a bien été envoyé.";
    case "error": return "✕ Une erreur est survenue. Réessayez.";
    default: return "";
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: ContactPayload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      resetTimerRef.current = setTimeout(() => setStatus("idle"), 4500);
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("CONTACT_REQUEST_FAILED");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }

    resetTimerRef.current = setTimeout(() => setStatus("idle"), 4500);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="name" label="Nom">
          <input
            id="name" name="name" type="text"
            placeholder="Votre nom" required autoComplete="name"
            className="form-input"
          />
        </Field>
        <Field id="email" label="Email">
          <input
            id="email" name="email" type="email"
            placeholder="votre@email.com" required autoComplete="email"
            className="form-input"
          />
        </Field>
      </div>

      <Field id="subject" label="Sujet">
        <input
          id="subject" name="subject" type="text"
          placeholder="Projet, opportunité, collaboration…" autoComplete="off"
          className="form-input"
        />
      </Field>

      <Field id="message" label="Message">
        <textarea
          id="message" name="message" rows={5}
          placeholder="Décrivez votre projet ou votre question…" required
          className="form-input"
          style={{ resize: "vertical", lineHeight: 1.7, minHeight: 130 }}
        />
      </Field>

      <motion.button
        type="submit"
        className="btn-primary"
        style={{ padding: "0.95rem", marginTop: "0.25rem", fontSize: "0.88rem", width: "100%" }}
        disabled={status === "sending"}
        whileHover={status === "idle" ? { scale: 1.01 } : {}}
        whileTap={status === "idle" ? { scale: 0.99 } : {}}
      >
        {status === "idle" && "→ Envoyer le message"}
        {status === "sending" && "Envoi en cours…"}
        {status === "success" && "✓ Message envoyé !"}
        {status === "error" && "✕ Erreur  Réessayez"}
      </motion.button>

      {status !== "idle" && (
        <motion.p
          aria-live="polite"
          role="status"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: "0.78rem",
            color: status === "success" ? "#34d399" : "#f87171",
            fontFamily: "var(--font-body)",
          }}
        >
          {getStatusMessage(status)}
        </motion.p>
      )}
    </form>
  );
}
