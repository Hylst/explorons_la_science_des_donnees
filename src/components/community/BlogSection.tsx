
import { useMemo, useState } from "react";
import { BookOpen, Clock, User, ChevronRight, Search, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import blogPosts from "@/data/blog-posts.json";
import { normalizeText } from "./rss";

const MAX_DISPLAYED = 4;
const allCategories = [...new Set(blogPosts.flatMap((post) => post.categories))];

const BlogSection = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    const query = normalizeText(search.trim());
    return blogPosts.filter(
      (post) =>
        (category === null || post.categories.includes(category)) &&
        (!query || normalizeText(`${post.title} ${post.excerpt} ${post.categories.join(" ")}`).includes(query))
    );
  }, [search, category]);
  const displayedPosts = filteredPosts.slice(0, MAX_DISPLAYED);

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-6">Blog Data</h2>
      <div className="max-w-none mb-6">
        <p>
          Des guides et des études de cas sur la data science : métiers, qualité des données,
          corrélation et causalité, visualisation. Les mises en situation sont annoncées comme
          « cas d'école » et les références citées sont indiquées en fin d'article.
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Rechercher un article"
            placeholder="Rechercher un article..."
            className="pl-9 w-full"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((item) => (
            <Badge
              key={item}
              role="button"
              tabIndex={0}
              aria-pressed={category === item}
              variant={category === item ? "default" : "outline"}
              className="cursor-pointer flex items-center gap-1"
              onClick={() => setCategory(category === item ? null : item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setCategory(category === item ? null : item);
                }
              }}
            >
              <Tag className="h-3 w-3" />
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
        {filteredPosts.length} article{filteredPosts.length > 1 ? "s" : ""}
        {filteredPosts.length > MAX_DISPLAYED ? ` (affichage limité à ${MAX_DISPLAYED}, la liste complète est sur la page Blog)` : ""}
      </p>

      {displayedPosts.length === 0 ? (
        <div className="text-center border rounded-lg p-10 mb-8">
          <p className="mb-4 text-muted-foreground">Aucun article ne correspond à votre recherche.</p>
          <Button variant="outline" onClick={() => { setSearch(""); setCategory(null); }}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {displayedPosts.map((post) => (
            <Card
              key={post.id}
              className={`hover:shadow-lg transition-all h-full ${
                post.featured ? "border-2 border-ds-purple-500" : ""
              }`}
            >
              {post.featured && (
                <div className="bg-ds-purple-500 text-white text-xs py-1 px-3 text-center">
                  Article à la une
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-bold hover:text-ds-purple-600 transition-colors">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.categories.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="bg-ds-purple-100 text-ds-purple-800 hover:bg-ds-purple-200"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{post.readTime} de lecture</span>
                  </div>
                  <span className="text-muted-foreground">{post.date}</span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end mt-auto">
                <Button
                  variant="ghost"
                  className="text-ds-purple-600 hover:text-ds-purple-700 hover:bg-ds-purple-50"
                  asChild
                >
                  <Link to={`/blog/${post.id}`} className="flex items-center gap-1">
                    Lire l'article
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center mb-6">
        <Button asChild>
          <Link to="/blog">
            <BookOpen className="h-4 w-4 mr-2" />
            Voir tous les articles
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BlogSection;
