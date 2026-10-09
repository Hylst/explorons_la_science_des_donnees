import { blogImage } from "@/lib/blog-image";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import blogPosts from "@/data/blog-posts.json";

// Nombre d'articles mis en avant sur l'accueil
const ARTICLE_COUNT = 3;

// Articles réels du blog (l'article mis en avant d'abord), pour ne jamais pointer vers un article inexistant
const articles = [...blogPosts]
  .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  .slice(0, ARTICLE_COUNT)
  .map((post) => ({
    title: post.title,
    description: post.excerpt,
    image: blogImage(post.id),
    category: post.categories[0],
    href: `/blog/${post.id}`
  }));

const LatestArticles = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Du côté du blog</h2>
            <p className="text-xl text-muted-foreground">
              Des guides et des études de cas sur la méthode et les métiers de la data
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/blog">
              Tous les articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.title} className="overflow-hidden card-hover flex flex-col">
              <div className="aspect-[16/9] relative">
                <img
                  src={article.image}
                  alt=""
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                  {article.category}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 leading-snug">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="border-t pt-4 mt-auto">
                <Button asChild variant="ghost" className="w-full">
                  <Link to={article.href}>
                    Lire l'article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
