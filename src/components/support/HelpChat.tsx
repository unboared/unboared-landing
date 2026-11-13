"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

/**
 * Bulle « Une question ? » (chat Crisp, même compte que la console).
 *
 * Crisp n'est téléchargé qu'au premier clic : aucun script tiers ni cookie Crisp
 * pour un visiteur qui n'a rien demandé (donc rien à ajouter au bandeau cookies,
 * et aucun poids sur le chargement de la page). Une fois un message envoyé depuis
 * cet appareil, il est rechargé aux visites suivantes pour afficher notre réponse.
 * ⚠️ Ne configurer aucun déclencheur automatique (« trigger ») dans Crisp.
 *
 * La bulle affichée est la nôtre ; celle de Crisp reste cachée, sa fenêtre ne
 * s'ouvre qu'à la demande. Interrupteur : HELP_CHAT_ENABLED.
 */
const HELP_CHAT_ENABLED = true;
/** Identifiant public du site dans Crisp (pas un secret). Le même que dans la console. */
const CRISP_WEBSITE_ID = "be6bd28a-82bf-4c91-b5f2-0e96edf735f2";
const SCRIPT_URL = "https://client.crisp.chat/l.js";
const USED_KEY = "ub_help_chat";
const SUPPORT_EMAIL = "contact@unboared.com";

type CrispQueue = {
  push: (cmd: unknown[]) => unknown;
  get?: (key: string) => unknown;
  is?: (key: string) => boolean;
};
type CrispWindow = Window & {
  $crisp?: CrispQueue;
  CRISP_WEBSITE_ID?: string;
  CRISP_RUNTIME_CONFIG?: { locale?: string };
};

const READY_TIMEOUT_MS = 8000;
const HIDDEN_CLASS = "ub-crisp-hidden";
const STYLE_ID = "ub-crisp-style";

const crisp = () => (window as CrispWindow).$crisp;
const push = (cmd: unknown[]) => crisp()?.push(cmd);

let scriptInserted = false;
let ready = false;
/** La fenêtre Crisp n'est visible que si le visiteur l'a ouverte. */
let wantVisible = false;
type Waiter = { resolve: () => void; reject: (error: Error) => void };
const waiters = new Set<Waiter>();
const handlers = { closed: () => {}, unread: () => {}, ready: () => {} };

function usedBefore(): boolean {
  try {
    return localStorage.getItem(USED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Le vrai verrou est cette règle CSS : Crisp ignore parfois `chat:hide` quand son
 * widget n'existe pas encore (constaté dans la console le 13/11/2026).
 */
function setWanted(visible: boolean) {
  wantVisible = visible;
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `.${HIDDEN_CLASS} .crisp-client { display: none !important; }`;
    document.head.appendChild(style);
  }
  document.documentElement.classList.toggle(HIDDEN_CLASS, !visible);
}

function onSessionLoaded() {
  ready = true;
  push(["config", "sound:mute", [true]]);
  if (!wantVisible) {
    push(["do", "chat:close"]);
    push(["do", "chat:hide"]);
    // Réponse arrivée page fermée : `message:received` ne la signale pas, le compteur si.
    let unread = 0;
    try {
      unread = Number(crisp()?.get?.("chat:unread:count")) || 0;
    } catch {
      unread = 0;
    }
    if (unread > 0) handlers.unread();
  }
  waiters.forEach((waiter) => waiter.resolve());
  waiters.clear();
  // Crisp arrivé après les 8 s d'attente : le message « chat bloqué » n'a plus lieu d'être.
  handlers.ready();
}

/**
 * Télécharge Crisp une seule fois, caché, et attend qu'il soit prêt (`session:loaded`,
 * pas `script.onload` : sur un vieux navigateur Crisp renonce en silence). Rejette si le
 * script est bloqué ou muet pendant 8 s ; un nouvel appel réessaie.
 */
function loadCrisp(locale: string): Promise<void> {
  if (!scriptInserted) {
    scriptInserted = true;
    ready = false;
    setWanted(wantVisible);
    const win = window as CrispWindow;
    win.$crisp = [] as unknown as CrispQueue;
    win.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
    win.CRISP_RUNTIME_CONFIG = { locale };
    push(["safe", true]);
    push(["config", "sound:mute", [true]]);
    push(["do", "chat:hide"]);
    push(["on", "session:loaded", onSessionLoaded]);
    push(["on", "chat:closed", () => handlers.closed()]);
    push([
      "on",
      "message:received",
      () => {
        if (!wantVisible) handlers.unread();
      },
    ]);
    // Mémorisé seulement quand un message est parti : un clic de curiosité ne recharge rien ensuite.
    push([
      "on",
      "message:sent",
      () => {
        try {
          localStorage.setItem(USED_KEY, "1");
        } catch {
          // navigation privée : le chat marche, il ne sera juste pas rechargé seul
        }
      },
    ]);
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onerror = () => {
      script.remove();
      scriptInserted = false;
      waiters.forEach((waiter) => waiter.reject(new Error("crisp-blocked")));
      waiters.clear();
    };
    document.head.appendChild(script);
  }
  if (ready) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const waiter: Waiter = { resolve: () => {}, reject: () => {} };
    const timer = setTimeout(() => {
      waiters.delete(waiter);
      reject(new Error("crisp-timeout"));
    }, READY_TIMEOUT_MS);
    waiter.resolve = () => {
      clearTimeout(timer);
      resolve();
    };
    waiter.reject = (error) => {
      clearTimeout(timer);
      reject(error);
    };
    waiters.add(waiter);
  });
}

export default function HelpChat() {
  const t = useTranslations("helpChat");
  const locale = useLocale();
  // Changement de langue = le layout est remonté : on repart de l'état réel de la fenêtre
  // (sinon notre bulle réapparaît à côté d'un chat resté ouvert). Toujours faux côté serveur
  // et au premier rendu : `wantVisible` ne change qu'après un clic.
  const [open, setOpen] = useState(() => wantVisible);
  const [unread, setUnread] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    handlers.closed = () => {
      setWanted(false);
      push(["do", "chat:hide"]);
      setOpen(false);
    };
    handlers.unread = () => setUnread(true);
    handlers.ready = () => setBlocked(false);
    // Un message déjà envoyé depuis cet appareil : on recharge le chat pour afficher notre réponse.
    if (HELP_CHAT_ENABLED && usedBefore()) loadCrisp(locale).catch(() => {});
    return () => {
      mounted.current = false;
      handlers.closed = () => {};
      handlers.unread = () => {};
      handlers.ready = () => {};
    };
  }, [locale]);

  if (!HELP_CHAT_ENABLED || open) return null;

  const handleOpen = () => {
    setBlocked(false);
    setBusy(true);
    loadCrisp(locale)
      .then(() => {
        // Le visiteur a cliqué : on ouvre même si le composant a été remonté entre-temps
        // (changement de langue) ; la nouvelle instance reprend l'état via `wantVisible`.
        setWanted(true);
        push(["do", "chat:show"]);
        push(["do", "chat:open"]);
        if (!mounted.current) return;
        setOpen(true);
        setUnread(false);
      })
      .catch(() => {
        // Script bloqué ou Crisp muet : on donne l'email.
        if (mounted.current) setBlocked(true);
      })
      .finally(() => {
        if (mounted.current) setBusy(false);
      });
  };

  return (
    <div className="help-chat">
      {blocked && (
        <p className="help-chat-blocked" role="status">
          {t("blocked")} <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
      )}
      <button
        type="button"
        className="help-chat-bubble"
        onClick={handleOpen}
        disabled={busy}
        aria-busy={busy}
        aria-label={t("open")}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3C6.9 3 3 6.6 3 11c0 2.2 1 4.2 2.7 5.6L5 21l4.3-2.3c.9.2 1.8.3 2.7.3 5.1 0 9-3.6 9-8s-3.9-8-9-8Z"
          />
        </svg>
        <span className="help-chat-label">{t("open")}</span>
        {unread && <span className="help-chat-dot" aria-label={t("unread")} />}
      </button>
    </div>
  );
}
