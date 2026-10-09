
import { EducationalCard, QuizCard } from "@/components/ui/educational-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, Calculator, Lightbulb } from "lucide-react";

const RegressionSection = () => {
  return (
    <div className="space-y-8">
      {/* Introduction à la régression */}
      <EducationalCard title="📈 Régression : Prédire des valeurs continues" type="concept">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              📊 Prédire une valeur numérique
            </h3>
            <p className="text-green-700 mb-4">
              En régression, au lieu de prédire une catégorie (comme en classification),
              on estime une valeur numérique sur une échelle continue, avec une marge d'erreur
              qu'il faut mesurer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-center mb-2">💰</div>
                <h4 className="font-semibold text-sm">Prix</h4>
                <p className="text-xs text-gray-600">Euros, dollars...</p>
                <p className="text-xs text-green-600">Maison : 250 000 €</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-center mb-2">🌡️</div>
                <h4 className="font-semibold text-sm">Température</h4>
                <p className="text-xs text-gray-600">Degrés Celsius</p>
                <p className="text-xs text-green-600">Demain : 23,5 °C</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-center mb-2">⏱️</div>
                <h4 className="font-semibold text-sm">Durée</h4>
                <p className="text-xs text-gray-600">Minutes, heures...</p>
                <p className="text-xs text-green-600">Trajet : 47 min</p>
              </div>
            </div>
          </div>

          {/* Comparaison Classification vs Régression */}
          <Card>
            <CardHeader>
              <CardTitle>🔄 Classification et régression : quelle différence ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    🏷️ Classification
                  </h4>
                  <p className="text-blue-700 mb-4 text-sm">
                    "Cette maison est-elle <strong>chère</strong> ou <strong>abordable</strong> ?"
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-blue-200 text-blue-800">Réponse : Catégorie</Badge>
                    <p className="text-xs">Sortie discrète (étiquettes)</p>
                    <div className="text-xs space-y-1">
                      <div>• Chère</div>
                      <div>• Abordable</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    📈 Régression
                  </h4>
                  <p className="text-green-700 mb-4 text-sm">
                    "Combien vaut <strong>environ</strong> cette maison ?"
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-green-200 text-green-800">Réponse : Nombre</Badge>
                    <p className="text-xs">Sortie continue (valeurs)</p>
                    <div className="text-xs space-y-1">
                      <div>• 247 350 €</div>
                      <div>• 189 750 €</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </EducationalCard>

      {/* Visualisation régression linéaire */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Schéma : la régression linéaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <svg width="600" height="400" viewBox="0 0 600 400" className="border rounded-lg bg-gray-50">
              {/* Axes */}
              <line x1="50" y1="350" x2="550" y2="350" stroke="#374151" strokeWidth="2" />
              <line x1="50" y1="350" x2="50" y2="50" stroke="#374151" strokeWidth="2" />

              {/* Labels axes */}
              <text x="300" y="380" textAnchor="middle" fontSize="14" fill="#374151">Surface de la maison (m²)</text>
              <text x="25" y="200" textAnchor="middle" fontSize="14" fill="#374151" transform="rotate(-90, 25, 200)">Prix (k€)</text>

              {/* Grille */}
              <defs>
                <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 30" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect x="50" y="50" width="500" height="300" fill="url(#grid)" />

              {/* Points de données */}
              <circle cx="100" cy="322" r="4" fill="#3B82F6" />
              <circle cx="150" cy="275" r="4" fill="#3B82F6" />
              <circle cx="200" cy="262" r="4" fill="#3B82F6" />
              <circle cx="250" cy="212" r="4" fill="#3B82F6" />
              <circle cx="300" cy="205" r="4" fill="#3B82F6" />
              <circle cx="350" cy="158" r="4" fill="#3B82F6" />
              <circle cx="400" cy="145" r="4" fill="#3B82F6" />
              <circle cx="450" cy="95" r="4" fill="#3B82F6" />
              <circle cx="500" cy="82" r="4" fill="#3B82F6" />

              {/* Droite des moindres carrés calculée sur ces 9 points */}
              <line x1="70" y1="332.2" x2="520" y2="64" stroke="#EF4444" strokeWidth="3" />

              {/* Résidus (quelques exemples) */}
              <line x1="200" y1="262" x2="200" y2="254.7" stroke="#6B7280" strokeWidth="2" strokeDasharray="3,3" />
              <line x1="250" y1="212" x2="250" y2="224.9" stroke="#6B7280" strokeWidth="2" strokeDasharray="3,3" />
              <line x1="350" y1="158" x2="350" y2="165.3" stroke="#6B7280" strokeWidth="2" strokeDasharray="3,3" />

              {/* Légendes */}
              <circle cx="80" cy="30" r="4" fill="#3B82F6" />
              <text x="90" y="35" fontSize="12" fill="#374151">Points de données réels</text>

              <line x1="80" y1="45" x2="110" y2="45" stroke="#EF4444" strokeWidth="3" />
              <text x="115" y="50" fontSize="12" fill="#374151">Ligne de régression (prédictions)</text>

              <line x1="80" y1="60" x2="110" y2="60" stroke="#6B7280" strokeWidth="2" strokeDasharray="3,3" />
              <text x="115" y="65" fontSize="12" fill="#374151">Résidus (quelques exemples)</text>

              {/* Équation */}
              <text x="400" y="30" fontSize="14" fontWeight="bold" fill="#EF4444">Prix ≈ a + b × Surface</text>
            </svg>
          </div>
          <p className="text-sm text-gray-600 text-center">
            La droite rouge est celle qui minimise la somme des carrés des écarts : plus la maison est grande,
            plus le prix prédit est élevé. Les pointillés montrent des erreurs de prédiction (résidus).
            Schéma d'illustration : points inventés, axes sans graduation.
          </p>
        </CardContent>
      </Card>

      {/* Types de régression avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Types de régression</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="linear" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="linear">Linéaire</TabsTrigger>
              <TabsTrigger value="polynomial">Polynomiale</TabsTrigger>
              <TabsTrigger value="multiple">Multiple</TabsTrigger>
            </TabsList>

            <TabsContent value="linear" className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-blue-800 mb-3">Régression linéaire : simple et lisible</h3>
                <p className="text-blue-700 mb-4">
                  Elle revient à tracer la droite (ou l'hyperplan) qui passe « au mieux » à travers les points.
                  C'est le point de départ habituel : simple, interprétable, et souvent difficile à battre de loin.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Quand l'utiliser ?
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Relation simple entre variables</li>
                      <li>• Besoin d'interprétabilité</li>
                      <li>• Peu de données disponibles</li>
                      <li>• Modèle de référence rapide à établir</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      Exemples typiques
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Prix vs Surface habitable</li>
                      <li>• Salaire vs Années d'expérience</li>
                      <li>• Consommation vs Température</li>
                      <li>• Ventes vs Budget publicitaire</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Astuce :</strong> si vos points forment approximativement une ligne droite,
                    la régression linéaire sera probablement un bon choix.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="polynomial" className="space-y-4">
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="font-bold text-purple-800 mb-3">Régression polynomiale : pour les courbes</h3>
                <p className="text-purple-700 mb-4">
                  Quand la relation n'est pas une droite, on ajoute à la variable ses puissances (x², x³...) :
                  le modèle reste linéaire dans ses coefficients, mais dessine une courbe.
                  Au-delà d'un degré modeste, la courbe suit le bruit plutôt que la tendance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📈 Cas d'usage</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Relations courbes sur un intervalle limité</li>
                      <li>• Effets qui s'accélèrent ou ralentissent</li>
                      <li>• Rendements décroissants (sur la plage observée)</li>
                      <li>• À éviter pour extrapoler : les polynômes divergent hors des données</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">⚠️ Attention au degré</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Degré 2-3 : souvent suffisant</li>
                      <li>• Degré élevé : risque de surapprentissage</li>
                      <li>• Validation croisée essentielle</li>
                      <li>• Vérifier que la courbe reste plausible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="multiple" className="space-y-4">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="font-bold text-green-800 mb-3">Régression multiple : plusieurs variables</h3>
                <p className="text-green-700 mb-4">
                  Un phénomène dépend rarement d'un seul facteur. Pour estimer le prix d'une maison,
                  on utilise simultanément sa surface, sa localisation, son âge, etc.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 Avantages</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Plus proche de situations multifactorielles</li>
                      <li>• Souvent de meilleures prédictions qu'avec une seule variable</li>
                      <li>• Effet d'une variable « toutes choses égales par ailleurs » (sur les variables mesurées)</li>
                      <li>• Lecture de l'importance relative des variables (après standardisation)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">⚖️ Défis</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Multicolinéarité entre variables</li>
                      <li>• Plus de données nécessaires</li>
                      <li>• Interprétation plus complexe</li>
                      <li>• Risque de surajustement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Métriques d'évaluation */}
      <EducationalCard title="📏 Comment évaluer une régression ?" type="concept">
        <div className="space-y-6">
          <p className="text-gray-700">
            Contrairement à la classification où on compte les bonnes réponses,
            en régression on mesure "à quel point on se trompe" dans nos prédictions numériques.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800">MAE</CardTitle>
                <p className="text-sm text-blue-600">Mean Absolute Error (erreur absolue moyenne)</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  <strong>Lecture :</strong> l'erreur moyenne en valeur absolue,
                  c'est-à-dire l'écart moyen entre les prédictions et la réalité, dans l'unité de la cible.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs"><strong>Formule :</strong> moyenne de |prédiction − réalité|</p>
                  <p className="text-xs"><strong>Exemple :</strong> MAE = 5 000 € : on se trompe en moyenne de 5 000 €</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800">RMSE</CardTitle>
                <p className="text-sm text-green-600">Root Mean Squared Error (racine de l'erreur quadratique moyenne)</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  <strong>Lecture :</strong> proche de la MAE, mais les erreurs sont élevées au carré avant la moyenne,
                  donc les grosses erreurs pèsent davantage : une erreur de 10 compte plus que deux erreurs de 5.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs"><strong>Caractéristique :</strong> sensible aux valeurs aberrantes</p>
                  <p className="text-xs"><strong>Usage :</strong> quand les grosses erreurs sont particulièrement coûteuses</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800">R²</CardTitle>
                <p className="text-sm text-purple-600">Coefficient de détermination</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  <strong>Lecture :</strong> la part de la variabilité de la cible que le modèle explique,
                  par rapport à un modèle qui prédirait toujours la moyenne.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs"><strong>Échelle :</strong> au plus 1 ; négatif si le modèle fait pire que la moyenne (possible sur des données de test)</p>
                  <p className="text-xs"><strong>Exemple :</strong> R² = 0,85 : le modèle explique 85 % de la variance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </EducationalCard>

      {/* Quiz enrichi sur la régression */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">🧠 Quiz : où en êtes-vous avec la régression ?</h3>

        <QuizCard
          question="Vous voulez prédire le nombre de pizzas vendues en fonction de la température. Quel type de problème est-ce ?"
          options={[
            "Classification binaire car il fait chaud ou froid",
            "Classification multi-classe car il y a plusieurs températures possibles",
            "Régression car on prédit une quantité numérique continue",
            "Clustering car on groupe les températures similaires"
          ]}
          correctAnswer={2}
          explanation="C'est un problème de régression car on prédit une quantité numérique (nombre de pizzas), qui peut prendre des valeurs continues. La température est la variable explicative, et les ventes la variable à prédire."
          difficulty="facile"
        />

        <QuizCard
          question="Votre modèle de régression linéaire a un R² de 0,85. Que signifie cette valeur ?"
          options={[
            "Le modèle se trompe de 85 % en moyenne",
            "Le modèle explique 85 % de la variabilité des données",
            "Le modèle est correct dans 85 % des cas",
            "Le modèle a une erreur de 15 %"
          ]}
          correctAnswer={1}
          explanation="R² = 0,85 signifie que le modèle explique 85 % de la variance (variabilité) de la cible. C'est une mesure de la qualité de l'ajustement : plus R² est proche de 1, mieux le modèle explique les variations observées. Il ne dit pas que 85 % des prédictions sont justes."
          difficulty="moyen"
        />

        <QuizCard
          question="Vous comparez deux modèles : MAE₁=1000€, RMSE₁=2000€ et MAE₂=1100€, RMSE₂=1200€. Que dit l'écart entre RMSE et MAE ?"
          options={[
            "Le modèle 1 est forcément meilleur car son MAE est plus faible",
            "Le modèle 2 est forcément meilleur car son RMSE est plus faible",
            "Le modèle 1 a quelques grosses erreurs qui tirent son RMSE vers le haut, le modèle 2 a des erreurs plus régulières",
            "Les deux modèles sont équivalents"
          ]}
          correctAnswer={2}
          explanation="Le RMSE met les erreurs au carré : il dépasse nettement le MAE quand quelques erreurs sont très grandes (modèle 1 : 2000 contre 1000) et reste proche du MAE quand les erreurs sont régulières (modèle 2 : 1200 contre 1100). Dire quel modèle est « meilleur » dépend de ce que l'on tolère : beaucoup de petites erreurs ou quelques grosses."
          difficulty="difficile"
        />

        <QuizCard
          question="Pour prédire le prix d'une voiture, quelles variables seraient les plus pertinentes ?"
          options={[
            "Uniquement l'année de fabrication",
            "Kilométrage, marque, année, état, options",
            "Couleur, prénom du propriétaire, jour d'achat",
            "Seulement le modèle de la voiture"
          ]}
          correctAnswer={1}
          explanation="Les variables pertinentes sont celles qui influencent logiquement le prix : kilométrage (usure), marque (prestige), année (dépréciation), état (qualité), options (valeur ajoutée). La couleur peut avoir un impact mineur, mais le prénom du propriétaire et le jour d'achat n'ont pas de lien logique avec la valeur."
          difficulty="facile"
        />

        <QuizCard
          question="Votre régression polynomiale de degré 10 a un R² de 0,99 sur l'entraînement et 0,40 sur le test. Diagnostic ?"
          options={[
            "Modèle parfait, R² très élevé",
            "Données de test corrompues",
            "Surapprentissage sévère, modèle trop complexe",
            "Besoin d'augmenter le degré polynomial"
          ]}
          correctAnswer={2}
          explanation="Cet écart énorme entre le R² d'entraînement (0,99) et celui de test (0,40) est un signe classique de surapprentissage. Le modèle de degré 10 est trop complexe et a « mémorisé » les données d'entraînement au lieu d'apprendre des régularités qui se généralisent."
          difficulty="difficile"
        />
      </div>

      {/* Conseils pratiques */}
      <EducationalCard title="🎯 Guide pratique pour réussir en régression" type="rappel">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-green-800 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Checklist avant de commencer
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Visualiser d'abord :</strong> Scatter plot pour voir la relation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Données propres :</strong> Outliers, valeurs manquantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Échelle cohérente :</strong> Normaliser si nécessaire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Features pertinentes :</strong> Logique métier importante</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyse des résidus
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Distribution :</strong> Résidus ~ normale centrée sur 0</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Homoscédasticité :</strong> Variance constante</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Indépendance :</strong> Pas de pattern dans les résidus</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Outliers :</strong> Points avec gros résidus à investiguer</span>
              </li>
            </ul>
          </div>
        </div>
      </EducationalCard>
    </div>
  );
};

export default RegressionSection;
