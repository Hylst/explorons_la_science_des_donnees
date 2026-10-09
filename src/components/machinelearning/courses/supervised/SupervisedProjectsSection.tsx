
import ProjectsSection from "../shared/ProjectsSection";

const projects = [
  {
    title: "Prédicteur de prix immobilier",
    description: "Construisez un modèle de prix de logements sur données synthétiques, de la préparation des données à une petite API.",
    problem: "Développez un modèle de régression qui estime le prix d'un logement à partir de ses caractéristiques (surface, nombre de chambres, âge, arrondissement, balcon, parking, ascenseur). Les données sont synthétiques : elles sont générées par le code et ne décrivent aucun marché réel. Incluez la construction de variables, la comparaison de plusieurs modèles par validation croisée, l'analyse des résidus et une API simple qui rejoue exactement le même traitement.",
    solution: `# Prédicteur de prix immobilier : données synthétiques, pipeline scikit-learn, API Flask
# Prérequis : pip install numpy pandas matplotlib scipy scikit-learn xgboost joblib flask
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib
from scipy import stats
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from xgboost import XGBRegressor
from flask import Flask, request, jsonify

# 1. Données synthétiques
def generer_donnees(n=5000, graine=42):
    # Jeu de données SYNTHÉTIQUE : tous les chiffres sont inventés pour l'exercice et ne décrivent aucun marché réel.
    # Pour un vrai projet, utilisez des ventes observées (par exemple les « Demandes de valeurs foncières » sur data.gouv.fr).
    rng = np.random.default_rng(graine)

    surface = np.clip(rng.normal(120, 40, n), 30, 300)
    chambres = np.clip(rng.poisson(3, n) + 1, 1, 6)
    age = np.clip(rng.exponential(15, n), 0, 100)

    arrondissements = ['1er', '2e', '3e', '4e', '5e', '6e', '7e', '8e']
    prix_m2 = dict(zip(arrondissements, [8000, 7500, 6000, 6500, 7000, 5500, 8500, 9000]))  # prix au m² fictifs
    arrondissement = rng.choice(arrondissements, n)

    balcon = rng.binomial(1, 0.4, n)
    parking = rng.binomial(1, 0.6, n)
    ascenseur = rng.binomial(1, 0.7, n)

    # Le prix est un produit de facteurs (effet de l'âge, bonus pour le balcon, etc.), plus un bruit de 10 %
    prix = (pd.Series(arrondissement).map(prix_m2).to_numpy() * surface
            * (1 - age / 200)
            * (1 + 0.05 * balcon)
            * (1 + 0.08 * parking)
            * (1 + 0.03 * ascenseur)
            * (1 + (chambres - 2) * 0.02)
            * (1 + rng.normal(0, 0.1, n)))
    prix = np.clip(prix, 100000, 2000000)

    return pd.DataFrame({
        'surface': surface, 'chambres': chambres, 'age': age,
        'arrondissement': arrondissement,
        'balcon': balcon, 'parking': parking, 'ascenseur': ascenseur,
        'prix': prix,
    })

# 2. Variables construites : fonction sans état, appliquée à l'entraînement ET à l'API
def ajouter_variables(df):
    df = df.copy()
    df['surface_par_chambre'] = df['surface'] / df['chambres']
    df['age_categorie'] = pd.cut(df['age'], bins=[-0.01, 5, 15, 30, 100],
                                 labels=['neuf', 'recent', 'ancien', 'tres_ancien']).astype(str)
    df['score_confort'] = df['balcon'] * 2 + df['parking'] * 3 + df['ascenseur']
    df['surface_premium'] = df['surface'] * df['arrondissement'].isin(['1er', '7e', '8e'])
    df['surface_carre'] = df['surface'] ** 2
    return df

VARIABLES_NUM = ['surface', 'chambres', 'age', 'balcon', 'parking', 'ascenseur',
                 'surface_par_chambre', 'score_confort', 'surface_premium', 'surface_carre']
VARIABLES_CAT = ['arrondissement', 'age_categorie']

def construire_pipeline(modele):
    """Variables construites, mise à l'échelle des nombres, one-hot des catégories, puis modèle.
    Tout est appris sur l'entraînement seulement, et rejoué à l'identique au moment de prédire."""
    return Pipeline([
        ('variables', FunctionTransformer(ajouter_variables)),
        ('colonnes', ColumnTransformer([
            ('num', StandardScaler(), VARIABLES_NUM),
            ('cat', OneHotEncoder(handle_unknown='ignore'), VARIABLES_CAT),
        ])),
        ('modele', modele),
    ])

# 3. Comparaison de modèles
def comparer_modeles(X_train, X_test, y_train, y_test):
    modeles = {
        'Régression linéaire': LinearRegression(),
        'Ridge': Ridge(alpha=1.0),
        'Lasso': Lasso(alpha=0.1, max_iter=10000),   # alpha dépend de l'échelle de la cible (ici des euros)
        'Forêt aléatoire': RandomForestRegressor(n_estimators=100, random_state=42),
        'Gradient boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'XGBoost': XGBRegressor(n_estimators=100, random_state=42),
    }

    resultats = {}
    for nom, modele in modeles.items():
        pipe = construire_pipeline(modele)
        pipe.fit(X_train, y_train)

        r2_train = r2_score(y_train, pipe.predict(X_train))
        y_pred = pipe.predict(X_test)
        r2_test = r2_score(y_test, y_pred)

        # Validation croisée sur l'entraînement : sert à choisir le modèle
        rmse_cv = -cross_val_score(pipe, X_train, y_train, cv=5, scoring='neg_root_mean_squared_error')

        resultats[nom] = {
            'R² entraînement': r2_train,
            'R² test': r2_test,
            'RMSE test': np.sqrt(mean_squared_error(y_test, y_pred)),
            'MAE test': mean_absolute_error(y_test, y_pred),
            'RMSE validation croisée': rmse_cv.mean(),
            'Écart-type des RMSE': rmse_cv.std(),
            'Écart entraînement - test': r2_train - r2_test,
        }
        print(f"{nom} : R² test = {r2_test:.4f}, RMSE test = {resultats[nom]['RMSE test']:,.0f} €")

    return pd.DataFrame(resultats).T

# 4. Réglage des hyperparamètres (ici sur la forêt aléatoire)
def optimiser_foret(X_train, y_train):
    grille = {
        'modele__n_estimators': [100, 200],
        'modele__max_depth': [10, None],
        'modele__min_samples_leaf': [1, 3],
    }
    recherche = GridSearchCV(
        construire_pipeline(RandomForestRegressor(random_state=42)), grille,
        cv=5, scoring='neg_root_mean_squared_error', n_jobs=-1
    )
    recherche.fit(X_train, y_train)

    print(f"Meilleurs paramètres : {recherche.best_params_}")
    print(f"RMSE en validation croisée : {-recherche.best_score_:,.0f} €")
    return recherche.best_estimator_

# 5. Analyse détaillée des résultats
def analyser_modele(pipe, X_test, y_test):
    y_pred = pipe.predict(X_test)
    residus = y_test - y_pred

    fig, axes = plt.subplots(2, 3, figsize=(18, 11))

    axes[0, 0].scatter(y_test, y_pred, alpha=0.6)
    axes[0, 0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    axes[0, 0].set_xlabel('Prix réels (€)')
    axes[0, 0].set_ylabel('Prix prédits (€)')
    axes[0, 0].set_title('Prédictions et valeurs réelles')

    axes[0, 1].hist(residus, bins=50, alpha=0.7, color='skyblue')
    axes[0, 1].axvline(x=0, color='red', linestyle='--')
    axes[0, 1].set_xlabel('Résidus (€)')
    axes[0, 1].set_ylabel('Effectif')
    axes[0, 1].set_title('Distribution des résidus')

    axes[0, 2].scatter(y_pred, residus, alpha=0.6)
    axes[0, 2].axhline(y=0, color='red', linestyle='--')
    axes[0, 2].set_xlabel('Prix prédits (€)')
    axes[0, 2].set_ylabel('Résidus (€)')
    axes[0, 2].set_title('Résidus selon la prédiction')

    stats.probplot(residus, dist="norm", plot=axes[1, 0])
    axes[1, 0].set_title('Diagramme quantile-quantile des résidus')

    # Importance des variables (modèles à base d'arbres)
    modele = pipe.named_steps['modele']
    if hasattr(modele, 'feature_importances_'):
        noms = pipe.named_steps['colonnes'].get_feature_names_out()
        indices = np.argsort(modele.feature_importances_)[::-1][:15]
        axes[1, 1].barh(range(len(indices)), modele.feature_importances_[indices])
        axes[1, 1].set_yticks(range(len(indices)))
        axes[1, 1].set_yticklabels(noms[indices])
        axes[1, 1].set_xlabel('Importance')
        axes[1, 1].set_title('15 variables les plus importantes')

    gammes = pd.cut(y_test, bins=5)
    erreur_par_gamme = (pd.DataFrame({'gamme': gammes, 'erreur': np.abs(residus)})
                        .groupby('gamme', observed=True)['erreur'].mean())
    axes[1, 2].bar(range(len(erreur_par_gamme)), erreur_par_gamme.values)
    axes[1, 2].set_xlabel('Gamme de prix')
    axes[1, 2].set_ylabel('Erreur absolue moyenne (€)')
    axes[1, 2].set_title('Erreur selon la gamme de prix')

    plt.tight_layout()
    plt.show()

    print("\\n=== ANALYSE DÉTAILLÉE ===")
    print(f"RMSE : {np.sqrt(mean_squared_error(y_test, y_pred)):,.0f} €")
    print(f"MAE : {mean_absolute_error(y_test, y_pred):,.0f} €")
    print(f"R² : {r2_score(y_test, y_pred):.4f}")
    print(f"MAPE : {np.mean(np.abs(residus / y_test)) * 100:.2f} %")

    seuil = 3 * np.std(residus)
    n_extremes = int((np.abs(residus) > seuil).sum())
    print(f"Résidus au-delà de 3 écarts-types : {n_extremes} ({n_extremes / len(y_test) * 100:.1f} %)")

    return y_pred, residus

# 6. API Flask : le pipeline enregistré refait lui-même les variables construites
COLONNES_ENTREE = ['surface', 'chambres', 'age', 'arrondissement', 'balcon', 'parking', 'ascenseur']

def creer_api(chemin_modele='immobilier_pipeline.joblib'):
    # Attention : joblib/pickle exécute du code au chargement. Ne chargez que vos propres fichiers.
    # Pour recharger le modèle dans un autre script, ajouter_variables doit être importable
    # (placez-la dans un module partagé par les deux scripts).
    modele = joblib.load(chemin_modele)
    app = Flask(__name__)

    @app.route('/predict', methods=['POST'])
    def predict():
        try:
            donnees = request.get_json()
            bien = pd.DataFrame([{colonne: donnees[colonne] for colonne in COLONNES_ENTREE}])
            prix = float(modele.predict(bien)[0])
            return jsonify({
                'prix_predit': round(prix),
                'prix_au_m2': round(prix / donnees['surface']),
                'status': 'success',
            })
        except (KeyError, TypeError, ValueError) as erreur:
            return jsonify({'status': 'error', 'error': str(erreur)}), 400

    return app

# 7. Programme principal
def main():
    print("=== PRÉDICTEUR DE PRIX IMMOBILIER ===\\n")

    df = generer_donnees()
    print(f"Jeu de données : {df.shape}")

    X = df.drop(columns='prix')
    y = df['prix']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    resultats = comparer_modeles(X_train, X_test, y_train, y_test)
    print("\\n=== COMPARAISON DES MODÈLES ===")
    print(resultats.round(4))

    meilleur = optimiser_foret(X_train, y_train)
    analyser_modele(meilleur, X_test, y_test)

    joblib.dump(meilleur, 'immobilier_pipeline.joblib')
    print("\\nPipeline enregistré dans 'immobilier_pipeline.joblib'")
    print("Lancez l'API avec : creer_api().run()   (jamais debug=True en production)")

    return meilleur, resultats

if __name__ == "__main__":
    modele, resultats = main()`,
    hints: [
      "Commencez par explorer les données : distributions, corrélations, valeurs extrêmes",
      "Construisez des variables utiles (surface par chambre, catégories d'âge, interactions) dans une fonction réutilisée telle quelle à l'entraînement et dans l'API",
      "Comparez plusieurs modèles par validation croisée, en plaçant les transformations dans un pipeline pour éviter toute fuite d'information",
      "Analysez les résidus : leur forme dit si le modèle manque une structure (non-linéarité, variance qui change avec le prix)",
      "Pour l'API, validez les entrées et ne chargez que des fichiers de modèle que vous avez vous-même produits"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "180 min (indicatif)",
    skills: ["Construction de variables", "Régression", "Validation croisée", "Pipelines scikit-learn", "API Flask"],
    tools: ["Python", "scikit-learn", "XGBoost", "Flask", "pandas"],
    category: "Immobilier"
  },
  {
    title: "Assistant de diagnostic (exemple pédagogique)",
    description: "Un classificateur multiclasse sur des données médicales inventées, pour travailler les classes déséquilibrées et les mesures adaptées.",
    problem: "Créez un classificateur qui prédit un diagnostic parmi cinq (sain, syndrome grippal, gastro-entérite, migraine, hypertension) à partir de symptômes, de signes vitaux et d'analyses. Les données sont entièrement synthétiques et le modèle ne doit jamais servir à décider d'un soin. Traitez le déséquilibre des classes sans fuite d'information, choisissez des mesures adaptées (sensibilité, précision par classe, F1 macro) et repérez les confusions les plus graves.",
    solution: `# Assistant de diagnostic : classification multiclasse sur des données SYNTHÉTIQUES
# Exemple pédagogique uniquement : ce modèle ne doit jamais servir à décider d'un soin.
# Prérequis : pip install numpy pandas matplotlib scikit-learn imbalanced-learn joblib streamlit
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay, f1_score
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

DIAGNOSTICS = ['Sain', 'Syndrome_grippal', 'Gastroenterite', 'Migraine', 'Hypertension']
SYMPTOMES = ['fievre', 'maux_tete', 'fatigue', 'douleur_abdominale', 'toux']
LIBELLES = {'fievre': 'Fièvre', 'maux_tete': 'Maux de tête', 'fatigue': 'Fatigue',
            'douleur_abdominale': 'Douleur abdominale', 'toux': 'Toux'}

# Pour chaque diagnostic : (probabilité que le symptôme soit présent, intensité moyenne de 0 à 10).
# Ces profils sont INVENTÉS pour l'exercice : ils ne reflètent pas la médecine.
PROFILS = {
    'Sain':             [(0.05, 1), (0.15, 1), (0.25, 1.2), (0.05, 1), (0.10, 1)],
    'Syndrome_grippal': [(0.80, 3), (0.60, 2), (0.90, 3), (0.10, 1), (0.80, 3)],
    'Gastroenterite':   [(0.40, 2), (0.20, 1), (0.70, 2.5), (0.90, 4), (0.05, 1)],
    'Migraine':         [(0.03, 1), (0.95, 5), (0.50, 2), (0.10, 1), (0.05, 1)],
    'Hypertension':     [(0.03, 1), (0.40, 2), (0.40, 1.5), (0.05, 1), (0.05, 1)],
}

# 1. Génération de données synthétiques
def generer_donnees(n=3000, graine=42):
    rng = np.random.default_rng(graine)

    # Le diagnostic est tiré d'abord, avec des fréquences inégales (classes déséquilibrées) ;
    # les symptômes et les mesures sont ensuite générés à partir de lui.
    diagnostic = rng.choice(DIAGNOSTICS, n, p=[0.45, 0.22, 0.12, 0.13, 0.08])
    est_hta = diagnostic == 'Hypertension'

    age = np.clip(np.where(est_hta, rng.normal(60, 12, n), rng.normal(42, 17, n)), 18, 85)
    sexe = rng.choice(['M', 'F'], n, p=[0.48, 0.52])
    hypertension = rng.binomial(1, np.where(est_hta, 0.9, 0.05))
    diabete = rng.binomial(1, np.where(est_hta, 0.15, 0.06))
    antecedents_familiaux = rng.binomial(1, np.where(est_hta, 0.30, 0.12))

    # Symptômes : présence (tirage de Bernoulli) puis intensité (loi exponentielle), bornée à 10
    p_presence = np.array([[p for p, _ in PROFILS[d]] for d in diagnostic])
    intensite_moyenne = np.array([[m for _, m in PROFILS[d]] for d in diagnostic])
    symptomes = (rng.random((n, 5)) < p_presence) * np.clip(rng.exponential(intensite_moyenne), 0, 10)
    fievre, maux_tete, fatigue, douleur_abdominale, toux = symptomes.T

    # Signes vitaux et analyses (valeurs simulées)
    temperature = np.clip(36.5 + fievre * 0.4 + rng.normal(0, 0.3, n), 35.5, 41.0)
    tension_systolique = np.clip(120 + hypertension * 25 + age * 0.3 + rng.normal(0, 15, n), 90, 200)
    frequence_cardiaque = np.clip(70 + fievre * 8 + rng.normal(0, 10, n), 50, 120)
    leucocytes = np.clip(7000 + fievre * 2000 + rng.normal(0, 2000, n), 3000, 20000)
    crp = np.clip(fievre * 15 + douleur_abdominale * 3 + rng.exponential(2, n), 0, 200)

    return pd.DataFrame({
        'age': age.astype(int), 'sexe': sexe, 'diabete': diabete, 'hypertension': hypertension,
        'antecedents_familiaux': antecedents_familiaux,
        'fievre': fievre.round(1), 'maux_tete': maux_tete.round(1), 'fatigue': fatigue.round(1),
        'douleur_abdominale': douleur_abdominale.round(1), 'toux': toux.round(1),
        'temperature': temperature.round(1), 'tension_systolique': tension_systolique.astype(int),
        'frequence_cardiaque': frequence_cardiaque.astype(int), 'leucocytes': leucocytes.astype(int),
        'crp': crp.round(1),
        'diagnostic': diagnostic,
    })

# 2. Variables dérivées (fonction sans état : la même à l'entraînement et dans l'interface)
def preparer_variables(df):
    df = df.copy()
    df['sexe_masculin'] = (df['sexe'] == 'M').astype(int)

    # Scores simples construits à la main (seuils arbitraires, propres à cet exemple)
    df['risque_cardio'] = ((df['age'] > 50).astype(int) * 2 + df['hypertension'] * 3
                           + df['diabete'] * 2 + df['sexe_masculin'])
    df['syndrome_inflammatoire'] = ((df['fievre'] > 3).astype(int) * 2 + (df['crp'] > 10).astype(int) * 3
                                    + (df['leucocytes'] > 10000).astype(int) * 2)
    df['fievre_maux_tete'] = df['fievre'] * df['maux_tete']
    df['douleur_fievre'] = df['douleur_abdominale'] * df['fievre']
    df['fievre_elevee'] = (df['temperature'] > 38.5).astype(int)
    df['tension_elevee'] = (df['tension_systolique'] > 140).astype(int)
    df['tachycardie'] = (df['frequence_cardiaque'] > 100).astype(int)
    return df

FEATURES = ['age', 'sexe_masculin', 'diabete', 'hypertension', 'antecedents_familiaux',
            *SYMPTOMES, 'temperature', 'tension_systolique', 'frequence_cardiaque', 'leucocytes', 'crp',
            'risque_cardio', 'syndrome_inflammatoire', 'fievre_maux_tete', 'douleur_fievre',
            'fievre_elevee', 'tension_elevee', 'tachycardie']

# 3. Modèles : le rééquilibrage (SMOTE) est DANS le pipeline
# Ainsi, dans la validation croisée, SMOTE ne voit que les données d'entraînement de chaque pli,
# et il n'est jamais appliqué au jeu de test.
def construire_modele(classifieur):
    return ImbPipeline([
        ('smote', SMOTE(random_state=42)),
        ('scaler', StandardScaler()),
        ('modele', classifieur),
    ])

# 4. Évaluation orientée usage médical
def evaluer(modele, X_test, y_test):
    classes = list(modele.classes_)
    y_pred = modele.predict(X_test)
    rapport = classification_report(y_test, y_pred, target_names=classes, output_dict=True)

    print("=== MÉTRIQUES PAR DIAGNOSTIC ===")
    for diagnostic in classes:
        r = rapport[diagnostic]
        print(f"\\n{diagnostic} ({int(r['support'])} patients)")
        print(f"  Précision (valeur prédictive positive) : {r['precision']:.3f}")
        print(f"  Rappel (sensibilité) : {r['recall']:.3f}")
        print(f"  F1 : {r['f1-score']:.3f}")
        if r['recall'] < 0.7:
            print("  Attention : faible sensibilité, des cas seraient manqués")
        if r['precision'] < 0.7:
            print("  Attention : faible précision, risque de surdiagnostic")

    cm = confusion_matrix(y_test, y_pred, labels=classes)
    ConfusionMatrixDisplay(cm, display_labels=classes).plot(cmap='Blues', xticks_rotation=45)
    plt.title('Matrice de confusion')
    plt.tight_layout()
    plt.show()

    print("\\n=== CONFUSIONS À EXAMINER (plus de 10 % d'une classe) ===")
    for i, vraie in enumerate(classes):
        for j, predite in enumerate(classes):
            if i != j and cm[i, j] > 0 and cm[i, j] / cm[i].sum() > 0.1:
                print(f"{vraie} -> {predite} : {cm[i, j]} cas ({cm[i, j] / cm[i].sum():.1%})")
                if vraie != 'Sain' and predite == 'Sain':
                    print("   Le plus grave : un patient malade classé sain")
                elif vraie == 'Sain' and predite != 'Sain':
                    print("   Moins grave : examens supplémentaires inutiles")
    return rapport

# 5. Interface Streamlit (lancée avec : streamlit run diagnostic_app.py)
# Ce script doit pouvoir importer FEATURES et preparer_variables (module partagé avec l'entraînement).
def creer_interface(chemin_modele='diagnostic_pipeline.joblib'):
    import streamlit as st

    package = joblib.load(chemin_modele)     # ne chargez que vos propres fichiers : joblib exécute du code
    modele = package['modele']

    st.title("Assistant de diagnostic (exemple pédagogique)")
    st.warning("Modèle entraîné sur des données synthétiques inventées. Il ne doit jamais servir à décider "
               "d'un soin : pour toute question de santé, consultez un professionnel.")

    st.sidebar.header("Données du patient")
    age = st.sidebar.slider("Âge", 18, 85, 45)
    sexe = st.sidebar.selectbox("Sexe", ["M", "F"])
    diabete = st.sidebar.checkbox("Diabète")
    hypertension = st.sidebar.checkbox("Hypertension connue")
    antecedents = st.sidebar.checkbox("Antécédents familiaux")

    st.sidebar.subheader("Symptômes (0 à 10)")
    valeurs = {nom: st.sidebar.slider(LIBELLES[nom], 0.0, 10.0, 0.0, 0.1) for nom in SYMPTOMES}

    st.sidebar.subheader("Signes vitaux et analyses")
    temperature = st.sidebar.slider("Température (°C)", 35.0, 42.0, 36.5, 0.1)
    tension = st.sidebar.slider("Tension systolique (mmHg)", 80, 200, 120)
    frequence = st.sidebar.slider("Fréquence cardiaque (/min)", 40, 150, 70)
    leucocytes = st.sidebar.slider("Leucocytes (/mm³)", 2000, 25000, 7000, 100)
    crp = st.sidebar.slider("CRP (mg/L)", 0.0, 100.0, 1.0, 0.1)

    if st.sidebar.button("Analyser"):
        patient = pd.DataFrame([{
            'age': age, 'sexe': sexe, 'diabete': int(diabete), 'hypertension': int(hypertension),
            'antecedents_familiaux': int(antecedents), **valeurs,
            'temperature': temperature, 'tension_systolique': tension,
            'frequence_cardiaque': frequence, 'leucocytes': leucocytes, 'crp': crp,
        }])
        probabilites = modele.predict_proba(preparer_variables(patient)[FEATURES])[0]

        st.header("Probabilités estimées par le modèle")
        st.bar_chart(pd.Series(probabilites, index=modele.classes_))

        meilleure = int(np.argmax(probabilites))
        if probabilites[meilleure] >= 0.5:
            st.info(f"Classe la plus probable : {modele.classes_[meilleure]} ({probabilites[meilleure]:.1%})")
        else:
            st.warning("Aucune classe ne se détache nettement : résultat incertain.")

# 6. Programme principal
def main():
    print("=== ASSISTANT DE DIAGNOSTIC (DONNÉES SYNTHÉTIQUES) ===\\n")

    df = generer_donnees()
    print(f"Jeu de données : {df.shape}")
    print(f"Répartition des diagnostics :\\n{df['diagnostic'].value_counts()}")

    X = preparer_variables(df)[FEATURES]
    y = df['diagnostic']

    # Séparation stratifiée AVANT tout rééquilibrage
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    candidats = {
        'Régression logistique': LogisticRegression(max_iter=2000, random_state=42),
        'Forêt aléatoire': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
    }

    # Choix du modèle par validation croisée sur l'entraînement (F1 macro : chaque classe pèse autant)
    plis = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = {}
    for nom, classifieur in candidats.items():
        cv = cross_val_score(construire_modele(classifieur), X_train, y_train, cv=plis, scoring='f1_macro')
        scores[nom] = cv.mean()
        print(f"{nom} : F1 macro en validation croisée = {cv.mean():.3f} (écart-type {cv.std():.3f})")

    meilleur_nom = max(scores, key=scores.get)
    modele = construire_modele(candidats[meilleur_nom]).fit(X_train, y_train)

    print(f"\\n=== ÉVALUATION SUR LE JEU DE TEST : {meilleur_nom} ===\\n")
    evaluer(modele, X_test, y_test)
    f1_test = f1_score(y_test, modele.predict(X_test), average='macro')

    joblib.dump({'modele': modele, 'version': '1.0', 'date': datetime.now().isoformat(),
                 'f1_macro_test': f1_test}, 'diagnostic_pipeline.joblib')
    print("\\nModèle enregistré dans 'diagnostic_pipeline.joblib'")
    return modele

if __name__ == "__main__":
    modele = main()`,
    hints: [
      "Choisissez les mesures selon le coût des erreurs : manquer un malade (faible sensibilité) n'a pas la même gravité qu'un examen inutile",
      "Rééquilibrez les classes (SMOTE, poids de classes) uniquement sur les données d'entraînement, de préférence dans un pipeline pour que la validation croisée reste honnête",
      "Examinez la matrice de confusion pour repérer les erreurs les plus graves",
      "Construisez quelques variables dérivées (scores de risque, interactions) et vérifiez qu'elles aident vraiment",
      "Si vous ajoutez une interface, affichez des probabilités et un avertissement clair : un outil de santé réel suppose une validation clinique"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "200 min (indicatif)",
    skills: ["Classification multiclasse", "Classes déséquilibrées", "Mesures adaptées", "Interface Streamlit"],
    tools: ["Python", "scikit-learn", "imbalanced-learn", "Streamlit"],
    category: "Santé (données synthétiques)"
  },
  {
    title: "Détecteur de spam",
    description: "Un classificateur de spam qui combine TF-IDF, variables construites à la main et un ensemble de modèles, sur des courriels synthétiques.",
    problem: "Développez un classificateur de spam qui analyse le contenu du texte et quelques métadonnées (ici le nombre de pièces jointes). Les courriels sont synthétiques, produits à partir de gabarits. Combinez un TF-IDF et des variables construites (ponctuation, majuscules, liens, mots suspects), assemblez plusieurs modèles, évaluez avec des mesures adaptées et proposez une interface simple pour tester un message.",
    solution: `# Détecteur de spam : TF-IDF, variables construites à la main, ensemble de modèles
# Courriels SYNTHÉTIQUES produits à partir de gabarits (aucun courriel réel).
# Les gabarits de spam et de courriels légitimes n'ont presque aucun mot en commun : les scores seront
# parfaits, ce qui n'arrive jamais sur de vrais messages (rédigés par des humains, souvent ambigus).
# Prérequis : pip install numpy pandas matplotlib scikit-learn joblib streamlit
import re
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib
from datetime import datetime
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (ConfusionMatrixDisplay, classification_report, f1_score,
                             precision_score, recall_score, roc_auc_score, roc_curve)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler  # MultinomialNB exige des valeurs >= 0

# 1. Courriels synthétiques
def generer_donnees(n=5000, graine=42):
    rng = np.random.default_rng(graine)

    legitimes = [
        "Bonjour {nom}, j'espère que vous allez bien. Je vous écris au sujet de {sujet}. Pouvez-vous me donner votre avis ? Cordialement, {expediteur}",
        "Salut {nom} ! Comment ça va ? J'ai pensé à toi en voyant {sujet}. On se voit bientôt ? Bises, {expediteur}",
        "Chère {nom}, suite à notre conversation sur {sujet}, voici les documents demandés. Bien à vous, {expediteur}",
        "Hi {nom}, thanks for your email about {sujet}. I'll get back to you soon. Best regards, {expediteur}",
        "Rappel : votre rendez-vous concernant {sujet} est prévu demain. Merci de confirmer. {expediteur}",
    ]
    spams = [
        "FÉLICITATIONS {nom} !!! Vous avez gagné {montant} € !!! Cliquez ICI MAINTENANT pour récupérer votre ARGENT !!!",
        "URGENT {nom} : votre compte sera suspendu !!! Cliquez sur ce lien IMMÉDIATEMENT : http://connexion-{domaine}.example/verifier",
        "OFFRE EXCEPTIONNELLE {nom} !!! -90 % sur TOUT !!! ACHETEZ MAINTENANT !!! Stock limité !!!",
        "Pilules miracle {nom} ! Perdez 20 kg en 1 semaine ! 100 % garanti ! Commandez maintenant !",
        "Prêt urgent {nom} ? {montant} € en 24 h SANS JUSTIFICATIF ! Appelez le 00 00 00 00 00 MAINTENANT !",
    ]

    noms = ["Jean", "Marie", "Pierre", "Sarah", "Mohamed", "Julie", "David", "Anna"]
    sujets = ["le projet", "la réunion", "les vacances", "le budget", "la présentation", "l'échéance", "la conférence"]
    expediteurs = ["un collègue", "la directrice", "un ami", "un client", "un partenaire", "l'équipe", "le responsable"]
    montants = ["1000", "5000", "10000", "50000", "100000"]
    domaines = ["banque", "boutique", "paiement", "messagerie", "assurance"]

    lignes = []
    for i in range(n):
        est_spam = i >= int(n * 0.6)          # 60 % de courriels légitimes, 40 % de spams
        nom = rng.choice(noms)
        if est_spam:
            corps = rng.choice(spams).format(nom=nom, montant=rng.choice(montants), domaine=rng.choice(domaines))
            sujet = f"URGENT !!! {nom}" if rng.random() > 0.5 else f"Félicitations {nom} !!!"
            pieces_jointes = rng.poisson(2)       # valeurs inventées : plus de pièces jointes dans les spams
        else:
            sujet_court = rng.choice(sujets)
            corps = rng.choice(legitimes).format(nom=nom, sujet=sujet_court, expediteur=rng.choice(expediteurs))
            sujet = f"Re : {sujet_court}" if rng.random() > 0.5 else sujet_court.capitalize()
            pieces_jointes = rng.poisson(0.3)
        lignes.append({'texte': f"{sujet} {corps}", 'pieces_jointes': pieces_jointes, 'label': int(est_spam)})

    return pd.DataFrame(lignes).sample(frac=1, random_state=graine).reset_index(drop=True)

# 2. Variables construites à partir du texte
MOTS_SUSPECTS = ['urgent', 'félicitations', 'gratuit', 'gagné', 'cliquez', 'maintenant', 'offre', 'limité',
                 'argent', 'prêt', 'crédit', 'miracle', 'garanti', 'sans justificatif', 'immédiatement']

class TextFeatureExtractor(BaseEstimator, TransformerMixin):
    """Transforme une série de textes en tableau de variables numériques."""
    noms = ['nb_mots', 'nb_caracteres', 'longueur_moyenne_mot', 'nb_exclamations', 'nb_questions',
            'part_majuscules', 'nb_urls', 'nb_adresses_mail', 'nb_nombres', 'nb_devises',
            'nb_mots_suspects', 'part_mots_suspects', 'nb_caracteres_repetes']

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return np.array([self._extraire(texte) for texte in X])

    def get_feature_names_out(self, input_features=None):
        return np.array(self.noms)

    def _extraire(self, texte):
        original = "" if pd.isna(texte) else str(texte)
        bas = original.lower()      # les majuscules disparaissent après lower() : on mesure sur l'original
        mots = bas.split()
        return [
            len(mots),
            len(bas),
            np.mean([len(mot) for mot in mots]) if mots else 0,
            bas.count('!'),
            bas.count('?'),
            sum(c.isupper() for c in original) / len(original) if original else 0,
            len(re.findall(r'https?://\\S+', bas)),
            len(re.findall(r'\\b[\\w.%+-]+@[\\w.-]+\\.[a-z]{2,}\\b', bas)),
            len(re.findall(r'\\d+', bas)),
            len(re.findall(r'[€$£¥]', bas)),
            sum(mot in bas for mot in MOTS_SUSPECTS),
            sum(mot in bas for mot in MOTS_SUSPECTS) / len(mots) if mots else 0,
            len(re.findall(r'(.)\\1{2,}', bas)),    # caractères répétés : "!!!", "???"
        ]

# 3. Prétraitement et modèle (un seul pipeline, enregistré en bloc)
def construire_pipeline():
    # Les transformations s'apprennent sur l'entraînement seulement.
    # clip=True : une valeur de test hors de l'intervalle d'entraînement ne devient pas négative
    # (MultinomialNB refuserait des valeurs négatives).
    preprocesseur = ColumnTransformer([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2), strip_accents='unicode'), 'texte'),
        ('stats', Pipeline([('extraction', TextFeatureExtractor()), ('echelle', MinMaxScaler(clip=True))]), 'texte'),
        ('meta', MinMaxScaler(clip=True), ['pieces_jointes']),
    ])
    ensemble = VotingClassifier(
        estimators=[
            ('nb', MultinomialNB(alpha=0.1)),
            ('lr', LogisticRegression(C=1, max_iter=1000, random_state=42)),
            ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
        ],
        voting='soft',     # moyenne des probabilités
    )
    return Pipeline([('preprocesseur', preprocesseur), ('ensemble', ensemble)])

# 4. Évaluation
def evaluer(pipe, X_test, y_test):
    y_proba = pipe.predict_proba(X_test)[:, 1]
    y_pred = (y_proba >= 0.5).astype(int)

    print("=== ÉVALUATION ===\\n")
    print(classification_report(y_test, y_pred, target_names=['Légitime', 'Spam']))

    fig, axes = plt.subplots(2, 2, figsize=(11, 9))
    ConfusionMatrixDisplay.from_predictions(y_test, y_pred, display_labels=['Légitime', 'Spam'],
                                            cmap='Blues', ax=axes[0, 0], colorbar=False)
    axes[0, 0].set_title('Matrice de confusion')

    fpr, tpr, _ = roc_curve(y_test, y_proba)
    auc = roc_auc_score(y_test, y_proba)
    axes[0, 1].plot(fpr, tpr, lw=2, label=f'AUC = {auc:.3f}')
    axes[0, 1].plot([0, 1], [0, 1], 'k--')
    axes[0, 1].set_xlabel('Taux de faux positifs')
    axes[0, 1].set_ylabel('Taux de vrais positifs')
    axes[0, 1].set_title('Courbe ROC')
    axes[0, 1].legend(loc='lower right')

    axes[1, 0].hist(y_proba[(y_test == 0).to_numpy()], bins=50, alpha=0.5, label='Légitime', color='blue')
    axes[1, 0].hist(y_proba[(y_test == 1).to_numpy()], bins=50, alpha=0.5, label='Spam', color='red')
    axes[1, 0].set_xlabel('Probabilité de spam')
    axes[1, 0].set_ylabel('Effectif')
    axes[1, 0].set_title('Distribution des probabilités')
    axes[1, 0].legend()

    # Effet du seuil de décision : un faux positif (courriel légitime classé spam) coûte plus
    # cher qu'un spam qui passe, d'où l'intérêt de pouvoir monter le seuil.
    seuils = np.arange(0.1, 1.0, 0.05)
    for nom, mesure in [('Précision', precision_score), ('Rappel', recall_score), ('F1', f1_score)]:
        axes[1, 1].plot(seuils, [mesure(y_test, (y_proba >= s).astype(int), zero_division=0) for s in seuils], label=nom)
    axes[1, 1].set_xlabel('Seuil')
    axes[1, 1].set_ylabel('Score')
    axes[1, 1].set_title('Mesures selon le seuil')
    axes[1, 1].legend()

    plt.tight_layout()
    plt.show()

    # Analyse des erreurs (le texte vient du DataFrame de test)
    for titre, masque in [('Faux positifs (légitime classé spam)', (y_test == 0) & (y_pred == 1)),
                          ('Faux négatifs (spam classé légitime)', (y_test == 1) & (y_pred == 0))]:
        textes = X_test.loc[masque.to_numpy(), 'texte']
        print(f"\\n{titre} : {len(textes)}")
        for i, texte in enumerate(textes.head(3), start=1):
            print(f"  {i}. {texte[:100]}...")

    return auc

# 5. Interface Streamlit (lancée avec : streamlit run spam_app.py)
# Ce script doit pouvoir importer TextFeatureExtractor, car le pipeline enregistré y fait référence
# (placez la classe dans un module partagé avec le script d'entraînement).
def creer_interface(chemin_modele='spam_pipeline.joblib'):
    import streamlit as st

    package = joblib.load(chemin_modele)     # ne chargez que vos propres fichiers : joblib exécute du code
    modele = package['modele']

    st.title("Détecteur de spam (exemple pédagogique)")
    st.caption("Modèle entraîné sur des courriels synthétiques : ses scores ne disent rien de ce qu'il "
               "donnerait sur de vrais messages.")

    st.sidebar.header("Mesures sur le jeu de test")
    for nom, valeur in package['metriques'].items():
        st.sidebar.metric(nom, f"{valeur:.3f}")

    sujet = st.text_input("Sujet :")
    corps = st.text_area("Corps du courriel :", height=200)
    pieces_jointes = st.number_input("Nombre de pièces jointes :", min_value=0, value=0)

    if st.button("Analyser"):
        if corps.strip():
            courriel = pd.DataFrame([{'texte': f"{sujet} {corps}", 'pieces_jointes': pieces_jointes}])
            proba_spam = modele.predict_proba(courriel)[0, 1]
            if proba_spam >= 0.5:
                st.error(f"Probablement un spam (probabilité estimée : {proba_spam:.1%})")
            else:
                st.success(f"Probablement légitime (probabilité de spam estimée : {proba_spam:.1%})")
            st.progress(float(proba_spam))
        else:
            st.warning("Saisissez le contenu du courriel.")

# 6. Programme principal
def main():
    print("=== DÉTECTEUR DE SPAM ===\\n")

    df = generer_donnees()
    print(f"Jeu de données : {df.shape}")
    print(f"Répartition : {df['label'].value_counts().to_dict()}")

    X = df[['texte', 'pieces_jointes']]
    y = df['label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    pipe = construire_pipeline()
    pipe.fit(X_train, y_train)
    print(f"Variables en entrée du classifieur : {len(pipe.named_steps['preprocesseur'].get_feature_names_out())}")

    auc = evaluer(pipe, X_test, y_test)

    # Variables les plus pesantes dans la régression logistique de l'ensemble
    regression = pipe.named_steps['ensemble'].named_estimators_['lr']
    noms = pipe.named_steps['preprocesseur'].get_feature_names_out()
    print("\\n=== 10 VARIABLES AUX COEFFICIENTS LES PLUS FORTS (régression logistique) ===")
    for idx in np.argsort(np.abs(regression.coef_[0]))[::-1][:10]:
        print(f"  {noms[idx]} : {regression.coef_[0][idx]:+.3f}")

    y_pred = pipe.predict(X_test)
    metriques = {'Précision': precision_score(y_test, y_pred), 'Rappel': recall_score(y_test, y_pred),
                 'F1': f1_score(y_test, y_pred), 'AUC-ROC': auc}
    joblib.dump({'modele': pipe, 'metriques': metriques, 'version': '1.0',
                 'date': datetime.now().isoformat()}, 'spam_pipeline.joblib')
    print("\\nModèle enregistré dans 'spam_pipeline.joblib'")
    return pipe, auc

if __name__ == "__main__":
    modele, auc = main()
    print(f"AUC sur le jeu de test = {auc:.3f}")`,
    hints: [
      "Combinez TF-IDF et variables construites (ponctuation, majuscules, liens, mots-clés) dans un même pipeline",
      "Un lexique de sentiments comme VADER est conçu pour l'anglais : il ne convient pas à des courriels en français, mieux vaut s'en passer ou choisir un outil adapté",
      "Les mots-clés suspects dépendent de la langue : adaptez la liste à vos messages",
      "Testez différents seuils : classer un courriel légitime comme spam coûte en général plus cher que laisser passer un spam",
      "Ici les gabarits rendent la tâche triviale : cherchez comment rendre le jeu de données plus réaliste (messages ambigus, fautes, spams sans mots-clés)"
    ],
    difficulty: "intermédiaire" as const,
    estimatedTime: "150 min (indicatif)",
    skills: ["Traitement de texte", "Construction de variables", "Classification binaire", "Interface web"],
    tools: ["Python", "scikit-learn", "Streamlit", "Expressions régulières"],
    category: "Texte et sécurité"
  }
];

const SupervisedProjectsSection = () => {
  return (
    <ProjectsSection
      title="Projets pratiques en apprentissage supervisé"
      projects={projects}
      description="Trois projets pour mettre en pratique l'apprentissage supervisé : régression, classification multiclasse avec classes déséquilibrées, classification de texte. Les données sont synthétiques et générées par le code : les scores obtenus ne disent rien de ce que donneraient des données réelles, et ces programmes sont des points de départ, pas des solutions prêtes pour la production."
    />
  );
};

export default SupervisedProjectsSection;
