"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Effets globaux de la page, portés du prototype validé :
 * - reveals au scroll sur les éléments [data-reveal] ;
 * - lecture des vidéos [data-io] uniquement quand elles sont visibles
 *   (perf + batterie), coupées et relancées via IntersectionObserver.
 *
 * La classe `js` sur <html> (qui masque les reveals avant leur apparition) est
 * posée par le script inline du layout AVANT le premier paint — surtout pas ici,
 * pour éviter tout flash de contenu masqué. prefers-reduced-motion est géré côté CSS.
 */
export default function PageFx() {
  const pathname = usePathname();

  useEffect(() => {
    /* Reveals au scroll */
    const reveals = document.querySelectorAll("[data-reveal]");
    let revealIo: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealIo?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach((el) => revealIo?.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    /* Vidéos : lecture uniquement quand visibles */
    const videos = document.querySelectorAll<HTMLVideoElement>("video[data-io]");
    videos.forEach((v) => {
      v.muted = true;
    });
    let videoIo: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      videoIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              video.play()?.catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.15 }
      );
      videos.forEach((v) => videoIo?.observe(v));
    }

    return () => {
      revealIo?.disconnect();
      videoIo?.disconnect();
    };
  }, [pathname]);

  return null;
}
