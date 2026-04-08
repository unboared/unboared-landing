import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, locale } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  const isEn = locale === "en";

  try {
    await resend.emails.send({
      from: "Unboared <noreply@unboared.com>",
      to: email,
      subject: isEn
        ? "Your Unboared demo link 🎮"
        : "Ton lien démo Unboared 🎮",
      text: isEn
        ? `Hi!\n\nYou requested a reminder to try the Unboared demo on your computer.\n\nHere's your link: https://console.unboared.com/demo\n\nSee you there!\nThe Unboared team`
        : `Bonjour !\n\nTu as demandé un rappel pour tester la démo Unboared sur ton ordinateur.\n\nVoici ton lien : https://console.unboared.com/demo\n\nÀ tout de suite !\nL'équipe Unboared`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}
