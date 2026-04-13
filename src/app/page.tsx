import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const h = await headers();
  const acceptLanguage = h.get("accept-language") ?? "";

  // Parse Accept-Language header and pick the highest-priority language
  // e.g. "en-GB,en;q=0.9,fr;q=0.8" → "en-gb"
  const preferred = acceptLanguage
    .split(",")
    .map((entry) => {
      const [lang, q] = entry.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)[0]?.lang ?? "";

  const locale = preferred.startsWith("en") ? "en" : "fr";
  redirect(`/${locale}`);
}
