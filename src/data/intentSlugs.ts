/**
 * Adresses des pages d'intention, par langue. Module léger à part : la barre de
 * navigation (composant client) en a besoin pour le bouton FR/EN, sans embarquer
 * tout le texte des pages dans le JavaScript du navigateur.
 */

export type IntentKey = "blindtest" | "quiz" | "hosts";
export type IntentLocale = "fr" | "en";

export const INTENT_SLUGS: Record<IntentKey, Record<IntentLocale, string>> = {
  blindtest: { fr: "blind-test-bar", en: "music-quiz-pub" },
  quiz: { fr: "soiree-quiz-bar", en: "pub-quiz-software" },
  hosts: { fr: "animateurs", en: "quiz-hosts" },
};

export const INTENT_KEYS = Object.keys(INTENT_SLUGS) as IntentKey[];

/** Libellé court d'une page, pour les liens « Voir aussi » et le pied de page. */
export const INTENT_LINK_LABELS: Record<IntentKey, Record<IntentLocale, string>> = {
  blindtest: { fr: "Blind test pour bar", en: "Music quiz for pubs" },
  quiz: { fr: "Soirée quiz", en: "Pub quiz software" },
  hosts: { fr: "Animateurs et DJ", en: "Quiz hosts and DJs" },
};

export function intentKeyFromSlug(locale: string, slug: string): IntentKey | undefined {
  return INTENT_KEYS.find((key) => INTENT_SLUGS[key][locale as IntentLocale] === slug);
}
