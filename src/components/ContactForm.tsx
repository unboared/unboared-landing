"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contactPage");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      access_key: "07f329bf-14a7-4327-8416-ee6e436f5ea3",
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      subject: "Nouveau message depuis unboared.com",
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-bg-card border border-success/30 rounded-2xl p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t("successTitle")}</h3>
        <p className="text-text-muted">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">{t("formName")}</label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">{t("formEmail")}</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">{t("formMessage")}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors resize-none"
          required
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-error text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{t("errorMessage")}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {t("formSend")}
      </button>
    </form>
  );
}
