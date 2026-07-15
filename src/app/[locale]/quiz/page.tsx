import { getTranslations, setRequestLocale } from "next-intl/server";
import QuizTracking from "@/components/quiz/QuizTracking";

/**
 * Porte d'entrée mono-jeu « le jeu télévisé instantané » (wedge UnQuiz,
 * brief design/unquiz-wedge-2026-07). Une promesse, un CTA : la TV dans le
 * navigateur, sans compte. Le show lui-même EST la démonstration.
 */

/** TV standalone du jeu (screenURL de /games/unquiz). Les UTM traversent : la
 * page du jeu les rattache aux événements demo_started / game_completed. */
const PLAY_URL = "https://unquizz-v2.web.app/";

function playLink(locale: string) {
  const url = new URL(PLAY_URL);
  url.searchParams.set("utm_source", "quiz-landing");
  url.searchParams.set("utm_medium", "cta");
  url.searchParams.set("utm_campaign", "wedge-lot1");
  url.searchParams.set("lng", locale);
  return url.toString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quizLanding.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `https://unboared.com/${locale}/quiz` },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://unboared.com/${locale}/quiz`,
      siteName: "UnQuiz",
      type: "website",
    },
  };
}

export default async function QuizLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quizLanding");
  const href = playLink(locale);

  return (
    <>
      <QuizTracking locale={locale} />

      {/* ── Hero : la promesse, rien d'autre ─────────────────────────── */}
      <section className="quiz-hero">
        <div className="quiz-stage" aria-hidden="true">
          <div className="quiz-sunburst" />
          <div className="quiz-glow" />
        </div>
        <div className="wrap quiz-hero-inner">
          <p className="hero-kicker">{t("kicker")}</p>
          <h1 className="quiz-h1">
            {t("titlePre")}
            <span className="mark">{t("titleMark")}</span>
            {t("titlePost")}
          </h1>
          <p className="lead quiz-lead">{t("subtitle")}</p>
          <div className="hero-cta">
            <a className="btn btn-primary quiz-cta" href={href}>
              {t("cta")}
            </a>
          </div>
          <p className="quiz-cta-note">{t("ctaNote")}</p>
          <ol className="quiz-steps">
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
          </ol>
        </div>
      </section>

      {/* ── 3 preuves ─────────────────────────────────────────────────── */}
      <section className="section quiz-proofs">
        <div className="wrap">
          <div className="quiz-proof-grid">
            <article className="quiz-proof">
              <span className="quiz-proof-emoji" aria-hidden="true">🎙️</span>
              <h2>{t("proof1Title")}</h2>
              <p>{t("proof1Text")}</p>
            </article>
            <article className="quiz-proof">
              <span className="quiz-proof-emoji" aria-hidden="true">📱</span>
              <h2>{t("proof2Title")}</h2>
              <p>{t("proof2Text")}</p>
            </article>
            <article className="quiz-proof">
              <span className="quiz-proof-emoji" aria-hidden="true">✨</span>
              <h2>{t("proof3Title")}</h2>
              <p>{t("proof3Text")}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section className="section quiz-pricing">
        <div className="wrap">
          <h2 className="quiz-pricing-title">{t("pricingTitle")}</h2>
          <div className="quiz-price-grid">
            <article className="quiz-price-card quiz-price-free">
              <h3>{t("free.name")}</h3>
              <p className="quiz-price">{t("free.price")}</p>
              <ul>
                <li>{t("free.f1")}</li>
                <li>{t("free.f2")}</li>
                <li>{t("free.f3")}</li>
              </ul>
              <a className="btn btn-primary" href={href}>
                {t("free.cta")}
              </a>
            </article>
            <article className="quiz-price-card">
              <span className="quiz-soon">{t("soon")}</span>
              <h3>{t("pass.name")}</h3>
              <p className="quiz-price">{t("pass.price")}</p>
              <ul>
                <li>{t("pass.f1")}</li>
                <li>{t("pass.f2")}</li>
                <li>{t("pass.f3")}</li>
              </ul>
            </article>
            <article className="quiz-price-card">
              <span className="quiz-soon">{t("soon")}</span>
              <h3>{t("creator.name")}</h3>
              <p className="quiz-price">{t("creator.price")}</p>
              <ul>
                <li>{t("creator.f1")}</li>
                <li>{t("creator.f2")}</li>
                <li>{t("creator.f3")}</li>
              </ul>
            </article>
          </div>
          <p className="quiz-b2b">
            {t("b2bText")}{" "}
            <a href={`/${locale}`}>{t("b2bLink")}</a>
          </p>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────── */}
      <section className="section quiz-final">
        <div className="wrap quiz-final-inner">
          <h2>{t("finalTitle")}</h2>
          <a className="btn btn-primary quiz-cta" href={href}>
            {t("cta")}
          </a>
          <p className="quiz-cta-note">{t("ctaNote")}</p>
        </div>
      </section>
    </>
  );
}
