import { getTranslations } from "next-intl/server";

export default async function DemoVideoSection() {
  const t = await getTranslations("demo");

  return (
    <section className="demo" id="demo">
      <div className="wrap">
        <div className="demo-head" data-reveal>
          <h2>{t("title")}</h2>
          <p className="lead">{t("lead")}</p>
        </div>
        <div className="demo-frame" data-reveal>
          {/* Below-fold : pas d'autoPlay — PageFx lance la lecture à la visibilité
              (via data-io), ce qui évite un téléchargement au parse. Les <source>
              réutilisent les fichiers du hero (cache-hit, 0 octet en plus).
              TODO : remplacer par le nouveau montage Remotion « démo 40 s ». */}
          <video
            muted
            loop
            playsInline
            preload="none"
            data-io
            poster="/videos/hero-poster.jpg"
            aria-label={t("videoAria")}
          >
            <source src="/videos/hero.webm" type="video/webm" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
