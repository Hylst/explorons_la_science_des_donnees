
import { Twitter, Youtube, Bookmark, Hash, AtSign, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Comptes et chaînes à suivre. Chaque adresse a été ouverte dans un navigateur le 30/09/2026 et correspond
 * bien au compte décrit. Aucun nombre d'abonnés n'est affiché : il change en permanence et ne peut pas
 * être tenu à jour dans un site statique.
 */
const socialAccounts = [
  {
    platform: "X (ex-Twitter)",
    accounts: [
      {
        name: "Kirk Borne",
        handle: "@KirkDBorne",
        description: "Compte consacré à la data science, à l'IA et au big data.",
        url: "https://x.com/KirkDBorne",
        icon: <Twitter className="h-5 w-5 text-sky-500" />
      }
    ]
  },
  {
    platform: "YouTube",
    accounts: [
      {
        name: "StatQuest with Josh Starmer",
        handle: "@statquest",
        description: "Statistiques et machine learning expliqués pas à pas, en anglais.",
        url: "https://www.youtube.com/@statquest",
        icon: <Youtube className="h-5 w-5 text-red-600" />
      },
      {
        name: "3Blue1Brown",
        handle: "@3blue1brown",
        description: "Mathématiques expliquées visuellement : algèbre linéaire, analyse, réseaux de neurones (en anglais).",
        url: "https://www.youtube.com/@3blue1brown",
        icon: <Youtube className="h-5 w-5 text-red-600" />
      },
      {
        name: "Machine Learnia",
        handle: "@MachineLearnia",
        description: "Chaîne francophone consacrée au machine learning avec Python.",
        url: "https://www.youtube.com/@MachineLearnia",
        icon: <Youtube className="h-5 w-5 text-red-600" />
      }
    ]
  }
];

const popularHashtags = [
  "#DataScience", "#MachineLearning", "#BigData", "#DeepLearning",
  "#Python", "#AIethics", "#DataVisualization", "#NLP"
];

const SocialSection = () => (
  <div className="mt-16">
    <h2 className="text-3xl font-bold mb-6">Comptes et chaînes à suivre</h2>
    <div className="max-w-none mb-6">
      <p>
        Quelques comptes et chaînes utiles pour suivre l'actualité et apprendre.
        Cette liste est courte volontairement : elle ne contient que des adresses contrôlées.
      </p>
    </div>

    <div className="space-y-8 mb-10">
      {socialAccounts.map((platform) => (
        <div key={platform.platform}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {platform.accounts[0].icon}
            {platform.platform}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platform.accounts.map((account) => (
              <Card key={account.url} className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">{account.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <AtSign className="h-3 w-3" />
                        {account.handle.replace(/^@/, "")}
                      </CardDescription>
                    </div>
                    {account.icon}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{account.description}</p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href={account.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Voir le profil
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-10">
      <div className="flex items-start gap-4">
        <Hash className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold mb-3">Mots-clés utiles pour chercher du contenu</h3>
          <ul className="flex flex-wrap gap-2" aria-label="Mots-clés">
            {popularHashtags.map((hashtag) => (
              <li key={hashtag} className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">
                {hashtag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
      <div className="flex items-start gap-4">
        <Bookmark className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Astuce</h3>
          <p className="text-sm">
            Créez des listes dédiées à la data science sur X pour filtrer le contenu pertinent et ne pas manquer
            les informations importantes dans votre fil.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SocialSection;
