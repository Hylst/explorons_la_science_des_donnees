import React from 'react';
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Code, Play, ChevronDown, ChevronRight, BookOpen, Lightbulb, Zap, Calculator } from "lucide-react";

interface PythonModule1Props {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Module 1: Introduction à Python - Composant pour les bases du langage
 * Couvre l'installation, variables, types de données et opérateurs
 */
const PythonModule1: React.FC<PythonModule1Props> = ({ isOpen, onToggle }) => {
  return (
    <div className="border-2 border-green-200 rounded-lg bg-white shadow-sm">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <div className="flex flex-col space-y-1.5 p-6 hover:bg-green-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-600">1</span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl text-green-800 font-semibold leading-none tracking-tight">Module 1: Introduction à Python</h3>
                  <p className="text-green-600 text-sm text-muted-foreground">
                    Découvrez les bases de Python : installation, variables, types de données et opérateurs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Débutant
                </Badge>
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-6 pt-0">
            <div className="space-y-6">
              
              {/* Section 1: Qu'est-ce que Python ? */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Qu'est-ce que Python ?
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Python est un langage de programmation polyvalent, facile à apprendre et très populaire en data science.
                    Créé par Guido van Rossum en 1991, il se distingue par sa syntaxe claire et sa philosophie "batteries incluses".
                  </p>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-blue-700 mb-2">Avantages de Python :</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Syntaxe simple et lisible</li>
                      <li>Grande communauté et écosystème riche</li>
                      <li>Bibliothèques spécialisées (NumPy, Pandas, Matplotlib)</li>
                      <li>Polyvalence : web, IA, automatisation, analyse de données</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2: Installation et environnement */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Installation et premier pas
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">Installation :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`# Télécharger depuis python.org
# Ou utiliser Anaconda pour la data science
conda install python`}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">Premier programme :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`print("Hello, World!")
print("Bienvenue en Python !")`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Variables et types de données */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Variables et types de données
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Types de base :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`# Nombres
age = 25          # int (entier)
prix = 19.99      # float (décimal)

# Texte
nom = "Alice"     # str (chaîne)

# Booléen
actif = True      # bool (vrai/faux)`}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Collections :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`# Liste (modifiable)
fruits = ["pomme", "banane", "orange"]

# Tuple (non modifiable)
coordonnees = (10, 20)

# Dictionnaire (clé-valeur)
personne = {
    "nom": "Dupont",
    "age": 30,
    "ville": "Paris"
}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Opérateurs */}
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Opérateurs essentiels
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Opérateurs arithmétiques :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`a = 10
b = 3

print(a + b)    # Addition: 13
print(a - b)    # Soustraction: 7
print(a * b)    # Multiplication: 30
print(a / b)    # Division: 3.33...
print(a // b)   # Division entière: 3
print(a % b)    # Modulo: 1
print(a ** b)   # Puissance: 1000`}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Opérateurs de comparaison :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`x = 5
y = 10

print(x == y)   # Égal: False
print(x != y)   # Différent: True
print(x < y)    # Inférieur: True
print(x > y)    # Supérieur: False
print(x <= y)   # Inférieur ou égal: True
print(x >= y)   # Supérieur ou égal: False`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Exercices pratiques */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Exercices pratiques
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">Exercice 1: Calculatrice simple</h4>
                    <p className="text-gray-700 mb-2">Créez un programme qui calcule l'aire d'un rectangle :</p>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`# Votre code ici
longueur = 8
largeur = 5
aire = longueur * largeur
print(f"L'aire du rectangle est: {aire} m²")`}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">Exercice 2: Manipulation de chaînes</h4>
                    <p className="text-gray-700 mb-2">Travaillez avec les chaînes de caractères :</p>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`prenom = "Marie"
nom = "Dupont"
age = 28

# Concaténation
nom_complet = prenom + " " + nom
print(nom_complet)

# Formatage moderne
message = f"Bonjour {prenom}, vous avez {age} ans"
print(message)`}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">Exercice 3: Listes et opérations</h4>
                    <p className="text-gray-700 mb-2">Manipulez des listes de données :</p>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`notes = [15, 18, 12, 16, 14]

# Calculs sur la liste
moyenne = sum(notes) / len(notes)
note_max = max(notes)
note_min = min(notes)

print(f"Moyenne: {moyenne:.1f}")
print(f"Note max: {note_max}")
print(f"Note min: {note_min}")`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton d'action */}
              <div className="flex justify-center pt-4">
                <Link to="/fundamentals/programming#code-editor" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Pratiquer dans l'éditeur
                </Link>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PythonModule1;