/**
 * Exemples de code de la masterclass Python (page Programmation). Les exemples exécutables tournent dans le moteur du
 * site (src/data/python-masterclass-examples.test.ts les exécute sous Node) ; les autres sont du code à lire, avec une
 * phrase qui dit pourquoi. Déplacé le 18 octobre 2026 depuis PythonMasterclass.tsx (texte du code inchangé) ; les
 * sorties écrites à la main des deux premiers exemples sont remplacées par l'exécution réelle (elles étaient identiques).
 */
export interface MasterclassExample {
  title: string;
  code: string;
  runnable: boolean;
  /** Code exécuté avant l'exemple, sans être affiché (exemple qui continue le précédent) */
  setup?: string;
  note?: string;
}

/** Exécute un code sans rien afficher : pour recréer les données d'un exemple précédent */
const silencieux = (code: string) =>
  `import contextlib as _contextlib, io as _io\nwith _contextlib.redirect_stdout(_io.StringIO()):\n    exec(${JSON.stringify(code)})`;

const VARIABLES = `# Python n'impose pas de déclarer le type : il est lié à la valeur
nom = "Alice"                    # Chaîne de caractères (string)
age = 28                        # Nombre entier (integer)
taille = 1.65                   # Nombre décimal (float)
est_data_scientist = True       # Booléen (True/False)

# Affichage avec des f-strings
print(f"{nom} a {age} ans et mesure {taille}m")
# Résultat : Alice a 28 ans et mesure 1.65m

# type() donne le type de chaque valeur
print(f"Type de nom: {type(nom).__name__}")
print(f"Type d'age: {type(age).__name__}")
print(f"Type de taille: {type(taille).__name__}")

# Conversion de types
age_str = str(age)
taille_int = int(taille)
print(f"Age en string: '{age_str}' (type: {type(age_str).__name__})")`;

const STRUCTURES = `# 1. LISTES : Collections ordonnées et dynamiques
ventes_mensuelles = [15000, 18000, 22000, 17000, 25000]
equipe_data_science = ["Alice", "Bob", "Charlie", "Diana"]

# Opérations courantes sur les listes
print(f"Total des ventes : {sum(ventes_mensuelles):,}€")
print(f"Moyenne mensuelle : {sum(ventes_mensuelles) / len(ventes_mensuelles):,.0f}€")
print(f"Meilleur mois : {max(ventes_mensuelles):,}€")
print(f"Équipe : {len(equipe_data_science)} membres")

# Ajout et modification
ventes_mensuelles.append(28000)  # Nouveau mois
equipe_data_science.extend(["Eve", "Frank"])  # Nouvelles recrues

# 2. DICTIONNAIRES : Données structurées et flexibles
employe = {
    "nom": "Marie Dupont",
    "poste": "Senior Data Analyst", 
    "salaire": 42000,
    "competences": ["Python", "SQL", "Tableau"],
    "projets_termines": 12,
    "certifications": {"AWS": True, "Google Cloud": False}
}

# Accès et modification avancés
print(f"\\nProfil de {employe['nom']}:")
print(f"   Poste: {employe['poste']}")
print(f"   Salaire: {employe['salaire']:,}€")

# Promotion et mise à jour
employe["salaire"] *= 1.15  # Augmentation de 15%
employe["competences"].append("Machine Learning")
employe["poste"] = "Lead Data Scientist"

# 3. COMPRÉHENSIONS : un filtre ou une transformation en une ligne
# Filtrage avec une boucle
bons_mois_traditionnel = []
for vente in ventes_mensuelles:
    if vente > 20000:
        bons_mois_traditionnel.append(vente)

# Même résultat avec une compréhension de liste (plus courte)
bons_mois = [vente for vente in ventes_mensuelles if vente > 20000]
performances = [vente / 1000 for vente in ventes_mensuelles]  # En milliers

print(f"\\nMois performants (>20k€): {bons_mois}")
print(f"Performances (en k€): {performances}")

# Compréhension de dictionnaire
stats_equipe = {membre: len(membre) for membre in equipe_data_science}
print(f"\\nLongueur des noms: {stats_equipe}")`;

const DATAFRAME = `import pandas as pd

# Données inventées pour l'exemple : une petite équipe de cinq personnes
data = {
    'Nom': ['Alice Martin', 'Bob Dupont', 'Charlie Leroy', 'Diana Chen', 'Eve Moreau'],
    'Age': [25, 30, 35, 28, 32],
    'Ville': ['Paris', 'Lyon', 'Marseille', 'Paris', 'Nice'],
    'Salaire': [45000, 52000, 48000, 51000, 49000],
    'Experience': [2, 5, 8, 3, 6],
    'Departement': ['Data Science', 'Engineering', 'Data Science', 'Product', 'Data Science'],
    'Date_embauche': pd.date_range('2020-01-01', periods=5, freq='6ME'),
    'Performance': [8.5, 9.2, 7.8, 8.9, 9.0]
}

df = pd.DataFrame(data)

# Sept étapes d'une première exploration
print("=" * 50)
print("EXPLORATION COMPLÈTE DES DONNÉES")
print("=" * 50)

print("\\nAperçu des premières lignes:")
print(df.head(3))

print("\\nForme du dataset:")
print(f"   Lignes: {df.shape[0]}, Colonnes: {df.shape[1]}")

print("\\nInformations sur les colonnes:")
df.info()  # affiche lui-même le résumé (print(df.info()) afficherait aussi « None »)

print("\\nStatistiques descriptives (numériques):")
print(df.describe().round(2))

print("\\nVérification des valeurs manquantes:")
valeurs_manquantes = df.isnull().sum()
print(f"   Total: {valeurs_manquantes.sum()} valeurs manquantes")
if valeurs_manquantes.sum() > 0:
    print(valeurs_manquantes[valeurs_manquantes > 0])
else:
    print("   Aucune valeur manquante détectée")

print("\\nTypes de données par colonne:")
for col, dtype in df.dtypes.items():
    print(f"   {col}: {dtype}")

print("\\nValeurs uniques par colonne catégorielle:")
categorical_cols = ['Ville', 'Departement']
for col in categorical_cols:
    print(f"   {col}: {df[col].nunique()} valeurs uniques")
    print(f"      → {list(df[col].unique())}")`;

const SALAIRES = `# Suite du DataFrame précédent...

# 1. FILTRAGE : Qui gagne plus de 50k€ ?
hauts_salaires = df[df['Salaire'] > 50000]
print("Employés avec salaire > 50k€ :")
print(hauts_salaires[['Nom', 'Salaire']])

# 2. GROUPEMENT : Salaire moyen par ville
salaire_par_ville = df.groupby('Ville')['Salaire'].mean().round(0)
print("\\nSalaire moyen par ville :")
print(salaire_par_ville)

# 3. CORRELATION : Relation âge/salaire/expérience
correlation = df[['Age', 'Salaire', 'Experience']].corr()
print("\\nMatrice de corrélation :")
print(correlation)

# 4. NOUVELLE COLONNE : Calcul du salaire par année d'expérience
df['Salaire_par_exp'] = df['Salaire'] / df['Experience']
print("\\nSalaire par année d'expérience :")
print(df[['Nom', 'Salaire_par_exp']].sort_values('Salaire_par_exp', ascending=False))`;

const GRAPHIQUES = `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# CONFIGURATION DU STYLE
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("Set2")
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.spines.top'] = False
plt.rcParams['axes.spines.right'] = False

# DONNÉES INVENTÉES POUR L'EXEMPLE (tirage aléatoire avec graine fixe)
np.random.seed(42)
dates = pd.date_range('2023-01-01', periods=12, freq='ME')
publicite = np.random.normal(3000, 500, 12).astype(int)
df_business = pd.DataFrame({
    'Date': dates,
    'Mois': [d.strftime('%b') for d in dates],
    'Publicité': publicite,
    # Ventes liées à la publicité par une relation choisie pour l'exemple : 6,5 € par euro investi, plus du bruit
    'Ventes': (publicite * 6.5 + np.random.normal(0, 1000, 12)).astype(int),
    'Satisfaction': np.random.uniform(7.5, 9.5, 12).round(1),
    'Saison': ['Hiver']*3 + ['Printemps']*3 + ['Été']*3 + ['Automne']*3
})

print("=" * 60)
print("GRAPHIQUES D'ANALYSE DES VENTES")
print("=" * 60)

# FIGURE 1 : QUATRE GRAPHIQUES
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
fig.suptitle('Analyse des ventes simulées, 2023', fontsize=16, fontweight='bold')

# Évolution des ventes, avec une bande de plus ou moins un écart-type autour de la courbe
ax1.plot(df_business['Date'], df_business['Ventes'],
         marker='o', linewidth=3, color='#2E86C1', markersize=8)
ax1.fill_between(df_business['Date'],
                df_business['Ventes'] - df_business['Ventes'].std(),
                df_business['Ventes'] + df_business['Ventes'].std(),
                alpha=0.2, color='#2E86C1')
ax1.set_title('Évolution des ventes (bande de ± 1 écart-type)', fontweight='bold')
ax1.set_ylabel('Ventes (€)')
ax1.grid(True, alpha=0.3)
ax1.tick_params(axis='x', rotation=45)

# Publicité et ventes, avec une droite de régression
scatter = ax2.scatter(df_business['Publicité'], df_business['Ventes'],
                     c=df_business['Satisfaction'], s=150,
                     cmap='viridis', alpha=0.8, edgecolors='black')
z = np.polyfit(df_business['Publicité'], df_business['Ventes'], 1)
p = np.poly1d(z)
ax2.plot(df_business['Publicité'], p(df_business['Publicité']),
         "--", color='red', linewidth=2, alpha=0.8)
corr_coef = np.corrcoef(df_business['Publicité'], df_business['Ventes'])[0,1]
ax2.set_title(f'Publicité et ventes (r = {corr_coef:.2f})', fontweight='bold')
ax2.set_xlabel('Budget de publicité (€)')
ax2.set_ylabel('Ventes (€)')
plt.colorbar(scatter, ax=ax2, label='Satisfaction client')

# Distribution des ventes par saison (trois mois par saison : peu de points)
sns.boxplot(data=df_business, x='Saison', y='Ventes', ax=ax3)
ax3.set_title('Distribution des ventes par saison', fontweight='bold')
ax3.set_ylabel('Ventes (€)')

# Carte de chaleur des corrélations
corr_matrix = df_business[['Ventes', 'Publicité', 'Satisfaction']].corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdYlBu_r', center=0,
           square=True, ax=ax4, cbar_kws={'shrink': 0.8})
ax4.set_title('Matrice de corrélation', fontweight='bold')

plt.tight_layout()
plt.show()

# FIGURE 2 : AIRES ET RADAR
fig = plt.figure(figsize=(15, 6))
ax1 = fig.add_subplot(1, 2, 1)

# Aires superposées (la publicité est multipliée par 5 pour tenir sur le même axe)
months = range(len(df_business))
ax1.fill_between(months, 0, df_business['Ventes'], alpha=0.7, color='#3498DB', label='Ventes')
ax1.fill_between(months, 0, df_business['Publicité']*5, alpha=0.5, color='#E74C3C', label='Publicité x5')
ax1.set_xticks(months)
ax1.set_xticklabels(df_business['Mois'])
ax1.set_title('Évolution comparée (aires)', fontweight='bold')
ax1.set_xlabel('Mois')
ax1.set_ylabel('Montant (€)')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Radar : chaque grandeur est ramenée à (moyenne / maximum) pour tenir sur la même échelle, de 0 à 1
metriques = ['Ventes', 'Publicité', 'Satisfaction']
valeurs = [df_business[m].mean() / df_business[m].max() for m in metriques]
angles = np.linspace(0, 2*np.pi, len(metriques), endpoint=False).tolist()
valeurs += valeurs[:1]   # on referme le polygone
angles += angles[:1]

ax2 = fig.add_subplot(1, 2, 2, projection='polar')
ax2.plot(angles, valeurs, 'o-', linewidth=2, color='#9B59B6')
ax2.fill(angles, valeurs, alpha=0.25, color='#9B59B6')
ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(metriques)
ax2.set_ylim(0, 1)
ax2.set_title('Radar : moyenne / maximum', fontweight='bold', pad=20)

plt.tight_layout()
plt.show()

# RÉSUMÉ CHIFFRÉ
print("\\n" + "=" * 50)
print("RÉSUMÉ CHIFFRÉ")
print("=" * 50)
print(f"Ventes par € de publicité: {(df_business['Ventes'].sum() / df_business['Publicité'].sum()):.1f}€")
print(f"Meilleur mois: {df_business.loc[df_business['Ventes'].idxmax(), 'Mois']} ({df_business['Ventes'].max():,}€)")
print(f"Satisfaction moyenne: {df_business['Satisfaction'].mean():.1f}/10")
print(f"Corrélation pub-ventes: {np.corrcoef(df_business['Publicité'], df_business['Ventes'])[0,1]:.2f}")
print(f"Évolution entre le premier et le dernier mois: {((df_business['Ventes'].iloc[-1] / df_business['Ventes'].iloc[0]) - 1) * 100:.1f}%")`;

const MODELE = `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import numpy as np

# 1. CRÉATION DES DONNÉES
# Relation inventée pour l'exemple : environ 2,5 € de ventes par euro de publicité
np.random.seed(42)
budget_pub = np.random.uniform(1000, 5000, 100)
# Les ventes dépendent du budget (avec un peu de bruit)
ventes = budget_pub * 2.5 + np.random.normal(0, 1000, 100)

df_ml = pd.DataFrame({
    'Budget_Publicite': budget_pub,
    'Ventes': ventes
})

print("Aperçu des données :")
print(df_ml.head())

# 2. PRÉPARATION DES DONNÉES
X = df_ml[['Budget_Publicite']]  # Variable explicative
y = df_ml['Ventes']              # Variable à prédire

# Division train/test (70% / 30%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

print(f"\\nDonnées d'entraînement : {len(X_train)} exemples")
print(f"Données de test : {len(X_test)} exemples")

# 3. ENTRAÎNEMENT DU MODÈLE
model = LinearRegression()
model.fit(X_train, y_train)

print("\\nModèle entraîné")
# Le coefficient estimé est proche de 2,5 sans l'atteindre : le bruit et la taille de l'échantillon jouent
print(f"Coefficient : {model.coef_[0]:.2f}")
print(f"Intercept : {model.intercept_:.2f}")
print(f"Équation : Ventes = {model.coef_[0]:.2f} * Budget + {model.intercept_:.2f}")

# 4. PRÉDICTIONS ET ÉVALUATION
y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\\nPerformance du modèle sur les données de test :")
print(f"R² Score : {r2:.3f} ({r2*100:.1f}% de la variance expliquée)")
print(f"MSE : {mse:.0f}")

# 5. PRÉDICTION SUR DE NOUVELLES DONNÉES
# Un DataFrame avec le même nom de colonne que pour l'entraînement (sinon scikit-learn avertit)
nouveaux_budgets = pd.DataFrame({'Budget_Publicite': [3000, 4500, 2000]})
predictions = model.predict(nouveaux_budgets)

print("\\nPrédictions :")
for budget, pred in zip(nouveaux_budgets['Budget_Publicite'], predictions):
    print(f"Budget {budget}€ → Ventes prédites : {pred:.0f}€")`;

const PROJET_FINAL = `# PROJET COMPLET : prédiction de salaires simulés
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# 1. DONNÉES SIMULÉES (formule inventée pour l'exemple)
np.random.seed(42)
data_salaires = {
    'Experience': np.random.randint(0, 15, 200),
    'Age': np.random.randint(22, 55, 200),
    'Formation': np.random.choice(['Bac+3', 'Bac+5', 'PhD'], 200),
    'Ville': np.random.choice(['Paris', 'Lyon', 'Marseille'], 200)
}

# Salaire fabriqué par une formule choisie pour l'exemple
base_salaire = 30000
df_salaires = pd.DataFrame(data_salaires)
df_salaires['Salaire'] = (
    base_salaire + 
    df_salaires['Experience'] * 2000 +  # 2k€ par an d'expérience
    (df_salaires['Age'] - 22) * 500 +   # 500€ par an d'âge
    np.where(df_salaires['Formation'] == 'PhD', 10000, 
             np.where(df_salaires['Formation'] == 'Bac+5', 5000, 0)) +
    np.where(df_salaires['Ville'] == 'Paris', 8000, 0) +  # Prime Paris
    np.random.normal(0, 3000, 200)  # Variabilité
)

# 2. ENCODAGE DES VARIABLES CATÉGORIELLES
df_encoded = pd.get_dummies(df_salaires, columns=['Formation', 'Ville'])

# 3. MODÉLISATION
X = df_encoded.drop('Salaire', axis=1)
y = df_encoded['Salaire']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Random Forest pour capturer les interactions
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# 4. ÉVALUATION SUR LE JEU DE TEST
y_pred_rf = rf_model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred_rf)
r2_rf = r2_score(y_test, y_pred_rf)

print(f"Performance Random Forest :")
print(f"R² Score : {r2_rf:.3f}")
print(f"Erreur moyenne : {mae:.0f}€")

# 5. IMPORTANCE DES VARIABLES
importances = rf_model.feature_importances_
features = X.columns

plt.figure(figsize=(10, 6))
indices = np.argsort(importances)[::-1]
plt.bar(range(len(importances)), importances[indices])
plt.title("Importance des variables pour prédire le salaire simulé")
plt.xticks(range(len(importances)), [features[i] for i in indices], rotation=45)
plt.tight_layout()
plt.show()

print("Modèle entraîné sur des données simulées : ces scores ne valent que pour la formule qui les a produites.")`;

export const MASTERCLASS_EXAMPLES = {
  "variables": { title: "Variables et types de données", code: VARIABLES, runnable: true },
  "structures": { title: "Structures de données en action", code: STRUCTURES, runnable: true },
  "dataframe": { title: "Un premier DataFrame et son exploration", code: DATAFRAME, runnable: true },
  "salaires": { title: "Solution : Analyse des salaires", code: SALAIRES, runnable: true, setup: silencieux(DATAFRAME), note: "Suite de l'exemple précédent : le tableau df qu'il construit est recréé, sans son affichage, avant ce code." },
  "graphiques": { title: "Matplotlib et seaborn : un tableau de bord de graphiques", code: GRAPHIQUES, runnable: false, note: "Code à lire : il utilise seaborn, que le moteur du site ne propose pas (Matplotlib, lui, y est). Lancez-le dans un notebook où seaborn est installé." },
  "modele": { title: "Votre premier modèle prédictif", code: MODELE, runnable: true },
  "projet-final": { title: "Solution : Modèle de prédiction de salaires", code: PROJET_FINAL, runnable: true },
} satisfies Record<string, MasterclassExample>;

export type MasterclassExampleId = keyof typeof MASTERCLASS_EXAMPLES;
