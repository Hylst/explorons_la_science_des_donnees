
import React from "react";
import { EducationalCard, ExerciseCard, QuizCard } from "@/components/ui/educational-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Code, Copy, Download, ExternalLink, Lightbulb, Target, Zap } from "lucide-react";

const PracticalExercisesSection = () => {
  const [activeCode, setActiveCode] = React.useState(0);
  const [copiedCode, setCopiedCode] = React.useState<number | null>(null);

  const codeExamples = [
    {
      title: "Classification avec scikit-learn",
      description: "Classification des iris : exploration, comparaison de trois modèles par validation croisée, évaluation et prédictions",
      difficulty: "Débutant",
      estimatedTime: "20 min",
      code: `# Classification des fleurs d'Iris : exemple complet et commenté
# Prérequis : pip install numpy pandas matplotlib seaborn scikit-learn
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# 1. CHARGEMENT ET EXPLORATION DES DONNÉES
print("Analyse du jeu de données Iris")
print("=" * 50)

iris = load_iris()
X, y = iris.data, iris.target

# Un DataFrame facilite l'analyse
df = pd.DataFrame(X, columns=iris.feature_names)
df['target'] = y
df['species'] = df['target'].map(dict(enumerate(iris.target_names)))

print(f"Forme du jeu de données : {df.shape}")
print(f"Classes : {iris.target_names}")
print("Répartition des classes :")
print(df['species'].value_counts())

# Statistiques descriptives des quatre mesures
print("\\nStatistiques descriptives :")
print(df[iris.feature_names].describe().round(2))

# 2. VISUALISATION EXPLORATOIRE
plt.figure(figsize=(15, 4.5))

# Distribution des caractéristiques
plt.subplot(1, 3, 1)
df[iris.feature_names].boxplot()
plt.title('Distribution des caractéristiques')
plt.xticks(rotation=45)

# Matrice de corrélation
plt.subplot(1, 3, 2)
correlation_matrix = df[iris.feature_names].corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Matrice de corrélation')

# Relation entre deux mesures, colorée par espèce
# (en pratique, sns.pairplot(df, hue='species') montre toutes les paires)
plt.subplot(1, 3, 3)
plt.scatter(df['sepal length (cm)'], df['petal length (cm)'], c=df['target'], cmap='viridis')
plt.xlabel('Longueur du sépale (cm)')
plt.ylabel('Longueur du pétale (cm)')
plt.title('Longueur du sépale et du pétale')

plt.tight_layout()
plt.show()

# 3. PRÉPARATION DES DONNÉES
print("\\nPréparation des données")
print("=" * 30)

# Séparation stratifiée : chaque espèce garde la même proportion dans les deux jeux
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Taille de l'entraînement : {X_train.shape[0]} échantillons")
print(f"Taille du test : {X_test.shape[0]} échantillons")

# 4. COMPARAISON DE PLUSIEURS MODÈLES
print("\\nComparaison des modèles")
print("=" * 35)

# La standardisation est placée dans un pipeline : elle est apprise sur les seules
# données d'entraînement de chaque pli de la validation croisée (pas de fuite).
# Elle importe pour la régression logistique et le SVM, pas pour la forêt.
models = {
    'Forêt aléatoire': RandomForestClassifier(n_estimators=100, random_state=42),
    'Régression logistique': make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
    'SVM': make_pipeline(StandardScaler(), SVC(probability=True, random_state=42)),
}

results = {}

for name, model in models.items():
    # Validation croisée sur le jeu d'entraînement uniquement
    cv_scores = cross_val_score(model, X_train, y_train, cv=5)

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    results[name] = {
        'model': model,
        'accuracy': accuracy,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'predictions': y_pred,
    }

    print(f"\\n{name}")
    print(f"  Exactitude sur le test : {accuracy:.3f}")
    print(f"  Validation croisée (5 plis) : {cv_scores.mean():.3f} (écart-type {cv_scores.std():.3f})")

# 5. CHOIX DU MODÈLE
# On choisit sur la validation croisée, pas sur le jeu de test : le test ne sert qu'à
# estimer la performance du modèle retenu, une fois le choix fait.
# Avec 30 exemples de test, une erreur de plus ou de moins change l'exactitude de
# 3,3 points : l'écart entre ces trois modèles n'est pas significatif.
best_model_name = max(results, key=lambda name: results[name]['cv_mean'])
best_model = results[best_model_name]['model']

print(f"\\nModèle retenu : {best_model_name}")
print(f"Exactitude sur le test : {results[best_model_name]['accuracy']:.3f}")

# 6. ANALYSE DÉTAILLÉE DU MODÈLE RETENU
print(f"\\nAnalyse détaillée : {best_model_name}")
print("=" * 45)

y_pred_best = results[best_model_name]['predictions']
print("\\nRapport de classification :")
print(classification_report(y_test, y_pred_best, target_names=iris.target_names))

cm = confusion_matrix(y_test, y_pred_best)
print("Matrice de confusion (lignes : classes réelles, colonnes : classes prédites) :")
print(cm)

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=iris.target_names,
            yticklabels=iris.target_names)
plt.title(f'Matrice de confusion : {best_model_name}')
plt.ylabel('Classe réelle')
plt.xlabel('Classe prédite')
plt.show()

# 7. PRÉDICTIONS SUR DE NOUVEAUX EXEMPLES
print("\\nPrédictions sur trois nouvelles fleurs")
print("=" * 40)

# Mesures : longueur du sépale, largeur du sépale, longueur du pétale, largeur du pétale
nouvelles_fleurs = [
    [5.1, 3.5, 1.4, 0.2],  # proche des setosa
    [6.2, 2.9, 4.3, 1.3],  # proche des versicolor
    [7.3, 2.9, 6.3, 1.8],  # proche des virginica
]

for i, fleur in enumerate(nouvelles_fleurs, start=1):
    prediction = best_model.predict([fleur])[0]
    probabilites = best_model.predict_proba([fleur])[0]
    print(f"\\nFleur {i} : {fleur}")
    print(f"  Espèce prédite : {iris.target_names[prediction]}")
    for espece, proba in zip(iris.target_names, probabilites):
        print(f"  {espece} : {proba:.3f}")

# 8. IMPORTANCE DES CARACTÉRISTIQUES (forêt aléatoire)
print("\\nImportance des caractéristiques (forêt aléatoire)")
print("=" * 50)

foret = results['Forêt aléatoire']['model']
importances = pd.Series(foret.feature_importances_, index=iris.feature_names).sort_values(ascending=False)
print(importances.round(3))

plt.figure(figsize=(8, 4))
importances.sort_values().plot.barh()
plt.title('Importance des caractéristiques (forêt aléatoire)')
plt.xlabel('Importance')
plt.tight_layout()
plt.show()`,
      language: "python",
      outputs: [
        "Validation croisée (5 plis) : SVM 0,967, régression logistique 0,958, forêt aléatoire 0,950",
        "Modèle retenu : SVM, exactitude sur les 30 exemples de test : 0,967 (une seule erreur)",
        "Importance des caractéristiques (forêt) : largeur du pétale 0,437, longueur du pétale 0,431, longueur du sépale 0,116, largeur du sépale 0,015"
      ]
    },
    {
      title: "Régression et visualisation",
      description: "Estimation de prix de logements sur des données synthétiques : cinq modèles, validation croisée, résidus",
      difficulty: "Intermédiaire",
      estimatedTime: "35 min",
      code: `# Régression : estimer des prix de logements (données synthétiques)
# Prérequis : pip install numpy pandas matplotlib scikit-learn
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.pipeline import Pipeline

plt.style.use('seaborn-v0_8')

print("ESTIMATION DE PRIX DE LOGEMENTS")
print("=" * 50)

# 1. GÉNÉRATION DE DONNÉES SYNTHÉTIQUES
# Ces données sont inventées pour l'exemple : le prix est calculé par une formule que
# nous choisissons, plus un bruit aléatoire. Les résultats montrent donc ce que les
# modèles retrouvent d'une formule connue, pas ce qui se passe sur un marché réel.
print("\\nGénération du jeu de données...")
rng = np.random.default_rng(42)
n_samples = 2000

surface = np.clip(rng.normal(120, 40, n_samples), 30, 300)    # m²
chambres = np.clip(rng.poisson(3, n_samples), 1, 8)
age = np.clip(rng.exponential(15, n_samples), 0, 100)          # années

# Score de localisation de 1 à 10 (valeurs moyennes plus fréquentes)
localisation = rng.choice(np.arange(1, 11), n_samples,
                          p=[0.05, 0.08, 0.12, 0.15, 0.2, 0.15, 0.12, 0.08, 0.03, 0.02])

# Étage : 0 = rez-de-chaussée
etage = rng.choice(np.arange(0, 20), n_samples, p=[0.3] + [0.7 / 19] * 19)

garage = rng.choice([0, 1], n_samples, p=[0.4, 0.6])

# Le prix suit une formule linéaire, une interaction surface x localisation,
# deux effets de seuil et un bruit gaussien d'écart-type 25 000.
prix = (
    surface * 2500
    + chambres * 12000
    + localisation * 8000
    + garage * 15000
    + (etage > 0) * 5000
    - age * 800
    + surface * localisation * 30
    + (surface > 150) * 20000
    - (age > 50) * 15000
    + rng.normal(0, 25000, n_samples)
)
prix = np.clip(prix, 50000, 800000)

df = pd.DataFrame({
    'surface': surface,
    'chambres': chambres,
    'age': age,
    'localisation': localisation,
    'etage': etage,
    'garage': garage,
    'prix': prix,
})

print(f"Jeu de données créé : {df.shape[0]} logements")
print(f"Prix moyen : {df['prix'].mean():,.0f} €")
print(f"Prix médian : {df['prix'].median():,.0f} €")

# 2. ANALYSE EXPLORATOIRE
print("\\nAnalyse exploratoire")
print("=" * 40)

print("Statistiques descriptives :")
print(df.describe().round(2))

print(f"\\nValeurs manquantes : {df.isnull().sum().sum()}")

# Variables dérivées, pour l'exploration seulement (elles utilisent le prix : on ne
# les donne pas au modèle, ce serait de la fuite d'information)
df['prix_par_m2'] = df['prix'] / df['surface']
df['surface_par_chambre'] = df['surface'] / df['chambres']

fig, axes = plt.subplots(3, 3, figsize=(16, 14))
fig.suptitle('Analyse exploratoire du jeu de données', fontsize=16, fontweight='bold')

# Distribution des prix
axes[0, 0].hist(df['prix'], bins=50, alpha=0.7, color='skyblue', edgecolor='black')
axes[0, 0].set_title('Distribution des prix')
axes[0, 0].set_xlabel('Prix (€)')
axes[0, 0].set_ylabel('Effectif')

# Prix selon la surface, avec une droite de régression
axes[0, 1].scatter(df['surface'], df['prix'], alpha=0.6, color='coral')
pente, ordonnee = np.polyfit(df['surface'], df['prix'], 1)
x_ligne = np.sort(df['surface'])
axes[0, 1].plot(x_ligne, pente * x_ligne + ordonnee, "r--", alpha=0.8, linewidth=2)
axes[0, 1].set_title('Prix selon la surface')
axes[0, 1].set_xlabel('Surface (m²)')
axes[0, 1].set_ylabel('Prix (€)')

# Prix selon le nombre de chambres
df.boxplot(column='prix', by='chambres', ax=axes[0, 2])
axes[0, 2].set_title('Prix selon le nombre de chambres')
axes[0, 2].set_xlabel('Nombre de chambres')

# Effet de l'âge
axes[1, 0].scatter(df['age'], df['prix'], alpha=0.6, color='green')
axes[1, 0].set_title("Prix selon l'âge du logement")
axes[1, 0].set_xlabel('Âge (années)')
axes[1, 0].set_ylabel('Prix (€)')

# Effet de la localisation
prix_par_localisation = df.groupby('localisation')['prix'].mean()
axes[1, 1].bar(prix_par_localisation.index, prix_par_localisation.values, color='purple', alpha=0.7)
axes[1, 1].set_title('Prix moyen selon le score de localisation')
axes[1, 1].set_xlabel('Score de localisation')
axes[1, 1].set_ylabel('Prix moyen (€)')

# Matrice de corrélation
correlation_matrix = df.corr()
axes[1, 2].imshow(correlation_matrix, cmap='coolwarm', aspect='auto')
axes[1, 2].set_xticks(range(len(correlation_matrix.columns)))
axes[1, 2].set_yticks(range(len(correlation_matrix.columns)))
axes[1, 2].set_xticklabels(correlation_matrix.columns, rotation=45)
axes[1, 2].set_yticklabels(correlation_matrix.columns)
axes[1, 2].set_title('Matrice de corrélation')
for i in range(len(correlation_matrix.columns)):
    for j in range(len(correlation_matrix.columns)):
        axes[1, 2].text(j, i, f'{correlation_matrix.iloc[i, j]:.2f}',
                        ha='center', va='center', fontsize=8)

# Prix au m² selon la localisation
axes[2, 0].scatter(df['localisation'], df['prix_par_m2'], alpha=0.6, color='orange')
axes[2, 0].set_title('Prix au m² selon la localisation')
axes[2, 0].set_xlabel('Score de localisation')
axes[2, 0].set_ylabel('Prix au m² (€)')

# Effet du garage
prix_garage = df.groupby('garage')['prix'].mean()
axes[2, 1].bar(['Sans garage', 'Avec garage'], prix_garage.values,
               color=['lightcoral', 'lightgreen'], alpha=0.8)
axes[2, 1].set_title('Prix moyen selon le garage')
axes[2, 1].set_ylabel('Prix moyen (€)')

# Surface par chambre
axes[2, 2].scatter(df['surface_par_chambre'], df['prix'], alpha=0.6, color='teal')
axes[2, 2].set_title('Prix selon la surface par chambre')
axes[2, 2].set_xlabel('Surface par chambre (m²)')
axes[2, 2].set_ylabel('Prix (€)')

plt.tight_layout()
plt.show()

# 3. PRÉPARATION DES DONNÉES
print("\\nPréparation des données")
print("=" * 40)

features = ['surface', 'chambres', 'age', 'localisation', 'etage', 'garage']
X = df[features]
y = df['prix']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Variables explicatives : {X.shape[1]}")
print(f"Taille de l'entraînement : {X_train.shape[0]}")
print(f"Taille du test : {X_test.shape[0]}")

# 4. COMPARAISON DE MODÈLES
print("\\nEntraînement et comparaison des modèles")
print("=" * 50)

# Chaque modèle est un pipeline : les transformations sont apprises sur l'entraînement
# seulement (dans chaque pli de la validation croisée).
# PolynomialFeatures(interaction_only=True) ajoute les produits de deux variables.
models = {
    'Régression linéaire': Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', LinearRegression()),
    ]),
    'Ridge': Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', Ridge(alpha=1.0)),
    ]),
    'Lasso': Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', Lasso(alpha=100)),
    ]),
    'Forêt aléatoire': RandomForestRegressor(n_estimators=100, random_state=42),
    'Ridge avec interactions': Pipeline([
        ('poly', PolynomialFeatures(degree=2, include_bias=False, interaction_only=True)),
        ('scaler', StandardScaler()),
        ('regressor', Ridge(alpha=10)),
    ]),
}

results = {}

for name, model in models.items():
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    results[name] = {
        'model': model,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'predictions': y_pred,
    }

    print(f"\\n{name}")
    print(f"  R² sur le test : {r2:.3f}")
    print(f"  RMSE : {rmse:,.0f} €")
    print(f"  MAE : {mae:,.0f} €")
    print(f"  R² en validation croisée : {cv_scores.mean():.3f} (écart-type {cv_scores.std():.3f})")

# 5. MODÈLE RETENU
# Le choix se fait sur la validation croisée ; le jeu de test sert à estimer
# la performance du modèle choisi.
best_model_name = max(results, key=lambda name: results[name]['cv_mean'])
best_model = results[best_model_name]['model']
best_pred = results[best_model_name]['predictions']

print(f"\\nMODÈLE RETENU : {best_model_name}")
print("=" * 50)
print(f"R² sur le test : {results[best_model_name]['r2']:.3f}")
print(f"RMSE : {results[best_model_name]['rmse']:,.0f} €")
print(f"MAE : {results[best_model_name]['mae']:,.0f} €")

# 6. VISUALISATION DES RÉSULTATS
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.suptitle(f'Analyse du modèle retenu : {best_model_name}', fontsize=16, fontweight='bold')

# Prédictions et valeurs réelles
axes[0, 0].scatter(y_test, best_pred, alpha=0.6, color='blue')
min_val = min(y_test.min(), best_pred.min())
max_val = max(y_test.max(), best_pred.max())
axes[0, 0].plot([min_val, max_val], [min_val, max_val], 'r--', linewidth=2)
axes[0, 0].set_xlabel('Prix réels (€)')
axes[0, 0].set_ylabel('Prix prédits (€)')
axes[0, 0].set_title('Prédictions et valeurs réelles')

# Résidus
residus = y_test - best_pred
axes[0, 1].scatter(best_pred, residus, alpha=0.6, color='green')
axes[0, 1].axhline(y=0, color='r', linestyle='--')
axes[0, 1].set_xlabel('Prix prédits (€)')
axes[0, 1].set_ylabel('Résidus (€)')
axes[0, 1].set_title('Résidus selon la prédiction')

# Distribution des résidus
axes[0, 2].hist(residus, bins=30, alpha=0.7, color='orange', edgecolor='black')
axes[0, 2].set_xlabel('Résidus (€)')
axes[0, 2].set_ylabel('Effectif')
axes[0, 2].set_title('Distribution des résidus')

# Comparaison des modèles
model_names = list(results.keys())
axes[1, 0].barh(model_names, [results[n]['r2'] for n in model_names], color='lightblue', alpha=0.8)
axes[1, 0].set_xlabel('R² sur le test')
axes[1, 0].set_title('Comparaison des R²')

axes[1, 1].barh(model_names, [results[n]['rmse'] for n in model_names], color='lightcoral', alpha=0.8)
axes[1, 1].set_xlabel('RMSE (€)')
axes[1, 1].set_title('Comparaison des RMSE')

# Erreur absolue moyenne par gamme de prix
gammes = pd.cut(y_test, bins=5, labels=['Très bas', 'Bas', 'Moyen', 'Haut', 'Très haut'])
erreur_par_gamme = (pd.DataFrame({'gamme': gammes, 'erreur': np.abs(residus)})
                    .groupby('gamme', observed=True)['erreur'].mean())

axes[1, 2].bar(erreur_par_gamme.index.astype(str), erreur_par_gamme.values, color='purple', alpha=0.7)
axes[1, 2].set_xlabel('Gamme de prix')
axes[1, 2].set_ylabel('Erreur absolue moyenne (€)')
axes[1, 2].set_title('Erreur selon la gamme de prix')
axes[1, 2].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()

# 7. PRÉDICTIONS SUR DE NOUVEAUX LOGEMENTS
print("\\nPrédictions sur trois nouveaux logements")
print("=" * 50)

nouveaux_biens = [
    {'surface': 80, 'chambres': 3, 'age': 5, 'localisation': 8, 'etage': 2, 'garage': 1},
    {'surface': 120, 'chambres': 4, 'age': 15, 'localisation': 6, 'etage': 0, 'garage': 1},
    {'surface': 200, 'chambres': 6, 'age': 30, 'localisation': 9, 'etage': 5, 'garage': 0},
]

for i, bien in enumerate(nouveaux_biens, start=1):
    prix_predit = best_model.predict(pd.DataFrame([bien]))[0]
    print(f"\\nLogement {i} :")
    print(f"  Surface : {bien['surface']} m²")
    print(f"  Chambres : {bien['chambres']}")
    print(f"  Âge : {bien['age']} ans")
    print(f"  Localisation : {bien['localisation']}/10")
    print(f"  Étage : {bien['etage']}")
    print(f"  Garage : {'oui' if bien['garage'] else 'non'}")
    print(f"  Prix prédit : {prix_predit:,.0f} €")
    print(f"  Prix au m² : {prix_predit / bien['surface']:,.0f} €/m²")`,
      language: "python",
      outputs: [
        "Régression linéaire : R² = 0,951 sur le test, RMSE = 26 272 €, MAE = 21 195 €",
        "Forêt aléatoire : R² = 0,936, RMSE = 30 159 €",
        "La régression linéaire est retenue : normal, les prix ont été fabriqués par une formule presque linéaire plus un bruit de 25 000 €"
      ]
    },
    {
      title: "Clustering : segmentation de clients",
      description: "K-means, DBSCAN et classification ascendante sur des clients synthétiques : choix de k, projections ACP et t-SNE, lecture métier",
      difficulty: "Avancé",
      estimatedTime: "45 min",
      code: `# Segmentation de clients par clustering (données synthétiques)
# Prérequis : pip install numpy pandas matplotlib scikit-learn
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (silhouette_score, calinski_harabasz_score,
                             davies_bouldin_score, adjusted_rand_score)
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.neighbors import NearestNeighbors

plt.style.use('seaborn-v0_8')

print("SEGMENTATION DE CLIENTS")
print("=" * 50)

# 1. GÉNÉRATION DE DONNÉES SYNTHÉTIQUES
# Les clients sont inventés pour l'exemple : quatre groupes dont nous connaissons
# la composition. En pratique, on ne dispose pas de ces « vrais » segments, c'est
# justement ce que le clustering cherche à découvrir.
print("\\nGénération du jeu de données clients...")
rng = np.random.default_rng(42)

# (moyenne, écart-type) de chaque variable, pour chaque groupe
segments = {
    'Économes': {'size': 400, 'revenus': (25, 8), 'fidelite': (30, 12), 'freq_achat': (2, 1), 'panier_moyen': (25, 8)},
    'Moyens': {'size': 800, 'revenus': (45, 12), 'fidelite': (55, 15), 'freq_achat': (6, 2), 'panier_moyen': (65, 20)},
    'Fidèles': {'size': 600, 'revenus': (55, 15), 'fidelite': (80, 10), 'freq_achat': (12, 3), 'panier_moyen': (85, 25)},
    'VIP': {'size': 200, 'revenus': (90, 20), 'fidelite': (85, 8), 'freq_achat': (20, 5), 'panier_moyen': (150, 40)},
}

blocs = []
for nom_segment, p in segments.items():
    n = p['size']
    revenus = np.clip(rng.normal(*p['revenus'], n), 15, 150)         # k€ par an
    fidelite = np.clip(rng.normal(*p['fidelite'], n), 0, 100)        # score de 0 à 100
    freq_achat = np.clip(rng.normal(*p['freq_achat'], n), 0.5, 30)   # achats par mois
    panier_moyen = np.clip(rng.normal(*p['panier_moyen'], n), 10, 300)  # euros

    # Corrélations ajoutées : plus de revenus, un panier plus élevé ;
    # plus de fidélité, des achats plus fréquents
    panier_moyen = np.clip(panier_moyen + revenus * 0.3 + rng.normal(0, 5, n), 10, 300)
    freq_achat = np.clip(freq_achat + fidelite * 0.05 + rng.normal(0, 1, n), 0.5, 30)

    blocs.append(pd.DataFrame({
        'revenus_annuels': revenus,
        'score_fidelite': fidelite,
        'freq_achat_mensuelle': freq_achat,
        'panier_moyen': panier_moyen,
        'segment_reel': nom_segment,
    }))

df = pd.concat(blocs, ignore_index=True)

# Variables dérivées
df['ca_mensuel'] = df['freq_achat_mensuelle'] * df['panier_moyen']
df['ca_annuel'] = df['ca_mensuel'] * 12

print(f"Jeu de données créé : {len(df)} clients")
print(f"Chiffre d'affaires annuel moyen par client : {df['ca_annuel'].mean():,.0f} €")
print("Répartition des segments réels :")
print(df['segment_reel'].value_counts())

# 2. ANALYSE EXPLORATOIRE
print("\\nAnalyse exploratoire")
print("=" * 35)

print("Moyennes par segment réel :")
print(df.groupby('segment_reel')[['revenus_annuels', 'score_fidelite', 'freq_achat_mensuelle',
                                  'panier_moyen', 'ca_annuel']].mean().round(1))

variables = ['revenus_annuels', 'score_fidelite', 'freq_achat_mensuelle', 'panier_moyen']
fig, axes = plt.subplots(3, 4, figsize=(20, 14))
fig.suptitle('Analyse exploratoire : segmentation de clients', fontsize=16, fontweight='bold')

# Distribution de chaque variable
for i, var in enumerate(variables):
    axes[0, i].hist(df[var], bins=30, alpha=0.7, edgecolor='black')
    axes[0, i].set_title(f'Distribution : {var}')
    axes[0, i].set_ylabel('Effectif')

# Boîtes à moustaches par segment réel
for i, var in enumerate(variables):
    df.boxplot(column=var, by='segment_reel', ax=axes[1, i])
    axes[1, i].set_title(f'{var} par segment')
    axes[1, i].set_xlabel('Segment')

# Corrélations
correlation_matrix = df[variables + ['ca_annuel']].corr()
axes[2, 0].imshow(correlation_matrix, cmap='coolwarm', aspect='auto')
axes[2, 0].set_xticks(range(len(correlation_matrix.columns)))
axes[2, 0].set_yticks(range(len(correlation_matrix.columns)))
axes[2, 0].set_xticklabels(correlation_matrix.columns, rotation=45)
axes[2, 0].set_yticklabels(correlation_matrix.columns)
axes[2, 0].set_title('Matrice de corrélation')

# Nuages de points colorés par segment réel
couleurs = df['segment_reel'].astype('category').cat.codes
for i, (x, y, titre) in enumerate([
    ('revenus_annuels', 'panier_moyen', 'Revenus et panier moyen'),
    ('score_fidelite', 'freq_achat_mensuelle', 'Fidélité et fréquence'),
    ('ca_annuel', 'score_fidelite', "Chiffre d'affaires et fidélité"),
]):
    axes[2, i + 1].scatter(df[x], df[y], c=couleurs, cmap='Set1', alpha=0.6)
    axes[2, i + 1].set_xlabel(x)
    axes[2, i + 1].set_ylabel(y)
    axes[2, i + 1].set_title(titre)

plt.tight_layout()
plt.show()

# 3. PRÉPARATION DES DONNÉES
print("\\nPréparation des données")
print("=" * 40)

# Variables utilisées pour le clustering. ca_annuel est calculé à partir de deux autres
# variables : il compte donc double dans les distances (à garder en tête).
features_clustering = ['revenus_annuels', 'score_fidelite', 'freq_achat_mensuelle', 'panier_moyen', 'ca_annuel']
X = df[features_clustering]

print(f"Variables retenues : {features_clustering}")
print(f"Forme des données : {X.shape}")

# Repérage des valeurs extrêmes par la méthode de l'écart interquartile (IQR)
def detect_outliers_iqr(serie, facteur=1.5):
    q1, q3 = serie.quantile(0.25), serie.quantile(0.75)
    iqr = q3 - q1
    return (serie < q1 - facteur * iqr) | (serie > q3 + facteur * iqr)

masque = X.apply(detect_outliers_iqr)
n_extremes = masque.any(axis=1).sum()
print(f"Clients ayant au moins une valeur extrême : {n_extremes} ({n_extremes / len(X) * 100:.1f} %)")
# On les conserve ici ; on pourrait aussi les retirer ou les examiner à part.

# Mise à l'échelle : sans elle, le chiffre d'affaires (en milliers d'euros) écraserait les autres
# variables dans les distances. RobustScaler (médiane et IQR) est une alternative moins
# sensible aux valeurs extrêmes.
X_scaled = StandardScaler().fit_transform(X)
print(f"Données mises à l'échelle : {X_scaled.shape}")

# 4. CHOIX DU NOMBRE DE CLUSTERS
print("\\nChoix du nombre de clusters")
print("=" * 45)

k_range = list(range(2, 12))
metrics = {'inertia': [], 'silhouette': [], 'calinski_harabasz': [], 'davies_bouldin': [], 'ari': []}

for k in k_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels_k = kmeans.fit_predict(X_scaled)
    metrics['inertia'].append(kmeans.inertia_)
    metrics['silhouette'].append(silhouette_score(X_scaled, labels_k))
    metrics['calinski_harabasz'].append(calinski_harabasz_score(X_scaled, labels_k))
    metrics['davies_bouldin'].append(davies_bouldin_score(X_scaled, labels_k))
    # Indice de Rand ajusté : accord avec les segments réels (1 = identique, 0 = hasard).
    # Possible seulement parce que les données sont synthétiques.
    metrics['ari'].append(adjusted_rand_score(df['segment_reel'], labels_k))

print(pd.DataFrame(metrics, index=k_range).round(3))

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.suptitle('Choix du nombre de clusters', fontsize=14, fontweight='bold')

axes[0, 0].plot(k_range, metrics['inertia'], 'bo-')
axes[0, 0].set_title('Méthode du coude (inertie)')
axes[0, 1].plot(k_range, metrics['silhouette'], 'ro-')
axes[0, 1].set_title('Silhouette (plus haut = mieux)')
axes[1, 0].plot(k_range, metrics['calinski_harabasz'], 'go-')
axes[1, 0].set_title('Calinski-Harabasz (plus haut = mieux)')
axes[1, 1].plot(k_range, metrics['davies_bouldin'], 'mo-')
axes[1, 1].set_title('Davies-Bouldin (plus bas = mieux)')
for ax in axes.ravel():
    ax.set_xlabel('Nombre de clusters (k)')
    ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

k_silhouette = k_range[int(np.argmax(metrics['silhouette']))]
k_ch = k_range[int(np.argmax(metrics['calinski_harabasz']))]
k_db = k_range[int(np.argmin(metrics['davies_bouldin']))]

print(f"k suggéré par la silhouette : {k_silhouette}")
print(f"k suggéré par Calinski-Harabasz : {k_ch}")
print(f"k suggéré par Davies-Bouldin : {k_db}")

# Les critères internes (silhouette, etc.) préfèrent souvent peu de groupes : ici, ils
# isolent surtout le groupe VIP du reste. Comme nous avons fabriqué quatre segments
# qui se recouvrent en partie, ils ne les retrouvent pas d'eux-mêmes. Le choix final de k
# se discute avec les équipes métier, d'après l'usage prévu des segments.
# Nous fixons k = 4 pour cet exemple (l'indice de Rand ajusté y est le plus haut).
k_optimal = 4
print(f"k retenu : {k_optimal}")

# 5. COMPARAISON D'ALGORITHMES
print("\\nComparaison des algorithmes de clustering")
print("=" * 50)

# Pour DBSCAN, eps est choisi avec la distance au 4e voisin (rang 95 %) :
# une heuristique de départ, à ajuster.
distances, _ = NearestNeighbors(n_neighbors=4).fit(X_scaled).kneighbors(X_scaled)
eps_dbscan = np.sort(distances[:, 3])[int(0.95 * len(X_scaled))]

algorithms = {
    'K-Means': KMeans(n_clusters=k_optimal, random_state=42, n_init=10),
    'DBSCAN': DBSCAN(eps=eps_dbscan, min_samples=5),
    'Agglomératif': AgglomerativeClustering(n_clusters=k_optimal),
}

clustering_results = {}

for name, algorithm in algorithms.items():
    labels = algorithm.fit_predict(X_scaled)
    n_clusters = len(set(labels) - {-1})   # -1 = points de bruit de DBSCAN
    n_bruit = int((labels == -1).sum())

    # Les scores se calculent sur les points non bruités, et seulement s'il y a au moins 2 clusters
    garde = labels != -1
    if n_clusters > 1:
        silhouette = silhouette_score(X_scaled[garde], labels[garde])
        ch_score = calinski_harabasz_score(X_scaled[garde], labels[garde])
        db_score = davies_bouldin_score(X_scaled[garde], labels[garde])
    else:
        silhouette = ch_score = db_score = np.nan

    # Comparaison aux segments connus (possible ici parce que les données sont synthétiques)
    ari = adjusted_rand_score(df['segment_reel'], labels)

    clustering_results[name] = {'labels': labels, 'silhouette': silhouette}

    print(f"\\n{name}")
    print(f"  Clusters : {n_clusters} (points de bruit : {n_bruit})")
    print(f"  Silhouette : {silhouette:.3f}")
    print(f"  Calinski-Harabasz : {ch_score:.1f}")
    print(f"  Davies-Bouldin : {db_score:.3f}")
    print(f"  Indice de Rand ajusté (segments réels) : {ari:.3f}")

# La silhouette de DBSCAN est calculée sans les points de bruit : elle ne porte pas sur
# les mêmes points que celle des deux autres méthodes, la comparaison reste indicative.
# Nous poursuivons avec K-Means : rapide, et ses centres sont faciles à interpréter.
best_algorithm_name = 'K-Means'
best_clusters = clustering_results[best_algorithm_name]['labels']

print(f"\\nMéthode retenue pour la suite : {best_algorithm_name}")

# 6. VISUALISATION DES CLUSTERS
pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(X_scaled)
X_tsne = TSNE(n_components=2, random_state=42, perplexity=30).fit_transform(X_scaled)

fig, axes = plt.subplots(2, 3, figsize=(18, 10))
fig.suptitle(f'Clusters trouvés par {best_algorithm_name}', fontsize=16, fontweight='bold')

# Projection ACP
axes[0, 0].scatter(X_pca[:, 0], X_pca[:, 1], c=best_clusters, cmap='Set1', alpha=0.7)
axes[0, 0].set_xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} de la variance)')
axes[0, 0].set_ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} de la variance)')
axes[0, 0].set_title('Projection ACP')

# Projection t-SNE (sert à visualiser ; les distances entre groupes n'y ont pas de sens précis)
axes[0, 1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=best_clusters, cmap='Set1', alpha=0.7)
axes[0, 1].set_xlabel('t-SNE 1')
axes[0, 1].set_ylabel('t-SNE 2')
axes[0, 1].set_title('Projection t-SNE')

# Segments réels, pour comparaison
codes_reels = pd.Categorical(df['segment_reel']).codes
axes[0, 2].scatter(X_pca[:, 0], X_pca[:, 1], c=codes_reels, cmap='Set2', alpha=0.7)
axes[0, 2].set_xlabel('PC1')
axes[0, 2].set_ylabel('PC2')
axes[0, 2].set_title('Segments réels (référence)')

# Quelques paires de variables
for ax, (x, y, titre) in zip(axes[1], [
    ('revenus_annuels', 'score_fidelite', 'Revenus et fidélité'),
    ('freq_achat_mensuelle', 'panier_moyen', 'Fréquence et panier'),
    ('ca_annuel', 'score_fidelite', "Chiffre d'affaires et fidélité"),
]):
    ax.scatter(df[x], df[y], c=best_clusters, cmap='Set1', alpha=0.7)
    ax.set_xlabel(x)
    ax.set_ylabel(y)
    ax.set_title(titre)

plt.tight_layout()
plt.show()

# 7. LECTURE MÉTIER DES CLUSTERS
print("\\nPROFIL DES CLUSTERS")
print("=" * 55)

df['cluster'] = best_clusters

profil = df[df['cluster'] != -1].groupby('cluster').agg(
    clients=('cluster', 'size'),
    revenus=('revenus_annuels', 'mean'),
    fidelite=('score_fidelite', 'mean'),
    freq_achat=('freq_achat_mensuelle', 'mean'),
    panier=('panier_moyen', 'mean'),
    ca_moyen=('ca_annuel', 'mean'),
    ca_total=('ca_annuel', 'sum'),
).round(1)
print(profil)

# Une piste d'action par cluster. Les seuils sont arbitraires (propres à cet exemple) :
# dans un vrai projet, ils viennent des équipes métier.
print("\\nPistes d'action (seuils arbitraires) :")
for cluster_id, ligne in profil.iterrows():
    if ligne['ca_moyen'] > 30000 and ligne['fidelite'] > 75:
        piste = "très gros acheteurs fidèles : avantages réservés, interlocuteur dédié"
    elif ligne['ca_moyen'] > 15000 and ligne['fidelite'] > 60:
        piste = "clients fidèles : récompenses de fidélité, offres personnalisées"
    elif ligne['ca_moyen'] > 5000:
        piste = "clients réguliers : offres pour augmenter la fréquence ou le panier"
    else:
        piste = "clients occasionnels : promotions ciblées"
    print(f"  Cluster {cluster_id} ({int(ligne['clients'])} clients) : {piste}")

# 8. COMPARAISON AVEC LES SEGMENTS RÉELS
print("\\nCOMPARAISON AVEC LES SEGMENTS RÉELS")
print("=" * 45)

print("Table de contingence (lignes : segment réel, colonnes : cluster) :")
print(pd.crosstab(df['segment_reel'], df['cluster'], margins=True))

# Pureté d'un cluster : part de son segment réel majoritaire
puretes = []
for cluster_id in sorted(df.loc[df['cluster'] != -1, 'cluster'].unique()):
    sous_ensemble = df[df['cluster'] == cluster_id]
    majoritaire = sous_ensemble['segment_reel'].mode()[0]
    purete = (sous_ensemble['segment_reel'] == majoritaire).mean()
    puretes.append(purete)
    print(f"Pureté du cluster {cluster_id} : {purete:.2f} (majoritairement {majoritaire})")

print(f"\\nPureté moyenne : {np.mean(puretes):.2f}")`,
      language: "python",
      outputs: [
        "Choix de k : la silhouette est la plus haute pour k = 2 (0,423), l'accord avec les segments fabriqués (indice de Rand ajusté) pour k = 4 (0,765)",
        "K-means avec k = 4 : silhouette 0,368, pureté moyenne des clusters 0,92",
        "DBSCAN : 4 groupes et 58 points de bruit, mais indice de Rand ajusté de 0,040 : peu adapté à ces données"
      ]
    }
  ];

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(() => {
      // Presse-papiers indisponible (contexte non sécurisé, autorisation refusée) : le bouton Télécharger reste utilisable.
    });
  };

  const downloadCode = (example: { title: string; code: string }) => {
    const slug = example.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const url = URL.createObjectURL(new Blob([example.code], { type: "text/x-python;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}.py`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="practical-exercises" className="space-y-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Exercices Pratiques et Exemples de Code
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Trois programmes complets à exécuter chez vous, deux exercices avec indices et solution, deux questions de quiz et des pistes pour un projet de recommandation
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Badge className="bg-purple-100 text-purple-800 px-4 py-2">Code complet</Badge>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2">Données synthétiques</Badge>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">Cas d'usage</Badge>
        </div>
      </div>

      {/* Code Examples */}
      <EducationalCard title="Trois programmes complets" type="exemple">
        <div className="space-y-8">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-4">
              Chaque programme se copie ou se télécharge, puis s'exécute dans votre propre environnement Python
              (numpy, pandas, matplotlib et scikit-learn suffisent, plus seaborn pour le premier).
              Les données du deuxième et du troisième sont générées par le code lui-même, avec une graine aléatoire fixée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {codeExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setActiveCode(index)}
                className={`min-w-0 p-6 rounded-xl text-left transition-all duration-500 border-2 hover:scale-105 ${
                  activeCode === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-blue-500"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h4 className="font-bold text-lg min-w-0 break-words">{example.title}</h4>
                  <Badge className={`${activeCode === index ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-700'}`}>
                    {example.difficulty}
                  </Badge>
                </div>
                <p className={`text-sm mb-3 ${activeCode === index ? 'text-blue-100' : 'text-gray-600'}`}>
                  {example.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${activeCode === index ? 'text-blue-200' : 'text-gray-500'}`}>
                    Durée indicative : {example.estimatedTime}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <Card className="border-2 hover:shadow-2xl transition-all duration-500">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{codeExamples[activeCode].title}</CardTitle>
                    <CardDescription className="text-lg mt-1">{codeExamples[activeCode].description}</CardDescription>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        {codeExamples[activeCode].difficulty}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {codeExamples[activeCode].estimatedTime} (indicatif)
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(codeExamples[activeCode].code, activeCode)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    {copiedCode === activeCode ? (
                      <>
                        <span className="text-green-300">✓</span>
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier le code
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadCode(codeExamples[activeCode])}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gray-950 text-gray-100 p-8 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code>{codeExamples[activeCode].code}</code>
                </pre>
              </div>
              
              {/* Outputs section */}
              <div className="bg-green-50 p-6 border-t-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Exemple de résultats (scikit-learn 1.8, graine aléatoire fixée) :
                </h4>
                <div className="space-y-2">
                  {codeExamples[activeCode].outputs.map((output, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-green-200">
                      <code className="text-sm text-green-700">{output}</code>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </EducationalCard>

      {/* Practical Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExerciseCard
          title="Système de recommandation de films"
          difficulty="intermédiaire"
          estimatedTime="25 min (indicatif)"
          problem="Scénario fictif : une plateforme de streaming veut améliorer ses recommandations. Imaginez 10 000 utilisateurs, 5 000 films et 1 million de notes, ainsi que des métadonnées sur les films (genre, acteurs, réalisateur). Construisez un système qui recommande des films à partir des notes et, si possible, de ces métadonnées. La solution proposée travaille sur des notes simulées, en plus petit nombre (1 000 utilisateurs, 500 films), et n'utilise pas les métadonnées."
          hints={[
            "Commencez par un filtrage collaboratif entre utilisateurs avec la similarité cosinus",
            "Essayez une factorisation matricielle (SVD) pour faire apparaître des facteurs latents",
            "Pour intégrer les métadonnées, combinez un score collaboratif et un score fondé sur le contenu des films",
            "Évaluez avec des mesures de classement (précision@k) ; une mesure de diversité complète utilement",
            "Prévoyez le cas d'un nouvel utilisateur sans historique (démarrage à froid), par exemple avec les films les plus populaires"
          ]}
          solution={`# Système de recommandation de films : solution simplifiée
# Filtrage collaboratif entre utilisateurs, factorisation (SVD), combinaison des deux.
# Les métadonnées des films (version « contenu ») et le démarrage à froid ne sont
# que mentionnés en commentaire : à vous de les ajouter.
# Prérequis : pip install numpy pandas scikit-learn
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

# 1. DONNÉES SIMULÉES
# Chaque utilisateur et chaque film reçoivent 5 « goûts » cachés tirés au hasard ;
# la note dépend de l'accord entre les deux, plus un bruit. En pratique, vous
# chargeriez de vraies notes (par exemple le jeu MovieLens).
print("Système de recommandation de films")
print("=" * 40)

rng = np.random.default_rng(42)
n_users, n_movies, n_latent, n_ratings = 1000, 500, 5, 100000

gouts_users = rng.normal(size=(n_users, n_latent))
gouts_films = rng.normal(size=(n_movies, n_latent))

# 100 000 couples (utilisateur, film) distincts, donc sans doublon
couples = rng.choice(n_users * n_movies, size=n_ratings, replace=False)
user_ids, movie_ids = couples // n_movies, couples % n_movies
accord = (gouts_users[user_ids] * gouts_films[movie_ids]).sum(axis=1)
notes = np.clip(np.round(3.5 + 0.6 * accord + rng.normal(0, 0.5, n_ratings)), 1, 5).astype(int)

ratings_df = pd.DataFrame({'user_id': user_ids, 'movie_id': movie_ids, 'rating': notes})

print(f"Notes : {len(ratings_df)}")
print(f"Utilisateurs : {ratings_df['user_id'].nunique()}")
print(f"Films : {ratings_df['movie_id'].nunique()}")
print(f"Part de la matrice remplie : {len(ratings_df) / (n_users * n_movies):.1%}")

# 2. SÉPARATION ENTRAÎNEMENT / TEST
# Pour chaque utilisateur, 20 % de ses notes sont mises de côté pour le test.
test_df = ratings_df.groupby('user_id').sample(frac=0.2, random_state=42)
train_df = ratings_df.drop(test_df.index)
print(f"\\nEntraînement : {len(train_df)} notes, test : {len(test_df)} notes")

# Matrice utilisateurs x films (0 = pas de note). Le reindex garantit la même forme
# même si un film n'a aucune note d'entraînement.
R = (train_df.pivot(index='user_id', columns='movie_id', values='rating')
     .reindex(index=range(n_users), columns=range(n_movies))
     .fillna(0).to_numpy())
deja_vu = R > 0

# 3. CENTRAGE DES NOTES
# Chaque utilisateur note à sa façon (certains donnent surtout des 4 et 5). On retire donc la
# moyenne de chaque utilisateur : une note devient « mieux ou moins bien que d'habitude »,
# et une case vide vaut 0, c'est-à-dire « dans la moyenne ».
moyenne_user = R.sum(axis=1) / np.maximum(deja_vu.sum(axis=1), 1)
R_centre = np.where(deja_vu, R - moyenne_user[:, None], 0)

# 4. FILTRAGE COLLABORATIF ENTRE UTILISATEURS
# Score d'un film = moyenne des écarts de notes des 10 utilisateurs les plus proches
# (similarité cosinus), pondérée par la similarité.
similarite = cosine_similarity(R_centre)
np.fill_diagonal(similarite, 0)                  # un utilisateur n'est pas son propre voisin
voisins = np.argsort(similarite, axis=1)[:, -10:]
lignes = np.arange(n_users)[:, None]
poids = np.zeros_like(similarite)
poids[lignes, voisins] = np.clip(similarite[lignes, voisins], 0, None)

numerateur = poids @ R_centre
denominateur = poids @ deja_vu
scores_cf = np.divide(numerateur, denominateur, out=np.zeros_like(numerateur), where=denominateur > 0)

# 5. FACTORISATION MATRICIELLE (SVD tronquée)
# On résume chaque utilisateur et chaque film par 10 facteurs latents, puis on reconstruit
# la matrice. Les valeurs reconstruites servent à classer les films pour chaque utilisateur.
# (Traiter les cases vides comme des 0 est une simplification : les méthodes de type ALS
# ou SVD++ ne s'appuient que sur les notes observées.)
svd = TruncatedSVD(n_components=10, random_state=42)
facteurs_users = svd.fit_transform(R_centre)
scores_svd = facteurs_users @ svd.components_
print(f"\\nSVD : {svd.n_components} facteurs latents, "
      f"{svd.explained_variance_ratio_.sum():.1%} de la variance expliquée")

# 6. COMBINAISON DES DEUX APPROCHES
def normaliser(scores):
    """Ramène les scores de chaque utilisateur entre 0 et 1, pour pouvoir les additionner."""
    mini = scores.min(axis=1, keepdims=True)
    etendue = scores.max(axis=1, keepdims=True) - mini
    return (scores - mini) / np.where(etendue == 0, 1, etendue)

alpha = 0.7
scores_hybride = alpha * normaliser(scores_svd) + (1 - alpha) * normaliser(scores_cf)

# Référence : classer les films par popularité (nombre de notes >= 4 à l'entraînement).
# Elle sert aussi de solution de repli pour un nouvel utilisateur sans historique.
popularite = (train_df['rating'] >= 4).groupby(train_df['movie_id']).sum().reindex(range(n_movies), fill_value=0)
scores_popularite = np.tile(popularite.to_numpy(dtype=float), (n_users, 1))

methodes = {
    'Popularité': scores_popularite,
    'Collaboratif': scores_cf,
    'SVD': scores_svd,
    'Hybride': scores_hybride,
}

def recommander(scores, user_idx, n=5):
    """Les n films non vus avec le meilleur score pour un utilisateur."""
    s = scores[user_idx].astype(float).copy()
    s[deja_vu[user_idx]] = -np.inf
    return np.argsort(s)[::-1][:n]

# 7. EXEMPLE POUR UN UTILISATEUR
utilisateur = 102
print(f"\\nTop 5 pour l'utilisateur {utilisateur} (numéros de films) :")
for nom, scores in methodes.items():
    print(f"  {nom} : {recommander(scores, utilisateur).tolist()}")

# 8. ÉVALUATION : précision@5 sur les films du jeu de test
# Pour chaque utilisateur, on classe les films qu'il a notés dans le jeu de test et on
# regarde la part des 5 premiers qu'il a aimés (note >= 4). Ces notes ne dépendent pas du
# modèle : on mesure si le classement place les films aimés avant les autres.
# (Classer les 500 films du catalogue ne conviendrait pas ici : un film non noté n'est pas
# un film détesté, et dans ces données les films notés sont tirés au hasard.)
def precision_at_k(scores, k=5):
    precisions = []
    for user_idx, groupe in test_df.groupby('user_id'):
        if len(groupe) < k:
            continue
        scores_test = scores[user_idx, groupe['movie_id'].to_numpy()]
        meilleurs = np.argsort(scores_test)[::-1][:k]
        precisions.append((groupe['rating'].to_numpy()[meilleurs] >= 4).mean())
    return np.mean(precisions)

part_aimes = (test_df['rating'] >= 4).mean()
print(f"\\nPrécision@5 moyenne (référence si l'on classait au hasard : {part_aimes:.3f}) :")
for nom, scores in methodes.items():
    print(f"  {nom} : {precision_at_k(scores):.3f}")`}
        />

        <ExerciseCard
          title="Détection de fraude dans des transactions"
          difficulty="avancé"
          estimatedTime="35 min (indicatif)"
          problem="Scénario fictif : une banque veut repérer des fraudes parmi 100 000 transactions décrites par 30 variables (montant, localisation, heure, type de commerçant, historique du client...). Seules 0,1 % des transactions sont frauduleuses. Construisez un modèle qui détecte au moins 95 % des fraudes en limitant les fausses alertes. La solution proposée utilise 50 000 transactions simulées, dont 0,2 % de fraudes."
          hints={[
            "Les classes sont très déséquilibrées : essayez les poids de classes, le suréchantillonnage (SMOTE) ou le sous-échantillonnage, uniquement sur le jeu d'entraînement",
            "Testez plusieurs algorithmes : forêt aléatoire, Isolation Forest, One-Class SVM",
            "Construisez des variables utiles : fréquence des transactions, rapport entre le montant et l'habitude du client, heure, pays",
            "Visez le rappel (détecter les fraudes) tout en surveillant la précision : choisissez le seuil de décision sur un jeu de validation",
            "Séparez les données dans le temps (entraînement sur le passé, test sur le futur) pour éviter une fuite d'information"
          ]}
          solution={`# Détection de fraude bancaire sur des transactions synthétiques
# Prérequis : pip install numpy pandas matplotlib scikit-learn imbalanced-learn
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (classification_report, confusion_matrix, roc_auc_score,
                             average_precision_score, precision_recall_curve, roc_curve)
from imblearn.over_sampling import SMOTE

print("DÉTECTION DE FRAUDE BANCAIRE")
print("=" * 40)

# 1. GÉNÉRATION DE DONNÉES SYNTHÉTIQUES
# Transactions inventées pour l'exemple : les fraudes y sont fabriquées avec des profils
# différents (montants plus élevés, plus la nuit, comptes plus récents...). Les scores
# obtenus montrent ce que les méthodes retrouvent de ces profils, pas ce que donnerait
# un vrai jeu de transactions, où la fraude est bien plus difficile à distinguer.
print("\\nGénération du jeu de transactions...")
rng = np.random.default_rng(42)

n_transactions = 50000
n_fraud = int(n_transactions * 0.002)      # 0,2 % de fraudes : 100 transactions
n_normal = n_transactions - n_fraud

print(f"Transactions normales : {n_normal}")
print(f"Transactions frauduleuses : {n_fraud}")

def proba(poids):
    """Transforme des poids en probabilités dont la somme vaut exactement 1."""
    poids = np.asarray(poids, dtype=float)
    return poids / poids.sum()

normal_data = {
    'montant': rng.lognormal(3, 1, n_normal),
    'heure': rng.normal(14, 4, n_normal) % 24,                      # pic autour de 14 h
    'jour_semaine': rng.choice(7, n_normal, p=proba([12, 14, 14, 14, 14, 16, 16])),
    'nb_trans_jour': rng.poisson(3, n_normal),
    'nb_trans_semaine': rng.poisson(20, n_normal),
    'solde_compte': rng.normal(5000, 3000, n_normal),
    'age_compte_jours': rng.exponential(500, n_normal),
    'merchant_category': rng.choice(20, n_normal, p=proba(
        [15, 12, 10, 8, 6, 5, 5, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 8])),
    'pays_merchant': rng.choice(5, n_normal, p=proba([70, 15, 8, 4, 3])),
    'montant_moy_30j': rng.lognormal(3, 0.8, n_normal),
}

fraud_data = {
    'montant': rng.lognormal(3.6, 1.3, n_fraud),                    # montants plus élevés
    # plus souvent la nuit (poids par heure, de 0 h à 23 h), avec des minutes aléatoires
    'heure': rng.choice(24, n_fraud, p=proba(
        [8, 9, 10, 12, 8, 6, 4, 3, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 4, 3, 3, 4, 6, 7]) / 2 + 1 / 48) + rng.random(n_fraud),
    'jour_semaine': rng.choice(7, n_fraud),                         # répartition uniforme
    'nb_trans_jour': rng.poisson(5, n_fraud),                       # un peu plus de transactions
    'nb_trans_semaine': rng.poisson(28, n_fraud),
    'solde_compte': rng.normal(4000, 3500, n_fraud),
    'age_compte_jours': rng.exponential(350, n_fraud),              # comptes un peu plus récents
    'merchant_category': rng.choice(20, n_fraud),
    'pays_merchant': rng.choice(5, n_fraud, p=proba([55, 20, 12, 7, 6])),     # un peu plus d'international
    'montant_moy_30j': rng.lognormal(2.8, 1.2, n_fraud),
}

df = pd.concat([pd.DataFrame(normal_data), pd.DataFrame(fraud_data)], ignore_index=True)
df['is_fraud'] = [0] * n_normal + [1] * n_fraud

# Les lignes sont mélangées : leur ordre joue le rôle de l'ordre chronologique.
# Dans un vrai projet, on trie par date de transaction.
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Variables construites
df['montant_log'] = np.log1p(df['montant'])
df['ratio_montant_solde'] = df['montant'] / (df['solde_compte'].abs() + 1)
df['ratio_montant_moyenne'] = df['montant'] / (df['montant_moy_30j'] + 1)
df['is_weekend'] = (df['jour_semaine'] >= 5).astype(int)
df['is_night'] = ((df['heure'] >= 22) | (df['heure'] < 6)).astype(int)
df['freq_trans_day_high'] = (df['nb_trans_jour'] > 10).astype(int)
df['heure_entiere'] = df['heure'].astype(int)

print(f"Jeu de données créé : {len(df)} transactions")
print(f"Taux de fraude : {df['is_fraud'].mean():.3%}")

# 2. ANALYSE EXPLORATOIRE
print("\\nAnalyse exploratoire des profils de fraude...")

print("Moyennes par classe :")
print(df.groupby('is_fraud')[['montant', 'heure', 'nb_trans_jour', 'solde_compte',
                              'age_compte_jours', 'is_night', 'is_weekend']].mean().round(2))

fig, axes = plt.subplots(2, 3, figsize=(17, 9))
fig.suptitle('Profils de fraude', fontsize=16, fontweight='bold')

# Montants (échelle logarithmique), densités par classe
for classe, etiquette in [(0, 'Normal'), (1, 'Fraude')]:
    axes[0, 0].hist(df.loc[df['is_fraud'] == classe, 'montant_log'], bins=50, alpha=0.7,
                    label=etiquette, density=True)
axes[0, 0].set_title('Distribution du montant (log)')
axes[0, 0].legend()

# Taux de fraude par heure
taux_heure = df.groupby('heure_entiere')['is_fraud'].mean() * 100
axes[0, 1].plot(taux_heure.index, taux_heure.values, 'r-o')
axes[0, 1].set_title('Taux de fraude par heure')
axes[0, 1].set_xlabel('Heure')
axes[0, 1].set_ylabel('Taux de fraude (%)')

# Taux de fraude par jour de la semaine
taux_jour = df.groupby('jour_semaine')['is_fraud'].mean() * 100
axes[0, 2].bar(taux_jour.index, taux_jour.values, color='orange', alpha=0.7)
axes[0, 2].set_xticks(range(7))
axes[0, 2].set_xticklabels(['L', 'M', 'M', 'J', 'V', 'S', 'D'])
axes[0, 2].set_title('Taux de fraude par jour')
axes[0, 2].set_ylabel('Taux de fraude (%)')

# Corrélation de chaque variable avec la fraude
correlation_fraude = df.corr()['is_fraud'].drop('is_fraud').sort_values(key=abs)
axes[1, 0].barh(correlation_fraude.index, correlation_fraude.values)
axes[1, 0].set_title('Corrélation avec la fraude')

# Rapport montant / montant moyen sur 30 jours
for classe, etiquette in [(0, 'Normal'), (1, 'Fraude')]:
    axes[1, 1].hist(df.loc[df['is_fraud'] == classe, 'ratio_montant_moyenne'].clip(upper=50), bins=50,
                    alpha=0.7, label=etiquette, density=True)
axes[1, 1].set_title('Montant / montant moyen sur 30 jours')
axes[1, 1].legend()

# Taux de fraude jour / nuit
taux_nuit = df.groupby('is_night')['is_fraud'].mean() * 100
axes[1, 2].bar(['Jour', 'Nuit'], taux_nuit.values, color=['lightblue', 'darkblue'], alpha=0.7)
axes[1, 2].set_title('Taux de fraude : jour et nuit')
axes[1, 2].set_ylabel('Taux de fraude (%)')

plt.tight_layout()
plt.show()

# 3. PRÉPARATION DES DONNÉES
print("\\nPréparation des données pour la modélisation...")

features = ['montant_log', 'heure', 'jour_semaine', 'nb_trans_jour', 'nb_trans_semaine',
            'solde_compte', 'age_compte_jours', 'merchant_category', 'pays_merchant',
            'ratio_montant_solde', 'ratio_montant_moyenne', 'is_weekend', 'is_night',
            'freq_trans_day_high']

X = df[features]
y = df['is_fraud']

# Séparation chronologique : on s'entraîne sur le passé (70 % premières lignes), on teste sur le futur.
# Une séparation aléatoire ferait fuiter du futur dans l'entraînement.
split_index = int(0.7 * len(df))
X_passe, X_futur = X.iloc[:split_index], X.iloc[split_index:]
y_passe, y_futur = y.iloc[:split_index], y.iloc[split_index:]

# Dans le passé, une partie est mise de côté pour valider et régler (stratifiée : la
# fraude est rare, chaque partie doit en contenir).
X_train, X_val, y_train, y_val = train_test_split(
    X_passe, y_passe, test_size=0.2, random_state=42, stratify=y_passe
)

print(f"Variables : {len(features)}")
print(f"Entraînement : {len(X_train)} (fraudes : {y_train.sum()})")
print(f"Validation : {len(X_val)} (fraudes : {y_val.sum()})")
print(f"Test dans le futur : {len(X_futur)} (fraudes : {y_futur.sum()})")

scaler = StandardScaler().fit(X_train)
X_train_scaled = scaler.transform(X_train)
X_val_scaled = scaler.transform(X_val)
X_futur_scaled = scaler.transform(X_futur)

# 4. DÉSÉQUILIBRE DES CLASSES
print("\\nGestion du déséquilibre des classes...")

# SMOTE crée des fraudes synthétiques par interpolation entre fraudes voisines.
# On ne l'applique JAMAIS à la validation ni au test : seulement à l'entraînement.
smote = SMOTE(random_state=42, k_neighbors=3)
X_train_smote, y_train_smote = smote.fit_resample(X_train_scaled, y_train)

print(f"Après SMOTE : {len(X_train_smote)} échantillons")
print(f"Répartition : {pd.Series(y_train_smote).value_counts().to_dict()}")

# 5. PLUSIEURS APPROCHES
print("\\nEntraînement de plusieurs détecteurs...")

models = {
    'Forêt aléatoire (poids de classes)': RandomForestClassifier(
        n_estimators=100, class_weight='balanced', random_state=42),
    'Forêt aléatoire + SMOTE': RandomForestClassifier(n_estimators=100, random_state=42),
    'Isolation Forest': IsolationForest(contamination=0.002, random_state=42),
    'One-Class SVM': OneClassSVM(nu=0.002, kernel='rbf'),
}

# Les deux détecteurs d'anomalies apprennent seulement sur des transactions normales.
X_normal = X_train_scaled[(y_train == 0).to_numpy()]
# One-Class SVM coûte cher quand les données sont nombreuses : sous-échantillon.
X_normal_sous_echantillon = X_normal[rng.choice(len(X_normal), 5000, replace=False)]

def score_fraude(nom, model, X_donnees):
    """Score de fraude : plus il est élevé, plus la transaction semble suspecte."""
    if nom in ('Isolation Forest', 'One-Class SVM'):
        return -model.decision_function(X_donnees)     # decision_function : grand = normal
    return model.predict_proba(X_donnees)[:, 1]

results = {}
for nom, model in models.items():
    if nom == 'Forêt aléatoire + SMOTE':
        model.fit(X_train_smote, y_train_smote)
    elif nom == 'Forêt aléatoire (poids de classes)':
        model.fit(X_train_scaled, y_train)
    elif nom == 'Isolation Forest':
        model.fit(X_normal)
    else:
        model.fit(X_normal_sous_echantillon)

    scores_val = score_fraude(nom, model, X_val_scaled)
    auc = roc_auc_score(y_val, scores_val)
    ap = average_precision_score(y_val, scores_val)
    results[nom] = {'model': model, 'scores_val': scores_val, 'auc': auc, 'ap': ap}

    print(f"\\n{nom}")
    print(f"  AUC-ROC : {auc:.3f}")
    print(f"  Précision moyenne (aire sous la courbe précision-rappel) : {ap:.3f}")

# 6. CHOIX DU MODÈLE
# Avec une classe aussi rare, la précision moyenne est plus informative que l'AUC-ROC.
# Attention : la validation ne contient que quelques fraudes, les scores sont donc instables.
best_name = max(results, key=lambda n: results[n]['ap'])
best_model = results[best_name]['model']
scores_val = results[best_name]['scores_val']

print(f"\\nMODÈLE RETENU : {best_name}")
print(f"AUC-ROC : {results[best_name]['auc']:.3f}, précision moyenne : {results[best_name]['ap']:.3f}")

# Courbes ROC et précision-rappel, distribution des scores, matrice de confusion
precision, recall, seuils = precision_recall_curve(y_val, scores_val)
fpr, tpr, _ = roc_curve(y_val, scores_val)

# 7. CHOIX DU SEUIL DE DÉCISION (sur la validation)
# Seuil 1 : celui qui maximise le F1.
# Seuil 2 : le plus haut seuil qui détecte au moins 95 % des fraudes (objectif de l'énoncé).
f1 = 2 * precision[:-1] * recall[:-1] / np.maximum(precision[:-1] + recall[:-1], 1e-12)
seuil_f1 = seuils[np.argmax(f1)]
seuil_rappel = seuils[recall[:-1] >= 0.95][-1]

print("\\nSeuils choisis sur la validation :")
print(f"  Maximisant le F1 : {seuil_f1:.3f}")
print(f"  Rappel d'au moins 95 % : {seuil_rappel:.3f}")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.suptitle(f'Modèle retenu : {best_name} (validation)', fontsize=14, fontweight='bold')

axes[0, 0].plot(fpr, tpr, linewidth=2, label=f"AUC = {results[best_name]['auc']:.3f}")
axes[0, 0].plot([0, 1], [0, 1], 'k--', alpha=0.5)
axes[0, 0].set_xlabel('Taux de faux positifs')
axes[0, 0].set_ylabel('Taux de vrais positifs (rappel)')
axes[0, 0].set_title('Courbe ROC')
axes[0, 0].legend()

axes[0, 1].plot(recall, precision, linewidth=2, label=f"AP = {results[best_name]['ap']:.3f}")
axes[0, 1].set_xlabel('Rappel')
axes[0, 1].set_ylabel('Précision')
axes[0, 1].set_title('Courbe précision-rappel')
axes[0, 1].legend()

axes[1, 0].hist(scores_val[(y_val == 0).to_numpy()], bins=50, alpha=0.7, label='Normal', density=True)
axes[1, 0].hist(scores_val[(y_val == 1).to_numpy()], bins=50, alpha=0.7, label='Fraude', density=True)
axes[1, 0].axvline(seuil_f1, color='k', linestyle='--', label='Seuil F1')
axes[1, 0].set_xlabel('Score de fraude')
axes[1, 0].set_ylabel('Densité')
axes[1, 0].set_title('Distribution des scores')
axes[1, 0].legend()

cm_val = confusion_matrix(y_val, scores_val >= seuil_f1, labels=[0, 1])
axes[1, 1].imshow(cm_val, cmap='Blues')
for (i, j), valeur in np.ndenumerate(cm_val):
    axes[1, 1].text(j, i, valeur, ha='center', va='center', fontsize=14)
axes[1, 1].set_xticks([0, 1])
axes[1, 1].set_yticks([0, 1])
axes[1, 1].set_xticklabels(['Normal', 'Fraude'])
axes[1, 1].set_yticklabels(['Normal', 'Fraude'])
axes[1, 1].set_xlabel('Prédiction')
axes[1, 1].set_ylabel('Réalité')
axes[1, 1].set_title('Matrice de confusion (seuil F1)')

plt.tight_layout()
plt.show()

# 8. ÉVALUATION FINALE DANS LE FUTUR
# Le jeu futur n'a servi ni à entraîner, ni à choisir le modèle, ni à régler les seuils.
print("\\nÉvaluation sur la période de test (simulation de mise en production)")
print("=" * 60)

scores_futur = score_fraude(best_name, best_model, X_futur_scaled)
print(f"AUC-ROC : {roc_auc_score(y_futur, scores_futur):.3f}")
print(f"Précision moyenne : {average_precision_score(y_futur, scores_futur):.3f}")

for nom_seuil, seuil in [('maximisant le F1', seuil_f1), ('rappel >= 95 % sur la validation', seuil_rappel)]:
    y_pred = (scores_futur >= seuil).astype(int)
    print(f"\\nSeuil {nom_seuil} ({seuil:.3f}) :")
    print(confusion_matrix(y_futur, y_pred, labels=[0, 1]))
    print(classification_report(y_futur, y_pred, target_names=['Normal', 'Fraude'], zero_division=0))`}
        />
      </div>

      {/* Quiz avancés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuizCard
          question="Dans un problème de classification avec des classes très déséquilibrées (99% classe A, 1% classe B), quelle stratégie d'évaluation est la plus appropriée ?"
          options={[
            "Utiliser uniquement l'accuracy globale",
            "Se concentrer sur la précision de la classe majoritaire",
            "Utiliser l'AUC-ROC et l'Average Precision avec validation stratifiée",
            "Équilibrer artificiellement le dataset de test"
          ]}
          correctAnswer={2}
          explanation="Avec 99 % d'exemples de la classe A, un modèle qui répond toujours A a une exactitude de 99 % : cette mesure ne dit presque rien. L'AUC-ROC et la précision moyenne (Average Precision, aire sous la courbe précision-rappel) jugent la qualité du classement des scores indépendamment du seuil de décision. La seconde est plus exigeante quand la classe rare est très rare, car l'AUC-ROC peut rester flatteuse. La validation stratifiée garde la proportion des classes dans chaque pli, et le jeu de test doit conserver la répartition réelle des classes (on ne le rééquilibre pas)."
          difficulty="difficile"
        />

        <QuizCard
          question="Qu'est-ce qui caractérise le mieux le surapprentissage (overfitting) dans un modèle de Machine Learning ?"
          options={[
            "Le modèle a une faible précision sur les données d'entraînement et de test",
            "Le modèle a une haute précision sur l'entraînement mais faible sur le test",
            "Le modèle prend trop de temps à s'entraîner",
            "Le modèle a besoin de plus de données d'entraînement"
          ]}
          correctAnswer={1}
          explanation="Le surapprentissage se caractérise par un modèle qui « mémorise » les données d'entraînement au lieu d'apprendre des régularités qui se généralisent. Il obtient d'excellents résultats sur les données qu'il a vues (entraînement) mais décroche sur de nouvelles données (test). C'est souvent le signe d'un modèle trop complexe pour la quantité de données disponible."
          difficulty="moyen"
        />
      </div>

      <EducationalCard title="Pour aller plus loin : un projet de recommandation pour une boutique en ligne" type="exercice">
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-xl font-medium mb-4">
              Un projet à mener seul, avec vos propres données ou un jeu de données public
            </p>
            <p className="text-gray-600">
              Ce ne sont que des pistes : aucun jeu de données n'est fourni ici. Le catalogue des{" "}
              <Link to="/projects" className="text-blue-700 underline">projets</Link>{" "}
              propose une fiche sur un sujet voisin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-blue-800 mb-2">Étape 1 : explorer les données</h4>
              <div className="text-sm space-y-2">
                <p><strong>Un jeu de données typique (exemple fictif) :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>environ un million d'interactions utilisateur-produit</li>
                  <li>100 000 utilisateurs et 50 000 produits</li>
                  <li>métadonnées : catégories, prix, marques</li>
                  <li>un historique sur plusieurs mois</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-green-800 mb-2">Étape 2 : construire des variables</h4>
              <div className="text-sm space-y-2">
                <p><strong>Pistes :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>représentations des produits (par exemple Word2Vec appliqué aux paniers)</li>
                  <li>saisonnalité des achats</li>
                  <li>similarités entre utilisateurs</li>
                  <li>profils de comportement</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-purple-800 mb-2">Étape 3 : modéliser</h4>
              <div className="text-sm space-y-2">
                <p><strong>Approches :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>factorisation matricielle (SVD, ALS)</li>
                  <li>filtrage collaboratif neuronal</li>
                  <li>combinaison de plusieurs approches</li>
                  <li>mise en service en ligne : un chantier à part</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-red-800 mb-2">Étape 4 : mesurer l'effet</h4>
              <div className="text-sm space-y-2">
                <p><strong>Indicateurs :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>taux de clic</li>
                  <li>taux de conversion</li>
                  <li>variation du chiffre d'affaires</li>
                  <li>test A/B</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-xl border-2 border-indigo-200">
            <h4 className="font-bold text-indigo-800 mb-6 text-xl text-center">Difficultés techniques à prévoir</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-red-600 mb-3">Démarrage à froid</h5>
                <p className="text-sm mb-3">Comment recommander à un nouvel utilisateur sans historique ?</p>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> s'appuyer sur les métadonnées, sur des informations démographiques et sur les produits les plus populaires</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-blue-600 mb-3">Passage à l'échelle</h5>
                <p className="text-sm mb-3">Comment répondre à un très grand nombre de requêtes par seconde ?</p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> précalculer les recommandations, utiliser un cache, recourir à des algorithmes de recherche approchée (par exemple LSH)</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-green-600 mb-3">Diversité et précision</h5>
                <p className="text-sm mb-3">Comment concilier des recommandations précises et la découverte de nouveautés ?</p>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> optimisation de plusieurs objectifs à la fois, compromis entre exploration et exploitation</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-purple-600 mb-3">Données creuses</h5>
                <p className="text-sm mb-3">Que faire quand presque toute la matrice utilisateur-produit est vide ?</p>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> factorisation matricielle, retours implicites (clics, achats), informations annexes sur les produits et les utilisateurs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-xl border-2 border-yellow-200">
            <h4 className="font-bold text-orange-800 mb-4 text-center">Juger l'effet réel : le test A/B</h4>
            <p className="text-center text-sm text-gray-700 mb-4">
              Un système de recommandation se juge sur ce qu'il change vraiment (clics, achats, satisfaction), pas seulement
              sur sa précision hors ligne. Le gain dépend beaucoup du contexte : aucun chiffre ne peut être promis à l'avance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-6 rounded-lg">
                <div className="text-lg font-bold text-green-700">Groupe témoin</div>
                <p className="text-sm text-gray-600">Voit la page habituelle</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <div className="text-lg font-bold text-blue-700">Groupe test</div>
                <p className="text-sm text-gray-600">Voit les recommandations</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <div className="text-lg font-bold text-purple-700">Comparaison</div>
                <p className="text-sm text-gray-600">Écart des taux de conversion, avec un test statistique</p>
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-gray-700">
              <strong>Objectif :</strong> construire le système, puis décider à partir de la mesure.
            </p>
          </div>
        </div>
      </EducationalCard>

      <EducationalCard title="Outils utiles" type="rappel">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Notebooks Jupyter
            </h4>
            <p className="text-sm text-gray-600 mb-3">Environnement interactif pour l'expérimentation</p>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-blue-500" />
              <a href="https://jupyter.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">jupyter.org</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-green-600 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              MLflow
            </h4>
            <p className="text-sm text-gray-600 mb-3">Suivi et gestion des expériences ML</p>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-green-500" />
              <a href="https://mlflow.org" target="_blank" rel="noopener noreferrer" className="text-green-500 text-sm hover:underline">mlflow.org</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-purple-600 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              TensorBoard
            </h4>
            <p className="text-sm text-gray-600 mb-3">Visualisation des métriques d'entraînement</p>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-purple-500" />
              <a href="https://www.tensorflow.org/tensorboard" target="_blank" rel="noopener noreferrer" className="text-purple-500 text-sm hover:underline">tensorflow.org/tensorboard</a>
            </div>
          </div>
        </div>
      </EducationalCard>
    </section>
  );
};

export default PracticalExercisesSection;
