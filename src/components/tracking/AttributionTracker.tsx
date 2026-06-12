"use client";

import { useEffect } from "react";
import { URLS } from "@/lib/constants";

const STORAGE_KEY = "ub_attribution";
// ⚠️ À garder synchronisé avec :
// - console/src/utils/attribution.ts (ATTRIBUTION_PARAMS)
// - stripe-b2b/server.js (ATTRIBUTION_FIELDS)
const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;
const CONSOLE_ORIGIN = new URL(URLS.login).origin;
// Au-delà, l'attribution est périmée : on ne rejoue pas un clic d'ad
// vieux de plusieurs mois sur une visite organique.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function readStored(): Record<string, string> {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    const ts = Number(stored._ts);
    if (!ts || Date.now() - ts > MAX_AGE_MS) return {};
    delete stored._ts;
    return stored;
  } catch {
    return {};
  }
}

/**
 * Captures acquisition params (UTM + fbclid) on landing and re-attaches them
 * to every link toward console.unboared.com. Without this, the ad click is
 * lost when the visitor crosses domains and the trial can't be attributed
 * to its campaign (CAC per campaign relies on it).
 */
export default function AttributionTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incoming: Record<string, string> = {};
    for (const key of TRACKED_PARAMS) {
      const value = params.get(key);
      if (value) incoming[key] = value;
    }
    if (Object.keys(incoming).length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...readStored(), ...incoming, _ts: Date.now() }),
        );
      } catch {
        // localStorage unavailable (private mode) — links stay undecorated.
      }
    }

    // Decorate at interaction time (capture phase) so it works for every CTA,
    // including ones added later, without touching each component. `mousedown`
    // covers middle-click (auxclick) and right-click → "open in new tab" /
    // "copy link", which never fire `click`; `click` covers keyboard (Enter).
    const decorate = (event: Event) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href.startsWith(`${CONSOLE_ORIGIN}/`)) return;
      const stored = readStored();
      if (Object.keys(stored).length === 0) return;
      const url = new URL(anchor.href);
      for (const [key, value] of Object.entries(stored)) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      }
      anchor.href = url.toString();
    };
    document.addEventListener("mousedown", decorate, true);
    document.addEventListener("click", decorate, true);
    return () => {
      document.removeEventListener("mousedown", decorate, true);
      document.removeEventListener("click", decorate, true);
    };
  }, []);

  return null;
}
