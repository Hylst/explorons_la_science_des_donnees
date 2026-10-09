
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { SourceNote } from "@/components/ui/source-note";

interface CareerCardProps {
  title: string;
  acronym: string;
  description: string;
  skills: string;
  fromColor: string;
  toColor: string;
  acronymBg: string;
  acronymText: string;
  titleColor: string;
}

const CareerCard = ({ 
  title, 
  acronym, 
  description, 
  skills,
  fromColor,
  toColor,
  acronymBg,
  acronymText,
  titleColor
}: CareerCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className={`bg-gradient-to-r ${fromColor} ${toColor}`}>
        <CardTitle className="flex items-center gap-2">
          <span className={`${acronymBg} p-1 rounded ${acronymText} text-lg`}>{acronym}</span>
          <span className={titleColor}>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p>{description}</p>
        <div className="mt-3 text-sm text-gray-600">
          <p className={`font-medium ${titleColor}`}>Compétences requises :</p>
          <p>{skills}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const SalaryRangeItem = ({ role, range, level }: { role: string; range: string; level: "junior" | "mid" | "senior" }) => {
  const getBgColor = () => {
    switch(level) {
      case "junior": return "bg-blue-50";
      case "mid": return "bg-blue-100";
      case "senior": return "bg-blue-200";
    }
  };
  
  return (
    <div className={`p-3 rounded-lg ${getBgColor()} flex justify-between items-center`}>
      <span className="font-medium">{role}</span>
      <span className="text-gray-700">{range}</span>
    </div>
  );
};

const CareersSection = () => {
  const careers: CareerCardProps[] = [
    {
      title: "Data Scientist",
      acronym: "DS",
      description: "Expert en algorithmes de Machine Learning et statistiques avancées, le Data Scientist construit des modèles prédictifs et en tire des enseignements.",
      skills: "Statistiques avancées, ML, programmation (Python/R), visualisation",
      fromColor: "from-ds-purple-50",
      toColor: "to-ds-blue-50",
      acronymBg: "bg-ds-purple-100",
      acronymText: "text-ds-purple-500",
      titleColor: "text-ds-purple-600"
    },
    {
      title: "Data Engineer",
      acronym: "DE",
      description: "Spécialiste des infrastructures de données, le Data Engineer construit et maintient les chaînes de traitement qui permettent de collecter, stocker et préparer les données.",
      skills: "Bases de données, Big Data (Hadoop/Spark), cloud, programmation",
      fromColor: "from-ds-blue-50",
      toColor: "to-ds-purple-50",
      acronymBg: "bg-ds-blue-100",
      acronymText: "text-ds-blue-500",
      titleColor: "text-ds-blue-600"
    },
    {
      title: "Data Analyst",
      acronym: "DA",
      description: "Focalisé sur l'analyse descriptive, le Data Analyst transforme les données en enseignements exploitables pour les décideurs métier.",
      skills: "SQL, Excel, visualisation, statistiques descriptives",
      fromColor: "from-ds-purple-50",
      toColor: "to-ds-blue-50",
      acronymBg: "bg-ds-purple-100",
      acronymText: "text-ds-purple-500",
      titleColor: "text-ds-purple-600"
    },
    {
      title: "Machine Learning Engineer",
      acronym: "ML",
      description: "À l'intersection entre le Data Scientist et le développeur, le ML Engineer met en production et à l'échelle les modèles d'IA.",
      skills: "DevOps, ML, programmation avancée, architecture système",
      fromColor: "from-ds-blue-50",
      toColor: "to-ds-purple-50",
      acronymBg: "bg-ds-blue-100",
      acronymText: "text-ds-blue-500",
      titleColor: "text-ds-blue-600"
    },
    {
      title: "Business Intelligence Analyst",
      acronym: "BI",
      description: "Spécialiste de la transformation des données en rapports et tableaux de bord pour suivre les indicateurs clés et faciliter les décisions stratégiques.",
      skills: "SQL, outils BI (Tableau, Power BI), entrepôts de données, sens du métier",
      fromColor: "from-ds-purple-50",
      toColor: "to-ds-blue-50",
      acronymBg: "bg-ds-purple-100",
      acronymText: "text-ds-purple-500",
      titleColor: "text-ds-purple-600"
    },
    {
      title: "Chief Data Officer",
      acronym: "CDO",
      description: "Responsable stratégique de la gouvernance des données et de la transformation par les données de l'organisation au niveau exécutif.",
      skills: "Leadership, stratégie, gouvernance des données, management",
      fromColor: "from-ds-blue-50",
      toColor: "to-ds-purple-50",
      acronymBg: "bg-ds-blue-100",
      acronymText: "text-ds-blue-500",
      titleColor: "text-ds-blue-600"
    }
  ];

  return (
    <div id="careers" className="scroll-mt-24 border-l-4 border-ds-purple-500 pl-6 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ds-purple-100 p-2 rounded-full">
          <Briefcase className="h-6 w-6 text-ds-purple-500" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-ds-purple-500 to-ds-blue-500 bg-clip-text text-transparent">Métiers de la Data Science</h2>
      </div>
      
      <div className="max-w-none">
        <p className="text-lg mb-6">
          L'écosystème de la Data Science offre une grande variété de carrières, chacune avec ses compétences spécifiques, 
          ses responsabilités et ses perspectives d'évolution. Voici les principaux métiers de ce domaine.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {careers.map((career, idx) => (
            <CareerCard key={idx} {...career} />
          ))}
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm mt-10">
          <h3 className="text-xl font-semibold mb-4">Perspectives salariales en Data Science (France)</h3>

          <h4 className="font-semibold mb-2">Ce que proposent les offres d'emploi (Apec)</h4>
          <div className="space-y-2 mb-2">
            <SalaryRangeItem role="Data Analyst" range="33-53 k€ (moyenne 43 k€)" level="mid" />
            <SalaryRangeItem role="Data Scientist" range="35-60 k€ (moyenne 46 k€)" level="mid" />
            <SalaryRangeItem role="Data Engineer" range="35-60 k€ (moyenne 47 k€)" level="mid" />
          </div>
          <SourceNote
            className="mb-6"
            consulted="1er octobre 2026"
            sources={[
              { label: "Apec, fiche métier Data analyst", href: "https://www.apec.fr/tous-nos-metiers/informatique/data-analyst.html" },
              { label: "Data scientist", href: "https://www.apec.fr/tous-nos-metiers/informatique/data-scientist.html" },
              { label: "Data engineer", href: "https://www.apec.fr/tous-nos-metiers/informatique/data-engineer.html" },
            ]}
          />
          <p className="text-xs text-gray-500 mb-6">
            Fourchette qui contient 80 % des offres publiées par des entreprises, rémunération annuelle brute fixe et variable comprise.
            Ce sont des salaires proposés, non des salaires versés.
          </p>

          <h4 className="font-semibold mb-2">Estimations de l'auteur par niveau d'expérience</h4>
          <div className="space-y-2 mb-6">
            <SalaryRangeItem role="Data Analyst" range="35-45 k€" level="junior" />
            <SalaryRangeItem role="Data Scientist" range="45-60 k€" level="junior" />
            <SalaryRangeItem role="Data Engineer" range="45-55 k€" level="junior" />
            <SalaryRangeItem role="ML Engineer" range="50-65 k€" level="junior" />
          </div>

          <div className="space-y-2 mb-6">
            <SalaryRangeItem role="Data Analyst Senior" range="50-70 k€" level="mid" />
            <SalaryRangeItem role="Data Scientist Senior" range="65-85 k€" level="mid" />
            <SalaryRangeItem role="Data Engineer Senior" range="60-80 k€" level="mid" />
            <SalaryRangeItem role="ML Engineer Senior" range="70-90 k€" level="mid" />
          </div>

          <div className="space-y-2">
            <SalaryRangeItem role="Lead Data Scientist" range="80-110 k€" level="senior" />
            <SalaryRangeItem role="Head of Data" range="90-130 k€" level="senior" />
            <SalaryRangeItem role="Chief Data Officer" range="120 k€ et plus" level="senior" />
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Note: les estimations par niveau d'expérience sont celles de l'auteur, données à titre indicatif et non issues d'une
            étude ; elles varient selon la localisation, la taille de l'entreprise, le secteur d'activité et l'expérience spécifique.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <h3 className="text-xl font-semibold mb-4">Parcours de formation possibles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-ds-purple-600 mb-2">Formation académique</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-ds-purple-500 font-bold">•</span>
                  <span>Master en Data Science / IA / Statistiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ds-purple-500 font-bold">•</span>
                  <span>École d'ingénieur avec spécialisation data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ds-purple-500 font-bold">•</span>
                  <span>Doctorat pour les postes de recherche</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-ds-blue-600 mb-2">Bootcamps & formations intensives</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-ds-blue-500 font-bold">•</span>
                  <span>Bootcamps spécialisés (durée variable selon l'organisme)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ds-blue-500 font-bold">•</span>
                  <span>Formations professionnelles certifiantes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ds-blue-500 font-bold">•</span>
                  <span>Formation continue en entreprise</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-ds-purple-600 mb-2">Auto-formation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-ds-purple-500 font-bold">•</span>
                  <span>MOOCs (Coursera, edX) et cours universitaires en accès libre</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ds-purple-500 font-bold">•</span>
                  <span>Projets personnels & portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ds-purple-500 font-bold">•</span>
                  <span>Compétitions (Kaggle, DrivenData)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersSection;
