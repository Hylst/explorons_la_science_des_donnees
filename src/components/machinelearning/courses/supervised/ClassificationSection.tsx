
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
              🏷️ Attribuer une catégorie à chaque exemple
            </h3>
            <p className="text-indigo-700 mb-4">
              La classification consiste à prédire une catégorie (une « classe ») pour chaque exemple, un peu comme trier
              son courrier : l'algorithme apprend, à partir d'exemples déjà étiquetés, quelles caractéristiques
              permettent de choisir la bonne catégorie.
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
              <CardTitle>Schéma : comment fonctionne la classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <svg width="700" height="400" viewBox="0 0 700 400" className="border rounded-lg bg-gray-50">
                  {/* Axes */}
                  <line x1="50" y1="350" x2="650" y2="350" stroke="#374151" strokeWidth="2" />
                  <line x1="50" y1="350" x2="50" y2="50" stroke="#374151" strokeWidth="2" />

                  {/* Labels axes */}
                  <text x="350" y="380" textAnchor="middle" fontSize="14" fill="#374151">Caractéristique 1 (par exemple la taille)</text>
                  <text x="25" y="200" textAnchor="middle" fontSize="14" fill="#374151" transform="rotate(-90, 25, 200)">Caractéristique 2 (par exemple le poids)</text>

                  {/* Région Classe A (chats : plus petits et plus légers) */}
                  <ellipse cx="160" cy="280" rx="85" ry="55" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="160" y="285" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1D4ED8">Chats 🐱</text>

                  {/* Points Classe A */}
                  <circle cx="130" cy="262" r="4" fill="#3B82F6" />
                  <circle cx="175" cy="268" r="4" fill="#3B82F6" />
                  <circle cx="145" cy="300" r="4" fill="#3B82F6" />
                  <circle cx="185" cy="295" r="4" fill="#3B82F6" />
                  <circle cx="115" cy="285" r="4" fill="#3B82F6" />

                  {/* Région Classe B (chiens : plus grands et plus lourds) */}
                  <ellipse cx="460" cy="130" rx="100" ry="65" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="460" y="135" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#047857">Chiens 🐕</text>

                  {/* Points Classe B */}
                  <circle cx="420" cy="105" r="4" fill="#10B981" />
                  <circle cx="490" cy="115" r="4" fill="#10B981" />
                  <circle cx="440" cy="150" r="4" fill="#10B981" />
                  <circle cx="480" cy="155" r="4" fill="#10B981" />
                  <circle cx="455" cy="90" r="4" fill="#10B981" />

                  {/* Frontière de décision */}
                  <path d="M 230 345 Q 300 200 380 55" stroke="#EF4444" strokeWidth="3" fill="none" strokeDasharray="10,5" />
                  <text x="330" y="40" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#EF4444">Frontière de décision</text>

                  {/* Nouveau point à classifier */}
                  <circle cx="255" cy="225" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
                  <text x="245" y="212" textAnchor="end" fontSize="12" fontWeight="bold" fill="#D97706">Nouveau point ?</text>

                  {/* Flèche de prédiction */}
                  <path d="M 255 225 L 205 255" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#arrowhead2)" strokeDasharray="5,5" />
                  <text x="60" y="100" fontSize="12" fill="#D97706">Le nouveau point est du côté des chats :</text>
                  <text x="60" y="118" fontSize="12" fill="#D97706">prédiction « chat ».</text>

                  <defs>
                    <marker id="arrowhead2" markerWidth="10" markerHeight="7"
                            refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#F59E0B" />
                    </marker>
                  </defs>
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                L'algorithme apprend à tracer une frontière qui sépare les classes, puis l'utilise
                pour classer de nouveaux points. (Schéma d'illustration : points inventés.)
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
                    <Badge variant="outline" className="text-xs">Divertissement</Badge>
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
                  <strong>Principe :</strong> elle combine les variables par une somme pondérée, qu'une fonction
                  logistique transforme en probabilité d'appartenir à une classe. Chaque poids se lit comme
                  l'effet d'une variable sur cette probabilité.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Avantages</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Très rapide et simple</li>
                      <li>• Donne des probabilités</li>
                      <li>• Facilement interprétable</li>
                      <li>• Peu d'hyperparamètres (surtout la régularisation C)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ Inconvénients</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Frontière linéaire, sauf à transformer les variables</li>
                      <li>• Sensible aux données aberrantes</li>
                      <li>• Limitée pour des structures complexes</li>
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
                  <strong>Analogie :</strong> comme demander l'avis à un panel : chaque arbre de décision
                  donne le sien, et l'on combine les avis (scikit-learn moyenne les probabilités des arbres).
                  Plus il y a d'arbres, plus la prédiction se stabilise, avec un gain qui devient vite négligeable.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Avantages</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Plutôt robuste aux données bruitées</li>
                      <li>• Pas besoin de standardiser les variables</li>
                      <li>• Indique l'importance des variables</li>
                      <li>• Bon équilibre performance/simplicité</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ Inconvénients</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Moins interprétable qu'un seul arbre</li>
                      <li>• Peut encore surapprendre si les arbres sont trop profonds</li>
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
                <Badge className="bg-purple-100 text-purple-800">Marge maximale</Badge>
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
                      <li>• À l'aise en grande dimension</li>
                      <li>• Peut bien fonctionner avec peu de données</li>
                      <li>• Très flexible avec les kernels</li>
                      <li>• Généralise souvent bien quand C et le kernel sont bien réglés</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ Inconvénients</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Lent sur de gros jeux de données</li>
                      <li>• Sensible à l'échelle des données</li>
                      <li>• Choix du kernel délicat</li>
                      <li>• Pas de probabilités directes (option probability=True, plus lente)</li>
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
          question="Un modèle de forêt aléatoire obtient 95 % d'exactitude sur les données d'entraînement mais seulement 70 % sur les données de test. Que se passe-t-il ?"
          options={[
            "Le modèle est parfait, 95 % est un excellent score",
            "Le modèle fait de l'overfitting (sur-apprentissage)",
            "Les données de test sont de mauvaise qualité",
            "Il faut augmenter le nombre d'arbres dans la forêt"
          ]}
          correctAnswer={1}
          explanation="Cet écart entre la performance d'entraînement (95 %) et celle de test (70 %) est un signe classique de surapprentissage. Le modèle a « mémorisé » les données d'entraînement au lieu d'apprendre des régularités qui se généralisent."
          difficulty="moyen"
        />

        <QuizCard
          question="Pour le dépistage d'une maladie grave, qui se soigne bien si elle est détectée tôt, quelle métrique faut-il privilégier en premier ?"
          options={[
            "Exactitude (accuracy) - pour avoir un bon score général",
            "Rappel (sensibilité) - pour ne pas manquer de vrais malades",
            "Précision - pour éviter les fausses alertes",
            "F1-score - pour équilibrer précision et rappel"
          ]}
          correctAnswer={1}
          explanation="Dans ce cas, le rappel (recall, ou sensibilité) est prioritaire car il mesure la part des vrais malades que l'on détecte. Manquer un malade (faux négatif) peut avoir des conséquences graves, alors qu'une fausse alerte se règle par un examen complémentaire. Le choix dépend toutefois du coût réel de chaque type d'erreur : il se discute avec les professionnels concernés."
          difficulty="difficile"
        />

        <QuizCard
          question="Vous avez un jeu de données déséquilibré : 95 % de classe A et 5 % de classe B. Quelle exactitude (accuracy) aura un modèle qui prédit toujours « A » ?"
          options={[
            "50 % car il se trompe sur toute la classe B",
            "95 % car il prédit correctement 95 % des cas",
            "5 % car il ne trouve jamais la classe minoritaire",
            "0 % car il ne fait aucune prédiction utile"
          ]}
          correctAnswer={1}
          explanation="Le modèle a 95 % d'exactitude car il prédit correctement tous les cas de la classe majoritaire (95 % des données), tout en ne détectant jamais la classe B. C'est pourquoi l'exactitude seule est trompeuse sur des données déséquilibrées : il faut regarder la précision, le rappel et le F1-score de chaque classe."
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
                <span><strong>Équilibrer les classes :</strong> si nécessaire, rééchantillonnez ou pondérez les classes, sur l'entraînement seulement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Validation croisée :</strong> Toujours évaluer sur des données non vues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Métriques multiples :</strong> ne pas se fier à la seule exactitude</span>
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
                <span><strong>Fuite de données :</strong> aucune information du futur ni de la cible parmi les variables</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Surapprentissage :</strong> modèle trop complexe pour les données</span>
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
