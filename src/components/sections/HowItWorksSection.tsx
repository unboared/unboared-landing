import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function HowItWorksSection() {
  const t = await getTranslations("howItWorks");

  const steps = [
    { n: "1", title: t("step1Title"), desc: t("step1Desc") },
    { n: "2", title: t("step2Title"), desc: t("step2Desc") },
    { n: "3", title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <div className="how-grid">
          <div className="steps">
            {steps.map((step) => (
              <div className="step" data-reveal key={step.n}>
                <span className="step-n" aria-hidden="true">
                  {step.n}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
            <p className="how-note" data-reveal>
              {t("note")}
            </p>
          </div>
          <figure className="how-visual" data-reveal>
            <Image
              src="/images/product/tv-game-launcher-front.png"
              alt={t("visualAlt")}
              width={1000}
              height={1000}
              sizes="(max-width: 860px) 90vw, 520px"
              loading="lazy"
            />
            <figcaption>{t("visualCaption")}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
