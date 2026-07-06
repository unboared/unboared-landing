import { getTranslations, setRequestLocale } from "next-intl/server";
import GamesShowcase from "@/components/sections/GamesShowcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.games" });
  const canonicalUrl = `https://unboared.com/${locale}/games`;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "Unboared",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: "https://unboared.com/fr/games",
        en: "https://unboared.com/en/games",
      },
    },
  };
}

export default async function GamesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "gamesPage" });

  return (
    <div style={{ paddingTop: "clamp(96px, 12vh, 140px)" }}>
      <div className="wrap games-head">
        <h1>{t("title")}</h1>
        <p className="lead">{t("subtitle")}</p>
      </div>
      <GamesShowcase showHead={false} />
    </div>
  );
}
