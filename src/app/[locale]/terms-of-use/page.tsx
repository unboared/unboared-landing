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
          {isEn ? "Last updated: September 21, 2026" : "Dernière mise à jour : 21 septembre 2026"}
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
                <p>Registering for the Service, starting a free trial or subscribing implies full and unconditional acceptance of these Terms. If you disagree with any clause, you are invited not to use the Service.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Service description</h2>
                <p>Unboared is a SaaS platform enabling venues open to the public (bars, restaurants, campsites, etc.) and the professionals who host events in them (DJs, quiz hosts, entertainers, event companies) to offer interactive multiplayer games to their audience. The Service includes:</p>
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
                <p className="mt-3">A subscription is attached to an account, not to a physical venue. A professional host (DJ, quiz host, entertainer, event company) may use a single subscription at every venue where they personally run games. A venue that subscribes on its own behalf needs one subscription per venue it operates.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">5. Subscription and pricing</h2>
                <p>The Service is offered as a monthly subscription per account (see section 4), with no minimum commitment. The price depends on the billing currency: €49 per month incl. VAT in the euro zone, £45 per month in the United Kingdom and US$59 per month in the United States. The exact amount, in your currency, is displayed on the payment page before you confirm.</p>
                <p className="mt-3">A free 14-day trial is offered to every new registrant. A payment method is required to start the trial. You will not be charged if you cancel before the end of the 14 days.</p>
                {/* À VALIDER JURISTE : information renouvellement automatique (lois US, dont Californie) */}
                <p className="mt-3"><strong className="text-text">Automatic renewal.</strong> Unless you cancel before the end of the trial, it automatically converts into a paid monthly subscription: your payment method is charged the monthly price when the trial ends, then every month on the same day, until you cancel. We email you a reminder with the amount and a cancellation link about 7 days before the end of your trial.</p>
                <p className="mt-3">You may cancel at any time, online and without contacting us, from the billing portal accessible from your account, or by emailing contact@unboared.com. Cancellation takes effect at the end of the current billing period: you keep access until then and will not be charged again.</p>
                {/* À VALIDER JURISTE : clause de remboursement */}
                <p className="mt-3"><strong className="text-text">Refunds.</strong> Amounts already paid for a started billing period are not refunded, in whole or in part, except where required by applicable law or in the event of a prolonged unavailability of the Service attributable to Unboared.</p>
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
                  <li>Ensure that the necessary licences for public music performance are held, by yourself or by the venue (e.g. SACEM in France, PPL PRS in the UK, ASCAP, BMI or SESAC in the US), when using the Unblind Test game</li>
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
                <p className="mt-3">The version dated September 21, 2026 applies immediately to accounts created from that date. For accounts created earlier, it takes effect 30 days after we notify you by email.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Governing law and jurisdiction</h2>
                {/* À VALIDER JURISTE : droit applicable / juridiction pour clients UK & US */}
                <p>These Terms are governed by French law. In the event of a dispute, and after an attempt at amicable resolution, jurisdiction is assigned to the courts of Paris, France.</p>
                <p className="mt-3">Nothing in these Terms deprives you of the protection of mandatory provisions of the law of your country or state of residence that cannot be excluded by contract.</p>
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
                <p>L&apos;inscription au Service, le démarrage d&apos;un essai gratuit ou la souscription d&apos;un abonnement impliquent l&apos;acceptation pleine et entière des présentes CGU. En cas de désaccord avec l&apos;une des clauses, l&apos;Utilisateur est invité à ne pas utiliser le Service.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">3. Description du Service</h2>
                <p>Unboared est une plateforme SaaS permettant aux établissements recevant du public (bars, restaurants, campings, etc.) et aux professionnels qui y animent des soirées (DJ, animateurs, quiz masters, prestataires événementiels) de proposer des jeux interactifs multijoueurs à leur public. Le Service comprend :</p>
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
                <p className="mt-3">L&apos;abonnement est attaché à un compte et non à un lieu physique. Un animateur professionnel (DJ, animateur, quiz master, prestataire événementiel) peut utiliser un seul abonnement dans tous les établissements où il anime lui-même les jeux. Un établissement qui s&apos;abonne pour son propre compte souscrit un abonnement par établissement exploité.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">5. Abonnement et tarification</h2>
                <p>Le Service est proposé sous forme d&apos;abonnement mensuel par compte (voir article 4), sans engagement de durée. Le tarif dépend de la devise de facturation : 49 euros TTC par mois en zone euro, 45 livres sterling par mois au Royaume-Uni et 59 dollars américains par mois aux États-Unis. Le montant exact, dans votre devise, est affiché sur la page de paiement avant validation.</p>
                <p className="mt-3">Une période d&apos;essai gratuite de 14 jours est offerte à chaque nouvel inscrit. Un moyen de paiement est requis pour démarrer l&apos;essai. Aucun prélèvement n&apos;a lieu si l&apos;Utilisateur résilie avant la fin des 14 jours.</p>
                {/* À VALIDER JURISTE : information renouvellement automatique (lois US, dont Californie) */}
                <p className="mt-3"><strong className="text-text">Reconduction automatique.</strong> Sauf résiliation avant la fin de l&apos;essai, celui-ci se transforme automatiquement en abonnement mensuel payant : le moyen de paiement est débité du tarif mensuel à la fin de l&apos;essai, puis chaque mois à la même date, jusqu&apos;à résiliation. Un email de rappel indiquant le montant et un lien de résiliation est envoyé environ 7 jours avant la fin de l&apos;essai.</p>
                <p className="mt-3">L&apos;Utilisateur peut résilier à tout moment, en ligne et sans avoir à nous contacter, depuis le portail de facturation accessible depuis son espace client, ou par email à contact@unboared.com. La résiliation prend effet à la fin de la période de facturation en cours : l&apos;accès est conservé jusqu&apos;à cette date et aucun nouveau prélèvement n&apos;a lieu.</p>
                {/* À VALIDER JURISTE : clause de remboursement */}
                <p className="mt-3"><strong className="text-text">Remboursement.</strong> Les sommes versées pour une période de facturation commencée ne sont pas remboursées, en tout ou partie, sauf disposition légale contraire ou indisponibilité prolongée du Service imputable à Unboared.</p>
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
                  <li>S&apos;assurer que les autorisations nécessaires à la diffusion publique de musique sont détenues, par lui-même ou par l&apos;établissement (SACEM en France, PPL PRS au Royaume-Uni, ASCAP, BMI ou SESAC aux États-Unis), lors de l&apos;utilisation du jeu Unblind Test</li>
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
                <p className="mt-3">La version du 21 septembre 2026 s&apos;applique immédiatement aux comptes créés à partir de cette date. Pour les comptes créés avant, elle entre en vigueur 30 jours après la notification par email.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-text mb-3">11. Droit applicable et juridiction</h2>
                {/* À VALIDER JURISTE : droit applicable / juridiction pour clients UK & US */}
                <p>Les présentes CGU sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, compétence est attribuée aux tribunaux de Paris.</p>
                <p className="mt-3">Aucune stipulation des présentes CGU ne prive l&apos;Utilisateur de la protection que lui accordent les dispositions impératives de la loi de son pays ou État de résidence auxquelles il ne peut être dérogé par contrat.</p>
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
