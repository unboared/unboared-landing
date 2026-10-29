"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { URLS } from "@/lib/constants";
import DemoButton from "@/components/DemoButton";

type Currency = "USD" | "GBP" | "EUR";
type Period = "month" | "year";
type Plan = "standard" | "pro";

// Comportement devises identique à l'existant : FR → € uniquement ;
// EN → switcher $/£/€ avec auto-détection via navigator.language.
// Annuel = « 12 mois pour le prix de 10 » (prix Stripe dédié, mêmes devises).
// Pro (« Ma marque ») = 69 € / 79 $ / 59 £ par mois (console : src/utils/proOffer.ts).
// `year: null` = pas d'annuel Pro dans Stripe : la colonne Pro reste au prix mensuel.
const CURRENCIES: Record<
  Currency,
  {
    symbol: string;
    label: string;
    billing: string;
    billingYear: string;
    prices: Record<Plan, { month: string; year: string | null }>;
  }
> = {
  USD: {
    symbol: "$",
    label: "$ USD",
    billing: "Billed in USD · No commitment",
    billingYear: "Billed yearly in USD",
    prices: { standard: { month: "59", year: "590" }, pro: { month: "79", year: null } },
  },
  GBP: {
    symbol: "£",
    label: "£ GBP",
    billing: "Billed in GBP · No commitment",
    billingYear: "Billed yearly in GBP",
    prices: { standard: { month: "45", year: "450" }, pro: { month: "59", year: null } },
  },
  EUR: {
    symbol: "€",
    label: "€ EUR",
    billing: "Billed in EUR · No commitment",
    billingYear: "Billed yearly in EUR",
    prices: { standard: { month: "49", year: "490" }, pro: { month: "69", year: null } },
  },
};

// Comparatif : une ligne = un texte `pricing.rows.<key>` + ce que chaque formule a.
// Ajouter une différence entre les formules = ajouter une ligne ici (+ ses textes FR/EN).
const ROWS: { key: string; standard: boolean; pro: boolean }[] = [
  { key: "games", standard: true, pro: true },
  { key: "players", standard: true, pro: true },
  { key: "quizzes", standard: true, pro: true },
  { key: "cockpit", standard: true, pro: true },
  { key: "dashboard", standard: true, pro: true },
  { key: "support", standard: true, pro: true },
  { key: "logoTv", standard: false, pro: true },
  { key: "colors", standard: false, pro: true },
  { key: "logoPhones", standard: false, pro: true },
];

const UK_TIME_ZONES = new Set(["Europe/London", "Europe/Belfast", "Europe/Jersey", "Europe/Guernsey", "Europe/Isle_of_Man"]);

function Mark({ on, label }: { on: boolean; label: string }) {
  return on ? (
    <span className="pc-yes" role="img" aria-label={label} />
  ) : (
    <span className="pc-no" role="img" aria-label={label}>
      —
    </span>
  );
}

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

  // Le site FR n'affiche que des euros (« 49 € ») ; le site EN met le symbole devant (« £45 »).
  const cur = CURRENCIES[isEn ? currency : "EUR"];
  const fmt = (amount: string) => (isEn ? `${cur.symbol}${amount}` : `${amount} €`);
  const priceOf = (plan: Plan) => {
    const { month, year } = cur.prices[plan];
    return yearly && year ? { amount: fmt(year), per: t("periodYear") } : { amount: fmt(month), per: t("period") };
  };
  const std = priceOf("standard");
  const pro = priceOf("pro");
  const proMonthlyOnly = yearly && cur.prices.pro.year === null;

  // L'annuel est pré-sélectionné à l'inscription (console : ?plan=annual).
  // Pas d'inscription directe en Pro : l'essai démarre en Standard, puis « Passer en Pro »
  // dans Mon compte → Ma marque (abonnements mensuels seulement ; pendant l'essai, ce passage
  // termine l'essai et prélève le 1er mois). `plan=pro` est ignoré par la console (seul `annual`
  // compte) : il ne sert qu'à repérer, dans l'adresse de la page d'inscription (GA4), les
  // visiteurs venus de la colonne Pro.
  const stdHref = yearly ? `${URLS.signup}?plan=annual` : URLS.signup;
  const proHref = `${URLS.signup}?plan=pro`;

  return (
    <section className="section pricing" id="pricing">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <p className="pricing-lead" data-reveal>
          {t("lead")}
        </p>

        <div className="price-switches">
          {/* Mensuel / annuel */}
          <div className="price-periods" role="group" aria-label={t("periodLabel")}>
            <button type="button" aria-pressed={!yearly} onClick={() => setPeriod("month")} className={!yearly ? "sel" : ""}>
              {t("monthly")}
            </button>
            <button type="button" aria-pressed={yearly} onClick={() => setPeriod("year")} className={yearly ? "sel" : ""}>
              {t("yearly")} <span className="price-save">{t("yearlySave")}</span>
            </button>
          </div>

          {/* Switcher devises (EN uniquement) */}
          {isEn && (
            <div className="price-currencies">
              {(Object.keys(CURRENCIES) as Currency[]).map((key) => (
                <button key={key} type="button" onClick={() => setCurrency(key)} className={currency === key ? "sel" : ""}>
                  {CURRENCIES[key].label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="compare" data-reveal>
          <table className="compare-table">
            <caption className="sr-only">{t("tableCaption")}</caption>
            <thead>
              <tr>
                <td />
                <th scope="col">
                  <span className="plan-name">{t("standardName")}</span>
                  <span className="compare-price">
                    <strong>{std.amount}</strong>
                    <span>{std.per}</span>
                  </span>
                </th>
                <th scope="col" className="compare-pro">
                  <span className="plan-name">{t("proName")}</span>
                  <span className="compare-tag">{t("proBadge")}</span>
                  <span className="compare-price">
                    <strong>{pro.amount}</strong>
                    <span>{pro.per}</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.key} className={r.standard ? "" : "compare-diff"}>
                  <th scope="row">{t(`rows.${r.key}`)}</th>
                  <td>
                    <Mark on={r.standard} label={r.standard ? t("included") : t("notIncluded")} />
                  </td>
                  <td className="compare-pro">
                    <Mark on={r.pro} label={r.pro ? t("included") : t("notIncluded")} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td />
                <td>
                  <a className="btn btn-primary compare-btn" href={stdHref} aria-label={t("ctaAriaStandard")}>
                    {t("cta")} <span className="compare-btn-sub">{t("ctaSub")}</span>
                  </a>
                </td>
                <td className="compare-pro">
                  <a className="btn compare-btn compare-btn-pro" href={proHref} aria-label={t("ctaAriaPro")}>
                    {t("cta")} <span className="compare-btn-sub">{t("ctaSubPro")}</span>
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>

          <ul className="compare-notes">
            <li>{yearly ? t("noteYear", { price: std.amount }) : t("note", { price: std.amount })}</li>
            <li>{t(proMonthlyOnly ? "proNoteYear" : "proNote", { price: fmt(cur.prices.pro.month) })}</li>
            <li>{t("proGamesNote")}</li>
            {isEn && <li>{`${yearly ? cur.billingYear : cur.billing} · Stripe automatically charges in your card's currency.`}</li>}
          </ul>
        </div>

        {/* Démo discrète */}
        <div className="demo-strip" data-reveal>
          <div className="demo-strip-text">
            <h3>{t("demoTitle")}</h3>
            <p>{t("demoDesc")}</p>
          </div>
          <DemoButton className="btn btn-ghost" />
        </div>
      </div>
    </section>
  );
}
