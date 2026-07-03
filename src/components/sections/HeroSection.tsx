import { getTranslations } from "next-intl/server";
import { URLS } from "@/lib/constants";

export default async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true">
        <video
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          data-io
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="hero-kicker">{t("kicker")}</p>
        <h1>
          <span className="hl">
            <span>{t("titleLine1")}</span>
          </span>
          <span className="hl">
            <span>{t("titleLine2")}</span>
          </span>
          <span className="hl">
            <span>
              {t("titleLine3Pre")}
              <span className="mark">{t("titleLine3Mark")}</span>
              {t("titleLine3Post")}
            </span>
          </span>
        </h1>
        <p className="lead">{t("subtitle")}</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href={URLS.signup}>
            {t("ctaPrimary")}
          </a>
          <a className="btn btn-ghost" href="#demo">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M3 1.5v11l9-5.5z" />
            </svg>
            {t("ctaSecondary")}
          </a>
        </div>
        <p className="hero-trust">{t("trust")}</p>
        <p className="hero-proof">
          <strong>{t("proofValue")}</strong> <span>{t("proofLabel")}</span>
        </p>
      </div>
      <p className="hero-scroll" aria-hidden="true">
        {t("scroll")}
      </p>
    </section>
  );
}
