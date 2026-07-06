import Link from "next/link";
import { Archivo, Figtree } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"], display: "swap" });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], display: "swap" });

/**
 * 404 racine — atteinte quand la locale est invalide (/zz/…, /blog/…) ou
 * qu'un notFound() remonte au-dessus du segment [locale]. Hors provider
 * i18n : page statique bilingue minimale, qui renvoie vers les vraies 404
 * localisées (le jeu vit dans [locale]/not-found.tsx).
 * Le layout racine ne rend pas <html> : on le fournit ici.
 */
export default function RootNotFound() {
  return (
    <html lang="fr" className={`${archivo.variable} ${figtree.variable}`}>
      <body className="site antialiased">
        <section className="nf">
          <div className="wrap nf-inner">
            <div className="nf-hero">
              <p className="nf-kicker">Erreur 404 — Error 404</p>
              <p className="nf-code nf-code-static">
                <span>4</span>
                <span className="nf-zero-static" aria-hidden="true" />
                <span>4</span>
              </p>
              <h1 className="nf-title">Cette page n&apos;existe pas.</h1>
              <p className="nf-lead">This page does not exist.</p>
              <div className="nf-cta">
                <Link className="btn btn-primary" href="/fr">
                  Retour à l&apos;accueil
                </Link>
                <Link className="btn btn-ghost" href="/en">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
