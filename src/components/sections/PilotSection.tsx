"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { PILOT_SCENE } from "@/data/games";

/**
 * « La soirée se pilote du bout du pouce » — scène animée portée du prototype :
 * le téléphone-cockpit pilote la TV (QR → joueurs qui rejoignent, changement de
 * jeu Blind Test → GeoLoc avec bascule vidéo, pause / reprise), en boucle.
 *
 * - IntersectionObserver : la boucle ne tourne que quand la scène est visible.
 * - prefers-reduced-motion : la scène reste statique (Blind Test à l'écran).
 * - Aucune re-render React : tout est manipulé via refs, comme le prototype.
 */
export default function PilotSection() {
  const t = useTranslations("pilot");
  const sceneRef = useRef<HTMLDivElement>(null);

  // Libellés utilisés par la timeline JS — synchronisés hors rendu.
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  });

  useEffect(() => {
    const scene = sceneRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!scene || reduced || !("IntersectionObserver" in window)) return;

    const q = <T extends Element>(sel: string) => scene.querySelector<T>(sel);
    const vidA = q<HTMLVideoElement>(".ps-vid-a");
    const vidB = q<HTMLVideoElement>(".ps-vid-b");
    const qr = q<HTMLElement>(".ps-qr");
    const pauseOv = q<HTMLElement>(".ps-pause");
    const sheet = q<HTMLElement>(".ps-sheet");
    const tap = q<HTMLElement>(".ps-tap");
    const phone = q<HTMLElement>(".ps-phone");
    const gameEl = q<HTMLElement>(".ps-game");
    const countEl = q<HTMLElement>(".ps-count");
    const tvTag = q<HTMLElement>(".ps-tvtag span");
    const btnGame = q<HTMLElement>(".ps-btn-game");
    const btnQr = q<HTMLElement>(".ps-btn-qr");
    const btnPause = q<HTMLElement>(".ps-btn-pause");
    const optBlind = q<HTMLElement>(".opt-blind");
    const optGeo = q<HTMLElement>(".opt-geoloc");

    if (
      !vidA || !vidB || !qr || !pauseOv || !sheet || !tap || !phone ||
      !gameEl || !countEl || !tvTag || !btnGame || !btnQr || !btnPause ||
      !optBlind || !optGeo
    ) {
      return;
    }

    let timers: ReturnType<typeof setTimeout>[] = [];
    let playing = false;

    function at(time: number, fn: () => void) {
      timers.push(setTimeout(fn, time));
    }
    function safePlay(v: HTMLVideoElement) {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
    function tapOn(el: HTMLElement) {
      const er = el.getBoundingClientRect();
      const pr = phone!.getBoundingClientRect();
      tap!.style.left = `${er.left - pr.left + er.width * 0.68}px`;
      tap!.style.top = `${er.top - pr.top + er.height / 2 - 17}px`;
      tap!.classList.remove("go");
      void tap!.offsetWidth;
      tap!.classList.add("go");
      el.classList.add("pressed");
      timers.push(setTimeout(() => el.classList.remove("pressed"), 240));
    }
    function setGame(name: string, count: number) {
      gameEl!.textContent = name;
      countEl!.textContent = tRef.current("scene.players", { count });
      tvTag!.textContent = name;
    }
    function cycle() {
      /* vidA est la vidéo active de ce début de boucle : on garantit sa lecture
         ici (idempotent) plutôt que de compter sur un unique play() dans start()
         — fiable même avec preload="none". */
      safePlay(vidA!);
      vidA!.classList.add("on");
      vidB!.classList.remove("on");
      qr!.classList.remove("on");
      pauseOv!.classList.remove("on");
      sheet!.classList.remove("on");
      btnQr!.classList.remove("active");
      btnPause!.classList.remove("active");
      optBlind!.classList.add("sel");
      optGeo!.classList.remove("sel");
      setGame(tRef.current("scene.gameBlind"), 23);
      /* 1. afficher le QR → des joueurs rejoignent */
      at(1600, () => {
        tapOn(btnQr!);
        btnQr!.classList.add("active");
        qr!.classList.add("on");
      });
      at(3100, () => setGame(tRef.current("scene.gameBlind"), 26));
      at(4100, () => setGame(tRef.current("scene.gameBlind"), 31));
      at(4900, () => {
        tapOn(btnQr!);
        btnQr!.classList.remove("active");
        qr!.classList.remove("on");
      });
      /* 2. changer de jeu → la TV bascule */
      at(6300, () => {
        tapOn(btnGame!);
        sheet!.classList.add("on");
      });
      at(7400, () => {
        tapOn(optGeo!);
        optBlind!.classList.remove("sel");
        optGeo!.classList.add("sel");
      });
      at(8100, () => {
        sheet!.classList.remove("on");
        vidA!.classList.remove("on");
        vidB!.classList.add("on");
        safePlay(vidB!);
        setGame(tRef.current("scene.gameGeoloc"), 31);
      });
      /* 3. pause / reprise */
      at(10600, () => {
        tapOn(btnPause!);
        btnPause!.classList.add("active");
        pauseOv!.classList.add("on");
        vidB!.pause();
      });
      at(12600, () => {
        tapOn(btnPause!);
        btnPause!.classList.remove("active");
        pauseOv!.classList.remove("on");
        safePlay(vidB!);
      });
      /* 4. retour au début de la boucle */
      at(14600, () => {
        vidB!.classList.remove("on");
        vidA!.classList.add("on");
      });
      at(15800, cycle);
    }
    function start() {
      if (playing) return;
      playing = true;
      /* vidA est lancée par cycle(). On réchauffe seulement vidB (preload="none")
         pour une bascule Blind Test → GeoLoc sans écran noir. */
      safePlay(vidB!);
      timers.push(setTimeout(() => vidB!.pause(), 400));
      cycle();
    }
    function stop() {
      playing = false;
      timers.forEach(clearTimeout);
      timers = [];
      vidA!.pause();
      vidB!.pause();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
      },
      { threshold: 0.35 }
    );
    io.observe(scene);

    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <section className="section" id="pilot">
      <div className="wrap pilot-grid">
        <div className="pilot-copy">
          <h2 data-reveal>
            {t("titlePre")}
            <span className="mark">{t("titleMark")}</span>
            {t("titlePost")}
          </h2>
          <div className="pilot-item" data-reveal>
            <h3>{t("item1Title")}</h3>
            <p>{t("item1Desc")}</p>
          </div>
          <div className="pilot-item" data-reveal>
            <h3>{t("item2Title")}</h3>
            <p>{t("item2Desc")}</p>
          </div>
        </div>
        <div className="pilot-visual" data-reveal>
          <div className="pilot-scene" ref={sceneRef} aria-hidden="true">
            <div className="ps-tv">
              <div className="ps-screen">
                {/* Pilotées uniquement par la timeline ci-dessus (pas de data-io :
                    éviter que PageFx les relance en concurrence). */}
                <video
                  className="ps-vid ps-vid-a on"
                  muted
                  loop
                  playsInline
                  preload="none"
                  src={PILOT_SCENE.blind.video}
                  poster={PILOT_SCENE.blind.poster}
                />
                <video
                  className="ps-vid ps-vid-b"
                  muted
                  loop
                  playsInline
                  preload="none"
                  src={PILOT_SCENE.geoloc.video}
                  poster={PILOT_SCENE.geoloc.poster}
                />
                <div className="ps-overlay ps-qr">
                  <svg viewBox="0 0 21 21" role="presentation">
                    <rect width="21" height="21" fill="#fff" />
                    <g fill="#0a0608">
                      <rect x="1" y="1" width="7" height="7" />
                      <rect x="13" y="1" width="7" height="7" />
                      <rect x="1" y="13" width="7" height="7" />
                    </g>
                    <g fill="#fff">
                      <rect x="2" y="2" width="5" height="5" />
                      <rect x="14" y="2" width="5" height="5" />
                      <rect x="2" y="14" width="5" height="5" />
                    </g>
                    <g fill="#0a0608">
                      <rect x="3" y="3" width="3" height="3" />
                      <rect x="15" y="3" width="3" height="3" />
                      <rect x="3" y="15" width="3" height="3" />
                      <rect x="10" y="1" width="1" height="2" />
                      <rect x="10" y="5" width="1" height="3" />
                      <rect x="12" y="10" width="3" height="1" />
                      <rect x="16" y="10" width="2" height="1" />
                      <rect x="19" y="10" width="1" height="3" />
                      <rect x="10" y="12" width="1" height="2" />
                      <rect x="12" y="13" width="2" height="2" />
                      <rect x="15" y="14" width="2" height="1" />
                      <rect x="10" y="16" width="1" height="4" />
                      <rect x="12" y="17" width="1" height="3" />
                      <rect x="14" y="17" width="3" height="1" />
                      <rect x="16" y="19" width="4" height="1" />
                      <rect x="18" y="14" width="3" height="2" />
                      <rect x="1" y="10" width="3" height="1" />
                      <rect x="5" y="10" width="3" height="1" />
                    </g>
                  </svg>
                  <p>{t("scene.scanJoin")}</p>
                </div>
                <div className="ps-overlay ps-pause">
                  <span className="bars">
                    <span />
                    <span />
                  </span>
                  <p>{t("scene.paused")}</p>
                </div>
                <div className="ps-tvtag">
                  <span>{t("scene.gameBlind")}</span>
                </div>
              </div>
              <div className="ps-stand" />
            </div>
            <div className="ps-phone">
              <div className="ps-head">
                <span className="ps-live" />
                {t("scene.cockpit")}
              </div>
              <div className="ps-now">
                <span className="ps-game">{t("scene.gameBlind")}</span>
                <span className="ps-count">{t("scene.players", { count: 23 })}</span>
              </div>
              <button type="button" tabIndex={-1} className="ps-btn ps-btn-game">
                <svg
                  className="ic"
                  viewBox="0 0 16 16"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 5h10M9 2l3 3-3 3M14 11H4M7 8l-3 3 3 3" />
                </svg>
                {t("scene.changeGame")}
              </button>
              <button type="button" tabIndex={-1} className="ps-btn ps-btn-qr">
                <svg className="ic" viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
                  <path d="M1 1h6v6H1zM3 3h2v2H3zM9 1h6v6H9zM11 3h2v2h-2zM1 9h6v6H1zM3 11h2v2H3zM9 9h2v2H9zM13 9h2v2h-2zM11 11h2v2h-2zM9 13h2v2H9zM13 13h2v2h-2z" />
                </svg>
                {t("scene.showQr")}
              </button>
              <button type="button" tabIndex={-1} className="ps-btn ps-btn-pause">
                <svg className="ic" viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
                  <path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" />
                </svg>
                {t("scene.pause")}
              </button>
              <div className="ps-sheet">
                <p className="t">{t("scene.changeGame")}</p>
                <div className="ps-opt opt-blind sel">
                  {t("scene.gameBlind")}
                  <span>✓</span>
                </div>
                <div className="ps-opt opt-geoloc">{t("scene.gameGeoloc")}</div>
                <div className="ps-opt opt-bac">{t("scene.gameBac")}</div>
              </div>
              <div className="ps-tap" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
