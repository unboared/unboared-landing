import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { URLS } from "@/lib/constants";
import Image from "next/image";

export default async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="bg-bg-card border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/images/logos/unboared-picto.png"
                alt="Unboared"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="font-display font-bold text-lg tracking-tight">Unboared</span>
            </div>
            <p className="text-text-dim text-sm leading-relaxed">{t("madeWith")}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t("product")}</h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li><Link href="/games" className="hover:text-text transition-colors">{nav("games")}</Link></li>
              <li><a href={URLS.demo} className="hover:text-text transition-colors">{t("demo")}</a></li>
              <li><a href="/#pricing" className="hover:text-text transition-colors">{nav("pricing")}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t("resources")}</h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li><a href="/#faq" className="hover:text-text transition-colors">{nav("faq")}</a></li>
              <li><Link href="/contact" className="hover:text-text transition-colors">{nav("contact")}</Link></li>
              <li><Link href="/about" className="hover:text-text transition-colors">{nav("about")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t("legal")}</h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li><Link href="/terms-of-use" className="hover:text-text transition-colors">{nav("terms")}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-text transition-colors">{nav("privacy")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-dim text-xs">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            <a href={URLS.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-text transition-colors text-xs">
              LinkedIn
            </a>
            <a href={URLS.instagram} target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-text transition-colors text-xs">
              Instagram
            </a>
            <a href={URLS.tiktok} target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-text transition-colors text-xs">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
