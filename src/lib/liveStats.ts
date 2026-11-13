/**
 * Chiffres du bandeau « Ces 30 derniers jours » : des totaux calculés chaque matin côté serveur
 * (fonction `publicStats` du projet unboared-b2b). Aucun nom de lieu, jamais.
 *
 * Toute panne (adresse injoignable, réponse abîmée, chiffres périmés) renvoie `null` :
 * le bandeau disparaît, la page reste intacte. On n'affiche jamais un vieux chiffre comme récent.
 */

export type LiveStats = {
  /** Dernière soirée comptée (AAAA-MM-JJ). */
  through: string;
  windowDays: number;
  nights: number;
  venues: number;
  players: number;
  /** Soirées par jour, de la plus ancienne à la plus récente ; vide si indisponible. */
  daily: number[];
};

const DEFAULT_URL = "https://us-central1-unboared-b2b.cloudfunctions.net/publicStats";
export const MAX_AGE_DAYS = 4;
const TIMEOUT_MS = 4000;
// 15 min : une panne passagère (ou des chiffres pas encore calculés) ne prive pas le site du bloc pendant des heures.
const REVALIDATE_S = 900;
const DAY_MS = 24 * 3600 * 1000;

const count = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : null;

export function parseLiveStats(raw: unknown, now: number): LiveStats | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const nights = count(r.nights);
  const venues = count(r.venues);
  const players = count(r.players);
  const windowDays = count(r.windowDays);
  if (!nights || !venues || !players || !windowDays) return null;
  if (typeof r.through !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(r.through)) return null;
  const through = Date.parse(`${r.through}T00:00:00Z`);
  if (Number.isNaN(through) || now - through > MAX_AGE_DAYS * DAY_MS || through - now > DAY_MS) return null;
  const daily =
    Array.isArray(r.daily) && r.daily.length === windowDays && r.daily.every((x) => count(x) !== null)
      ? (r.daily as number[])
      : [];
  return { through: r.through, windowDays, nights, venues, players, daily };
}

export async function getLiveStats(): Promise<LiveStats | null> {
  try {
    // Course contre une minuterie plutôt qu'un `signal` : Next retire le signal quand il régénère
    // la page en arrière-plan, et une fonction qui ne répond pas bloquerait la régénération.
    const load = fetch(process.env.LIVE_STATS_URL || DEFAULT_URL, { next: { revalidate: REVALIDATE_S } }).then(
      async (res) => (res.ok ? parseLiveStats(await res.json(), Date.now()) : null)
    );
    load.catch(() => null);
    return await Promise.race([load, new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS))]);
  } catch {
    return null;
  }
}

/** Vendredi ou samedi (les soirs de pointe), pour la i-ème barre de la courbe. */
export function isPeakDay(through: string, windowDays: number, index: number): boolean {
  const t = Date.parse(`${through}T00:00:00Z`) - (windowDays - 1 - index) * DAY_MS;
  const dow = new Date(t).getUTCDay();
  return dow === 5 || dow === 6;
}
