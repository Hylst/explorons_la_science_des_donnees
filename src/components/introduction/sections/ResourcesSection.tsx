
import React from "react";
import { Book, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ResourceProps {
  title: string;
  author?: string;
  link?: string;
  description?: string;
}

const ResourceItem = ({ title, author, link, description }: ResourceProps) => (
  <div className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{title}</h4>
        {author && <p className="text-sm text-gray-600">{author}</p>}
      </div>
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-ds-blue-500 hover:text-ds-blue-700 flex items-center gap-1 text-sm"
        >
          <ExternalLink className="h-3 w-3" />
          <span>Accéder</span>
        </a>
      )}
    </div>
    {description && <p className="text-sm text-gray-700 mt-1">{description}</p>}
  </div>
);

const ResourceCategory = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-lg border shadow-sm">
    <h3 className="font-semibold text-lg mb-3 text-ds-purple-600">{title}</h3>
    {children}
  </div>
);

const ResourcesSection = () => {
  return (
    <div id="resources" className="scroll-mt-24 border-l-4 border-ds-blue-400 pl-6 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ds-blue-100 p-2 rounded-full">
          <Book className="h-6 w-6 text-ds-blue-500" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-ds-blue-400 to-ds-purple-400 bg-clip-text text-transparent">Ressources pour débuter</h2>
      </div>
      
      <div className="max-w-none">
        <p className="text-lg mb-6">
          Pour vous aider à débuter ou approfondir vos connaissances en Data Science, 
          voici une petite sélection de ressources utiles. Ces outils, cours et références 
          peuvent vous accompagner dans votre parcours d'apprentissage.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResourceCategory title="Livres de référence">
            <ResourceItem
              title="Python for Data Analysis"
              author="Wes McKinney"
              description="Un guide pour manipuler des données avec Python et pandas, écrit par le créateur de pandas."
            />
            <ResourceItem
              title="Hands-On Machine Learning with Scikit-Learn and PyTorch"
              author="Aurélien Géron"
              description="Une approche pratique des algorithmes de Machine Learning."
            />
            <ResourceItem
              title="The Elements of Statistical Learning"
              author="T. Hastie, R. Tibshirani & J. Friedman"
              description="Un classique plus avancé sur les fondements statistiques du Machine Learning."
            />
          </ResourceCategory>
          
          <ResourceCategory title="Cours en ligne">
            <ResourceItem
              title="Machine Learning - Stanford"
              author="Andrew Ng (Coursera)"
              link="https://www.coursera.org/learn/machine-learning"
              description="Le cours fondamental pour comprendre les bases du Machine Learning."
            />
            <ResourceItem
              title="Data Science Specialization"
              author="Johns Hopkins University (Coursera)"
              link="https://www.coursera.org/specializations/jhu-data-science"
              description="Une série de 10 cours couvrant tous les aspects de la Data Science."
            />
            <ResourceItem
              title="Deep Learning Specialization"
              author="deeplearning.ai (Coursera)"
              link="https://www.coursera.org/specializations/deep-learning"
              description="Série de cours sur les réseaux de neurones profonds."
            />
          </ResourceCategory>
          
          <ResourceCategory title="Plateformes d'exercices">
            <ResourceItem
              title="Kaggle"
              link="https://www.kaggle.com"
              description="Compétitions de Data Science, datasets et notebooks pour pratiquer."
            />
            <ResourceItem
              title="HackerRank"
              link="https://www.hackerrank.com"
              description="Défis de programmation incluant des sections sur la Data Science."
            />
          </ResourceCategory>
          
          <ResourceCategory title="Ressources gratuites">
            <ResourceItem
              title="Google AI : apprendre l'IA"
              link="https://ai.google/learn-ai-skills/"
              description="Parcours et cours sur l'IA proposés par Google (une partie gratuite, une partie payante)."
            />
            <ResourceItem
              title="Fast.ai"
              link="https://www.fast.ai"
              description="Cours gratuits de Deep Learning avec une approche pratique."
            />
            <ResourceItem
              title="Towards Data Science"
              link="https://towardsdatascience.com"
              description="Publication Medium regroupant des articles de qualité sur la Data Science."
            />
          </ResourceCategory>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg my-8 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Explorez notre page Ressources</h3>
              <p className="text-gray-700">
                Découvrez notre sélection complète de livres, cours, tutoriels et outils pour approfondir vos connaissances en Data Science.
              </p>
            </div>
            <Button className="bg-ds-blue-500 hover:bg-ds-blue-600" asChild>
              <Link to="/resources">Voir toutes les ressources</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;
