import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function TestimonialsSection() {
  const t = await getTranslations("testimonials");

  return (
    <section className="section stories">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <div className="stories-grid">
          {/* Témoignage photo — Louis Gestin, Ninkasi */}
          <figure className="story-photo" data-reveal>
            <Image
              className="bg"
              src="/images/photos/bar-ninkasi-lille.jpg"
              alt={t("photoAlt")}
              fill
              sizes="(max-width: 820px) 100vw, 45vw"
              loading="lazy"
            />
            <div className="scrim" aria-hidden="true" />
            <figcaption>
              <q>{t("t1Quote")}</q>
              <div className="story-who">
                <Image
                  src="/images/testimonials/louis-gestin.png"
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <p>
                  <strong>{t("t1Author")}</strong>
                  <span>{t("t1Company")}</span>
                </p>
              </div>
            </figcaption>
          </figure>

          <div className="stories-col">
            <figure className="story-quote" data-reveal>
              <q>{t("t2Quote")}</q>
              <div className="story-who">
                <Image
                  src="/images/testimonials/laurent-angelini.png"
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <p>
                  <strong>{t("t2Author")}</strong>
                  <span>{t("t2Company")}</span>
                </p>
              </div>
            </figure>
            <figure className="story-quote" data-reveal>
              <q>{t("t3Quote")}</q>
              <div className="story-who">
                <Image
                  src="/images/testimonials/erwan-le-guilloux.png"
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <p>
                  <strong>{t("t3Author")}</strong>
                  <span>{t("t3Company")}</span>
                </p>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
