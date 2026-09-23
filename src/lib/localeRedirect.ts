import { pickLocale } from "./locale";

/**
 * Redirige une adresse sans préfixe de langue (/, /terms-of-use…) vers
 * /fr/… ou /en/… (langue déjà choisie sur le site, sinon Accept-Language),
 * en conservant tout le query string (fbclid, utm_*, gclid…). Next normalise
 * l'encodage (ex. %20 → +), sans changer les valeurs lues par URLSearchParams.
 * 307 (temporaire) : pas mise en cache définitivement par les navigateurs,
 * on peut changer la cible plus tard.
 */
export function redirectToLocalized(request: Request, path: string) {
  const locale = pickLocale(
    request.headers.get("accept-language"),
    readCookie(request.headers.get("cookie"), "NEXT_LOCALE")
  );
  // Un « ? » seul donne une chaîne vide.
  const rawQuery = new URL(request.url).search;
  // Location relative : garde le domaine d'origine (unboared.com, preview Vercel…).
  const target = `/${locale}${path}${rawQuery}`;

  return new Response(null, {
    status: 307,
    headers: {
      Location: target,
      // La réponse dépend du visiteur : ne pas la partager en cache.
      Vary: "Accept-Language, Cookie",
      "Cache-Control": "private, no-store",
    },
  });
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}
