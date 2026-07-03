"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { URLS } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("howItWorks"), href: "/#how-it-works", isAnchor: true },
    { label: t("games"), href: "/games", isAnchor: false },
    { label: t("pricing"), href: "/#pricing", isAnchor: true },
    { label: t("faq"), href: "/#faq", isAnchor: true },
    { label: t("contact"), href: "/contact", isAnchor: false },
  ];

  const switchLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    router.replace(pathname, { locale: newLocale });
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
    <header className={cn("header", scrolled && "scrolled", mobileOpen && "menu-open")}>
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
          <a href={URLS.signup} className="btn btn-primary header-cta-desktop">
            {t("cta")}
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
        <a href={URLS.signup} className="btn btn-primary">
          {t("cta")}
        </a>
      </div>
    </header>
  );
}
