"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";
import { Users, RotateCcw, Clock } from "lucide-react";

const benefits = [
  {
    icon: Users,
    colorClass: "text-primary",
    bgClass: "bg-primary/10 border-primary/20",
    photo: "/images/photos/bar-ninkasi-lille.jpg",
    photoAlt: "Bar animé avec Unboared",
  },
  {
    icon: RotateCcw,
    colorClass: "text-accent",
    bgClass: "bg-accent/10 border-accent/20",
    photo: "/images/photos/anim-zenith-strasbourg.jpg",
    photoAlt: "Animation avec Unboared",
  },
  {
    icon: Clock,
    colorClass: "text-success",
    bgClass: "bg-success/10 border-success/20",
    photo: "/images/photos/bar-ninkasi-geoloc.jpg",
    photoAlt: "Joueurs sur Unboared",
  },
];

export default function BenefitsSection() {
  const t = useTranslations("whyItWorks");

  const items = [
    { ...benefits[0], title: t("b1Title"), desc: t("b1Desc") },
    { ...benefits[1], title: t("b2Title"), desc: t("b2Desc") },
    { ...benefits[2], title: t("b3Title"), desc: t("b3Desc") },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-text-muted text-lg">{t("subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-border-light transition-colors group"
            >
              {/* Photo */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={b.photo}
                  alt={b.photoAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/20 to-transparent" />
              </div>

              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-4 ${b.bgClass}`}>
                  <b.icon className={`w-5 h-5 ${b.colorClass}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
