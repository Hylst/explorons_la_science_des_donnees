
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Code, Trophy, Lightbulb, Clock, Star, Award, Zap } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Enhanced PracticalExercises component with modern ES6 features
 * Provides interactive coding challenges with performance tracking
 */
const PracticalExercises = () => {
  // Enhanced state management with performance tracking
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [exerciseTimers, setExerciseTimers] = useState<Map<string, number>>(new Map());
  const [userProgress, setUserProgress] = useState({
    totalExercises: 0,
    completedCount: 0,
    averageTime: 0,
    skillsAcquired: new Set<string>()
  });
  
  // Performance optimization with refs
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const startTimes = useRef<Map<string, number>>(new Map());

  // Optimized toggle function with useCallback
  const toggleExercise = useCallback((exerciseId: string) => {
    setActiveExercise(prev => {
      const newActive = prev === exerciseId ? null : exerciseId;
      
      // Start timer when opening exercise
      if (newActive && !startTimes.current.has(exerciseId)) {
        startTimes.current.set(exerciseId, Date.now());
      }
      
      return newActive;
    });
  }, []);

  // Enhanced completion tracking with performance metrics
  const markCompleted = useCallback((exerciseId: string, skills: string[] = []) => {
    const completionTime = startTimes.current.has(exerciseId) 
      ? Date.now() - startTimes.current.get(exerciseId)!
      : 0;
    
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    setExerciseTimers(prev => new Map([...prev, [exerciseId, completionTime]]));
    
    // Update user progress
    setUserProgress(prev => ({
      ...prev,
      completedCount: prev.completedCount + 1,
      averageTime: prev.completedCount > 0 
        ? (prev.averageTime * prev.completedCount + completionTime) / (prev.completedCount + 1)
        : completionTime,
      skillsAcquired: new Set([...prev.skillsAcquired, ...skills])
    }));
    
    // Clear timer
    startTimes.current.delete(exerciseId);
  }, []);

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    const totalExercises = 6; // ex1 à ex6
    const completionRate = (completedExercises.size / totalExercises) * 100;
    const averageTimeMinutes = userProgress.averageTime / (1000 * 60);
    
    return {
      completionRate,
      averageTimeMinutes,
      skillsCount: userProgress.skillsAcquired.size,
      level: completionRate >= 80 ? 'Avancé' : completionRate >= 50 ? 'Intermédiaire' : 'Débutant'
    };
  }, [completedExercises.size, userProgress]);

  // Cleanup timers on unmount
  useEffect(() => {
    // Copie locale de la table : le nettoyage vide celle de la vie du composant (ref.current peut avoir changé au démontage)
    const timers = timerRefs.current;
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Enhanced ExerciseCard with performance tracking and modern features
  const ExerciseCard = useCallback(({ 
    id, 
    title, 
    difficulty, 
    duration, 
    description, 
    hints, 
    solution, 
    skills,
    points = 10
  }: {
    id: string;
    title: string;
    difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
    duration: string;
    description: string;
    hints: string[];
    solution: string;
    skills: string[];
    points?: number;
  }) => {
    const isCompleted = completedExercises.has(id);
    const completionTime = exerciseTimers.get(id);
    const isCurrentlyActive = startTimes.current.has(id);

    const difficultyColors = {
      'Débutant': 'bg-green-100 text-green-800 border-green-300',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Avancé': 'bg-red-100 text-red-800 border-red-300'
    };

    const difficultyIcons = {
      'Débutant': <Star className="h-4 w-4" />,
      'Intermédiaire': <Zap className="h-4 w-4" />,
      'Avancé': <Award className="h-4 w-4" />
    };

    return (
      <Card className={`border-l-4 transition-all duration-300 hover:shadow-lg ${
        isCompleted 
          ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100' 
          : isCurrentlyActive
          ? 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50'
          : 'border-l-blue-500 hover:border-l-blue-600'
      }`}>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
              {isCurrentlyActive && <Clock className="h-5 w-5 text-orange-500 animate-pulse" />}
              <span className={isCompleted ? 'text-green-700' : ''}>{title}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Badge className={`${difficultyColors[difficulty]} flex items-center gap-1`}>
                {difficultyIcons[difficulty]}
                {difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {duration}
              </Badge>
              <Badge variant="secondary">{points} pts</Badge>
            </div>
          </CardTitle>
          {completionTime && (
            <div className="text-sm text-green-600 flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Terminé en {Math.round(completionTime / (1000 * 60))} min
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="mb-4">{description}</p>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">🎯 Compétences développées :</h5>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => toggleExercise(`${id}-hints`)}
              variant="outline"
              size="sm"
              className="mr-2"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              {activeExercise === `${id}-hints` ? "Masquer les indices" : "Voir les indices"}
            </Button>
            
            <Button 
              onClick={() => toggleExercise(`${id}-solution`)}
              variant="outline"
              size="sm"
              className="mr-2"
            >
              <Code className="h-4 w-4 mr-1" />
              {activeExercise === `${id}-solution` ? "Masquer la solution" : "Voir la solution"}
            </Button>

            <Button 
              onClick={() => markCompleted(id, skills)}
              size="sm"
              variant={isCompleted ? "default" : "outline"}
              className="mr-2"
              disabled={isCompleted}
            >
              {isCompleted ? "✅ Terminé" : "Marquer comme terminé"}
            </Button>
          </div>

          {activeExercise === `${id}-hints` && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="font-semibold mb-2">💡 Indices :</h5>
              <ul className="text-sm space-y-1">
                {hints.map((hint, index) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </div>
          )}

          {activeExercise === `${id}-solution` && (
            <div className="mt-4">
              <div className="bg-gray-900 rounded-md overflow-hidden">
                <div className="px-4 py-2 bg-green-800 text-white text-sm">Solution</div>
                <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                  <code>{solution}</code>
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }, [completedExercises, activeExercise, exerciseTimers, markCompleted, toggleExercise]);

  // Progress Dashboard Component
  const ProgressDashboard = useMemo(() => (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Tableau de Bord - Votre Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{completedExercises.size}</div>
            <div className="text-sm text-gray-600">Exercices terminés</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{progressStats.level}</div>
            <div className="text-sm text-gray-600">Niveau actuel</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{progressStats.skillsCount}</div>
            <div className="text-sm text-gray-600">Compétences acquises</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {progressStats.averageTimeMinutes > 0 ? Math.round(progressStats.averageTimeMinutes) : 0}min
            </div>
            <div className="text-sm text-gray-600">Temps moyen</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression globale</span>
            <span>{Math.round(progressStats.completionRate)}%</span>
          </div>
          <Progress value={progressStats.completionRate} className="h-3" />
        </div>
        
        {progressStats.completionRate >= 100 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <Award className="h-5 w-5" />
              🎉 Félicitations ! Vous avez terminé tous les exercices !
            </div>
            <p className="text-sm text-green-600 mt-1">
              Vous avez de bonnes bases sur les concepts fondamentaux de la programmation pour la data science.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  ), [completedExercises.size, progressStats]);

  return (
    <section id="practical-exercises" className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">🏋️‍♀️ Exercices Pratiques : Musclez vos Compétences !</h2>
        <p className="text-lg text-gray-600 mb-6">
          Développez vos compétences avec des défis pratiques et des projets concrets. 
          Chaque exercice est conçu pour renforcer votre aisance avec la programmation data science.
        </p>
      </div>
      
      {ProgressDashboard}
      
      <CourseHighlight title="🎯 Philosophie : Apprendre en Faisant" type="concept">
        <p className="mb-3">
          La programmation, c'est comme le vélo : on n'apprend qu'en pratiquant ! 
          Ces exercices sont conçus pour vous faire progresser étape par étape, 
          du simple script à l'analyse complète.
        </p>
        <div className="bg-blue-100 p-3 rounded">
          <strong>Conseil :</strong> Ne regardez les solutions qu'après avoir vraiment essayé. 
          L'erreur est votre meilleure professeure !
        </div>
      </CourseHighlight>

      <Tabs defaultValue="beginner" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="beginner">🌱 Débutant</TabsTrigger>
          <TabsTrigger value="intermediate">🚀 Intermédiaire</TabsTrigger>
          <TabsTrigger value="advanced">⭐ Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="beginner" className="space-y-6">
          <ExerciseCard 
            id="ex1"
            title="🧮 Calculatrice de ROI Marketing"
            difficulty="Débutant"
            duration="30 min"
            description="Créez un script qui calcule le retour sur investissement (ROI) d'une campagne marketing et donne des recommandations automatiques."
            skills={["Variables", "Calculs", "Conditions", "Formatage"]}
            hints={[
              "ROI = (Revenus - Coûts) / Coûts * 100",
              "Utilisez des f-strings pour un affichage élégant",
              "Ajoutez des conditions pour les recommandations",
              "Pensez à gérer le cas où les coûts sont nuls"
            ]}
            solution={`# Calculatrice ROI Marketing
def calculer_roi_marketing():
    print("=== CALCULATRICE ROI MARKETING ===")
    
    # Saisie des données
    cout_campagne = float(input("Coût de la campagne (€): "))
    revenus_generes = float(input("Revenus générés (€): "))
    nb_conversions = int(input("Nombre de conversions: "))
    
    # Calculs
    if cout_campagne > 0:
        roi = ((revenus_generes - cout_campagne) / cout_campagne) * 100
        cout_par_conversion = cout_campagne / nb_conversions if nb_conversions > 0 else 0
    else:
        print("Erreur: Le coût ne peut pas être nul")
        return
    
    # Affichage des résultats
    print(f"\\n📊 RÉSULTATS:")
    print(f"💰 ROI: {roi:.1f}%")
    print(f"💵 Coût par conversion: {cout_par_conversion:.2f}€")
    print(f"💸 Bénéfice net: {revenus_generes - cout_campagne:.2f}€")
    
    # Recommandations automatiques
    print(f"\\n🎯 RECOMMANDATIONS:")
    if roi > 300:
        print("🚀 Excellent ROI ! Augmentez le budget de cette campagne.")
    elif roi > 100:
        print("✅ Bon ROI. Continuez cette stratégie.")
    elif roi > 0:
        print("⚠️ ROI positif mais faible. Optimisez la campagne.")
    else:
        print("❌ ROI négatif. Arrêtez ou repensez complètement la campagne.")
    
    if cout_par_conversion > 50:
        print("💡 Coût par conversion élevé. Travaillez sur l'optimisation.")

# Exécution
calculer_roi_marketing()`}
          />
          
          <ExerciseCard 
            id="ex6"
            title="🤖 Chatbot à règles pour Support Client"
            difficulty="Intermédiaire"
            duration="90 min"
            points={200}
            description="Développez un chatbot à règles (expressions régulières et réponses prédéfinies) qui reconnaît des intentions simples dans les questions clients et enregistre celles qu'il ne comprend pas."
            skills={["Classes", "Regex", "JSON", "Dictionnaires"]}
            hints={[
              "Utilisez des expressions régulières pour identifier les intentions",
              "Implémentez un système de scoring pour les réponses",
              "Créez une base de connaissances extensible",
              "Ajoutez un mécanisme d'apprentissage des nouvelles questions"
            ]}
            solution={`# Chatbot Intelligent pour Support Client
import re
import json
from datetime import datetime
from collections import defaultdict

class ChatbotSupport:
    def __init__(self):
        self.base_connaissances = {
            'salutations': {
                'patterns': [r'bonjour', r'salut', r'hello', r'bonsoir'],
                'responses': [
                    "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
                    "Salut ! Je suis là pour répondre à vos questions.",
                    "Hello ! En quoi puis-je vous être utile ?"
                ]
            },
            'commande': {
                'patterns': [r'commande', r'livraison', r'expédition', r'suivi'],
                'responses': [
                    "Pour suivre votre commande, utilisez le numéro de suivi dans votre email de confirmation.",
                    "Les délais de livraison sont généralement de 2-5 jours ouvrés.",
                    "Vous pouvez modifier votre commande dans les 2h suivant la validation."
                ]
            },
            'retour': {
                'patterns': [r'retour', r'remboursement', r'échange', r'garantie'],
                'responses': [
                    "Vous avez 30 jours pour retourner un article non satisfaisant.",
                    "Pour un retour, connectez-vous à votre compte et suivez la procédure.",
                    "Les frais de retour sont gratuits pour les articles défectueux."
                ]
            },
            'paiement': {
                'patterns': [r'paiement', r'carte', r'paypal', r'facture'],
                'responses': [
                    "Nous acceptons les cartes Visa, Mastercard et PayPal.",
                    "Vos informations de paiement sont sécurisées par cryptage SSL.",
                    "Vous recevrez votre facture par email après validation."
                ]
            }
        }
        
        self.historique_conversations = []
        self.questions_non_resolues = []
        self.statistiques = defaultdict(int)
    
    def analyser_intention(self, message):
        """Analyse l'intention de l'utilisateur basée sur le message"""
        message_lower = message.lower()
        scores = {}
        
        for intention, data in self.base_connaissances.items():
            score = 0
            for pattern in data['patterns']:
                if re.search(pattern, message_lower):
                    score += 1
            
            if score > 0:
                scores[intention] = score
        
        # Retourne l'intention avec le meilleur score
        if scores:
            return max(scores, key=scores.get)
        return None
    
    def generer_reponse(self, message, utilisateur_id=None):
        """Génère une réponse basée sur l'analyse du message"""
        intention = self.analyser_intention(message)
        
        # Enregistre la conversation
        conversation = {
            'timestamp': datetime.now(),
            'utilisateur_id': utilisateur_id,
            'message': message,
            'intention': intention
        }
        
        if intention:
            import random
            reponse = random.choice(self.base_connaissances[intention]['responses'])
            conversation['reponse'] = reponse
            conversation['resolu'] = True
            self.statistiques[intention] += 1
        else:
            reponse = self.gerer_question_inconnue(message)
            conversation['reponse'] = reponse
            conversation['resolu'] = False
            self.questions_non_resolues.append({
                'message': message,
                'timestamp': datetime.now(),
                'utilisateur_id': utilisateur_id
            })
        
        self.historique_conversations.append(conversation)
        return reponse
    
    def gerer_question_inconnue(self, message):
        """Gère les questions non reconnues"""
        responses_generiques = [
            "Je ne suis pas sûr de comprendre votre question. Pouvez-vous la reformuler ?",
            "Cette question nécessite l'intervention d'un agent. Je vous mets en relation.",
            "Désolé, je n'ai pas d'information sur ce sujet. Un conseiller va vous contacter."
        ]
        
        import random
        return random.choice(responses_generiques)
    
    def apprendre_nouvelle_reponse(self, message, intention, nouvelle_reponse):
        """Permet d'ajouter de nouvelles réponses à la base de connaissances"""
        if intention not in self.base_connaissances:
            self.base_connaissances[intention] = {
                'patterns': [],
                'responses': []
            }
        
        # Ajoute des mots-clés du message comme patterns
        mots_cles = re.findall(r'\\b\\w+\\b', message.lower())
        for mot in mots_cles:
            if len(mot) > 3:  # Ignore les mots trop courts
                pattern = f'\\\\b{re.escape(mot)}\\\\b'
                if pattern not in self.base_connaissances[intention]['patterns']:
                    self.base_connaissances[intention]['patterns'].append(pattern)
        
        # Ajoute la nouvelle réponse
        if nouvelle_reponse not in self.base_connaissances[intention]['responses']:
            self.base_connaissances[intention]['responses'].append(nouvelle_reponse)
    
    def generer_rapport_performance(self):
        """Génère un rapport de performance du chatbot"""
        total_conversations = len(self.historique_conversations)
        conversations_resolues = sum(1 for conv in self.historique_conversations if conv.get('resolu', False))
        
        taux_resolution = (conversations_resolues / total_conversations * 100) if total_conversations > 0 else 0
        
        rapport = f"""
🤖 RAPPORT DE PERFORMANCE CHATBOT
{'='*45}

📊 STATISTIQUES GÉNÉRALES:
• Total conversations: {total_conversations}
• Conversations résolues: {conversations_resolues}
• Taux de résolution: {taux_resolution:.1f}%
• Questions non résolues: {len(self.questions_non_resolues)}

🏆 INTENTIONS LES PLUS FRÉQUENTES:
"""
        
        for intention, count in sorted(self.statistiques.items(), key=lambda x: x[1], reverse=True):
            rapport += f"  • {intention.capitalize()}: {count} fois\\n"
        
        if self.questions_non_resolues:
            rapport += f"\\n❓ QUESTIONS NON RÉSOLUES RÉCENTES:\\n"
            for q in self.questions_non_resolues[-5:]:
                rapport += f"  • {q['message'][:50]}...\\n"
        
        return rapport

# Exemple d'utilisation
chatbot = ChatbotSupport()

# Simulation de conversations
conversations_test = [
    "Bonjour, j'ai un problème avec ma commande",
    "Comment puis-je retourner un article ?",
    "Quels sont vos moyens de paiement ?",
    "Où est ma livraison ?",
    "Je veux un remboursement",
    "Comment contacter le service client ?"
]

print("🤖 SIMULATION DE CONVERSATIONS:\\n")
for i, message in enumerate(conversations_test, 1):
    print(f"👤 Utilisateur {i}: {message}")
    reponse = chatbot.generer_reponse(message, f"user_{i}")
    print(f"🤖 Chatbot: {reponse}\\n")

# Apprentissage d'une nouvelle réponse
chatbot.apprendre_nouvelle_reponse(
    "Comment contacter le service client ?",
    "contact",
    "Vous pouvez nous contacter par email à support@example.com ou par téléphone au 01 23 45 67 89."
)

print(chatbot.generer_rapport_performance())`}
          />

          <ExerciseCard 
            id="ex2"
            title="📊 Analyseur de Ventes Mensuelles"
            difficulty="Débutant"
            duration="45 min"
            description="Analysez les données de vente sur 12 mois et identifiez les tendances, les meilleurs/pires mois, et calculez les prévisions."
            skills={["Listes", "Boucles", "Fonctions", "Statistiques de base"]}
            hints={[
              "Stockez les ventes dans une liste",
              "Utilisez min(), max(), sum() pour les calculs",
              "Créez des fonctions pour chaque analyse",
              "Ajoutez une prédiction simple (moyenne mobile)"
            ]}
            solution={`# Analyseur de Ventes Mensuelles
def analyser_ventes():
    mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
            'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    
    # Saisie des données (simulation avec des données d'exemple)
    ventes = [15000, 18000, 22000, 17000, 25000, 28000,
              32000, 29000, 24000, 21000, 19000, 35000]
    
    print("=== ANALYSE DES VENTES ANNUELLES ===")
    
    # Statistiques de base
    total_ventes = sum(ventes)
    moyenne_mensuelle = total_ventes / len(ventes)
    meilleur_mois_idx = ventes.index(max(ventes))
    pire_mois_idx = ventes.index(min(ventes))
    
    print(f"📈 STATISTIQUES GÉNÉRALES:")
    print(f"Total annuel: {total_ventes:,}€")
    print(f"Moyenne mensuelle: {moyenne_mensuelle:,.0f}€")
    print(f"Meilleur mois: {mois[meilleur_mois_idx]} ({max(ventes):,}€)")
    print(f"Pire mois: {mois[pire_mois_idx]} ({min(ventes):,}€)")
    
    # Analyse de tendance
    print(f"\\n📊 ANALYSE DE TENDANCE:")
    croissances = []
    for i in range(1, len(ventes)):
        croissance = ((ventes[i] - ventes[i-1]) / ventes[i-1]) * 100
        croissances.append(croissance)
        if abs(croissance) > 15:
            signe = "📈" if croissance > 0 else "📉"
            print(f"{signe} {mois[i-1]} → {mois[i]}: {croissance:+.1f}%")
    
    # Prévision simple (moyenne des 3 derniers mois)
    prevision = sum(ventes[-3:]) / 3
    print(f"\\n🔮 PRÉVISION JANVIER SUIVANT:")
    print(f"Estimation: {prevision:,.0f}€")
    
    # Recommandations
    print(f"\\n💡 RECOMMANDATIONS:")
    if moyenne_mensuelle > 25000:
        print("✅ Performance excellente maintenue")
    elif max(ventes) > moyenne_mensuelle * 1.3:
        print("🎯 Analysez les facteurs du meilleur mois pour les reproduire")
    
    variance = sum([(v - moyenne_mensuelle)**2 for v in ventes]) / len(ventes)
    if variance > 10000000:  # Forte variabilité
        print("⚠️ Ventes très irrégulières - stabilisez votre pipeline")

analyser_ventes()`}
          />
        </TabsContent>

        <TabsContent value="intermediate" className="space-y-6">
          <ExerciseCard 
            id="ex3"
            title="🛒 Système d'Analyse Panier E-commerce"
            difficulty="Intermédiaire"
            duration="60 min"
            description="Construisez un système qui analyse les habitudes d'achat, calcule la valeur vie client (CLV) et suggère des produits complémentaires."
            skills={["Dictionnaires", "Classes", "Pandas", "Analyse cross-sell"]}
            hints={[
              "Créez une classe Client avec ses achats",
              "Utilisez un dictionnaire pour les associations produits",
              "Calculez CLV = fréquence * valeur panier * durée de vie",
              "Implémentez la logique de recommandation"
            ]}
            solution={`import pandas as pd
from collections import defaultdict, Counter
from datetime import datetime, timedelta

class AnalyseurEcommerce:
    def __init__(self):
        self.transactions = []
        self.clients = {}
        self.associations_produits = defaultdict(list)
    
    def ajouter_transaction(self, client_id, produits, montant, date):
        transaction = {
            'client_id': client_id,
            'produits': produits,
            'montant': montant,
            'date': date
        }
        self.transactions.append(transaction)
        
        # Mise à jour client
        if client_id not in self.clients:
            self.clients[client_id] = {
                'achats': [],
                'montant_total': 0,
                'premiere_visite': date,
                'derniere_visite': date
            }
        
        self.clients[client_id]['achats'].append(transaction)
        self.clients[client_id]['montant_total'] += montant
        self.clients[client_id]['derniere_visite'] = max(
            self.clients[client_id]['derniere_visite'], date
        )
        
        # Associations produits (pour cross-sell)
        for i, produit1 in enumerate(produits):
            for produit2 in produits[i+1:]:
                self.associations_produits[produit1].append(produit2)
                self.associations_produits[produit2].append(produit1)
    
    def calculer_clv(self, client_id):
        if client_id not in self.clients:
            return 0
        
        client = self.clients[client_id]
        nb_achats = len(client['achats'])
        panier_moyen = client['montant_total'] / nb_achats
        
        # Fréquence d'achat (achats par mois)
        duree = (client['derniere_visite'] - client['premiere_visite']).days
        frequence_mensuelle = nb_achats / max(duree/30, 1)
        
        # CLV simplifié (24 mois)
        clv = panier_moyen * frequence_mensuelle * 24
        return clv
    
    def recommander_produits(self, produits_panier, top_n=3):
        recommendations = Counter()
        
        for produit in produits_panier:
            if produit in self.associations_produits:
                for produit_associe in self.associations_produits[produit]:
                    if produit_associe not in produits_panier:
                        recommendations[produit_associe] += 1
        
        return recommendations.most_common(top_n)
    
    def generer_rapport(self):
        print("=== RAPPORT ANALYSE E-COMMERCE ===")
        
        # Top clients par CLV
        clv_clients = [(cid, self.calculer_clv(cid)) for cid in self.clients.keys()]
        clv_clients.sort(key=lambda x: x[1], reverse=True)
        
        print(f"\\n👑 TOP 5 CLIENTS (CLV):")
        for i, (client_id, clv) in enumerate(clv_clients[:5], 1):
            print(f"{i}. Client {client_id}: {clv:.0f}€")
        
        # Produits les plus vendus
        tous_produits = []
        for t in self.transactions:
            tous_produits.extend(t['produits'])
        
        top_produits = Counter(tous_produits).most_common(5)
        print(f"\\n🏆 TOP 5 PRODUITS:")
        for i, (produit, count) in enumerate(top_produits, 1):
            print(f"{i}. {produit}: {count} ventes")
        
        # Statistiques générales
        ca_total = sum(t['montant'] for t in self.transactions)
        panier_moyen = ca_total / len(self.transactions)
        
        print(f"\\n📊 STATISTIQUES GÉNÉRALES:")
        print(f"CA Total: {ca_total:,.0f}€")
        print(f"Panier moyen: {panier_moyen:.2f}€")
        print(f"Nombre de clients: {len(self.clients)}")
        print(f"Nombre de transactions: {len(self.transactions)}")

# Simulation avec des données d'exemple
analyseur = AnalyseurEcommerce()

# Données de test
transactions_test = [
    ('C001', ['Laptop', 'Souris', 'Clavier'], 1200, datetime(2023, 1, 15)),
    ('C002', ['Smartphone', 'Coque', 'Écouteurs'], 800, datetime(2023, 1, 20)),
    ('C001', ['Écran', 'Câble HDMI'], 300, datetime(2023, 2, 10)),
    ('C003', ['Tablet', 'Stylet'], 500, datetime(2023, 1, 25)),
    ('C002', ['Chargeur', 'Batterie externe'], 80, datetime(2023, 2, 15)),
]

for transaction in transactions_test:
    analyseur.ajouter_transaction(*transaction)

analyseur.generer_rapport()

# Test recommandations
print(f"\\n🎯 RECOMMANDATIONS pour ['Laptop']:")
reco = analyseur.recommander_produits(['Laptop'])
for produit, score in reco:
    print(f"• {produit} (score: {score})")`}
          />

          <ExerciseCard 
            id="ex4"
            title="📈 Dashboard Automatisé de KPIs"
            difficulty="Intermédiaire"
            duration="75 min"
            description="Créez un dashboard qui lit des données de différentes sources, calcule des KPIs métier et génère des alertes automatiques."
            skills={["Pandas", "Matplotlib", "Fonctions avancées", "Gestion fichiers"]}
            hints={[
              "Utilisez pandas pour lire différents formats (CSV, Excel)",
              "Créez des fonctions pour chaque KPI",
              "Implémentez un système d'alertes avec seuils",
              "Générez des graphiques automatiquement"
            ]}
            solution={`import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import numpy as np

class DashboardKPIs:
    def __init__(self):
        self.data = {}
        self.kpis = {}
        self.alertes = []
        self.seuils = {
            'taux_conversion': {'min': 2.0, 'max': 10.0},
            'cao_mensuel': {'min': 5000, 'max': None},
            'taux_churn': {'min': None, 'max': 5.0},
            'satisfaction_client': {'min': 4.0, 'max': None}
        }
    
    def charger_donnees(self):
        # Simulation de données réelles
        np.random.seed(42)
        
        # Données de ventes
        dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')
        self.data['ventes'] = pd.DataFrame({
            'date': dates,
            'ventes': np.random.poisson(50, len(dates)) * np.random.uniform(20, 200, len(dates)),
            'visiteurs': np.random.poisson(2000, len(dates)),
            'conversions': np.random.poisson(80, len(dates))
        })
        
        # Données clients
        self.data['clients'] = pd.DataFrame({
            'client_id': range(1, 1001),
            'date_inscription': pd.date_range('2022-01-01', '2023-12-31', periods=1000),
            'date_derniere_commande': pd.date_range('2023-01-01', '2023-12-31', periods=1000),
            'satisfaction': np.random.uniform(1, 5, 1000),
            'clv': np.random.exponential(500, 1000)
        })
        
        print("✅ Données chargées avec succès")
    
    def calculer_kpis(self):
        print("\\n🔄 Calcul des KPIs en cours...")
        
        # KPI 1: Taux de conversion
        total_visiteurs = self.data['ventes']['visiteurs'].sum()
        total_conversions = self.data['ventes']['conversions'].sum()
        self.kpis['taux_conversion'] = (total_conversions / total_visiteurs) * 100
        
        # KPI 2: CA mensuel moyen
        ventes_mensuelles = self.data['ventes'].groupby(
            self.data['ventes']['date'].dt.to_period('M')
        )['ventes'].sum()
        self.kpis['cao_mensuel'] = ventes_mensuelles.mean()
        
        # KPI 3: Taux de churn (clients inactifs > 90 jours)
        # Date de référence = dernière date des données (datetime.now() donnerait 100 % de churn sur un jeu ancien)
        date_reference = self.data['ventes']['date'].max()
        date_limite = date_reference - timedelta(days=90)
        clients_actifs = (self.data['clients']['date_derniere_commande'] > date_limite).sum()
        self.kpis['taux_churn'] = ((len(self.data['clients']) - clients_actifs) / len(self.data['clients'])) * 100
        
        # KPI 4: Satisfaction client moyenne
        self.kpis['satisfaction_client'] = self.data['clients']['satisfaction'].mean()
        
        # KPI 5: CLV moyenne
        self.kpis['clv_moyenne'] = self.data['clients']['clv'].mean()
        
        print("✅ KPIs calculés")
    
    def generer_alertes(self):
        self.alertes = []
        
        for kpi, valeur in self.kpis.items():
            if kpi in self.seuils:
                seuil = self.seuils[kpi]
                
                if seuil['min'] and valeur < seuil['min']:
                    self.alertes.append({
                        'type': 'warning',
                        'kpi': kpi,
                        'valeur': valeur,
                        'message': f"{kpi} en dessous du seuil minimum ({valeur:.2f} < {seuil['min']})"
                    })
                
                if seuil['max'] and valeur > seuil['max']:
                    self.alertes.append({
                        'type': 'warning',
                        'kpi': kpi,
                        'valeur': valeur,
                        'message': f"{kpi} au-dessus du seuil maximum ({valeur:.2f} > {seuil['max']})"
                    })
    
    def creer_visualisations(self):
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle('Dashboard KPIs - Vue d\\'ensemble', fontsize=16, fontweight='bold')
        
        # Graphique 1: Évolution des ventes
        ventes_quotidiennes = self.data['ventes'].set_index('date')['ventes'].resample('W').sum()
        axes[0, 0].plot(ventes_quotidiennes.index, ventes_quotidiennes.values, linewidth=2)
        axes[0, 0].set_title('Évolution des ventes hebdomadaires')
        axes[0, 0].set_ylabel('Ventes (€)')
        
        # Graphique 2: Distribution satisfaction
        axes[0, 1].hist(self.data['clients']['satisfaction'], bins=20, alpha=0.7, color='skyblue')
        axes[0, 1].axvline(self.kpis['satisfaction_client'], color='red', linestyle='--', 
                          label=f'Moyenne: {self.kpis["satisfaction_client"]:.2f}')
        axes[0, 1].set_title('Distribution de la satisfaction client')
        axes[0, 1].set_xlabel('Score de satisfaction')
        axes[0, 1].legend()
        
        # Graphique 3: Taux de conversion mensuel
        conv_mensuel = self.data['ventes'].groupby(
            self.data['ventes']['date'].dt.to_period('M')
        ).apply(lambda x: (x['conversions'].sum() / x['visiteurs'].sum()) * 100)
        axes[1, 0].bar(range(len(conv_mensuel)), conv_mensuel.values, alpha=0.7, color='green')
        axes[1, 0].set_title('Taux de conversion mensuel')
        axes[1, 0].set_ylabel('Taux de conversion (%)')
        
        # Graphique 4: KPIs principaux
        kpis_display = ['taux_conversion', 'cao_mensuel', 'taux_churn', 'satisfaction_client']
        valeurs = [self.kpis[k] for k in kpis_display]
        axes[1, 1].bar(kpis_display, valeurs, alpha=0.7, color=['blue', 'green', 'orange', 'purple'])
        axes[1, 1].set_title('KPIs Principaux')
        axes[1, 1].tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        plt.show()
    
    def generer_rapport(self):
        print("\\n" + "="*50)
        print("📊 DASHBOARD KPIs - RAPPORT AUTOMATISÉ")
        print("="*50)
        print(f"📅 Généré le: {datetime.now().strftime('%d/%m/%Y à %H:%M')}")
        
        print(f"\\n📈 KPIs PRINCIPAUX:")
        print(f"• Taux de conversion: {self.kpis['taux_conversion']:.2f}%")
        print(f"• CA mensuel moyen: {self.kpis['cao_mensuel']:,.0f}€")
        print(f"• Taux de churn: {self.kpis['taux_churn']:.2f}%")
        print(f"• Satisfaction client: {self.kpis['satisfaction_client']:.2f}/5")
        print(f"• CLV moyenne: {self.kpis['clv_moyenne']:.0f}€")
        
        # Alertes
        if self.alertes:
            print(f"\\n🚨 ALERTES ({len(self.alertes)}):")
            for alerte in self.alertes:
                print(f"⚠️ {alerte['message']}")
        else:
            print(f"\\n✅ Aucune alerte - Tous les KPIs dans les normes")
        
        # Recommandations automatiques
        print(f"\\n💡 RECOMMANDATIONS:")
        if self.kpis['taux_conversion'] < 3:
            print("• Optimiser le funnel de conversion (landing pages, checkout)")
        if self.kpis['taux_churn'] > 10:
            print("• Mettre en place une campagne de réactivation client")
        if self.kpis['satisfaction_client'] < 3.5:
            print("• Analyser les points de friction dans l'expérience client")
        if len(self.alertes) == 0:
            print("• Continuer la stratégie actuelle, les résultats sont bons")
    
    def executer_dashboard(self):
        print("🚀 Lancement du Dashboard KPIs...")
        self.charger_donnees()
        self.calculer_kpis()
        self.generer_alertes()
        self.generer_rapport()
        self.creer_visualisations()

# Exécution du dashboard
dashboard = DashboardKPIs()
dashboard.executer_dashboard()`}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <ExerciseCard 
            id="ex5"
            title="🤖 Système de Prédiction de Churn"
            difficulty="Avancé"
            duration="120 min"
            description="Développez un système complet de machine learning pour prédire le churn client avec preprocessing, entraînement, évaluation et déploiement."
            skills={["ML Pipeline", "Feature Engineering", "Model Selection", "Évaluation"]}
            hints={[
              "Créez des features temporelles et comportementales",
              "Testez plusieurs algorithmes (Random Forest, XGBoost, etc.)",
              "Utilisez la validation croisée pour l'évaluation",
              "Implémentez un système de scoring en temps réel"
            ]}
            solution={`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class PredicteurChurn:
    def __init__(self):
        self.modeles = {}
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_importance = None
        
    def generer_donnees_clients(self, n_clients=5000):
        """Génère un dataset réaliste de clients"""
        np.random.seed(42)
        
        # Features de base
        data = {
            'client_id': range(1, n_clients + 1),
            'age': np.random.normal(35, 12, n_clients).astype(int),
            'anciennete_mois': np.random.exponential(24, n_clients).astype(int),
            'nb_commandes_total': np.random.poisson(15, n_clients),
            'montant_total_depense': np.random.exponential(800, n_clients),
            'panier_moyen': np.random.normal(85, 30, n_clients),
            'jours_depuis_derniere_commande': np.random.exponential(30, n_clients).astype(int),
            'nb_retours': np.random.poisson(2, n_clients),
            'score_satisfaction': np.random.normal(3.5, 1, n_clients),
            'canal_acquisition': np.random.choice(['web', 'mobile', 'magasin', 'social'], n_clients),
            'categorie_prefere': np.random.choice(['electromenager', 'vetements', 'sport', 'beaute'], n_clients),
            'utilise_app_mobile': np.random.choice([0, 1], n_clients, p=[0.3, 0.7]),
            'abonne_newsletter': np.random.choice([0, 1], n_clients, p=[0.4, 0.6])
        }
        
        df = pd.DataFrame(data)
        
        # Nettoyage des données aberrantes
        df['age'] = df['age'].clip(18, 80)
        df['score_satisfaction'] = df['score_satisfaction'].clip(1, 5)
        df['anciennete_mois'] = df['anciennete_mois'].clip(1, 120)
        
        # Feature engineering
        df['freq_commande_mensuelle'] = df['nb_commandes_total'] / df['anciennete_mois']
        df['taux_retour'] = df['nb_retours'] / df['nb_commandes_total'].replace(0, 1)
        df['clv_estimee'] = df['montant_total_depense'] / df['anciennete_mois'] * 12
        df['inactif_longue_duree'] = (df['jours_depuis_derniere_commande'] > 60).astype(int)
        
        # Génération du target (churn) basé sur des règles métier réalistes
        churn_prob = (
            0.1 +  # baseline
            0.3 * (df['jours_depuis_derniere_commande'] > 90) +
            0.2 * (df['score_satisfaction'] < 2.5) +
            0.15 * (df['freq_commande_mensuelle'] < 0.5) +
            0.1 * (df['taux_retour'] > 0.3) +
            -0.1 * df['utilise_app_mobile'] +
            -0.05 * df['abonne_newsletter']
        ).clip(0, 0.8)
        
        df['churn'] = np.random.binomial(1, churn_prob, n_clients)
        
        return df
    
    def preprocesser_donnees(self, df):
        """Préprocessing des données"""
        print("🔄 Préprocessing des données...")
        
        # Copie pour éviter de modifier l'original
        df_processed = df.copy()
        
        # Encodage des variables catégorielles
        categorical_cols = ['canal_acquisition', 'categorie_prefere']
        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                df_processed[col] = self.label_encoders[col].fit_transform(df_processed[col])
            else:
                df_processed[col] = self.label_encoders[col].transform(df_processed[col])
        
        # Gestion des valeurs manquantes (si applicable)
        df_processed = df_processed.fillna(df_processed.mean())
        
        return df_processed
    
    def analyser_donnees(self, df):
        """Analyse exploratoire des données"""
        print("\\n📊 ANALYSE EXPLORATOIRE")
        print("="*40)
        
        # Taux de churn global
        taux_churn = df['churn'].mean() * 100
        print(f"📈 Taux de churn global: {taux_churn:.1f}%")
        
        # Corrélations avec le churn
        correlations = df.select_dtypes(include=[np.number]).corr()['churn'].abs().sort_values(ascending=False)
        print(f"\\n🔗 Top 5 variables corrélées au churn:")
        for var, corr in correlations.head(6)[1:].items():  # Exclure churn lui-même
            print(f"• {var}: {corr:.3f}")
        
        # Visualisations
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Distribution des variables importantes
        axes[0, 0].hist([df[df['churn']==0]['jours_depuis_derniere_commande'], 
                        df[df['churn']==1]['jours_depuis_derniere_commande']], 
                       bins=30, alpha=0.7, label=['Non churn', 'Churn'])
        axes[0, 0].set_title('Jours depuis dernière commande')
        axes[0, 0].legend()
        
        # Satisfaction par statut churn
        df.boxplot(column='score_satisfaction', by='churn', ax=axes[0, 1])
        axes[0, 1].set_title('Satisfaction par statut churn')
        
        # Fréquence de commande
        df.boxplot(column='freq_commande_mensuelle', by='churn', ax=axes[1, 0])
        axes[1, 0].set_title('Fréquence de commande par statut churn')
        
        # Matrice de corrélation (top variables)
        top_vars = correlations.head(8).index.tolist()
        corr_matrix = df[top_vars].corr()
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0, ax=axes[1, 1])
        axes[1, 1].set_title('Corrélations variables importantes')
        
        plt.tight_layout()
        plt.show()
    
    def entrainer_modeles(self, X_train, X_test, y_train, y_test):
        """Entraînement et comparaison de plusieurs modèles"""
        print("\\n🤖 ENTRAÎNEMENT DES MODÈLES")
        print("="*40)
        
        # Définition des modèles
        modeles_config = {
            'Logistic Regression': LogisticRegression(random_state=42),
            'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(random_state=42)
        }
        
        resultats = {}
        
        for nom, modele in modeles_config.items():
            print(f"\\n📚 Entraînement {nom}...")
            
            # Entraînement
            modele.fit(X_train, y_train)
            
            # Prédictions
            y_pred = modele.predict(X_test)
            y_pred_proba = modele.predict_proba(X_test)[:, 1]
            
            # Métriques
            auc_score = roc_auc_score(y_test, y_pred_proba)
            cv_scores = cross_val_score(modele, X_train, y_train, cv=5, scoring='roc_auc')
            
            resultats[nom] = {
                'modele': modele,
                'auc': auc_score,
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std(),
                'predictions': y_pred,
                'probabilities': y_pred_proba
            }
            
            print(f"✅ AUC: {auc_score:.3f}")
            print(f"📊 CV Score: {cv_scores.mean():.3f} (+/- {cv_scores.std()*2:.3f})")
        
        # Sélection du meilleur modèle
        meilleur_modele = max(resultats.keys(), key=lambda x: resultats[x]['auc'])
        self.modeles = resultats
        self.meilleur_modele = meilleur_modele
        
        print(f"\\n🏆 Meilleur modèle: {meilleur_modele} (AUC: {resultats[meilleur_modele]['auc']:.3f})")
        
        return resultats
    
    def evaluer_modele(self, X_test, y_test):
        """Évaluation détaillée du meilleur modèle"""
        print(f"\\n📊 ÉVALUATION DÉTAILLÉE - {self.meilleur_modele}")
        print("="*50)
        
        modele_info = self.modeles[self.meilleur_modele]
        y_pred = modele_info['predictions']
        y_pred_proba = modele_info['probabilities']
        
        # Rapport de classification
        print("📋 Rapport de classification:")
        print(classification_report(y_test, y_pred))
        
        # Matrice de confusion
        cm = confusion_matrix(y_test, y_pred)
        print(f"\\n🎯 Matrice de confusion:")
        print(cm)
        
        # Importance des features (si disponible)
        if hasattr(modele_info['modele'], 'feature_importances_'):
            feature_names = [f'feature_{i}' for i in range(len(modele_info['modele'].feature_importances_))]
            importances = pd.DataFrame({
                'feature': feature_names,
                'importance': modele_info['modele'].feature_importances_
            }).sort_values('importance', ascending=False)
            
            self.feature_importance = importances
            
            print(f"\\n🔍 Top 10 features importantes:")
            for idx, row in importances.head(10).iterrows():
                print(f"• {row['feature']}: {row['importance']:.3f}")
        
        # Courbe ROC
        plt.figure(figsize=(12, 5))
        
        plt.subplot(1, 2, 1)
        fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
        plt.plot(fpr, tpr, linewidth=2, label=f'ROC Curve (AUC = {modele_info["auc"]:.3f})')
        plt.plot([0, 1], [0, 1], 'k--', linewidth=1)
        plt.xlabel('Taux de Faux Positifs')
        plt.ylabel('Taux de Vrais Positifs')
        plt.title('Courbe ROC')
        plt.legend()
        plt.grid(True)
        
        # Distribution des scores de prédiction
        plt.subplot(1, 2, 2)
        plt.hist([y_pred_proba[y_test==0], y_pred_proba[y_test==1]], 
                bins=30, alpha=0.7, label=['Non churn', 'Churn'])
        plt.xlabel('Score de probabilité de churn')
        plt.ylabel('Fréquence')
        plt.title('Distribution des scores de prédiction')
        plt.legend()
        plt.grid(True)
        
        plt.tight_layout()
        plt.show()
    
    def predire_churn_client(self, donnees_client):
        """Prédiction pour un client spécifique"""
        modele = self.modeles[self.meilleur_modele]['modele']
        
        # Preprocessing des données du client
        donnees_processed = self.preprocesser_donnees(pd.DataFrame([donnees_client]))
        
        # Sélection des features utilisées pour l'entraînement
        features_cols = [col for col in donnees_processed.columns if col not in ['client_id', 'churn']]
        X_client = donnees_processed[features_cols]
        
        # Prédiction
        proba_churn = modele.predict_proba(X_client)[0, 1]
        prediction = modele.predict(X_client)[0]
        
        return {
            'probabilite_churn': proba_churn,
            'prediction': 'Churn' if prediction == 1 else 'Fidèle',
            'risque': 'Élevé' if proba_churn > 0.7 else 'Modéré' if proba_churn > 0.3 else 'Faible'
        }
    
    def pipeline_complet(self):
        """Exécution du pipeline complet"""
        print("🚀 LANCEMENT DU PIPELINE DE PRÉDICTION DE CHURN")
        print("="*60)
        
        # 1. Génération des données
        print("1️⃣ Génération des données...")
        df = self.generer_donnees_clients()
        
        # 2. Analyse exploratoire
        self.analyser_donnees(df)
        
        # 3. Préprocessing
        df_processed = self.preprocesser_donnees(df)
        
        # 4. Préparation train/test
        feature_cols = [col for col in df_processed.columns if col not in ['client_id', 'churn']]
        X = df_processed[feature_cols]
        y = df_processed['churn']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scaling
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # 5. Entraînement des modèles
        self.entrainer_modeles(X_train_scaled, X_test_scaled, y_train, y_test)
        
        # 6. Évaluation
        self.evaluer_modele(X_test_scaled, y_test)
        
        # 7. Test sur un client exemple
        print("\\n🧪 TEST SUR UN CLIENT EXEMPLE")
        print("="*35)
        
        client_test = {
            'age': 45,
            'anciennete_mois': 36,
            'nb_commandes_total': 8,
            'montant_total_depense': 450,
            'panier_moyen': 56,
            'jours_depuis_derniere_commande': 120,
            'nb_retours': 3,
            'score_satisfaction': 2.1,
            'canal_acquisition': 'web',
            'categorie_prefere': 'electromenager',
            'utilise_app_mobile': 0,
            'abonne_newsletter': 1,
            'freq_commande_mensuelle': 8/36,
            'taux_retour': 3/8,
            'clv_estimee': (450/36)*12,
            'inactif_longue_duree': 1
        }
        
        resultat = self.predire_churn_client(client_test)
        print(f"👤 Client test - Probabilité de churn: {resultat['probabilite_churn']:.1%}")
        print(f"🎯 Prédiction: {resultat['prediction']}")
        print(f"⚠️ Niveau de risque: {resultat['risque']}")
        
        return df, self.modeles

# Exécution du système complet
predicteur = PredicteurChurn()
donnees, modeles = predicteur.pipeline_complet()`}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-purple-600" />
          Système de Progression
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedExercises.size}
            </div>
            <div className="text-sm text-gray-600">Exercices terminés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((completedExercises.size / 6) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Progression</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {completedExercises.size >= 3 ? "Avancé" : completedExercises.size >= 1 ? "Intermédiaire" : "Débutant"}
            </div>
            <div className="text-sm text-gray-600">Niveau atteint</div>
          </div>
        </div>
        
        {completedExercises.size >= 6 && (
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            <h4 className="font-semibold text-yellow-800 mb-2">🎉 Félicitations !</h4>
            <p className="text-sm text-yellow-700">
              Vous avez terminé tous les exercices ! Vous avez de bonnes bases pour aborder des projets
              de data science réels. Continuez avec les sections Machine Learning et projets avancés !
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PracticalExercises;
