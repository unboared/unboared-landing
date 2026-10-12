import type { MetadataRoute } from "next";
import { INTENT_KEYS, INTENT_SLUGS } from "@/data/intentSlugs";

const baseUrl = "https://unboared.com";
const locales = ["fr", "en"];

const pages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/games", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/terms-of-use", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages d'intention : une adresse différente par langue, reliées par hreflang.
  const intent = INTENT_KEYS.flatMap((key) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/${INTENT_SLUGS[key][locale as "fr" | "en"]}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/${INTENT_SLUGS[key][l as "fr" | "en"]}`])
        ),
      },
    }))
  );
  return [...pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${page.path}`])
        ),
      },
    }))
  ), ...intent];
}
