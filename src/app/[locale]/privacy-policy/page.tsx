import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.privacy" });
  return { title: t("title"), description: t("description") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <div className="pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto prose-invert">
        <h1 className="text-4xl font-bold mb-2">
          {isEn ? "Privacy Policy" : "Politique de Confidentialité"}
        </h1>
        <p className="text-text-dim text-sm mb-12">
          {isEn ? "Last updated: September 18, 2026" : "Dernière mise à jour : 18 septembre 2026"}
        </p>

        <section className="space-y-8 text-text-muted leading-relaxed">
          {isEn ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-text mb-3">1. Introduction</h2>
                <p>This privacy policy describes how Unboared (&quot;we&quot;, &quot;our&quot;) collects, uses and protects personal data when you use our platform.</p>
                <p className="mt-3">We are committed to protecting the privacy of our users and their customers in accordance with the EU General Data Protection Regulation (GDPR) and, for people in the United Kingdom, the UK GDPR and the Data Protection Act 2018. Section 10 also describes the rights of residents of the United States.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">2. Data controllers</h2>
                <p>Unboared and the subscriber (the partner venue, or the professional host running the game) act as joint data controllers for player data. Unboared provides the technical platform; the subscriber decides whether to enable data collection.</p>
                <p className="mt-3"><strong className="text-text">Unboared</strong> — 9 rue Dareau, 75014 Paris, France<br />Email: contact@unboared.com</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Data collected</h2>
                <p><strong className="text-text">For venues (subscribers):</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>First name, last name, professional email address</li>
                  <li>Venue name</li>
                  <li>Billing information: billing address and country, payment method (managed by Stripe, we never see full card numbers)</li>
                  <li>Usage data (sessions, games played, statistics)</li>
                  <li>Text of requests submitted to the AI playlist generator (Blind Test)</li>
                </ul>

                <p className="mt-4"><strong className="text-text">For players:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Chosen username and avatar</li>
                  <li>Scores and game history</li>
                  <li>If enabled by the venue: email address, first name, last name, phone number, age</li>
                  <li>Technical data: IP address, browser type, device type</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">4. Purposes of processing</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Providing and improving the Service</li>
                  <li>Managing subscriptions and billing</li>
                  <li>Usage statistics for venues</li>
                  <li>Email communications (only with explicit consent)</li>
                  <li>Managing leaderboards and rewards</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">5. Legal basis</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-text">Contract performance:</strong> providing the Service to subscribers</li>
                  <li><strong className="text-text">Legitimate interest:</strong> improving the Service, anonymised statistics</li>
                  <li><strong className="text-text">Consent:</strong> collecting player emails, marketing communications</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">6. Retention periods</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Account data: 3 years after last activity</li>
                  <li>Billing data: 10 years (legal obligation)</li>
                  <li>Player data: 12 months after last gaming session</li>
                  <li>Technical logs: 12 months</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">7. Data sharing and service providers</h2>
                <p>We never sell personal data. We share it only with the subscriber concerned and with the service providers below, each limited to what it needs to provide its service to us:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong className="text-text">The subscriber (venue or host):</strong> player data collected during their games</li>
                  <li><strong className="text-text">Stripe:</strong> payment processing and billing</li>
                  <li><strong className="text-text">Google (Firebase, Google Cloud, Google Workspace):</strong> hosting, database, authentication, usage analytics (Firebase Analytics) and some service emails</li>
                  <li><strong className="text-text">Railway:</strong> hosting of the real-time game server (connects the screen and players&apos; phones)</li>
                  <li><strong className="text-text">Heroku (Salesforce):</strong> hosting of our payment backend</li>
                  <li><strong className="text-text">Vercel:</strong> hosting of our website unboared.com</li>
                  <li><strong className="text-text">Sentry:</strong> error monitoring of the game console</li>
                  <li><strong className="text-text">Resend:</strong> sending of service emails (welcome, trial reminder, password reset, contact form)</li>
                  <li><strong className="text-text">Mailchimp (Intuit):</strong> email list of account holders and newsletter subscribers</li>
                  <li><strong className="text-text">Hostinger:</strong> hosting of our contact@unboared.com mailbox</li>
                  <li><strong className="text-text">Anthropic:</strong> AI generation of Blind Test playlists; only the text of the request is sent, never player data</li>
                  <li><strong className="text-text">Deezer:</strong> music catalogue and audio extracts for the Blind Test; the device playing the game connects to Deezer, which receives its IP address</li>
                  <li><strong className="text-text">Meta (Facebook):</strong> advertising measurement via the Meta Pixel (see section 11)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">8. International transfers</h2>
                {/* À VALIDER JURISTE : garanties de transfert UK (IDTA / Addendum UK / UK-US Data Bridge) */}
                <p>Several of the service providers above are based in the United States, so some data is processed outside the European Economic Area and the United Kingdom. These transfers rely on the EU-US Data Privacy Framework (and its UK extension) where the provider is certified, or on the European Commission&apos;s Standard Contractual Clauses, supplemented by the UK Addendum for data from the United Kingdom.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">9. Security</h2>
                <p>We implement appropriate technical and organisational measures to protect personal data: encrypted communications (HTTPS), secure authentication, restricted data access.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">10. Your rights</h2>
                <p>Under the GDPR, you have the following rights:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Right of access to your personal data</li>
                  <li>Right to rectification</li>
                  <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to restriction of processing</li>
                  <li>Right to withdraw consent at any time</li>
                </ul>
                <p className="mt-3">To exercise these rights, contact us at: contact@unboared.com</p>
                <p className="mt-3">You also have the right to lodge a complaint with your local data protection authority (in France: the CNIL; in the UK: the ICO — Information Commissioner&apos;s Office).</p>
                {/* À VALIDER JURISTE : applicabilité CCPA/CPRA et lois des autres États US ; qualification du Meta Pixel en « sharing » */}
                <p className="mt-3"><strong className="text-text">Residents of the United States.</strong> Depending on your state of residence (for example California), you may have the right to know which personal information we collect and why, to access it, to have it corrected or deleted, and to opt out of the &quot;sale&quot; or &quot;sharing&quot; of your personal information for targeted advertising. We do not sell personal information. You can exercise these rights by emailing contact@unboared.com; we will not treat you differently for doing so.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Cookies</h2>
                <p>Our platform uses technical cookies necessary for the Service to function (player identification, game session). These cookies are strictly necessary and do not require consent.</p>
                <p className="mt-3">We also use Firebase Analytics to measure Service usage. You can disable this collection via your browser settings.</p>
                <p className="mt-3">Our website (unboared.com) and our console (console.unboared.com, including the pages players open on their phone to join a game) use the Meta Pixel, which records page visits and sign-ups to measure the performance of our advertising on Meta platforms (Facebook, Instagram). You can limit this tracking via your browser settings or your Meta ad preferences.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">12. Changes to this policy</h2>
                <p>We may update this privacy policy. Significant changes will be communicated by email at least 30 days before they take effect.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">13. Contact</h2>
                <p>For any questions about this policy, contact us at: contact@unboared.com</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-text mb-3">1. Introduction</h2>
                <p>La présente politique de confidentialité décrit comment Unboared (ci-après &quot;nous&quot;, &quot;notre&quot;) collecte, utilise et protège les données personnelles dans le cadre de l&apos;utilisation de notre plateforme.</p>
                <p className="mt-3">Nous nous engageons à protéger la vie privée de nos utilisateurs et de leurs clients conformément au Règlement Général sur la Protection des Données (RGPD) et, pour les personnes situées au Royaume-Uni, au UK GDPR et au Data Protection Act 2018. L&apos;article 10 décrit également les droits des résidents des États-Unis.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">2. Responsables du traitement</h2>
                <p>Unboared et l&apos;abonné (l&apos;établissement partenaire, ou l&apos;animateur professionnel qui anime le jeu) agissent en tant que responsables conjoints du traitement des données des joueurs. Unboared fournit la plateforme technique, l&apos;abonné décide de l&apos;activation de la collecte de données.</p>
                <p className="mt-3"><strong className="text-text">Unboared</strong> — 9 rue Dareau, 75014 Paris, France<br />Email : contact@unboared.com</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Données collectées</h2>
                <p><strong className="text-text">Pour les établissements (abonnés) :</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nom, prénom, adresse email professionnelle</li>
                  <li>Nom de l&apos;établissement</li>
                  <li>Informations de facturation : adresse et pays de facturation, moyen de paiement (gérés par Stripe, nous ne voyons jamais les numéros de carte complets)</li>
                  <li>Données d&apos;utilisation (sessions, jeux joués, statistiques)</li>
                  <li>Texte des demandes soumises au générateur de playlists par IA (Blind Test)</li>
                </ul>

                <p className="mt-4"><strong className="text-text">Pour les joueurs :</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Pseudo et avatar choisis</li>
                  <li>Scores et historique de jeu</li>
                  <li>Si activé par l&apos;établissement : adresse email, prénom, nom, téléphone, âge</li>
                  <li>Données techniques : adresse IP, type de navigateur, type d&apos;appareil</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">4. Finalités du traitement</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Fourniture et amélioration du Service</li>
                  <li>Gestion des abonnements et de la facturation</li>
                  <li>Statistiques d&apos;utilisation pour les établissements</li>
                  <li>Communication par email (uniquement si consentement explicite)</li>
                  <li>Gestion des classements et des récompenses</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">5. Base légale</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-text">Exécution du contrat :</strong> fourniture du Service aux abonnés</li>
                  <li><strong className="text-text">Intérêt légitime :</strong> amélioration du Service, statistiques anonymisées</li>
                  <li><strong className="text-text">Consentement :</strong> collecte d&apos;emails des joueurs, communications marketing</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">6. Durée de conservation</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Données de compte : 3 ans après la dernière activité</li>
                  <li>Données de facturation : 10 ans (obligation légale)</li>
                  <li>Données des joueurs : 12 mois après la dernière session de jeu</li>
                  <li>Logs techniques : 12 mois</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">7. Partage des données et sous-traitants</h2>
                <p>Nous ne vendons jamais de données personnelles. Nous ne les partageons qu&apos;avec l&apos;abonné concerné et avec les prestataires ci-dessous, chacun limité à ce dont il a besoin pour nous rendre son service :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong className="text-text">L&apos;abonné (établissement ou animateur) :</strong> données des joueurs collectées lors de ses parties</li>
                  <li><strong className="text-text">Stripe :</strong> traitement des paiements et facturation</li>
                  <li><strong className="text-text">Google (Firebase, Google Cloud, Google Workspace) :</strong> hébergement, base de données, authentification, mesure d&apos;audience (Firebase Analytics) et envoi de certains emails de service</li>
                  <li><strong className="text-text">Railway :</strong> hébergement du serveur de jeu en temps réel (connexion entre l&apos;écran et les téléphones des joueurs)</li>
                  <li><strong className="text-text">Heroku (Salesforce) :</strong> hébergement de notre service de paiement</li>
                  <li><strong className="text-text">Vercel :</strong> hébergement de notre site unboared.com</li>
                  <li><strong className="text-text">Sentry :</strong> suivi des erreurs de la console de jeu</li>
                  <li><strong className="text-text">Resend :</strong> envoi des emails de service (bienvenue, rappel de fin d&apos;essai, réinitialisation du mot de passe, formulaire de contact)</li>
                  <li><strong className="text-text">Mailchimp (Intuit) :</strong> liste email des titulaires de compte et des abonnés à la newsletter</li>
                  <li><strong className="text-text">Hostinger :</strong> hébergement de notre messagerie contact@unboared.com</li>
                  <li><strong className="text-text">Anthropic :</strong> génération de playlists Blind Test par IA ; seul le texte de la demande est transmis, jamais de données de joueurs</li>
                  <li><strong className="text-text">Deezer :</strong> catalogue musical et extraits audio du Blind Test ; l&apos;appareil qui diffuse le jeu se connecte à Deezer, qui reçoit son adresse IP</li>
                  <li><strong className="text-text">Meta (Facebook) :</strong> mesure publicitaire via le Pixel Meta (voir article 11)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">8. Transferts internationaux</h2>
                {/* À VALIDER JURISTE : garanties de transfert UK (IDTA / Addendum UK / UK-US Data Bridge) */}
                <p>Plusieurs des prestataires ci-dessus sont établis aux États-Unis : certaines données sont donc traitées en dehors de l&apos;Espace Économique Européen et du Royaume-Uni. Ces transferts reposent sur le Data Privacy Framework UE-États-Unis (et son extension britannique) lorsque le prestataire est certifié, ou sur les Clauses Contractuelles Types de la Commission Européenne, complétées par l&apos;Addendum britannique pour les données issues du Royaume-Uni.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">9. Sécurité</h2>
                <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles : chiffrement des communications (HTTPS), authentification sécurisée, accès restreint aux données.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">10. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Droit d&apos;accès à vos données personnelles</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d&apos;opposition au traitement</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit de retirer votre consentement à tout moment</li>
                </ul>
                <p className="mt-3">Pour exercer ces droits, contactez-nous à : contact@unboared.com</p>
                <p className="mt-3">Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés) ou, au Royaume-Uni, de l&apos;ICO (Information Commissioner&apos;s Office).</p>
                {/* À VALIDER JURISTE : applicabilité CCPA/CPRA et lois des autres États US ; qualification du Meta Pixel en « sharing » */}
                <p className="mt-3"><strong className="text-text">Résidents des États-Unis.</strong> Selon votre État de résidence (par exemple la Californie), vous pouvez disposer du droit de savoir quelles informations personnelles nous collectons et pourquoi, d&apos;y accéder, de les faire corriger ou supprimer, et de vous opposer à leur « vente » ou à leur « partage » à des fins de publicité ciblée. Nous ne vendons pas d&apos;informations personnelles. Vous pouvez exercer ces droits par email à contact@unboared.com ; cela n&apos;aura aucune conséquence sur le traitement qui vous est réservé.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Cookies</h2>
                <p>Notre plateforme utilise des cookies techniques nécessaires au fonctionnement du Service (identification des joueurs, session de jeu). Ces cookies sont strictement nécessaires et ne requièrent pas de consentement.</p>
                <p className="mt-3">Nous utilisons également Firebase Analytics pour mesurer l&apos;utilisation du Service. Vous pouvez désactiver cette collecte via les paramètres de votre navigateur.</p>
                <p className="mt-3">Notre site (unboared.com) et notre console (console.unboared.com, y compris les pages que les joueurs ouvrent sur leur téléphone pour rejoindre une partie) utilisent le Pixel Meta, qui enregistre les visites de pages et les inscriptions afin de mesurer la performance de nos publicités sur les plateformes Meta (Facebook, Instagram). Vous pouvez limiter ce suivi via les paramètres de votre navigateur ou vos préférences publicitaires Meta.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">12. Modification de cette politique</h2>
                <p>Nous pouvons mettre à jour cette politique de confidentialité. Les modifications substantielles seront communiquées par email au moins 30 jours avant leur entrée en vigueur.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">13. Contact</h2>
                <p>Pour toute question relative à cette politique, contactez-nous à : contact@unboared.com</p>
              </div>
            </>
          )}
        </section>
      </article>
    </div>
  );
}
