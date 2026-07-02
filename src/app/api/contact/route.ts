import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// --- Anti-spam configuration ---
// Minimum time a real human takes to fill the form. Bots POST instantly.
const MIN_FILL_MS = 3_000;
// Field length ceilings — anything above is not a genuine message.
const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5_000;
// A real message rarely carries several links; bots love them.
const MAX_LINKS = 4;
// Per-IP rate limit (best-effort, resets when the instance recycles).
const RATE_MAX = 3;
const RATE_WINDOW_MS = 10 * 60 * 1_000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function countLinks(text: string): number {
  return (text.match(/https?:\/\/|www\.|\[url|<a\s/gi) ?? []).length;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { name, email, message, company, renderedAt } = body;

  // 1. Honeypot: `company` is a hidden field. Humans never see it; bots fill it.
  //    Pretend it worked so the bot gets no signal to adapt.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  // 2. Timing: a form submitted in under MIN_FILL_MS (or with no client
  //    timestamp at all — a raw scripted POST) is not a human.
  const elapsed = typeof renderedAt === "number" ? Date.now() - renderedAt : -1;
  if (elapsed < MIN_FILL_MS) {
    return NextResponse.json({ success: true });
  }

  // 3. Required fields.
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  // 4. Shape checks — reject silently to avoid teaching bots our rules.
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    message.length > MAX_MESSAGE ||
    !EMAIL_RE.test(email) ||
    countLinks(message) > MAX_LINKS
  ) {
    return NextResponse.json({ success: true });
  }

  // 5. Best-effort per-IP throttle.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ success: true });
  }

  try {
    await resend.emails.send({
      from: "Unboared <noreply@unboared.com>",
      to: "contact@unboared.com",
      replyTo: email,
      subject: `[Contact] Message de ${name}`,
      text: `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}
