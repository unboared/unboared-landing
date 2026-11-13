/**
 * Image de soirée : ce que le lien du bilan transporte et ce que l'image accepte d'afficher.
 * Uniquement : nom du lieu, date, nombre de joueurs, jeux, prochaine soirée. Aucun pseudo de joueur.
 *
 * Tout texte vient de l'extérieur (lien, formulaire) : il est borné et nettoyé ici, une seule fois,
 * pour la page comme pour l'adresse qui fabrique l'image.
 */

export type SoireeFormat = "story" | "post";
export type SoireeLocale = "fr" | "en";

export type SoireeCard = {
  name: string;
  /** Jour de la soirée (AAAA-MM-JJ). */
  date: string;
  players: number;
  games: string[];
  /** Prochaine soirée, texte libre du gérant ; vide = rien d'annoncé. */
  next: string;
};

export const SOIREE_LIMITS = { name: 40, game: 24, games: 4, next: 48, players: 5000 };

/** Texte d'une ligne : caractères de contrôle retirés, espaces réduits, longueur bornée. */
export function cleanText(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max)
    .trim();
}

export function validDate(v: unknown): string | null {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const t = Date.parse(`${v}T12:00:00Z`);
  if (Number.isNaN(t) || new Date(t).toISOString().slice(0, 10) !== v) return null;
  return v;
}

export function validPlayers(v: unknown): number | null {
  const n = typeof v === "string" && /^\d{1,5}$/.test(v) ? Number(v) : v;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > SOIREE_LIMITS.players) return null;
  return n;
}

export function cleanGames(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((g) => cleanText(g, SOIREE_LIMITS.game))
    .filter(Boolean)
    .slice(0, SOIREE_LIMITS.games);
}

/** Fragment du lien du bilan (`#…`, JSON en base64url) → données, ou null s'il est absent ou abîmé. */
export function decodeSoireeHash(hash: string): Omit<SoireeCard, "next"> | null {
  const raw = hash.replace(/^#/, "");
  if (!raw || raw.length > 2000 || !/^[A-Za-z0-9_-]+$/.test(raw)) return null;
  try {
    const bin = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    const d = JSON.parse(json) as Record<string, unknown>;
    if (!d || d.v !== 1) return null;
    const date = validDate(d.d);
    const players = validPlayers(d.p);
    if (!date || !players) return null;
    return { name: cleanText(d.n, SOIREE_LIMITS.name), date, players, games: cleanGames(d.g) };
  } catch {
    return null;
  }
}

/** Paramètres de l'adresse de l'image. */
export function soireeCardQuery(card: SoireeCard, format: SoireeFormat, locale: SoireeLocale): string {
  const q = new URLSearchParams({ f: format, l: locale, d: card.date, p: String(card.players), n: card.name });
  for (const g of card.games) q.append("g", g);
  if (card.next) q.set("next", card.next);
  return q.toString();
}

export function parseSoireeCardQuery(
  q: URLSearchParams
): { card: SoireeCard; format: SoireeFormat; locale: SoireeLocale } | null {
  const date = validDate(q.get("d"));
  const players = validPlayers(q.get("p"));
  const name = cleanText(q.get("n"), SOIREE_LIMITS.name);
  if (!date || !players || !name) return null;
  return {
    card: { name, date, players, games: cleanGames(q.getAll("g")), next: cleanText(q.get("next"), SOIREE_LIMITS.next) },
    format: q.get("f") === "post" ? "post" : "story",
    locale: q.get("l") === "en" ? "en" : "fr",
  };
}

/** « Samedi 7 novembre » / « Saturday 7 November ». */
export function soireeDateLabel(date: string, locale: SoireeLocale): string {
  const s = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
  return s.charAt(0).toUpperCase() + s.slice(1);
}
