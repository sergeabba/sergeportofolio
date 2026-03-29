import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // ── Option 1 : Resend (recommandé en prod) ──
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "portfolio@sergeabba.com",
    //   to: "serge-mbaitadjim.abba@ism.edu.sn",
    //   subject: subject || `Nouveau message de ${name}`,
    //   html: `<p><b>De :</b> ${name} &lt;${email}&gt;</p><p>${message}</p>`,
    // });

    // ── Option 2 : Nodemailer SMTP ──
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ ... });

    // ── Dev : log en console ──
    console.log("📬 Nouveau message portfolio :", { name, email, subject, message });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
