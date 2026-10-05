
import { useMemo, useState } from "react";
import { MessageSquare, MessageCircle, ExternalLink, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeText } from "./rss";

/**
 * Forums et communautés où poser des questions. Adresses ouvertes dans un navigateur le 30/09/2026 ;
 * Kaggle a répondu par un contrôle anti-robot (page non lue).
 * Aucun effectif ni niveau d'activité n'est affiché : ces chiffres changent en permanence et ne peuvent
 * pas être tenus à jour dans un site statique.
 */
const forums = [
  {
    title: "Stack Overflow : tag data-science",
    url: "https://stackoverflow.com/questions/tagged/data-science",
    description: "Posez vos questions techniques et recevez des réponses de la communauté.",
    type: "Questions-réponses",
    icon: <MessageSquare className="h-5 w-5 text-ds-blue-500" />
  },
  {
    title: "Data Science Stack Exchange",
    url: "https://datascience.stackexchange.com/",
    description: "Questions-réponses dédiées à la data science et à l'apprentissage automatique.",
    type: "Questions-réponses",
    icon: <MessageSquare className="h-5 w-5 text-ds-blue-500" />
  },
  {
    title: "Cross Validated",
    url: "https://stats.stackexchange.com/",
    description: "Questions-réponses en statistiques, apprentissage automatique et visualisation de données.",
    type: "Questions-réponses",
    icon: <MessageSquare className="h-5 w-5 text-ds-blue-500" />
  },
  {
    title: "Reddit : r/datascience",
    url: "https://www.reddit.com/r/datascience/",
    description: "Discussions, actualités et tendances dans le domaine de la data science.",
    type: "Forum",
    icon: <MessageCircle className="h-5 w-5 text-orange-500" />
  },
  {
    title: "Reddit : r/MachineLearning",
    url: "https://www.reddit.com/r/MachineLearning/",
    description: "Discussions sur la recherche et les applications de l'apprentissage automatique.",
    type: "Forum",
    icon: <MessageCircle className="h-5 w-5 text-orange-500" />
  },
  {
    title: "Reddit : r/learnmachinelearning",
    url: "https://www.reddit.com/r/learnmachinelearning/",
    description: "Entraide et ressources pour apprendre le machine learning.",
    type: "Forum",
    icon: <MessageCircle className="h-5 w-5 text-orange-500" />
  },
  {
    title: "Kaggle : discussions",
    url: "https://www.kaggle.com/discussions",
    description: "Échangez autour des compétitions, des jeux de données et des techniques d'analyse.",
    type: "Forum",
    icon: <MessageCircle className="h-5 w-5 text-cyan-500" />
  },
  {
    title: "Forums Hugging Face",
    url: "https://discuss.huggingface.co/",
    description: "Discussions sur le traitement du langage naturel, les modèles de langage et l'IA générative.",
    type: "Forum",
    icon: <MessageCircle className="h-5 w-5 text-yellow-500" />
  }
];

const ForumsSection = () => {
  const [search, setSearch] = useState("");

  const filteredForums = useMemo(() => {
    const query = normalizeText(search.trim());
    if (!query) return forums;
    return forums.filter((forum) => normalizeText(`${forum.title} ${forum.description} ${forum.type}`).includes(query));
  }, [search]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Forums et groupes</h2>
      <div className="max-w-none mb-6">
        <p>
          Les forums et espaces de questions-réponses où vous pouvez poser vos questions et échanger avec d'autres personnes du domaine.
          Ces espaces sont précieux pour résoudre des problèmes et partager des connaissances.
        </p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Rechercher un forum ou un groupe"
          placeholder="Rechercher un forum ou un groupe..."
          className="pl-9 w-full"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filteredForums.length === 0 ? (
        <div className="text-center border rounded-lg p-10 mb-10">
          <p className="mb-4 text-muted-foreground">Aucun forum ne correspond à votre recherche.</p>
          <Button variant="outline" onClick={() => setSearch("")}>Effacer la recherche</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredForums.map((forum) => (
            <Card key={forum.url} className="hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">{forum.title}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{forum.type}</Badge>
                    </CardDescription>
                  </div>
                  {forum.icon}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{forum.description}</p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <a href={forum.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Rejoindre
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="bg-white p-3 rounded-full">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">Vous ne trouvez pas ce que vous cherchez ?</h3>
            <p className="text-sm mb-4">
              Ce site n'héberge pas de forum. Pour une question sur un cours ou une suggestion,
              écrivez-moi depuis la page de contact.
            </p>
            <Button size="sm" asChild>
              <Link to="/contact">Me contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumsSection;
