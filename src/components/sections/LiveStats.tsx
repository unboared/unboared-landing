import { getFormatter, getTranslations } from "next-intl/server";
import { getLiveStats, isPeakDay } from "@/lib/liveStats";

/**
 * « Ces 30 derniers jours » : le chiffre du mois en grand, deux chiffres d'appui et une
 * barre par soir (vendredis et samedis en rouge). Rendu côté serveur ; absent si les
 * chiffres sont indisponibles ou périmés (voir `lib/liveStats.ts`).
 */
export default async function LiveStats() {
  const stats = await getLiveStats();
  if (!stats) return null;

  const t = await getTranslations("socialProof");
  const format = await getFormatter();
  const max = Math.max(1, ...stats.daily);
  const through = format.dateTime(new Date(`${stats.through}T12:00:00Z`), {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

  return (
    <div className="live" data-reveal>
      <div className="live-main">
        <p className="live-label">
          <span className="live-dot" aria-hidden="true" />
          {t("liveLabel")}
        </p>
        <p className="live-hero">
          <strong>{format.number(stats.nights)}</strong>
          <span>{t("liveNights")}</span>
        </p>
        <ul className="live-side">
          <li>
            <strong>{format.number(stats.venues)}</strong> {t("liveVenues")}
          </li>
          <li>
            <strong>{format.number(stats.players)}</strong> {t("livePlayers")}
          </li>
        </ul>
      </div>

      {stats.daily.length > 0 && (
        <figure className="live-chart">
          <div
            className="live-bars"
            role="img"
            aria-label={t("liveChartAlt", { nights: stats.nights, days: stats.windowDays })}
          >
            {stats.daily.map((n, i) => (
              <span
                key={i}
                className={isPeakDay(stats.through, stats.windowDays, i) ? "peak" : undefined}
                style={{ height: `${Math.max(4, Math.round((n / max) * 100))}%`, transitionDelay: `${i * 18}ms` }}
              />
            ))}
          </div>
          <figcaption>
            <span>{t("liveChartLegend")}</span>
            <span>{t("liveUpdated", { date: through })}</span>
          </figcaption>
        </figure>
      )}
    </div>
  );
}
