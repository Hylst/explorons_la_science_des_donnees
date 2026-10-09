
import { Brain } from "lucide-react";

interface SectorCardProps {
  title: string;
  icon: string;
  examples: string[];
  description?: string;
}

const SectorCard = ({ title, icon, examples, description }: SectorCardProps) => (
  <div className="bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    {description && <p className="text-sm text-gray-700 mb-3">{description}</p>}
    <ul className="space-y-1 text-sm text-gray-700">
      {examples.map((example, i) => (
        <li key={i} className="flex items-center gap-1">
          <span className="text-ds-blue-500">•</span>
          <span>{example}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ApplicationsSection = () => {
  const sectors: SectorCardProps[] = [
    {
      title: "Santé",
      icon: "🏥",
      description: "Aide au diagnostic, personnalisation des traitements et organisation des opérations hospitalières.",
      examples: ["Diagnostic assisté par IA", "Médecine personnalisée", "Prévention des épidémies", "Optimisation des parcours patients"]
    },
    {
      title: "Finance",
      icon: "💰",
      description: "Automatisation des processus financiers, détection de fraudes et prise de décision d'investissement.",
      examples: ["Détection de fraudes", "Trading algorithmique", "Évaluation des risques", "Score de crédit"]
    },
    {
      title: "Marketing",
      icon: "📊",
      description: "Ciblage des clients, optimisation des campagnes et prévision des comportements d'achat.",
      examples: ["Personnalisation", "Segmentation client", "Prévision des tendances", "Optimisation des prix"]
    },
    {
      title: "Transport & Logistique",
      icon: "🚗",
      description: "Gestion optimisée des flottes, prévision de la demande et maintenance intelligente.",
      examples: ["Optimisation logistique", "Maintenance prédictive", "Véhicules autonomes", "Gestion du trafic urbain"]
    },
    {
      title: "Énergie",
      icon: "⚡",
      description: "Optimisation de la production, réduction de la consommation et planification des ressources.",
      examples: ["Prévision de consommation", "Optimisation de production", "Réseaux électriques intelligents", "Détection de pannes"]
    },
    {
      title: "Industrie & Fabrication",
      icon: "🏭",
      description: "Amélioration des procédés de fabrication, contrôle qualité automatisé et maintenance prédictive.",
      examples: ["Contrôle qualité", "Optimisation des processus", "Maintenance prédictive", "Gestion de la chaîne d'approvisionnement"]
    },
    {
      title: "E-commerce & Retail",
      icon: "🛒",
      description: "Personnalisation de l'expérience d'achat, prévision des stocks et optimisation des prix.",
      examples: ["Recommandations de produits", "Aménagement des rayons", "Prévision des ventes", "Optimisation des stocks"]
    },
    {
      title: "Éducation",
      icon: "🎓",
      description: "Adaptation des parcours d'apprentissage, détection des risques de décrochage et évaluation automatisée.",
      examples: ["Apprentissage adaptatif", "Détection du décrochage", "Évaluation automatisée", "Personnalisation des cursus"]
    },
    {
      title: "Agriculture",
      icon: "🌱",
      description: "Optimisation des rendements, gestion durable des ressources et détection précoce des problèmes.",
      examples: ["Agriculture de précision", "Prévisions météorologiques", "Gestion des ressources", "Détection des maladies"]
    }
  ];

  return (
    <div id="applications" className="scroll-mt-24 border-l-4 border-ds-blue-500 pl-6 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ds-blue-100 p-2 rounded-full">
          <Brain className="h-6 w-6 text-ds-blue-500" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-ds-blue-500 to-ds-purple-500 bg-clip-text text-transparent">Applications et cas d'usage</h2>
      </div>
      
      <div className="max-w-none">
        <p className="text-lg mb-6">
          La Data Science est utilisée dans de nombreux secteurs d'activité. Voici quelques exemples
          d'usages, à titre d'illustration :
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {sectors.map((sector, idx) => (
            <SectorCard key={idx} {...sector} />
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mt-8 border border-blue-100">
          <h3 className="text-xl font-semibold mb-3">Impacts transversaux de la Data Science</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-4 border border-blue-50">
                <h4 className="font-semibold text-ds-blue-600">Automatisation des processus</h4>
                <p className="text-sm text-gray-700">Réduction des tâches manuelles et répétitives pour permettre aux équipes de se concentrer sur des activités à plus haute valeur ajoutée.</p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-blue-50">
                <h4 className="font-semibold text-ds-blue-600">Personnalisation à grande échelle</h4>
                <p className="text-sm text-gray-700">Possibilité d'adapter un service à chaque utilisateur, même lorsqu'ils sont très nombreux.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-4 border border-purple-50">
                <h4 className="font-semibold text-ds-purple-600">Prise de décision basée sur les données</h4>
                <p className="text-sm text-gray-700">Appuyer les intuitions et les hypothèses sur des analyses de données, en gardant un regard critique sur leurs limites.</p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-purple-50">
                <h4 className="font-semibold text-ds-purple-600">Nouveaux produits et services</h4>
                <p className="text-sm text-gray-700">Produits, services et modèles économiques que l'exploitation de grandes quantités de données rend parfois possibles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsSection;
