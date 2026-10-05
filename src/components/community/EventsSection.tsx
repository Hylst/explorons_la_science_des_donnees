
import { ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mailtoLink } from "@/config/contact";

/**
 * Sites de référence pour trouver des événements data science. Aucune date n'est affichée : elles changent
 * chaque année et une liste figée dans un site statique serait vite fausse. Adresses ouvertes dans un navigateur le
 * 30/09/2026 ; Kaggle a répondu par un contrôle anti-robot (page non lue).
 */
const eventResources = [
  {
    title: "Meetup : groupes Data Science",
    url: "https://www.meetup.com/topics/data-science/",
    type: "Rencontres locales",
    description: "Trouvez les groupes et les rencontres data science près de chez vous ou en ligne."
  },
  {
    title: "Paris Machine Learning",
    url: "https://www.meetup.com/fr-FR/Paris-Machine-Learning-applications-group/",
    type: "Meetup à Paris",
    description: "Groupe de rencontres autour des applications du machine learning, à Paris."
  },
  {
    title: "PyData",
    url: "https://pydata.org/",
    type: "Conférences et meetups",
    description: "Réseau de conférences et de rencontres locales autour de Python pour l'analyse de données."
  },
  {
    title: "PyCon FR",
    url: "https://www.pycon.fr/",
    type: "Conférence francophone",
    description: "Conférence annuelle de la communauté Python francophone."
  },
  {
    title: "EuroPython",
    url: "https://europython.eu/",
    type: "Conférence européenne",
    description: "Conférence annuelle européenne consacrée à Python."
  },
  {
    title: "NeurIPS",
    url: "https://neurips.cc/",
    type: "Recherche",
    description: "Grande conférence annuelle de recherche en apprentissage automatique."
  },
  {
    title: "ICML",
    url: "https://icml.cc/",
    type: "Recherche",
    description: "Conférence internationale annuelle sur le machine learning."
  },
  {
    title: "Kaggle : compétitions",
    url: "https://www.kaggle.com/competitions",
    type: "Compétitions en ligne",
    description: "Compétitions de data science ouvertes à tous, avec jeux de données et classements."
  }
];

const EventsSection = () => (
  <div className="mt-16">
    <h2 className="text-3xl font-bold mb-6">Événements</h2>
    <div className="max-w-none mb-6">
      <p>
        Conférences, rencontres et compétitions pour apprendre, échanger et rencontrer d'autres personnes du domaine.
        Cette page ne recopie pas de calendrier : les dates changent chaque année et une liste figée serait vite fausse.
        Voici les sites de référence, où trouver les prochaines éditions.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {eventResources.map((resource) => (
        <Card key={resource.url} className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <CardTitle className="text-xl font-bold">{resource.title}</CardTitle>
              <Badge variant="secondary" className="shrink-0">{resource.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm">{resource.description}</p>
          </CardContent>
          <CardFooter className="pt-2 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Consulter le site
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>

    <div className="bg-gradient-to-r from-ds-purple-50 to-ds-blue-50 p-6 rounded-lg border border-ds-purple-100 my-8">
      <div className="flex items-start gap-4">
        <div className="bg-white p-3 rounded-full">
          <Clock className="h-6 w-6 text-ds-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Un événement à signaler ?</h3>
          <p className="text-sm mb-4">
            Vous connaissez un événement data science qui mérite de figurer ici ?
            Écrivez-moi son nom et son site officiel.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href={mailtoLink("Suggestion d'événement")}>Suggérer un événement</a>
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default EventsSection;
