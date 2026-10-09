/**
 * Politique de confidentialité : décrit ce que le site fait réellement (site statique, sans compte, sans cookie,
 * sans mesure d'audience). À relire à chaque ajout d'un service tiers ou d'un nouveau stockage.
 */
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, Lock, Mail, Calendar, Globe } from "lucide-react";
import { LEGAL_UPDATED, PLATFORM_LEGAL_URL, SITE_NAME } from "@/config/site";
import { CONTACT_EMAIL } from "@/config/contact";

const PrivacyPolicy = () => {
  return (
    <Layout>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-xl text-gray-600">
            Ce site ne vous suit pas et ne vous demande aucune donnée
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : {LEGAL_UPDATED}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                En résumé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {SITE_NAME} est un projet personnel et éducatif de Geoffroy Streit. C'est un site statique :
                il n'a ni compte utilisateur, ni base de données, ni publicité, ni outil de mesure d'audience,
                et il ne dépose aucun cookie. Vos données d'apprentissage restent dans votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Ce qui est enregistré dans votre navigateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Pour fonctionner, le site utilise le stockage local de votre navigateur (localStorage) :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>votre progression dans les cours, vos notes et vos projets commencés ou terminés</li>
                  <li>vos tentatives de quiz, vos scores et votre historique</li>
                  <li>le code de l'éditeur (sauvegarde automatique) et vos défis de programmation</li>
                  <li>vos articles de blog favoris et vos préférences (thème, onglets, installation de l'application)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Ces informations <strong>ne sont jamais transmises</strong> : elles ne quittent pas votre appareil
                  et personne d'autre ne peut les lire. Vous les effacez à tout moment avec les réglages de votre
                  navigateur (effacer les données du site). Elles sont propres à chaque navigateur : changer d'appareil
                  ou effacer les données du site les supprime.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Le site utilise aussi le stockage de session (sessionStorage), qui est vidé à la fermeture de
                  l'onglet : il garde votre position de lecture pour la retrouver en revenant sur une page, et le nombre
                  de fiches du glossaire déjà affichées. Ces informations ne quittent pas non plus votre appareil.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Le site peut aussi être installé comme une application : un cache (service worker) garde alors une
                  copie des pages et des moteurs Python et SQL pour fonctionner sans connexion.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Le code que vous exécutez
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                L'éditeur exécute Python et SQL (WebAssembly) et JavaScript (zone isolée, sans accès au réseau ni aux données
                du site) directement dans votre navigateur. Le site n'envoie à aucun serveur le code que vous écrivez ni ses résultats.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Serveur et services tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Comme tout serveur web, celui de la plateforme hylst.fr qui héberge ce site enregistre des journaux
                  techniques (adresse IP, date, page demandée, navigateur) pour la sécurité et le bon fonctionnement.
                  L'éditeur et l'hébergeur sont indiqués dans les{" "}
                  <a href={PLATFORM_LEGAL_URL} className="text-blue-600 hover:underline">mentions légales de la plateforme</a>.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Les pages ne chargent ni police, ni script, ni image, ni statistiques depuis un service tiers.
                  Les liens vers des sites externes (ressources, forums, vidéos, actualités) ouvrent ces sites, qui ont
                  leur propre politique de confidentialité. La page Communauté affiche un instantané daté d'articles :
                  aucune requête n'est faite vers ces sites tant que vous ne cliquez pas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Me contacter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Le formulaire de contact ne transmet rien : il prépare un e-mail dans votre messagerie, que vous
                envoyez ou non. Si vous m'écrivez à {CONTACT_EMAIL}, votre adresse et votre message me parviennent par
                e-mail ; je les utilise uniquement pour vous répondre et ne les transmets à personne.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vos droits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Le site ne détient aucune donnée vous concernant : tout ce qu'il enregistre est sur votre appareil,
                sous votre contrôle. Pour un e-mail que vous m'avez envoyé ou pour les journaux du serveur, vous
                disposez au titre du RGPD des droits d'accès, de rectification, d'effacement, de limitation, de
                portabilité et d'opposition : écrivez à {CONTACT_EMAIL}. Vous pouvez aussi saisir la CNIL (cnil.fr).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications de cette politique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Cette page est mise à jour quand le fonctionnement du site change (nouveau stockage, nouveau service
                tiers). La date en haut de page indique la dernière révision.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
