"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { URLS } from "@/lib/constants";

// Halloween 2026 (décision du 14/10/2026) : pastille au-dessus du titre de l'accueil,
// pour que les visiteurs venus d'une pub Halloween retrouvent le même message.
// Fenêtre = contenu réellement en ligne dans les jeux (quiz + dessins le 19/10,
// playlist depuis le 14/10) jusqu'au soir du 31/10. Un essai de 14 jours démarré
// dans la fenêtre couvre forcément le 31/10 : la promesse « dans l'essai » est vraie.
// Calculée côté navigateur (le site est rendu en statique : une date figée au build
// ne s'éteindrait jamais). Aperçu hors fenêtre : ?halloween=1.
const START = Date.parse("2026-10-19T06:00:00+02:00");
const END = Date.parse("2026-11-01T00:00:00+01:00");

export function halloweenActive(now: number, search = ""): boolean {
  if (/[?&]halloween=1\b/.test(search)) return true;
  return now >= START && now < END;
}

const noSubscribe = () => () => {};

export default function HalloweenPill() {
  const t = useTranslations("halloween");
  // Valeur lue au chargement côté navigateur seulement (false au rendu statique, pas d'écart d'hydratation).
  const show = useSyncExternalStore(
    noSubscribe,
    () => halloweenActive(Date.now(), window.location.search),
    () => false,
  );

  if (!show) return null;

  return (
    <a className="halloween-pill" href={URLS.signup}>
      <span aria-hidden="true">🎃</span>
      <span>
        <strong>{t("title")}</strong> {t("body")}
      </span>
    </a>
  );
}
