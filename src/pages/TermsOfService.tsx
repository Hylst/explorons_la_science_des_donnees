/**
 * Conditions d'utilisation. La partie propriété intellectuelle suit la licence du projet (LICENSE, AGPL-3.0-or-later) :
 * ne pas y réintroduire de restriction de réutilisation qui la contredirait.
 */
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, Scale, BookOpen, Shield } from "lucide-react";
import {
  AUTHOR_CREDIT,
  LEGAL_UPDATED,
  LICENSE_FILE,
  LICENSE_NAME,
  LICENSE_SPDX,
  NOTICE_FILE,
  PLATFORM_LEGAL_URL,
  SITE_NAME,
  SOURCE_URL,
} from "@/config/site";
import { asset } from "@/lib/asset";

const TermsOfService = () => {
  return (
    <Layout>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <FileText className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conditions d'utilisation
          </h1>
          <p className="text-xl text-gray-600">
            Règles d'usage de {SITE_NAME}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : {LEGAL_UPDATED}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Présentation du service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {SITE_NAME} est un site web éducatif personnel créé par Geoffroy Streit, dédié à l'apprentissage et
                au partage de connaissances en science des données. Il propose gratuitement, sans compte, des cours,
                des quiz, un glossaire, des ressources et un éditeur de code exécuté dans votre navigateur.
                L'éditeur et l'hébergeur du site sont indiqués dans les{" "}
                <a href={PLATFORM_LEGAL_URL} className="text-blue-600 hover:underline">mentions légales de la plateforme hylst.fr</a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Acceptation des conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                En utilisant ce site, vous acceptez ces conditions. Si elles ne vous conviennent pas, n'utilisez pas le
                site. Elles peuvent évoluer : la date en haut de page indique la dernière révision.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Propriété intellectuelle et licence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Le code source et les contenus rédigés pour ce site (textes, exercices, données d'exemple,
                  illustrations) sont la propriété de Geoffroy Streit et publiés sous licence{" "}
                  <strong>{LICENSE_NAME}</strong> ({LICENSE_SPDX}). Le texte complet est dans le{" "}
                  <a href={asset(LICENSE_FILE)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    fichier de licence
                  </a>{" "}
                  et seul ce texte fait foi.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  En résumé, cette licence permet de copier, modifier et redistribuer le site, y compris à titre
                  commercial, à condition de conserver les mentions de l'auteur, de publier les modifications sous la
                  même licence et de proposer leur code source aux utilisateurs d'une version modifiée accessible en
                  ligne. La consultation, l'apprentissage personnel, le partage de liens et la citation avec
                  mention de la source sont libres.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Sont exclus de cette licence : les logos et noms de marques
                  cités (propriété de leurs détenteurs) et les composants tiers embarqués, qui gardent leur propre
                  licence, notamment les moteurs Python et SQL (Pyodide, NumPy, pandas, scikit-learn, SQLite), dont la
                  liste figure dans{" "}
                  <a href={asset(NOTICE_FILE)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    cet inventaire
                  </a>.
                  Le site a été réalisé par {AUTHOR_CREDIT}.
                  {SOURCE_URL ? (
                    <>
                      {" "}Code source :{" "}
                      <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{SOURCE_URL}</a>.
                    </>
                  ) : (
                    " Le dépôt du code source n'est pas public à ce jour."
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Utilisation responsable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  En utilisant ce site, vous vous engagez à :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>l'utiliser de manière légale et éthique</li>
                  <li>ne pas tenter d'en compromettre la sécurité</li>
                  <li>ne pas le surcharger par des requêtes automatisées excessives</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Le code que vous saisissez dans l'éditeur s'exécute sur votre appareil, sous votre responsabilité :
                  n'y collez pas de code dont vous ne comprenez pas l'effet.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Limitation de responsabilité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contenu éducatif :</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le contenu est fourni à des fins éducatives. Malgré le soin apporté, nous ne garantissons pas son
                    exactitude, sa complétude ni son actualité ; il ne remplace pas un avis professionnel (juridique,
                    financier, médical). Les données des exemples de code et des visualisations sont des jeux d'exemple générés.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Utilisation des informations :</h3>
                  <p className="text-gray-700 leading-relaxed">
                    L'utilisation des informations de ce site se fait à vos propres risques. Comme le prévoit la
                    licence, le logiciel est fourni sans garantie, et l'auteur ne saurait être tenu responsable des
                    dommages résultant de son utilisation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Disponibilité du service :</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le site est un service gratuit, sans engagement de disponibilité : il peut être indisponible
                    pour maintenance ou pour des raisons techniques, ou être modifié ou arrêté.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liens externes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Ce site contient des liens vers des sites externes. Nous ne sommes pas responsables de leur contenu,
                de leurs politiques de confidentialité ni de leurs pratiques. L'inclusion d'un lien ne constitue pas
                une approbation, et les prix ou offres mentionnés peuvent avoir changé : vérifiez-les sur le site
                concerné.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Droit applicable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Ces conditions sont régies par le droit français. Tout litige relatif à l'utilisation de ce site
                relève des tribunaux français compétents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Pour toute question sur ces conditions, utilisez la page de contact du site.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
