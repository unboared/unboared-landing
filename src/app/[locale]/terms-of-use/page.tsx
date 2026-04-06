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

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto prose-invert">
        <h1 className="text-4xl font-bold mb-2">Conditions Generales d&apos;Utilisation</h1>
        <p className="text-text-dim text-sm mb-12">Derniere mise a jour : 31 mars 2026</p>

        <section className="space-y-8 text-text-muted leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-text mb-3">1. Objet</h2>
            <p>Les presentes Conditions Generales d&apos;Utilisation (ci-apres &quot;CGU&quot;) ont pour objet de definir les modalites et conditions d&apos;utilisation de la plateforme Unboared (ci-apres &quot;le Service&quot;), accessible a l&apos;adresse console.unboared.com, ainsi que les droits et obligations des parties dans ce cadre.</p>
            <p className="mt-3">Le Service est edite par la societe Unboared, dont le siege social est situe au 9 rue Dareau, 75014 Paris, France.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">2. Acceptation des CGU</h2>
            <p>L&apos;inscription au Service implique l&apos;acceptation pleine et entiere des presentes CGU. En cas de desaccord avec l&apos;une des clauses, l&apos;Utilisateur est invite a ne pas utiliser le Service.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">3. Description du Service</h2>
            <p>Unboared est une plateforme SaaS permettant aux etablissements recevant du public (bars, restaurants, campings, etc.) de proposer des jeux interactifs multijoueurs a leurs clients. Le Service comprend :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Un catalogue de jeux interactifs accessibles via navigateur web</li>
              <li>Un systeme de connexion par QR code pour les joueurs</li>
              <li>Un tableau de bord de suivi des statistiques</li>
              <li>Des fonctionnalites de personnalisation des jeux</li>
              <li>Un module optionnel de collecte d&apos;emails des joueurs</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">4. Inscription et compte</h2>
            <p>L&apos;inscription au Service est ouverte a toute personne morale ou physique agissant a titre professionnel. L&apos;Utilisateur s&apos;engage a fournir des informations exactes et a les maintenir a jour.</p>
            <p className="mt-3">Chaque compte est personnel et l&apos;Utilisateur est responsable de la confidentialite de ses identifiants de connexion.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">5. Abonnement et tarification</h2>
            <p>Le Service est propose sous forme d&apos;abonnement mensuel au tarif de 49 euros TTC par mois et par etablissement, sans engagement de duree.</p>
            <p className="mt-3">Une periode d&apos;essai gratuite de 14 jours est offerte a chaque nouvel inscrit. Aucune carte bancaire n&apos;est requise pour l&apos;essai gratuit.</p>
            <p className="mt-3">L&apos;Utilisateur peut resilier son abonnement a tout moment depuis son espace client ou par email a contact@unboared.com. La resiliation prend effet a la fin de la periode de facturation en cours.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">6. Propriete intellectuelle</h2>
            <p>L&apos;ensemble des elements composant le Service (logiciels, jeux, graphismes, textes, sons, marques) sont la propriete exclusive d&apos;Unboared et sont proteges par les lois relatives a la propriete intellectuelle.</p>
            <p className="mt-3">L&apos;Utilisateur beneficie d&apos;un droit d&apos;utilisation non exclusif et non cessible du Service dans le cadre de son abonnement.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">7. Obligations de l&apos;Utilisateur</h2>
            <p>L&apos;Utilisateur s&apos;engage a :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Utiliser le Service conformement a sa destination</li>
              <li>Ne pas tenter de contourner les mesures de securite</li>
              <li>Respecter les droits de propriete intellectuelle</li>
              <li>Informer les joueurs de la collecte eventuelle de donnees personnelles</li>
              <li>Disposer des licences necessaires pour la diffusion musicale (SACEM) lors de l&apos;utilisation du jeu Unblind Test</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">8. Responsabilite</h2>
            <p>Unboared s&apos;efforce d&apos;assurer la disponibilite du Service mais ne saurait etre tenue responsable des interruptions temporaires liees a la maintenance ou a des circonstances de force majeure.</p>
            <p className="mt-3">L&apos;Utilisateur est seul responsable de l&apos;utilisation qu&apos;il fait du Service dans son etablissement.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">9. Donnees personnelles</h2>
            <p>Le traitement des donnees personnelles est regi par notre Politique de Confidentialite, accessible depuis notre site.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">10. Modification des CGU</h2>
            <p>Unboared se reserve le droit de modifier les presentes CGU a tout moment. Les Utilisateurs seront informes par email de toute modification substantielle au moins 30 jours avant son entree en vigueur.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">11. Droit applicable et juridiction</h2>
            <p>Les presentes CGU sont soumises au droit francais. En cas de litige, et apres tentative de resolution amiable, competence est attribuee aux tribunaux de Paris.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-3">12. Contact</h2>
            <p>Pour toute question relative aux presentes CGU, vous pouvez nous contacter a l&apos;adresse : contact@unboared.com</p>
          </div>
        </section>
      </article>
    </div>
  );
}
