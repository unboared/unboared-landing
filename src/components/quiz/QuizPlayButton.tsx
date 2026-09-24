"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Tv, Smartphone, X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { privacyLink } from "@/components/privacyLink";
import { isPhoneViewport, trackQuizEvent } from "./trackQuizEvent";

/** Ancres posées par le jeu quand il renvoie un téléphone vers la landing. */
const SEND_HASHES = ["#envoyer", "#send"];

/**
 * CTA « jouer » de la landing UnQuiz. Sur ordinateur/TV : simple lien vers le
 * show. Sur téléphone : le show ne se joue pas là (c'est la TV le plateau) →
 * panneau du bas qui donne l'adresse courte et propose d'envoyer le lien par
 * email (même structure et mêmes défenses que DemoButton).
 */
export default function QuizPlayButton({
  href,
  label,
  placement,
  className,
  openOnHash = false,
}: {
  href: string;
  label: string;
  /** hero | free | final — pour savoir quel CTA a ouvert le panneau. */
  placement: string;
  className?: string;
  /** Un seul CTA de la page écoute #envoyer / #send, sinon le panneau s'ouvrirait en double. */
  openOnHash?: boolean;
}) {
  const t = useTranslations("quizLanding.tvSheet");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState<"invalid" | "failed">("failed");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  // Ouverture du panneau — permet à l'API de rejeter les POST scriptés instantanés.
  const openedAt = useRef(0);
  // Le panneau est rendu dans <body> (portail) : un ancêtre animé (transform)
  // ferait sinon de son `position: fixed` un positionnement relatif. Faux côté serveur.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function openSheet(trigger: "click" | "hash") {
    openedAt.current = Date.now();
    setIsOpen(true);
    trackQuizEvent("tv_link_sheet", { lang: locale, placement, trigger });
  }

  // Arrivée depuis le jeu sur un téléphone (/quiz#envoyer) : panneau ouvert d'office.
  useEffect(() => {
    if (!openOnHash || !SEND_HASHES.includes(window.location.hash)) return;
    if (!isPhoneViewport()) return;
    const id = window.setTimeout(() => openSheet("hash"), 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule fois, au chargement
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Seul le téléphone est intercepté : ailleurs, le lien part normalement.
    if (isPhoneViewport()) {
      e.preventDefault();
      openSheet("click");
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus("loading");

    try {
      const res = await fetch("/api/quiz-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          locale,
          renderedAt: openedAt.current,
          // Honeypot : vide pour un humain, les bots remplissent tout.
          quiz_ref: honeypot,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.success) {
        setEmailStatus("success");
        trackQuizEvent("link_requested", { lang: locale, placement });
        return;
      }
      setEmailError(json.error === "invalid-email" ? "invalid" : "failed");
      setEmailStatus("error");
    } catch {
      setEmailError("failed");
      setEmailStatus("error");
    }
  }

  const titleId = `quiz-tv-sheet-${placement}`;

  return (
    <>
      <a className={className} href={href} onClick={handleClick}>
        {label}
      </a>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Fond */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                  onClick={() => setIsOpen(false)}
                />

                {/* Panneau */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="quiz-sheet fixed bottom-0 left-0 right-0 z-[60] bg-bg-card border-t border-border rounded-t-3xl p-6 pb-10 text-left"
                >
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={t("close")}
                    className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text hover:bg-bg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center justify-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Tv className="w-6 h-6 text-primary" />
                    </div>
                    <div className="w-8 h-px bg-border" />
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-text-muted" />
                    </div>
                  </div>

                  <h3 id={titleId} className="text-xl font-bold text-center mb-2">
                    {t("title")}
                  </h3>
                  <p className="text-text-muted text-sm text-center leading-relaxed mb-4">
                    {t("text")}
                  </p>

                  {/* L'adresse courte, à recopier sur la TV */}
                  <p className="quiz-sheet-address" translate="no">
                    unboared.com/quiz
                  </p>

                  {emailStatus === "success" ? (
                    <div className="flex flex-col items-center gap-2 py-3 text-success" role="status">
                      <CheckCircle2 className="w-8 h-8" />
                      <p className="text-sm font-medium">{t("emailSuccess")}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailSubmit} className="space-y-3 mb-4">
                      {/* Honeypot — invisible pour un humain, piège à bots. Ne pas retirer. */}
                      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                        <label htmlFor={`quiz_ref-${placement}`}>Leave this field empty</label>
                        <input
                          id={`quiz_ref-${placement}`}
                          name="quiz_ref"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("emailPlaceholder")}
                            aria-label={t("emailPlaceholder")}
                            className="w-full pl-9 pr-3 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors text-sm"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={emailStatus === "loading"}
                          className="px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap"
                        >
                          {emailStatus === "loading" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            t("emailSend")
                          )}
                        </button>
                      </div>
                      {emailStatus === "error" && (
                        <p className="text-error text-xs text-center" role="alert">
                          {t(emailError === "invalid" ? "emailInvalid" : "emailError")}
                        </p>
                      )}
                      <p className="form-privacy-note text-center">
                        {t.rich("privacyNote", { link: privacyLink })}
                      </p>
                    </form>
                  )}

                  {/* Pas de TV : lancer quand même ici */}
                  {/* `here=1` : choix assumé, le jeu n'affiche pas son propre
                      écran « ce show se joue sur la TV » par-dessus. */}
                  <a
                    href={`${href}${href.includes("?") ? "&" : "?"}here=1`}
                    onClick={() => trackQuizEvent("play_here", { lang: locale, placement })}
                    className="block text-center text-xs text-text-dim hover:text-text-muted transition-colors mt-2"
                  >
                    {t("playHere")}
                  </a>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
