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
          {isEn ? "Last updated: March 31, 2026" : "Dernière mise à jour : 31 mars 2026"}
        </p>

        <section className="space-y-8 text-text-muted leading-relaxed">
          {isEn ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-text mb-3">1. Introduction</h2>
                <p>This privacy policy describes how Unboared (&quot;we&quot;, &quot;our&quot;) collects, uses and protects personal data when you use our platform.</p>
                <p className="mt-3">We are committed to protecting the privacy of our users and their customers in accordance with the General Data Protection Regulation (GDPR).</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">2. Data controllers</h2>
                <p>Unboared and the partner venue act as joint data controllers for player data. Unboared provides the technical platform; the venue decides whether to enable data collection.</p>
                <p className="mt-3"><strong className="text-text">Unboared</strong> — 9 rue Dareau, 75014 Paris, France<br />Email: contact@unboared.com</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Data collected</h2>
                <p><strong className="text-text">For venues (subscribers):</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>First name, last name, professional email address</li>
                  <li>Venue name</li>
                  <li>Billing information (managed by Stripe)</li>
                  <li>Usage data (sessions, games played, statistics)</li>
                </ul>

                <p className="mt-4"><strong className="text-text">For players:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Chosen username and avatar</li>
                  <li>Scores and game history</li>
                  <li>If enabled by the venue: email address, first name, last name, phone number, age</li>
                  <li>Technical data: browser type, device type</li>
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
                <h2 className="text-xl font-semibold text-text mb-3">7. Data sharing</h2>
                <p>We never sell personal data. Data may be shared with:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong className="text-text">Stripe:</strong> payment processing</li>
                  <li><strong className="text-text">Firebase (Google):</strong> hosting and authentication</li>
                  <li><strong className="text-text">The partner venue:</strong> player data collected on their premises</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">8. International transfers</h2>
                <p>Some data may be processed outside the European Economic Area (notably via Firebase/Google). These transfers are governed by the European Commission&apos;s Standard Contractual Clauses.</p>
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
                <p className="mt-3">You also have the right to lodge a complaint with your local data protection authority (in the UK: the ICO — Information Commissioner&apos;s Office).</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Cookies</h2>
                <p>Our platform uses technical cookies necessary for the Service to function (player identification, game session). These cookies are strictly necessary and do not require consent.</p>
                <p className="mt-3">We also use Firebase Analytics to measure Service usage. You can disable this collection via your browser settings.</p>
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
                <p className="mt-3">Nous nous engageons à protéger la vie privée de nos utilisateurs et de leurs clients conformément au Règlement Général sur la Protection des Données (RGPD).</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">2. Responsables du traitement</h2>
                <p>Unboared et l&apos;établissement partenaire agissent en tant que responsables conjoints du traitement des données des joueurs. Unboared fournit la plateforme technique, l&apos;établissement décide de l&apos;activation de la collecte de données.</p>
                <p className="mt-3"><strong className="text-text">Unboared</strong> — 9 rue Dareau, 75014 Paris, France<br />Email : contact@unboared.com</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Données collectées</h2>
                <p><strong className="text-text">Pour les établissements (abonnés) :</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nom, prénom, adresse email professionnelle</li>
                  <li>Nom de l&apos;établissement</li>
                  <li>Informations de facturation (gérées par Stripe)</li>
                  <li>Données d&apos;utilisation (sessions, jeux joués, statistiques)</li>
                </ul>

                <p className="mt-4"><strong className="text-text">Pour les joueurs :</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Pseudo et avatar choisis</li>
                  <li>Scores et historique de jeu</li>
                  <li>Si activé par l&apos;établissement : adresse email, prénom, nom, téléphone, âge</li>
                  <li>Données techniques : type de navigateur, type d&apos;appareil</li>
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
                <h2 className="text-xl font-semibold text-text mb-3">7. Partage des données</h2>
                <p>Nous ne vendons jamais de données personnelles. Les données peuvent être partagées avec :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong className="text-text">Stripe :</strong> traitement des paiements</li>
                  <li><strong className="text-text">Firebase (Google) :</strong> hébergement et authentification</li>
                  <li><strong className="text-text">L&apos;établissement partenaire :</strong> données des joueurs collectées dans son établissement</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">8. Transferts internationaux</h2>
                <p>Certaines données peuvent être traitées en dehors de l&apos;Espace Économique Européen (notamment via Firebase/Google). Ces transferts sont encadrés par les Clauses Contractuelles Types de la Commission Européenne.</p>
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
                <p className="mt-3">Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés).</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Cookies</h2>
                <p>Notre plateforme utilise des cookies techniques nécessaires au fonctionnement du Service (identification des joueurs, session de jeu). Ces cookies sont strictement nécessaires et ne requièrent pas de consentement.</p>
                <p className="mt-3">Nous utilisons également Firebase Analytics pour mesurer l&apos;utilisation du Service. Vous pouvez désactiver cette collecte via les paramètres de votre navigateur.</p>
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
