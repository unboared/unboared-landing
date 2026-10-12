"use client";

import { useEffect } from "react";
import { readStored, STORAGE_KEY, TRACKED_PARAMS } from "./AttributionTracker";

/**
 * Marque la visite d'une page d'intention (/fr/blind-test-bar…) pour mesurer ce
 * que le référencement apporte : utm_medium=organic, utm_content=page-<adresse>,
 * utm_source = site d'où vient le visiteur (google.com, chatgpt.com…).
 * AttributionTracker recopie ensuite ces paramètres sur TOUS les liens vers la
 * console (héros, tarif, bas de page).
 *
 * Ne fait rien si la visite porte déjà des paramètres (pub, lien de campagne) ou
 * si une attribution récente est en mémoire : une pub vue avant garde le crédit.
 */
export default function IntentAttribution({ slug }: { slug: string }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (TRACKED_PARAMS.some((key) => params.get(key))) return;
    if (Object.keys(readStored()).length > 0) return;
    let source = "unboared.com";
    try {
      if (document.referrer) {
        const host = new URL(document.referrer).hostname.replace(/^www\./, "");
        if (host && host !== window.location.hostname.replace(/^www\./, "")) source = host;
      }
    } catch {
      // referrer illisible : on garde la valeur par défaut
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          utm_source: source,
          utm_medium: "organic",
          utm_content: `page-${slug}`,
          _ts: Date.now(),
        }),
      );
    } catch {
      // localStorage indisponible (navigation privée) : pas de mesure, rien de cassé
    }
  }, [slug]);

  return null;
}
