import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/sections/HeroSection";
import SocialProofBar from "@/components/sections/SocialProofBar";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import GamesShowcase from "@/components/sections/GamesShowcase";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import LeadMagnetSection from "@/components/sections/LeadMagnetSection";
import PricingSection from "@/components/sections/PricingSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaSection from "@/components/sections/CtaSection";

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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <HowItWorksSection />
      <BenefitsSection />
      <GamesShowcase />
      <FeaturesGrid />
      <TestimonialsSection />
      <LeadMagnetSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
