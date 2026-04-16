import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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
    const body = (await req.json()) as ContactRequest;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const subject = body.subject?.trim() || `Nouveau message de ${name}`;
    const message = body.message?.trim() ?? "";

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.CONTACT_EMAIL ?? "abbaserge2@gmail.com";

    if (!RESEND_API_KEY) {
      // ── Dev: log console uniquement ──
      console.log("📬 [DEV] Nouveau message portfolio — configurez RESEND_API_KEY pour l'envoi réel :");
      console.log({ name, email, subject, message });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── Production: envoi réel via Resend ──
    console.log(`📧 Sending email: from=${FROM_EMAIL} to=${TO_EMAIL} replyTo=${email}`);

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
      console.error("❌ Resend error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Erreur envoi email", details: error.message },
        { status: 500 },
      );
    }

    console.log("✅ Email sent successfully, id:", data?.id);
    return NextResponse.json({ success: true, emailId: data?.id }, { status: 200 });
  } catch (error) {
    console.error("❌ Contact API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
