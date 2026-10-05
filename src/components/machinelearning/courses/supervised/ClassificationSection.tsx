
import { EducationalCard, QuizCard } from "@/components/ui/educational-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Target, Brain, Zap, AlertTriangle } from "lucide-react";
import { useState } from "react";

const ClassificationSection = () => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-8">
      {/* Introduction à la classification */}
      <EducationalCard title="🎯 Classification : Prédire des catégories" type="concept">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">
              🏷️ L'art de catégoriser intelligemment
            </h3>
            <p className="text-indigo-700 mb-4">
              La classification, c'est comme trier automatiquement votre courrier : 
              l'algorithme apprend à reconnaître les caractéristiques qui permettent 
              de placer chaque élément dans la bonne "boîte" ou catégorie.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="text-center mb-2">📋</div>
                <h4 className="font-semibold text-sm">Binaire</h4>
                <p className="text-xs text-gray-600">2 choix possibles</p>
                <p className="text-xs text-indigo-600">Spam ou Non-spam</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="text-center mb-2">🎨</div>
                <h4 className="font-semibold text-sm">Multi-classe</h4>
                <p className="text-xs text-gray-600">Plusieurs catégories</p>
                <p className="text-xs text-indigo-600">Chat, Chien, Oiseau</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="text-center mb-2">🏷️</div>
                <h4 className="font-semibold text-sm">Multi-label</h4>
                <p className="text-xs text-gray-600">Plusieurs étiquettes</p>
                <p className="text-xs text-indigo-600">Drôle + Romantique</p>
              </div>
            </div>
          </div>

          {/* Schéma de classification */}
          <Card>
            <CardHeader>
              <CardTitle>Visualisation : Comment fonctionne la classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <svg width="700" height="400" viewBox="0 0 700 400" className="border rounded-lg bg-gray-50">
                  {/* Axes */}
                  <line x1="50" y1="350" x2="650" y2="350" stroke="#374151" strokeWidth="2" />
                  <line x1="50" y1="350" x2="50" y2="50" stroke="#374151" strokeWidth="2" />
                  
                  {/* Labels axes */}
                  <text x="350" y="380" textAnchor="middle" fontSize="14" fill="#374151">Caractéristique 1 (ex: Taille)</text>
                  <text x="25" y="200" textAnchor="middle" fontSize="14" fill="#374151" transform="rotate(-90, 25, 200)">Caractéristique 2 (ex: Poids)</text>
                  
                  {/* Région Classe A (Chats) */}
                  <ellipse cx="150" cy="120" rx="80" ry="60" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="150" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1D4ED8">Chats 🐱</text>
                  
                  {/* Points Classe A */}
                  <circle cx="130" cy="100" r="4" fill="#3B82F6" />
                  <circle cx="170" cy="110" r="4" fill="#3B82F6" />
                  <circle cx="140" cy="140" r="4" fill="#3B82F6" />
                  <circle cx="160" cy="130" r="4" fill="#3B82F6" />
                  
                  {/* Région Classe B (Chiens) */}
                  <ellipse cx="400" cy="280" rx="100" ry="70" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="400" y="285" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#047857">Chiens 🐕</text>
                  
                  {/* Points Classe B */}
                  <circle cx="370" cy="260" r="4" fill="#10B981" />
                  <circle cx="430" cy="270" r="4" fill="#10B981" />
                  <circle cx="380" cy="300" r="4" fill="#10B981" />
                  <circle cx="420" cy="290" r="4" fill="#10B981" />
                  <circle cx="400" cy="250" r="4" fill="#10B981" />
                  
                  {/* Frontière de décision */}
                  <path d="M 250 80 Q 300 200 350 320" stroke="#EF4444" strokeWidth="3" fill="none" strokeDasharray="10,5" />
                  <text x="300" y="70" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#EF4444">Frontière de décision</text>
                  
                  {/* Nouveau point à classifier */}
                  <circle cx="280" cy="200" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
                  <text x="300" y="205" fontSize="12" fontWeight="bold" fill="#D97706">Nouveau point ?</text>
                  
                  {/* Flèche de prédiction */}
                  <path d="M 280 200 L 150 150" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#arrowhead2)" strokeDasharray="5,5" />
                  <text x="200" y="170" fontSize="10" fill="#D97706">Prédiction: Chat</text>
                  
                  <defs>
                    <marker id="arrowhead2" markerWidth="10" markerHeight="7" 
                            refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#F59E0B" />
                    </marker>
                  </defs>
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                L'algorithme apprend à tracer une frontière qui sépare les différentes classes, 
                puis utilise cette frontière pour classifier de nouveaux points.
              </p>
            </CardContent>
          </Card>
        </div>
      </EducationalCard>

      {/* Types de classification avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Types de problèmes de classification</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="binary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="binary">Classification Binaire</TabsTrigger>
              <TabsTrigger value="multiclass">Multi-classe</TabsTrigger>
              <TabsTrigger value="multilabel">Multi-label</TabsTrigger>
            </TabsList>
            
            <TabsContent value="binary" className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-blue-800 mb-3">Classification Binaire : Oui ou Non ?</h3>
                <p className="text-blue-700 mb-4">
                  Comme un interrupteur : il n'y a que deux positions possibles. 
                  L'algorithme doit choisir entre deux options exclusives.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📧 Filtrage Email</h4>
                    <p className="text-sm mb-2">Spam ou Légitime ?</p>
                    <Badge variant="outline" className="text-xs">Seuil de décision</Badge>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🏥 Diagnostic</h4>
                    <p className="text-sm mb-2">Malade ou Sain ?</p>
                    <Badge variant="outline" className="text-xs">Médical</Badge>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">💳 Fraude</h4>
                    <p className="text-sm mb-2">Frauduleux ou Légitime ?</p>
                    <Badge variant="outline" className="text-xs">Sécurité</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="multiclass" className="space-y-4">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="font-bold text-green-800 mb-3">Multi-classe : Choisir parmi plusieurs options</h3>
                <p className="text-green-700 mb-4">
                  Comme choisir votre plat préféré dans un menu : plusieurs options, 
                  mais vous ne pouvez en choisir qu'une seule.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🖼️ Reconnaissance d'images</h4>
                    <p className="text-sm mb-2">Chat, Chien, Oiseau, Poisson...</p>
                    <Badge variant="outline" className="text-xs">Vision</Badge>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎭 Analyse sentiment</h4>
                    <p className="text-sm mb-2">Positif, Négatif, Neutre</p>
                    <Badge variant="outline" className="text-xs">NLP</Badge>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎵 Genre musical</h4>
                    <p className="text-sm mb-2">Rock, Jazz, Pop, Classique...</p>
                    <Badge variant="outline" className="text-xs">Audio</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="multilabel" className="space-y-4">
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="font-bold text-purple-800 mb-3">Multi-label : Plusieurs étiquettes possibles</h3>
                <p className="text-purple-700 mb-4">
                  Comme décrire une personne : elle peut être à la fois "grande", "brune" et "sportive". 
                  Plusieurs caractéristiques peuvent être vraies simultanément.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎬 Tags de films</h4>
                    <p className="text-sm mb-2">Action + Comédie + Romance</p>
                    <Badge variant="outline" className="text-xs">Entertainment</Badge>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📰 Catégories d'articles</h4>
                    <p className="text-sm mb-2">Politique + Économie + International</p>
                    <Badge variant="outline" className="text-xs">Médias</Badge>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🏥 Symptômes médicaux</h4>
                    <p className="text-sm mb-2">Fièvre + Maux de tête + Fatigue</p>
                    <Badge variant="outline" className="text-xs">Médical</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Algorithmes de classification avec contenu pliable */}
      <Card>
        <CardHeader>
          <CardTitle>🧠 Algorithmes de classification populaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Collapsible 
            open={openSections.includes('logistic')} 
            onOpenChange={() => toggleSection('logistic')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Régression Logistique</span>
                <Badge className="bg-blue-100 text-blue-800">Simple</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('logistic') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-blue-200 rounded-b-lg">
              <div className="space-y-4">
                <p className="text-sm">
                  <strong>Analogie :</strong> Comme une balance intelligente qui pèse les pour et les contre 
                  pour prendre une décision. Plus il y a d'éléments positifs, plus la probabilité d'appartenir 
                  à une classe augmente.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Avantages</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Très rapide et simple</li>
                      <li>• Donne des probabilités</li>
                      <li>• Facilement interprétable</li>
                      <li>• Pas de paramètres complexes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ Inconvénients</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Assume des relations linéaires</li>
                      <li>• Sensible aux données aberrantes</li>
                      <li>• Limité pour patterns complexes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openSections.includes('random-forest')} 
            onOpenChange={() => toggleSection('random-forest')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Random Forest</span>
                <Badge className="bg-green-100 text-green-800">Robuste</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('random-forest') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-green-200 rounded-b-lg">
              <div className="space-y-4">
                <p className="text-sm">
                  <strong>Analogie :</strong> Comme demander l'avis à un panel d'experts : chaque arbre de décision 
                  donne son opinion, et la majorité l'emporte. Plus il y a d'experts (arbres), 
                  plus la décision finale est fiable.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Avantages</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Très robuste aux données bruitées</li>
                      <li>• Gère bien les données manquantes</li>
                      <li>• Indique l'importance des variables</li>
                      <li>• Bon équilibre performance/simplicité</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ Inconvénients</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Moins interprétable qu'un seul arbre</li>
                      <li>• Peut faire de l'overfitting</li>
                      <li>• Plus lourd en mémoire</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openSections.includes('svm')} 
            onOpenChange={() => toggleSection('svm')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">Support Vector Machine (SVM)</span>
                <Badge className="bg-purple-100 text-purple-800">Puissant</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes('svm') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-purple-200 rounded-b-lg">
              <div className="space-y-4">
                <p className="text-sm">
                  <strong>Analogie :</strong> Comme tracer la ligne de démarcation parfaite sur un terrain de sport : 
                  SVM trouve la frontière qui sépare le mieux les équipes en gardant la distance maximale 
                  entre la ligne et les joueurs les plus proches.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Avantages</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Excellent en haute dimension</li>
                      <li>• Efficace avec peu de données</li>
                      <li>• Très flexible avec les kernels</li>
                      <li>• Robuste au sur-apprentissage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ Inconvénients</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Lent sur gros datasets</li>
                      <li>• Sensible à l'échelle des données</li>
                      <li>• Choix du kernel délicat</li>
                      <li>• Pas de probabilités directes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Quiz enrichi */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">🧠 Quiz : Testez votre compréhension</h3>
        
        <QuizCard
          question="Vous développez un système pour classer automatiquement des avis clients en 'Positif', 'Négatif' ou 'Neutre'. De quel type de classification s'agit-il ?"
          options={[
            "Classification binaire, car il y a seulement deux sentiments opposés",
            "Classification multi-classe, car il y a trois catégories exclusives",
            "Classification multi-label, car un avis peut exprimer plusieurs sentiments",
            "Régression, car on prédit une valeur de sentiment"
          ]}
          correctAnswer={1}
          explanation="Il s'agit d'une classification multi-classe car nous avons trois catégories distinctes et mutuellement exclusives (Positif, Négatif, Neutre). Chaque avis ne peut appartenir qu'à une seule de ces catégories."
          difficulty="facile"
        />

        <QuizCard
          question="Un modèle Random Forest obtient 95% de précision sur les données d'entraînement mais seulement 70% sur les données de test. Que se passe-t-il ?"
          options={[
            "Le modèle est parfait, 95% est un excellent score",
            "Le modèle fait de l'overfitting (sur-apprentissage)",
            "Les données de test sont de mauvaise qualité",
            "Il faut augmenter le nombre d'arbres dans la forêt"
          ]}
          correctAnswer={1}
          explanation="Cette grande différence entre performance d'entraînement (95%) et de test (70%) est un signe classique d'overfitting. Le modèle a 'mémorisé' les données d'entraînement au lieu d'apprendre des patterns généralisables."
          difficulty="moyen"
        />

        <QuizCard
          question="Pour un problème de diagnostic médical critique, quelle métrique est la plus importante ?"
          options={[
            "Accuracy (précision globale) - pour avoir un bon score général",
            "Recall (sensibilité) - pour ne pas manquer de vrais malades",
            "Precision - pour éviter les fausses alertes",
            "F1-Score - pour équilibrer precision et recall"
          ]}
          correctAnswer={1}
          explanation="En médical, le Recall (sensibilité) est crucial car il mesure notre capacité à identifier tous les vrais malades. Manquer un malade (faux négatif) peut avoir des conséquences graves, même si cela génère quelques fausses alertes."
          difficulty="difficile"
        />

        <QuizCard
          question="Vous avez un dataset déséquilibré : 95% de classe A et 5% de classe B. Un modèle qui prédit toujours 'A' aura quelle accuracy ?"
          options={[
            "50% car il se trompe sur toute la classe B",
            "95% car il prédit correctement 95% des cas",
            "5% car il ne trouve jamais la classe minoritaire",
            "0% car il ne fait aucune prédiction utile"
          ]}
          correctAnswer={1}
          explanation="Le modèle aura 95% d'accuracy car il prédit correctement tous les cas de la classe majoritaire (95% du dataset). C'est pourquoi l'accuracy seule est trompeuse sur des données déséquilibrées - il faut regarder precision, recall et F1-score par classe."
          difficulty="moyen"
        />

        <QuizCard
          question="Quelle analogie décrit le mieux le fonctionnement de la classification ?"
          options={[
            "Un GPS qui calcule le trajet le plus court",
            "Un agent immobilier qui estime le prix d'une maison",
            "Un bibliothécaire qui classe les livres dans les bonnes sections",
            "Un météorologue qui prédit la température de demain"
          ]}
          correctAnswer={2}
          explanation="Le bibliothécaire qui classe les livres est la meilleure analogie : il examine les caractéristiques de chaque livre (genre, thème, auteur) pour le placer dans la bonne catégorie/section, tout comme un algorithme de classification examine les features pour assigner une classe."
          difficulty="facile"
        />
      </div>

      {/* Conseils pratiques */}
      <EducationalCard title="💡 Conseils pratiques pour la classification" type="rappel">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-green-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Bonnes pratiques
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Équilibrer les classes :</strong> Utilisez des techniques de rééchantillonnage si nécessaire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Validation croisée :</strong> Toujours évaluer sur des données non vues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Métriques multiples :</strong> Ne pas se fier qu'à l'accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Feature engineering :</strong> Créer des variables pertinentes</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pièges à éviter
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Data leakage :</strong> Pas d'info du futur dans les features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Overfitting :</strong> Modèle trop complexe pour les données</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Biais de sélection :</strong> Échantillon non représentatif</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Ignorer le déséquilibre :</strong> Classes minoritaires importantes</span>
              </li>
            </ul>
          </div>
        </div>
      </EducationalCard>
    </div>
  );
};

export default ClassificationSection;
