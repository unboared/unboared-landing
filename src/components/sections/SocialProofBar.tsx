import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { CLIENTS } from "@/data/clients";

/**
 * Preuve sociale : marquee des logos clients + les chiffres clés.
 * Tout est rendu côté serveur, en dur — jamais de compteur qui démarre à 0.
 */
export default async function SocialProofBar() {
  const t = await getTranslations("socialProof");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  const logoList = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {CLIENTS.map((client) => (
        <li key={client.name}>
          <Image
            src={client.logo}
            alt={hidden ? "" : client.name}
            width={150}
            height={30}
            loading="lazy"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Marquee logos */}
      <section className="social" aria-label={t("title")}>
        <p className="social-label">{t("title")}</p>
        <div className="marquee">
          <div className="marquee-track">
            {logoList(false)}
            {logoList(true)}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="section numbers">
        <div className="wrap">
          <h2 data-reveal>
            {t("numbersTitlePre")}
            <span className="mark">{t("numbersTitleMark")}</span>
            {t("numbersTitlePost")}
          </h2>
          <div className="numbers-grid">
            {stats.map((stat) => (
              <div className="num" data-reveal key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
