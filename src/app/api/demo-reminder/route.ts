import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

// This endpoint emails an address typed by the visitor, from noreply@unboared.com.
// Unprotected, anyone could use it to bomb a third party's inbox with our name
// on it (and ruin the domain's sender reputation). Defenses below, cheapest
// first. The email content is fixed — no visitor text is ever put in it.

// --- Anti-abuse configuration ---
// Minimum time between opening the modal and submitting. The form is a single
// email field (autofill can be fast), so keep it low; it only stops raw scripts.
const MIN_FILL_MS = 1_500;
const MAX_EMAIL = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// A visitor needs one reminder, maybe two (typo). Per sending IP:
const perIp = createRateLimiter(3, 60 * 60 * 1_000);
// Same recipient: at most 2 reminders a day, whoever asks.
const perRecipient = createRateLimiter(2, 24 * 60 * 60 * 1_000);
// Hard ceiling per server instance, whatever the IP: caps the damage of a
// distributed attack. Real traffic is a handful of reminders a day.
const perInstance = createRateLimiter(30, 60 * 60 * 1_000);

// Silently accept (a bot gets no signal to adapt) but log why, so a wrongly
// flagged genuine visitor can be spotted in the Vercel logs.
function drop(reason: string, email: unknown) {
  console.warn(`[demo-reminder] dropped (${reason}):`, {
    email: String(email ?? "").slice(0, 80),
  });
  return NextResponse.json({ success: true });
}

function originHost(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null; // e.g. "null" from a sandboxed iframe
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  }

  const { email, locale, renderedAt } = body;

  // 1. Cross-site POST: a browser always sends Origin on a fetch POST. If it
  //    names another site, someone embedded our endpoint elsewhere.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && originHost(origin) !== host) {
    return drop("cross-origin", email);
  }

  // 2. Honeypot: `demo_ref` is a hidden field, empty for humans.
  if (typeof body.demo_ref === "string" && body.demo_ref.trim() !== "") {
    return drop("honeypot", email);
  }

  // 3. Timing. No timestamp = raw scripted POST. Negative elapsed = visitor's
  //    clock ahead of ours (common on mobile) → a real user, let through.
  const elapsed =
    typeof renderedAt === "number" && renderedAt > 0 ? Date.now() - renderedAt : null;
  if (elapsed === null) {
    return drop("no-timestamp", email);
  }
  if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return drop("too-fast", email);
  }

  // 4. Invalid address → user-fixable, real error.
  if (typeof email !== "string" || email.length > MAX_EMAIL || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  }
  const to = email.trim();

  // 5. Rate limits (per IP, per recipient, per instance).
  if (perIp(clientIp(request))) {
    return drop("rate-limit-ip", to);
  }
  if (perRecipient(to.toLowerCase())) {
    return drop("rate-limit-recipient", to);
  }
  if (perInstance("all")) {
    return drop("rate-limit-global", to);
  }

  const isEn = locale === "en";

  const sent = await sendEmail("demo-reminder", {
    from: "Unboared <noreply@unboared.com>",
    to,
    subject: isEn ? "Your Unboared demo link 🎮" : "Ton lien démo Unboared 🎮",
    text: isEn
      ? `Hi!\n\nYou requested a reminder to try the Unboared demo on your computer.\n\nHere's your link: https://console.unboared.com/demo\n\nSee you there!\nThe Unboared team`
      : `Bonjour !\n\nTu as demandé un rappel pour tester la démo Unboared sur ton ordinateur.\n\nVoici ton lien : https://console.unboared.com/demo\n\nÀ tout de suite !\nL'équipe Unboared`,
  });

  if (!sent) {
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
