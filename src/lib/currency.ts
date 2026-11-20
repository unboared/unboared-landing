"use client";

import { useEffect, useState } from "react";

export type Currency = "USD" | "GBP" | "EUR";
export type Plan = "standard" | "pro";

// Comportement devises identique à l'existant : FR → € uniquement ;
// EN → switcher $/£/€ avec auto-détection via navigator.language.
// Annuel = « 12 mois pour le prix de 10 » (prix Stripe dédié, mêmes devises).
// Pro (« Ma marque ») = 69 € / 79 $ / 59 £ par mois, 690 € / 790 $ / 590 £ par an
// (console : src/utils/proOffer.ts).
export const CURRENCIES: Record<
  Currency,
  {
    symbol: string;
    label: string;
    billing: string;
    billingYear: string;
    prices: Record<Plan, { month: string; year: string }>;
  }
> = {
  USD: {
    symbol: "$",
    label: "$ USD",
    billing: "Billed in USD · No commitment",
    billingYear: "Billed yearly in USD",
    prices: { standard: { month: "59", year: "590" }, pro: { month: "79", year: "790" } },
  },
  GBP: {
    symbol: "£",
    label: "£ GBP",
    billing: "Billed in GBP · No commitment",
    billingYear: "Billed yearly in GBP",
    prices: { standard: { month: "45", year: "450" }, pro: { month: "59", year: "590" } },
  },
  EUR: {
    symbol: "€",
    label: "€ EUR",
    billing: "Billed in EUR · No commitment",
    billingYear: "Billed yearly in EUR",
    prices: { standard: { month: "49", year: "490" }, pro: { month: "69", year: "690" } },
  },
};

const UK_TIME_ZONES = new Set(["Europe/London", "Europe/Belfast", "Europe/Jersey", "Europe/Guernsey", "Europe/Isle_of_Man"]);

// Le site FR n'affiche que des euros (« 49 € ») ; le site EN met le symbole devant (« £45 »).
// Espace insécable : « 690 € » ne se coupe jamais en fin de ligne.
export const formatPrice = (amount: string, currency: Currency, isEn: boolean) =>
  isEn ? `${CURRENCIES[currency].symbol}${amount}` : `${amount}\u00a0€`;

/** Devise affichée : € sur le site FR ; sur le site EN, détectée après montage. */
export function useCurrency(isEn: boolean) {
  const [detected, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    if (!isEn) return;
    // navigator.language n'existe pas côté serveur : la détection de devise
    // doit se faire après montage (comportement identique à l'ancien site).
    // Ordre : devise forcée par l'adresse (?currency=gbp, liens de pub UK),
    // puis fuseau horaire britannique (un téléphone britannique réglé en
    // « English (US) » voyait 59 $), puis langue du navigateur.
    const forced = new URLSearchParams(window.location.search).get("currency")?.toUpperCase();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = navigator.language || "";
    if (forced === "GBP" || forced === "USD" || forced === "EUR") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrency(forced);
    } else if (UK_TIME_ZONES.has(tz) || lang.startsWith("en-GB") || lang.startsWith("en-AU") || lang.startsWith("en-NZ")) {
      setCurrency("GBP");
    } else if (lang.startsWith("en-")) {
      setCurrency("USD");
    } else {
      setCurrency("EUR");
    }
  }, [isEn]);

  return [isEn ? detected : "EUR", setCurrency] as const;
}
