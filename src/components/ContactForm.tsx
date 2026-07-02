"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contactPage");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  // Timestamp of when the form mounted — lets the API reject instant bot POSTs.
  // Set in an effect (not during render) to stay pure; 0 until the client mounts.
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      // Honeypot: stays empty for real users, bots fill every field.
      contact_ref: formData.get("contact_ref") as string,
      renderedAt: renderedAt.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
      } else {
        console.error("Contact API error:", json);
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
      {/* Honeypot — hidden from real users, a trap for bots. Do not remove.
          Name is deliberately non-standard so browser autofill / password
          managers don't populate it for genuine visitors. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <label htmlFor="contact_ref">Leave this field empty</label>
        <input
          id="contact_ref"
          name="contact_ref"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
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
