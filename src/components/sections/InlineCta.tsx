import { getTranslations } from "next-intl/server";
import { URLS } from "@/lib/constants";

/**
 * Bouton d'essai posé entre deux sections : avant lui, la page n'en avait
 * aucun entre le haut de page et les tarifs.
 */
export default async function InlineCta() {
  const t = await getTranslations("cta");

  return (
    <div className="inline-cta" data-reveal>
      <a className="btn btn-primary" href={URLS.signup}>
        {t("primary")}
      </a>
      <p>{t("small")}</p>
    </div>
  );
}
