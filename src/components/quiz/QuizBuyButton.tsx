"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Mail, CheckCircle2, Loader2, X, Wrench } from "lucide-react";
import { privacyLink } from "@/components/privacyLink";
import { WEDGE_WAITLIST_ENDPOINT, readUtm, trackQuizEvent } from "./trackQuizEvent";

/** Ancres posées par le jeu (crédits IA épuisés) ; #prevenir / #notify gardées pour les anciens liens. */
const BUY_HASHES = ["#acheter", "#buy", "#prevenir", "#notify"];

type Plan = "pass" | "creator" | "ai-credits";

/**
 * « Acheter » (Pass Soirée) / « S'abonner » (Créateur) — décision Victorien
 * 24/09 : un bouton d'achat mesure un vrai désir, bien plus qu'un « Me
 * prévenir ». Rien n'est encore en vente : le clic (buy_click) ouvre un même
 * écran « on y travaille » qui propose de laisser son email pour être prévenu
 * (waitlist_signup, accord explicite). On compte les deux séparément.
 * La route serveur peut échouer : tout échec finit en message, jamais en page cassée.
 */
export default function QuizBuyButton({
  plan,
  openOnHash = false,
}: {
  plan: "pass" | "creator";
  /** La carte Pass écoute #acheter / #buy (avec ?plan=ai-credits depuis le jeu). */
  openOnHash?: boolean;
}) {
  const t = useTranslations("quizLanding.buy");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  // Offre réellement visée : celle de la carte, ou « ai-credits » depuis le jeu.
  const [buyPlan, setBuyPlan] = useState<Plan>(plan);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<"invalid" | "failed">("failed");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const openedAt = useRef(0);
  const emailRef = useRef<HTMLInputElement>(null);
  // Focus sur l'email seulement après un clic : à l'arrivée depuis le jeu, le
  // clavier du téléphone masquerait l'écran.
  const focusOnOpen = useRef(false);
  // Écran rendu dans <body> (portail), jamais côté serveur.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function open(nextPlan: Plan, trigger: "click" | "hash") {
    openedAt.current = Date.now();
    focusOnOpen.current = trigger === "click";
    setBuyPlan(nextPlan);
    setStatus("idle");
    setIsOpen(true);
    trackQuizEvent("buy_click", { lang: locale, plan: nextPlan, trigger });
  }

  // Arrivée depuis le jeu (/quiz?plan=ai-credits#acheter).
  useEffect(() => {
    if (!openOnHash || !BUY_HASHES.includes(window.location.hash)) return;
    const fromGame = new URLSearchParams(window.location.search).get("plan") === "ai-credits";
    const id = window.setTimeout(() => open(fromGame ? "ai-credits" : plan, "hash"), 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule fois, au chargement
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (focusOnOpen.current) emailRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      // text/plain : requête « simple », pas de preflight CORS (comme wedgeEvent).
      const res = await fetch(WEDGE_WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          email: email.trim(),
          plan: buyPlan,
          lang: locale,
          consent: true,
          renderedAt: openedAt.current,
          // Honeypot : vide pour un humain, les bots remplissent tout.
          hp: honeypot,
          utm: readUtm(),
          host: window.location.hostname,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.success === true) {
        setStatus("success");
        trackQuizEvent("waitlist_signup", { lang: locale, plan: buyPlan });
        return;
      }
      setError(json.error === "invalid-email" ? "invalid" : "failed");
      setStatus("error");
    } catch {
      setError("failed");
      setStatus("error");
    }
  }

  const fieldId = `quiz-buy-${plan}`;

  return (
    <>
      <button type="button" className="btn btn-primary quiz-buy-cta" onClick={() => open(plan, "click")}>
        {t(`cta.${plan}`)}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                  onClick={() => setIsOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`${fieldId}-title`}
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="quiz-buy-dialog fixed z-[60] bg-bg-card border border-border p-6 text-left"
                >
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={t("close")}
                    className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text hover:bg-bg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 id={`${fieldId}-title`} className="text-xl font-bold text-center mb-2">
                    {t("title")}
                  </h3>
                  <p className="text-text-muted text-sm text-center leading-relaxed mb-5">
                    {t(`text.${buyPlan}`)}
                  </p>

                  {status === "success" ? (
                    <div className="flex flex-col items-center gap-2 py-3 text-success text-center" role="status">
                      <CheckCircle2 className="w-8 h-8" />
                      <p className="text-sm font-medium">{t("success")}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Honeypot — invisible pour un humain, piège à bots. Ne pas retirer. */}
                      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                        <label htmlFor={`${fieldId}-ref`}>Leave this field empty</label>
                        <input
                          id={`${fieldId}-ref`}
                          name="notify_ref"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                        <input
                          ref={emailRef}
                          id={`${fieldId}-email`}
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("emailPlaceholder")}
                          aria-label={t("emailPlaceholder")}
                          className="w-full pl-9 pr-3 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors text-sm"
                          required
                        />
                      </div>
                      <label className="quiz-notify-consent">
                        <input
                          id={`${fieldId}-consent`}
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          required
                        />
                        <span>{t("consent")}</span>
                      </label>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="btn btn-primary w-full disabled:opacity-60"
                      >
                        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : t("submit")}
                      </button>
                      {status === "error" && (
                        <p className="text-error text-xs text-center" role="alert">
                          {t(error === "invalid" ? "invalid" : "error")}
                        </p>
                      )}
                      <p className="form-privacy-note text-center">{t.rich("privacyNote", { link: privacyLink })}</p>
                    </form>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
