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

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto prose-invert">
        <h1 className="text-4xl font-bold mb-2">Politique de Confidentialite</h1>
        <p className="text-text-dim text-sm mb-12">Derniere mise a jour : 31 mars 2026</p>

        <section className="space-y-8 text-text-muted leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-text mb-3">1. Introduction</h2>
            <p>La presente politique de confidentialite decrit comment Unboared (ci-apres &quot;nous&quot;, &quot;notre&quot;) collecte, utilise et protege les donnees personnelles dans le cadre de l&apos;utilisation de notre plateforme.</p>
            <p className="mt-3">Nous nous engageons a proteger la vie privee de nos utilisateurs et de leurs clients conformement au Reglement General sur la Protection des Donnees (RGPD).</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">2. Responsables du traitement</h2>
            <p>Unboared et l&apos;etablissement partenaire agissent en tant que responsables conjoints du traitement des donnees des joueurs. Unboared fournit la plateforme technique, l&apos;etablissement decide de l&apos;activation de la collecte de donnees.</p>
            <p className="mt-3"><strong className="text-text">Unboared</strong> - 9 rue Dareau, 75014 Paris, France<br />Email : contact@unboared.com</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">3. Donnees collectees</h2>
            <p><strong className="text-text">Pour les etablissements (abonnes) :</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom, prenom, adresse email professionnelle</li>
              <li>Nom de l&apos;etablissement</li>
              <li>Informations de facturation (gerees par Stripe)</li>
              <li>Donnees d&apos;utilisation (sessions, jeux joues, statistiques)</li>
            </ul>

            <p className="mt-4"><strong className="text-text">Pour les joueurs :</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Pseudo et avatar choisis</li>
              <li>Scores et historique de jeu</li>
              <li>Si active par l&apos;etablissement : adresse email, prenom, nom, telephone, age</li>
              <li>Donnees techniques : type de navigateur, type d&apos;appareil</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">4. Finalites du traitement</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Fourniture et amelioration du Service</li>
              <li>Gestion des abonnements et de la facturation</li>
              <li>Statistiques d&apos;utilisation pour les etablissements</li>
              <li>Communication par email (uniquement si consentement explicite)</li>
              <li>Gestion des classements et des recompenses</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">5. Base legale</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-text">Execution du contrat :</strong> fourniture du Service aux abonnes</li>
              <li><strong className="text-text">Interet legitime :</strong> amelioration du Service, statistiques anonymisees</li>
              <li><strong className="text-text">Consentement :</strong> collecte d&apos;emails des joueurs, communications marketing</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">6. Duree de conservation</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Donnees de compte : 3 ans apres la derniere activite</li>
              <li>Donnees de facturation : 10 ans (obligation legale)</li>
              <li>Donnees des joueurs : 12 mois apres la derniere session de jeu</li>
              <li>Logs techniques : 12 mois</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">7. Partage des donnees</h2>
            <p>Nous ne vendons jamais de donnees personnelles. Les donnees peuvent etre partagees avec :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-text">Stripe :</strong> traitement des paiements</li>
              <li><strong className="text-text">Firebase (Google) :</strong> hebergement et authentification</li>
              <li><strong className="text-text">L&apos;etablissement partenaire :</strong> donnees des joueurs collectees dans son etablissement</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">8. Transferts internationaux</h2>
            <p>Certaines donnees peuvent etre traitees en dehors de l&apos;Espace Economique Europeen (notamment via Firebase/Google). Ces transferts sont encadres par les Clauses Contractuelles Types de la Commission Europeenne.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">9. Securite</h2>
            <p>Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour proteger les donnees personnelles : chiffrement des communications (HTTPS), authentification securisee, acces restreint aux donnees.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">10. Vos droits</h2>
            <p>Conformement au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Droit d&apos;acces a vos donnees personnelles</li>
              <li>Droit de rectification</li>
              <li>Droit a l&apos;effacement (&quot;droit a l&apos;oubli&quot;)</li>
              <li>Droit a la portabilite des donnees</li>
              <li>Droit d&apos;opposition au traitement</li>
              <li>Droit a la limitation du traitement</li>
              <li>Droit de retirer votre consentement a tout moment</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits, contactez-nous a : contact@unboared.com</p>
            <p className="mt-3">Vous pouvez egalement introduire une reclamation aupres de la CNIL (Commission Nationale de l&apos;Informatique et des Libertes).</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">11. Cookies</h2>
            <p>Notre plateforme utilise des cookies techniques necessaires au fonctionnement du Service (identification des joueurs, session de jeu). Ces cookies sont strictement necessaires et ne requierent pas de consentement.</p>
            <p className="mt-3">Nous utilisons egalement Firebase Analytics pour mesurer l&apos;utilisation du Service. Vous pouvez desactiver cette collecte via les parametres de votre navigateur.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">12. Modification de cette politique</h2>
            <p>Nous pouvons mettre a jour cette politique de confidentialite. Les modifications substantielles seront communiquees par email au moins 30 jours avant leur entree en vigueur.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">13. Contact</h2>
            <p>Pour toute question relative a cette politique, contactez-nous a : contact@unboared.com</p>
          </div>
        </section>
      </article>
    </div>
  );
}
