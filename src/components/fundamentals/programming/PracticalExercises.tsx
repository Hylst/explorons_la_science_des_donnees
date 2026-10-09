
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Code, Trophy, Lightbulb, Star, Award, Zap } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Les six exercices de la page : ex1 à ex6
const TOTAL_EXERCISES = 6;

// Clés des panneaux ouverts : « ex1-hints » (indices) ou « ex1-solution » (solution)
interface PracticeContextValue {
  completedExercises: Set<string>;
  activePanel: string | null;
  togglePanel: (panelKey: string) => void;
  markCompleted: (exerciseId: string, skills: string[]) => void;
}

const PracticeContext = createContext<PracticeContextValue | null>(null);

const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) throw new Error("ExerciseCard doit être rendu à l'intérieur de PracticalExercises");
  return context;
};

type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé';

interface ExerciseCardProps {
  id: string;
  title: string;
  difficulty: Difficulty;
  duration: string;
  description: string;
  hints: string[];
  solution: string;
  skills: string[];
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  'Débutant': 'bg-green-100 text-green-800 border-green-300',
  'Intermédiaire': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Avancé': 'bg-red-100 text-red-800 border-red-300'
};

const DIFFICULTY_ICONS: Record<Difficulty, ReactNode> = {
  'Débutant': <Star className="h-4 w-4" />,
  'Intermédiaire': <Zap className="h-4 w-4" />,
  'Avancé': <Award className="h-4 w-4" />
};

// Défini hors de PracticalExercises : un composant créé dans le rendu du parent est remplacé à chaque clic,
// ce qui détruit les boutons (le focus clavier se perd) et le contenu ouvert.
const ExerciseCard = ({ id, title, difficulty, duration, description, hints, solution, skills }: ExerciseCardProps) => {
  const { completedExercises, activePanel, togglePanel, markCompleted } = usePractice();
  const isCompleted = completedExercises.has(id);

  return (
    <Card className={`border-l-4 transition-all duration-300 hover:shadow-lg ${
      isCompleted
        ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100'
        : 'border-l-blue-500 hover:border-l-blue-600'
    }`}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
            <span className={isCompleted ? 'text-green-700' : ''}>{title}</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className={`${DIFFICULTY_COLORS[difficulty]} flex items-center gap-1`}>
              {DIFFICULTY_ICONS[difficulty]}
              {difficulty}
            </Badge>
            <Badge variant="outline">{duration} (indicatif)</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>

        <div className="mb-4">
          <h5 className="font-semibold mb-2">🎯 Compétences travaillées :</h5>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => togglePanel(`${id}-hints`)}
            variant="outline"
            size="sm"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            {activePanel === `${id}-hints` ? "Masquer les indices" : "Voir les indices"}
          </Button>

          <Button
            onClick={() => togglePanel(`${id}-solution`)}
            variant="outline"
            size="sm"
          >
            <Code className="h-4 w-4 mr-1" />
            {activePanel === `${id}-solution` ? "Masquer la solution" : "Voir la solution"}
          </Button>

          <Button
            onClick={() => markCompleted(id, skills)}
            size="sm"
            variant={isCompleted ? "default" : "outline"}
            className={isCompleted ? "bg-green-700 hover:bg-green-800 text-white" : ""}
            disabled={isCompleted}
          >
            {isCompleted ? "✅ Terminé" : "Marquer comme terminé"}
          </Button>
        </div>

        {activePanel === `${id}-hints` && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h5 className="font-semibold mb-2">💡 Indices :</h5>
            <ul className="text-sm space-y-1">
              {hints.map((hint, index) => (
                <li key={index}>• {hint}</li>
              ))}
            </ul>
          </div>
        )}

        {activePanel === `${id}-solution` && (
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
};

/**
 * Six exercices corrigés (débutant, intermédiaire, avancé). Le suivi (exercices marqués terminés, compétences
 * travaillées) reste dans la page : il n'est pas enregistré et repart de zéro au rechargement.
 */
const PracticalExercises = () => {
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [skillsWorked, setSkillsWorked] = useState<Set<string>>(new Set());

  // Ouvre ou ferme le panneau demandé (un seul panneau ouvert à la fois)
  const togglePanel = useCallback((panelKey: string) => {
    setActivePanel(prev => (prev === panelKey ? null : panelKey));
  }, []);

  const markCompleted = useCallback((exerciseId: string, skills: string[]) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    setSkillsWorked(prev => new Set([...prev, ...skills]));
  }, []);

  const completionRate = (completedExercises.size / TOTAL_EXERCISES) * 100;

  const contextValue = useMemo(
    () => ({ completedExercises, activePanel, togglePanel, markCompleted }),
    [completedExercises, activePanel, togglePanel, markCompleted]
  );

  return (
    <PracticeContext.Provider value={contextValue}>
    <section id="practical-exercises" className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Exercices pratiques</h2>
        <p className="text-lg text-gray-600 mb-6">
          Six exercices corrigés, du script de quelques lignes à un petit projet de machine learning.
          Chacun propose des indices, puis une solution à comparer avec la vôtre.
        </p>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Votre suivi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{completedExercises.size} / {TOTAL_EXERCISES}</div>
              <div className="text-sm text-gray-600">Exercices terminés</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{skillsWorked.size}</div>
              <div className="text-sm text-gray-600">Compétences travaillées</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</div>
              <div className="text-sm text-gray-600">Progression</div>
            </div>
          </div>

          <Progress value={completionRate} className="h-3" />
          <p className="text-xs text-gray-600 mt-2">
            Ce suivi reste dans la page : vous décidez vous-même quand un exercice est terminé, et rien n'est enregistré.
          </p>

          {completedExercises.size >= TOTAL_EXERCISES && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                Vous avez marqué les six exercices comme terminés. Pour la suite, la page{" "}
                <Link to="/machine-learning" className="underline">Machine learning</Link> et les{" "}
                <Link to="/projects" className="underline">projets guidés</Link> du site prolongent ces exercices.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CourseHighlight title="Apprendre en faisant" type="concept">
        <p className="mb-3">
          On apprend à programmer surtout en écrivant du code et en le faisant échouer. Ces exercices vont du
          simple script à une analyse complète, étape par étape.
        </p>
        <div className="bg-blue-100 p-3 rounded">
          <strong>Conseil :</strong>{" "}
          essayez d'abord seul, puis lisez les indices, et ne regardez la solution qu'à la fin : une erreur
          comprise apprend plus qu'une solution recopiée.
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
            description="Créez un script qui calcule le retour sur investissement (ROI) d'une campagne marketing à partir de son coût et de ses revenus, puis commente le résultat selon des seuils que vous choisissez."
            skills={["Variables", "Calculs", "Conditions", "Formatage"]}
            hints={[
              "ROI = (Revenus - Coûts) / Coûts * 100",
              "Utilisez des f-strings pour un affichage élégant",
              "Ajoutez des conditions pour commenter le résultat",
              "Pensez à gérer le cas où les coûts sont nuls"
            ]}
            solution={`# Calculatrice ROI Marketing
# (à exécuter dans un terminal ou un notebook : input() n'est pas disponible dans l'éditeur du site)
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
    # Lecture des résultats (seuils choisis pour l'exercice : à adapter à votre activité)
    print("\\n🎯 LECTURE:")
    if roi > 300:
        print("🚀 ROI très élevé : la campagne mérite d'être étudiée pour être étendue.")
    elif roi > 100:
        print("✅ ROI correct : la campagne est rentable.")
    elif roi > 0:
        print("⚠️ ROI positif mais faible : cherchez à réduire le coût ou à augmenter les revenus.")
    else:
        print("❌ ROI négatif : la campagne a coûté plus qu'elle n'a rapporté.")

    if cout_par_conversion > 50:
        print("💡 Coût par conversion élevé (au-delà de 50 € dans cet exercice).")

# Exécution
calculer_roi_marketing()`}
          />
          
          <ExerciseCard 
            id="ex2"
            title="📊 Analyseur de Ventes Mensuelles"
            difficulty="Débutant"
            duration="45 min"
            description="Analysez douze mois de ventes (données d'exemple) : meilleur et moins bon mois, variations d'un mois à l'autre, puis une estimation simple pour le mois suivant."
            skills={["Listes", "Boucles", "Fonctions", "Statistiques de base"]}
            hints={[
              "Stockez les ventes dans une liste",
              "Utilisez min(), max(), sum() pour les calculs",
              "Créez des fonctions pour chaque analyse",
              "Pour l'estimation du mois suivant, essayez la moyenne des trois derniers mois (moyenne mobile)"
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
            title="🛒 Analyse de paniers e-commerce"
            difficulty="Intermédiaire"
            duration="60 min"
            description="Construisez une classe qui analyse des achats (données d'exemple), estime la valeur vie client (CLV) de façon simplifiée et suggère des produits souvent achetés ensemble."
            skills={["Dictionnaires", "Classes", "Counter", "Ventes croisées"]}
            hints={[
              "Créez une classe Client avec ses achats",
              "Utilisez un dictionnaire pour les associations produits",
              "Une CLV simplifiée : fréquence d'achat * panier moyen * durée de vie estimée",
              "Implémentez la logique de recommandation"
            ]}
            solution={`from collections import defaultdict, Counter
from datetime import datetime

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
        
        # Fréquence d'achat (achats par mois). On compte au moins 3 mois d'observation :
        # sur une période plus courte, la fréquence serait gonflée (un client observé 10 jours
        # avec 2 achats ne les renouvellera pas tous les 5 jours pendant 2 ans).
        duree = (client['derniere_visite'] - client['premiere_visite']).days
        frequence_mensuelle = nb_achats / max(duree/30, 3)

        # CLV simplifiée : projection sur 24 mois du panier moyen et de la fréquence observés.
        # C'est une estimation très sensible à un historique court, pas une mesure.
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
            title="📈 Tableau de bord automatisé de KPIs"
            difficulty="Intermédiaire"
            duration="75 min"
            description="Créez un tableau de bord qui calcule des indicateurs (KPIs) à partir de données de ventes et de clients, déclenche des alertes quand un seuil est franchi et trace des graphiques. La solution travaille sur des données simulées."
            skills={["pandas", "Matplotlib", "Classes", "Seuils d'alerte"]}
            hints={[
              "Lisez vos données avec pandas (pd.read_csv, pd.read_excel) ; la solution les simule",
              "Créez des fonctions pour chaque KPI",
              "Implémentez un système d'alertes avec seuils",
              "Générez des graphiques automatiquement"
            ]}
            solution={`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

class DashboardKPIs:
    def __init__(self):
        self.data = {}
        self.kpis = {}
        self.alertes = []
        # Seuils d'alerte choisis pour l'exercice : à adapter à votre activité
        self.seuils = {
            'taux_conversion': {'min': 2.0, 'max': 10.0},
            'ca_mensuel': {'min': 5000, 'max': None},
            'taux_churn': {'min': None, 'max': 5.0},
            'satisfaction_client': {'min': 4.0, 'max': None}
        }

    def charger_donnees(self):
        # Données simulées (à remplacer par pd.read_csv ou pd.read_excel sur vos fichiers)
        np.random.seed(42)

        # Données de ventes
        dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')
        self.data['ventes'] = pd.DataFrame({
            'date': dates,
            'ventes': np.random.poisson(50, len(dates)) * np.random.uniform(20, 200, len(dates)),
            'visiteurs': np.random.poisson(2000, len(dates)),
            'conversions': np.random.poisson(80, len(dates))
        })

        # Données clients : la dernière commande date de quelques dizaines de jours avant la fin de l'année
        fin = dates.max()
        self.data['clients'] = pd.DataFrame({
            'client_id': range(1, 1001),
            'date_derniere_commande': fin - pd.to_timedelta(np.random.exponential(40, 1000), unit='D'),
            'satisfaction': np.random.uniform(1, 5, 1000),
            'clv': np.random.exponential(500, 1000)
        })

        print("✅ Données chargées")

    def calculer_kpis(self):
        print("\\n🔄 Calcul des KPIs en cours...")

        # KPI 1 : taux de conversion (conversions / visiteurs)
        total_visiteurs = self.data['ventes']['visiteurs'].sum()
        total_conversions = self.data['ventes']['conversions'].sum()
        self.kpis['taux_conversion'] = (total_conversions / total_visiteurs) * 100

        # KPI 2 : chiffre d'affaires mensuel moyen
        ventes_mensuelles = self.data['ventes'].groupby(
            self.data['ventes']['date'].dt.to_period('M')
        )['ventes'].sum()
        self.kpis['ca_mensuel'] = ventes_mensuelles.mean()

        # KPI 3 : taux de départ (churn), ici les clients sans commande depuis plus de 90 jours
        # Date de référence = dernière date des données (datetime.now() donnerait 100 % de churn sur un jeu ancien)
        date_reference = self.data['ventes']['date'].max()
        date_limite = date_reference - timedelta(days=90)
        clients_actifs = (self.data['clients']['date_derniere_commande'] > date_limite).sum()
        self.kpis['taux_churn'] = ((len(self.data['clients']) - clients_actifs) / len(self.data['clients'])) * 100

        # KPI 4 : satisfaction moyenne
        self.kpis['satisfaction_client'] = self.data['clients']['satisfaction'].mean()

        # KPI 5 : valeur vie client moyenne (colonne clv des données)
        self.kpis['clv_moyenne'] = self.data['clients']['clv'].mean()

        print("✅ KPIs calculés")

    def generer_alertes(self):
        self.alertes = []

        for kpi, valeur in self.kpis.items():
            if kpi in self.seuils:
                seuil = self.seuils[kpi]

                # "is not None" et non un simple "if seuil['min']" : un seuil égal à 0 serait ignoré
                if seuil['min'] is not None and valeur < seuil['min']:
                    self.alertes.append({
                        'kpi': kpi,
                        'valeur': valeur,
                        'message': f"{kpi} en dessous du seuil minimum ({valeur:.2f} < {seuil['min']})"
                    })

                if seuil['max'] is not None and valeur > seuil['max']:
                    self.alertes.append({
                        'kpi': kpi,
                        'valeur': valeur,
                        'message': f"{kpi} au-dessus du seuil maximum ({valeur:.2f} > {seuil['max']})"
                    })

    def creer_visualisations(self):
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle("Tableau de bord des KPIs : vue d'ensemble (données simulées)", fontsize=16, fontweight='bold')

        # Graphique 1 : évolution hebdomadaire des ventes
        ventes_hebdo = self.data['ventes'].set_index('date')['ventes'].resample('W').sum()
        axes[0, 0].plot(ventes_hebdo.index, ventes_hebdo.values, linewidth=2)
        axes[0, 0].set_title('Évolution des ventes hebdomadaires')
        axes[0, 0].set_ylabel('Ventes (€)')

        # Graphique 2 : distribution de la satisfaction
        axes[0, 1].hist(self.data['clients']['satisfaction'], bins=20, alpha=0.7, color='skyblue')
        axes[0, 1].axvline(self.kpis['satisfaction_client'], color='red', linestyle='--',
                          label=f'Moyenne : {self.kpis["satisfaction_client"]:.2f}')
        axes[0, 1].set_title('Distribution de la satisfaction client')
        axes[0, 1].set_xlabel('Score de satisfaction')
        axes[0, 1].legend()

        # Graphique 3 : taux de conversion mensuel (somme des conversions / somme des visiteurs)
        mensuel = self.data['ventes'].groupby(
            self.data['ventes']['date'].dt.to_period('M')
        )[['conversions', 'visiteurs']].sum()
        conv_mensuel = mensuel['conversions'] / mensuel['visiteurs'] * 100
        axes[1, 0].bar(range(len(conv_mensuel)), conv_mensuel.values, alpha=0.7, color='green')
        axes[1, 0].set_title('Taux de conversion mensuel')
        axes[1, 0].set_xlabel('Mois')
        axes[1, 0].set_ylabel('Taux de conversion (%)')

        # Graphique 4 : les KPIs exprimés en pourcentage (on ne mélange pas des euros et des pourcentages sur un même axe)
        kpis_pct = ['taux_conversion', 'taux_churn']
        axes[1, 1].bar(kpis_pct, [self.kpis[k] for k in kpis_pct], alpha=0.7, color=['blue', 'orange'])
        axes[1, 1].set_title('KPIs en pourcentage')
        axes[1, 1].set_ylabel('%')

        plt.tight_layout()
        plt.show()

    def generer_rapport(self):
        print("\\n" + "="*50)
        print("📊 TABLEAU DE BORD DES KPIs : RAPPORT AUTOMATISÉ")
        print("="*50)
        print(f"📅 Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}")

        print("\\n📈 KPIs PRINCIPAUX :")
        print(f"• Taux de conversion : {self.kpis['taux_conversion']:.2f}%")
        print(f"• CA mensuel moyen : {self.kpis['ca_mensuel']:,.0f}€")
        print(f"• Taux de churn : {self.kpis['taux_churn']:.2f}%")
        print(f"• Satisfaction client : {self.kpis['satisfaction_client']:.2f}/5")
        print(f"• CLV moyenne : {self.kpis['clv_moyenne']:.0f}€")

        # Alertes
        if self.alertes:
            print(f"\\n🚨 ALERTES ({len(self.alertes)}) :")
            for alerte in self.alertes:
                print(f"⚠️ {alerte['message']}")
        else:
            print("\\n✅ Aucune alerte : tous les KPIs respectent les seuils")

        # Pistes de lecture (règles simples, à ajuster)
        print("\\n💡 PISTES :")
        if self.kpis['taux_conversion'] < 3:
            print("• Examiner le parcours d'achat (pages d'atterrissage, paiement)")
        if self.kpis['taux_churn'] > 10:
            print("• Envisager une campagne de réactivation des clients inactifs")
        if self.kpis['satisfaction_client'] < 3.5:
            print("• Chercher les points de friction dans l'expérience client")
        if len(self.alertes) == 0:
            print("• Rien à signaler sur cette période")

    def executer_dashboard(self):
        print("🚀 Lancement du tableau de bord des KPIs...")
        self.charger_donnees()
        self.calculer_kpis()
        self.generer_alertes()
        self.generer_rapport()
        self.creer_visualisations()

# Exécution
dashboard = DashboardKPIs()
dashboard.executer_dashboard()`}
          />

          <ExerciseCard 
            id="ex6"
            title="🤖 Chatbot à règles pour un support client"
            difficulty="Intermédiaire"
            duration="90 min"
            description="Développez un chatbot à règles (expressions régulières et réponses prédéfinies) qui reconnaît des intentions simples dans les questions clients et enregistre celles qu'il ne comprend pas."
            skills={["Classes", "Expressions régulières", "Dictionnaires", "Listes"]}
            hints={[
              "Utilisez des expressions régulières pour identifier les intentions",
              "Comptez, pour chaque intention, le nombre de motifs reconnus et gardez la meilleure",
              "Créez une base de connaissances extensible",
              "Prévoyez un moyen d'ajouter de nouvelles réponses à la base de connaissances"
            ]}
            solution={`# Chatbot à règles pour un support client (boutique fictive : les réponses sont des exemples)
import re
import random
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
                    "Vos informations de paiement sont chiffrées en transit (TLS).",
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
        
        return random.choice(responses_generiques)
    
    def apprendre_nouvelle_reponse(self, message, intention, nouvelle_reponse):
        """Permet d'ajouter de nouvelles réponses à la base de connaissances"""
        if intention not in self.base_connaissances:
            self.base_connaissances[intention] = {
                'patterns': [],
                'responses': []
            }
        
        # Ajoute les mots du message comme patterns (limite : les mots fréquents comme « comment » seraient aussi retenus ; une liste de mots vides serait à ajouter)
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
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <ExerciseCard 
            id="ex5"
            title="🤖 Prédire le départ de clients (churn)"
            difficulty="Avancé"
            duration="120 min"
            description="Construisez une chaîne complète de machine learning sur des clients simulés : préparation des variables, comparaison de modèles par validation croisée, évaluation sur un jeu de test et prédiction pour un nouveau client."
            skills={["Chaîne de ML", "Variables dérivées", "Choix de modèle", "Évaluation"]}
            hints={[
              "Créez des variables dérivées à partir du comportement d'achat (fréquence, retours, inactivité)",
              "Testez plusieurs algorithmes (Random Forest, XGBoost, etc.)",
              "Utilisez la validation croisée pour l'évaluation",
              "Appliquez au nouveau client exactement la même préparation qu'à l'entraînement"
            ]}
            solution={`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve

class PredicteurChurn:
    def __init__(self):
        self.modeles = {}
        self.scaler = StandardScaler()
        self.colonnes = None          # colonnes (et leur ordre) vues à l'entraînement
        self.meilleur_modele = None
        self.feature_importance = None

    @staticmethod
    def ajouter_variables_derivees(df):
        """Variables calculées à partir des colonnes de base"""
        df = df.copy()
        df['freq_commande_mensuelle'] = df['nb_commandes_total'] / df['anciennete_mois']
        df['taux_retour'] = df['nb_retours'] / df['nb_commandes_total'].replace(0, 1)
        df['clv_estimee'] = df['montant_total_depense'] / df['anciennete_mois'] * 12
        df['inactif_longue_duree'] = (df['jours_depuis_derniere_commande'] > 60).astype(int)
        return df

    def generer_donnees_clients(self, n_clients=5000):
        """Simule des clients : aucune de ces données n'est réelle"""
        np.random.seed(42)

        df = pd.DataFrame({
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
        })

        # Valeurs bornées à une plage plausible
        df['age'] = df['age'].clip(18, 80)
        df['score_satisfaction'] = df['score_satisfaction'].clip(1, 5)
        df['anciennete_mois'] = df['anciennete_mois'].clip(1, 120)

        # La cible (churn) suit des règles choisies arbitrairement pour l'exemple. Le modèle ne fera que les retrouver,
        # avec du bruit : il ne dit rien sur de vrais clients.
        d = self.ajouter_variables_derivees(df)
        churn_prob = (
            0.1 +
            0.3 * (d['jours_depuis_derniere_commande'] > 90) +
            0.2 * (d['score_satisfaction'] < 2.5) +
            0.15 * (d['freq_commande_mensuelle'] < 0.5) +
            0.1 * (d['taux_retour'] > 0.3) -
            0.1 * d['utilise_app_mobile'] -
            0.05 * d['abonne_newsletter']
        ).clip(0, 0.8)
        df['churn'] = np.random.binomial(1, churn_prob, n_clients)
        return df

    def preparer_variables(self, df):
        """Variables dérivées + une colonne 0/1 par catégorie (même traitement à l'entraînement et à la prédiction)"""
        X = self.ajouter_variables_derivees(df.drop(columns=['client_id', 'churn'], errors='ignore'))
        return pd.get_dummies(X, columns=['canal_acquisition', 'categorie_prefere'], dtype=int)

    def analyser_donnees(self, df):
        """Analyse exploratoire"""
        print("\\n📊 ANALYSE EXPLORATOIRE")
        print("="*40)

        df = self.ajouter_variables_derivees(df)
        taux_churn = df['churn'].mean() * 100
        print(f"📈 Taux de churn global : {taux_churn:.1f}%")
        print("   (classe minoritaire : regardez le rappel de la classe 1, pas seulement l'exactitude)")

        # Corrélations (en valeur absolue) avec le churn
        numeriques = df.select_dtypes(include=[np.number]).drop(columns='client_id')
        correlations = numeriques.corr()['churn'].abs().sort_values(ascending=False).drop('churn')
        print("\\n🔗 Les 5 variables les plus corrélées au churn :")
        for var, corr in correlations.head(5).items():
            print(f"• {var} : {corr:.3f}")

        fig, axes = plt.subplots(2, 2, figsize=(15, 10))

        axes[0, 0].hist([df[df['churn'] == 0]['jours_depuis_derniere_commande'],
                         df[df['churn'] == 1]['jours_depuis_derniere_commande']],
                        bins=30, alpha=0.7, label=['Pas de churn', 'Churn'])
        axes[0, 0].set_title('Jours depuis la dernière commande')
        axes[0, 0].legend()

        df.boxplot(column='score_satisfaction', by='churn', ax=axes[0, 1])
        axes[0, 1].set_title('Satisfaction selon le churn')

        df.boxplot(column='freq_commande_mensuelle', by='churn', ax=axes[1, 0])
        axes[1, 0].set_title('Fréquence de commande selon le churn')

        # Matrice de corrélation des variables les plus liées au churn
        top_vars = ['churn'] + correlations.head(7).index.tolist()
        corr_matrix = df[top_vars].corr()
        im = axes[1, 1].imshow(corr_matrix, cmap='coolwarm', vmin=-1, vmax=1)
        axes[1, 1].set_xticks(range(len(top_vars)))
        axes[1, 1].set_xticklabels(top_vars, rotation=90, fontsize=7)
        axes[1, 1].set_yticks(range(len(top_vars)))
        axes[1, 1].set_yticklabels(top_vars, fontsize=7)
        axes[1, 1].set_title('Corrélations des variables les plus liées au churn')
        fig.colorbar(im, ax=axes[1, 1])

        plt.tight_layout()
        plt.show()

    def entrainer_modeles(self, X_train, X_test, y_train, y_test):
        """Entraînement et comparaison de plusieurs modèles"""
        print("\\n🤖 ENTRAÎNEMENT DES MODÈLES")
        print("="*40)

        modeles_config = {
            'Logistic Regression': LogisticRegression(random_state=42),
            'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(random_state=42)
        }

        resultats = {}

        for nom, modele in modeles_config.items():
            print(f"\\n📚 Entraînement {nom}...")

            # Le choix du modèle se fait sur la validation croisée (jeu d'entraînement),
            # le jeu de test ne sert qu'à mesurer le modèle retenu.
            cv_scores = cross_val_score(modele, X_train, y_train, cv=5, scoring='roc_auc')
            modele.fit(X_train, y_train)

            y_pred = modele.predict(X_test)
            y_pred_proba = modele.predict_proba(X_test)[:, 1]
            auc_score = roc_auc_score(y_test, y_pred_proba)

            resultats[nom] = {
                'modele': modele,
                'auc': auc_score,
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std(),
                'predictions': y_pred,
                'probabilities': y_pred_proba
            }

            print(f"📊 AUC en validation croisée : {cv_scores.mean():.3f} (+/- {cv_scores.std()*2:.3f})")
            print(f"✅ AUC sur le jeu de test : {auc_score:.3f}")

        self.modeles = resultats
        self.meilleur_modele = max(resultats, key=lambda nom: resultats[nom]['cv_mean'])

        print(f"\\n🏆 Modèle retenu (meilleure AUC en validation croisée) : {self.meilleur_modele}")
        return resultats

    def evaluer_modele(self, y_test):
        """Évaluation détaillée du modèle retenu sur le jeu de test"""
        print(f"\\n📊 ÉVALUATION DÉTAILLÉE : {self.meilleur_modele}")
        print("="*50)

        modele_info = self.modeles[self.meilleur_modele]
        y_pred = modele_info['predictions']
        y_pred_proba = modele_info['probabilities']

        print("📋 Rapport de classification :")
        print(classification_report(y_test, y_pred))

        print("\\n🎯 Matrice de confusion :")
        print(confusion_matrix(y_test, y_pred))

        # Importance des variables (modèles à base d'arbres)
        if hasattr(modele_info['modele'], 'feature_importances_'):
            importances = pd.DataFrame({
                'feature': self.colonnes,
                'importance': modele_info['modele'].feature_importances_
            }).sort_values('importance', ascending=False)
            self.feature_importance = importances

            print("\\n🔍 Les 10 variables les plus utilisées :")
            for _, row in importances.head(10).iterrows():
                print(f"• {row['feature']} : {row['importance']:.3f}")

        plt.figure(figsize=(12, 5))

        plt.subplot(1, 2, 1)
        fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
        plt.plot(fpr, tpr, linewidth=2, label=f'Courbe ROC (AUC = {modele_info["auc"]:.3f})')
        plt.plot([0, 1], [0, 1], 'k--', linewidth=1)
        plt.xlabel('Taux de faux positifs')
        plt.ylabel('Taux de vrais positifs')
        plt.title('Courbe ROC')
        plt.legend()
        plt.grid(True)

        plt.subplot(1, 2, 2)
        plt.hist([y_pred_proba[y_test == 0], y_pred_proba[y_test == 1]],
                 bins=30, alpha=0.7, label=['Pas de churn', 'Churn'])
        plt.xlabel('Probabilité de churn prédite')
        plt.ylabel('Fréquence')
        plt.title('Distribution des scores prédits')
        plt.legend()
        plt.grid(True)

        plt.tight_layout()
        plt.show()

    def predire_churn_client(self, donnees_client):
        """Prédiction pour un client : même préparation que pour l'entraînement"""
        modele = self.modeles[self.meilleur_modele]['modele']

        X_client = self.preparer_variables(pd.DataFrame([donnees_client]))
        # Mêmes colonnes, dans le même ordre : une catégorie absente de ce client devient une colonne à 0
        X_client = X_client.reindex(columns=self.colonnes, fill_value=0)
        # Même standardisation que pour l'entraînement
        X_client = self.scaler.transform(X_client)

        proba_churn = modele.predict_proba(X_client)[0, 1]
        # Seuils de lecture choisis arbitrairement pour l'exemple
        risque = 'Élevé' if proba_churn > 0.3 else 'Modéré' if proba_churn > 0.15 else 'Faible'
        return {'probabilite_churn': proba_churn, 'risque': risque}

    def pipeline_complet(self):
        print("🚀 PRÉDICTION DE CHURN SUR DES CLIENTS SIMULÉS")
        print("="*60)

        # 1. Simulation des données
        print("1️⃣ Simulation des données...")
        df = self.generer_donnees_clients()

        # 2. Analyse exploratoire
        self.analyser_donnees(df)

        # 3. Variables et découpage
        X = self.preparer_variables(df)
        self.colonnes = list(X.columns)
        y = df['churn']
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # 4. Standardisation ajustée sur l'entraînement seulement
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # 5. Entraînement et comparaison
        self.entrainer_modeles(X_train_scaled, X_test_scaled, y_train, y_test)

        # 6. Évaluation
        self.evaluer_modele(y_test)

        # 7. Un client d'exemple
        print("\\n🧪 TEST SUR UN CLIENT D'EXEMPLE")
        print("="*35)
        client_test = {
            'age': 45, 'anciennete_mois': 36, 'nb_commandes_total': 8,
            'montant_total_depense': 450, 'panier_moyen': 56,
            'jours_depuis_derniere_commande': 120, 'nb_retours': 3,
            'score_satisfaction': 2.1, 'canal_acquisition': 'web',
            'categorie_prefere': 'electromenager', 'utilise_app_mobile': 0,
            'abonne_newsletter': 1
        }
        resultat = self.predire_churn_client(client_test)
        print(f"👤 Probabilité de churn : {resultat['probabilite_churn']:.1%}")
        print(f"⚠️ Niveau de risque : {resultat['risque']}")

        return df, self.modeles

# Exécution
predicteur = PredicteurChurn()
donnees, modeles = predicteur.pipeline_complet()`}
          />
        </TabsContent>
      </Tabs>
    </section>
    </PracticeContext.Provider>
  );
};

export default PracticalExercises;
