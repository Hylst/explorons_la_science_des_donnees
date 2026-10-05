
import { Globe, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WebsitesSection = () => {
  const websites = [
    {
      title: "Kaggle",
      url: "https://www.kaggle.com",
      description: "Plateforme de compétitions de Data Science, datasets, notebooks et communauté.",
      categories: ["Datasets", "Compétitions", "Notebooks"]
    },
    {
      title: "Towards Data Science",
      url: "https://towardsdatascience.com",
      description: "Publication Medium dédiée à la Data Science avec des articles de qualité de data scientists.",
      categories: ["Articles", "Tutoriels", "Études de cas"]
    },
    {
      title: "Stack Overflow",
      url: "https://stackoverflow.com/questions/tagged/data-science",
      description: "Questions et réponses de la communauté sur tous les aspects de la data science et programmation.",
      categories: ["Forum", "Q&A", "Support"]
    },
    {
      title: "GitHub",
      url: "https://github.com/topics/data-science",
      description: "Projets open source, code et ressources dans le domaine de la data science.",
      categories: ["Code", "Open Source", "Projets"]
    },
    {
      title: "Scikit-learn",
      url: "https://scikit-learn.org",
      description: "Documentation officielle de scikit-learn avec exemples et tutoriels sur le machine learning.",
      categories: ["Documentation", "Tutoriels", "API"]
    }
  ];

  return (
    <div id="websites" className="scroll-mt-24 mt-16">
      <h2 className="text-3xl font-bold mb-6">Sites Web</h2>
      <div className="max-w-none mb-6">
        <p>
          Sites de référence, blogs et forums pour rester à jour et approfondir vos connaissances.
          Ces ressources en ligne peuvent aider à progresser, du débutant au professionnel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {websites.map((site, index) => (
          <Card key={index} className="hover:shadow-lg transition-all border-t-4 border-t-cyan-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">{site.title}</CardTitle>
                <Globe className="h-5 w-5 text-cyan-500" />
              </div>
              <CardDescription className="truncate">{site.url.replace('https://', '')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{site.description}</p>
              <div className="flex flex-wrap gap-2">
                {site.categories.map((category, i) => (
                  <span key={i} className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                    {category}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Visiter
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebsitesSection;
