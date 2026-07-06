import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { FEATURED_GAME, TILE_GAMES, LINEUP_GAMES, SOON_GAME_ICONS } from "@/data/games";
import { cn } from "@/lib/utils";

/**
 * « La programmation du soir » — tuile héros Blind Test + tuiles vidéo +
 * lineup + jeux à venir. Ne jamais afficher un nombre total de jeux.
 *
 * `showHead` : false sur la page /games (qui a son propre h1).
 */
export default async function GamesShowcase({ showHead = true }: { showHead?: boolean }) {
  const t = await getTranslations("games");
  const locale = await getLocale();
  const tileHref = `/${locale}/#pricing`;

  return (
    <section className="section" id="games">
      <div className="wrap">
        {showHead && (
          <div className="games-head" data-reveal>
            <h2>
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
            </h2>
            <p>{t("intro")}</p>
          </div>
        )}

        {/* Tête d'affiche */}
        <a className="game-tile tile-hero" href={tileHref} data-reveal>
          <video
            muted
            loop
            playsInline
            preload="none"
            data-io
            src={FEATURED_GAME.video}
            poster={FEATURED_GAME.poster}
            aria-hidden="true"
          />
          <div className="gscrim" aria-hidden="true" />
          <div className="gtxt">
            <span className="gtag star">{t("heroTag")}</span>
            <p className="gname">{t(`${FEATURED_GAME.id}.name`)}</p>
            <p className="gdesc">{t(`${FEATURED_GAME.id}.description`)}</p>
          </div>
        </a>

        {/* Les autres têtes d'affiche */}
        <div className="tile-row">
          {TILE_GAMES.map((game) => (
            <a className="game-tile" href={tileHref} data-reveal key={game.id}>
              <video
                muted
                loop
                playsInline
                preload="none"
                data-io
                src={game.video}
                poster={game.poster}
                aria-hidden="true"
              />
              <div className="gscrim" aria-hidden="true" />
              <div className="gtxt">
                <p className="gname">{t(`${game.id}.name`)}</p>
                <p className="gdesc">{t(`${game.id}.description`)}</p>
              </div>
            </a>
          ))}
        </div>

        {/* La suite de la programmation */}
        <div className="lineup" data-reveal>
          <p className="lineup-label">{t("lineupLabel")}</p>
          {LINEUP_GAMES.map((game) => (
            <div className="lineup-row" key={game.id}>
              {game.icon ? (
                <Image
                  className={cn("lineup-icon", game.iconPad && "pad")}
                  src={game.icon}
                  alt=""
                  width={60}
                  height={60}
                  loading="lazy"
                />
              ) : (
                <span className="lineup-typo" aria-hidden="true">
                  {game.typo}
                </span>
              )}
              <div className="lineup-main">
                <p className="lname">{t(`${game.id}.name`)}</p>
                <p>{t(`${game.id}.description`)}</p>
              </div>
              <span className="lineup-cat">
                {game.category === "quiz" ? t("categoryQuiz") : t("categoryAction")}
              </span>
            </div>
          ))}
        </div>

        <div className="games-soon" data-reveal>
          <div className="soon-icons" aria-hidden="true">
            {SOON_GAME_ICONS.map((icon) => (
              <Image key={icon} src={icon} alt="" width={44} height={44} loading="lazy" />
            ))}
          </div>
          <p>{t("soon")}</p>
        </div>
      </div>
    </section>
  );
}
