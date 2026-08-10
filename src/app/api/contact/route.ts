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

// Silently accept (a bot gets no signal to adapt) BUT log the payload so a
// wrongly-flagged genuine message can be recovered from the server logs — the
// whole point of the form is to not lose leads.
function drop(reason: string, data: Record<string, unknown>) {
  console.warn(`[contact] dropped (${reason}):`, {
    name: String(data.name ?? "").slice(0, 60),
    email: String(data.email ?? "").slice(0, 80),
    message: String(data.message ?? "").slice(0, 200),
  });
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { name, email, message, renderedAt } = body;
  const honeypot = body.contact_ref;

  // 1. Honeypot: `contact_ref` is a hidden field. Humans never see it; bots
  //    fill every field. Its name is deliberately non-standard so browser
  //    autofill / password managers don't populate it for real users.
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return drop("honeypot", body);
  }

  // 2. Timing. Real browsers always send `renderedAt` (a client timestamp taken
  //    at mount); a missing one means a raw scripted POST → bot. A submission
  //    faster than a human is a bot. But a NEGATIVE elapsed only means the
  //    visitor's clock runs ahead of the server's (common on mobile) — that is
  //    a real user, so let it through rather than silently dropping their lead.
  const elapsed =
    typeof renderedAt === "number" && renderedAt > 0 ? Date.now() - renderedAt : null;
  if (elapsed === null) {
    return drop("no-timestamp", body);
  }
  if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return drop("too-fast", body);
  }

  // 3. Required fields — genuine, user-fixable error.
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  // 4. Bad types or invalid email are user-fixable → return a real error so a
  //    genuine visitor learns to correct it instead of getting a false success.
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  }

  // 5. Oversized or link-stuffed payloads are bot signals → drop (logged).
  if (
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    message.length > MAX_MESSAGE ||
    countLinks(message) > MAX_LINKS
  ) {
    return drop("shape", body);
  }

  // 6. Best-effort per-IP throttle.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (rateLimited(ip)) {
    return drop("rate-limit", body);
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
