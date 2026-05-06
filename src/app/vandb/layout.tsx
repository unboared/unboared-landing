import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "../globals.css";

const sora = Sora({
  variable: "--font-cabinet",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-satoshi",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Offre V&B x Unboared",
  description:
    "Offre exclusive pour le reseau V&B (Vins & Bieres) et Levrette Cafe. Animez vos soirees en cave-bar avec une boite a outils digitale cle en main.",
  robots: { index: false, follow: false },
};

export default function VandbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sora.variable} ${dmSans.variable}`}>
      <body className="grain min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
