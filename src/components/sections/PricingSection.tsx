"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { URLS } from "@/lib/constants";
import DemoButton from "@/components/DemoButton";
import { CURRENCIES, formatPrice, useCurrency, type Currency, type Plan } from "@/lib/currency";

type Period = "month" | "year";

// Comparatif : une ligne = un texte `pricing.rows.<key>` + ce que chaque formule a.
// Ajouter une différence entre les formules = ajouter une ligne ici (+ ses textes FR/EN).
const ROWS: { key: string; standard: boolean; pro: boolean }[] = [
  { key: "games", standard: true, pro: true },
  { key: "players", standard: true, pro: true },
  { key: "quizzes", standard: true, pro: true },
  { key: "cockpit", standard: true, pro: true },
  { key: "dashboard", standard: true, pro: true },
  { key: "support", standard: true, pro: true },
  { key: "dualScreen", standard: false, pro: true },
  { key: "logoTv", standard: false, pro: true },
  { key: "colors", standard: false, pro: true },
  { key: "logoPhones", standard: false, pro: true },
];

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

  const [currency, setCurrency] = useCurrency(isEn);
  const [period, setPeriod] = useState<Period>("month");
  const yearly = period === "year";

  const cur = CURRENCIES[currency];
  const fmt = (amount: string) => formatPrice(amount, currency, isEn);
  const priceOf = (plan: Plan) => {
    const { month, year } = cur.prices[plan];
    return yearly ? { amount: fmt(year), per: t("periodYear") } : { amount: fmt(month), per: t("period") };
  };
  const std = priceOf("standard");
  const pro = priceOf("pro");

  // Formule pré-sélectionnée à l'inscription (console) : `?plan=annual` (Standard à l'année),
  // `?plan=pro` (Pro au mois), `?plan=annual&from=pro` (Pro à l'année). L'essai de 14 jours se fait
  // directement dans la formule choisie (stripe-b2b, checkoutPlan.js).
  const stdHref = yearly ? `${URLS.signup}?plan=annual` : URLS.signup;
  const proHref = yearly ? `${URLS.signup}?plan=annual&from=pro` : `${URLS.signup}?plan=pro`;

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
            <li>{t("cardNote")}</li>
            <li>{yearly ? t("proNoteYear", { price: pro.amount }) : t("proNote", { price: pro.amount })}</li>
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
