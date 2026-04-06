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
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Self-serve banner */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-xl font-bold mb-2">{t("selfServe")}</h2>
          <p className="text-text-muted mb-4">{t("selfServeSub")}</p>
          <a
            href={URLS.signup}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-all"
          >
            {t("tryCta")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-text-muted text-lg">{t("subtitle")}</p>
        </div>

        {/* Contact info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-text-muted mb-1">{t("emailLabel")}</p>
              <a href="mailto:contact@unboared.com" className="font-medium hover:text-primary transition-colors">
                {t("emailValue")}
              </a>
            </div>
          </div>
          <div className="bg-bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-text-muted mb-1">{t("addressLabel")}</p>
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
