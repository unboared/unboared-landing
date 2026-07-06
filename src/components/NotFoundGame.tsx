"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

/**
 * 404 gamifiée — « la page a quitté la partie » : 20 secondes pour attraper
 * un maximum d'icônes de jeux qui surgissent dans l'arène. Score, record
 * (localStorage), puis CTA vers l'accueil / les jeux.
 *
 * Tout est piloté par des timeouts nettoyés au démontage ; le jeu ne démarre
 * que sur action de l'utilisateur (pas de motion imposée).
 */

const GAME_DURATION_MS = 20_000;
const TARGET_LIFETIME_MS = 1_150;
const TARGET_EXIT_MS = 200;
const MAX_CONCURRENT = 4;
const BEST_KEY = "unboared-404-best";

/** Jeux disposant d'une icône dans public/images/games/{id}/icon.png. */
const TARGET_GAMES = [
  "unblind-test",
  "petit-bac",
  "geoloc",
  "unquizz",
  "draw-guessr",
  "bomber-kitten",
  "gloofy-pop",
  "polyvroom",
  "footboared",
  "estim",
  "robrawl",
  "eggsit",
  "unport",
] as const;

type Target = {
  key: number;
  game: string;
  x: number; // % dans l'arène
  y: number;
  rot: number; // degrés
  leaving: boolean;
};

type Burst = { key: number; x: number; y: number };

type Phase = "idle" | "play" | "end";

export default function NotFoundGame() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  const [phase, setPhase] = useState<Phase>("idle");
  const [targets, setTargets] = useState<Target[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_MS);
  const [best, setBest] = useState<number | null>(null);

  const timeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);
  const nextKey = useRef(1);
  const scoreRef = useRef(0);
  // Miroir de la phase pour les callbacks planifiés (mis à jour dans les
  // handlers qui changent la phase — jamais pendant le rendu).
  const phaseRef = useRef<Phase>("idle");

  const later = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(() => {
      timeouts.current.delete(id);
      fn();
    }, ms);
    timeouts.current.add(id);
  }, []);

  const clearAllTimers = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current.clear();
    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
  }, []);

  // Nettoyage de tous les timers au démontage.
  useEffect(() => clearAllTimers, [clearAllTimers]);

  const endGame = useCallback(() => {
    clearAllTimers();
    setTargets([]);
    setBursts([]);
    setTimeLeft(0);
    phaseRef.current = "end";
    setPhase("end");
    // Le record n'est affiché qu'ici : lecture + mise à jour au même moment.
    let next = scoreRef.current;
    try {
      const stored = Number(localStorage.getItem(BEST_KEY));
      if (Number.isFinite(stored)) next = Math.max(next, stored);
      localStorage.setItem(BEST_KEY, String(next));
    } catch {
      /* stockage indisponible : le record reste celui de la session */
    }
    setBest(next);
  }, [clearAllTimers]);

  const removeTarget = useCallback(
    (key: number) => {
      setTargets((prev) =>
        prev.map((target) => (target.key === key ? { ...target, leaving: true } : target))
      );
      later(TARGET_EXIT_MS, () => {
        setTargets((prev) => prev.filter((target) => target.key !== key));
      });
    },
    [later]
  );

  // Ref vers la boucle de spawn : permet l'auto-replanification sans
  // auto-référence dans le useCallback (interdit par react-hooks).
  const spawnRef = useRef<() => void>(() => {});

  const spawnTarget = useCallback(() => {
    if (phaseRef.current !== "play") return;

    setTargets((prev) => {
      if (prev.filter((target) => !target.leaving).length >= MAX_CONCURRENT) return prev;
      const key = nextKey.current++;
      const target: Target = {
        key,
        game: TARGET_GAMES[Math.floor(Math.random() * TARGET_GAMES.length)],
        x: 4 + Math.random() * 74,
        y: 6 + Math.random() * 68,
        rot: Math.round(Math.random() * 16 - 8),
        leaving: false,
      };
      later(TARGET_LIFETIME_MS, () => removeTarget(key));
      return [...prev, target];
    });

    // La cadence accélère au fil de la partie (860 ms → ~440 ms).
    const elapsed = Date.now() - startedAt.current;
    const interval = Math.max(440, 860 - elapsed / 45);
    later(interval, () => spawnRef.current());
  }, [later, removeTarget]);

  useEffect(() => {
    spawnRef.current = spawnTarget;
  }, [spawnTarget]);

  const startGame = useCallback(() => {
    clearAllTimers();
    scoreRef.current = 0;
    setScore(0);
    setTargets([]);
    setBursts([]);
    setTimeLeft(GAME_DURATION_MS);
    startedAt.current = Date.now();
    setPhase("play");
    phaseRef.current = "play";

    ticker.current = setInterval(() => {
      const left = Math.max(0, GAME_DURATION_MS - (Date.now() - startedAt.current));
      setTimeLeft(left);
    }, 100);

    later(GAME_DURATION_MS, endGame);
    later(250, spawnTarget);
    later(600, spawnTarget);
  }, [clearAllTimers, endGame, later, spawnTarget]);

  const hitTarget = useCallback(
    (target: Target) => {
      if (target.leaving || phaseRef.current !== "play") return;
      scoreRef.current += 1;
      setScore(scoreRef.current);
      const burstKey = nextKey.current++;
      setBursts((prev) => [...prev, { key: burstKey, x: target.x, y: target.y }]);
      later(450, () => setBursts((prev) => prev.filter((burst) => burst.key !== burstKey)));
      removeTarget(target.key);
    },
    [later, removeTarget]
  );

  const seconds = Math.ceil(timeLeft / 1000);
  const timePct = (timeLeft / GAME_DURATION_MS) * 100;
  const home = `/${locale}`;

  return (
    <section className="nf">
      <div className="wrap nf-inner">
        {phase === "idle" && (
          <div className="nf-hero">
            <p className="nf-kicker">{t("kicker")}</p>
            <p className="nf-code" aria-hidden="true">
              <span>4</span>
              <button
                type="button"
                className="nf-zero"
                onClick={startGame}
                aria-label={t("start")}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </button>
              <span>4</span>
            </p>
            <h1 className="nf-title">{t("title")}</h1>
            <p className="nf-lead">{t("lead")}</p>
            <div className="nf-cta">
              <button type="button" className="btn btn-primary" onClick={startGame}>
                {t("start")}
              </button>
              <a className="btn btn-ghost" href={home}>
                {t("home")}
              </a>
            </div>
          </div>
        )}

        {phase !== "idle" && (
          <div className="nf-game">
            <div className="nf-hud">
              <p className="nf-score" aria-live="polite">
                {t("hudScore", { count: score })}
              </p>
              <p className="nf-time">
                {seconds}
                <span>{t("secondsShort")}</span>
              </p>
            </div>
            <div className="nf-timerbar" aria-hidden="true">
              <span style={{ width: `${timePct}%` }} />
            </div>
            <div className="nf-arena">
              {targets.map((target) => (
                <button
                  key={target.key}
                  type="button"
                  className={`nf-target${target.leaving ? " out" : ""}`}
                  style={
                    {
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      "--rot": `${target.rot}deg`,
                    } as React.CSSProperties
                  }
                  onPointerDown={() => hitTarget(target)}
                  aria-label={t("targetAria")}
                >
                  <Image
                    src={`/images/games/${target.game}/icon.png`}
                    alt=""
                    width={72}
                    height={72}
                    loading="eager"
                  />
                </button>
              ))}
              {bursts.map((burst) => (
                <span
                  key={burst.key}
                  className="nf-burst"
                  style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
                  aria-hidden="true"
                />
              ))}

              {phase === "end" && (
                <div className="nf-end">
                  <div>
                    <p className="nf-end-score">{t("endTitle", { score })}</p>
                    {best !== null && <p className="nf-end-best">{t("best", { best })}</p>}
                    <p className="nf-end-punch">{t("endPunch")}</p>
                    <div className="nf-cta">
                      <button type="button" className="btn btn-primary" onClick={startGame}>
                        {t("replay")}
                      </button>
                      <a className="btn btn-ghost" href={home}>
                        {t("discover")}
                      </a>
                    </div>
                    <a className="nf-games-link" href={`/${locale}/games`}>
                      {t("games")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
