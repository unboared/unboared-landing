/**
 * Catalogue affiché sur la landing et la page /games.
 * Les noms et descriptions sont dans messages/{fr,en}.json sous `games.{id}`.
 */

export type GameCategory = "quiz" | "action";

export type VideoGame = {
  id: string;
  video: string;
  poster: string;
};

export type LineupGame = {
  id: string;
  category: GameCategory;
  /** Icône carrée ; absente pour les tuiles typographiques (ex. Unpop). */
  icon?: string;
  /** Icône à afficher en `contain` avec padding (logos non carrés). */
  iconPad?: boolean;
  /** Texte de la tuile typographique quand il n'y a pas d'icône. */
  typo?: string;
};

/** Tête d'affiche — tuile héros vidéo. */
export const FEATURED_GAME: VideoGame = {
  id: "unblind-test",
  video: "/videos/games/unblind-test.mp4",
  poster: "/videos/games/unblind-test-poster.jpg",
};

/** Les autres têtes d'affiche — tuiles vidéo. */
export const TILE_GAMES: VideoGame[] = [
  { id: "petit-bac", video: "/videos/games/petit-bac.mp4", poster: "/videos/games/petit-bac-poster.jpg" },
  { id: "geoloc", video: "/videos/games/geoloc.mp4", poster: "/videos/games/geoloc-poster.jpg" },
  { id: "draw-guessr", video: "/videos/games/draw-guessr.mp4", poster: "/videos/games/draw-guessr-poster.jpg" },
  { id: "unquizz", video: "/videos/games/unquizz.mp4", poster: "/videos/games/unquizz-poster.jpg" },
];

/**
 * Vidéos jouées par la scène animée de PilotSection — mêmes fichiers que le
 * catalogue, pour qu'un ré-encodage / renommage ne casse jamais la scène.
 */
export const PILOT_SCENE = {
  blind: FEATURED_GAME,
  geoloc: TILE_GAMES.find((g) => g.id === "geoloc")!,
};

/** La suite de la programmation — rangées icône + description. */
export const LINEUP_GAMES: LineupGame[] = [
  { id: "bomber-kitten", category: "action", icon: "/images/games/bomber-kitten/icon.png" },
  { id: "estim", category: "quiz", icon: "/images/games/estim/icon.png", iconPad: true },
  { id: "gloofy-pop", category: "action", icon: "/images/games/gloofy-pop/icon.png" },
  { id: "polyvroom", category: "action", icon: "/images/games/polyvroom/icon.png" },
  { id: "footboared", category: "action", icon: "/images/games/footboared/icon.png" },
  { id: "unpop", category: "action", typo: "POP !" },
];

/** À venir — icônes grisées, sans texte. */
export const SOON_GAME_ICONS: string[] = [
  "/images/games/robrawl/icon.png",
  "/images/games/eggsit/icon.png",
  "/images/games/unport/icon.png",
];

/**
 * Toutes les icônes de jeux disponibles — dérivées des listes ci-dessus pour
 * que la 404 gamifiée reste alignée sur le catalogue (un jeu ajouté/retiré ici
 * apparaît/disparaît du mini-jeu sans autre modification). `pad` = icône non
 * carrée à afficher en `contain` (cf. LINEUP_GAMES.iconPad).
 */
export type GameIcon = { id: string; icon: string; pad?: boolean };

export const GAME_ICONS: GameIcon[] = [
  ...[FEATURED_GAME, ...TILE_GAMES].map((g) => ({
    id: g.id,
    icon: `/images/games/${g.id}/icon.png`,
  })),
  ...LINEUP_GAMES.filter((g) => g.icon).map((g) => ({
    id: g.id,
    icon: g.icon!,
    pad: g.iconPad,
  })),
  ...SOON_GAME_ICONS.map((icon) => ({
    id: icon.split("/")[3],
    icon,
  })),
];
