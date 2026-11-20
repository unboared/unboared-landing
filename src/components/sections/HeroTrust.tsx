"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { CURRENCIES, formatPrice, useCurrency } from "@/lib/currency";

// Sous le bouton du haut de page : le prix après l'essai et la carte demandée,
// dits avant l'inscription plutôt que découverts à l'étape suivante.
export default function HeroTrust() {
  const t = useTranslations("pricing");
  const isEn = usePathname().startsWith("/en");
  const [currency] = useCurrency(isEn);
  const price = formatPrice(CURRENCIES[currency].prices.standard.month, currency, isEn);

  return (
    <p className="hero-trust">
      {t("note", { price })}
      <br />
      {t("cardNote")}
    </p>
  );
}
