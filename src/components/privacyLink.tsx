import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Balise <link> des mentions sous les formulaires : lien vers la politique de
 * confidentialité dans la langue de la page. Nouvel onglet pour ne pas perdre
 * ce que le visiteur a déjà tapé dans le formulaire.
 * Usage : t.rich("privacyNote", { link: privacyLink })
 */
export function privacyLink(chunks: ReactNode) {
  return (
    <Link
      href="/privacy-policy"
      target="_blank"
      rel="noopener"
      className="privacy-link"
    >
      {chunks}
    </Link>
  );
}
