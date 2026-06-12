"use client";

import { useEffect } from "react";

const STORAGE_KEY = "ub_attribution";
const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;
const CONSOLE_ORIGIN = "https://console.unboared.com";

function readStored(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
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
          JSON.stringify({ ...readStored(), ...incoming }),
        );
      } catch {
        // localStorage unavailable (private mode) — links stay undecorated.
      }
    }

    // Decorate at click time (capture phase) so it works for every CTA,
    // including ones added later, without touching each component.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href.startsWith(CONSOLE_ORIGIN)) return;
      const stored = readStored();
      if (Object.keys(stored).length === 0) return;
      const url = new URL(anchor.href);
      for (const [key, value] of Object.entries(stored)) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      }
      anchor.href = url.toString();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
