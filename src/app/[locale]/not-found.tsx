import NotFoundGame from "@/components/NotFoundGame";

/**
 * 404 localisée — rendue dans le layout [locale] (header + footer + i18n).
 * Le contenu interactif vit dans NotFoundGame (client).
 */
export default function NotFound() {
  return <NotFoundGame />;
}
