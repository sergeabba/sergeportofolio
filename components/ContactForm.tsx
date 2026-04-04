"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

function Field({ id, label, children, error }: { id: string; label: string; children: React.ReactNode; error?: string }) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "0.4rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: error ? "var(--accent-rose)" : "var(--text-tertiary)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          id={errorId}
          role="alert"
          style={{
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: "var(--accent-rose)",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => { if (resetRef.current) clearTimeout(resetRef.current); }, []);

  function validateForm(data: { name: string; email: string; message: string }) {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!data.name.trim()) newErrors.name = "Le nom est requis";
    if (!data.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Email invalide";
    }
    if (!data.message.trim()) newErrors.message = "Le message est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (resetRef.current) clearTimeout(resetRef.current);
    setErrors({});

    const form = e.currentTarget;
    const data = {
      name: String(new FormData(form).get("name") ?? "").trim(),
      email: String(new FormData(form).get("email") ?? "").trim(),
      subject: String(new FormData(form).get("subject") ?? "").trim(),
      message: String(new FormData(form).get("message") ?? "").trim(),
    };

    if (!validateForm(data)) {
      setStatus("error");
      // Focus first invalid field
      if (errors.name) nameInputRef.current?.focus();
      else if (errors.email) emailInputRef.current?.focus();
      else if (errors.message) messageInputRef.current?.focus();
      resetRef.current = setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
    resetRef.current = setTimeout(() => setStatus("idle"), 5000);
  }

  const statusMessages = {
    idle: null,
    sending: "Envoi en cours...",
    success: "Votre message a bien été envoyé.",
    error: "Une erreur est survenue. Réessayez ou contactez directement par email.",
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem" }} aria-label="Formulaire de contact">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
        <Field id="name" label="Nom" error={errors.name}>
          <input
            ref={nameInputRef}
            id="name" name="name" type="text"
            placeholder="Votre nom" required autoComplete="name"
            className="form-input form-input-liquid"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            ref={emailInputRef}
            id="email" name="email" type="email"
            placeholder="votre@email.com" required autoComplete="email"
            className="form-input form-input-liquid"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>

      <Field id="subject" label="Sujet">
        <input
          id="subject" name="subject" type="text"
          placeholder="Projet, opportunité, collaboration…"
          className="form-input form-input-liquid"
        />
      </Field>

      <Field id="message" label="Message" error={errors.message}>
        <textarea
          ref={messageInputRef}
          id="message" name="message" rows={5}
          placeholder="Décrivez votre projet ou votre question…"
          required
          className="form-input form-input-liquid"
          style={{ resize: "vertical", lineHeight: 1.7, minHeight: 130 }}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>

      <motion.button
        type="submit"
        className="btn-primary"
        style={{ padding: "0.9rem", fontSize: "0.88rem", width: "100%", borderRadius: "var(--radius-md)" }}
        disabled={status === "sending"}
        whileHover={status === "idle" ? { scale: 1.01 } : {}}
        whileTap={status === "idle" ? { scale: 0.99 } : {}}
        aria-live="polite"
      >
        {status === "idle" && "Envoyer le message"}
        {status === "sending" && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Envoi en cours
            <span style={{ display: "inline-flex", gap: "3px" }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "currentColor",
                    display: "inline-block",
                  }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </span>
          </span>
        )}
        {status === "success" && "Message envoyé ✓"}
        {status === "error" && "Erreur -- Reessayez"}
      </motion.button>

      {status !== "idle" && (
        <motion.p
          aria-live="polite"
          role="status"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: "0.78rem",
            color: status === "success" ? "var(--green-400)" : "var(--accent-rose)",
            fontFamily: "var(--font-body)",
            textAlign: "center",
          }}
        >
          {statusMessages[status]}
        </motion.p>
      )}
    </form>
  );
}