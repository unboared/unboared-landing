"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { URLS } from "@/lib/constants";
import DemoButton from "@/components/DemoButton";

export default function HeroSection() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10">
      {/* Animated background mesh */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 mesh-gradient"
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.03]" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Copy */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-card/60 backdrop-blur-sm px-4 py-2 text-sm text-text-muted mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              {t("eyebrow")}
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
                className="block"
              >
                {t("titleLine1")}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
                className="block bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent"
              >
                {t("titleLine2")}
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.35 }}
              className="text-lg text-text-muted max-w-xl mb-10 leading-relaxed"
            >
              {t("subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-5"
            >
              <motion.a
                href={URLS.signup}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-accent text-white font-bold text-lg glow-accent transition-shadow duration-300"
              >
                {t("ctaPrimary")}
              </motion.a>
              <DemoButton className="inline-flex items-center px-8 py-4 rounded-2xl border border-border-light text-text hover:bg-bg-card/80 transition-all duration-200" />
            </motion.div>

            {/* Trust */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-text-dim"
            >
              {t("noCreditCard")}
            </motion.p>
          </div>

          {/* Right - Hero video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.4 }}
            style={{ y: mockupY, scale: mockupScale }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-transparent to-accent/15 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border-light/50 shadow-2xl shadow-black/50 w-fit mx-auto">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block max-h-[340px] sm:max-h-[460px] lg:max-h-[560px] max-w-[220px] sm:max-w-[280px] lg:max-w-[300px] w-auto h-auto"
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                  <source src="/videos/hero.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
