"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { GAMES } from "@/data/games";

type Category = "all" | "quiz" | "action";

export default function GamesPage() {
  const t = useTranslations();
  const [category, setCategory] = useState<Category>("all");

  const filtered = category === "all" ? GAMES : GAMES.filter((g) => g.category === category);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t("games.categoryAll") },
    { key: "quiz", label: t("games.categoryQuiz") },
    { key: "action", label: t("games.categoryAction") },
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("gamesPage.title")}</h1>
          <p className="text-text-muted text-lg">{t("gamesPage.subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.key
                  ? "bg-primary text-white"
                  : "bg-bg-card border border-border text-text-muted hover:text-text hover:border-border-light"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((game, i) => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-border-light transition-colors group"
            >
              <div
                className="h-44 flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${game.color}15, ${game.color}05)` }}
              >
                <Image
                  src={game.icon}
                  alt={t(`games.${game.id}.name`)}
                  width={100}
                  height={100}
                  className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <span
                  className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full"
                  style={{ background: `${game.color}20`, color: game.color }}
                >
                  {game.category === "quiz" ? t("games.categoryQuiz") : t("games.categoryAction")}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">{t(`games.${game.id}.name`)}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-3">
                  {t(`games.${game.id}.description`)}
                </p>
                <span className="text-xs text-text-dim">
                  {game.maxPlayers
                    ? `${game.minPlayers}-${game.maxPlayers} ${t("games.players")}`
                    : `${t("games.unlimited")} ${t("games.players")}`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
