"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { URLS } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg/70 backdrop-blur-2xl border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logos/unboared-picto.png"
            alt="Unboared"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span className="font-display font-bold text-lg tracking-tight">Unboared</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-sm text-text-muted hover:text-text transition-colors duration-200"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted hover:text-text transition-colors duration-200"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text hover:border-border-light transition-all duration-200 uppercase tracking-wider"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <a
            href={URLS.signup}
            className="px-5 py-2 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all duration-200 glow-accent"
          >
            {t("cta")}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-muted"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden bg-bg-elevated/95 backdrop-blur-2xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <a
                    key={link.href}
                    href={`/${locale}${link.href}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <button
                  onClick={switchLocale}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-text-muted uppercase tracking-wider"
                >
                  {locale === "fr" ? "EN" : "FR"}
                </button>
                <a
                  href={URLS.signup}
                  className="flex-1 text-center px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm"
                >
                  {t("cta")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
