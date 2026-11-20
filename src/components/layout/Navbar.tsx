"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { URLS } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { INTENT_SLUGS, intentKeyFromSlug } from "@/data/intentSlugs";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Sur mobile, le bouton d'essai du menu n'apparaît qu'une fois celui du haut
  // de page sorti de l'écran : jamais deux boutons rouges identiques à la fois.
  // Sur une page sans bouton en haut, il est là d'office.
  const [pastFold, setPastFold] = useState(false);

  useEffect(() => {
    // Position réelle du bouton du haut de page (relue à chaque défilement et
    // redimensionnement) ; 72 px = hauteur du menu fixe qui le recouvre.
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const heroCta = document.querySelector(".hero-cta .btn-primary");
      setPastFold(!heroCta || heroCta.getBoundingClientRect().bottom < 72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, locale]);

  const navLinks = [
    { label: t("howItWorks"), href: "/#how-it-works", isAnchor: true },
    { label: t("games"), href: "/games", isAnchor: false },
    { label: t("pricing"), href: "/#pricing", isAnchor: true },
    { label: t("faq"), href: "/#faq", isAnchor: true },
    { label: t("contact"), href: "/contact", isAnchor: false },
  ];

  const switchLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    // Les pages d'intention n'ont pas la même adresse dans les deux langues
    // (/fr/blind-test-bar ↔ /en/music-quiz-pub) : garder le chemin mènerait à une 404.
    const intentKey = intentKeyFromSlug(locale, pathname.replace(/^\//, ""));
    router.replace(intentKey ? `/${INTENT_SLUGS[intentKey][newLocale]}` : pathname, { locale: newLocale });
  };

  const renderLink = (link: (typeof navLinks)[number], onClick?: () => void) =>
    link.isAnchor ? (
      <a key={link.href} href={`/${locale}${link.href}`} onClick={onClick}>
        {link.label}
      </a>
    ) : (
      <Link key={link.href} href={link.href} onClick={onClick}>
        {link.label}
      </Link>
    );

  return (
    <header
      className={cn(
        "header",
        scrolled && "scrolled",
        pastFold && "past-fold",
        mobileOpen && "menu-open",
      )}
    >
      <div className="wrap">
        <Link href="/" className="header-logo" aria-label="Unboared">
          <Image
            src="/images/logos/unboared-logo.png"
            alt="Unboared"
            width={140}
            height={48}
            priority
          />
        </Link>

        <nav className="header-nav" aria-label="Navigation principale">
          {navLinks.map((link) => renderLink(link))}
        </nav>

        <div className="header-right">
          <button
            type="button"
            onClick={switchLocale}
            className="header-locale"
            aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <a href={URLS.login} className="header-login">
            {t("login")}
          </a>
          <a href={URLS.signup} className="btn btn-primary header-trial">
            {t("trial")}
          </a>
          <button
            type="button"
            className="header-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={cn("header-menu", mobileOpen && "open")}>
        {navLinks.map((link) => renderLink(link, () => setMobileOpen(false)))}
        <a href={URLS.login}>{t("login")}</a>
        <a href={URLS.signup} className="btn btn-primary">
          {t("trialLong")}
        </a>
      </div>
    </header>
  );
}
