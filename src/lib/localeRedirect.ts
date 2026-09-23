import { pickLocaleFromAcceptLanguage } from "./locale";

/**
 * Redirige une adresse sans préfixe de langue (/, /terms-of-use…) vers
 * /fr/… ou /en/… selon Accept-Language, en conservant le query string tel
 * quel (octet pour octet : fbclid, utm_*, gclid…).
 * 307 (temporaire) : pas mise en cache définitivement par les navigateurs,
 * on peut changer la cible plus tard.
 */
export function redirectToLocalized(request: Request, path: string) {
  const locale = pickLocaleFromAcceptLanguage(
    request.headers.get("accept-language")
  );
  // Query brute (sans re-encodage) ; un « ? » seul donne une chaîne vide.
  const rawQuery = new URL(request.url).search;
  // Location relative : garde le domaine d'origine (unboared.com, preview Vercel…).
  const target = `/${locale}${path}${rawQuery}`;

  return new Response(null, {
    status: 307,
    headers: {
      Location: target,
      // La réponse dépend de la langue du visiteur : ne pas la partager en cache.
      Vary: "Accept-Language",
      "Cache-Control": "private, no-store",
    },
  });
}
