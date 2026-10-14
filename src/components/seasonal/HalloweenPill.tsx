import { getTranslations } from "next-intl/server";
import { URLS } from "@/lib/constants";

// Toujours présente dans le HTML statique, cachée par défaut : seule la classe
// `ub-halloween` posée sur <html> par HALLOWEEN_SCRIPT (src/lib/halloween.ts)
// l'affiche, avant le premier affichage → aucun décalage de mise en page.
export default async function HalloweenPill() {
  const t = await getTranslations("halloween");

  return (
    <a className="halloween-pill" href={URLS.signup}>
      <span aria-hidden="true">🎃</span>
      <span>
        <strong>{t("title")}</strong> {t("body")} <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}
