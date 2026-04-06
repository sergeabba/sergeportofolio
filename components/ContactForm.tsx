"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";
type Errors = { name?: string; email?: string; message?: string };

import type { Easing } from "framer-motion";
const ease: Easing = [0.22, 1, 0.36, 1];

function FieldLabel({ htmlFor, children, error }: { htmlFor: string; children: React.ReactNode; error?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        marginBottom: "0.45rem",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: error ? "var(--danger)" : "var(--text-tertiary)",
        transition: "color 0.2s",
      }}
    >
      {children}
    </label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.span
      key={msg}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease }}
      role="alert"
      style={{
        display: "block",
        fontSize: "0.7rem",
        color: "var(--danger)",
        marginTop: "0.3rem",
      }}
    >
      {msg}
    </motion.span>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function validate(d: { name: string; email: string; message: string }): Errors {
    const e: Errors = {};
    if (!d.name.trim())    e.name    = "Le nom est requis";
    if (!d.email.trim())   e.email   = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Format d'email invalide";
    if (!d.message.trim()) e.message = "Le message est requis";
    return e;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (timer.current) clearTimeout(timer.current);

    const form = e.currentTarget;
    const fd   = new FormData(form);
    const data = {
      name:    String(fd.get("name")    ?? "").trim(),
      email:   String(fd.get("email")   ?? "").trim(),
      subject: String(fd.get("subject") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      if (errs.name)    nameRef.current?.focus();
      else if (errs.email)  emailRef.current?.focus();
      else if (errs.message) msgRef.current?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("API error");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 6000);
  }

  /* ── Shared input class + error border ── */
  function inputClass(err?: string) {
    return err ? "form-input form-input--error" : "form-input";
  }

  return (
    <>
      {/* Extra rule to make error border override via className */}
      <style>{`
        .form-input--error { border-color: var(--danger) !important; }
        .form-input:focus   { border-color: var(--revo-blue) !important; box-shadow: 0 0 0 3px rgba(73,79,223,0.14); }
      `}</style>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Formulaire de contact"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* Name + Email inline */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <FieldLabel htmlFor="cf-name" error={!!errors.name}>Nom *</FieldLabel>
            <input
              ref={nameRef}
              id="cf-name" name="name" type="text"
              placeholder="Votre nom"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className={inputClass(errors.name)}
            />
            <ErrorMsg msg={errors.name} />
          </div>
          <div>
            <FieldLabel htmlFor="cf-email" error={!!errors.email}>Email *</FieldLabel>
            <input
              ref={emailRef}
              id="cf-email" name="email" type="email"
              placeholder="you@gmail.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={inputClass(errors.email)}
            />
            <ErrorMsg msg={errors.email} />
          </div>
        </div>

        {/* Subject */}
        <div>
          <FieldLabel htmlFor="cf-subject">Sujet</FieldLabel>
          <input
            id="cf-subject" name="subject" type="text"
            placeholder="Projet, stage, collaboration…"
            className="form-input"
          />
        </div>

        {/* Message */}
        <div>
          <FieldLabel htmlFor="cf-message" error={!!errors.message}>Message *</FieldLabel>
          <textarea
            ref={msgRef}
            id="cf-message"
            name="message"
            rows={5}
            placeholder="Décrivez votre projet, votre besoin, ou posez-moi une question…"
            aria-invalid={!!errors.message}
            className={inputClass(errors.message)}
          />
          <ErrorMsg msg={errors.message} />
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={{ scale: status === "idle" ? 1.015 : 1 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            background:
              status === "success" ? "#00a87e" :
              status === "error"   ? "#e23b4a" :
              "#191c1f",
          }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", padding: "0.9rem",
            width: "100%", borderRadius: "9999px",
            border: "none", cursor: status === "sending" ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)", fontWeight: 500,
            fontSize: "0.9rem", letterSpacing: "0.01em",
            color: "#ffffff", minHeight: 50,
            opacity: status === "sending" ? 0.75 : 1,
          }}
          aria-live="polite"
        >
          {status === "idle"    && "Envoyer le message →"}
          {status === "success" && "✓ Message envoyé !"}
          {status === "error"   && "✕ Erreur — réessayez"}
          {status === "sending" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              Envoi en cours
              <span style={{ display: "inline-flex", gap: 3 }}>
                {[0,1,2].map(i => (
                  <motion.span
                    key={i}
                    style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff", display: "block" }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </span>
            </span>
          )}
        </motion.button>

        {/* Status message */}
        {(status === "success" || status === "error") && (
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease }}
            aria-live="polite" role="status"
            style={{
              fontSize: "0.8rem", textAlign: "center",
              color: status === "success" ? "var(--revo-mint)" : "var(--danger)",
              lineHeight: 1.6,
            }}
          >
            {status === "success"
              ? "Votre message a bien été envoyé. Je vous réponds très vite !"
              : "Une erreur est survenue. Réessayez ou écrivez-moi directement par email."}
          </motion.p>
        )}
      </form>
    </>
  );
}