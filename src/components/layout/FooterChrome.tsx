"use client";

import type { ReactNode } from "react";
import { useLightChrome } from "./useLightChrome";

/**
 * Footer est un composant serveur (traductions côté serveur) : il prépare les
 * deux variantes, ce petit composant client choisit selon le chemin.
 */
export default function FooterChrome({
  light,
  children,
}: {
  light: ReactNode;
  children: ReactNode;
}) {
  return useLightChrome() ? light : children;
}
