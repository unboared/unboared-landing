"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Monitor, Users, Palette, Zap, BarChart3, Mail } from "lucide-react";

const featureIcons = [Monitor, Users, Palette, Zap, BarChart3, Mail];
const featureColors = [
  "text-primary bg-primary/10 border-primary/20",
  "text-accent bg-accent/10 border-accent/20",
  "text-success bg-success/10 border-success/20",
  "text-primary bg-primary/10 border-primary/20",
  "text-accent bg-accent/10 border-accent/20",
  "text-success bg-success/10 border-success/20",
];

export default function FeaturesGrid() {
  const t = useTranslations("features");

  const features = Array.from({ length: 6 }, (_, i) => ({
    icon: featureIcons[i],
    colorClass: featureColors[i],
    title: t(`f${i + 1}Title`),
    desc: t(`f${i + 1}Desc`),
  }));

  return (
    <section className="py-24 px-6 bg-bg-card/40">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-bg border border-border rounded-2xl p-6 hover:border-border-light transition-colors"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-4 ${f.colorClass}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
