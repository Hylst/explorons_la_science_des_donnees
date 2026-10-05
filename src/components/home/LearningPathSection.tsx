import DataScienceMap from "./DataScienceMap";

/**
 * Full-width learning path section component
 * Displays the data science learning map in a dedicated section below the hero
 * Takes the full width of the page for better visibility and engagement
 */
const LearningPathSection: React.FC = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-purple-50/30 dark:from-slate-900/50 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Votre Parcours d'Apprentissage
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez un parcours structuré et progressif pour apprendre la data science.
            Chaque étape s'appuie sur les précédentes pour construire des bases solides et pratiques.
          </p>
        </div>
        
        {/* Full-width learning map */}
        <div className="w-full">
          <DataScienceMap className="w-full min-h-[600px] md:min-h-[700px]" />
        </div>
        
        {/* Additional context */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Ce parcours est conçu pour vous accompagner depuis les fondamentaux mathématiques 
            jusqu'aux techniques avancées de machine learning, en passant par la prise en main des outils
            et la pratique sur des projets concrets.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LearningPathSection;