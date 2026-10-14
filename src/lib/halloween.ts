// Halloween 2026 (décision du 14/10/2026) : pastille au-dessus du titre de l'accueil
// (HalloweenPill), même message que les pubs Halloween.
// Début = après la mise en ligne du quiz et des dessins Halloween (avancée au 16/10
// vers 10h, décision du 14/10 : pubs Halloween le 17/10) ; fin = minuit à Paris le 31/10. Un essai de 14 jours démarré dans la
// fenêtre couvre forcément le 31/10 : la promesse « dans l'essai » est vraie.
export const HALLOWEEN_START = "2026-10-16T14:00:00+02:00";
export const HALLOWEEN_END = "2026-11-01T00:00:00+01:00";

// Décidé AVANT le premier affichage par un script en ligne (le site est statique :
// une date figée au build ne s'éteindrait jamais, et une décision prise après
// l'hydratation ferait sauter le titre). Aperçu hors fenêtre : ?halloween=1.
export const HALLOWEEN_SCRIPT =
  `try{var n=Date.now();if(/[?&]halloween=1(&|$)/.test(location.search)||` +
  `(n>=Date.parse(${JSON.stringify(HALLOWEEN_START)})&&n<Date.parse(${JSON.stringify(HALLOWEEN_END)})))` +
  `document.documentElement.classList.add('ub-halloween')}catch(e){}`;

/** Même test que HALLOWEEN_SCRIPT, rejoué à chaque changement de page : le changement
 *  de langue (FR/EN) remonte <html> et React efface les classes posées par les scripts. */
export function applyHalloweenClass(): void {
  const now = Date.now();
  const on =
    /[?&]halloween=1(&|$)/.test(window.location.search) ||
    (now >= Date.parse(HALLOWEEN_START) && now < Date.parse(HALLOWEEN_END));
  document.documentElement.classList.toggle("ub-halloween", on);
}
