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
  title: "Offre CINEO x Unboared",
  description:
    "Offre exclusive pour les adherents du reseau CINEO. Transformez vos halls de cinema en espaces d'animation interactifs.",
  robots: { index: false, follow: false },
};

export default function CineoLayout({
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
