"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";
import { Tv2, QrCode, Trophy } from "lucide-react";

const icons = [Tv2, QrCode, Trophy];

export default function HowItWorksSection() {
  const t = useTranslations("howItWorks");

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="grid gap-10">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
                  className="flex gap-5"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-text-dim">0{i + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Venue photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-border-light/50 shadow-2xl shadow-black/50">
              <Image
                src="/images/photos/bar-ninkasi-soiree.webp"
                alt="Unboared en bar"
                width={600}
                height={600}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
