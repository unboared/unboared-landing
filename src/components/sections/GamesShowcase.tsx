"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";
import { GAMES } from "@/data/games";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export default function GamesShowcase() {
  const t = useTranslations();
  const featured = GAMES.filter((g) => g.featured);

  return (
    <section id="games" className="py-24 px-6 bg-bg-card/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("games.title")}</h2>
          <p className="text-text-muted text-lg">{t("games.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featured.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-bg border border-border rounded-2xl overflow-hidden hover:border-border-light transition-colors group cursor-pointer"
            >
              <div
                className="h-48 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${game.color}20, ${game.color}08)` }}
              >
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at center, ${game.color}15, transparent 70%)` }}
                />
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Image
                    src={game.icon}
                    alt={t(`games.${game.id}.name`)}
                    width={110}
                    height={110}
                    className="object-contain drop-shadow-xl"
                  />
                </motion.div>
                <span
                  className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full border"
                  style={{
                    background: `${game.color}18`,
                    color: game.color,
                    borderColor: `${game.color}30`,
                  }}
                >
                  {game.category === "quiz" ? t("games.categoryQuiz") : t("games.categoryAction")}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{t(`games.${game.id}.name`)}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-3">
                  {t(`games.${game.id}.description`)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-text-dim">
                  {game.maxPlayers ? `${game.minPlayers}–${game.maxPlayers}` : t("games.unlimited")} {t("games.players")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium group"
          >
            {t("games.seeAll")}
            <motion.span
              className="inline-flex"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
