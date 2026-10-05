
import React from "react";
import { useNavigate } from "react-router-dom";
import BlogPostCard from "./BlogPostCard";
import { blogPosts } from "@/data/blog-articles";
import { useBlogFavorites } from "@/hooks/use-blog-favorites";

/**
 * BlogList component displays a list of blog posts using the BlogPostCard component
 * @returns JSX element containing the blog post list
 */
const BlogList = () => {
  const { isFavorite, toggleFavorite } = useBlogFavorites();
  const navigate = useNavigate();

  /**
   * Handle reading more about a blog post
   * @param postId - ID of the post to read
   */
  const handleReadMore = (postId: string) => {
    // Navigation SPA : pas de rechargement complet de l'application
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="space-y-6">
      {blogPosts.map((post) => (
        <BlogPostCard
          key={post.id}
          post={post}
          onReadMore={handleReadMore}
          isFavorite={isFavorite(post.id)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};

export default React.memo(BlogList);

