"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Monitor, Smartphone, X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { URLS } from "@/lib/constants";

export default function DemoButton({ className }: { className?: string }) {
  const t = useTranslations("demoModal");
  const [isOpen, setIsOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Only intercept on mobile
    if (window.innerWidth < 768) {
      e.preventDefault();
      setIsOpen(true);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "07f329bf-14a7-4327-8416-ee6e436f5ea3",
          email,
          subject: "Rappel : testez la démo Unboared sur ordinateur",
          message: `L'utilisateur ${email} a demandé un rappel pour tester la démo Unboared sur ordinateur. Lien démo : ${URLS.demo}`,
          name: "Rappel démo",
        }),
      });
      const json = await res.json();
      setEmailStatus(json.success ? "success" : "error");
    } catch {
      setEmailStatus("error");
    }
  }

  return (
    <>
      <motion.a
        href={URLS.demo}
        onClick={handleClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={className}
      >
        {t("cta")}
      </motion.a>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border rounded-t-3xl p-6 pb-10"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text hover:bg-bg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icons */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-primary" />
                </div>
                <div className="w-8 h-px bg-border" />
                <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-text-muted" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-center mb-2">{t("title")}</h3>
              <p className="text-text-muted text-sm text-center leading-relaxed mb-6">
                {t("description")}
              </p>

              {/* Email reminder */}
              {emailStatus === "success" ? (
                <div className="flex flex-col items-center gap-2 py-3 text-success">
                  <CheckCircle2 className="w-8 h-8" />
                  <p className="text-sm font-medium">{t("emailSuccess")}</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3 mb-4">
                  <p className="text-sm font-medium text-center">{t("emailLabel")}</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("emailPlaceholder")}
                        className="w-full pl-9 pr-3 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors text-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={emailStatus === "loading"}
                      className="px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {emailStatus === "loading" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t("emailSend")
                      )}
                    </button>
                  </div>
                  {emailStatus === "error" && (
                    <p className="text-error text-xs text-center">{t("emailError")}</p>
                  )}
                </form>
              )}

              {/* Continue anyway */}
              <a
                href={URLS.demo}
                className="block text-center text-xs text-text-dim hover:text-text-muted transition-colors mt-2"
              >
                {t("continueAnyway")}
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
