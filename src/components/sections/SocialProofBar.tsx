import { getFormatter, getTranslations } from "next-intl/server";
import Image from "next/image";
import { CLIENTS } from "@/data/clients";
import liveStats from "@/data/liveStats.json";

/**
 * Preuve sociale : marquee des logos clients + les chiffres clés.
 * Tout est rendu côté serveur, en dur — jamais de compteur qui démarre à 0.
 * Bandeau « 30 derniers jours » : chiffres agrégés de `data/liveStats.json` (soirées d'au moins
 * 5 joueurs, bars et animateurs, hors aéroports). Aucun nom de lieu, jamais.
 */
export default async function SocialProofBar() {
  const t = await getTranslations("socialProof");

  const format = await getFormatter();
  const live = [
    { value: format.number(liveStats.nights), label: t("liveNights") },
    { value: format.number(liveStats.venues), label: t("liveVenues") },
    { value: format.number(liveStats.players), label: t("livePlayers") },
  ];

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
          <div className="live" data-reveal>
            <p className="live-label">
              <span className="live-dot" aria-hidden="true" />
              {t("liveLabel")}
            </p>
            <ul className="live-figures">
              {live.map((item) => (
                <li key={item.label}>
                  <strong>{item.value}</strong> {item.label}
                </li>
              ))}
            </ul>
            <p className="live-updated">
              {t("liveUpdated", {
                date: format.dateTime(new Date(liveStats.updatedAt), {
                  day: "numeric",
                  month: "long",
                }),
              })}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
