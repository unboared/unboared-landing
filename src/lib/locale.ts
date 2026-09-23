export type SiteLocale = "fr" | "en";

/**
 * Choisit la langue du site à partir de l'en-tête Accept-Language.
 * Règle historique de la racine (/) : anglais si la langue préférée est
 * l'anglais, français dans tous les autres cas (en-tête absent, allemand…).
 * e.g. "en-GB,en;q=0.9,fr;q=0.8" → "en"
 */
export function pickLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined
): SiteLocale {
  const preferred =
    (acceptLanguage ?? "")
      .split(",")
      .map((entry) => {
        const [lang, q] = entry.trim().split(";q=");
        return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q)[0]?.lang ?? "";

  return preferred.startsWith("en") ? "en" : "fr";
}
