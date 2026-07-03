import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function BenefitsSection() {
  const t = await getTranslations("benefits");

  return (
    <section className="section benefits">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <div className="benefit-list">
          {/* 1 — Donnez une raison de venir */}
          <div className="benefit benefit-1" data-reveal>
            <div className="b-copy">
              <h3>{t("b1Title")}</h3>
              <p>{t("b1Desc")}</p>
            </div>
            <div className="b-side" aria-hidden="true">
              <div className="day-strip">
                <span>{t("dayMon")}</span>
                <span>{t("dayTue")}</span>
                <span>{t("dayWed")}</span>
                <span className="hot">{t("dayThu")}</span>
                <span className="hot">{t("dayFri")}</span>
                <span className="hot">{t("daySat")}</span>
              </div>
            </div>
          </div>

          {/* 2 — +45 min */}
          <div className="benefit benefit-2" data-reveal>
            <div className="b-side">
              <p className="big-stat">
                {t("b2Stat")}
                <small>{t("b2StatLabel")}</small>
              </p>
            </div>
            <div className="b-copy">
              <h3>{t("b2Title")}</h3>
              <p>{t("b2Desc")}</p>
            </div>
          </div>

          {/* 3 — Ils reviennent */}
          <div className="benefit benefit-3" data-reveal>
            <div className="b-copy">
              <h3>{t("b3Title")}</h3>
              <p>{t("b3Desc")}</p>
            </div>
            <div className="b-side">
              <figure className="b-photo">
                <Image
                  src="/images/photos/bar-ninkasi-geoloc.jpg"
                  alt={t("b3Alt")}
                  width={604}
                  height={806}
                  sizes="(max-width: 820px) 90vw, 380px"
                  loading="lazy"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
