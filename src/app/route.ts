import { redirectToLocalized } from "@/lib/localeRedirect";

// Racine : redirige vers /fr ou /en selon Accept-Language, en gardant TOUT le
// query string (fbclid, utm_*, gclid…) — les pubs Meta pointent sur /?fbclid=…
// et l'attribution jusqu'à Stripe en dépend.
export function GET(request: Request) {
  return redirectToLocalized(request, "");
}
