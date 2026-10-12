import { Link } from "@/i18n/navigation";
import { URLS } from "@/lib/constants";
import DemoButton from "@/components/DemoButton";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import CtaSection from "@/components/sections/CtaSection";
import JsonLd from "@/components/JsonLd";
import {
  INTENT_CONTENT,
  INTENT_KEYS,
  INTENT_LINK_LABELS,
  INTENT_SLUGS,
  type IntentKey,
  type IntentLocale,
} from "@/data/intentPages";

function faqPageJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/**
 * Page « d'intention » (blind test pour bar, pub quiz software…) : un héros qui
 * répond à la recherche, des blocs factuels, puis les sections communes du site
 * (fonctionnement, témoignages, tarif) et une FAQ propre à la page.
 */
export default function IntentPage({ locale, pageKey }: { locale: IntentLocale; pageKey: IntentKey }) {
  const c = INTENT_CONTENT[locale][pageKey];
  const slug = INTENT_SLUGS[pageKey][locale];
  // utm_content seul : les visites venues d'une pub gardent leur source et leur
  // campagne (AttributionTracker n'écrase pas un paramètre déjà présent).
  const signupHref = `${URLS.signup}?utm_content=page-${slug}`;
  const related = INTENT_KEYS.filter((k) => k !== pageKey);

  return (
    <>
      <JsonLd data={faqPageJsonLd(c.faq)} />

      <section className="intent-hero">
        <div className="wrap intent-hero-grid">
          <div className="intent-hero-text">
            <p className="hero-kicker">{c.kicker}</p>
            <h1>{c.title}</h1>
            <p className="lead">{c.lead}</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href={signupHref}>
                {c.cta}
              </a>
              <DemoButton className="btn btn-ghost" />
            </div>
            <p className="intent-trust">{c.trust}</p>
          </div>
          <figure className="intent-hero-media">
            {/* Poster immédiat, lecture lancée à la visibilité par PageFx (data-io). */}
            <video muted loop playsInline preload="none" data-io poster={c.media.poster} aria-label={c.media.alt}>
              <source src={c.media.video} type="video/mp4" />
            </video>
          </figure>
        </div>
      </section>

      <section className="section intent-blocks">
        <div className="wrap">
          {c.blocks.map((block) => (
            <div className="intent-block" data-reveal key={block.title}>
              <h2>{block.title}</h2>
              <div>
                <p>{block.body}</p>
                {block.bullets && (
                  <ul>
                    {block.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />

      <section className="section" id="faq">
        <div className="wrap">
          <h2 data-reveal>{c.faqTitle}</h2>
          <div className="faq-list" data-reveal>
            {c.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <nav className="intent-related" aria-label={c.relatedTitle} data-reveal>
            <p>{c.relatedTitle}</p>
            <ul>
              {related.map((k) => (
                <li key={k}>
                  <Link href={`/${INTENT_SLUGS[k][locale]}`}>{INTENT_LINK_LABELS[k][locale]}</Link>
                </li>
              ))}
              <li>
                <Link href="/games">{locale === "fr" ? "Tous les jeux" : "All the games"}</Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
