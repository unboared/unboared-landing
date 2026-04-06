import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { CLIENTS } from "@/data/clients";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const sp = await getTranslations({ locale, namespace: "socialProof" });

  const stats = [
    { value: `${sp("stat1Prefix")}${sp("stat1Value")}`, label: sp("stat1Label") },
    { value: `${sp("stat2Prefix")}${sp("stat2Value")}${sp("stat2Suffix")}`, label: sp("stat2Label") },
    { value: `${sp("stat3Value")}${sp("stat3Suffix")}`, label: sp("stat3Label") },
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-text-muted text-lg">{t("subtitle")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-bg-card border border-border rounded-2xl p-6">
              <div className="text-3xl md:text-4xl font-bold">{s.value}</div>
              <p className="text-text-muted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">{t("missionTitle")}</h2>
          <p className="text-text-muted leading-relaxed text-lg">{t("missionText")}</p>
        </div>

        {/* Story */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-4">{t("storyTitle")}</h2>
          <p className="text-text-muted leading-relaxed text-lg">{t("storyText")}</p>
        </div>

        {/* Trusted by */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-10">{t("trustedBy")}</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {CLIENTS.map((client) => (
              <Image
                key={client.name}
                src={client.logo}
                alt={client.name}
                width={120}
                height={48}
                className="h-8 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
