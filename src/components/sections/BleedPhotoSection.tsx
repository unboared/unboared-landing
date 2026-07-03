import { getTranslations } from "next-intl/server";
import Image from "next/image";

/** Photo full-bleed : la vraie salle, un jeudi soir au Ninkasi. */
export default async function BleedPhotoSection() {
  const t = await getTranslations("bleed");

  return (
    <section className="bleed" aria-label={t("aria")}>
      <Image
        className="bg"
        src="/images/photos/bar-ninkasi-soiree.webp"
        alt={t("alt")}
        fill
        sizes="100vw"
        loading="lazy"
      />
      <div className="scrim" aria-hidden="true" />
      <div className="wrap bleed-inner">
        <p className="where">{t("where")}</p>
        <h2 data-reveal>{t("title")}</h2>
      </div>
    </section>
  );
}
