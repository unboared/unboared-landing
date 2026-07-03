import { getTranslations } from "next-intl/server";

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
      </div>
    </section>
  );
}
