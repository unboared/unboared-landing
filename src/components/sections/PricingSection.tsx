"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { URLS } from "@/lib/constants";
import DemoButton from "@/components/DemoButton";

type Currency = "USD" | "GBP" | "EUR";

const CURRENCIES: Record<Currency, { symbol: string; price: string; label: string; billing: string }> = {
  USD: { symbol: "$", price: "59", label: "$ USD", billing: "Billed in USD · No commitment" },
  GBP: { symbol: "£", price: "45", label: "£ GBP", billing: "Billed in GBP · No commitment" },
  EUR: { symbol: "€", price: "49", label: "€ EUR", billing: "Billed in EUR · No commitment" },
};

export default function PricingSection() {
  const t = useTranslations("pricing");
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    if (!isEn) return;
    const lang = navigator.language || "";
    if (lang.startsWith("en-GB") || lang.startsWith("en-AU") || lang.startsWith("en-NZ")) {
      setCurrency("GBP");
    } else if (lang.startsWith("en-")) {
      setCurrency("USD");
    } else {
      setCurrency("EUR");
    }
  }, [isEn]);

  const demoFeatures = [
    { label: t("demoFeature1"), available: true },
    { label: t("demoFeature2"), available: true },
    { label: t("demoFeature3"), available: false },
    { label: t("demoFeature4"), available: false },
    { label: t("demoFeature5"), available: false },
    { label: t("demoFeature6"), available: false },
    { label: t("demoFeature7"), available: false },
  ];

  const paidFeatures = Array.from({ length: 7 }, (_, i) => t(`feature${i + 1}`));

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-text-muted text-lg">{t("subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Demo card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="bg-bg/50 border border-border rounded-3xl p-8 relative"
          >
            <div className="text-center mb-8">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-1">{t("demoSubtitle")}</p>
              <h3 className="text-2xl font-bold">{t("demoTitle")}</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold text-text-muted">—</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {demoFeatures.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  {feature.available ? (
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-text-dim flex-shrink-0" />
                  )}
                  <span className={feature.available ? "text-text-muted" : "text-text-dim line-through"}>
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <DemoButton className="block w-full text-center px-8 py-4 rounded-xl border border-border text-text-muted font-semibold text-lg hover:border-border-light hover:text-text transition-colors duration-200" />
          </motion.div>

          {/* Paid card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
            className="bg-bg border-2 border-primary/30 rounded-3xl p-8 relative shadow-2xl shadow-primary/10"
          >
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1.5 rounded-full bg-success/10 border border-success/30 text-success text-sm font-medium whitespace-nowrap">
              {t("badge")}
            </div>

            {/* Currency switcher (EN only) */}
            {isEn && (
              <div className="flex items-center justify-center gap-2 mt-4 mb-4">
                {(Object.keys(CURRENCIES) as Currency[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setCurrency(key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                      currency === key
                        ? "bg-primary border-primary text-white"
                        : "border-border text-text-dim hover:border-border-light hover:text-text-muted"
                    }`}
                  >
                    {CURRENCIES[key].label}
                  </button>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="text-center mt-2 mb-8">
              {isEn ? (
                <div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-bold transition-all duration-200">
                      {CURRENCIES[currency].symbol}{CURRENCIES[currency].price}
                    </span>
                    <span className="text-text-muted">{t("period")}</span>
                  </div>
                  <p className="text-text-dim text-sm mt-2 transition-all duration-200">
                    {CURRENCIES[currency].billing}
                  </p>
                  <p className="text-text-dim text-xs mt-1 opacity-70">Stripe automatically charges in your card&apos;s currency</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-bold">{t("price")}</span>
                    <span className="text-2xl font-semibold text-text-muted">{t("currency")}</span>
                    <span className="text-text-muted">{t("period")}</span>
                  </div>
                  <p className="text-text-dim text-sm mt-2">{t("taxInfo")}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {paidFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-text-muted">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <motion.a
              href={URLS.signup}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full text-center px-8 py-4 rounded-xl bg-accent text-white font-bold text-lg glow-accent transition-shadow duration-300"
            >
              {t("cta")}
            </motion.a>

            <p className="text-center text-sm text-text-dim mt-4">{t("noCreditCard")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
