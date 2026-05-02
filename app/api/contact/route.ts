import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";

const contactLimiter = rateLimit({ windowMs: 300_000, maxRequests: 3 });

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

type ContactRequest = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

/* ── Sender address ──
 * If you verified sergeabba.com on Resend, use: "Serge Abba <contact@sergeabba.com>"
 * Otherwise fall back to the free test sender (only delivers to account-owner email).
 */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed, retryAfterMs } = contactLimiter(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Réessayez dans quelques instants.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const body = (await req.json()) as ContactRequest;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const subject = body.subject?.trim() || `Nouveau message de ${name}`;
    const message = body.message?.trim() ?? "";

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (name.length > 100) {
      return NextResponse.json({ error: "Nom trop long (max 100 caractères)" }, { status: 400 });
    }
    if (subject.length > 200) {
      return NextResponse.json({ error: "Sujet trop long (max 200 caractères)" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message trop long (max 5000 caractères)" }, { status: 400 });
    }
    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.CONTACT_EMAIL ?? "abbaserge2@gmail.com";

    if (!RESEND_API_KEY) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── Production: envoi réel via Resend ──

    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #191c1f; margin-bottom: 16px;">Nouveau message depuis le portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f2f5; font-weight: 600; color: #6b7280; width: 100px;">Nom</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f2f5; color: #191c1f;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f2f5; font-weight: 600; color: #6b7280;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f2f5;"><a href="mailto:${escapeHtml(email)}" style="color: #494fdf;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f2f5; font-weight: 600; color: #6b7280;">Sujet</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f2f5; color: #191c1f;">${escapeHtml(subject)}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f0f2f5; border-radius: 8px;">
            <p style="font-weight: 600; color: #6b7280; margin-bottom: 8px;">Message :</p>
            <p style="color: #191c1f; white-space: pre-wrap; line-height: 1.7;">${escapeHtml(message)}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] resend error:", error.name);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi. Réessayez plus tard." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[contact] unexpected error:", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
