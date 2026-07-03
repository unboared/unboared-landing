import { getTranslations } from "next-intl/server";
import { URLS } from "@/lib/constants";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Self-serve banner */}
        <div className="bg-bg-2 border border-red/50 rounded-[16px] p-8 text-center mb-12">
          <h2 className="mb-2" style={{ fontSize: "1.4rem" }}>
            {t("selfServe")}
          </h2>
          <p className="text-muted mb-5">{t("selfServeSub")}</p>
          <a href={URLS.signup} className="btn btn-primary">
            {t("tryCta")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)" }}>
            {t("title")}
          </h1>
          <p className="text-muted text-lg">{t("subtitle")}</p>
        </div>

        {/* Contact info */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          <div className="bg-bg-2 border border-line rounded-[14px] p-6 flex items-start gap-4">
            <Mail className="w-5 h-5 text-red mt-0.5" />
            <div>
              <p className="text-sm text-faint mb-1">{t("emailLabel")}</p>
              <a href={URLS.contact} className="font-medium hover:text-red transition-colors">
                {t("emailValue")}
              </a>
            </div>
          </div>
          <div className="bg-bg-2 border border-line rounded-[14px] p-6 flex items-start gap-4">
            <MapPin className="w-5 h-5 text-red mt-0.5" />
            <div>
              <p className="text-sm text-faint mb-1">{t("addressLabel")}</p>
              <p className="font-medium">{t("addressValue")}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}
