import { pickLocaleFromAcceptLanguage } from "./locale";

/**
 * Redirige une adresse sans préfixe de langue (ex. /terms-of-use, enregistrée
 * dans Stripe) vers /fr/… ou /en/… selon Accept-Language, en gardant la query.
 * 307 (temporaire) : pas mise en cache définitivement par les navigateurs,
 * on peut changer la cible plus tard.
 */
export function redirectToLocalized(request: Request, path: string) {
  const locale = pickLocaleFromAcceptLanguage(
    request.headers.get("accept-language")
  );
  // Location relative : garde le domaine d'origine (unboared.com, preview Vercel…).
  const target = `/${locale}${path}${new URL(request.url).search}`;

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
