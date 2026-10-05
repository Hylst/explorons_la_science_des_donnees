
import { Book, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BooksSection = () => {
  const recommendedBooks = [
    {
      title: "Python for Data Science Handbook",
      author: "Jake VanderPlas",
      description: "Une exploration complète de l'écosystème Python pour la Data Science: NumPy, Pandas, Matplotlib et Scikit-Learn.",
      link: "https://jakevdp.github.io/PythonDataScienceHandbook/",
      level: "Débutant-Intermédiaire",
      tags: ["Python", "Data Science", "Open Source"]
    },
    {
      title: "Hands-On Machine Learning with Scikit-Learn and PyTorch",
      author: "Aurélien Géron",
      description: "Concepts et outils pratiques pour construire des systèmes intelligents avec des exemples concrets.",
      link: "https://www.oreilly.com/library/view/hands-on-machine-learning/9798341607972/",
      level: "Intermédiaire",
      tags: ["Machine Learning", "Python", "PyTorch"]
    },
    {
      title: "Deep Learning",
      author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
      description: "La référence théorique sur le deep learning, couvrant à la fois les concepts mathématiques et les applications.",
      link: "https://www.deeplearningbook.org/",
      level: "Avancé",
      tags: ["Deep Learning", "Intelligence Artificielle", "Mathématiques"]
    },
  ];

  return (
    <div id="books" className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6">Livres recommandés</h2>
      <div className="max-w-none mb-6">
        <p>
          Une sélection de livres essentiels pour tous les niveaux, des fondamentaux aux techniques avancées.
          Ces ouvrages constituent une base solide pour approfondir vos connaissances en Data Science.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {recommendedBooks.map((book, index) => (
          <Card key={index} className="hover:shadow-lg transition-all border-l-4 border-l-ds-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">{book.title}</CardTitle>
                <Book className="h-5 w-5 text-ds-blue-500" />
              </div>
              <CardDescription>par {book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{book.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {book.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Niveau: {book.level}</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={book.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Explorer
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BooksSection;
