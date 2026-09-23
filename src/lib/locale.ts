import { routing } from "@/i18n/routing";

export type SiteLocale = (typeof routing.locales)[number];

/**
 * Choisit la langue du site pour une adresse sans préfixe (/, /terms-of-use…).
 * 1. Langue déjà choisie sur le site (cookie NEXT_LOCALE posé par next-intl).
 * 2. Sinon Accept-Language, règle historique de la racine : anglais si la
 *    langue préférée est l'anglais, français dans tous les autres cas
 *    (en-tête absent, allemand…). ⚠️ Volontairement différent de
 *    routing.defaultLocale ("en"), qui ne sert qu'à next-intl.
 * e.g. "en-GB,en;q=0.9,fr;q=0.8" → "en"
 */
export function pickLocale(
  acceptLanguage: string | null | undefined,
  cookieLocale?: string | null
): SiteLocale {
  if (cookieLocale && (routing.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as SiteLocale;
  }
  return pickLocaleFromAcceptLanguage(acceptLanguage);
}

export function pickLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined
): SiteLocale {
  const preferred =
    (acceptLanguage ?? "")
      .split(",")
      .map((entry) => {
        // "en-US; q=0.5" → lang "en-us", q 0.5 (espaces et autres paramètres tolérés)
        const [lang, ...params] = entry.split(";").map((part) => part.trim());
        const qParam = params.find((p) => /^q\s*=/i.test(p));
        const q = qParam ? parseFloat(qParam.split("=")[1]) : 1;
        return { lang: lang.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
      })
      // q=0 = « pas acceptable » ; entrée vide = en-tête mal formé
      .filter((entry) => entry.lang !== "" && entry.q > 0)
      .sort((a, b) => b.q - a.q)[0]?.lang ?? "";

  return preferred.startsWith("en") ? "en" : "fr";
}
