import { getTranslations } from "next-intl/server";

export default async function ObjectionsSection() {
  const t = await getTranslations("objections");

  const doubts = [1, 2, 3].map((i) => ({
    quote: t(`q${i}`),
    strong: t(`a${i}Strong`),
    rest: t(`a${i}Rest`),
  }));

  return (
    <section className="section doubts" aria-label={t("aria")}>
      <div className="wrap">
        {doubts.map((doubt) => (
          <div className="doubt" data-reveal key={doubt.quote}>
            <blockquote>{doubt.quote}</blockquote>
            <p className="answer">
              <strong>{doubt.strong}</strong> {doubt.rest}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
