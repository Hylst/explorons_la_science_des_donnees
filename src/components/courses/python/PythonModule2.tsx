import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

/**
 * Interface for PythonModule2 component props
 * @interface PythonModule2Props
 * @property {boolean} isOpen - Controls whether the module content is expanded
 * @property {() => void} onToggle - Callback function to toggle the module expansion
 */
interface PythonModule2Props {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * PythonModule2 component - Covers conditional statements, loops, and error handling
 * @param {PythonModule2Props} props - Component properties
 * @returns {JSX.Element} The rendered PythonModule2 component
 */
const PythonModule2: React.FC<PythonModule2Props> = ({ isOpen, onToggle }) => {
  return (
    <div className="w-full border-2 border-blue-200 shadow-lg">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <div className="flex flex-col space-y-1.5 p-6 hover:bg-blue-50 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-blue-800">
                Module 2: Structures de contrôle
              </h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Intermédiaire
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Conditions, boucles et gestion d'erreurs
            </p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6">
            <div className="space-y-6">
              {/* Section: Conditional Statements */}
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">🔀 Instructions conditionnelles</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Structure if/elif/else :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`age = 18

if age >= 18:
    print("Vous êtes majeur")
elif age >= 16:
    print("Vous pouvez conduire")
else:
    print("Vous êtes mineur")

# Conditions multiples
note = 15
if note >= 16 and note <= 20:
    print("Très bien!")
elif note >= 12 or note == 10:
    print("Bien!")
else:
    print("Peut mieux faire")`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Loops */}
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">🔄 Boucles</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Boucle for :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`# Boucle sur une liste
fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(f"J'aime les {fruit}s")

# Boucle avec range
for i in range(5):
    print(f"Compteur: {i}")

# Boucle avec enumerate
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")`}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Boucle while :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`compteur = 0
while compteur < 5:
    print(f"Compteur: {compteur}")
    compteur += 1

# Boucle avec break et continue
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
for nombre in nombres:
    if nombre == 5:
        continue  # Passer à l'itération suivante
    if nombre == 8:
        break     # Sortir de la boucle
    print(nombre)`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Error Handling */}
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">⚠️ Gestion d'erreurs</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Try/Except :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`try:
    nombre = int(input("Entrez un nombre: "))
    resultat = 10 / nombre
    print(f"Résultat: {resultat}")
except ValueError:
    print("Erreur: Veuillez entrer un nombre valide")
except ZeroDivisionError:
    print("Erreur: Division par zéro impossible")
except Exception as e:
    print(f"Erreur inattendue: {e}")
finally:
    print("Fin du programme")`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: List Comprehensions */}
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">📝 Compréhensions de listes</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Syntaxe avancée :</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`# Liste des carrés
carres = [x**2 for x in range(10)]
print(carres)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Filtrage avec condition
pairs = [x for x in range(20) if x % 2 == 0]
print(pairs)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transformation de chaînes
mots = ["python", "java", "javascript"]
mots_maj = [mot.upper() for mot in mots]
print(mots_maj)  # ['PYTHON', 'JAVA', 'JAVASCRIPT']`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Practical Exercises */}
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">💡 Exercices pratiques</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Exercice 1: Calculatrice simple</h4>
                    <p className="text-gray-700 mb-2">Créez une calculatrice qui gère les erreurs :</p>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`def calculatrice():
    try:
        a = float(input("Premier nombre: "))
        operation = input("Opération (+, -, *, /): ")
        b = float(input("Deuxième nombre: "))
        
        if operation == "+":
            resultat = a + b
        elif operation == "-":
            resultat = a - b
        elif operation == "*":
            resultat = a * b
        elif operation == "/":
            if b != 0:
                resultat = a / b
            else:
                print("Erreur: Division par zéro!")
                return
        else:
            print("Opération non reconnue!")
            return
            
        print(f"Résultat: {resultat}")
        
    except ValueError:
        print("Erreur: Veuillez entrer des nombres valides")

calculatrice()`}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Exercice 2: Analyse de données</h4>
                    <p className="text-gray-700 mb-2">Analysez une liste de températures :</p>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`temperatures = [22, 25, 19, 30, 28, 15, 32, 18, 26, 24]

# Statistiques de base
temp_max = max(temperatures)
temp_min = min(temperatures)
temp_moyenne = sum(temperatures) / len(temperatures)

print(f"Température maximale: {temp_max}°C")
print(f"Température minimale: {temp_min}°C")
print(f"Température moyenne: {temp_moyenne:.1f}°C")

# Catégorisation
temps_chauds = [t for t in temperatures if t > 25]
temps_froids = [t for t in temperatures if t < 20]

print(f"Jours chauds (>25°C): {len(temps_chauds)}")
print(f"Jours froids (<20°C): {len(temps_froids)}")`}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Exercice 3: Jeu de devinette</h4>
                    <p className="text-gray-700 mb-2">Créez un jeu de devinette de nombre :</p>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {`import random

def jeu_devinette():
    nombre_secret = random.randint(1, 100)
    tentatives = 0
    max_tentatives = 7
    
    print("Devinez le nombre entre 1 et 100!")
    print(f"Vous avez {max_tentatives} tentatives.")
    
    while tentatives < max_tentatives:
        try:
            guess = int(input("Votre proposition: "))
            tentatives += 1
            
            if guess == nombre_secret:
                print(f"Bravo! Vous avez trouvé en {tentatives} tentatives!")
                break
            elif guess < nombre_secret:
                print("Trop petit!")
            else:
                print("Trop grand!")
                
            print(f"Tentatives restantes: {max_tentatives - tentatives}")
            
        except ValueError:
            print("Veuillez entrer un nombre valide!")
    
    else:
        print(f"Dommage! Le nombre était {nombre_secret}")

jeu_devinette()`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PythonModule2;