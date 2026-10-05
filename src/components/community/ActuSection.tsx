import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Rss } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mailtoLink } from "@/config/contact";
import NewsFilters from "./NewsFilters";
import NewsArticleCard from "./NewsArticleCard";
import RSSSourceCard from "./RSSSourceCard";
import { formatArticleDate, normalizeText, type NewsArticle, type RSSSource } from "./rss";
import rssSourcesData from "@/data/rss-sources.json";
import rssArticlesData from "@/data/rss-articles.json";

const rssSources: RSSSource[] = rssSourcesData;
const { fetchedAt, articles }: { fetchedAt: string; articles: NewsArticle[] } = rssArticlesData;

const sourceNames = [...new Set(articles.map((article) => article.source))];
const categories = [...new Set(articles.map((article) => article.category))];

/**
 * Actualités : instantané d'articles issus de flux RSS publics, généré par `npm run news:refresh`.
 * Le site est statique, il ne lit pas les flux en direct : la date de l'instantané est affichée.
 */
const ActuSection = () => {
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("articles");
  const { toast } = useToast();

  const filteredArticles = useMemo(() => {
    const query = normalizeText(search.trim());
    return articles.filter(
      (article) =>
        (selectedSource === "all" || article.source === selectedSource) &&
        (category === "all" || article.category === category) &&
        (!query || normalizeText(`${article.title} ${article.excerpt} ${article.source}`).includes(query))
    );
  }, [search, selectedSource, category]);

  const resetFilters = () => {
    setSearch("");
    setSelectedSource("all");
    setCategory("all");
  };

  /** « S'abonner » : l'adresse du flux se colle dans un lecteur RSS, le site n'a aucun compte ni serveur */
  const copyFeed = useCallback(
    async (source: RSSSource) => {
      try {
        await navigator.clipboard.writeText(source.url);
        toast({ title: "Adresse du flux copiée", description: `Collez-la dans votre lecteur RSS pour suivre ${source.name}.` });
      } catch {
        toast({ title: "Copie impossible", description: `Adresse du flux : ${source.url}`, variant: "destructive" });
      }
    },
    [toast]
  );

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-6">Actualités Data Science</h2>
      <div className="max-w-none mb-6">
        <p>
          Les derniers articles de plusieurs flux RSS publics, repris sans tri. Chaque article s'ouvre sur le site de sa source. Le flux « Le Big Data » n'apparaît pas ici : le script de récupération ne peut pas le lire.
          L'onglet « Sources RSS » donne les adresses des flux pour les suivre dans votre propre lecteur.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="articles">Articles récents</TabsTrigger>
          <TabsTrigger value="sources">Sources RSS</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2 mb-6">
            Instantané pris le <time dateTime={fetchedAt}>{formatArticleDate(fetchedAt)}</time>. Ce site est statique et ne lit pas
            les flux en direct : l'auteur renouvelle cette liste de temps en temps, à la main.
          </p>

          <NewsFilters
            search={search}
            onSearchChange={setSearch}
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
            sourceNames={sourceNames}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
            resultCount={filteredArticles.length}
          />

          {filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Aucun article ne correspond à vos critères de recherche.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <NewsArticleCard key={article.url} article={article} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sources">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rssSources.map((source) => (
              <RSSSourceCard key={source.url} source={source} onCopyFeed={copyFeed} />
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-100 mt-8">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full">
                <Rss className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Suggérer un flux RSS</h3>
                <p className="text-sm mb-4">
                  Vous connaissez une bonne source d'informations sur la data science ?
                  Écrivez-moi son adresse, je l'ajouterai à la liste si elle convient.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href={mailtoLink("Suggestion de flux RSS")}>Proposer un flux</a>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(ActuSection);
