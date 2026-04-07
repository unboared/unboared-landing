type JsonLdProps = {
  data: Record<string, unknown>;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Unboared",
    url: "https://unboared.com",
    logo: "https://unboared.com/images/logos/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@unboared.com",
      contactType: "customer support",
    },
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Unboared",
    url: "https://unboared.com",
  };
}

export function faqJsonLd(locale: string) {
  const items =
    locale === "fr"
      ? [
          {
            q: "Combien de temps faut-il pour installer Unboared ?",
            a: "2 minutes ! Branchez un ordinateur portable à une TV en HDMI, ouvrez votre navigateur sur console.unboared.com et c'est parti.",
          },
          {
            q: "Mes clients doivent-ils télécharger une application ?",
            a: "Aucune application nécessaire. Les joueurs scannent simplement le QR code avec l'appareil photo de leur téléphone et jouent directement dans leur navigateur.",
          },
          {
            q: "Combien de joueurs peuvent jouer en même temps ?",
            a: "La plupart de nos jeux supportent un nombre illimité de joueurs. Certains jeux d'action comme Bomber Kitten sont limités à 20 joueurs pour une expérience optimale.",
          },
          {
            q: "Ai-je besoin d'une connexion WiFi ?",
            a: "Les joueurs ont besoin d'une connexion internet (WiFi ou données mobiles). L'ordinateur connecté à la TV a également besoin d'internet. Un WiFi stable est recommandé pour la meilleure expérience.",
          },
          {
            q: "Puis-je personnaliser les jeux ?",
            a: "Oui ! Vous pouvez créer vos propres quiz, choisir les thèmes musicaux pour le blind test, ajuster le nombre de manches, et bien plus encore.",
          },
          {
            q: "Comment fonctionne l'essai gratuit ?",
            a: "Vous avez 14 jours pour essayer Unboared gratuitement avec accès à tous les jeux et fonctionnalités. Une carte bancaire est requise pour démarrer l'essai, mais vous ne serez pas débité avant la fin des 14 jours si vous choisissez de continuer.",
          },
          {
            q: "Puis-je résilier à tout moment ?",
            a: "Oui, l'abonnement est sans engagement. Vous pouvez résilier à tout moment depuis votre tableau de bord ou en nous contactant par email.",
          },
          {
            q: "De quel équipement ai-je besoin ?",
            a: "Un ordinateur portable (ou fixe) avec un navigateur web moderne, un câble HDMI et une TV. C'est tout !",
          },
          {
            q: "Les jeux sont-ils disponibles en plusieurs langues ?",
            a: "Les jeux sont actuellement disponibles en français et en anglais. Nous travaillons à l'ajout d'autres langues.",
          },
          {
            q: "Comment contacter le support ?",
            a: "Par email à contact@unboared.com. Nous répondons généralement sous 24h.",
          },
        ]
      : [
          {
            q: "How long does it take to set up Unboared?",
            a: "2 minutes! Connect your laptop to a TV via HDMI, open your web browser to console.unboared.com, and you're good to go.",
          },
          {
            q: "Do my customers need to download an app?",
            a: "No app needed. Players simply scan the QR code with their phone camera and play directly in their browser.",
          },
          {
            q: "How many players can play at the same time?",
            a: "Most of our games support unlimited players. Some action games like Bomber Kitten are limited to 20 players for optimal experience.",
          },
          {
            q: "Do I need a WiFi connection?",
            a: "Players need an internet connection (WiFi or mobile data). The TV-connected computer also needs internet. Stable WiFi is recommended for the best experience.",
          },
          {
            q: "Can I customize the games?",
            a: "Yes! You can create your own quizzes, choose music themes for the blind test, adjust the number of rounds, and much more.",
          },
          {
            q: "How does the free trial work?",
            a: "You get 14 days to try Unboared for free with access to all games and features. A credit card is required to start the trial, but you won't be charged until after the 14 days if you choose to continue.",
          },
          {
            q: "Can I cancel at any time?",
            a: "Yes, the subscription is commitment-free. You can cancel anytime from your dashboard or by contacting us via email.",
          },
          {
            q: "What equipment do I need?",
            a: "A laptop (or desktop) with a modern web browser, an HDMI cable, and a TV. That's it!",
          },
          {
            q: "Are the games available in multiple languages?",
            a: "Games are currently available in French and English. We're working on adding more languages.",
          },
          {
            q: "How do I contact support?",
            a: "By email at contact@unboared.com. We typically respond within 24 hours.",
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
