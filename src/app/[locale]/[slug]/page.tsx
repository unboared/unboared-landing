import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import IntentPage from "@/components/IntentPage";
import {
  INTENT_CONTENT,
  INTENT_KEYS,
  INTENT_SLUGS,
  intentKeyFromSlug,
  type IntentLocale,
} from "@/data/intentPages";

/**
 * Pages « d'intention » (/fr/blind-test-bar, /en/pub-quiz-software…).
 * Seules les adresses listées existent : toute autre adresse à un segment
 * (ou un slug anglais sous /fr) répond 404, comme le catch-all [...rest].
 */
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale as IntentLocale;
  if (!INTENT_CONTENT[locale]) return [];
  return INTENT_KEYS.map((key) => ({ slug: INTENT_SLUGS[key][locale] }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const key = intentKeyFromSlug(locale, slug);
  if (!key) return {};
  const c = INTENT_CONTENT[locale as IntentLocale][key];
  const url = `https://unboared.com/${locale}/${slug}`;

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      siteName: "Unboared",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      type: "website",
      images: [{ url: "https://unboared.com/og-image.jpg", width: 1200, height: 630, alt: "Unboared" }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.metaTitle,
      description: c.metaDescription,
    },
    alternates: {
      canonical: url,
      languages: {
        fr: `https://unboared.com/fr/${INTENT_SLUGS[key].fr}`,
        en: `https://unboared.com/en/${INTENT_SLUGS[key].en}`,
      },
    },
  };
}

export default async function IntentRoute({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const key = intentKeyFromSlug(locale, slug);
  if (!key) notFound();
  setRequestLocale(locale);
  return <IntentPage locale={locale as IntentLocale} pageKey={key} />;
}
