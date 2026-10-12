/**
 * Funnel wedge UnQuiz : utilitaires partagés par la landing (/quiz).
 * Les événements partent vers la Cloud Function (collection wedge_events),
 * la liste d'attente vers la même base (route wedgeWaitlist).
 */
export const WEDGE_API_BASE = "https://sendcouponemail-5iiwpornyq-uc.a.run.app";
export const WEDGE_EVENTS_ENDPOINT = `${WEDGE_API_BASE}/wedgeEvent`;
export const WEDGE_WAITLIST_ENDPOINT = `${WEDGE_API_BASE}/wedgeWaitlist`;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** Téléphone = même seuil que DemoButton, plus les écrans tactiles étroits
 * (grands téléphones en paysage, petites tablettes). */
export function isPhoneViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (window.innerWidth < 768) return true;
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches &&
    window.innerWidth < 820
  );
}

/** Les UTM de l'URL courante. Jamais le fbclid (identifiant de clic Meta) :
 * on garde seulement le fait que la visite vient de Meta (from_meta). */
export function readUtm(): Record<string, string> {
  const utm: Record<string, string> = {};
  try {
    const search = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const value = search.get(key);
      if (value) utm[key] = value;
    }
  } catch {
    // URL illisible : pas d'UTM
  }
  return utm;
}

function fromMeta(): boolean {
  try {
    return new URLSearchParams(window.location.search).has("fbclid");
  } catch {
    return false;
  }
}

/**
 * Événement du funnel, fire-and-forget : sendBeacon (survit à la navigation
 * qui suit un clic), sinon fetch keepalive. text/plain = pas de preflight CORS.
 * Ne lève jamais : l'instrumentation ne casse jamais la page.
 */
export function trackQuizEvent(event: string, data: Record<string, unknown> = {}) {
  try {
    const payload = JSON.stringify({
      event,
      lang: document.documentElement.lang || undefined,
      utm: readUtm(),
      from_meta: fromMeta(),
      host: window.location.hostname,
      env: process.env.NODE_ENV,
      device: isPhoneViewport() ? "phone" : "large",
      ...data,
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
}
