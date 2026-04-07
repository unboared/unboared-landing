import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.terms" });
  return { title: t("title"), description: t("description") };
}

export default async function TermsPage({
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
          {isEn ? "Terms of Use" : "Conditions Générales d'Utilisation"}
        </h1>
        <p className="text-text-dim text-sm mb-12">
          {isEn ? "Last updated: March 31, 2026" : "Dernière mise à jour : 31 mars 2026"}
        </p>

        <section className="space-y-8 text-text-muted leading-relaxed">
          {isEn ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-text mb-3">1. Purpose</h2>
                <p>These Terms of Use (&quot;Terms&quot;) define the terms and conditions of use of the Unboared platform (&quot;the Service&quot;), accessible at console.unboared.com, as well as the rights and obligations of the parties.</p>
                <p className="mt-3">The Service is published by Unboared, registered at 9 rue Dareau, 75014 Paris, France.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">2. Acceptance of Terms</h2>
                <p>Registering for the Service implies full and unconditional acceptance of these Terms. If you disagree with any clause, you are invited not to use the Service.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Service description</h2>
                <p>Unboared is a SaaS platform enabling venues open to the public (bars, restaurants, campsites, etc.) to offer interactive multiplayer games to their customers. The Service includes:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>A catalogue of interactive games accessible via web browser</li>
                  <li>A QR code connection system for players</li>
                  <li>A statistics dashboard</li>
                  <li>Game customisation features</li>
                  <li>An optional player email collection module</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">4. Registration and account</h2>
                <p>Registration is open to any legal or natural person acting in a professional capacity. You agree to provide accurate information and keep it up to date.</p>
                <p className="mt-3">Each account is personal and you are responsible for the confidentiality of your login credentials.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">5. Subscription and pricing</h2>
                <p>The Service is offered as a monthly subscription at €49 incl. VAT per month per venue, with no minimum commitment.</p>
                <p className="mt-3">A free 14-day trial is offered to every new registrant. No credit card is required for the free trial.</p>
                <p className="mt-3">You may cancel your subscription at any time from your account or by emailing contact@unboared.com. Cancellation takes effect at the end of the current billing period.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">6. Intellectual property</h2>
                <p>All elements of the Service (software, games, graphics, text, sounds, trademarks) are the exclusive property of Unboared and are protected by intellectual property laws.</p>
                <p className="mt-3">You are granted a non-exclusive, non-transferable right to use the Service within the scope of your subscription.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">7. User obligations</h2>
                <p>You agree to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Use the Service in accordance with its intended purpose</li>
                  <li>Not attempt to circumvent security measures</li>
                  <li>Respect intellectual property rights</li>
                  <li>Inform players of any personal data collection</li>
                  <li>Hold the necessary licences for music broadcasting (e.g. PRS for Music in the UK) when using the Unblind Test game</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">8. Liability</h2>
                <p>Unboared endeavours to ensure Service availability but cannot be held liable for temporary interruptions due to maintenance or force majeure.</p>
                <p className="mt-3">You are solely responsible for how you use the Service at your venue.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">9. Personal data</h2>
                <p>The processing of personal data is governed by our Privacy Policy, accessible from our website.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">10. Changes to these Terms</h2>
                <p>Unboared reserves the right to modify these Terms at any time. Users will be notified by email of any significant change at least 30 days before it takes effect.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Governing law and jurisdiction</h2>
                <p>These Terms are governed by French law. In the event of a dispute, and after an attempt at amicable resolution, jurisdiction is assigned to the courts of Paris, France.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">12. Contact</h2>
                <p>For any questions regarding these Terms, contact us at: contact@unboared.com</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-text mb-3">1. Objet</h2>
                <p>Les présentes Conditions Générales d&apos;Utilisation (ci-après &quot;CGU&quot;) ont pour objet de définir les modalités et conditions d&apos;utilisation de la plateforme Unboared (ci-après &quot;le Service&quot;), accessible à l&apos;adresse console.unboared.com, ainsi que les droits et obligations des parties dans ce cadre.</p>
                <p className="mt-3">Le Service est édité par la société Unboared, dont le siège social est situé au 9 rue Dareau, 75014 Paris, France.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">2. Acceptation des CGU</h2>
                <p>L&apos;inscription au Service implique l&apos;acceptation pleine et entière des présentes CGU. En cas de désaccord avec l&apos;une des clauses, l&apos;Utilisateur est invité à ne pas utiliser le Service.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Description du Service</h2>
                <p>Unboared est une plateforme SaaS permettant aux établissements recevant du public (bars, restaurants, campings, etc.) de proposer des jeux interactifs multijoueurs à leurs clients. Le Service comprend :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Un catalogue de jeux interactifs accessibles via navigateur web</li>
                  <li>Un système de connexion par QR code pour les joueurs</li>
                  <li>Un tableau de bord de suivi des statistiques</li>
                  <li>Des fonctionnalités de personnalisation des jeux</li>
                  <li>Un module optionnel de collecte d&apos;emails des joueurs</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">4. Inscription et compte</h2>
                <p>L&apos;inscription au Service est ouverte à toute personne morale ou physique agissant à titre professionnel. L&apos;Utilisateur s&apos;engage à fournir des informations exactes et à les maintenir à jour.</p>
                <p className="mt-3">Chaque compte est personnel et l&apos;Utilisateur est responsable de la confidentialité de ses identifiants de connexion.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">5. Abonnement et tarification</h2>
                <p>Le Service est proposé sous forme d&apos;abonnement mensuel au tarif de 49 euros TTC par mois et par établissement, sans engagement de durée.</p>
                <p className="mt-3">Une période d&apos;essai gratuite de 14 jours est offerte à chaque nouvel inscrit. Aucune carte bancaire n&apos;est requise pour l&apos;essai gratuit.</p>
                <p className="mt-3">L&apos;Utilisateur peut résilier son abonnement à tout moment depuis son espace client ou par email à contact@unboared.com. La résiliation prend effet à la fin de la période de facturation en cours.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">6. Propriété intellectuelle</h2>
                <p>L&apos;ensemble des éléments composant le Service (logiciels, jeux, graphismes, textes, sons, marques) sont la propriété exclusive d&apos;Unboared et sont protégés par les lois relatives à la propriété intellectuelle.</p>
                <p className="mt-3">L&apos;Utilisateur bénéficie d&apos;un droit d&apos;utilisation non exclusif et non cessible du Service dans le cadre de son abonnement.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">7. Obligations de l&apos;Utilisateur</h2>
                <p>L&apos;Utilisateur s&apos;engage à :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Utiliser le Service conformément à sa destination</li>
                  <li>Ne pas tenter de contourner les mesures de sécurité</li>
                  <li>Respecter les droits de propriété intellectuelle</li>
                  <li>Informer les joueurs de la collecte éventuelle de données personnelles</li>
                  <li>Disposer des licences nécessaires pour la diffusion musicale (SACEM) lors de l&apos;utilisation du jeu Unblind Test</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">8. Responsabilité</h2>
                <p>Unboared s&apos;efforce d&apos;assurer la disponibilité du Service mais ne saurait être tenue responsable des interruptions temporaires liées à la maintenance ou à des circonstances de force majeure.</p>
                <p className="mt-3">L&apos;Utilisateur est seul responsable de l&apos;utilisation qu&apos;il fait du Service dans son établissement.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">9. Données personnelles</h2>
                <p>Le traitement des données personnelles est régi par notre Politique de Confidentialité, accessible depuis notre site.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">10. Modification des CGU</h2>
                <p>Unboared se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront informés par email de toute modification substantielle au moins 30 jours avant son entrée en vigueur.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Droit applicable et juridiction</h2>
                <p>Les présentes CGU sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, compétence est attribuée aux tribunaux de Paris.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">12. Contact</h2>
                <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l&apos;adresse : contact@unboared.com</p>
              </div>
            </>
          )}
        </section>
      </article>
    </div>
  );
}
