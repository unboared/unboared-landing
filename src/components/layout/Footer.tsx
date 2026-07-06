import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { URLS } from "@/lib/constants";
import Image from "next/image";

export default async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const locale = await getLocale();

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          {/* Marque */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="Unboared">
              <Image
                src="/images/logos/unboared-logo.png"
                alt="Unboared"
                width={140}
                height={48}
              />
            </Link>
            <p>{t("tagline")}</p>
            <p>
              <a href={URLS.contact}>contact@unboared.com</a>
              <br />
              {t("address")}
            </p>
          </div>

          {/* Explorer */}
          <nav aria-label={t("explore")}>
            <p className="footer-h">{t("explore")}</p>
            <ul>
              <li>
                <Link href="/games">{nav("games")}</Link>
              </li>
              <li>
                <a href={`/${locale}/#pricing`}>{nav("pricing")}</a>
              </li>
              <li>
                <a href={`/${locale}/#faq`}>{nav("faq")}</a>
              </li>
              <li>
                <a href={URLS.demo}>{t("demo")}</a>
              </li>
              <li>
                <Link href="/contact">{nav("contact")}</Link>
              </li>
              <li>
                <Link href="/about">{nav("about")}</Link>
              </li>
            </ul>
          </nav>

          {/* Suivre & légal */}
          <div>
            <p className="footer-h">{t("followLegal")}</p>
            <ul>
              <li>
                <a href={URLS.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={URLS.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={URLS.tiktok} target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </li>
              <li>
                <Link href="/terms-of-use">{nav("terms")}</Link>
              </li>
              <li>
                <Link href="/privacy-policy">{nav("privacy")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("madeIn")}</p>
        </div>
      </div>
    </footer>
  );
}
