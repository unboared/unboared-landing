"use client";

import { useEffect, useRef } from "react";

/**
 * Masque le bloc « Ces 30 derniers jours » si ses chiffres sont périmés, y compris quand on arrive
 * sur la page par un lien interne (le script en ligne de `LiveStats` ne tourne qu'au premier chargement).
 */
export default function LiveStaleGuard({ through, maxAgeDays }: { through: string; maxAgeDays: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const block = ref.current?.parentElement;
    const t = Date.parse(`${through}T00:00:00Z`);
    if (block && !(Date.now() - t < maxAgeDays * 864e5)) block.hidden = true;
  }, [through, maxAgeDays]);
  return <span ref={ref} hidden />;
}
