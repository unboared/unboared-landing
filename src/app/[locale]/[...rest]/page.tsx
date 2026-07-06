import { notFound } from "next/navigation";

/**
 * Catch-all : toute URL sous /fr ou /en qui ne correspond à aucune route
 * déclenche la page 404 gamifiée ([locale]/not-found.tsx).
 */
export default function CatchAllPage() {
  notFound();
}
