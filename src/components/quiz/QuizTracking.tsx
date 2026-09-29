"use client";

import { useEffect } from "react";
import { trackQuizEvent } from "./trackQuizEvent";

/**
 * Funnel wedge UnQuiz : landing_visit, une fois par affichage de la page.
 * Fire-and-forget (voir trackQuizEvent) — jamais bloquant, jamais d'erreur
 * visible. Les UTM partent avec l'événement pour relier la visite à sa source
 * (pub, endscreen joueur, newsletter…) ; une visite Meta est signalée par
 * from_meta, sans le fbclid.
 */
export default function QuizTracking({ locale }: { locale: string }) {
  useEffect(() => {
    trackQuizEvent("landing_visit", { lang: locale });
  }, [locale]);

  return null;
}
