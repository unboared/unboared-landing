"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { URLS } from "@/lib/constants";
import DemoButton from "@/components/DemoButton";

type Currency = "USD" | "GBP" | "EUR";
type Period = "month" | "year";

// Comportement devises identique à l'existant : FR → € uniquement ;
// EN → switcher $/£/€ avec auto-détection via navigator.language.
// Annuel = « 12 mois pour le prix de 10 » (prix Stripe dédié, mêmes devises).
const CURRENCIES: Record<
  Currency,
  { symbol: string; price: string; yearPrice: string; label: string; billing: string; billingYear: string }
> = {
  USD: { symbol: "$", price: "59", yearPrice: "590", label: "$ USD", billing: "Billed in USD · No commitment", billingYear: "Billed yearly in USD" },
  GBP: { symbol: "£", price: "45", yearPrice: "450", label: "£ GBP", billing: "Billed in GBP · No commitment", billingYear: "Billed yearly in GBP" },
  EUR: { symbol: "€", price: "49", yearPrice: "490", label: "€ EUR", billing: "Billed in EUR · No commitment", billingYear: "Billed yearly in EUR" },
};

export default function PricingSection() {
  const t = useTranslations("pricing");
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  const [currency, setCurrency] = useState<Currency>("USD");
  const [period, setPeriod] = useState<Period>("month");
  const yearly = period === "year";

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

  // « Sans engagement » n'est vrai qu'en mensuel : l'annuel engage 12 mois.
  const features = Array.from({ length: 7 }, (_, i) => (yearly && i === 6 ? t("feature7Year") : t(`feature${i + 1}`)));
  const cur = CURRENCIES[currency];
  const enPrice = `${cur.symbol}${yearly ? cur.yearPrice : cur.price}`;
  // L'annuel est pré-sélectionné à l'inscription (console : ?plan=annual).
  const signupHref = yearly ? `${URLS.signup}?plan=annual` : URLS.signup;

  return (
    <section className="section pricing" id="pricing">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <div className="pricing-grid">
          {/* Carte abonnement */}
          <div className="price-card" data-reveal>
            <span className="price-badge">{t("badge")}</span>

            {/* Mensuel / annuel */}
            <div className="price-periods" role="group" aria-label={t("periodLabel")}>
              <button
                type="button"
                aria-pressed={!yearly}
                onClick={() => setPeriod("month")}
                className={!yearly ? "sel" : ""}
              >
                {t("monthly")}
              </button>
              <button
                type="button"
                aria-pressed={yearly}
                onClick={() => setPeriod("year")}
                className={yearly ? "sel" : ""}
              >
                {t("yearly")} <span className="price-save">{t("yearlySave")}</span>
              </button>
            </div>

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
                  <strong>{enPrice}</strong>
                  <span>{t(yearly ? "periodYear" : "period")}</span>
                </>
              ) : (
                <>
                  <strong>{t(yearly ? "priceYear" : "price")}</strong>
                  <span>{t(yearly ? "periodYear" : "period")}</span>
                </>
              )}
            </div>
            {isEn ? (
              <>
                <p className="price-sub">{yearly ? t("subYear") : t("sub")}</p>
                <p className="price-billing">{yearly ? cur.billingYear : cur.billing}</p>
                <p className="price-billing">
                  Stripe automatically charges in your card&apos;s currency
                </p>
              </>
            ) : (
              <p className="price-sub">{yearly ? t("subYear") : t("sub")}</p>
            )}

            <ul className="price-incl">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <a className="btn btn-primary" href={signupHref}>
              {t("cta")}
            </a>
            <p className="price-note">
              {yearly
                ? t("noteYear", { price: isEn ? enPrice : t("priceYear") })
                : t("note", { price: isEn ? enPrice : t("price") })}
            </p>
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
