"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { URLS } from "@/lib/constants";
import { readStored } from "./AttributionTracker";

// Parrainage (décision du 13/10/2026) : un client partage un lien
// unboared.com/?utm_source=parrainage&utm_content=<CODE>. Le code donne 1 mois
// d'essai au lieu de 14 jours (décidé par stripe-b2b referral.js, à l'inscription).
// Ce bandeau l'annonce dès l'arrivée, avec le nom du lieu qui parraine, lu dans
// `referralCodes/{CODE}` (lecture publique d'un seul code, règles Firestore).
// Le code voyage jusqu'à la console via AttributionTracker (utm_content).
const CODE_RE = /^[A-Z]{3,8}[0-9]{2}$/;
const FIRESTORE_DOC =
  process.env.NEXT_PUBLIC_REFERRAL_DOC_BASE ||
  "https://firestore.googleapis.com/v1/projects/unboared-b2b/databases/(default)/documents/referralCodes/";
const CLOSED_KEY = "ub_referral_banner_closed";

function referralCodeFromVisit(): string {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("utm_source") === "parrainage" ? params.get("utm_content") : null;
  const stored = readStored();
  const fromStore = stored.utm_source === "parrainage" ? stored.utm_content : null;
  const code = String(fromUrl || fromStore || "")
    .toUpperCase()
    .replace(/[\s-]/g, "");
  return CODE_RE.test(code) ? code : "";
}

export default function ReferralBanner() {
  const t = useTranslations("referral");
  const [invite, setInvite] = useState<{ code: string; venue: string | null } | null>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const code = referralCodeFromVisit();
    if (!code) return;
    try {
      if (sessionStorage.getItem(CLOSED_KEY) === code) return;
    } catch {
      // stockage indisponible : on affiche
    }
    let alive = true;
    fetch(FIRESTORE_DOC + code)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (!alive || !doc) return; // code inconnu : rien à promettre
        const venue = doc.fields?.venueName?.stringValue;
        setInvite({ code, venue: typeof venue === "string" && venue.trim() ? venue.trim().slice(0, 60) : null });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("has-referral", !!invite);
    const bar = barRef.current;
    if (!invite || !bar) {
      root.style.removeProperty("--referral-h");
      return undefined;
    }
    // Le bas de page reste lisible : on réserve exactement la hauteur du bandeau (texte sur 2-5 lignes).
    const sync = () => root.style.setProperty("--referral-h", `${Math.ceil(bar.getBoundingClientRect().height) + 8}px`);
    sync();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    ro?.observe(bar);
    return () => ro?.disconnect();
  }, [invite]);

  if (!invite) return null;

  const close = () => {
    try {
      sessionStorage.setItem(CLOSED_KEY, invite.code);
    } catch {
      // rien
    }
    setInvite(null);
  };

  return (
    <aside ref={barRef} className="referral-bar" role="region" aria-label={t("label")}>
      <div className="referral-bar-inner">
        <span className="referral-gift" aria-hidden="true">
          🎁
        </span>
        <p className="referral-text">
          <strong>{invite.venue ? t("titleFrom", { venue: invite.venue }) : t("title")}</strong>
          <span>{t("body", { code: invite.code })}</span>
        </p>
        <a className="btn btn-primary referral-cta" href={URLS.signup}>
          {t("cta")}
        </a>
        <button type="button" className="referral-close" onClick={close} aria-label={t("close")}>
          ×
        </button>
      </div>
    </aside>
  );
}
