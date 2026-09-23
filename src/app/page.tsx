import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { pickLocaleFromAcceptLanguage } from "@/lib/locale";

export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const h = await headers();
  const locale = pickLocaleFromAcceptLanguage(h.get("accept-language"));
  redirect(`/${locale}`);
}
