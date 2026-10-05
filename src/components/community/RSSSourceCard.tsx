import { memo } from "react";
import { Globe, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_BADGE_STYLES, DEFAULT_BADGE_STYLE, LANGUAGE_BADGE_STYLES, type RSSSource } from "./rss";

interface RSSSourceCardProps {
  source: RSSSource;
  onCopyFeed: (source: RSSSource) => void;
}

/**
 * RSSSourceCard : une source avec un lien vers son site et l'adresse de son flux, à copier
 * puis coller dans un lecteur RSS (Feedly, Inoreader, Thunderbird...).
 */
const RSSSourceCard = ({ source, onCopyFeed }: RSSSourceCardProps) => (
  <Card className="hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold flex items-center">
        <Globe className="h-5 w-5 mr-2 text-blue-600" />
        {source.name}
      </CardTitle>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={LANGUAGE_BADGE_STYLES[source.language] ?? DEFAULT_BADGE_STYLE}>
          {source.language}
        </Badge>
        <Badge variant="outline" className={CATEGORY_BADGE_STYLES[source.category] ?? DEFAULT_BADGE_STYLE}>
          {source.category}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{source.description}</p>
    </CardContent>
    <CardFooter className="flex flex-wrap justify-between gap-2">
      <Button variant="outline" size="sm" className="flex-1" asChild>
        <a href={source.siteUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3 w-3 mr-1" />
          Visiter
        </a>
      </Button>
      <Button size="sm" className="flex-1" onClick={() => onCopyFeed(source)}>
        <Copy className="h-3 w-3 mr-1" />
        Copier le flux
      </Button>
    </CardFooter>
  </Card>
);

export default memo(RSSSourceCard);
