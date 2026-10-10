/**
 * Page « À propos » : présente le projet et son créateur Geoffroy Streit
 */
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Heart, Users, Target, Lightbulb, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { asset } from "@/lib/asset";
import { AUTHOR_CREDIT, LICENSE_FILE, LICENSE_NAME, LICENSE_SPDX, NOTICE_FILE, SITE_NAME } from "@/config/site";

const About = () => {
  return (
    <Layout>
      
      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            À propos de {SITE_NAME}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un projet personnel et éducatif pour apprendre la data science en français,
            créé par un apprenant pour d'autres apprenants.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Rendre la data science accessible à tous les francophones, 
                en proposant un contenu structuré et progressif adapté aux débutants.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Philosophie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Apprendre en enseignant. Ce site me permet de structurer mes connaissances 
                tout en les partageant gratuitement avec la communauté.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Public visé</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Étudiants, personnes en reconversion, curieux : un espace d'apprentissage bienveillant 
                où chacun peut progresser à son rythme en data science.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Creator Section */}
        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Le créateur</h2>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Geoffroy Streit</h3>
                <p className="text-muted-foreground mb-4">
                  Ancien ingénieur en sciences de l'industrie, concepteur-développeur d'applications,
                  j'ai aussi plus de 20 ans d'expérience en commerce et en gestion. Je me forme en autodidacte
                  à la data science, à l'IA, au machine learning et à Python depuis plus de deux ans.
                </p>
                <p className="text-muted-foreground mb-4">
                  Ce site réunit les informations libres et les connaissances que j'ai accumulées pendant
                  mon apprentissage, ainsi que des enrichissements proposés par des IA, que j'ai relus et qui
                  m'ont paru tout à fait cohérents. Réuni ici de manière structurée, l'ensemble me permet de
                  consolider mes connaissances tout en créant une ressource pour la communauté francophone. Je ne suis pas data scientist de métier : les cours sont des notes de
                  formation, à recouper avec les sources citées. Écrivez-moi pour signaler une erreur.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Autodidacte en data science</Badge>
                  <Badge variant="secondary">Concepteur-développeur</Badge>
                  <Badge variant="secondary">Ingénieur, commerce et gestion</Badge>
                  <Badge variant="secondary">Pédagogie</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Motivation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      «&nbsp;Enseigner, c'est apprendre deux fois. En créant ce contenu,
                      je renforce ma propre compréhension tout en aidant d'autres apprenants.&nbsp;»
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Contenu éducatif</CardTitle>
              <CardDescription>
                Une approche structurée de l'apprentissage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Cours progressifs, avec quiz</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Éditeur de code : Python, SQL et JavaScript exécutés dans le navigateur</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Visualisations interactives</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Glossaire technique et sélection de ressources</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Technologies</CardTitle>
              <CardDescription>
                Un site 100 % statique : sans compte, sans serveur applicatif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">React 18 avec TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Tailwind CSS pour le design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Vite pour le développement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Pyodide et SQLite (WebAssembly) pour exécuter Python et SQL</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Les valeurs du site</h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Accessibilité</h3>
              <p className="text-sm text-muted-foreground">
                Contenu gratuit et ouvert à tous, sans barrière financière
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Bienveillance</h3>
              <p className="text-sm text-muted-foreground">
                Un environnement d'apprentissage respectueux et encourageant
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Curiosité</h3>
              <p className="text-sm text-muted-foreground">
                Essayer des techniques récentes quand elles aident à apprendre, par exemple le code exécuté dans le navigateur
              </p>
            </div>
          </div>
        </div>

        {/* Paternité et licence */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <Scale className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Paternité et licence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Ce site est réalisé par {AUTHOR_CREDIT}, comme tous les sites de la plateforme{" "}
                <a href="https://hylst.fr/" className="text-primary hover:underline">hylst.fr</a>.
              </p>
              <p>
                Le code et les contenus rédigés pour le site sont publiés sous licence {LICENSE_NAME} ({LICENSE_SPDX}) :{" "}
                <a href={asset(LICENSE_FILE)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">texte de la licence</a>.
                Les moteurs Python et SQL embarqués gardent leurs licences propres :{" "}
                <a href={asset(NOTICE_FILE)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">inventaire des composants tiers</a>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="bg-primary/5 rounded-lg p-8 mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Un projet en évolution</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {SITE_NAME} est un projet en constante évolution.
            Une erreur repérée, une explication à améliorer, une idée de sujet ? Vos retours sont les bienvenus.
          </p>
          <Link to="/contact" className="text-sm text-primary hover:underline">
            Me contacter
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default About;