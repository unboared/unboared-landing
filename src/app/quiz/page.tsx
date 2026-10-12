import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Porte publique UnQuiz : /quiz sans locale (l'URL courte des liens trackés
 * du jeu et des pubs). Redirige vers /{fr|en}/quiz en préservant la query
 * string — les UTM du K-factor ne doivent PAS se perdre dans la redirection.
 */
export default async function QuizRootPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const h = await headers();
  const acceptLanguage = h.get("accept-language") ?? "";
  const preferred =
    acceptLanguage
      .split(",")
      .map((entry) => {
        const [lang, q] = entry.trim().split(";q=");
        return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q)[0]?.lang ?? "";
  const locale = preferred.startsWith("en") ? "en" : "fr";

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  const qs = params.toString();
  redirect(`/${locale}/quiz${qs ? `?${qs}` : ""}`);
}
