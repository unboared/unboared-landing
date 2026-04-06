"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LeadMagnetSection() {
  const t = useTranslations("leadMagnet");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        // Trigger PDF download
        const link = document.createElement("a");
        link.href = "/checklist-premiere-soiree-unboared.pdf";
        link.download = "Checklist-Premiere-Soiree-Unboared.pdf";
        link.click();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
          className="relative bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/25 rounded-3xl p-10 text-center overflow-hidden"
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 mx-auto mb-5">
              <Download className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("title")}</h2>
            <p className="text-text-muted mb-8 max-w-lg mx-auto leading-relaxed">{t("subtitle")}</p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <CheckCircle2 className="w-10 h-10 text-success" />
                <p className="font-semibold text-text">{t("successTitle")}</p>
                <p className="text-sm text-text-muted">{t("successSubtitle")}</p>
                <a
                  href="/checklist-premiere-soiree-unboared.pdf"
                  download="Checklist-Premiere-Soiree-Unboared.pdf"
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t("downloadAgain")}
                </a>
              </motion.div>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  className="flex-1 px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
                  required
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t("cta")
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="text-error text-sm mt-3">{t("errorMessage")}</p>
            )}

            {status !== "success" && (
              <p className="text-xs text-text-dim mt-4">{t("privacy")}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
