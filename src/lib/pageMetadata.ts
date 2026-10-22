import type { Metadata } from "next";

/**
 * Métadonnées d'une page simple (/fr/about, /en/contact…) : canonique et
 * og:url sur sa propre adresse. Sans ça, la page hérite ceux du layout
 * (l'accueil) et Google la traite comme un doublon de l'accueil.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `https://unboared.com/${locale}/${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Unboared",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [{ url: "https://unboared.com/og-image.jpg", width: 1200, height: 630, alt: "Unboared" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        fr: `https://unboared.com/fr/${path}`,
        en: `https://unboared.com/en/${path}`,
      },
    },
  };
}
