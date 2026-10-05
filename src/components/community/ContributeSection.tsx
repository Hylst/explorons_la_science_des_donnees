
import { GithubIcon, FileCode, Edit, Code, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mailtoLink } from "@/config/contact";

/**
 * Projets open source de la data science. Le lien pointe vers la page « Contribute » de GitHub, qui liste les
 * tickets adaptés aux débutants du moment. Aucune statistique (étoiles, tickets ouverts) n'est affichée :
 * ces nombres changent chaque jour et ne peuvent pas être tenus à jour dans un site statique.
 */
const openSourceProjects = [
  {
    name: "scikit-learn",
    description: "Bibliothèque de machine learning en Python",
    language: "Python",
    url: "https://github.com/scikit-learn/scikit-learn/contribute"
  },
  {
    name: "pandas",
    description: "Structures de données flexibles et outils d'analyse pour Python",
    language: "Python",
    url: "https://github.com/pandas-dev/pandas/contribute"
  },
  {
    name: "TensorFlow",
    description: "Framework d'apprentissage automatique de bout en bout",
    language: "C++/Python",
    url: "https://github.com/tensorflow/tensorflow/contribute"
  }
];

const contentIdeas = [
  {
    title: "Tutoriels pratiques",
    description: "Guides étape par étape sur des techniques spécifiques de data science"
  },
  {
    title: "Études de cas",
    description: "Analyses détaillées de projets réels avec code et données"
  },
  {
    title: "Explications de concepts",
    description: "Articles expliquant des concepts complexes de manière accessible"
  },
  {
    title: "Revues d'articles de recherche",
    description: "Synthèses d'articles scientifiques récents dans un format accessible"
  }
];

const ContributeSection = () => (
  <div className="mt-16">
    <h2 className="text-3xl font-bold mb-6">Contribuer</h2>
    <div className="max-w-none mb-6">
      <p>
        Comment contribuer à la communauté Data Science, que ce soit par du code open source ou du contenu éducatif.
      </p>
    </div>

    <Tabs defaultValue="open-source" className="mb-10">
      <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
        <TabsTrigger value="open-source" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Projets open source
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Contenu éducatif
        </TabsTrigger>
      </TabsList>

      <TabsContent value="open-source" className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-start gap-4">
            <GithubIcon className="h-6 w-6 text-gray-700 flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <h3 className="text-lg font-semibold mb-2">Comment contribuer à l'open source</h3>
              <p className="text-sm mb-4">
                Contribuer à des projets open source est un excellent moyen d'améliorer vos compétences tout en aidant la communauté.
                Voici comment commencer :
              </p>
              <ol className="text-sm space-y-2 list-decimal pl-5 mb-4">
                <li>Trouvez un projet qui vous intéresse</li>
                <li>Lisez la documentation et les guides de contribution</li>
                <li>Commencez par des tickets étiquetés « good first issue » ou « beginner friendly »</li>
                <li>Dupliquez (fork) le dépôt, créez une branche, puis proposez une demande de fusion (pull request)</li>
                <li>Soyez patient et ouvert aux retours</li>
              </ol>
              <Button variant="outline" size="sm" asChild className="whitespace-normal h-auto py-2 text-left">
                <a href="https://github.com/firstcontributions/first-contributions" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 w-fit">
                  <ExternalLink className="h-3 w-3" />
                  Tutoriel pas à pas pour une première contribution
                </a>
              </Button>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Quelques projets open source de la data science</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openSourceProjects.map((project) => (
            <Card key={project.name} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <FileCode className="h-5 w-5 text-ds-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Langage :</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {project.language}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                    <GithubIcon className="h-3 w-3" />
                    Voir les tickets pour débuter
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-start gap-4">
            <Edit className="h-6 w-6 text-gray-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Partagez votre expertise</h3>
              <p className="text-sm mb-4">
                Le contenu éducatif est crucial pour aider les autres à apprendre et à progresser.
                Voici quelques façons de partager vos connaissances :
              </p>
              <ul className="text-sm space-y-2 list-disc pl-5 mb-4">
                <li>Écrire des articles de blog</li>
                <li>Créer des tutoriels vidéo</li>
                <li>Contribuer à la documentation de projets</li>
                <li>Animer des webinaires ou des ateliers</li>
                <li>Partager vos notebooks Jupyter</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Idées de contenu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentIdeas.map((idea) => (
            <Card key={idea.title} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{idea.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{idea.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Button className="px-8" asChild>
            <a href={mailtoLink("Proposition de contenu")} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Proposer du contenu
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">Ouvre votre messagerie avec un message pré-rempli.</p>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default ContributeSection;
