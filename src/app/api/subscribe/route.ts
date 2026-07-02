import { NextResponse } from "next/server";

// --- Anti-spam configuration ---
// Minimum time a real human takes to fill the form. Bots POST instantly.
// Lower than the contact form (3s): this form is a SINGLE email field, so a
// genuine visitor using browser autofill can legitimately submit in ~1-2s.
// The honeypot + rate-limit stay the primary defenses; timing is a cheap extra.
const MIN_FILL_MS = 1_500;
// Email length ceiling — anything above is not a genuine address.
const MAX_EMAIL = 200;
// Per-IP rate limit (best-effort, resets when the instance recycles).
const RATE_MAX = 5;
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

// Silently accept (a bot gets no signal to adapt) BUT log the payload so a
// wrongly-flagged genuine subscriber can be recovered from the server logs —
// the whole point of the form is to not lose leads.
function drop(reason: string, data: Record<string, unknown>) {
  console.warn(`[subscribe] dropped (${reason}):`, {
    email: String(data.email ?? "").slice(0, 80),
  });
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { email, renderedAt } = body;
  const honeypot = body.newsletter_ref;

  // 1. Honeypot: `newsletter_ref` is a hidden field. Humans never see it; bots
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

  // 3. Required field — genuine, user-fixable error.
  if (!email) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // 4. Bad type, invalid email or oversized value → user-fixable, return a real
  //    error so a genuine visitor learns to correct it instead of a false success.
  if (typeof email !== "string" || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // 5. Best-effort per-IP throttle.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (rateLimited(ip)) {
    return drop("rate-limit", body);
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const DC = process.env.MAILCHIMP_DC; // e.g. "us1", "us21"

  if (!API_KEY || !LIST_ID || !DC) {
    console.error("Mailchimp env vars missing");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  const url = `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = {
    email_address: email,
    status: "subscribed",
    tags: ["lead-magnet-checklist"],
  };

  const credentials = Buffer.from(`anystring:${API_KEY}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    // Already subscribed → treat as success
    if (res.status === 400 && json.title === "Member Exists") {
      return NextResponse.json({ success: true });
    }

    if (!res.ok) {
      console.error("Mailchimp error:", json);
      return NextResponse.json({ error: json.detail || "Erreur Mailchimp" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Erreur réseau" }, { status: 500 });
  }
}
