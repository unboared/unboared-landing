"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { privacyLink } from "@/components/privacyLink";
import { WEDGE_WAITLIST_ENDPOINT, readUtm, trackQuizEvent } from "./trackQuizEvent";

/** Ancres posées par le jeu quand les crédits IA gratuits sont épuisés. */
const NOTIFY_HASHES = ["#prevenir", "#notify"];

type Plan = "pass" | "creator" | "ai-credits";

/**
 * « Me prévenir » des cartes Pass Soirée / Créateur : mesure l'intérêt
 * (pass_interest) puis inscrit l'email à la liste d'attente, avec consentement
 * explicite. La route serveur peut ne pas exister encore : tout échec finit en
 * message d'erreur, jamais en page cassée.
 */
export default function QuizNotifyButton({
  plan,
  openOnHash = false,
}: {
  plan: "pass" | "creator";
  /** La carte Pass écoute #prevenir / #notify (avec ?plan=ai-credits le cas échéant). */
  openOnHash?: boolean;
}) {
  const t = useTranslations("quizLanding.notify");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  // Plan réellement inscrit : celui de la carte, ou « ai-credits » depuis le jeu.
  const [signupPlan, setSignupPlan] = useState<Plan>(plan);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<"invalid" | "failed">("failed");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const openedAt = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  // Focus sur l'email seulement après un clic : à l'arrivée depuis le jeu, le
  // clavier du téléphone masquerait la carte.
  const focusOnOpen = useRef(false);
  // Arrivée par ancre : on descend jusqu'à la carte une fois le formulaire
  // déplié (un défilement lancé avant est interrompu pendant l'hydratation).
  const scrollOnOpen = useRef(false);

  function open(nextPlan: Plan, trigger: "click" | "hash") {
    openedAt.current = Date.now();
    focusOnOpen.current = trigger === "click";
    scrollOnOpen.current = trigger === "hash";
    setSignupPlan(nextPlan);
    setIsOpen(true);
    trackQuizEvent("pass_interest", { lang: locale, plan: nextPlan, trigger });
  }

  // Arrivée depuis le jeu (/quiz?plan=ai-credits#prevenir) : descendre aux
  // tarifs, formulaire ouvert.
  useEffect(() => {
    if (!openOnHash || !NOTIFY_HASHES.includes(window.location.hash)) return;
    const fromGame = new URLSearchParams(window.location.search).get("plan") === "ai-credits";
    const id = window.setTimeout(() => open(fromGame ? "ai-credits" : plan, "hash"), 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule fois, au chargement
  }, []);

  // Formulaire ouvert au clic : le curseur va directement dans le champ email.
  useEffect(() => {
    if (isOpen && focusOnOpen.current) emailRef.current?.focus({ preventScroll: true });
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
          plan: signupPlan,
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
        trackQuizEvent("waitlist_signup", { lang: locale, plan: signupPlan });
        return;
      }
      setError(json.error === "invalid-email" ? "invalid" : "failed");
      setStatus("error");
    } catch {
      setError("failed");
      setStatus("error");
    }
  }

  const fieldId = `quiz-notify-${plan}`;

  return (
    <div ref={rootRef} className="quiz-notify">
      {!isOpen && (
        <button
          type="button"
          className="btn btn-ghost"
          aria-expanded={false}
          aria-controls={`${fieldId}-form`}
          onClick={() => open(plan, "click")}
        >
          {t("cta")}
        </button>
      )}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${fieldId}-form`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onAnimationComplete={() => {
              if (!scrollOnOpen.current) return;
              scrollOnOpen.current = false;
              rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="overflow-hidden"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center gap-2 py-3 text-success text-center" role="status">
                <CheckCircle2 className="w-8 h-8" />
                <p className="text-sm font-medium">{t("success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="quiz-notify-form space-y-3">
                <p className="text-sm font-semibold">
                  {t(signupPlan === "ai-credits" ? "titleAiCredits" : "title")}
                </p>
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
                <p className="form-privacy-note">{t.rich("privacyNote", { link: privacyLink })}</p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
