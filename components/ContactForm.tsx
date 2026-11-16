"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "./site/Icons";
import { CONTACT_EMAIL } from "@/lib/data";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("website")) return; // champ piège anti-spam

    const data = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      subject: String(fd.get("subject") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    const errs: Errors = {};
    if (!data.name) errs.name = "Indiquez votre nom.";
    if (!data.email) errs.email = "Indiquez votre email.";
    else if (!EMAIL_RE.test(data.email)) errs.email = "Cet email ne semble pas valide.";
    if (!data.message) errs.message = "Écrivez votre message.";
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Erreur");
      setStatus({ kind: "ok", message: "Merci ! Votre message est bien parti, je vous réponds rapidement." });
      form.reset();
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error && err.message !== "Erreur"
            ? err.message
            : `L'envoi a échoué. Vous pouvez m'écrire directement à ${CONTACT_EMAIL}.`,
      });
    }
  }

  const field = (name: keyof Errors) => ({
    name,
    id: `cf-${name}`,
    className: "form-input",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `cf-${name}-err` : undefined,
  });

  const err = (name: keyof Errors) =>
    errors[name] ? (
      <span id={`cf-${name}-err`} className="form__error">
        {errors[name]}
      </span>
    ) : null;

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <div>
          <label htmlFor="cf-name">Nom</label>
          <input {...field("name")} type="text" autoComplete="name" maxLength={100} placeholder="Votre nom" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="cf-email">Email</label>
          <input {...field("email")} type="email" autoComplete="email" maxLength={254} placeholder="vous@exemple.com" />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor="cf-subject">
          Sujet <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(facultatif)</span>
        </label>
        <input id="cf-subject" name="subject" className="form-input" type="text" maxLength={200} placeholder="Rédaction, analyse de données, poste…" />
      </div>
      <div>
        <label htmlFor="cf-message">Message</label>
        <textarea {...field("message")} rows={6} maxLength={5000} placeholder="Parlez-moi de votre projet." />
        {err("message")}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="cf-website">Site web</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="polite">
        {(status.kind === "ok" || status.kind === "error") && (
          <p className={`form__status form__status--${status.kind === "ok" ? "ok" : "err"}`} role={status.kind === "error" ? "alert" : undefined}>
            {status.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn--ink" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Envoi en cours…" : "Envoyer le message"}
        <ArrowRight />
      </button>
    </form>
  );
}
