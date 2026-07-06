import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { URLS } from "@/lib/constants";

export default async function CtaSection() {
  const t = await getTranslations("cta");

  return (
    <section className="final">
      <Image
        className="bg"
        src="/images/photos/anim-zenith-strasbourg.jpg"
        alt=""
        fill
        sizes="100vw"
        loading="lazy"
      />
      <div className="scrim" aria-hidden="true" />
      <div className="wrap">
        <h2 data-reveal>
          {t("titlePre")}
          <span className="mark">{t("titleMark")}</span>
          {t("titlePost")}
        </h2>
        <div data-reveal>
          <a className="btn btn-primary" href={URLS.signup}>
            {t("primary")}
          </a>
          <p className="small">{t("small")}</p>
        </div>
      </div>
    </section>
  );
}
