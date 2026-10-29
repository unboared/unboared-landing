/**
 * Pages « d'intention » : une page par recherche réelle d'un patron de bar ou
 * d'un animateur (« blind test pour bar », « pub quiz software »…), pour le
 * référencement Google et les assistants IA (ChatGPT cite des pages qui
 * répondent précisément à la question posée).
 *
 * Chaque fait cité ici est vérifié dans le code des jeux (12/10/2026) :
 * - Blind Test (unblind-test, branche airports) : 29 playlists intégrées
 *   (11 « France », 18 internationales dont 5 britanniques), points selon la
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

const FR_PRICE =
  "49 € TTC par mois, sans engagement, ou 490 € par an (2 mois offerts). Les 14 premiers jours sont gratuits : une carte est demandée pour démarrer, rien n'est débité avant la fin de l'essai. Formule Pro à 69 € par mois : la même chose, avec votre logo et vos couleurs sur la TV et les téléphones des joueurs.";
const FR_GEAR =
  "Une TV ou un vidéoprojecteur, un ordinateur relié en HDMI avec un navigateur internet, et une connexion internet. Les joueurs utilisent leur propre téléphone, sans application.";
const EN_PRICE =
  "£45 a month (or €49 / $59), no commitment, or £450 a year (2 months free). The first 14 days are free: a card is needed to start, and nothing is charged before the trial ends. Pro plan at £59 a month (or €69 / $79): the same, with your logo and colours on the TV and players' phones.";
const EN_GEAR =
  "A TV or projector, a laptop or computer connected by HDMI with a web browser, and an internet connection. Players use their own phones, with no app to download.";

export const INTENT_CONTENT: Record<IntentLocale, Record<IntentKey, IntentContent>> = {
  fr: {
    blindtest: {
      metaTitle: "Blind test pour bar, sur votre TV | Unboared",
      metaDescription:
        "Un blind test dans votre bar : la musique sur la TV, les réponses sur les téléphones des clients. 29 playlists prêtes ou sur mesure. 14 jours gratuits.",
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
          title: "29 playlists prêtes à jouer",
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
          body: "Écrivez « quiz sur la Bretagne, niveau facile » ou « les années 90 pour les 30 ans de Julie » : le quiz est prêt en moins d'une minute, avec une relecture automatique des réponses, et vous pouvez modifier chaque question avant de jouer. Vous pouvez aussi écrire vos propres questions, et tout reste enregistré dans votre compte.",
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
  },
  en: {
    blindtest: {
      metaTitle: "Music quiz for pubs and bars, on your TV | Unboared",
      metaDescription:
        "A music quiz for your pub: the music on the TV, answers on your customers' phones. 29 ready-made playlists or your own. 14-day free trial.",
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
          title: "29 playlists, ready to play",
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
          body: "Type “a quiz about the 90s for Sarah's 30th, easy” or “Premier League legends”: your quiz is ready in under a minute, with an automatic answer check, and you can edit any question before you play. You can also write your own questions, and everything stays saved in your account.",
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
  },
};
