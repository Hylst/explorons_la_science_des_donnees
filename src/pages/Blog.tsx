
import { useParams, Link } from "react-router-dom";
import ContentLayout from "@/components/layout/ContentLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft } from "lucide-react";
import BlogList from "@/components/blog/BlogList";
import { blogPosts } from "@/data/blog-articles";
import BlogPost from "@/components/blog/BlogPost";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

const Blog = () => {
  const { id } = useParams();
  const blogPost = id ? blogPosts.find(post => post.id === id) : null;
  const isArticle = Boolean(id && blogPost);
  
  // Utilise le hook de smooth scrolling
  useSmoothScroll();

  // Sidebar navigation items
  const sidebarItems = [
    { 
      title: "Tous les articles", 
      href: "/blog", 
      isActive: !id,
      icon: <BookOpen className="h-4 w-4" /> 
    },
    // Ajout d'articles spécifiques dans la sidebar
    ...(blogPosts.slice(0, 5).map(post => ({
      title: post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title,
      href: `/blog/${post.id}`,
      isActive: id === post.id,
      icon: null
    })))
  ];

  return (
    <ContentLayout 
      title="Blog Data" 
      backLink={{ href: "/community", label: "Retour à la communauté" }}
      sidebar={{ 
        items: sidebarItems
      }}
    >
      <section className="py-4">
        {/* Sur la page d'un article, le titre de l'article est le seul h1 et arrive tout de suite : le bandeau reste sur la liste */}
        {!isArticle && (
          <UnifiedHeroSection
            variant="page"
            title="Blog Data Science"
            description="Des guides et des études de cas pour explorer la data science : métiers, qualité des données, corrélation et causalité, visualisation."
          />
        )}
        
        {id ? <BlogPost id={id} content={blogPost?.content} title={blogPost?.title} /> : <BlogList />}
        
        <div className="mt-12 flex justify-between items-center pt-8 border-t">
          <Button asChild variant="outline">
            <Link to="/community" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Retour à la communauté
            </Link>
          </Button>
          <Button size="lg" asChild className="whitespace-normal h-auto min-h-11 py-2 text-center">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </section>
    </ContentLayout>
  );
};

export default Blog;
