import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/sections/HeroSection";
import SocialProofBar from "@/components/sections/SocialProofBar";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import DemoVideoSection from "@/components/sections/DemoVideoSection";
import BleedPhotoSection from "@/components/sections/BleedPhotoSection";
import GamesShowcase from "@/components/sections/GamesShowcase";
import BenefitsSection from "@/components/sections/BenefitsSection";
import PilotSection from "@/components/sections/PilotSection";
import ObjectionsSection from "@/components/sections/ObjectionsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import LeadMagnetSection from "@/components/sections/LeadMagnetSection";
import PricingSection from "@/components/sections/PricingSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaSection from "@/components/sections/CtaSection";
import JsonLd, { faqJsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={faqJsonLd(locale)} />
      <HeroSection />
      <SocialProofBar />
      <HowItWorksSection />
      <DemoVideoSection />
      <BleedPhotoSection />
      <GamesShowcase />
      <BenefitsSection />
      <PilotSection />
      <ObjectionsSection />
      <TestimonialsSection />
      <LeadMagnetSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
