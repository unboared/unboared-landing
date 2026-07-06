"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { GAME_ICONS } from "@/data/games";
import { cn } from "@/lib/utils";

/**
 * 404 gamifiée — « la page a quitté la partie » : 20 secondes pour attraper
 * un maximum d'icônes de jeux qui surgissent dans l'arène. Score, record
 * (localStorage), puis CTA vers l'accueil / les jeux.
 *
 * - Le jeu ne démarre que sur action de l'utilisateur.
 * - Tous les timers sont suivis dans un Set et purgés à chaque transition.
 * - La liste des cibles vient de GAME_ICONS (data/games.ts) : la 404 suit le
 *   catalogue sans double maintenance.
 */

const GAME_DURATION_MS = 20_000;
const TARGET_LIFETIME_MS = 1_150;
const TARGET_EXIT_MS = 200;
const MAX_CONCURRENT = 4;
/** Cadence de spawn : démarre à ~430 ms, accélère jusqu'à ~220 ms. */
const SPAWN_START_MS = 430;
const SPAWN_MIN_MS = 220;
const BEST_KEY = "unboared-404-best";

type Target = {
  key: number;
  game: (typeof GAME_ICONS)[number];
  x: number; // % dans l'arène
  y: number;
  rot: number; // degrés
  leaving: boolean;
};

type Burst = { key: number; x: number; y: number };

type Phase = "idle" | "play" | "end";

declare global {
  interface Window {
    /** Posé pendant l'affichage de la 404 : MetaPixel n'y tire pas de PageView. */
    __unboaredNoTrack?: boolean;
  }
}

export default function NotFoundGame() {
  const t = useTranslations("notFound");

  const [phase, setPhase] = useState<Phase>("idle");
  const [runId, setRunId] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_MS);
  const [best, setBest] = useState<number | null>(null);

  const timeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Timer de durée de vie par cible vivante — sert aussi de registre « en vie ». */
  const lifeTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const startedAt = useRef(0);
  const nextKey = useRef(1);
  const scoreRef = useRef(0);
  // Miroir de la phase pour les callbacks planifiés (mis à jour dans les
  // handlers qui changent la phase — jamais pendant le rendu).
  const phaseRef = useRef<Phase>("idle");

  /* Les URL 404 (typos, liens morts, scans de bots) ne doivent pas polluer le
     Meta Pixel qui optimise les campagnes : on lève un drapeau que MetaPixel
     consulte avant de tirer un PageView. */
  useLayoutEffect(() => {
    window.__unboaredNoTrack = true;
    return () => {
      window.__unboaredNoTrack = false;
    };
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(() => {
      timeouts.current.delete(id);
      fn();
    }, ms);
    timeouts.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current.clear();
    lifeTimers.current.clear();
    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
  }, []);

  // Nettoyage de tous les timers au démontage.
  useEffect(() => clearAllTimers, [clearAllTimers]);

  /** Sortie d'une cible (attrapée ou expirée) : animation puis retrait. */
  const expireTarget = useCallback(
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

  const startGame = useCallback(() => {
    clearAllTimers();
    scoreRef.current = 0;
    setScore(0);
    setTargets([]);
    setBursts([]);
    setTimeLeft(GAME_DURATION_MS);
    setRunId((id) => id + 1); // relance l'animation CSS de la barre de temps
    startedAt.current = Date.now();
    phaseRef.current = "play";
    setPhase("play");

    ticker.current = setInterval(() => {
      setTimeLeft(Math.max(0, GAME_DURATION_MS - (Date.now() - startedAt.current)));
    }, 250);

    /* Boucle de spawn auto-replanifiée — closure locale : l'auto-référence est
       naturelle et les appels impurs vivent dans un événement, pas au rendu. */
    const spawnLoop = () => {
      if (phaseRef.current !== "play") return;

      if (lifeTimers.current.size < MAX_CONCURRENT) {
        const key = nextKey.current++;
        const target: Target = {
          key,
          game: GAME_ICONS[Math.floor(Math.random() * GAME_ICONS.length)],
          x: 4 + Math.random() * 74,
          y: 6 + Math.random() * 68,
          rot: Math.round(Math.random() * 16 - 8),
          leaving: false,
        };
        const lifeId = later(TARGET_LIFETIME_MS, () => {
          // Expiration naturelle — si la cible a déjà été attrapée, no-op.
          if (lifeTimers.current.delete(key)) expireTarget(key);
        });
        lifeTimers.current.set(key, lifeId);
        // Updater pur : la cible et ses timers sont créés au-dessus.
        setTargets((prev) => [...prev, target]);
      }

      const elapsed = Date.now() - startedAt.current;
      const interval = Math.max(SPAWN_MIN_MS, SPAWN_START_MS - elapsed / 90);
      later(interval, spawnLoop);
    };

    later(GAME_DURATION_MS, endGame);
    later(250, spawnLoop);
  }, [clearAllTimers, endGame, expireTarget, later]);

  const hitTarget = useCallback(
    (target: Target) => {
      if (phaseRef.current !== "play") return;
      // Le registre des timers de vie fait foi : un seul hit possible par cible.
      const lifeId = lifeTimers.current.get(target.key);
      if (!lifeId) return;
      clearTimeout(lifeId);
      timeouts.current.delete(lifeId);
      lifeTimers.current.delete(target.key);

      scoreRef.current += 1;
      setScore(scoreRef.current);
      const burstKey = nextKey.current++;
      setBursts((prev) => [...prev, { key: burstKey, x: target.x, y: target.y }]);
      later(450, () => setBursts((prev) => prev.filter((burst) => burst.key !== burstKey)));
      expireTarget(target.key);
    },
    [expireTarget, later]
  );

  const seconds = Math.ceil(timeLeft / 1000);

  return (
    <section className="nf">
      <div className="wrap nf-inner">
        {phase === "idle" && (
          <div className="nf-hero">
            <p className="nf-kicker">{t("kicker")}</p>
            <p className="nf-code">
              <span aria-hidden="true">4</span>
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
              <span aria-hidden="true">4</span>
            </p>
            <h1 className="nf-title">{t("title")}</h1>
            <p className="nf-lead">{t("lead", { seconds: GAME_DURATION_MS / 1000 })}</p>
            <div className="nf-cta">
              <button type="button" className="btn btn-primary" onClick={startGame}>
                {t("start")}
              </button>
              <Link className="btn btn-ghost" href="/">
                {t("home")}
              </Link>
            </div>
            {/* Préchauffe le cache des 13 icônes pour que les cibles de la
                première partie s'affichent instantanément. */}
            <div className="nf-preload" aria-hidden="true">
              {GAME_ICONS.map((game) => (
                <Image key={game.id} src={game.icon} alt="" width={76} height={76} />
              ))}
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
              {phase === "play" && (
                <span
                  key={runId}
                  className="nf-timerbar-fill"
                  style={{ animationDuration: `${GAME_DURATION_MS}ms` }}
                />
              )}
            </div>
            <div className="nf-arena">
              {targets.map((target) => (
                <button
                  key={target.key}
                  type="button"
                  className={cn("nf-target", target.leaving && "out", target.game.pad && "pad")}
                  style={
                    {
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      "--rot": `${target.rot}deg`,
                    } as React.CSSProperties
                  }
                  onPointerDown={() => hitTarget(target)}
                  // Clavier / AT : Entrée-Espace déclenchent click, pas pointerdown.
                  // Après un pointerdown, le hit est déjà consommé → no-op.
                  onClick={() => hitTarget(target)}
                  aria-label={t("targetAria")}
                >
                  <Image src={target.game.icon} alt="" width={76} height={76} loading="eager" />
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
                      <Link className="btn btn-ghost" href="/">
                        {t("discover")}
                      </Link>
                    </div>
                    <Link className="nf-games-link" href="/games">
                      {t("games")}
                    </Link>
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
