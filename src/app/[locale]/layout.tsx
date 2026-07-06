import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Archivo, Figtree } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

/** Locale inconnue (/zz/…, /blog/…) → 404 racine, jamais un rendu avec lang bidon. */
function assertLocale(locale: string) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
}
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageFx from "@/components/motion/PageFx";
import JsonLd, { organizationJsonLd, websiteJsonLd } from "@/components/JsonLd";
import MetaPixel from "@/components/tracking/MetaPixel";
import AttributionTracker from "@/components/tracking/AttributionTracker";
import "../globals.css";

// Archivo variable : axe wdth inclus (le design utilise font-stretch 115 % en 900).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta.home" });
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
  const canonicalUrl = `https://unboared.com/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "Unboared",
      locale: ogLocale,
      type: "website",
      images: [{ url: "https://unboared.com/og-image.jpg", width: 1200, height: 630, alt: "Unboared" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: "https://unboared.com/fr",
        en: "https://unboared.com/en",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertLocale(locale);
  // Fixe la locale de la requête pour les composants serveur (getTranslations
  // sans paramètre locale) — sinon ils retombent sur la locale par défaut.
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {/* Active les animations d'entrée / reveals avant le premier paint.
            Sans JS, la classe n'est jamais posée : tout le contenu reste visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="site min-h-screen flex flex-col antialiased">
        <MetaPixel />
        <AttributionTracker />
        <PageFx />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
