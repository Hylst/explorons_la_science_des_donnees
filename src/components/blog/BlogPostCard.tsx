import React from "react";
import { Heart, Clock, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  categories: string[];
  featured?: boolean;
}

interface BlogPostCardProps {
  post: BlogPost;
  onReadMore: (postId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (postId: string) => void;
}

/**
 * BlogPostCard component displays a single blog post with metadata and actions
 * @param props - Component props including post data and action handlers
 * @returns JSX element representing a blog post card
 */
const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onReadMore, isFavorite, onToggleFavorite }) => {
  /**
   * Get category-specific styling for badges
   * @param category - Post category
   * @returns CSS classes for badge styling
   */
  const getCategoryBadgeStyle = (category: string): string => {
    switch (category) {
      case "Carrières":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Guide":
        return "bg-green-50 text-green-800 border-green-200";
      case "Cas d'école":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Méthodologie":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "Erreurs communes":
        return "bg-red-50 text-red-800 border-red-200";
      case "Visualisation":
        return "bg-pink-50 text-pink-800 border-pink-200";
      case "Communication":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Data Cleaning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${post.featured ? 'ring-2 ring-blue-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold leading-tight pr-4">
            {post.title}
          </CardTitle>
          {post.featured && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              À la une
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {post.categories.map((category, index) => (
            <Badge 
              key={index}
              variant="outline"
              className={getCategoryBadgeStyle(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{post.readTime}</span>
          </div>
          <span>{post.date}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(post.id)}
          className={`flex items-center gap-2 ${isFavorite ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
          <span>{isFavorite ? "Dans mes favoris" : "Ajouter aux favoris"}</span>
        </Button>
        
        <Button 
          onClick={() => onReadMore(post.id)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Lire la suite
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(BlogPostCard);