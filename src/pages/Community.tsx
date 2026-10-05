
import ContentLayout from "@/components/layout/ContentLayout";
import { MessageSquare, Calendar, GithubIcon, Globe, BookOpen, Rss, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ForumsSection from "@/components/community/ForumsSection";
import EventsSection from "@/components/community/EventsSection";
import SocialSection from "@/components/community/SocialSection";
import ContributeSection from "@/components/community/ContributeSection";
import BlogSection from "@/components/community/BlogSection";
import ActuSection from "@/components/community/ActuSection";
import { Button } from "@/components/ui/button";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

type SectionType = "forums" | "events" | "social" | "contribute" | "blog" | "actu";

const CommunityPage = () => {
  const sections: SectionType[] = ["forums", "events", "social", "contribute", "blog", "actu"];
  const { currentSection } = useSectionTracker<SectionType>(sections);
  
  useSmoothScroll();
  
  const sidebarItems = [
    { 
      title: "Forums et groupes", 
      href: "#forums", 
      isActive: currentSection === "forums",
      icon: <MessageSquare className="h-4 w-4" /> 
    },
    { 
      title: "Événements", 
      href: "#events", 
      isActive: currentSection === "events",
      icon: <Calendar className="h-4 w-4" /> 
    },
    { 
      title: "Comptes et chaînes",
      href: "#social", 
      isActive: currentSection === "social",
      icon: <Globe className="h-4 w-4" /> 
    },
    { 
      title: "Contribuer", 
      href: "#contribute", 
      isActive: currentSection === "contribute",
      icon: <GithubIcon className="h-4 w-4" /> 
    },
    { 
      title: "Blog Data", 
      href: "#blog", 
      isActive: currentSection === "blog",
      icon: <BookOpen className="h-4 w-4" /> 
    },
    { 
      title: "Actualités", 
      href: "#actu", 
      isActive: currentSection === "actu",
      icon: <Rss className="h-4 w-4" /> 
    },
  ];

  return (
    <ContentLayout 
      title="Communauté" 
      backLink={{ href: "/resources", label: "Retour aux ressources" }}
      sidebar={{ items: sidebarItems }}
    >
      <section className="py-8">
        <UnifiedHeroSection
          variant="page"
          title="Communauté Data Science"
          description="Forums où poser vos questions, événements à suivre, comptes à connaître et actualités : des points d'entrée vers la communauté data science."
        />
          
        <div className="space-y-12">
          <div id="forums"><ForumsSection /></div>
          <div id="events"><EventsSection /></div>
          <div id="social"><SocialSection /></div>
          <div id="contribute"><ContributeSection /></div>
          <div id="blog"><BlogSection /></div>
          <div id="actu"><ActuSection /></div>
        </div>
          
        <div className="mt-12 flex justify-between items-center pt-8 border-t">
          <Button asChild variant="outline">
            <Link to="/resources" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Retour aux ressources
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

export default CommunityPage;
