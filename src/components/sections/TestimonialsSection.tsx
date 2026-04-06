"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonialPhotos = [
  "/images/testimonials/laurent-angelini.png",
  "/images/testimonials/louis-gestin.png",
  "/images/testimonials/erwan-le-guilloux.png",
];

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const testimonials = [
    {
      quote: t("t1Quote"),
      author: t("t1Author"),
      role: t("t1Role"),
      company: t("t1Company"),
      photo: testimonialPhotos[0],
    },
    {
      quote: t("t2Quote"),
      author: t("t2Author"),
      role: t("t2Role"),
      company: t("t2Company"),
      photo: testimonialPhotos[1],
    },
    {
      quote: t("t3Quote"),
      author: t("t3Author"),
      role: t("t3Role"),
      company: t("t3Company"),
      photo: testimonialPhotos[2],
    },
  ];

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
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="bg-bg border border-border rounded-2xl p-6 relative hover:border-border-light transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-text-muted leading-relaxed mb-6 text-sm italic">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <Image
                  src={item.photo}
                  alt={item.author}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12 border border-border-light"
                />
                <div>
                  <p className="font-semibold text-sm">{item.author}</p>
                  {(item.role || item.company) && (
                    <p className="text-text-dim text-xs">
                      {[item.role, item.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
