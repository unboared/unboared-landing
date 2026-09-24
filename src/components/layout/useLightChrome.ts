import { usePathname } from "@/i18n/navigation";

/**
 * Pages « porte d'entrée mono-produit » (landing UnQuiz) : en-tête et pied de
 * page allégés — logo + langue, copyright + mentions légales. Le pitch B2B
 * reste accessible par le lien discret de la page elle-même.
 */
const LIGHT_CHROME_PATHS = ["/quiz"];

/** Chemin sans locale (next-intl) : /fr/quiz et /en/quiz → "/quiz". */
export function useLightChrome(): boolean {
  const pathname = usePathname();
  return LIGHT_CHROME_PATHS.includes(pathname);
}
