
import ProjectsSection from "../shared/ProjectsSection";

const projects = [
  {
    title: "🏠 Prédicteur de Prix Immobilier Avancé",
    description: "Créez un système complet de prédiction des prix immobiliers avec feature engineering avancé et interface web interactive.",
    problem: "Développez un modèle de régression pour prédire les prix immobiliers en utilisant des données complexes (surface, localisation, caractéristiques, données démographiques). Incluez feature engineering, sélection de modèles, analyse des résidus et déploiement d'une API web.",
    solution: `# Solution Complète : Prédicteur Prix Immobilier
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import StandardScaler, LabelEncoder, PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.feature_selection import SelectKBest, f_regression
import xgboost as xgb
import pickle
from flask import Flask, request, jsonify, render_template

# 1. Chargement et exploration des données
def load_and_explore_data():
    # Jeu de données SYNTHÉTIQUE : tous les chiffres sont inventés pour l'exercice et ne décrivent aucun marché réel.
    # Pour un vrai projet, utilisez des ventes observées (par exemple les « Demandes de valeurs foncières » sur data.gouv.fr).
    np.random.seed(42)
    n_samples = 5000
    
    # Features de base
    surface = np.random.normal(120, 40, n_samples)
    surface = np.clip(surface, 30, 300)
    
    chambres = np.random.poisson(3, n_samples) + 1
    chambres = np.clip(chambres, 1, 6)
    
    age = np.random.exponential(15, n_samples)
    age = np.clip(age, 0, 100)
    
    # Localisation (impact important)
    arrondissements = ['1er', '2ème', '3ème', '4ème', '5ème', '6ème', '7ème', '8ème']
    prix_base_arr = [8000, 7500, 6000, 6500, 7000, 5500, 8500, 9000]  # Prix/m² fictifs
    
    arrondissement = np.random.choice(arrondissements, n_samples)
    prix_m2_base = [prix_base_arr[arrondissements.index(arr)] for arr in arrondissement]
    
    # Features additionnelles
    balcon = np.random.binomial(1, 0.4, n_samples)
    parking = np.random.binomial(1, 0.6, n_samples)
    ascenseur = np.random.binomial(1, 0.7, n_samples)
    
    # Calcul du prix avec interactions complexes
    prix_base = np.array(prix_m2_base) * surface
    
    # Ajustements
    prix_base *= (1 - age/200)  # Dépréciation avec l'âge
    prix_base *= (1 + balcon * 0.05)  # Bonus balcon
    prix_base *= (1 + parking * 0.08)  # Bonus parking
    prix_base *= (1 + ascenseur * 0.03)  # Bonus ascenseur
    prix_base *= (1 + (chambres - 2) * 0.02)  # Ajustement chambres
    
    # Ajout de bruit aléatoire (gaussien)
    bruit = np.random.normal(0, 0.1, n_samples)
    prix_final = prix_base * (1 + bruit)
    prix_final = np.clip(prix_final, 100000, 2000000)
    
    # Création du DataFrame
    df = pd.DataFrame({
        'surface': surface,
        'chambres': chambres,
        'age': age,
        'arrondissement': arrondissement,
        'balcon': balcon,
        'parking': parking,
        'ascenseur': ascenseur,
        'prix': prix_final
    })
    
    return df

# 2. Feature Engineering avancé
def engineer_features(df):
    df_eng = df.copy()
    
    # Variables numériques dérivées
    df_eng['surface_par_chambre'] = df_eng['surface'] / df_eng['chambres']
    df_eng['age_categorie'] = pd.cut(df_eng['age'], bins=[0, 5, 15, 30, 100], 
                                   labels=['Neuf', 'Récent', 'Ancien', 'Très_ancien'])
    
    # Score de confort (combinaison de features)
    df_eng['score_confort'] = (df_eng['balcon'] * 2 + 
                              df_eng['parking'] * 3 + 
                              df_eng['ascenseur'] * 1)
    
    # Interaction surface * arrondissement
    df_eng['surface_premium'] = df_eng['surface'] * (
        df_eng['arrondissement'].isin(['1er', '7ème', '8ème']).astype(int)
    )
    
    # Encodage des variables catégorielles
    le_arr = LabelEncoder()
    df_eng['arrondissement_encoded'] = le_arr.fit_transform(df_eng['arrondissement'])
    
    le_age = LabelEncoder()
    df_eng['age_categorie_encoded'] = le_age.fit_transform(df_eng['age_categorie'])
    
    # Variables polynomiales pour capturer non-linéarités
    poly = PolynomialFeatures(degree=2, include_bias=False, interaction_only=True)
    features_numeric = ['surface', 'chambres', 'score_confort']
    poly_features = poly.fit_transform(df_eng[features_numeric])
    
    # Ajouter quelques features polynomiales sélectionnées
    df_eng['surface_squared'] = df_eng['surface'] ** 2
    df_eng['surface_chambres_interaction'] = df_eng['surface'] * df_eng['chambres']
    
    return df_eng, le_arr, le_age

# 3. Modélisation comparative
def train_and_compare_models(X_train, X_test, y_train, y_test):
    models = {
        'Linear Regression': LinearRegression(),
        'Ridge': Ridge(alpha=1.0),
        'Lasso': Lasso(alpha=0.1),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'XGBoost': xgb.XGBRegressor(n_estimators=100, random_state=42)
    }
    
    results = {}
    trained_models = {}
    
    for name, model in models.items():
        print(f"\\nEntraînement de {name}...")
        
        # Entraînement
        model.fit(X_train, y_train)
        
        # Prédictions
        y_pred_train = model.predict(X_train)
        y_pred_test = model.predict(X_test)
        
        # Métriques
        train_r2 = r2_score(y_train, y_pred_train)
        test_r2 = r2_score(y_test, y_pred_test)
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
        test_mae = mean_absolute_error(y_test, y_pred_test)
        
        # Validation croisée
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, 
                                   scoring='neg_root_mean_squared_error')
        cv_rmse = -cv_scores.mean()
        cv_std = cv_scores.std()  # écart-type des RMSE des 5 plis
        
        results[name] = {
            'Train R²': train_r2,
            'Test R²': test_r2,
            'Test RMSE': test_rmse,
            'Test MAE': test_mae,
            'CV RMSE': cv_rmse,
            'CV Std': cv_std,
            'Overfitting': train_r2 - test_r2
        }
        
        trained_models[name] = model
        
        print(f"  Test R²: {test_r2:.4f}")
        print(f"  Test RMSE: {test_rmse:.0f}€")
        print(f"  Overfitting: {train_r2 - test_r2:.4f}")
    
    return results, trained_models

# 4. Optimisation du meilleur modèle
def optimize_best_model(X_train, y_train):
    # Grille de paramètres pour Random Forest
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [10, 15, 20, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    rf = RandomForestRegressor(random_state=42)
    
    grid_search = GridSearchCV(
        rf, param_grid, cv=5, 
        scoring='neg_mean_squared_error',
        n_jobs=-1, verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    
    print(f"Meilleurs paramètres: {grid_search.best_params_}")
    print(f"Meilleur score CV: {np.sqrt(-grid_search.best_score_):.0f}€")
    
    return grid_search.best_estimator_

# 5. Analyse détaillée des résultats
def analyze_model_performance(model, X_test, y_test, feature_names):
    y_pred = model.predict(X_test)
    residuals = y_test - y_pred
    
    # Graphiques d'analyse
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    
    # 1. Prédictions vs Réalité
    axes[0, 0].scatter(y_test, y_pred, alpha=0.6)
    axes[0, 0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    axes[0, 0].set_xlabel('Prix Réels (€)')
    axes[0, 0].set_ylabel('Prix Prédits (€)')
    axes[0, 0].set_title('Prédictions vs Réalité')
    
    # 2. Distribution des résidus
    axes[0, 1].hist(residuals, bins=50, alpha=0.7, color='skyblue')
    axes[0, 1].set_xlabel('Résidus (€)')
    axes[0, 1].set_ylabel('Fréquence')
    axes[0, 1].set_title('Distribution des Résidus')
    axes[0, 1].axvline(x=0, color='red', linestyle='--')
    
    # 3. Résidus vs Prédictions
    axes[0, 2].scatter(y_pred, residuals, alpha=0.6)
    axes[0, 2].axhline(y=0, color='red', linestyle='--')
    axes[0, 2].set_xlabel('Prix Prédits (€)')
    axes[0, 2].set_ylabel('Résidus (€)')
    axes[0, 2].set_title('Résidus vs Prédictions')
    
    # 4. Q-Q plot
    from scipy import stats
    stats.probplot(residuals, dist="norm", plot=axes[1, 0])
    axes[1, 0].set_title('Q-Q Plot des Résidus')
    
    # 5. Importance des features
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1][:15]  # Top 15
        
        axes[1, 1].barh(range(len(indices)), importances[indices])
        axes[1, 1].set_yticks(range(len(indices)))
        axes[1, 1].set_yticklabels([feature_names[i] for i in indices])
        axes[1, 1].set_xlabel('Importance')
        axes[1, 1].set_title('Top 15 Features Importantes')
    
    # 6. Erreurs par gamme de prix
    price_ranges = pd.cut(y_test, bins=5)
    error_by_range = pd.DataFrame({
        'range': price_ranges,
        'abs_error': np.abs(residuals)
    }).groupby('range')['abs_error'].mean()
    
    axes[1, 2].bar(range(len(error_by_range)), error_by_range.values)
    axes[1, 2].set_xlabel('Gamme de Prix')
    axes[1, 2].set_ylabel('Erreur Absolue Moyenne (€)')
    axes[1, 2].set_title('Erreur par Gamme de Prix')
    axes[1, 2].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.show()
    
    # Statistiques détaillées
    print("\\n=== ANALYSE DÉTAILLÉE ===")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.0f}€")
    print(f"MAE: {mean_absolute_error(y_test, y_pred):.0f}€")
    print(f"R²: {r2_score(y_test, y_pred):.4f}")
    print(f"MAPE: {np.mean(np.abs(residuals/y_test)) * 100:.2f}%")
    
    # Analyse des outliers
    outlier_threshold = 3 * np.std(residuals)
    outliers = np.abs(residuals) > outlier_threshold
    print(f"\\nOutliers détectés: {outliers.sum()} ({outliers.sum()/len(y_test)*100:.1f}%)")
    
    return y_pred, residuals

# 6. API Flask pour le déploiement
def create_flask_app(model, scaler, label_encoders):
    app = Flask(__name__)
    
    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/predict', methods=['POST'])
    def predict():
        try:
            data = request.json
            
            # Préparation des features
            features = np.array([[
                data['surface'],
                data['chambres'],
                data['age'],
                label_encoders['arrondissement'].transform([data['arrondissement']])[0],
                data['balcon'],
                data['parking'],
                data['ascenseur']
            ]])
            
            # Feature engineering (doit correspondre à l'entraînement)
            # ... (ajouter le même feature engineering qu'à l'entraînement)
            
            # Prédiction
            prediction = model.predict(features)[0]
            
            return jsonify({
                'prix_predit': round(prediction, 0),
                'prix_au_m2': round(prediction / data['surface'], 0),
                'status': 'success'
            })
            
        except Exception as e:
            return jsonify({'error': str(e), 'status': 'error'})
    
    return app

# 7. Fonction principale
def main():
    print("=== PRÉDICTEUR PRIX IMMOBILIER AVANCÉ ===\\n")
    
    # Chargement des données
    df = load_and_explore_data()
    print(f"Dataset chargé: {df.shape}")
    
    # Feature engineering
    df_eng, le_arr, le_age = engineer_features(df)
    
    # Préparation pour modélisation
    feature_cols = [col for col in df_eng.columns if col not in ['prix', 'arrondissement', 'age_categorie']]
    X = df_eng[feature_cols]
    y = df_eng['prix']
    
    # Division train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Standardisation
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Comparaison de modèles
    results, models = train_and_compare_models(X_train, X_test, y_train, y_test)
    
    # Affichage des résultats
    results_df = pd.DataFrame(results).T
    print("\\n=== COMPARAISON DES MODÈLES ===")
    print(results_df.round(4))
    
    # Optimisation du meilleur modèle
    best_model = optimize_best_model(X_train, y_train)
    
    # Analyse détaillée
    y_pred, residuals = analyze_model_performance(best_model, X_test, y_test, feature_cols)
    
    # Sauvegarde du modèle
    model_data = {
        'model': best_model,
        'scaler': scaler,
        'feature_names': feature_cols,
        'label_encoders': {'arrondissement': le_arr, 'age_categorie': le_age}
    }
    
    with open('immobilier_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("\\nModèle sauvegardé dans 'immobilier_model.pkl'")
    
    # Créer l'API Flask
    app = create_flask_app(best_model, scaler, {'arrondissement': le_arr})
    print("\\nAPI Flask créée. Lancez avec app.run(debug=True)")
    
    return best_model, scaler, results

if __name__ == "__main__":
    model, scaler, results = main()`,
    hints: [
      "Commencez par une exploration approfondie des données (corrélations, distributions)",
      "Créez des features pertinentes : ratios, interactions, variables catégorielles",
      "Comparez plusieurs algorithmes avec validation croisée",
      "Analysez les résidus pour valider les hypothèses du modèle",
      "Implémentez une API simple pour le déploiement"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "180 min",
    skills: ["Feature Engineering", "Régression Multiple", "Validation Croisée", "API Development"],
    tools: ["Python", "Scikit-learn", "XGBoost", "Flask", "Pandas"],
    category: "Immobilier & Finance"
  },
  {
    title: "🩺 Assistant Diagnostic Médical",
    description: "Développez un système d'aide au diagnostic médical basé sur les symptômes et données cliniques avec interface interactive.",
    problem: "Créez un classificateur médical qui aide au diagnostic de maladies communes en analysant les symptômes, données démographiques et résultats d'examens. Incluez gestion des classes déséquilibrées, métriques médicales appropriées et interface utilisateur pour médecins.",
    solution: `# Solution : Assistant Diagnostic Médical
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.utils.class_weight import compute_class_weight
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

# 1. Génération de données médicales synthétiques réalistes
def generate_medical_data():
    np.random.seed(42)
    n_patients = 3000
    
    # Données démographiques
    age = np.random.normal(45, 20, n_patients)
    age = np.clip(age, 18, 85)
    
    sexe = np.random.choice(['M', 'F'], n_patients, p=[0.48, 0.52])
    
    # Antécédents médicaux (0=Non, 1=Oui)
    diabete = np.random.binomial(1, 0.08, n_patients)
    hypertension = np.random.binomial(1, 0.12, n_patients)
    antecedents_familiaux = np.random.binomial(1, 0.15, n_patients)
    
    # Symptômes principaux (scores de 0 à 10)
    fievre = np.random.exponential(1, n_patients) * np.random.binomial(1, 0.4, n_patients)
    fievre = np.clip(fievre, 0, 10)
    
    maux_tete = np.random.exponential(1, n_patients) * np.random.binomial(1, 0.5, n_patients)
    maux_tete = np.clip(maux_tete, 0, 10)
    
    fatigue = np.random.exponential(1.5, n_patients) * np.random.binomial(1, 0.6, n_patients)
    fatigue = np.clip(fatigue, 0, 10)
    
    douleur_abdominale = np.random.exponential(0.8, n_patients) * np.random.binomial(1, 0.3, n_patients)
    douleur_abdominale = np.clip(douleur_abdominale, 0, 10)
    
    toux = np.random.exponential(1, n_patients) * np.random.binomial(1, 0.35, n_patients)
    toux = np.clip(toux, 0, 10)
    
    # Signes vitaux
    temperature = 36.5 + fievre * 0.4 + np.random.normal(0, 0.3, n_patients)
    temperature = np.clip(temperature, 35.5, 41.0)
    
    tension_systolique = 120 + hypertension * 25 + age * 0.3 + np.random.normal(0, 15, n_patients)
    tension_systolique = np.clip(tension_systolique, 90, 200)
    
    frequence_cardiaque = 70 + fievre * 8 + np.random.normal(0, 10, n_patients)
    frequence_cardiaque = np.clip(frequence_cardiaque, 50, 120)
    
    # Analyses biologiques (simulées)
    leucocytes = 7000 + fievre * 2000 + np.random.normal(0, 2000, n_patients)
    leucocytes = np.clip(leucocytes, 3000, 20000)
    
    crp = fievre * 15 + maux_tete * 5 + np.random.exponential(2, n_patients)
    crp = np.clip(crp, 0, 200)
    
    # Génération des diagnostics basés sur les patterns de symptômes
    diagnostics = []
    
    for i in range(n_patients):
        # Règles simplifiées pour les diagnostics
        score_grippal = fievre[i] * 0.3 + maux_tete[i] * 0.2 + fatigue[i] * 0.25 + toux[i] * 0.25
        score_gastro = douleur_abdominale[i] * 0.5 + fievre[i] * 0.2 + fatigue[i] * 0.3
        score_migraine = maux_tete[i] * 0.6 + fatigue[i] * 0.3 + (10 - fievre[i]) * 0.1
        score_hypertension = tension_systolique[i] / 20 + age[i] / 10 + hypertension[i] * 5
        
        scores = {
            'Syndrome_grippal': score_grippal + np.random.normal(0, 1),
            'Gastroenterite': score_gastro + np.random.normal(0, 1),
            'Migraine': score_migraine + np.random.normal(0, 1),
            'Hypertension': score_hypertension + np.random.normal(0, 2),
            'Sain': 5 + np.random.normal(0, 2)  # Baseline pour état sain
        }
        
        diagnostic = max(scores, key=scores.get)
        diagnostics.append(diagnostic)
    
    # Création du DataFrame
    df = pd.DataFrame({
        'age': age.astype(int),
        'sexe': sexe,
        'diabete': diabete,
        'hypertension': hypertension,
        'antecedents_familiaux': antecedents_familiaux,
        'fievre': fievre.round(1),
        'maux_tete': maux_tete.round(1),
        'fatigue': fatigue.round(1),
        'douleur_abdominale': douleur_abdominale.round(1),
        'toux': toux.round(1),
        'temperature': temperature.round(1),
        'tension_systolique': tension_systolique.astype(int),
        'frequence_cardiaque': frequence_cardiaque.astype(int),
        'leucocytes': leucocytes.astype(int),
        'crp': crp.round(1),
        'diagnostic': diagnostics
    })
    
    return df

# 2. Préprocessing médical spécialisé
def preprocess_medical_data(df):
    df_proc = df.copy()
    
    # Encodage des variables catégorielles
    le_sexe = LabelEncoder()
    df_proc['sexe_encoded'] = le_sexe.fit_transform(df_proc['sexe'])
    
    # Création de features médicales dérivées
    df_proc['imc_category'] = pd.cut(np.random.normal(25, 5, len(df)), 
                                    bins=[0, 18.5, 25, 30, 50], 
                                    labels=['Sous-poids', 'Normal', 'Surpoids', 'Obese'])
    
    # Score de risque cardiovasculaire
    df_proc['risque_cardio'] = (
        (df_proc['age'] > 50).astype(int) * 2 +
        df_proc['hypertension'] * 3 +
        df_proc['diabete'] * 2 +
        (df_proc['sexe'] == 'M').astype(int)
    )
    
    # Score de syndrome inflammatoire
    df_proc['syndrome_inflammatoire'] = (
        (df_proc['fievre'] > 3).astype(int) * 2 +
        (df_proc['crp'] > 10).astype(int) * 3 +
        (df_proc['leucocytes'] > 10000).astype(int) * 2
    )
    
    # Interactions symptômes
    df_proc['fievre_maux_tete'] = df_proc['fievre'] * df_proc['maux_tete']
    df_proc['douleur_fievre'] = df_proc['douleur_abdominale'] * df_proc['fievre']
    
    # Variables d'alerte médicale
    df_proc['fievre_elevee'] = (df_proc['temperature'] > 38.5).astype(int)
    df_proc['tension_elevee'] = (df_proc['tension_systolique'] > 140).astype(int)
    df_proc['tachycardie'] = (df_proc['frequence_cardiaque'] > 100).astype(int)
    
    return df_proc, le_sexe

# 3. Gestion du déséquilibre des classes
def handle_imbalanced_classes(X, y, strategy='smote'):
    print("Distribution des classes avant équilibrage:")
    print(pd.Series(y).value_counts())
    
    if strategy == 'smote':
        smote = SMOTE(random_state=42)
        X_balanced, y_balanced = smote.fit_resample(X, y)
    elif strategy == 'undersample':
        undersampler = RandomUnderSampler(random_state=42)
        X_balanced, y_balanced = undersampler.fit_resample(X, y)
    else:  # weights
        return X, y  # On utilisera class_weight dans le modèle
    
    print("\\nDistribution après équilibrage:")
    print(pd.Series(y_balanced).value_counts())
    
    return X_balanced, y_balanced

# 4. Métriques médicales spécialisées
def medical_evaluation_metrics(y_true, y_pred, y_pred_proba, class_names):
    # Métriques globales
    print("=== MÉTRIQUES MÉDICALES ===\\n")
    
    # Rapport de classification détaillé
    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    
    print("MÉTRIQUES PAR DIAGNOSTIC:")
    for diagnosis in class_names:
        if diagnosis in report:
            precision = report[diagnosis]['precision']
            recall = report[diagnosis]['recall']
            f1 = report[diagnosis]['f1-score']
            support = report[diagnosis]['support']
            
            print(f"\\n{diagnosis}:")
            print(f"  Précision (VPP): {precision:.3f} - Probabilité qu'un diagnostic + soit correct")
            print(f"  Rappel (Sensibilité): {recall:.3f} - % de vrais cas détectés")
            print(f"  F1-Score: {f1:.3f} - Équilibre précision/rappel")
            print(f"  Support: {support} patients")
            
            # Interprétation médicale
            if recall < 0.7:
                print(f"  ⚠️  ATTENTION: Faible sensibilité - risque de manquer des cas de {diagnosis}")
            if precision < 0.7:
                print(f"  ⚠️  ATTENTION: Faible précision - risque de sur-diagnostic de {diagnosis}")
    
    # Matrice de confusion avec interprétation
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(12, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=class_names, yticklabels=class_names)
    plt.title('Matrice de Confusion - Assistant Diagnostic')
    plt.ylabel('Diagnostic Réel')
    plt.xlabel('Diagnostic Prédit')
    plt.show()
    
    # Analyse des erreurs critiques
    print("\\n=== ANALYSE DES ERREURS CRITIQUES ===")
    
    # Identifier les confusions dangereuses
    for i, true_class in enumerate(class_names):
        for j, pred_class in enumerate(class_names):
            if i != j and cm[i, j] > 0:
                error_rate = cm[i, j] / cm[i, :].sum()
                if error_rate > 0.1:  # Plus de 10% d'erreur
                    print(f"⚠️  {true_class} → {pred_class}: {cm[i, j]} cas ({error_rate:.1%})")
                    
                    # Évaluation de la criticité
                    if true_class != 'Sain' and pred_class == 'Sain':
                        print(f"   🔴 CRITIQUE: Faux négatifs - malades non détectés")
                    elif true_class == 'Sain' and pred_class != 'Sain':
                        print(f"   🟡 MODÉRÉ: Faux positifs - examens supplémentaires")
    
    return report

# 5. Interface Streamlit pour les médecins
def create_medical_interface():
    st.title("🩺 Assistant Diagnostic Médical")
    st.warning("Exemple pédagogique sur données synthétiques : ne jamais l'utiliser pour décider d'un soin. Les probabilités ci-dessous sont tirées au hasard.")
    st.markdown("### Démonstration d'interface pour un projet de classification")
    
    # Sidebar pour l'entrée des données patient
    st.sidebar.header("📋 Données Patient")
    
    # Informations démographiques
    age = st.sidebar.slider("Âge", 18, 85, 45)
    sexe = st.sidebar.selectbox("Sexe", ["M", "F"])
    
    # Antécédents
    st.sidebar.subheader("Antécédents médicaux")
    diabete = st.sidebar.checkbox("Diabète")
    hypertension = st.sidebar.checkbox("Hypertension")
    antecedents_familiaux = st.sidebar.checkbox("Antécédents familiaux")
    
    # Symptômes
    st.sidebar.subheader("Symptômes (0-10)")
    fievre = st.sidebar.slider("Fièvre", 0.0, 10.0, 0.0, 0.1)
    maux_tete = st.sidebar.slider("Maux de tête", 0.0, 10.0, 0.0, 0.1)
    fatigue = st.sidebar.slider("Fatigue", 0.0, 10.0, 0.0, 0.1)
    douleur_abdominale = st.sidebar.slider("Douleur abdominale", 0.0, 10.0, 0.0, 0.1)
    toux = st.sidebar.slider("Toux", 0.0, 10.0, 0.0, 0.1)
    
    # Signes vitaux
    st.sidebar.subheader("Signes vitaux")
    temperature = st.sidebar.slider("Température (°C)", 35.0, 42.0, 36.5, 0.1)
    tension = st.sidebar.slider("Tension systolique", 80, 200, 120)
    frequence = st.sidebar.slider("Fréquence cardiaque", 40, 150, 70)
    
    # Analyses biologiques
    st.sidebar.subheader("Analyses biologiques")
    leucocytes = st.sidebar.slider("Leucocytes (/mm³)", 2000, 25000, 7000, 100)
    crp = st.sidebar.slider("CRP (mg/L)", 0.0, 100.0, 1.0, 0.1)
    
    # Bouton de prédiction
    if st.sidebar.button("🔍 Analyser"):
        # Préparation des données (simulation)
        patient_data = np.array([[
            age, 1 if sexe == 'M' else 0, diabete, hypertension, 
            antecedents_familiaux, fievre, maux_tete, fatigue,
            douleur_abdominale, toux, temperature, tension,
            frequence, leucocytes, crp
        ]])
        
        # Simulation de prédiction (remplacer par le vrai modèle)
        diagnoses = ['Syndrome_grippal', 'Gastroenterite', 'Migraine', 'Hypertension', 'Sain']
        probabilities = np.random.dirichlet(np.ones(5))
        
        # Affichage des résultats
        st.header("📊 Résultats de l'analyse")
        
        # Graphique des probabilités
        fig = px.bar(x=diagnoses, y=probabilities, 
                    title="Probabilités diagnostiques",
                    labels={'x': 'Diagnostic', 'y': 'Probabilité'})
        st.plotly_chart(fig)
        
        # Diagnostic principal
        main_diagnosis = diagnoses[np.argmax(probabilities)]
        confidence = np.max(probabilities)
        
        if confidence > 0.7:
            st.success(f"🎯 Diagnostic principal: **{main_diagnosis}** (Confiance: {confidence:.1%})")
        elif confidence > 0.5:
            st.warning(f"⚠️ Diagnostic probable: **{main_diagnosis}** (Confiance: {confidence:.1%})")
        else:
            st.error("❓ Diagnostic incertain - Examen approfondi recommandé")
        
        # Recommandations
        st.subheader("💡 Recommandations")
        if main_diagnosis == 'Syndrome_grippal':
            st.info("Exemple de texte affiché : un vrai conseil médical relève d'un professionnel de santé.")
        elif main_diagnosis == 'Gastroenterite':
            st.info("Exemple de texte affiché : un vrai conseil médical relève d'un professionnel de santé.")
        # ... autres recommandations
        
        # Alertes médicales
        alerts = []
        if temperature > 39:
            alerts.append("🔥 Fièvre élevée")
        if tension > 160:
            alerts.append("⬆️ Hypertension sévère")
        if frequence > 110:
            alerts.append("💓 Tachycardie")
        
        if alerts:
            st.error("🚨 ALERTES MÉDICALES:\\n" + "\\n".join(alerts))

# 6. Fonction principale
def main():
    print("=== ASSISTANT DIAGNOSTIC MÉDICAL ===\\n")
    
    # Génération des données
    df = generate_medical_data()
    print(f"Dataset médical généré: {df.shape}")
    print(f"Distribution des diagnostics:\\n{df['diagnostic'].value_counts()}")
    
    # Préprocessing
    df_proc, le_sexe = preprocess_medical_data(df)
    
    # Préparation pour modélisation
    feature_cols = [col for col in df_proc.columns if col not in ['diagnostic', 'sexe', 'imc_category']]
    X = df_proc[feature_cols]
    y = df_proc['diagnostic']
    
    # Division train/test stratifiée AVANT tout rééquilibrage (sinon des points synthétiques
    # issus du jeu de test fuient dans l'entraînement et les scores sont gonflés)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Gestion des classes déséquilibrées : uniquement sur l'ensemble d'entraînement
    X_train, y_train = handle_imbalanced_classes(X_train, y_train, strategy='smote')

    # Modèles avec pondération des classes
    class_weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
    class_weight_dict = dict(zip(np.unique(y_train), class_weights))
    
    models = {
        'Logistic Regression': LogisticRegression(class_weight='balanced', random_state=42),
        'Random Forest': RandomForestClassifier(
            class_weight='balanced', n_estimators=100, random_state=42
        ),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    best_model = None
    best_score = 0
    
    for name, model in models.items():
        print(f"\\nEntraînement de {name}...")
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)
        
        # Évaluation
        score = model.score(X_test, y_test)
        print(f"Accuracy: {score:.3f}")
        
        if score > best_score:
            best_score = score
            best_model = model
    
    # Évaluation détaillée du meilleur modèle
    print(f"\\n=== ÉVALUATION DU MEILLEUR MODÈLE ({best_model.__class__.__name__}) ===")
    y_pred_final = best_model.predict(X_test)
    y_pred_proba_final = best_model.predict_proba(X_test)
    
    class_names = best_model.classes_
    report = medical_evaluation_metrics(y_test, y_pred_final, y_pred_proba_final, class_names)
    
    return best_model, X_train.columns, class_names

if __name__ == "__main__":
    model, features, classes = main()
    
    # Lancement de l'interface Streamlit
    print("\\n🌐 Interface Streamlit disponible")
    print("Commande: streamlit run diagnostic_app.py")`,
    hints: [
      "Attention aux métriques médicales : sensibilité critique pour ne pas manquer de malades",
      "Gérez le déséquilibre des classes avec SMOTE ou pondération",
      "Analysez la matrice de confusion pour identifier les erreurs dangereuses",
      "Créez des features médicales pertinentes (scores de risque, interactions)",
      "Interface utilisateur adaptée aux médecins avec recommandations"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "200 min",
    skills: ["Classification Médicale", "Classes Déséquilibrées", "Métriques Médicales", "Interface Streamlit"],
    tools: ["Python", "Scikit-learn", "Streamlit", "SMOTE", "Plotly"],
    category: "Santé & Médecine"
  },
  {
    title: "📧 Détecteur de Spam Avancé avec NLP",
    description: "Construisez un système de détection de spam sophistiqué avec traitement du langage naturel et analyse de sentiment.",
    problem: "Développez un classificateur de spam qui analyse non seulement le contenu textuel mais aussi les métadonnées des emails. Implémentez des techniques NLP avancées, feature engineering textuel et une interface web pour tester le système en temps réel.",
    solution: `# Solution : Détecteur de Spam Avancé avec NLP
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.sentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.preprocessing import MinMaxScaler  # valeurs >= 0 exigées par MultinomialNB
from sklearn.base import BaseEstimator, TransformerMixin
import pickle
from wordcloud import WordCloud
import streamlit as st
from datetime import datetime
import email
from email.mime.text import MIMEText

# Téléchargement des ressources NLTK
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('vader_lexicon')
nltk.download('punkt')

# 1. Générateur de données d'emails réalistes
def generate_email_dataset():
    np.random.seed(42)
    n_emails = 5000
    
    # Templates d'emails légitimes
    legitimate_templates = [
        "Bonjour {name}, j'espère que vous allez bien. Je vous écris concernant {topic}. Pouvez-vous me donner votre avis? Cordialement, {sender}",
        "Salut {name}! Comment ça va? J'ai pensé à toi en voyant {topic}. On se voit bientôt? Bises, {sender}",
        "Cher/Chère {name}, suite à notre conversation sur {topic}, voici les documents demandés. Bien à vous, {sender}",
        "Hi {name}, Thanks for your email about {topic}. I'll get back to you soon. Best regards, {sender}",
        "Rappel: Votre rendez-vous concernant {topic} est prévu demain. Merci de confirmer. {sender}"
    ]
    
    # Templates de spam
    spam_templates = [
        "FÉLICITATIONS {name}!!! Vous avez gagné {amount}€!!! Cliquez ICI MAINTENANT pour récupérer votre ARGENT!!!",
        "URGENT {name} - Votre compte sera suspendu!!! Cliquez sur ce lien IMMÉDIATEMENT: www.phishing-{domain}.com",
        "🎉🎉🎉 OFFRE EXCEPTIONNELLE {name}!!! -90% sur TOUT!!! ACHETEZ MAINTENANT!!! Stock limité!!!",
        "Pilules miracle {name}! Perdez 20kg en 1 semaine! 100% garanti! Commandez maintenant!",
        "Prêt urgent {name}? 50000€ en 24h SANS JUSTIFICATIF! Appelez le 08-XX-XX-XX-XX MAINTENANT!"
    ]
    
    # Listes de données pour variation
    names = ["John", "Marie", "Pierre", "Sarah", "Mohamed", "Julie", "David", "Anna"]
    topics = ["projet", "meeting", "vacation", "budget", "presentation", "deadline", "conference"]
    senders = ["colleague", "boss", "friend", "client", "partner", "team", "manager"]
    amounts = ["1000", "5000", "10000", "50000", "100000"]
    domains = ["bank", "amazon", "paypal", "microsoft", "google"]
    
    emails = []
    labels = []
    
    # Génération d'emails légitimes (60%)
    for i in range(int(n_emails * 0.6)):
        template = np.random.choice(legitimate_templates)
        name = np.random.choice(names)
        topic = np.random.choice(topics)
        sender = np.random.choice(senders)
        
        email_text = template.format(name=name, topic=topic, sender=sender)
        
        # Ajout de métadonnées
        subject = f"Re: {topic}" if np.random.random() > 0.5 else f"{topic.title()}"
        sender_email = f"{sender.lower()}@company.com"
        
        # Caractéristiques d'email légitime
        attachments = np.random.poisson(0.3)  # Peu de pièces jointes
        urls = len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', email_text))
        caps_ratio = sum(1 for c in email_text if c.isupper()) / len(email_text)
        exclamation_count = email_text.count('!')
        
        emails.append({
            'subject': subject,
            'body': email_text,
            'sender': sender_email,
            'attachments': attachments,
            'urls': urls,
            'caps_ratio': caps_ratio,
            'exclamation_count': exclamation_count,
            'length': len(email_text)
        })
        labels.append(0)  # Légitime
    
    # Génération de spam (40%)
    for i in range(int(n_emails * 0.4)):
        template = np.random.choice(spam_templates)
        name = np.random.choice(names)
        amount = np.random.choice(amounts)
        domain = np.random.choice(domains)
        
        email_text = template.format(name=name, amount=amount, domain=domain)
        
        # Caractéristiques de spam
        subject = f"URGENT!!! {name}" if np.random.random() > 0.5 else f"Félicitations {name}!!!"
        sender_email = f"noreply@spam-{domain}.com"
        
        attachments = np.random.poisson(2)  # Plus de pièces jointes
        urls = len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', email_text))
        caps_ratio = sum(1 for c in email_text if c.isupper()) / len(email_text)
        exclamation_count = email_text.count('!')
        
        emails.append({
            'subject': subject,
            'body': email_text,
            'sender': sender_email,
            'attachments': attachments,
            'urls': urls,
            'caps_ratio': caps_ratio,
            'exclamation_count': exclamation_count,
            'length': len(email_text)
        })
        labels.append(1)  # Spam
    
    df = pd.DataFrame(emails)
    df['label'] = labels
    df['is_spam'] = df['label'].map({0: 'Ham', 1: 'Spam'})
    
    return df

# 2. Transformateur personnalisé pour features textuelles
class TextFeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.lemmatizer = WordNetLemmatizer()
        self.stemmer = PorterStemmer()
        
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        # X est une série de textes
        features = []
        
        for text in X:
            text_features = self._extract_text_features(text)
            features.append(text_features)
        
        return np.array(features)
    
    def _extract_text_features(self, text):
        if pd.isna(text):
            text = ""
        
        original = str(text)  # texte d'origine : les majuscules disparaissent après lower()
        text = original.lower()

        # Features de base
        word_count = len(text.split())
        char_count = len(text)
        avg_word_length = np.mean([len(word) for word in text.split()]) if text.split() else 0
        
        # Features de ponctuation
        exclamation_count = text.count('!')
        question_count = text.count('?')
        caps_ratio = sum(1 for c in original if c.isupper()) / len(original) if original else 0

        # Features d'URL et email
        url_count = len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text))
        email_count = len(re.findall(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', text))
        
        # Features de nombres et devises
        number_count = len(re.findall(r'\\d+', text))
        currency_count = len(re.findall(r'[€$£¥]', text))
        
        # Analyse de sentiment
        sentiment = self.sia.polarity_scores(text)
        positive_sentiment = sentiment['pos']
        negative_sentiment = sentiment['neg']
        neutral_sentiment = sentiment['neu']
        compound_sentiment = sentiment['compound']
        
        # Mots suspects (spam keywords)
        spam_keywords = [
            'urgent', 'félicitations', 'gratuit', 'gagné', 'cliquez', 'maintenant',
            'offre', 'limitée', 'argent', 'euro', 'dollar', 'prêt', 'crédit',
            'miracle', 'garanti', 'sans', 'justificatif', 'immédiat'
        ]
        
        spam_word_count = sum(1 for word in spam_keywords if word in text)
        spam_word_ratio = spam_word_count / word_count if word_count > 0 else 0
        
        # Répétition de caractères (ex: "!!!", "???")
        repeated_chars = len(re.findall(r'(.)\\1{2,}', text))
        
        return [
            word_count, char_count, avg_word_length,
            exclamation_count, question_count, caps_ratio,
            url_count, email_count, number_count, currency_count,
            positive_sentiment, negative_sentiment, neutral_sentiment, compound_sentiment,
            spam_word_count, spam_word_ratio, repeated_chars
        ]

# 3. Pipeline de preprocessing avancé
def create_preprocessing_pipeline():
    # Pipeline pour le texte (TF-IDF)
    text_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words='english',
            lowercase=True,
            strip_accents='ascii'
        ))
    ])
    
    # Pipeline pour les features textuelles extraites
    text_features_pipeline = Pipeline([
        ('text_features', TextFeatureExtractor()),
        ('scaler', MinMaxScaler())  # StandardScaler produirait des valeurs négatives (ValueError avec MultinomialNB)
    ])

    # Combinaison des pipelines
    combined_pipeline = FeatureUnion([
        ('text_tfidf', text_pipeline),
        ('text_features', text_features_pipeline)
    ])
    
    return combined_pipeline

# 4. Modèle ensemble avancé
def create_ensemble_model():
    # Modèles de base
    nb_model = MultinomialNB(alpha=0.1)
    lr_model = LogisticRegression(C=1, random_state=42)
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    # Ensemble voting
    ensemble = VotingClassifier(
        estimators=[
            ('nb', nb_model),
            ('lr', lr_model),
            ('rf', rf_model)
        ],
        voting='soft'  # Utilise les probabilités
    )
    
    return ensemble

# 5. Évaluation complète avec visualisations
def comprehensive_evaluation(model, X_test, y_test, feature_names=None):
    # Prédictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Métriques
    print("=== ÉVALUATION DÉTAILLÉE ===\\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Ham', 'Spam']))
    
    # Matrice de confusion
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(10, 8))
    
    plt.subplot(2, 2, 1)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=['Ham', 'Spam'], yticklabels=['Ham', 'Spam'])
    plt.title('Matrice de Confusion')
    plt.ylabel('Réalité')
    plt.xlabel('Prédiction')
    
    # Courbe ROC
    fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba)
    auc = roc_auc_score(y_test, y_pred_proba)
    
    plt.subplot(2, 2, 2)
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('Taux de Faux Positifs')
    plt.ylabel('Taux de Vrais Positifs')
    plt.title('Courbe ROC')
    plt.legend(loc="lower right")
    
    # Distribution des probabilités
    plt.subplot(2, 2, 3)
    ham_probs = y_pred_proba[y_test == 0]
    spam_probs = y_pred_proba[y_test == 1]
    
    plt.hist(ham_probs, bins=50, alpha=0.5, label='Ham', color='blue')
    plt.hist(spam_probs, bins=50, alpha=0.5, label='Spam', color='red')
    plt.xlabel('Probabilité de Spam')
    plt.ylabel('Fréquence')
    plt.title('Distribution des Probabilités')
    plt.legend()
    
    # Seuil optimal
    plt.subplot(2, 2, 4)
    precision_scores = []
    recall_scores = []
    f1_scores = []
    
    for threshold in np.arange(0.1, 1.0, 0.05):
        y_pred_thresh = (y_pred_proba >= threshold).astype(int)
        from sklearn.metrics import precision_score, recall_score, f1_score
        
        precision_scores.append(precision_score(y_test, y_pred_thresh))
        recall_scores.append(recall_score(y_test, y_pred_thresh))
        f1_scores.append(f1_score(y_test, y_pred_thresh))
    
    thresholds_plot = np.arange(0.1, 1.0, 0.05)
    plt.plot(thresholds_plot, precision_scores, label='Precision')
    plt.plot(thresholds_plot, recall_scores, label='Recall')
    plt.plot(thresholds_plot, f1_scores, label='F1-Score')
    plt.xlabel('Seuil')
    plt.ylabel('Score')
    plt.title('Métriques vs Seuil')
    plt.legend()
    
    plt.tight_layout()
    plt.show()
    
    # Analyse des erreurs
    errors = X_test[y_test != y_pred]
    if len(errors) > 0:
        print(f"\\n=== ANALYSE DES ERREURS ({len(errors)} cas) ===")
        
        # Faux positifs (Ham classé comme Spam)
        false_positives = X_test[(y_test == 0) & (y_pred == 1)]
        print(f"\\nFaux Positifs (Ham → Spam): {len(false_positives)}")
        if len(false_positives) > 0:
            print("Exemples:")
            for i, fp in enumerate(false_positives.head(3)):
                print(f"  {i+1}. {fp[:100]}...")
        
        # Faux négatifs (Spam classé comme Ham)
        false_negatives = X_test[(y_test == 1) & (y_pred == 0)]
        print(f"\\nFaux Négatifs (Spam → Ham): {len(false_negatives)}")
        if len(false_negatives) > 0:
            print("Exemples:")
            for i, fn in enumerate(false_negatives.head(3)):
                print(f"  {i+1}. {fn[:100]}...")
    
    return auc, cm

# 6. Interface Streamlit pour test en temps réel
def create_streamlit_interface():
    st.set_page_config(page_title="🛡️ Détecteur de Spam", layout="wide")
    
    st.title("🛡️ Détecteur de Spam Avancé")
    st.markdown("### Analysez vos emails en temps réel avec l'IA")
    
    # Sidebar pour les statistiques
    st.sidebar.header("📊 Statistiques du Modèle")
    # Valeurs à remplacer par les métriques calculées lors de l'entraînement (jeu de test)
    st.sidebar.metric("Précision", "à calculer")
    st.sidebar.metric("Rappel", "à calculer")
    st.sidebar.metric("F1-Score", "à calculer")
    st.sidebar.metric("AUC-ROC", "à calculer")
    
    # Interface principale
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("✉️ Analysez votre email")
        
        # Entrée de l'email
        subject = st.text_input("Sujet de l'email:", placeholder="Entrez le sujet...")
        body = st.text_area("Corps de l'email:", height=200, 
                           placeholder="Collez le contenu de votre email ici...")
        
        # Métadonnées optionnelles
        with st.expander("🔧 Métadonnées avancées (optionnel)"):
            sender = st.text_input("Expéditeur:", placeholder="sender@example.com")
            attachments = st.number_input("Nombre de pièces jointes:", min_value=0, value=0)
        
        # Bouton d'analyse
        if st.button("🔍 Analyser l'Email", type="primary"):
            if body.strip():
                # Analyse (simulation - remplacer par le vrai modèle)
                combined_text = f"{subject} {body}"
                
                # Features basiques calculées
                word_count = len(combined_text.split())
                exclamation_count = combined_text.count('!')
                caps_ratio = sum(1 for c in combined_text if c.isupper()) / len(combined_text)
                url_count = len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', combined_text))
                
                # Simulation de prédiction
                spam_indicators = [
                    'urgent', 'félicitations', 'gratuit', 'gagné', 'cliquez', 
                    'maintenant', 'argent', 'euro', 'offre', 'limitée'
                ]
                
                spam_score = sum(1 for word in spam_indicators if word.lower() in combined_text.lower())
                spam_score += exclamation_count * 0.1
                spam_score += caps_ratio * 2
                spam_score += url_count * 0.5
                
                # Probabilité simulée
                spam_probability = min(spam_score / 10, 0.95)
                is_spam = spam_probability > 0.5
                
                # Affichage des résultats
                with col2:
                    st.subheader("📋 Résultats de l'Analyse")
                    
                    # Verdict principal
                    if is_spam:
                        st.error(f"🚨 **SPAM DÉTECTÉ**\\nProbabilité: {spam_probability:.1%}")
                        st.markdown("⚠️ Cet email présente des caractéristiques suspectes")
                    else:
                        st.success(f"✅ **EMAIL LÉGITIME**\\nProbabilité spam: {spam_probability:.1%}")
                        st.markdown("✉️ Cet email semble authentique")
                    
                    # Barre de probabilité
                    st.progress(spam_probability)
                    
                    # Détails de l'analyse
                    st.subheader("🔬 Détails de l'Analyse")
                    
                    st.metric("Mots", word_count)
                    st.metric("Points d'exclamation", exclamation_count)
                    st.metric("Ratio majuscules", f"{caps_ratio:.1%}")
                    st.metric("URLs détectées", url_count)
                    
                    # Indicateurs de risque
                    if exclamation_count > 5:
                        st.warning("⚠️ Beaucoup de points d'exclamation")
                    if caps_ratio > 0.3:
                        st.warning("⚠️ Trop de majuscules")
                    if url_count > 3:
                        st.warning("⚠️ Nombreux liens")
                    
                    # Recommandations
                    st.subheader("💡 Recommandations")
                    if is_spam:
                        st.markdown("""
                        - 🗑️ Déplacer vers le dossier spam
                        - 🚫 Ne pas cliquer sur les liens
                        - 📞 Vérifier par téléphone si c'est urgent
                        - 🔒 Ne pas donner d'infos personnelles
                        """)
                    else:
                        st.markdown("""
                        - ✅ Email probablement sûr
                        - 🔍 Vérifiez l'expéditeur si incertain
                        - 💭 Faites confiance à votre instinct
                        """)
            else:
                st.warning("⚠️ Veuillez entrer le contenu de l'email")
    
    # Section d'information
    st.markdown("---")
    st.subheader("ℹ️ Comment fonctionne le détecteur ?")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        **🔤 Analyse Textuelle**
        - Vocabulaire utilisé
        - Structure des phrases
        - Fréquence des mots
        - N-grammes caractéristiques
        """)
    
    with col2:
        st.markdown("""
        **📊 Caractéristiques**
        - Ratio majuscules/minuscules
        - Nombre d'exclamations
        - Présence d'URLs
        - Longueur du message
        """)
    
    with col3:
        st.markdown("""
        **🧠 Intelligence Artificielle**
        - Ensemble de modèles
        - Apprentissage supervisé
        - Validation croisée
        - Métriques optimisées
        """)

# 7. Fonction principale
def main():
    print("=== DÉTECTEUR DE SPAM AVANCÉ ===\\n")
    
    # Génération du dataset
    print("Génération du dataset d'emails...")
    df = generate_email_dataset()
    print(f"Dataset créé: {df.shape}")
    print(f"Distribution: {df['is_spam'].value_counts()}")
    
    # Préparation des données
    X_text = df['subject'] + " " + df['body']  # Combine sujet et corps
    y = df['label']
    
    # Division train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X_text, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Pipeline de preprocessing
    preprocessor = create_preprocessing_pipeline()
    
    # Transformation des données
    print("\\nPreprocessing des données...")
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    print(f"Features extraites: {X_train_processed.shape[1]}")
    
    # Entraînement du modèle ensemble
    print("\\nEntraînement du modèle ensemble...")
    model = create_ensemble_model()
    model.fit(X_train_processed, y_train)
    
    # Évaluation
    print("\\nÉvaluation du modèle...")
    auc, cm = comprehensive_evaluation(model, X_test_processed, y_test)
    
    # Analyse des features importantes
    if hasattr(model.named_estimators_['lr'], 'coef_'):
        feature_importance = np.abs(model.named_estimators_['lr'].coef_[0])
        top_features_idx = np.argsort(feature_importance)[-20:]
        
        print("\\n=== TOP 20 FEATURES IMPORTANTES ===")
        # Note: Pour afficher les noms exacts, il faudrait accéder aux feature names du vectorizer
        for i, idx in enumerate(top_features_idx[::-1]):
            print(f"{i+1:2d}. Feature {idx}: {feature_importance[idx]:.4f}")
    
    # Sauvegarde du modèle
    model_package = {
        'model': model,
        'preprocessor': preprocessor,
        'feature_names': None,  # À implémenter si nécessaire
        'version': '1.0',
        'trained_date': datetime.now().isoformat()
    }
    
    with open('spam_detector_model.pkl', 'wb') as f:
        pickle.dump(model_package, f)
    
    print("\\n✅ Modèle sauvegardé dans 'spam_detector_model.pkl'")
    print("🌐 Interface Streamlit disponible avec create_streamlit_interface()")
    
    return model, preprocessor, auc

if __name__ == "__main__":
    model, preprocessor, auc_score = main()
    print(f"\\n🎯 Performance finale: AUC = {auc_score:.3f}")`,
    hints: [
      "Combinez features TF-IDF et features manuelles (ponctuation, URLs, etc.)",
      "Utilisez l'analyse de sentiment pour détecter les appels à l'action",
      "Attention aux mots-clés spam typiques dans plusieurs langues",
      "Testez différents seuils de classification selon le contexte d'usage",
      "Implémentez une interface utilisateur intuitive pour les non-techniques"
    ],
    difficulty: "intermédiaire" as const,
    estimatedTime: "150 min",
    skills: ["NLP", "Feature Engineering", "Classification Binaire", "Interface Web"],
    tools: ["Python", "NLTK", "Scikit-learn", "Streamlit", "Regex"],
    category: "NLP & Sécurité"
  }
];

const SupervisedProjectsSection = () => {
  return (
    <ProjectsSection
      title="🚀 Projets Pratiques en Apprentissage Supervisé"
      projects={projects}
      description="Mettez en pratique vos connaissances avec ces projets concrets qui couvrent les applications principales de l'apprentissage supervisé. Chaque projet est conçu pour développer des compétences spécifiques tout en créant des solutions réelles et déployables."
    />
  );
};

export default SupervisedProjectsSection;
