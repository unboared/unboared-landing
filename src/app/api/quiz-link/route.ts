import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";

// Landing UnQuiz, visiteur sur téléphone : on lui envoie le lien du show pour
// l'ouvrir sur un ordinateur. Même risque que /api/demo-reminder (un email tapé par le
// visiteur, envoyé depuis noreply@unboared.com) → mêmes défenses, du moins
// cher au plus cher. Le contenu est fixe : aucun texte du visiteur dedans.
// L'adresse n'est stockée nulle part.

// --- Anti-abus (valeurs de demo-reminder) ---
// Délai minimal entre l'ouverture du panneau et l'envoi : un seul champ (l'autofill
// peut être rapide), on ne bloque que les scripts bruts.
const MIN_FILL_MS = 1_500;
const MAX_EMAIL = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Un visiteur a besoin d'un lien, deux en cas de faute de frappe. Par IP :
const perIp = createRateLimiter(3, 60 * 60 * 1_000);
// Même destinataire : 2 liens par jour au plus, quel que soit le demandeur.
const perRecipient = createRateLimiter(2, 24 * 60 * 60 * 1_000);
// Plafond par instance, toutes IP confondues : limite une attaque distribuée.
const perInstance = createRateLimiter(30, 60 * 60 * 1_000);

/** Le lien TV envoyé par email (utm_medium distinct du CTA de la page). */
function tvLink(lang: "fr" | "en") {
  const url = new URL("https://unquizz-v2.web.app/");
  url.searchParams.set("utm_source", "quiz-landing");
  url.searchParams.set("utm_medium", "email-link");
  url.searchParams.set("utm_campaign", "wedge-lot1");
  url.searchParams.set("lng", lang);
  return url.toString();
}

// Accepté en silence (un bot n'a aucun signal pour s'adapter) mais journalisé,
// pour repérer un vrai visiteur bloqué à tort dans les logs Vercel.
function drop(reason: string, email: unknown) {
  console.warn(`[quiz-link] dropped (${reason}):`, {
    email: String(email ?? "").slice(0, 80),
  });
  return NextResponse.json({ success: true });
}

function originHost(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null; // ex. "null" depuis une iframe sandboxée
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  }

  const { email, locale, renderedAt } = body;

  // 1. POST cross-site : un navigateur envoie toujours Origin sur un fetch POST.
  //    S'il nomme un autre site, quelqu'un a branché notre endpoint ailleurs.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && originHost(origin) !== host) {
    return drop("cross-origin", email);
  }

  // 2. Honeypot : `quiz_ref` est un champ caché, vide pour un humain.
  if (typeof body.quiz_ref === "string" && body.quiz_ref.trim() !== "") {
    return drop("honeypot", email);
  }

  // 3. Timing. Pas d'horodatage = POST scripté. Écart négatif = horloge du
  //    visiteur en avance sur la nôtre (fréquent sur mobile) → vrai visiteur.
  const elapsed =
    typeof renderedAt === "number" && renderedAt > 0 ? Date.now() - renderedAt : null;
  if (elapsed === null) {
    return drop("no-timestamp", email);
  }
  if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return drop("too-fast", email);
  }

  // 4. Adresse invalide → erreur réelle, corrigeable par le visiteur.
  if (typeof email !== "string" || email.length > MAX_EMAIL || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  }
  const to = email.trim();

  // 5. Limites (par IP, par destinataire, par instance).
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
  const link = tvLink(isEn ? "en" : "fr");

  const sent = await sendEmail("quiz-link", {
    from: "UnQuiz <noreply@unboared.com>",
    to,
    subject: isEn ? "Your UnQuiz link for your computer 💻" : "Votre lien UnQuiz pour l'ordinateur 💻",
    text: isEn
      ? `Hi!\n\nHere's your UnQuiz link:\n${link}\n\nOpen it on a computer (hooked up to the TV is even better), then everyone scans the QR code on screen with their phone.\n\nEnjoy the show!\nThe UnQuiz team`
      : `Bonjour !\n\nVoici votre lien UnQuiz :\n${link}\n\nOuvrez-le sur un ordinateur (branché à la TV, c'est encore mieux), puis chacun scanne avec son téléphone le QR affiché à l'écran.\n\nBon show !\nL'équipe UnQuiz`,
  });

  if (!sent) {
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
