import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Jeu réel de scikit-learn (569 tumeurs), quatre colonnes renommées, un modèle simple : régression logistique
// avec mise à l'échelle. Le modèle importe peu, c'est son empaquetage qui est le sujet.
const MODELE = lines(
  "import io, json, pickle, hashlib",
  "import numpy as np",
  "import pandas as pd",
  "import sklearn",
  "from sklearn.datasets import load_breast_cancer",
  "from sklearn.model_selection import train_test_split",
  "from sklearn.pipeline import Pipeline",
  "from sklearn.preprocessing import StandardScaler",
  "from sklearn.linear_model import LogisticRegression",
  "",
  "donnees = load_breast_cancer(as_frame=True)",
  "X = donnees.data[['mean radius', 'mean texture', 'mean smoothness', 'mean area']].copy()",
  "X.columns = ['rayon', 'texture', 'lissage', 'aire']",
  "y = donnees.target",
  "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
  "modele = Pipeline([('echelle', StandardScaler()), ('modele', LogisticRegression(max_iter=1000))])",
  "modele.fit(X_app, y_app)",
);

// Les bornes du schéma sont choisies à la main, plus larges que les valeurs observées à l'apprentissage.
const SCHEMA = lines(
  "schema = {'rayon': (5.0, 35.0), 'texture': (5.0, 45.0), 'lissage': (0.04, 0.2), 'aire': (100.0, 3000.0)}",
);

const VALIDER = lines(
  "def valider_entree(entree, schema):",
  "    \"\"\"Renvoie la liste des problèmes (vide si l'entrée est valide).\"\"\"",
  "    problemes = []",
  "    for nom, (bas, haut) in schema.items():",
  "        if nom not in entree:",
  "            problemes.append(f\"champ manquant : {nom}\")",
  "            continue",
  "        valeur = entree[nom]",
  "        if isinstance(valeur, bool) or not isinstance(valeur, (int, float)):",
  "            problemes.append(f\"{nom} doit être un nombre, reçu {type(valeur).__name__}\")",
  "        elif not bas <= valeur <= haut:",
  "            problemes.append(f\"{nom} = {valeur} hors de l'intervalle [{bas}, {haut}]\")",
  "    for nom in entree:",
  "        if nom not in schema:",
  "            problemes.append(f\"champ inconnu : {nom}\")",
  "    return problemes",
);

export const moduleEmpaqueterVersionner: LessonModule = {
  id: "empaqueter-versionner",
  title: "Empaqueter et versionner un modèle",
  duration: "2 h",
  summary: "Enregistrer un modèle avec pickle et le recharger à l'identique, lui donner une empreinte et une fiche, comprendre pourquoi charger un pickle inconnu est dangereux, décrire les entrées attendues par un schéma versionné, et voir ONNX et Docker en code à lire.",
  objectives: [
    "Sérialiser un modèle avec pickle, le recharger et vérifier que ses prédictions sont identiques",
    "Calculer l'empreinte du fichier et rédiger une fiche du modèle en JSON",
    "Expliquer pourquoi charger un pickle d'origine inconnue peut exécuter du code",
    "Décrire les entrées attendues par un schéma versionné et refuser une entrée invalide avec un message lisible",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un modèle est un fichier, et il a une histoire

Entraîné dans un carnet de notes, un modèle n'existe que tant que la session vit. Pour s'en servir ailleurs (un autre programme, un serveur, demain), il faut l'**empaqueter** : l'écrire dans un fichier, avec de quoi savoir **ce que c'est**, **d'où il vient** et **comment l'appeler**. On parle de **versionner** un modèle quand chaque fichier porte un numéro et une description, pour qu'on sache toujours quelle version répond en production.

Ce module avance en quatre temps : sérialiser et recharger, identifier (empreinte et fiche), se méfier (sécurité de pickle), décrire l'interface (schéma d'entrée). Le modèle est volontairement simple : une régression logistique sur **quatre mesures** du jeu des 569 tumeurs de scikit-learn (rayon, texture, lissage, aire), apprise sur 426 lignes et testée sur 143. C'est l'empaquetage qui compte, pas le score.`,
    },
    {
      kind: "text",
      md: `### Sérialiser avec pickle

**pickle** est le module de la bibliothèque standard de Python qui transforme presque n'importe quel objet en suite d'octets (\`pickle.dumps\`) et fait l'inverse (\`pickle.loads\`). Les modèles scikit-learn se sérialisent ainsi. Ici, on écrit dans un \`io.BytesIO\`, un fichier en mémoire, car le site n'a pas de disque durable ; sur votre machine, ce serait \`open("modele.pkl", "wb")\`.

La règle à tester systématiquement : **recharger puis comparer les prédictions**. Un modèle sauvegardé qui ne redonne pas les mêmes sorties est pire qu'un modèle absent. On calcule aussi l'**empreinte** du fichier (SHA-256), qui sert à vérifier plus tard qu'il n'a été ni corrompu ni remplacé.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        MODELE,
        "",
        "# Écriture dans un fichier en mémoire, puis relecture",
        "tampon = io.BytesIO()",
        "pickle.dump(modele, tampon)",
        "octets = tampon.getvalue()",
        "print('taille du fichier :', len(octets), 'octets')",
        "print('empreinte SHA-256 (12 premiers caractères) :', hashlib.sha256(octets).hexdigest()[:12])",
        "",
        "recharge = pickle.loads(octets)",
        "memes_classes = np.array_equal(modele.predict(X_test), recharge.predict(X_test))",
        "memes_probas = np.array_equal(modele.predict_proba(X_test), recharge.predict_proba(X_test))",
        "print('mêmes classes prédites :', memes_classes, ' mêmes probabilités, bit pour bit :', memes_probas)",
        "print('réussite sur le test, modèle rechargé :', round(recharge.score(X_test, y_test), 3))",
        "",
        "# Un fichier abîmé d'un seul bit n'a plus la même empreinte",
        "abime = bytearray(octets)",
        "abime[100] ^= 1",
        "print('empreinte après un bit changé :', hashlib.sha256(bytes(abime)).hexdigest()[:12])",
        "",
        "# Réentraîner le même modèle sur les mêmes données redonne-t-il le même fichier ?",
        "autre = Pipeline([('echelle', StandardScaler()), ('modele', LogisticRegression(max_iter=1000))]).fit(X_app, y_app)",
        "print('même fichier après un nouvel entraînement :', pickle.dumps(autre) == octets)",
      ),
      caption: "Le fichier fait 1 285 octets. Le modèle rechargé prédit exactement les mêmes classes et les mêmes probabilités, au bit près ; sa réussite sur le test est de 0,909 (130 sur 143), un seul découpage. Un bit changé suffit à modifier l'empreinte. Ici, un nouvel entraînement redonne même le fichier identique, parce que la régression logistique n'a pas de hasard dans son ajustement : ce n'est pas le cas d'une forêt aléatoire sans graine fixée, ni garanti d'une version de bibliothèque à l'autre.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le `modele` est entraîné et `X_test` prêt. Sérialisez-le avec `pickle.dumps` puis rechargez-le avec `pickle.loads` dans `recharge`. Rangez dans `identiques` le booléen qui dit si `modele` et `recharge` prédisent exactement les mêmes classes sur `X_test` (`np.array_equal`).",
      setup: MODELE,
      starter: lines("recharge = None", "identiques = False"),
      solution: lines(
        "octets = pickle.dumps(modele)",
        "recharge = pickle.loads(octets)",
        "identiques = bool(np.array_equal(modele.predict(X_test), recharge.predict(X_test)))",
        "print(len(octets), 'octets, mêmes prédictions :', identiques)",
      ),
      test: lines(
        "assert isinstance(recharge, Pipeline), \"recharge doit être le modèle relu : pickle.loads(pickle.dumps(modele))\"",
        "assert recharge is not modele, \"recharge doit être une copie relue depuis les octets, pas le même objet\"",
        "assert np.array_equal(modele.predict(X_test), recharge.predict(X_test)), \"le modèle rechargé ne prédit pas comme l'original\"",
        "assert identiques is True, \"identiques doit valoir True : comparez les prédictions des deux modèles avec np.array_equal\"",
      ),
      hint: "pickle.dumps donne des octets, pickle.loads reconstruit l'objet. np.array_equal compare deux tableaux élément par élément.",
    },
    {
      kind: "text",
      md: `### La fiche du modèle

Un fichier sans explication se périme vite. On l'accompagne d'une **fiche du modèle** (*model card*), un petit document lisible par un humain et par un programme. Une version minimale, en dictionnaire écrit en JSON, contient :

- un **nom** et un **numéro de version** ;
- les **versions des bibliothèques** utilisées (un pickle se recharge avec la même, sinon des surprises) ;
- la **provenance des données** et le nombre de lignes ;
- les **entrées attendues** (noms, types, plages observées) ;
- les **métriques**, avec la taille de l'échantillon qui les a produites ;
- les **limites** et l'**usage prévu**, ce qui oblige à écrire noir sur blanc ce que le modèle ne sait pas faire ;
- l'**empreinte** du fichier.

La date est ici **écrite en dur** : lue à l'exécution, elle changerait à chaque essai et la fiche ne serait plus reproductible. Dans une vraie chaîne de production, elle est écrite à la publication.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(MODELE, "octets = pickle.dumps(modele)"),
      code: lines(
        "fiche = {",
        "    'nom': 'diagnostic-tumeur',",
        "    'version_modele': '1.0.0',",
        "    'date': '2026-10-24',   # écrite en dur : la fiche ne change pas à chaque exécution",
        "    'bibliotheques': {'scikit-learn': sklearn.__version__, 'numpy': np.__version__, 'pandas': pd.__version__},",
        "    'donnees': {'source': 'load_breast_cancer (scikit-learn), 4 colonnes sur 30', 'lignes_apprentissage': len(X_app)},",
        "    'entrees': {nom: {'type': 'nombre', 'min_observe': float(X_app[nom].min()), 'max_observe': float(X_app[nom].max())}",
        "                for nom in X_app.columns},",
        "    'metriques': {'reussite_test': round(modele.score(X_test, y_test), 3), 'lignes_test': len(X_test)},",
        "    'limites': [\"un seul découpage de 143 lignes\", \"mesures sur images d'un seul jeu\", \"aucune validation clinique\"],",
        "    'usage_prevu': 'démonstration pédagogique, pas un outil de diagnostic',",
        "    'empreinte_fichier': hashlib.sha256(octets).hexdigest()[:12],",
        "}",
        "texte = json.dumps(fiche, indent=2, ensure_ascii=False)",
        "print(texte)",
        "print()",
        "print(\"la fiche se relit à l'identique :\", json.loads(texte) == fiche)",
      ),
      caption: "La fiche tient en 1 053 caractères de JSON. Les plages observées à l'apprentissage sont : rayon de 7,691 à 28,11 ; texture de 9,71 à 39,28 ; lissage de 0,05263 à 0,1425 ; aire de 170,4 à 2 501. Elles servent plus tard à repérer une entrée inhabituelle. La réussite de 0,909 vient d'un seul découpage de 143 lignes et la fiche le dit dans ses limites. Elle contient l'empreinte du fichier : celui qui reçoit modèle et fiche peut vérifier qu'ils vont ensemble.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le `modele`, `X_app`, `X_test` et `y_test` sont prêts. Construisez dans `fiche` un dictionnaire avec au moins les clés `'nom'`, `'version_modele'`, `'bibliotheques'` (un dictionnaire qui contient `'scikit-learn'`), `'metriques'` (avec `'reussite_test'`, la réussite du modèle sur le test arrondie à 3 décimales), `'limites'` (une liste non vide) et `'usage_prevu'`. Il doit pouvoir s'écrire avec `json.dumps`.",
      setup: MODELE,
      starter: lines("fiche = {}"),
      solution: lines(
        "fiche = {",
        "    'nom': 'diagnostic-tumeur',",
        "    'version_modele': '1.0.0',",
        "    'bibliotheques': {'scikit-learn': sklearn.__version__},",
        "    'metriques': {'reussite_test': round(modele.score(X_test, y_test), 3)},",
        "    'limites': ['un seul découpage de 143 lignes'],",
        "    'usage_prevu': 'démonstration pédagogique',",
        "}",
        "print(json.dumps(fiche, ensure_ascii=False))",
      ),
      test: lines(
        "for _cle in ['nom', 'version_modele', 'bibliotheques', 'metriques', 'limites', 'usage_prevu']:",
        "    assert _cle in fiche, f\"il manque la clé '{_cle}' dans la fiche\"",
        "assert 'scikit-learn' in fiche['bibliotheques'], \"notez la version de scikit-learn : sklearn.__version__\"",
        "assert fiche['metriques'].get('reussite_test') == round(modele.score(X_test, y_test), 3), \"reussite_test doit valoir la réussite réelle du modèle sur le test, arrondie à 3 décimales\"",
        "assert isinstance(fiche['limites'], list) and len(fiche['limites']) >= 1, \"limites doit être une liste d'au moins une phrase : un modèle a toujours des limites\"",
        "json.dumps(fiche)",
      ),
      hint: "Une fiche est un dictionnaire de dictionnaires et de listes. Prenez la réussite avec modele.score(X_test, y_test) et arrondissez avec round(..., 3).",
    },
    {
      kind: "text",
      md: `### Le danger de pickle

Voici la limite que tout le monde devrait connaître : **charger un pickle, c'est exécuter du code**. Le format sait reconstruire un objet en appelant une fonction ; un fichier malveillant peut donc demander d'appeler **n'importe quelle fonction**, y compris de supprimer des fichiers ou d'envoyer des données. La documentation de Python le dit en toutes lettres : ne chargez jamais un pickle dont vous ne connaissez pas l'origine.

L'exemple l'illustre avec une classe dont la méthode spéciale \`__reduce__\` indique « pour me reconstruire, appelle \`print\` avec ce texte ». Ici, rien de grave : c'est un \`print\`, inoffensif. Mais le mécanisme est exactement celui d'une attaque réelle, avec une autre fonction à la place de \`print\`.

Les parades usuelles : ne charger que des fichiers dont on connaît la **source** et l'**empreinte** (voir plus haut), préférer un format de données pur quand c'est possible (JSON pour une fiche ou des coefficients, ONNX pour un modèle, voir plus loin), et ne jamais accepter un pickle envoyé par un utilisateur.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pickle",
        "",
        "class Piege:",
        "    # __reduce__ dit à pickle comment reconstruire l'objet : ici, en appelant print",
        "    def __reduce__(self):",
        "        return (print, ('Ce texte est affiché pendant le chargement : du code a tourné.',))",
        "",
        "fichier = pickle.dumps(Piege())",
        "print('taille du fichier piégé :', len(fichier), 'octets')",
        "print('on ne demande qu\\'à LIRE le fichier (pickle.loads) ...')",
        "pickle.loads(fichier)",
        "print('... et du code s\\'est exécuté avant même que le résultat nous revienne.')",
        "print('on peut le voir sans le charger :', b'builtins' in fichier and b'print' in fichier)",
      ),
      caption: "Le fichier piégé fait 104 octets. Charger l'objet affiche le texte : la fonction a été appelée par le chargement lui-même. Les noms de la fonction (builtins, print) sont lisibles dans les octets, mais personne ne les lit avant de charger. La seule vraie défense est de ne charger que des sources de confiance.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "La même règle vaut pour les fichiers \"joblib\" (souvent employés par scikit-learn), qui reposent sur pickle, et pour tout format qui peut contenir du code. En cas de doute, ne chargez pas : demandez la fiche, l'empreinte et la source, ou réentraînez à partir des données.",
    },
    {
      kind: "text",
      md: `### Décrire l'interface : un schéma d'entrée versionné

Un modèle attend des **colonnes précises**, dans un ordre et des unités précis. Appelé avec un champ absent, un texte à la place d'un nombre ou une valeur absurde (un rayon de 140), il plante, ou pire : il répond sans broncher. D'où le **schéma d'entrée** : la liste des champs, de leur type et de leurs bornes, **vérifiée avant** d'appeler le modèle, avec un message d'erreur lisible.

Le schéma a une **version**. Ajouter un champ (une variable de plus) change l'interface : les appelants qui envoient l'ancien format doivent être prévenus, pas servis en silence avec un modèle qui n'est plus celui qu'ils croient. Une habitude simple : le numéro de version du modèle (\`1.0.0\`) change quand l'entraînement change, et le numéro de version du schéma change quand les entrées changent. On trouve ce principe aussi dans les interfaces web (\`/v1/predict\`, \`/v2/predict\`).

Les bornes de l'exemple (rayon de 5 à 35, par exemple) sont choisies à la main, plus larges que les valeurs vues à l'apprentissage : elles rejettent l'absurde, pas l'inhabituel.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        SCHEMA,
        VALIDER,
        "",
        "bonne = {'rayon': 14.0, 'texture': 19.0, 'lissage': 0.1, 'aire': 650.0}",
        "print('entrée correcte           :', valider_entree(bonne, schema))",
        "print('champ absent               :', valider_entree({'rayon': 14.0, 'texture': 19.0, 'lissage': 0.1}, schema))",
        "print('valeur absurde et texte    :', valider_entree({**bonne, 'rayon': 140.0, 'texture': 'dix-neuf'}, schema))",
        "print('champ inconnu              :', valider_entree({**bonne, 'couleur': 'rose'}, schema))",
        "",
        "# Version 2 du schéma : un champ de plus, l'ancien format est refusé avec un message clair",
        "schema_v2 = {**schema, 'symetrie': (0.1, 0.4)}",
        "print('ancien format, schéma v2   :', valider_entree(bonne, schema_v2))",
        "",
        "# Seule une entrée valide arrive au modèle",
        "if not valider_entree(bonne, schema):",
        "    ligne = pd.DataFrame([bonne])[list(X_app.columns)]   # l'ordre des colonnes est celui de l'apprentissage",
        "    print('classe prédite :', modele.predict(ligne)[0], ' probabilités :', modele.predict_proba(ligne).round(3)[0])",
      ),
      caption: "Quatre entrées, quatre diagnostics lisibles : la bonne passe, la deuxième nomme le champ manquant (aire), la troisième signale à la fois le rayon hors de [5,0, 35,0] et la texture qui n'est pas un nombre, la quatrième refuse le champ inconnu. Avec un schéma v2 qui ajoute la symétrie, l'ancien format est refusé : « champ manquant : symetrie ». La prédiction d'exemple n'est pas un diagnostic : le modèle donne 0,393 et 0,607 aux deux classes pour des valeurs inventées.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Un `schema` (dictionnaire nom -> (borne basse, borne haute)) est prêt. Écrivez `valider_entree(entree, schema)` qui renvoie la **liste des problèmes** (des phrases) : un champ manquant, une valeur qui n'est pas un nombre, une valeur hors des bornes, un champ inconnu. La liste est vide si l'entrée est valide.",
      setup: lines(MODELE, SCHEMA),
      starter: lines(
        "def valider_entree(entree, schema):",
        "    return []",
      ),
      solution: lines(
        VALIDER,
        "",
        "print(valider_entree({'rayon': 14.0, 'texture': 19.0, 'lissage': 0.1, 'aire': 650.0}, schema))",
        "print(valider_entree({'rayon': 140.0}, schema))",
      ),
      test: lines(
        "_ok = {'rayon': 14.0, 'texture': 19.0, 'lissage': 0.1, 'aire': 650.0}",
        "assert valider_entree(_ok, schema) == [], \"une entrée correcte doit donner une liste vide\"",
        "_sans = {k: v for k, v in _ok.items() if k != 'aire'}",
        "assert len(valider_entree(_sans, schema)) == 1, \"un champ manquant doit donner exactement un problème\"",
        "assert len(valider_entree({**_ok, 'rayon': 140.0}, schema)) == 1, \"une valeur hors des bornes doit donner un problème\"",
        "assert len(valider_entree({**_ok, 'texture': 'dix-neuf'}, schema)) == 1, \"un texte à la place d'un nombre doit donner un problème\"",
        "assert len(valider_entree({**_ok, 'couleur': 'rose'}, schema)) == 1, \"un champ inconnu doit donner un problème\"",
        "assert all(isinstance(_p, str) for _p in valider_entree({**_ok, 'rayon': 140.0}, schema)), \"chaque problème doit être une phrase (une chaîne)\"",
      ),
      hint: "Parcourez schema.items() pour les champs manquants, les types et les bornes, puis entree pour les champs inconnus. isinstance(valeur, (int, float)) teste qu'on a un nombre.",
    },
    {
      kind: "text",
      md: `### ONNX et Docker, à lire

Deux outils prolongent l'empaquetage. Ni l'un ni l'autre ne tourne dans le moteur du site : ces extraits sont à lire, ou à essayer sur votre machine.

**ONNX** (*Open Neural Network Exchange*) est un format ouvert qui décrit un modèle comme un **graphe de calculs**, sans code Python. Il se charge avec une bibliothèque d'exécution (onnxruntime) disponible dans plusieurs langages, et ne peut pas, par construction, exécuter du code arbitraire comme le fait pickle. Un modèle scikit-learn s'y convertit avec \`skl2onnx\` :

\`\`\`python
from skl2onnx import to_onnx
import onnxruntime as ort

# la conversion a besoin d'un exemple d'entrée pour connaître le nombre et le type des colonnes
exemple = X_app.iloc[:1].to_numpy(dtype="float32")
onnx_modele = to_onnx(modele, exemple)
with open("modele.onnx", "wb") as f:
    f.write(onnx_modele.SerializeToString())

session = ort.InferenceSession("modele.onnx")
nom_entree = session.get_inputs()[0].name
classes = session.run(None, {nom_entree: X_test.to_numpy(dtype="float32")})[0]
\`\`\`

Avant de s'y fier, on compare les classes de la session ONNX à celles du modèle d'origine, comme nous l'avons fait pour pickle. Un modèle converti est un autre objet : il peut différer légèrement (calculs en 32 bits).

**Docker** emballe le programme **et** son environnement (version de Python, bibliothèques) dans une image qui s'exécute à l'identique sur n'importe quelle machine qui a Docker. Cela règle le problème des versions notées dans la fiche. Un \`Dockerfile\` minimal :

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY modele.pkl fiche.json ./
COPY serveur.py .
CMD ["python", "serveur.py"]
\`\`\`

Ici, \`requirements.txt\` fixe les versions exactes (\`scikit-learn==...\`, relevées dans la fiche). Le module 5 du cours revient sur la façon de servir un modèle.`,
    },
  ],
  quiz: [
    {
      question: "Après avoir rechargé un modèle avec pickle.loads, quelle vérification est la plus utile ?",
      options: [
        "Contrôler que le fichier est assez petit",
        "Vérifier que l'extension du fichier est .pkl",
        "Comparer ses prédictions à celles du modèle d'origine sur des mêmes données",
        "Réentraîner le modèle pour être sûr",
      ],
      correct: 2,
      explanation: "Un modèle sauvegardé n'a de valeur que s'il répond comme l'original. La comparaison des classes et des probabilités sur les mêmes données le prouve en une ligne.",
    },
    {
      question: "Pourquoi charger un pickle d'origine inconnue est-il dangereux ?",
      options: [
        "Parce que le fichier peut contenir un virus visible dans son nom",
        "Parce que le chargement peut appeler n'importe quelle fonction Python, donc exécuter du code choisi par l'auteur du fichier",
        "Parce que pickle ne sait lire que les fichiers de moins d'un mégaoctet",
        "Parce qu'un pickle écrase toujours le modèle déjà en mémoire",
      ],
      correct: 1,
      explanation: "La méthode __reduce__ d'un objet dit à pickle quelle fonction appeler pour le reconstruire. Dans l'exemple c'est print ; dans une attaque, ce serait autre chose. D'où la règle : ne jamais charger un pickle dont on ne connaît pas la source.",
    },
    {
      question: "À quoi sert l'empreinte SHA-256 du fichier de modèle placée dans la fiche ?",
      options: [
        "À rendre le modèle plus rapide",
        "À chiffrer le fichier pour que personne ne le lise",
        "À augmenter la réussite sur le test",
        "À vérifier qu'un fichier reçu est bien celui décrit par la fiche, ni corrompu ni remplacé",
      ],
      correct: 3,
      explanation: "L'empreinte change si un seul bit change. Celui qui reçoit modèle et fiche recalcule l'empreinte et la compare : si elles diffèrent, le fichier n'est pas celui qui a été publié.",
    },
    {
      question: "Pourquoi la date de la fiche est-elle écrite en dur dans l'exemple plutôt que lue à l'exécution ?",
      options: [
        "Parce que Python ne sait pas lire la date",
        "Parce que la fiche changerait à chaque exécution et ne serait plus reproductible ni comparable",
        "Parce que JSON interdit les dates",
        "Parce que la date est un secret",
      ],
      correct: 1,
      explanation: "Une fiche doit rester la même tant que le modèle est le même. Dans une chaîne de production, la date est écrite une fois à la publication du modèle, pas à chaque lecture.",
    },
    {
      question: "Un client envoie l'ancien format d'entrée à un service dont le schéma est passé en version 2 (un champ de plus). Que doit-il se passer ?",
      options: [
        "Le service remplit le champ manquant par un zéro et répond sans rien dire",
        "Le service refuse la requête avec un message qui nomme le champ manquant",
        "Le service ignore le schéma et appelle le modèle quand même",
        "Le service supprime l'ancien modèle",
      ],
      correct: 1,
      explanation: "Répondre en silence avec une valeur inventée donnerait une prédiction que personne n'a voulue. Un refus explicite (« champ manquant : symetrie ») prévient l'appelant que l'interface a changé.",
    },
  ],
};
