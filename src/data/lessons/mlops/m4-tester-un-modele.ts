import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Jeu des indicateurs de diabète de scikit-learn (442 patients, 10 variables déjà centrées et mises à l'échelle) et bornes que l'on se donne. */
const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_diabetes",
  "",
  "donnees = load_diabetes(as_frame=True).frame",
  "COLONNES = ['age', 'sex', 'bmi', 'bp', 's1', 's2', 's3', 's4', 's5', 's6', 'target']",
  "BORNES = {c: (-0.2, 0.2) for c in COLONNES[:-1]}   # variables centrées : bornes que l'on se donne",
  "BORNES['target'] = (20, 400)                       # progression de la maladie : bornes que l'on se donne",
);

/** Jeu découpé et quatre modèles : celui en production, un bon candidat, un candidat trop régularisé, un modèle au signe de bmi oublié. */
const MODELES = lines(
  "import sys, unittest",
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_diabetes",
  "from sklearn.linear_model import LinearRegression, Ridge",
  "from sklearn.model_selection import train_test_split",
  "from sklearn.metrics import mean_absolute_error",
  "",
  "donnees = load_diabetes(as_frame=True).frame",
  "X = donnees.drop(columns='target')",
  "y = donnees['target']",
  "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=0)",
  "",
  "production = LinearRegression().fit(X_app, y_app)      # le modèle actuellement en service",
  "candidat = Ridge(alpha=0.01).fit(X_app, y_app)         # un réglage proche : doit passer",
  "trop_regularise = Ridge(alpha=100).fit(X_app, y_app)   # un réglage qui écrase les coefficients",
  "",
  "X_signe = X_app.copy()",
  "X_signe['bmi'] = -X_signe['bmi']                       # bogue simulé : le signe de bmi est inversé à l'entraînement seulement",
  "bogue = LinearRegression().fit(X_signe, y_app)",
);

const TESTS_MODELE = lines(
  "class TestsModele(unittest.TestCase):",
  "    modele = None      # renseigné avant chaque lancement",
  "    reference = None",
  "",
  "    def test_seuil_de_performance(self):",
  "        mae = mean_absolute_error(y_test, self.modele.predict(X_test))",
  "        self.assertLessEqual(mae, 50, f\"erreur absolue moyenne trop haute : {mae:.1f}\")",
  "",
  "    def test_invariance_ordre_des_lignes(self):",
  "        ordre = np.random.default_rng(1).permutation(len(X_test))",
  "        melange = self.modele.predict(X_test.iloc[ordre])",
  "        attendu = self.modele.predict(X_test)[ordre]",
  "        np.testing.assert_allclose(melange, attendu, atol=1e-9)",
  "",
  "    def test_invariance_petit_bruit(self):",
  "        bruit = X_test + np.random.default_rng(2).normal(0, 1e-6, X_test.shape)",
  "        ecart = np.abs(self.modele.predict(bruit) - self.modele.predict(X_test)).max()",
  "        self.assertLess(ecart, 0.05, f\"un bruit de 1e-6 déplace une prédiction de {ecart:.3f}\")",
  "",
  "    def test_direction_bmi(self):",
  "        plus = X_test.copy()",
  "        plus['bmi'] += 0.02",
  "        hausse = self.modele.predict(plus) - self.modele.predict(X_test)",
  "        self.assertTrue((hausse > 0).all(), \"une hausse de l'indice de masse corporelle doit faire monter la prédiction\")",
  "",
  "    def test_non_regression(self):",
  "        mae_ref = mean_absolute_error(y_test, self.reference.predict(X_test))",
  "        mae = mean_absolute_error(y_test, self.modele.predict(X_test))",
  "        self.assertLessEqual(mae, mae_ref * 1.02, f\"régression : {mae:.1f} contre {mae_ref:.1f} pour la référence\")",
  "",
  "",
  "def lancer(modele, reference):",
  "    TestsModele.modele, TestsModele.reference = modele, reference",
  "    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestsModele)",
  "    return unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)",
);

export const moduleTesterModele: LessonModule = {
  id: "tester-un-modele",
  title: "Tester un modèle et ses données",
  duration: "2 h",
  summary: "Ce qu'un logiciel ordinaire teste, un modèle l'exige aussi, et ses données davantage encore. Écrire des tests de données (schéma, manquants, bornes), des tests de modèle (seuil, invariance, direction, non-régression) et les exécuter avec unittest dans la page.",
  objectives: [
    "Écrire des fonctions qui vérifient un jeu de données (colonnes, valeurs manquantes, bornes, doublons) et renvoient la liste des problèmes",
    "Écrire des tests de modèle : seuil de performance, invariance, direction attendue, non-régression contre un modèle de référence",
    "Exécuter ces tests avec unittest et lire un échec pour comprendre ce qui a cassé",
    "Reconnaître ce qu'un test ne garantit pas, et à quoi ressemble la même suite avec pytest",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un modèle qui tourne n'est pas un modèle qui marche

Un programme ordinaire échoue souvent avec fracas : une exception, une page blanche. Un modèle échoue en silence. Si une colonne change d'unité ou si un signe est inversé, \`predict\` répond quand même, avec des nombres bien formés et faux. Rien ne plante, personne ne s'en aperçoit avant que quelqu'un compare à la réalité, parfois des mois plus tard.

On teste donc à deux endroits, et dans cet ordre :

- les **données** : ce qui entre dans l'entraînement et, plus tard, dans la prédiction. Un problème de données se détecte avant d'avoir entraîné quoi que ce soit ;
- le **modèle** : ce qui sort. Faute de connaître la bonne réponse à l'avance pour chaque cas, on teste des **propriétés** que n'importe quelle bonne réponse doit respecter.

Fil rouge du module : les 442 patients du jeu « diabète » de scikit-learn. Chaque ligne donne dix mesures (âge, sexe, indice de masse corporelle \`bmi\`, pression artérielle \`bp\`, six mesures sanguines \`s1\` à \`s6\`), déjà centrées et mises à l'échelle, et la progression de la maladie un an plus tard (\`target\`). C'est un jeu d'enseignement : il sert à apprendre à tester, pas à soigner qui que ce soit.`,
    },
    {
      kind: "text",
      md: `### Tester les données : schéma, manquants, bornes

Un test de données est une fonction qui reçoit un tableau et répond à une question simple. Deux styles existent. Le premier **lève une \`AssertionError\`** au premier problème : pratique dans une chaîne automatique, qui doit s'arrêter. Le second **renvoie la liste de tous les problèmes** : plus utile pour comprendre, car on voit tout d'un coup. Nous prenons le second.

Les contrôles les plus rentables sont aussi les plus bêtes :

- le **schéma** : les colonnes attendues sont-elles là, avec les bons noms ?
- les **valeurs manquantes** : combien, dans quelle colonne ?
- les **bornes** : une valeur sort-elle de ce qui est plausible ? Un âge de 250 ans, une taille de 1,7 saisie en centimètres au lieu de mètres ;
- les **doublons** : une même ligne deux fois gonfle artificiellement le score si une copie tombe dans le test.

Les bornes ne se devinent pas dans les données : on les décide avec quelqu'un qui connaît le domaine. Ici, comme les variables sont centrées et réduites, nous nous donnons \`[-0,2 ; 0,2]\`, et \`[20 ; 400]\` pour la progression. Ce sont des choix de l'exemple, pas des vérités médicales.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DONNEES,
      code: lines(
        "def verifier_donnees(df, colonnes=COLONNES, bornes=BORNES):",
        "    \"\"\"Renvoie la liste des problèmes trouvés (liste vide : tout va bien).\"\"\"",
        "    problemes = []",
        "    absentes = [c for c in colonnes if c not in df.columns]",
        "    if absentes:",
        "        problemes.append(f\"colonnes absentes : {absentes}\")",
        "    for c in colonnes:",
        "        if c not in df.columns:",
        "            continue",
        "        n_manquantes = int(df[c].isna().sum())",
        "        if n_manquantes:",
        "            problemes.append(f\"{c} : {n_manquantes} valeur(s) manquante(s)\")",
        "        bas, haut = bornes[c]",
        "        n_hors = int(((df[c] < bas) | (df[c] > haut)).sum())",
        "        if n_hors:",
        "            problemes.append(f\"{c} : {n_hors} valeur(s) hors de [{bas}, {haut}]\")",
        "    n_doublons = int(df.duplicated().sum())",
        "    if n_doublons:",
        "        problemes.append(f\"{n_doublons} ligne(s) en double\")",
        "    return problemes",
        "",
        "print('jeu d origine :', donnees.shape, verifier_donnees(donnees))",
        "",
        "# on abîme une copie, comme le ferait une mauvaise livraison de données",
        "abime = donnees.copy()",
        "abime.loc[3, 'bmi'] = np.nan          # une mesure manquante",
        "abime.loc[10, 'bp'] = 1.7             # une saisie dans la mauvaise unité",
        "abime.loc[20, 'target'] = -5          # une valeur impossible",
        "abime = pd.concat([abime, abime.iloc[[0]]], ignore_index=True)   # une ligne répétée",
        "abime = abime.drop(columns=['s6'])    # une colonne disparue",
        "print('jeu abîmé :')",
        "for probleme in verifier_donnees(abime):",
        "    print(' -', probleme)",
      ),
      caption: "Le jeu d'origine a 442 lignes et 11 colonnes (dix variables et la cible) et ne déclenche aucun problème avec ces bornes. La copie abîmée en déclenche cinq : une colonne absente (s6), une valeur manquante (bmi), une valeur hors bornes pour bp, une pour target, et une ligne en double. Le test ne dit pas quelle valeur est fausse ni pourquoi, seulement où regarder.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `verifier_bornes(df, bornes)` : elle renvoie une liste de messages, **un par colonne** de `bornes` qui contient au moins une valeur hors de son intervalle `(bas, haut)` (bornes incluses : une valeur égale à `bas` ou à `haut` est acceptée). Chaque message doit contenir le nom de la colonne. Une colonne absente du tableau est ignorée. Sur des données conformes, la liste est vide.",
      setup: DONNEES,
      starter: lines(
        "def verifier_bornes(df, bornes):",
        "    return []",
      ),
      solution: lines(
        "def verifier_bornes(df, bornes):",
        "    problemes = []",
        "    for colonne, (bas, haut) in bornes.items():",
        "        if colonne not in df.columns:",
        "            continue",
        "        hors = ((df[colonne] < bas) | (df[colonne] > haut)).sum()",
        "        if hors:",
        "            problemes.append(f\"{colonne} : {int(hors)} valeur(s) hors de [{bas}, {haut}]\")",
        "    return problemes",
        "",
        "print(verifier_bornes(donnees, BORNES))",
      ),
      test: lines(
        "assert verifier_bornes(donnees, BORNES) == [], \"sur des données conformes, la liste doit être vide\"",
        "_abime = donnees.copy()",
        "_abime.loc[10, 'bp'] = 1.7",
        "_abime.loc[20, 'target'] = -5",
        "_res = verifier_bornes(_abime, BORNES)",
        "assert len(_res) == 2, f\"deux colonnes sont hors bornes (bp et target), la liste doit avoir 2 messages, pas {len(_res)}\"",
        "assert any('bp' in m for m in _res) and any('target' in m for m in _res), \"chaque message doit contenir le nom de la colonne concernée\"",
        "_limite = donnees.copy()",
        "_limite.loc[0, 'age'] = 0.2",
        "assert verifier_bornes(_limite, BORNES) == [], \"une valeur égale à la borne est acceptée : comparez avec < bas et > haut\"",
        "_sans = donnees.drop(columns=['s6'])",
        "assert verifier_bornes(_sans, BORNES) == [], \"une colonne absente du tableau est ignorée, elle ne doit pas lever d'erreur\"",
      ),
      hint: "Pour une colonne : ((df[colonne] < bas) | (df[colonne] > haut)).sum() compte les valeurs hors de l'intervalle. Parcourez bornes.items().",
    },
    {
      kind: "note",
      tone: "info",
      md: "Un test de données qui passe ne prouve pas que les données sont bonnes : il prouve qu'elles ne présentent pas les défauts que vous avez pensé à chercher. La liste de contrôles s'allonge au fil des incidents, comme le règlement d'une copropriété. Des bibliothèques spécialisées décrivent ces règles sans les recoder, mais le moteur du site n'en fournit aucune ; le principe est celui que vous venez d'écrire.",
    },
    {
      kind: "text",
      md: `### Tester le modèle : des propriétés plutôt que des réponses

Pour un modèle, on ne connaît pas la « bonne » prédiction de chaque ligne (sinon, pas besoin de modèle). On vérifie des propriétés, de quatre sortes :

- le **seuil de performance** : sur un jeu de test fixe, l'erreur ne doit pas dépasser une limite. Le seuil se fixe par rapport à ce qu'on sait faire : prédire toujours la moyenne des patients donne une erreur absolue moyenne de 58,3 sur ce découpage, notre régression linéaire 45,1. Nous demandons 50 au plus ;
- l'**invariance** : une modification qui ne doit rien changer ne change rien. Mélanger l'ordre des lignes, ou ajouter un bruit de l'ordre de 0,000001 ;
- la **direction** : une modification qui doit pousser la prédiction dans un sens la pousse dans ce sens. À autres mesures égales, un indice de masse corporelle plus élevé doit faire monter la progression prédite. C'est un jugement de connaissance du domaine, que l'on écrit noir sur blanc ;
- la **non-régression** : le nouveau modèle ne doit pas faire moins bien que celui en service, à une tolérance près (ici 2 %).

Chaque test est petit. C'est leur réunion qui protège : le bogue d'un signe inversé passe les tests d'invariance sans souci et ne tombe que sur la direction, le seuil et la non-régression.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELES,
      code: lines(
        TESTS_MODELE,
        "",
        "print('=== candidat (Ridge, alpha = 0,01)')",
        "lancer(candidat, production)",
        "print('=== candidat trop régularisé (Ridge, alpha = 100)')",
        "lancer(trop_regularise, production)",
        "print('=== modèle au signe de bmi inversé')",
        "lancer(bogue, production)",
      ),
      caption: "unittest écrit son rapport dans le flux qu'on lui donne (ici la sortie standard, pour qu'il s'affiche dans la page). Le candidat proche de la production passe les cinq tests (erreur absolue moyenne de 45,2 contre 45,1). Le candidat trop régularisé échoue au seuil et à la non-régression : son erreur monte à 57,7, presque celle de la moyenne seule. Le modèle au signe inversé échoue à trois tests (direction, seuil, non-régression), avec une erreur de 56,7 ; il passe les deux tests d'invariance, parfaitement satisfaits d'un modèle faux mais stable.",
    },
    {
      kind: "text",
      md: `### Lire un échec

Un test qui échoue doit dire **quoi** et **de combien**. C'est le rôle du message passé en dernier argument des méthodes \`assert...\` : « erreur absolue moyenne trop haute : 57,7 » se comprend sans ouvrir le code, « False is not true » non. Écrivez le message au moment où vous écrivez le test, pas le jour de l'incident.

Deux limites à garder en tête, car les tests donnent vite un faux sentiment de sécurité :

- tous ces tests s'appuient sur **un seul jeu de test** de 111 patients. Un seuil réglé sur lui finit par lui ressembler ; un petit jeu laisse aussi passer des écarts réels ;
- une propriété vraie en moyenne peut être fausse pour un groupe. Un seuil global ne dit rien de la qualité du modèle pour les plus de 70 ans, par exemple. Tester par sous-groupe est le prolongement naturel.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `monte_avec(modele, X, colonne, delta)` : elle renvoie `True` si, en ajoutant `delta` à la colonne `colonne` de `X` (sans modifier `X` lui-même), **toutes** les prédictions du modèle augmentent strictement, et `False` sinon. Elle permet d'écrire un test de direction pour n'importe quelle variable.",
      setup: MODELES,
      starter: lines(
        "def monte_avec(modele, X, colonne, delta):",
        "    return True",
      ),
      solution: lines(
        "def monte_avec(modele, X, colonne, delta):",
        "    modifie = X.copy()                 # on ne touche pas à X",
        "    modifie[colonne] = modifie[colonne] + delta",
        "    hausse = modele.predict(modifie) - modele.predict(X)",
        "    return bool((hausse > 0).all())",
        "",
        "print(monte_avec(production, X_test, 'bmi', 0.02), monte_avec(bogue, X_test, 'bmi', 0.02))",
      ),
      test: lines(
        "_avant = X_test.copy()",
        "assert monte_avec(production, X_test, 'bmi', 0.02) is True, \"pour le modèle en production, augmenter bmi doit faire monter toutes les prédictions\"",
        "assert monte_avec(bogue, X_test, 'bmi', 0.02) is False, \"le modèle au signe inversé baisse quand bmi monte : la fonction doit renvoyer False\"",
        "assert monte_avec(production, X_test, 'bmi', -0.02) is False, \"avec un delta négatif, les prédictions baissent : la fonction doit renvoyer False\"",
        "assert X_test.equals(_avant), \"X ne doit pas être modifié : travaillez sur une copie (X.copy())\"",
      ),
      hint: "Copiez X, ajoutez delta à la colonne, puis comparez modele.predict(modifie) à modele.predict(X) avec (… > 0).all().",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `pas_de_regression(mae_nouveau, mae_reference, tolerance)` : elle renvoie `True` si l'erreur du nouveau modèle dépasse celle de la référence de **au plus** `tolerance` en proportion (0,02 signifie 2 %), `False` sinon. Puis rangez dans `verdict` son résultat pour le candidat trop régularisé (`trop_regularise`) face à `production`, avec une tolérance de 0,02.",
      setup: MODELES,
      starter: lines(
        "def pas_de_regression(mae_nouveau, mae_reference, tolerance):",
        "    return True",
        "",
        "verdict = None",
      ),
      solution: lines(
        "def pas_de_regression(mae_nouveau, mae_reference, tolerance):",
        "    return bool(mae_nouveau <= mae_reference * (1 + tolerance))",
        "",
        "mae_prod = mean_absolute_error(y_test, production.predict(X_test))",
        "mae_trop = mean_absolute_error(y_test, trop_regularise.predict(X_test))",
        "verdict = pas_de_regression(mae_trop, mae_prod, 0.02)",
        "print('verdict :', verdict)",
      ),
      test: lines(
        "assert pas_de_regression(100, 100, 0.02), \"un modèle identique à la référence n'est pas une régression\"",
        "assert pas_de_regression(101.9, 100, 0.02), \"+1,9 % reste dans la tolérance de 2 %\"",
        "assert not pas_de_regression(102.1, 100, 0.02), \"+2,1 % dépasse la tolérance de 2 % : c'est une régression\"",
        "assert pas_de_regression(80, 100, 0.02), \"un modèle meilleur que la référence n'est pas une régression\"",
        "assert verdict is False, \"le candidat trop régularisé a une erreur de 57,7 contre 45,1 : verdict doit être False\"",
      ),
      hint: "Comparez mae_nouveau à mae_reference * (1 + tolerance). Pour le verdict, calculez les deux erreurs avec mean_absolute_error sur X_test.",
    },
    {
      kind: "text",
      md: `### Et avec pytest ?

Dans un vrai projet, on écrit rarement \`unittest\` à la main : on utilise **pytest**, qui trouve tout seul les fonctions dont le nom commence par \`test_\` et se contente d'un \`assert\` ordinaire. Le même test de direction y tient en quelques lignes. Ce code ne tourne pas dans le moteur du site, qui ne fournit pas pytest ; il est là pour être lu.

\`\`\`python
# fichier test_modele.py, lancé par la commande : pytest
import pytest

@pytest.fixture(scope="module")
def modele_et_donnees():
    # chargement du modèle sauvegardé et du jeu de test figé
    ...

def test_seuil(modele_et_donnees):
    modele, X_test, y_test = modele_et_donnees
    assert mean_absolute_error(y_test, modele.predict(X_test)) <= 50

@pytest.mark.parametrize("colonne, delta", [("bmi", 0.02), ("bp", 0.02)])
def test_direction(modele_et_donnees, colonne, delta):
    modele, X_test, _ = modele_et_donnees
    modifie = X_test.copy()
    modifie[colonne] += delta
    assert (modele.predict(modifie) > modele.predict(X_test)).all()
\`\`\`

Les **fixtures** évitent de recharger le modèle à chaque test, et \`parametrize\` répète un test sur plusieurs cas. Le gain réel est ailleurs : lancés par l'intégration continue à chaque modification, ces tests bloquent un changement qui dégrade le modèle avant qu'il n'atteigne les utilisateurs.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: "Un seuil fixé trop près du score actuel déclenche de fausses alertes à chaque réentraînement, un seuil trop large ne protège de rien. Ici, la marge entre 45,1 (modèle) et 58,3 (la moyenne seule) laisse de la place ; on choisit 50 pour que le modèle reste nettement meilleur que la moyenne. Reportez ce choix dans un document : « pourquoi 50 ? » doit avoir une réponse.",
    },
  ],
  quiz: [
    {
      question: "Un modèle dont on a inversé le signe d'une variable à l'entraînement continue de répondre sans erreur. Quel test a le plus de chances de le détecter ?",
      options: [
        "Un test d'invariance par mélange de l'ordre des lignes",
        "Un test de direction sur cette variable, ou un seuil de performance",
        "Un test de schéma sur le nombre de colonnes",
        "Un test sur la durée de prédiction",
      ],
      correct: 1,
      explanation: "Le modèle faux est parfaitement stable, il garde son schéma et il est rapide : seuls un test de direction et un seuil de performance le voient, comme le montre l'exemple.",
    },
    {
      question: "Pourquoi les bornes d'un test de données se décident-elles avec quelqu'un qui connaît le domaine plutôt que d'après les données ?",
      options: [
        "Parce que le minimum et le maximum observés sont toujours faux",
        "Parce qu'un défaut présent dans les données d'aujourd'hui serait alors accepté comme normal",
        "Parce que pandas ne sait pas calculer un minimum",
        "Parce que les bornes ne doivent jamais changer",
      ],
      correct: 1,
      explanation: "Si l'on prend les bornes dans des données déjà abîmées, l'erreur de saisie devient la norme. La plausibilité est une connaissance du domaine, pas une statistique du jeu.",
    },
    {
      question: "Que mesure un test de non-régression ?",
      options: [
        "Que le modèle donne exactement les mêmes prédictions qu'hier",
        "Que le nom du modèle n'a pas changé",
        "Que le nouveau modèle ne fait pas nettement moins bien que celui en service, à une tolérance près",
        "Que le modèle n'utilise aucune régression linéaire",
      ],
      correct: 2,
      explanation: "On compare une métrique du nouveau modèle à celle de la référence sur un même jeu de test, avec une tolérance. Un modèle réentraîné ne redonne jamais exactement les mêmes prédictions.",
    },
    {
      question: "Un test d'invariance par un bruit de 0,000001 sur toutes les variables échoue sur un modèle. Que peut-on soupçonner ?",
      options: [
        "Le modèle est excellent",
        "Le jeu de test est trop grand",
        "Le test a été écrit en unittest",
        "Le modèle est instable : une variation minuscule des entrées suffit à déplacer sa réponse de façon visible",
      ],
      correct: 3,
      explanation: "Une variation aussi petite que le bruit de mesure ne doit pas changer la prédiction de façon visible. Sinon le modèle réagit à du bruit, ce qui arrive avec des variables très corrélées ou un sur-apprentissage.",
    },
    {
      question: "Quelle limite des tests de seuil de performance de ce module faut-il garder à l'esprit ?",
      options: [
        "Ils ne fonctionnent qu'avec la régression linéaire",
        "Ils interdisent de réentraîner le modèle",
        "Ils reposent sur un seul jeu de test de petite taille et ne disent rien de la qualité par sous-groupe",
        "Ils doivent être lancés à la main chaque année",
      ],
      correct: 2,
      explanation: "Un seul jeu de 111 patients laisse passer des écarts réels et se laisse apprivoiser par un réglage répété du seuil. Une moyenne correcte peut cacher un groupe mal servi.",
    },
  ],
};
