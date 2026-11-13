import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // L'image de soirée lit ses polices et son logo sur disque : sans cette ligne, l'hébergeur
  // ne les embarque pas avec la route et elle répond 503.
  outputFileTracingIncludes: {
    "/api/soiree-card": ["./src/assets/fonts/*.ttf", "./src/assets/unboared-logo-420.png"],
  },
};

export default withNextIntl(nextConfig);
