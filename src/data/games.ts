export type Game = {
  id: string;
  category: "quiz" | "action";
  color: string;
  minPlayers: number;
  maxPlayers: number | null;
  icon: string;
  featured: boolean;
};

export const GAMES: Game[] = [
  {
    id: "geoloc",
    category: "quiz",
    color: "#20abf3",
    minPlayers: 1,
    maxPlayers: null,
    icon: "/images/games/geoloc/icon.png",
    featured: true,
  },
  {
    id: "unblind-test",
    category: "quiz",
    color: "#ff2453",
    minPlayers: 1,
    maxPlayers: null,
    icon: "/images/games/unblind-test/icon.png",
    featured: true,
  },
  {
    id: "petit-bac",
    category: "quiz",
    color: "#1bc65f",
    minPlayers: 2,
    maxPlayers: null,
    icon: "/images/games/petit-bac/icon.png",
    featured: true,
  },
  {
    id: "unquizz",
    category: "quiz",
    color: "#e9bc0c",
    minPlayers: 1,
    maxPlayers: null,
    icon: "/images/games/unquizz/icon.png",
    featured: false,
  },
  {
    id: "bomber-kitten",
    category: "action",
    color: "#ff2453",
    minPlayers: 2,
    maxPlayers: 20,
    icon: "/images/games/bomber-kitten/icon.png",
    featured: false,
  },
  {
    id: "gloofy-pop",
    category: "action",
    color: "#20abf3",
    minPlayers: 2,
    maxPlayers: null,
    icon: "/images/games/gloofy-pop/icon.png",
    featured: false,
  },
];
