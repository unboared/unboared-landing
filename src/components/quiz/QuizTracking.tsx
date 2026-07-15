"use client";

import { useEffect } from "react";

/**
 * Funnel wedge UnQuiz : landing_visit, une fois par affichage de la page.
 * Fire-and-forget vers la Cloud Function (collection wedge_events) — jamais
 * bloquant, jamais d'erreur visible. Les UTM partent avec l'événement pour
 * relier la visite à sa source (pub, endscreen joueur, newsletter…).
 */
const WEDGE_EVENTS_ENDPOINT =
  "https://sendcouponemail-5iiwpornyq-uc.a.run.app/wedgeEvent";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export default function QuizTracking({ locale }: { locale: string }) {
  useEffect(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      for (const key of UTM_KEYS) {
        const value = search.get(key);
        if (value) utm[key] = value;
      }
      const payload = JSON.stringify({
        event: "landing_visit",
        lang: locale,
        utm,
        env: process.env.NODE_ENV,
      });
      if (!(navigator.sendBeacon && navigator.sendBeacon(WEDGE_EVENTS_ENDPOINT, payload))) {
        fetch(WEDGE_EVENTS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // l'instrumentation ne casse jamais la page
    }
  }, [locale]);

  return null;
}
