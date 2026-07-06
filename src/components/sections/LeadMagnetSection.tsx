"use client";

import { useTranslations, useLocale } from "next-intl";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * Checklist « première soirée » — même mécanique qu'avant (POST /api/subscribe
 * avec honeypot + renderedAt, téléchargement du PDF), redesign cinématique.
 */
export default function LeadMagnetSection() {
  const t = useTranslations("leadMagnet");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  // Honeypot value — stays empty for real users, bots fill every field.
  const [honeypot, setHoneypot] = useState("");
  // Timestamp of when the form mounted — lets the API reject instant bot POSTs.
  // Set in an effect (not during render) to stay pure; 0 until the client mounts.
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const pdfFile = locale === "en"
    ? "/checklist-first-game-night-unboared.pdf"
    : "/checklist-premiere-soiree-unboared.pdf";
  const pdfName = locale === "en"
    ? "Checklist-First-Game-Night-Unboared.pdf"
    : "Checklist-Premiere-Soiree-Unboared.pdf";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          // Honeypot: stays empty for real users, bots fill every field.
          newsletter_ref: honeypot,
          renderedAt: renderedAt.current,
        }),
      });

      if (res.ok) {
        setStatus("success");
        // Trigger PDF download
        const link = document.createElement("a");
        link.href = pdfFile;
        link.download = pdfName;
        link.click();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="leadmag" data-reveal>
          <div>
            <h2>{t("title")}</h2>
            <p className="leadmag-sub">{t("subtitle")}</p>
          </div>
          <div>
            {status === "success" ? (
              <div className="leadmag-success">
                <CheckCircle2 className="w-9 h-9 text-success" />
                <strong>{t("successTitle")}</strong>
                <p>{t("successSubtitle")}</p>
                <a href={pdfFile} download={pdfName} className="btn btn-ghost" style={{ alignSelf: "flex-start" }}>
                  <Download className="w-4 h-4" />
                  {t("downloadAgain")}
                </a>
              </div>
            ) : (
              <>
                <form className="leadmag-form" onSubmit={handleSubmit}>
                  {/* Honeypot — hidden from real users, a trap for bots. Do not
                      remove. Name is deliberately non-standard so browser autofill
                      / password managers don't populate it for genuine visitors. */}
                  <div
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
                  >
                    <label htmlFor="newsletter_ref">Leave this field empty</label>
                    <input
                      id="newsletter_ref"
                      name="newsletter_ref"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    required
                    disabled={status === "loading"}
                  />
                  <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t("cta")
                    )}
                  </button>
                </form>
                {status === "error" && <p className="leadmag-error">{t("errorMessage")}</p>}
                <p className="leadmag-note">{t("privacy")}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
