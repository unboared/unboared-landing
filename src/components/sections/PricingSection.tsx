"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { URLS } from "@/lib/constants";
import DemoButton from "@/components/DemoButton";

type Currency = "USD" | "GBP" | "EUR";

// Comportement devises identique à l'existant : FR → € uniquement ;
// EN → switcher $/£/€ avec auto-détection via navigator.language.
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
    // navigator.language n'existe pas côté serveur : la détection de devise
    // doit se faire après montage (comportement identique à l'ancien site).
    const lang = navigator.language || "";
    if (lang.startsWith("en-GB") || lang.startsWith("en-AU") || lang.startsWith("en-NZ")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrency("GBP");
    } else if (lang.startsWith("en-")) {
      setCurrency("USD");
    } else {
      setCurrency("EUR");
    }
  }, [isEn]);

  const features = Array.from({ length: 7 }, (_, i) => t(`feature${i + 1}`));

  return (
    <section className="section pricing" id="pricing">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <div className="pricing-grid">
          {/* Carte abonnement */}
          <div className="price-card" data-reveal>
            <span className="price-badge">{t("badge")}</span>

            {/* Switcher devises (EN uniquement) */}
            {isEn && (
              <div className="price-currencies">
                {(Object.keys(CURRENCIES) as Currency[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCurrency(key)}
                    className={currency === key ? "sel" : ""}
                  >
                    {CURRENCIES[key].label}
                  </button>
                ))}
              </div>
            )}

            <div className="price-line">
              {isEn ? (
                <>
                  <strong>
                    {CURRENCIES[currency].symbol}
                    {CURRENCIES[currency].price}
                  </strong>
                  <span>{t("period")}</span>
                </>
              ) : (
                <>
                  <strong>{t("price")}</strong>
                  <span>{t("period")}</span>
                </>
              )}
            </div>
            {isEn ? (
              <>
                <p className="price-sub">{t("sub")}</p>
                <p className="price-billing">{CURRENCIES[currency].billing}</p>
                <p className="price-billing">
                  Stripe automatically charges in your card&apos;s currency
                </p>
              </>
            ) : (
              <p className="price-sub">{t("sub")}</p>
            )}

            <ul className="price-incl">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <a className="btn btn-primary" href={URLS.signup}>
              {t("cta")}
            </a>
            <p className="price-note">{t("note")}</p>
          </div>

          {/* Carte démo discrète */}
          <div className="demo-card" data-reveal>
            <h3>{t("demoTitle")}</h3>
            <p>{t("demoDesc")}</p>
            <DemoButton className="btn btn-ghost" />
          </div>
        </div>
      </div>
    </section>
  );
}
