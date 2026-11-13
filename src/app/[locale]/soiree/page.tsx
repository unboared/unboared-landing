import { getTranslations, setRequestLocale } from "next-intl/server";
import SoireeCardMaker from "@/components/SoireeCardMaker";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "soiree" });
  // Page privée du gérant (atteinte depuis son bilan de soirée) : jamais dans Google.
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function SoireePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="section soiree">
      <div className="wrap">
        <SoireeCardMaker locale={locale === "en" ? "en" : "fr"} />
      </div>
    </main>
  );
}
