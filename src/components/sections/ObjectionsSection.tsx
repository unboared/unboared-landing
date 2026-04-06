"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export default function ObjectionsSection() {
  const t = useTranslations("objections");

  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
        </motion.div>

        <div className="space-y-5">
          {items.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.1 }}
              className="bg-bg-card border border-border rounded-2xl p-7 hover:border-border-light transition-colors"
            >
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-accent mb-3">{item.q}</p>
                  <p className="text-text-muted leading-relaxed">{item.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
