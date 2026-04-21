import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Unboared <noreply@unboared.com>",
      to: "contact@unboared.com",
      replyTo: email,
      subject: `[Contact] ${name} — ${email}`,
      text: `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}\n\n---\nRépondre directement : ${email}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="margin-bottom:4px">${name}</h2>
          <p style="margin:0;color:#666;font-size:14px">${email}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="white-space:pre-wrap;font-size:15px;line-height:1.6">${message}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <a href="mailto:${email}?subject=Re: Unboared"
             style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
            Répondre à ${name} →
          </a>
          <p style="margin-top:12px;font-size:12px;color:#999">
            Ou réponds directement à cet email — le reply-to est configuré sur ${email}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}
