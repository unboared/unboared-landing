"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";
import { CLIENTS } from "@/data/clients";
import { useRef, useEffect, useState } from "react";

function CountUpNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 2200;
    const start = performance.now();
    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [hasStarted, value]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("fr-FR")}{suffix}
    </span>
  );
}

export default function SocialProofBar() {
  const t = useTranslations("socialProof");

  const stats = [
    { value: 1000, prefix: t("stat1Prefix"), suffix: "", label: t("stat1Label") },
    { value: 110, prefix: t("stat2Prefix"), suffix: t("stat2Suffix"), label: t("stat2Label") },
    { value: 500, prefix: "", suffix: t("stat3Suffix"), label: t("stat3Label") },
  ];

  return (
    <section className="py-16 border-y border-border">
      {/* Logo cloud */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <p className="text-center text-xs text-text-dim uppercase tracking-widest mb-8">
          {t("title")}
        </p>
        <div
          className="relative overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        >
          <div className="flex animate-scroll-logos" style={{ width: "max-content" }}>
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <div key={`${client.name}-${i}`} className="flex-shrink-0 mx-10 flex items-center justify-center h-12">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={120}
                  height={48}
                  className="h-8 w-auto object-contain grayscale opacity-40 hover:opacity-80 hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <CountUpNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </div>
            <p className="text-sm text-text-muted mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
