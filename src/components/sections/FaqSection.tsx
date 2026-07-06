import { getTranslations } from "next-intl/server";
import { URLS } from "@/lib/constants";

export default async function FaqSection() {
  const t = await getTranslations("faq");

  const items = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: t(`q${i}`),
    a: t(`a${i}`),
  }));

  return (
    <section className="section" id="faq">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <div className="faq-list" data-reveal>
          {items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <div className="faq-more" data-reveal>
          <p>{t("moreLead")}</p>
          <a
            className="btn btn-ghost"
            href={URLS.guide}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("moreCta")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
