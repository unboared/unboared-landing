/**
 * Pages « d'intention » : une page par recherche réelle d'un patron de bar ou
 * d'un animateur (« blind test pour bar », « pub quiz software »…), pour le
 * référencement Google et les assistants IA (ChatGPT cite des pages qui
 * répondent précisément à la question posée).
 *
 * Chaque fait cité ici est vérifié dans le code des jeux (12/10/2026, pages d'octobre revérifiées le 30/10) :
 * - Blind Test (unblind-test, branche airports) : 32 playlists intégrées au 30/10
 *   (12 « France », 20 internationales dont 5 britanniques ; Halloween reste au catalogue après sa saison), points selon la
 *   rapidité (timePoints), QCM 4 propositions ou réponse libre, playlist IA
 *   en une phrase + choix titre par titre dans Deezer, playlists enregistrées.
 * - UnQuiz (unquizz-v2, main) : FR ≈ 393 questions (Facile/Moyen/Difficile),
 *   EN 10 quiz natifs = 300 questions ; QCM + Vrai/Faux ; création IA relue.
 * - Plus grosses salles : Top Music au Zénith de Strasbourg (238 joueurs),
 *   matinée ~100 téléphones (Pro Concept, 01/10).
 * Règles de ton : jamais « pas besoin d'animateur » (les animateurs sont des
 * clients), pas de compteur de jeux, pas de « résiliez en 1 clic » (faux).
 *
 * Une même page existe dans les deux langues sous deux adresses différentes
 * (`slugs`) : hreflang relie les deux versions.
 */

import type { IntentKey, IntentLocale } from "./intentSlugs";

export * from "./intentSlugs";

export type IntentBlock = {
  title: string;
  body: string;
  bullets?: string[];
};

export type IntentContent = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lead: string;
  cta: string;
  trust: string;
  /** Média du héros : vidéo de gameplay du catalogue (public/videos/games). */
  media: { video: string; poster: string; alt: string };
  blocks: IntentBlock[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  relatedTitle: string;
};

const BLIND_MEDIA = {
  video: "/videos/games/unblind-test.mp4",
  poster: "/videos/games/unblind-test-poster.jpg",
};
const QUIZ_MEDIA = {
  video: "/videos/games/unquizz.mp4",
  poster: "/videos/games/unquizz-poster.jpg",
};
const PETITBAC_MEDIA = {
  video: "/videos/games/petit-bac.mp4",
  poster: "/videos/games/petit-bac-poster.jpg",
};
const DRAW_MEDIA = {
  video: "/videos/games/draw-guessr.mp4",
  poster: "/videos/games/draw-guessr-poster.jpg",
};

const FR_PRICE =
  "49 € TTC par mois, sans engagement, ou 490 € par an (2 mois offerts). Les 14 premiers jours sont gratuits : une carte est demandée pour démarrer, rien n'est débité avant la fin de l'essai. Formule Pro à 69 € par mois ou 690 € par an : la même chose, avec votre logo et vos couleurs sur la TV et les téléphones des joueurs.";
const FR_GEAR =
  "Une TV ou un vidéoprojecteur, un ordinateur relié en HDMI avec un navigateur internet, et une connexion internet. Les joueurs utilisent leur propre téléphone, sans application.";
const EN_PRICE =
  "£45 a month (or €49 / $59), no commitment, or £450 a year (2 months free). The first 14 days are free: a card is needed to start, and nothing is charged before the trial ends. Pro plan at £59 a month or £590 a year (or €69 / $79 a month, €690 / $790 a year): the same, with your logo and colours on the TV and players' phones.";
const EN_GEAR =
  "A TV or projector, a laptop or computer connected by HDMI with a web browser, and an internet connection. Players use their own phones, with no app to download.";

export const INTENT_CONTENT: Record<IntentLocale, Record<IntentKey, IntentContent>> = {
  fr: {
    blindtest: {
      metaTitle: "Blind test pour bar, sur votre TV | Unboared",
      metaDescription:
        "Un blind test dans votre bar : la musique sur la TV, les réponses sur les téléphones des clients. Plus de 30 playlists, ou la vôtre. 14 jours gratuits.",
      kicker: "Blind test pour bars et restaurants",
      title: "Votre soirée blind test, sur la TV du bar.",
      lead: "La musique passe, la salle répond depuis son téléphone, les points s'affichent sur la TV. Pas de buzzers à acheter, pas de feuilles à corriger.",
      cta: "Lancer mes 14 jours gratuits",
      trust: "Sans engagement · aucun débit avant la fin de l'essai",
      media: { ...BLIND_MEDIA, alt: "Une partie de Blind Test Unboared affichée sur une TV" },
      blocks: [
        {
          title: "Comment se passe un blind test avec Unboared",
          body: "Vous branchez un ordinateur sur la TV et ouvrez Unboared. Un QR code s'affiche : vos clients le scannent avec l'appareil photo de leur téléphone et sont dans la partie. À chaque extrait, ils choisissent la bonne réponse parmi 4 propositions, ou l'écrivent eux-mêmes en réponse libre. Plus on répond vite, plus on marque de points, et le classement s'affiche après chaque chanson.",
        },
        {
          title: "Plus de 30 playlists prêtes à jouer",
          body: "Les extraits viennent de Deezer : vraie qualité de son, et les playlists « Top » se renouvellent d'elles-mêmes.",
          bullets: [
            "Années 60/70, 80, 90, 2000 et 2010",
            "Chansons françaises et rap français 90/00",
            "Disney (facile et difficile) et musiques de films",
            "Tous genres, en version facile ou difficile",
            "Tubes internationaux : Top USA, Top UK, Classic Rock, Country, Hip-Hop…",
          ],
        },
        {
          title: "Une playlist sur le thème de votre soirée",
          body: "Soirée années 80, spéciale rock, Saint-Patrick ? Décrivez votre playlist en une phrase et Unboared la compose, ou choisissez les titres un par un dans le catalogue Deezer. Elle reste enregistrée pour la prochaine fois.",
        },
        {
          title: "Vous gardez la main depuis votre téléphone",
          body: "Le cockpit animateur se pilote depuis votre téléphone, derrière le bar : lancer la partie, mettre en pause, couper le son, changer les réglages, sans retourner à l'ordinateur.",
        },
      ],
      faqTitle: "Vos questions sur le blind test",
      faq: [
        {
          q: "Faut-il des buzzers ou une application ?",
          a: "Non. Chaque joueur utilise son propre téléphone : il scanne le QR code affiché sur la TV et joue directement dans son navigateur.",
        },
        {
          q: "Les joueurs doivent-ils écrire la réponse ?",
          a: "C'est vous qui choisissez avant chaque partie : 4 propositions sur le téléphone (le plus simple pour tout le monde) ou réponse libre, où chacun écrit l'artiste, le titre ou l'œuvre, selon votre réglage.",
        },
        {
          q: "Combien de joueurs peuvent participer ?",
          a: "Les joueurs sont illimités. Des soirées Unboared ont réuni plus de 200 joueurs, comme au Zénith de Strasbourg.",
        },
        { q: "De quel matériel ai-je besoin ?", a: `${FR_GEAR} Le son passe par la TV ou par vos enceintes.` },
        { q: "Combien ça coûte ?", a: FR_PRICE },
        {
          q: "Puis-je aussi faire un quiz dans la même soirée ?",
          a: "Oui. L'abonnement comprend aussi UnQuiz (culture générale, cinéma, sport…), le Petit Bac, GéoLoc et d'autres jeux. Beaucoup de bars alternent blind test et quiz dans la même soirée.",
        },
      ],
      relatedTitle: "À voir aussi",
    },
    quiz: {
      metaTitle: "Soirée quiz dans votre bar, sur la TV | Unboared",
      metaDescription:
        "Une soirée quiz dans votre bar : questions sur la TV, réponses sur les téléphones, classement en direct. Quiz prêts ou créés en une phrase. 14 jours gratuits.",
      kicker: "Quiz pour bars, pubs et restaurants",
      title: "La soirée quiz de votre bar, sans feuilles ni stylos.",
      lead: "Les questions s'affichent sur la TV, chaque joueur répond sur son téléphone et le classement se fait tout seul. Vous animez, Unboared compte les points.",
      cta: "Lancer mes 14 jours gratuits",
      trust: "Sans engagement · aucun débit avant la fin de l'essai",
      media: { ...QUIZ_MEDIA, alt: "Une partie d'UnQuiz Unboared affichée sur une TV" },
      blocks: [
        {
          title: "Comment se passe un quiz avec Unboared",
          body: "Vous ouvrez UnQuiz sur la TV, vos clients scannent le QR code et choisissent un pseudo. Chaque question s'affiche en grand avec un compte à rebours ; on répond sur son téléphone parmi 4 propositions ou en Vrai/Faux. La bonne réponse tombe après chaque question, le classement complet entre les manches, jusqu'au podium final.",
        },
        {
          title: "Des quiz prêts à jouer",
          body: "Près de 400 questions en français, en trois niveaux de difficulté, à lancer en deux clics.",
          bullets: [
            "Culture générale",
            "Cinéma et séries cultes, années 2000",
            "Disney et Pixar, jeux vidéo",
            "Sport et football (Coupe du monde, clubs et légendes, records)",
          ],
        },
        {
          title: "Un quiz sur le thème de votre soirée, en une phrase",
          body: "Écrivez « quiz sur la Bretagne, niveau facile » ou « les années 90 pour les 30 ans de Julie » : le quiz est prêt en une minute environ, avec une relecture automatique des réponses, et vous pouvez modifier chaque question avant de jouer. Vous pouvez aussi écrire vos propres questions, et tout reste enregistré dans votre compte.",
        },
        {
          title: "Un rendez-vous qui fait revenir",
          body: "Un thème différent chaque semaine, un classement, une revanche à prendre : le quiz du jeudi devient le rendez-vous des habitués.",
        },
      ],
      faqTitle: "Vos questions sur la soirée quiz",
      faq: [
        {
          q: "Faut-il une application ou des boîtiers ?",
          a: "Non. Les joueurs scannent le QR code affiché sur la TV avec leur téléphone et jouent dans leur navigateur.",
        },
        {
          q: "Combien de joueurs peuvent participer ?",
          a: "Les joueurs sont illimités : le quiz tient des salles de plus de 100 téléphones.",
        },
        {
          q: "Les questions sont-elles fiables ?",
          a: "Les quiz du catalogue sont préparés et vérifiés par Unboared. Ceux que vous créez en une phrase passent par une relecture automatique des réponses, et vous pouvez modifier chaque question avant de jouer.",
        },
        {
          q: "Peut-on jouer en anglais ?",
          a: "Oui : en passant votre compte en anglais, la console, les jeux et des quiz anglais prêts à jouer sont disponibles. Pratique pour les pubs et les soirées internationales.",
        },
        { q: "De quel matériel ai-je besoin ?", a: FR_GEAR },
        { q: "Combien ça coûte ?", a: FR_PRICE },
      ],
      relatedTitle: "À voir aussi",
    },
    hosts: {
      metaTitle: "Blind test et quiz pour animateurs et DJ | Unboared",
      metaDescription:
        "Animateurs et DJ : blind test, quiz et jeux sur grand écran, joués depuis les téléphones du public, pilotés depuis le vôtre. 14 jours gratuits.",
      kicker: "Pour les animateurs, DJ et organisateurs",
      title: "Le public joue. Vous menez le show.",
      lead: "Blind test, quiz, petit bac : le jeu s'affiche sur l'écran du lieu, le public répond depuis son téléphone, et vous gardez le micro.",
      cta: "Lancer mes 14 jours gratuits",
      trust: "Sans engagement · aucun débit avant la fin de l'essai",
      media: { ...BLIND_MEDIA, alt: "Une partie de Blind Test Unboared sur grand écran" },
      blocks: [
        {
          title: "Vous arrivez, vous branchez, ça joue",
          body: "Votre ordinateur sur la TV ou le vidéoprojecteur du lieu, un QR code à l'écran, et la salle est dans la partie en une minute. Rien à installer chez votre client, aucune application pour le public, aucun boîtier à transporter.",
        },
        {
          title: "Vos soirées préparées à l'avance",
          body: "Composez vos playlists de blind test en une phrase ou titre par titre dans le catalogue Deezer, créez vos quiz sur mesure ou écrivez vos propres questions. Tout reste enregistré dans votre compte, prêt pour la prochaine date.",
        },
        {
          title: "Le pilotage depuis votre téléphone",
          body: "Le cockpit animateur se tient dans la main : lancer un jeu, mettre en pause, couper le son, changer les réglages, sans quitter la scène pour retourner à l'ordinateur.",
        },
        {
          title: "Des petites salles aux très grandes",
          body: "Unboared anime aussi bien un bar de quartier que des salles à plus de 100 téléphones. Top Music l'utilise pour ses animations au Zénith de Strasbourg, où plus de 200 joueurs ont joué ensemble.",
        },
      ],
      faqTitle: "Vos questions d'animateur",
      faq: [
        {
          q: "Comment sort le son du blind test ?",
          a: "Par l'ordinateur qui affiche le jeu : branchez-le sur la sono ou la TV comme d'habitude.",
        },
        {
          q: "Le public doit-il installer quelque chose ?",
          a: "Non. Il scanne le QR code affiché à l'écran et joue dans le navigateur de son téléphone.",
        },
        {
          q: "Combien de joueurs en même temps ?",
          a: "Les joueurs sont illimités. Plusieurs animations ont dépassé 100 téléphones, et plus de 200 joueurs au Zénith de Strasbourg.",
        },
        {
          q: "Mes playlists et mes quiz sont-ils gardés ?",
          a: "Oui, ils sont enregistrés dans votre compte et vous les retrouvez à chaque soirée.",
        },
        {
          q: "Peut-on animer en anglais ?",
          a: "Oui : en passant votre compte en anglais, les jeux et des quiz anglais prêts à jouer sont disponibles, et les playlists internationales sont là pour le blind test.",
        },
        { q: "Combien ça coûte ?", a: FR_PRICE },
      ],
      relatedTitle: "À voir aussi",
    },
    ideas: {
      metaTitle: "Animation bar : idées de soirées jeux sur TV | Unboared",
      metaDescription:
        "Idées d'animation pour votre bar : blind test, quiz, petit bac sur la TV, joués depuis les téléphones des clients. Prêt en 2 minutes. 14 jours gratuits.",
      kicker: "Idées d'animation pour bars et restaurants",
      title: "Une animation qui fait jouer toute la salle.",
      lead: "Blind test, quiz, petit bac, dessin : le jeu s'affiche sur la TV, vos clients jouent depuis leur téléphone. Vous choisissez le jeu, la soirée démarre en deux minutes.",
      cta: "Lancer mes 14 jours gratuits",
      trust: "Sans engagement · aucun débit avant la fin de l'essai",
      media: { ...PETITBAC_MEDIA, alt: "Une partie de Petit Bac Unboared affichée sur une TV" },
      blocks: [
        {
          title: "Pourquoi les jeux sur la TV marchent dans un bar",
          body: "Tout le monde a un téléphone dans la poche : un QR code sur la TV suffit pour que les tables jouent ensemble, sans application ni matériel à distribuer. Les tables se défient, le classement s'affiche entre les manches, et vous lancez ou arrêtez une partie quand vous voulez.",
        },
        {
          title: "6 idées de soirées à lancer",
          body: "Tous ces jeux se lancent depuis le même compte, et vous pouvez en enchaîner plusieurs dans la soirée.",
          bullets: [
            "Le blind test des années 80, 90 ou 2000, avec des playlists prêtes à jouer",
            "Le quiz du jeudi : un thème différent chaque semaine, créé en une phrase",
            "Le Petit Bac géant : une lettre, des catégories, toute la salle qui écrit en même temps",
            "Draw Guessr : tout le monde dessine, puis devine les gribouillages des autres",
            "GeoLoc : trouver la ville sur la carte, le plus proche gagne",
            "La soirée à thème (Saint-Patrick, anniversaire du bar, grand match) avec un quiz et une playlist sur mesure",
          ],
        },
        {
          title: "Un rendez-vous fixe, chaque semaine",
          body: "Une soirée jeux prend quand elle revient au même moment : le blind test du mardi, le quiz du jeudi. Les habitués reviennent pour la revanche et amènent leurs amis.",
        },
        {
          title: "Qui anime la soirée ?",
          body: "Vous, un serveur ou un animateur que vous faites venir : Unboared affiche les questions, joue la musique et compte les points, la personne au micro donne le rythme. Tout se pilote aussi depuis un téléphone, derrière le bar.",
        },
      ],
      faqTitle: "Vos questions sur l'animation du bar",
      faq: [
        {
          q: "Quels jeux sont inclus ?",
          a: "Blind Test, UnQuiz, Petit Bac, GeoLoc, Draw Guessr, Estim et des jeux d'arcade comme Bomber Kitten : tout est compris dans l'abonnement, sans supplément.",
        },
        {
          q: "Combien de joueurs peuvent participer ?",
          a: "Les joueurs sont illimités au blind test et au quiz, et certains jeux d'arcade se jouent jusqu'à 20.",
        },
        {
          q: "Faut-il installer quelque chose ?",
          a: "Rien pour les joueurs : ils scannent le QR code et jouent dans le navigateur de leur téléphone. Côté bar, un ordinateur relié à la TV avec un navigateur internet suffit.",
        },
        { q: "De quel matériel ai-je besoin ?", a: FR_GEAR },
        { q: "Combien ça coûte ?", a: FR_PRICE },
      ],
      relatedTitle: "À voir aussi",
    },
    christmas: {
      metaTitle: "Soirée de Noël au bar : blind test et quiz | Unboared",
      metaDescription:
        "Votre soirée de Noël au bar : blind test de Noël, quiz spécial fêtes et jeux sur la TV, joués depuis les téléphones des clients. 14 jours gratuits.",
      kicker: "Noël et fêtes de fin d'année",
      title: "La soirée de Noël de votre bar, sur la TV.",
      lead: "Un blind test de chansons de Noël, un quiz spécial fêtes, un Petit Bac pour finir : vos clients jouent depuis leur téléphone, et vous préparez tout en quelques minutes.",
      cta: "Lancer mes 14 jours gratuits",
      trust: "Sans engagement · aucun débit avant la fin de l'essai",
      media: { ...BLIND_MEDIA, alt: "Une partie de Blind Test Unboared affichée sur une TV" },
      blocks: [
        {
          title: "Un blind test de Noël en une phrase",
          body: "Écrivez « chansons de Noël, des classiques aux tubes d'aujourd'hui » et Unboared compose la playlist, ou choisissez les titres un par un dans le catalogue Deezer. Elle reste enregistrée pour toutes vos soirées de décembre.",
        },
        {
          title: "Un quiz de Noël sur mesure",
          body: "« Quiz de Noël facile pour une soirée entre collègues » ou « les films de Noël cultes » : le quiz est prêt en une minute environ, avec une relecture automatique des réponses, et vous pouvez modifier chaque question avant de jouer.",
        },
        {
          title: "Pour les pots d'équipe et les groupes",
          body: "En décembre, entreprises, associations et groupes d'amis cherchent un bar pour leur soirée. Proposez-leur une animation : un QR code sur la TV, et toute la tablée joue, sans matériel à prévoir.",
        },
        {
          title: "Prêt avant les fêtes",
          body: "Les 14 premiers jours sont gratuits : de quoi préparer et tester votre soirée avant le jour J. L'abonnement est sans engagement.",
        },
      ],
      faqTitle: "Vos questions sur la soirée de Noël",
      faq: [
        {
          q: "Y a-t-il des chansons de Noël ?",
          a: "Oui : le Blind Test puise dans le catalogue Deezer, où se trouvent les chansons de Noël françaises et internationales. Décrivez votre playlist en une phrase ou choisissez les titres un par un.",
        },
        {
          q: "Faut-il des buzzers ou une application ?",
          a: "Non. Chaque joueur scanne le QR code affiché sur la TV et joue dans le navigateur de son téléphone.",
        },
        {
          q: "Combien de joueurs peuvent participer ?",
          a: "Les joueurs sont illimités au blind test et au quiz : de quoi accueillir une grande tablée ou tout le bar.",
        },
        { q: "De quel matériel ai-je besoin ?", a: FR_GEAR },
        { q: "Combien ça coûte ?", a: FR_PRICE },
      ],
      relatedTitle: "À voir aussi",
    },
    camping: {
      metaTitle: "Animation camping : soirées jeux sur écran | Unboared",
      metaDescription:
        "Animation de camping : blind test, quiz et jeux sur grand écran, joués depuis les téléphones des vacanciers, parents et enfants ensemble. 14 jours gratuits.",
      kicker: "Pour les campings et villages vacances",
      title: "Les soirées du camping, sur grand écran.",
      lead: "Blind test, quiz, petit bac : le jeu s'affiche sur la TV ou le vidéoprojecteur de la salle d'animation, et les vacanciers jouent depuis leur téléphone, parents et enfants ensemble.",
      cta: "Lancer mes 14 jours gratuits",
      trust: "Sans engagement · aucun débit avant la fin de l'essai",
      media: { ...DRAW_MEDIA, alt: "Une partie de Draw Guessr Unboared sur grand écran" },
      blocks: [
        {
          title: "Une animation pour toutes les générations",
          body: "Draw Guessr et les jeux d'arcade pour les plus jeunes, le blind test des années 80 pour les parents, le quiz de culture générale pour tout le monde. Chacun joue depuis son téléphone, sans application à installer.",
        },
        {
          title: "Des vacanciers de toute l'Europe",
          body: "Sur le téléphone, l'accueil et les menus s'affichent dans la langue de chacun : français, anglais, allemand, espagnol, italien ou portugais. Les questions et les playlists restent dans la langue choisie pour la soirée. Au Petit Bac, chaque joueur choisit sa langue (français, anglais, allemand, espagnol ou italien) et joue avec ses propres mots.",
        },
        {
          title: "Une soirée prête en deux minutes",
          body: "L'équipe d'animation ouvre Unboared sur l'ordinateur relié à l'écran, affiche le QR code, et la salle est dans la partie. Playlists et quiz se préparent à l'avance et restent enregistrés pour toute la saison.",
        },
        {
          title: "Pilotée depuis un téléphone",
          body: "Le cockpit animateur se tient dans la main : lancer un jeu, mettre en pause, couper le son, changer les réglages, sans quitter la scène.",
        },
      ],
      faqTitle: "Vos questions sur l'animation du camping",
      faq: [
        {
          q: "Faut-il le wifi ?",
          a: "Il faut une connexion internet pour l'ordinateur qui affiche le jeu. Les joueurs se connectent avec le wifi du camping ou leur réseau mobile.",
        },
        {
          q: "Peut-on jouer en extérieur ?",
          a: "Oui, dès que vous avez un écran ou un vidéoprojecteur visible de tous, du son et une connexion internet.",
        },
        {
          q: "Combien de joueurs peuvent participer ?",
          a: "Les joueurs sont illimités au blind test et au quiz, et certains jeux d'arcade se jouent jusqu'à 20.",
        },
        { q: "De quel matériel ai-je besoin ?", a: FR_GEAR },
        { q: "Combien ça coûte ?", a: `${FR_PRICE} Sans engagement : vous arrêtez quand la saison se termine.` },
      ],
      relatedTitle: "À voir aussi",
    },
  },
  en: {
    blindtest: {
      metaTitle: "Music quiz for pubs and bars, on your TV | Unboared",
      metaDescription:
        "A music quiz for your pub: the music on the TV, answers on your customers' phones. 30+ ready-made playlists or your own. 14-day free trial.",
      kicker: "Music quiz for pubs, bars and restaurants",
      title: "Your pub's music quiz, on the big screen.",
      lead: "The track plays, the room answers on their phones, the scores appear on the TV. No buzzers to buy, no answer sheets to mark.",
      cta: "Start my 14-day free trial",
      trust: "No commitment · nothing charged before the trial ends",
      media: { ...BLIND_MEDIA, alt: "An Unboared music quiz round on a pub TV" },
      blocks: [
        {
          title: "How a music quiz works with Unboared",
          body: "Plug a laptop into the TV and open Unboared. A QR code appears: your customers scan it with their phone camera and they're in. For each clip, they pick the right answer from 4 options, or type it themselves in free-answer mode. The faster you answer, the more points you score, and the leaderboard shows after every track.",
        },
        {
          title: "30+ playlists, ready to play",
          body: "Clips come from Deezer: proper sound quality, and the chart playlists refresh on their own.",
          bullets: [
            "Top UK, Britpop and British Classics",
            "70s, 80s, 90s, 2000s and 2010s Hits",
            "80s New Wave & Synth-pop, 2000s Indie Rock, Classic Rock",
            "Hip-Hop Classics, Country, Feel Good Pop",
            "Film soundtracks and Disney",
          ],
        },
        {
          title: "A playlist for your theme night",
          body: "80s night, St Patrick's, rock special? Describe your playlist in one sentence and Unboared builds it, or pick the tracks one by one from the Deezer catalogue. It stays saved for next time.",
        },
        {
          title: "Run it all from your phone",
          body: "The host cockpit works from your phone, behind the bar: start the round, pause, mute, change the settings, without walking back to the laptop.",
        },
      ],
      faqTitle: "Music quiz questions",
      faq: [
        {
          q: "Do we need buzzers or an app?",
          a: "No. Every player uses their own phone: they scan the QR code on the TV and play straight in their browser.",
        },
        {
          q: "Do players have to type the answer?",
          a: "You choose before each game: 4 options on the phone (easiest for everyone) or free answer, where everyone types the artist, the title or the film, as you choose.",
        },
        {
          q: "How many players can join?",
          a: "Unlimited players. Unboared nights have brought together more than 200 players at once.",
        },
        { q: "What equipment do I need?", a: `${EN_GEAR} Sound plays through the TV or your speakers.` },
        { q: "How much does it cost?", a: EN_PRICE },
        {
          q: "Can we do a general knowledge quiz on the same night?",
          a: "Yes. The subscription also includes UnQuiz (general knowledge, music, movies, sport…), Categories, GeoLoc and more. Plenty of pubs mix a music round and a quiz in the same evening.",
        },
      ],
      relatedTitle: "See also",
    },
    quiz: {
      metaTitle: "Pub quiz software for quiz nights | Unboared",
      metaDescription:
        "Quiz night software for pubs: questions on the TV, answers on phones, live scores. Ready-made English quizzes or your own in one sentence. 14-day free trial.",
      kicker: "Quiz night software for pubs and bars",
      title: "Quiz night in your pub, without pens and answer sheets.",
      lead: "Questions appear on the TV, everyone answers on their phone and the scores add themselves up. You host, Unboared keeps score.",
      cta: "Start my 14-day free trial",
      trust: "No commitment · nothing charged before the trial ends",
      media: { ...QUIZ_MEDIA, alt: "An UnQuiz pub quiz round on a TV" },
      blocks: [
        {
          title: "How a quiz night works with Unboared",
          body: "Open UnQuiz on the TV, your customers scan the QR code and pick a name. Each question shows up big with a countdown; players answer on their phone from 4 options or True/False. The answer is revealed after every question, the full leaderboard between rounds, all the way to the final podium.",
        },
        {
          title: "Ready-made English quizzes",
          body: "300 questions written in English, ready to launch in two clicks.",
          bullets: [
            "General Knowledge (two rounds)",
            "Music: 80s & 90s, 2000s & 2010s",
            "Movies & TV, Geography & Travel",
            "Food & Drink, Science & Nature",
            "UK Football and US Sports",
          ],
        },
        {
          title: "Your own quiz in one sentence",
          body: "Type “a quiz about the 90s for Sarah's 30th, easy” or “Premier League legends”: your quiz is ready in about a minute, with an automatic answer check, and you can edit any question before you play. You can also write your own questions, and everything stays saved in your account.",
        },
        {
          title: "A weekly fixture people come back for",
          body: "A new theme every week, a leaderboard, a rematch to win: your Thursday quiz becomes the regulars' night out.",
        },
      ],
      faqTitle: "Pub quiz questions",
      faq: [
        {
          q: "Do players need an app or handsets?",
          a: "No. Players scan the QR code on the TV with their phone and play in their browser.",
        },
        {
          q: "How many players can join?",
          a: "Unlimited players: the quiz handles rooms of more than 100 phones.",
        },
        {
          q: "Are the questions reliable?",
          a: "The built-in quizzes are prepared and checked by Unboared. Quizzes you create in one sentence get an automatic answer check, and you can edit any question before you play.",
        },
        {
          q: "Is everything in English?",
          a: "Yes: the host console, the games and the built-in quizzes are all available in English.",
        },
        { q: "What equipment do I need?", a: EN_GEAR },
        { q: "How much does it cost?", a: EN_PRICE },
      ],
      relatedTitle: "See also",
    },
    hosts: {
      metaTitle: "Quiz and music quiz tools for hosts and DJs | Unboared",
      metaDescription:
        "For quiz hosts and DJs: music quiz, trivia and party games on the big screen, played from the crowd's phones, run from yours. 14-day free trial.",
      kicker: "For quiz hosts, DJs and event organisers",
      title: "The crowd plays. You run the show.",
      lead: "Music quiz, trivia, Categories: the game shows on the venue's screen, the crowd answers on their phones, and you keep the mic.",
      cta: "Start my 14-day free trial",
      trust: "No commitment · nothing charged before the trial ends",
      media: { ...BLIND_MEDIA, alt: "An Unboared music quiz on a big screen" },
      blocks: [
        {
          title: "Turn up, plug in, play",
          body: "Your laptop on the venue's TV or projector, a QR code on screen, and the room is in the game within a minute. Nothing to install at the venue, no app for the crowd, no handsets to carry around.",
        },
        {
          title: "Prepare your nights in advance",
          body: "Build your music rounds in one sentence or track by track from the Deezer catalogue, create custom quizzes or write your own questions. Everything stays saved in your account, ready for the next gig.",
        },
        {
          title: "Run it from your phone",
          body: "The host cockpit fits in your hand: start a game, pause, mute, change the settings, without leaving the stage to go back to the laptop.",
        },
        {
          title: "From the local pub to the arena",
          body: "Unboared runs a neighbourhood bar as easily as rooms of more than 100 phones. Top Music uses it for its shows at the Zénith de Strasbourg, where more than 200 players played together.",
        },
      ],
      faqTitle: "Questions from hosts",
      faq: [
        {
          q: "How does the music quiz sound come out?",
          a: "Through the computer showing the game: plug it into your PA or the TV as usual.",
        },
        {
          q: "Does the crowd have to install anything?",
          a: "No. They scan the QR code on screen and play in their phone's browser.",
        },
        {
          q: "How many players at once?",
          a: "Unlimited players. Several events have passed 100 phones, and more than 200 players at the Zénith de Strasbourg.",
        },
        {
          q: "Are my playlists and quizzes saved?",
          a: "Yes, they're saved in your account and ready every time you play.",
        },
        { q: "How much does it cost?", a: EN_PRICE },
      ],
      relatedTitle: "See also",
    },
    ideas: {
      metaTitle: "Pub entertainment ideas: games on your TV | Unboared",
      metaDescription:
        "Pub entertainment ideas that get every table playing: music quiz, trivia and Categories on the TV, played on customers' phones. 14-day free trial.",
      kicker: "Entertainment ideas for pubs and bars",
      title: "Pub entertainment that gets every table playing.",
      lead: "Music quiz, trivia, Categories, drawing games: the game shows on your TV and customers play on their phones. Pick a game and the night starts in two minutes.",
      cta: "Start my 14-day free trial",
      trust: "No commitment · nothing charged before the trial ends",
      media: { ...PETITBAC_MEDIA, alt: "An Unboared Categories round on a TV" },
      blocks: [
        {
          title: "Why TV games work in a pub",
          body: "Everyone has a phone in their pocket: one QR code on the TV and every table is playing together, with no app and nothing to hand out. Tables take each other on, the leaderboard shows between rounds, and you start or stop a game whenever you like.",
        },
        {
          title: "6 nights you can run",
          body: "Every game launches from the same account, and you can play several in one evening.",
          bullets: [
            "A music quiz: 80s, 90s or 2000s, with ready-made playlists",
            "The Thursday quiz: a new theme every week, created in one sentence",
            "Giant Categories: one letter, a few categories, the whole room writing at once",
            "Draw Guessr: everyone draws, then guesses each other's doodles",
            "GeoLoc: find the city on the map, closest pin wins",
            "A theme night (St Patrick's, the pub's birthday, a big match) with a custom quiz and playlist",
          ],
        },
        {
          title: "A weekly fixture",
          body: "A games night catches on when it comes back at the same time: Tuesday's music quiz, Thursday's pub quiz. Regulars come back for the rematch and bring their friends.",
        },
        {
          title: "Who runs the night?",
          body: "You, a member of staff or a quiz host you book: Unboared shows the questions, plays the music and keeps score, and whoever's on the mic sets the pace. You can also run everything from a phone, behind the bar.",
        },
      ],
      faqTitle: "Pub entertainment questions",
      faq: [
        {
          q: "Which games are included?",
          a: "Blind Test (music quiz), UnQuiz (trivia), Categories, GeoLoc, Draw Guessr, Estim and arcade games like Bomber Kitten: all included in the subscription, no extras.",
        },
        {
          q: "How many players can join?",
          a: "Unlimited players for the music quiz and trivia, and some arcade games take up to 20.",
        },
        {
          q: "Do we need to install anything?",
          a: "Nothing for players: they scan the QR code and play in their phone's browser. For the pub, a computer connected to the TV with a web browser is all it takes.",
        },
        { q: "What equipment do I need?", a: EN_GEAR },
        { q: "How much does it cost?", a: EN_PRICE },
      ],
      relatedTitle: "See also",
    },
    christmas: {
      metaTitle: "Christmas pub quiz on your TV | Unboared",
      metaDescription:
        "Run a Christmas pub quiz on the TV: festive trivia and a Christmas music round, answered on customers' phones. Ready in one sentence. 14-day free trial.",
      kicker: "Christmas and the festive season",
      title: "Your pub's Christmas quiz, on the big screen.",
      lead: "A Christmas music round, festive trivia, a game of Categories to finish: customers play on their phones, and you set it all up in a few minutes.",
      cta: "Start my 14-day free trial",
      trust: "No commitment · nothing charged before the trial ends",
      media: { ...QUIZ_MEDIA, alt: "An UnQuiz pub quiz round on a TV" },
      blocks: [
        {
          title: "A Christmas music round in one sentence",
          body: "Type “Christmas songs, from the classics to today's hits” and Unboared builds the playlist, or pick the tracks one by one from the Deezer catalogue. It stays saved for every night in December.",
        },
        {
          title: "Your own Christmas quiz",
          body: "“An easy Christmas quiz for an office party” or “classic Christmas films”: your quiz is ready in about a minute, with an automatic answer check, and you can edit any question before you play.",
        },
        {
          title: "For office parties and group bookings",
          body: "In December, companies, clubs and groups of friends are looking for a pub for their night out. Offer them a quiz: one QR code on the TV and the whole party is playing, with nothing to set up.",
        },
        {
          title: "Ready before the festive rush",
          body: "The first 14 days are free: time to prepare and test your quiz before the big night. No commitment.",
        },
      ],
      faqTitle: "Christmas quiz questions",
      faq: [
        {
          q: "Are there Christmas songs?",
          a: "Yes: Blind Test draws on the Deezer catalogue, which has the Christmas songs everyone knows. Describe your playlist in one sentence or pick the tracks one by one.",
        },
        {
          q: "Do players need an app or handsets?",
          a: "No. Players scan the QR code on the TV and play in their phone's browser.",
        },
        {
          q: "How many players can join?",
          a: "Unlimited players for the music quiz and trivia: enough for a big group booking or the whole pub.",
        },
        { q: "What equipment do I need?", a: EN_GEAR },
        { q: "How much does it cost?", a: EN_PRICE },
      ],
      relatedTitle: "See also",
    },
    camping: {
      metaTitle: "Holiday park entertainment: games on screen | Unboared",
      metaDescription:
        "Holiday park entertainment: music quiz, trivia and party games on the big screen, played on guests' phones, parents and kids together. 14-day free trial.",
      kicker: "For holiday parks and campsites",
      title: "Holiday park evenings, on the big screen.",
      lead: "Music quiz, trivia, Categories: the game shows on the entertainment room's TV or projector, and guests play on their phones, parents and kids together.",
      cta: "Start my 14-day free trial",
      trust: "No commitment · nothing charged before the trial ends",
      media: { ...DRAW_MEDIA, alt: "A Draw Guessr round from Unboared on a big screen" },
      blocks: [
        {
          title: "Entertainment for every generation",
          body: "Draw Guessr and arcade games for the youngest, an 80s music quiz for the parents, general knowledge for everyone. Everybody plays on their own phone, with no app to install.",
        },
        {
          title: "Guests from all over Europe",
          body: "On each phone, the welcome screen and menus show in the player's own language: English, French, German, Spanish, Italian or Portuguese. Questions and playlists stay in the language you pick for the night. In Categories, each player picks their language (English, French, German, Spanish or Italian) and plays with their own words.",
        },
        {
          title: "A night ready in two minutes",
          body: "Your entertainment team opens Unboared on the computer connected to the screen, shows the QR code, and the room is in the game. Playlists and quizzes can be prepared in advance and stay saved all season.",
        },
        {
          title: "Run from a phone",
          body: "The host cockpit fits in your hand: start a game, pause, mute, change the settings, without leaving the stage.",
        },
      ],
      faqTitle: "Holiday park questions",
      faq: [
        {
          q: "Do we need wifi?",
          a: "The computer showing the game needs an internet connection. Players join on the park's wifi or their mobile data.",
        },
        {
          q: "Can we play outdoors?",
          a: "Yes, as long as you have a screen or projector everyone can see, sound and an internet connection.",
        },
        {
          q: "How many players can join?",
          a: "Unlimited players for the music quiz and trivia, and some arcade games take up to 20.",
        },
        { q: "What equipment do I need?", a: EN_GEAR },
        { q: "How much does it cost?", a: `${EN_PRICE} No commitment: stop when the season ends.` },
      ],
      relatedTitle: "See also",
    },
  },
};
