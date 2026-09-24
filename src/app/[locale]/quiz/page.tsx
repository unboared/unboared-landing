import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import QuizTracking from "@/components/quiz/QuizTracking";
import QuizPlayButton from "@/components/quiz/QuizPlayButton";
import QuizBuyButton from "@/components/quiz/QuizBuyButton";

/**
 * Porte d'entrée mono-jeu « le jeu télévisé instantané » (wedge UnQuiz,
 * brief design/unquiz-wedge-2026-07). Une promesse, un CTA : la TV dans le
 * navigateur, sans compte. Le show lui-même EST la démonstration.
 * Sur téléphone, les CTA « jouer » ouvrent un panneau (le show se joue sur la
 * TV) au lieu d'envoyer vers la page TV — voir QuizPlayButton.
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
  const lang = locale === "en" ? "en" : "fr";
  // Visuel de partage par langue (1200×630), URL absolue comme dans le layout.
  const ogImage = {
    url: `https://unboared.com/quiz/og-quiz-${lang}.jpg`,
    width: 1200,
    height: 630,
    alt: "UnQuiz",
  };
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `https://unboared.com/${locale}/quiz` },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://unboared.com/${locale}/quiz`,
      siteName: "UnQuiz",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImage.url],
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
            <QuizPlayButton
              className="btn btn-primary quiz-cta"
              href={href}
              label={t("cta")}
              placement="hero"
              openOnHash
            />
          </div>
          <p className="quiz-cta-note">{t("ctaNote")}</p>
          <ol className="quiz-steps">
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
          </ol>
          {/* Le show tel qu'il apparaît sur la TV (QR volontairement flouté). */}
          <figure className="quiz-tv">
            <div className="quiz-tv-screen">
              <Image
                src={`/quiz/show-tv-${locale === "en" ? "en" : "fr"}.jpg`}
                alt={t("showAlt")}
                width={1600}
                height={900}
                sizes="(max-width: 900px) calc(100vw - 48px), 820px"
              />
            </div>
          </figure>
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
                <li>{t("free.f4")}</li>
              </ul>
              <QuizPlayButton
                className="btn btn-primary"
                href={href}
                label={t("free.cta")}
                placement="free"
              />
            </article>
            {/* Pass et Créateur : bouton d'achat (mesure du désir), écran « on y
                travaille » + email au clic — rien n'est encore en vente. */}
            <article className="quiz-price-card">
              <h3>{t("pass.name")}</h3>
              <p className="quiz-price">{t("pass.price")}</p>
              <ul>
                <li>{t("pass.f1")}</li>
                <li>{t("pass.f2")}</li>
                <li>{t("pass.f3")}</li>
              </ul>
              <QuizBuyButton plan="pass" openOnHash />
            </article>
            <article className="quiz-price-card">
              <h3>{t("creator.name")}</h3>
              <p className="quiz-price">{t("creator.price")}</p>
              <ul>
                <li>{t("creator.f1")}</li>
                <li>{t("creator.f2")}</li>
                <li>{t("creator.f3")}</li>
              </ul>
              <QuizBuyButton plan="creator" />
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
          <QuizPlayButton
            className="btn btn-primary quiz-cta"
            href={href}
            label={t("cta")}
            placement="final"
          />
          <p className="quiz-cta-note">{t("ctaNote")}</p>
        </div>
      </section>
    </>
  );
}
