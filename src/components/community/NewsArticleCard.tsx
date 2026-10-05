import React from "react";
import { Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_BADGE_STYLES, DEFAULT_BADGE_STYLE, formatArticleDate, type NewsArticle } from "./rss";

interface NewsArticleCardProps {
  article: NewsArticle;
}

/**
 * NewsArticleCard component displays a single news article with metadata.
 * L'article s'ouvre sur le site de la source, dans un nouvel onglet.
 */
const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article }) => (
  <Card className="hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold break-words">{article.title}</CardTitle>
      <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
        <span>{article.source}</span>
        <span>•</span>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
        </div>
        <Badge variant="outline" className={CATEGORY_BADGE_STYLES[article.category] ?? DEFAULT_BADGE_STYLE}>
          {article.category}
        </Badge>
        <Badge variant="outline" className="text-xs">{article.language}</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 break-words">{article.excerpt}</p>
    </CardContent>
    <CardFooter className="flex justify-end">
      <Button variant="outline" size="sm" asChild>
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3 w-3 mr-1" />
          Lire sur {article.source}
        </a>
      </Button>
    </CardFooter>
  </Card>
);

export default React.memo(NewsArticleCard);
