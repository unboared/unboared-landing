import { redirectToLocalized } from "@/lib/localeRedirect";
import { GOOGLE_SITE_VERIFICATION } from "@/lib/constants";

// Racine : redirige vers /fr ou /en selon Accept-Language, en gardant TOUT le
// query string (fbclid, utm_*, gclid…) — les pubs Meta pointent sur /?fbclid=…
// et l'attribution jusqu'à Stripe en dépend.
export function GET(request: Request) {
  // Le robot de vérification de Search Console lit la balise sur la racine
  // exacte (https://unboared.com/) : on la lui sert sans redirection. Les
  // visiteurs et Googlebot gardent la redirection habituelle.
  if ((request.headers.get("user-agent") ?? "").includes("Google-Site-Verification")) {
    return new Response(
      `<!doctype html><html><head><meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}"><title>Unboared</title></head><body></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } }
    );
  }
  return redirectToLocalized(request, "");
}
