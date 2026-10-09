import { ArrowRight } from "lucide-react";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

const Hero = () => {
  return (
    <UnifiedHeroSection
      variant="home"
      title="Apprendre la data science, pas à pas"
      description="Un projet personnel de partage de connaissances en data science. Créé par Geoffroy Streit, ancien ingénieur et développeur d'applications, autodidacte en data science, ce site rassemble mes apprentissages et mes découvertes dans ce domaine."
      alert={{
        message: "Un projet d'apprentissage partagé",
        details: "En tant qu'autodidacte, je partage ici mes notes, synthèses et projets pour aider d'autres personnes dans leur parcours d'apprentissage de la data science.",
        variant: "info"
      }}
      actions={[
        {
          label: "Commencer par l'introduction",
          to: "/introduction",
          variant: "default",
          icon: ArrowRight
        },
        {
          label: "Découvrir les cours",
          to: "/courses",
          variant: "outline"
        }
      ]}
      layout="centered"
      decorative={true}
    />
  );
};

export default Hero;
