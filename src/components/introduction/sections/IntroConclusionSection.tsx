
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AUTHOR_CREDIT } from "@/config/site";

const IntroConclusionSection = () => {
  return (
    <div className="mt-12 space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-xl font-semibold mb-3">Prêt à commencer votre parcours en Data Science ?</h3>
        <p className="mb-4">
          Maintenant que vous avez une vue d'ensemble de la Data Science, de ses applications et des compétences 
          nécessaires, vous pouvez approfondir vos connaissances dans les domaines qui vous intéressent.
        </p>
        <p className="mb-6">
          Une suite possible : les fondamentaux, c'est-à-dire les mathématiques, les statistiques, la programmation
          et la manipulation de données. Ces bases servent ensuite dans tous les autres domaines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Étape suivante possible</h4>
            <p className="text-sm text-gray-700 mb-3">
              Explorez les fondamentaux de la Data Science pour construire des bases solides.
            </p>
            <Button className="w-full bg-gradient-to-r from-ds-blue-500 to-ds-purple-500 hover:from-ds-blue-600 hover:to-ds-purple-600 group whitespace-normal h-auto min-h-11 py-2 text-center" asChild>
              <Link to="/fundamentals" className="flex items-center justify-center gap-1">
                Découvrir les fondamentaux
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Explorer par centre d'intérêt</h4>
            <p className="text-sm text-gray-700 mb-3">
              Ou accédez directement aux sections qui vous intéressent le plus.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/fundamentals/math-stats">Mathématiques</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/fundamentals/programming">Programmation</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/machine-learning">Machine Learning</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/projects">Projets pratiques</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between items-center gap-3 pt-8 border-t">
        <Button variant="outline" asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
        <Button size="lg" className="bg-gradient-to-r from-ds-blue-500 to-ds-purple-500 hover:from-ds-blue-600 hover:to-ds-purple-600 group" asChild>
          <Link to="/fundamentals" className="flex items-center gap-1">
            Continuer vers les fondamentaux
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground mt-8 text-right">
        <p>
          Auteur : {AUTHOR_CREDIT} ·{" "}
          <Link to="/contact" className="underline">
            le contacter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default IntroConclusionSection;
