import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Jeu des cellules du sein de scikit-learn réduit à trois mesures, modèle entraîné, contrat d'entrée et journal vide. */
const MODELE = lines(
  "import time",
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_breast_cancer",
  "from sklearn.pipeline import make_pipeline",
  "from sklearn.preprocessing import StandardScaler",
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.model_selection import train_test_split",
  "",
  "# trois mesures seulement, pour garder un modèle lisible : c'est un exemple d'enseignement, pas un outil médical",
  "jeu = load_breast_cancer(as_frame=True)",
  "CHAMPS = ['rayon_moyen', 'texture_moyenne', 'lissage_moyen']",
  "X = jeu.data[['mean radius', 'mean texture', 'mean smoothness']].set_axis(CHAMPS, axis=1)",
  "y = jeu.target                                   # 0 = malin, 1 = bénin",
  "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
  "modele = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_app, y_app)",
  "",
  "# le contrat d'entrée : trois nombres, dans des bornes plausibles que l'on se donne",
  "SCHEMA = {'rayon_moyen': (5.0, 40.0), 'texture_moyenne': (5.0, 50.0), 'lissage_moyen': (0.04, 0.2)}",
  "VERSION = '1.0'",
  "journal = []                                     # le journal en mémoire : une entrée par requête",
);

/** Le « service » : validation, réponse, prédiction journalisée avec sa latence. */
const SERVICE = lines(
  "def valider(requete):",
  "    \"\"\"Renvoie la liste des erreurs de la requête (liste vide : requête acceptable).\"\"\"",
  "    if not isinstance(requete, dict):",
  "        return ['la requête doit être un dictionnaire']",
  "    erreurs = []",
  "    for champ in SCHEMA:",
  "        if champ not in requete:",
  "            erreurs.append(f'champ manquant : {champ}')",
  "    for champ in requete:",
  "        if champ not in SCHEMA:",
  "            erreurs.append(f'champ inconnu : {champ}')",
  "    for champ, (bas, haut) in SCHEMA.items():",
  "        if champ not in requete:",
  "            continue",
  "        valeur = requete[champ]",
  "        if isinstance(valeur, bool) or not isinstance(valeur, (int, float)):",
  "            erreurs.append(f'{champ} : un nombre est attendu, reçu {type(valeur).__name__}')",
  "        elif not (bas <= valeur <= haut):          # fausse aussi pour nan",
  "            erreurs.append(f'{champ} : {valeur} hors de [{bas}, {haut}]')",
  "    return erreurs",
  "",
  "def construire_reponse(p_benin):",
  "    return {'ok': True, 'version': VERSION,",
  "            'classe': 'bénin' if p_benin >= 0.5 else 'malin',",
  "            'probabilite_benin': round(float(p_benin), 3)}",
  "",
  "def predire(requete):",
  "    \"\"\"Valide, prédit, journalise et mesure la latence d'une requête.\"\"\"",
  "    debut = time.perf_counter()",
  "    erreurs = valider(requete)",
  "    if erreurs:",
  "        reponse = {'ok': False, 'erreurs': erreurs}",
  "    else:",
  "        ligne = pd.DataFrame([requete], columns=CHAMPS)",
  "        reponse = construire_reponse(modele.predict_proba(ligne)[0, 1])",
  "    latence_ms = (time.perf_counter() - debut) * 1000",
  "    journal.append({'ok': reponse['ok'], 'latence_ms': latence_ms})",
  "    return reponse",
);

const DEMO = lines(
  "valide = {'rayon_moyen': 14.0, 'texture_moyenne': 19.0, 'lissage_moyen': 0.1}",
  "print(predire(valide))",
  "print(predire({'rayon_moyen': 14.0, 'texture_moyenne': 'dix-neuf'}))",
  "print(predire({**valide, 'rayon_moyen': 140, 'age': 3}))",
  "print(predire({**valide, 'rayon_moyen': True, 'texture_moyenne': float('nan')}))",
  "print(predire([14.0, 19.0, 0.1]))",
  "print('journal :', len(journal), 'entrées,', sum(not e['ok'] for e in journal), 'refus')",
);

const LOT = lines(
  "# les 143 lignes du jeu de test, transformées en requêtes",
  "requetes = [dict(zip(CHAMPS, map(float, ligne))) for ligne in X_test.values]",
  "journal.clear()",
  "",
  "# en ligne : une requête à la fois, avec validation et journal",
  "debut = time.perf_counter()",
  "reponses_une_a_une = [predire(r) for r in requetes]",
  "duree_une_a_une = time.perf_counter() - debut",
  "",
  "# par lot : un seul appel au modèle pour tout le tableau",
  "debut = time.perf_counter()",
  "p_lot = modele.predict_proba(X_test)[:, 1]",
  "duree_lot = time.perf_counter() - debut",
  "",
  "memes = all(abs(r['probabilite_benin'] - round(float(p), 3)) < 1e-9 for r, p in zip(reponses_une_a_une, p_lot))",
  "print(len(requetes), 'requêtes, mêmes probabilités des deux façons :', memes)",
  "print(f'une à une : {duree_une_a_une * 1000:.1f} ms au total ; en lot : {duree_lot * 1000:.2f} ms ; rapport : {duree_une_a_une / duree_lot:.0f}')",
  "",
  "latences = np.array([e['latence_ms'] for e in journal])",
  "print(f'latence par requête : médiane {np.median(latences):.2f} ms, 95e centile {np.percentile(latences, 95):.2f} ms, maximum {latences.max():.2f} ms')",
  "print('part de bonnes réponses sur le jeu de test :', round(float(np.mean([(r['classe'] == 'bénin') == bool(v) for r, v in zip(reponses_une_a_une, y_test)])), 3))",
);

export const moduleServirModele: LessonModule = {
  id: "servir-un-modele",
  title: "Servir un modèle",
  duration: "2 h",
  summary: "Un modèle devient utile quand quelqu'un d'autre peut l'appeler. Écrire la fonction de service : valider l'entrée, renvoyer une erreur lisible, journaliser, mesurer la latence, traiter un lot. Puis lire le FastAPI, le Dockerfile et l'appel curl qui en feraient un vrai service.",
  objectives: [
    "Écrire une fonction predire(requete) qui valide l'entrée, répond par une erreur lisible plutôt que par une exception, journalise et mesure sa latence",
    "Comparer la prédiction en ligne (une requête à la fois) et par lot, et mesurer l'écart",
    "Résumer un journal de service : nombre de requêtes, refus, latence médiane et 95e centile",
    "Lire un service FastAPI, son Dockerfile et un appel curl, et dire ce qui reste à faire avant une vraie mise en service",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un modèle que personne ne peut appeler ne sert à rien

Un modèle enregistré dans un fichier n'aide personne. Pour qu'une application, un collègue ou un autre programme en profite, il faut l'**exposer** : une porte d'entrée stable par laquelle on envoie une **requête** (les mesures d'un cas) et dont revient une **réponse** (la prédiction). On dit qu'on **sert** le modèle.

Cette porte est un **contrat**. Elle dit quels champs sont attendus, de quel type, dans quelles bornes, et ce qui revient en cas de problème. Un contrat clair protège dans les deux sens : l'appelant sait ce qu'il peut demander, le modèle ne reçoit jamais n'importe quoi. Sans contrat, une chaîne de caractères glissée à la place d'un nombre fait planter le service ou, pire, produit une prédiction absurde.

Le site ne peut lancer aucun serveur, et aucun service n'est fourni : tout ce module s'exécute dans votre page. Mais la **partie qui compte** d'un service est une simple fonction, \`predire(requete)\`, et celle-là se programme et se teste ici. Le reste (le serveur web, le conteneur) l'enveloppe, et vous le lirez en fin de module.

Le modèle est celui du jeu « cancer du sein » de scikit-learn, réduit à **trois mesures** (rayon, texture et lissage moyens des noyaux cellulaires) pour rester lisible : une régression logistique précédée d'une mise à l'échelle, entraînée sur 75 % des 569 cas. C'est un exemple d'enseignement. Il n'est pas un outil médical et ne doit jamais servir à un vrai diagnostic.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        SERVICE,
        "",
        DEMO,
      ),
      caption: "Le modèle, entraîné en coulisses, est dans la variable modele. La première requête est valide : probabilité de 0,659 d'être « bénin », donc la réponse « bénin ». Les quatre suivantes sont refusées avec une liste d'erreurs lisible : champ manquant et type faux, champ inconnu et valeur hors bornes, booléen pris pour un nombre et nan, et une liste au lieu d'un dictionnaire. Aucune ne déclenche d'exception, et les cinq passent au journal (4 refus sur 5 entrées).",
    },
    {
      kind: "text",
      md: `### Valider avant de prédire

Trois règles guident la fonction \`valider\` ci-dessus :

- **Ne jamais faire confiance à l'entrée.** Un appelant se trompe, ou envoie volontairement des valeurs piégées. On vérifie la forme (un dictionnaire), les champs (ni manquants, ni en trop), les types et les bornes.
- **Tout dire d'un coup.** Renvoyer toutes les erreurs d'une requête évite à l'appelant de corriger, relancer, découvrir la suivante.
- **Des erreurs lisibles.** « rayon_moyen : 140 hors de [5.0, 40.0] » se corrige sans lire le code du service. Une trace Python n'aide personne qui ne connaît pas votre code, et peut révéler des détails internes.

Deux pièges se cachent dans le type. En Python, \`True\` est un \`int\` : \`isinstance(True, int)\` renvoie vrai, d'où le test explicite du \`bool\`. Et \`nan\` (« pas un nombre ») est un \`float\` valide qui échappe à toutes les comparaisons : \`5 <= nan <= 40\` est faux, ce qui le fait tomber, par bonheur, dans « hors bornes ».`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `valider(requete)` : elle renvoie la liste des erreurs de la requête, **un message par problème**, et une liste vide si tout va bien. Cas à traiter : ce n'est pas un dictionnaire (un seul message, sans erreur Python) ; un champ de `SCHEMA` manque ; un champ n'est pas dans `SCHEMA` ; la valeur n'est pas un nombre (une chaîne, ou un booléen) ; la valeur sort de ses bornes (bornes incluses, `nan` refusé). Chaque message contient le nom du champ concerné.",
      setup: MODELE,
      starter: lines(
  "def valider(requete):",
  "    return []",
),
      solution: lines(
  "def valider(requete):",
  "    if not isinstance(requete, dict):",
  "        return ['la requête doit être un dictionnaire']",
  "    erreurs = []",
  "    for champ, (bas, haut) in SCHEMA.items():",
  "        if champ not in requete:",
  "            erreurs.append(f'champ manquant : {champ}')",
  "            continue",
  "        valeur = requete[champ]",
  "        if isinstance(valeur, bool) or not isinstance(valeur, (int, float)):",
  "            erreurs.append(f'{champ} : un nombre est attendu')",
  "        elif not (bas <= valeur <= haut):",
  "            erreurs.append(f'{champ} : {valeur} hors de [{bas}, {haut}]')",
  "    for champ in requete:",
  "        if champ not in SCHEMA:",
  "            erreurs.append(f'champ inconnu : {champ}')",
  "    return erreurs",
  "",
  "print(valider({'rayon_moyen': 14.0, 'texture_moyenne': 19.0, 'lissage_moyen': 0.1}))",
  "print(valider({'rayon_moyen': 140.0}))",
),
      test: lines(
  "_bon = {'rayon_moyen': 14.0, 'texture_moyenne': 19.0, 'lissage_moyen': 0.1}",
  "assert valider(_bon) == [], \"une requête correcte doit renvoyer une liste vide\"",
  "assert valider({**_bon, 'rayon_moyen': 5}) == [], \"une valeur égale à la borne est acceptée, et un entier est un nombre\"",
  "_sans = {k: v for k, v in _bon.items() if k != 'lissage_moyen'}",
  "_r = valider(_sans)",
  "assert len(_r) == 1 and 'lissage_moyen' in _r[0], \"un champ manquant doit donner un message qui contient son nom\"",
  "_r = valider({**_bon, 'age': 40})",
  "assert len(_r) == 1 and 'age' in _r[0], \"un champ qui n'est pas dans le schéma doit être signalé, avec son nom\"",
  "_r = valider({**_bon, 'texture_moyenne': '19'})",
  "assert len(_r) == 1 and 'texture_moyenne' in _r[0], \"une chaîne n'est pas un nombre, même si elle ressemble à un nombre\"",
  "assert len(valider({**_bon, 'rayon_moyen': True})) == 1, \"True est un bool : refusez-le (isinstance(valeur, bool))\"",
  "assert len(valider({**_bon, 'rayon_moyen': 41.0})) == 1, \"41 dépasse la borne haute de 40\"",
  "assert len(valider({**_bon, 'lissage_moyen': float('nan')})) == 1, \"un nan n'est pas dans l'intervalle : bas <= valeur <= haut est faux pour nan\"",
  "assert len(valider({})) == 3, \"une requête vide manque de trois champs : trois messages\"",
  "assert len(valider([1, 2, 3])) == 1, \"ce n'est même pas un dictionnaire : un message, sans erreur Python\"",
),
      hint: "isinstance(requete, dict) d'abord. Pour chaque champ de SCHEMA : absent ? mauvais type (isinstance(valeur, bool) ou pas de int/float) ? hors de bas <= valeur <= haut ? Puis parcourez requete pour les champs en trop.",
    },
    {
      kind: "text",
      md: `### En ligne ou par lot

Il existe deux façons d'appeler un modèle :

- **en ligne** (*online*) : une requête arrive, une réponse part tout de suite. C'est le cas d'un formulaire, d'une application. La **latence** (le délai de réponse) compte ;
- **par lot** (*batch*) : on prédit sur des milliers de lignes d'un coup, la nuit par exemple, et on range les résultats. Le **débit** (le nombre de lignes par seconde) compte, pas la réponse immédiate.

Le même modèle peut servir les deux, mais pas au même prix. Un appel à \`predict\` a un coût fixe (construire le tableau, traverser le pipeline, appeler la bibliothèque) que l'on paie à chaque fois, quelle que soit la taille de la demande. Prédire cent quarante-trois lignes en un seul appel est donc bien plus rapide que de faire cent quarante-trois appels d'une ligne. L'exemple suivant le mesure sur le jeu de test, et résume au passage les latences du journal.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(MODELE, "", SERVICE),
      code: LOT,
      caption: "Mesures faites sous Node avec ce code, trois exécutions : 143 requêtes une à une prennent entre 570 et 596 ms au total contre 2,7 à 3,3 ms pour un seul appel sur le tableau entier, soit un rapport de 176 à 214. La latence médiane d'une requête est de 3,8 à 4,0 ms, le 95e centile de 4,8 à 5,3 ms, le maximum d'environ 11 ms. Les deux façons donnent les mêmes probabilités. Les chiffres varient d'une machine et d'une exécution à l'autre ; seul l'ordre de grandeur de l'écart est à retenir. Sur ce jeu de test, 91,6 % des cas sont bien classés, avec un modèle à trois variables et un seul découpage.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `predire_lot(requetes)` : elle reçoit une liste de requêtes et renvoie une liste de réponses **dans le même ordre**. Une requête invalide reçoit `{'ok': False, 'erreurs': [...]}` à sa place sans arrêter le lot. Les requêtes valides doivent être prédites par **un seul appel** à `modele.predict_proba` sur un tableau pandas de colonnes `CHAMPS`, et chaque réponse doit être identique à celle de `predire` (utilisez `valider` et `construire_reponse`, déjà définies).",
      setup: lines(MODELE, "", SERVICE),
      starter: lines(
  "def predire_lot(requetes):",
  "    return [predire(r) for r in requetes]   # fonctionne, mais appelle le modèle une fois par requête",
),
      solution: lines(
  "def predire_lot(requetes):",
  "    reponses = [None] * len(requetes)",
  "    valides = []",
  "    for i, requete in enumerate(requetes):",
  "        erreurs = valider(requete)",
  "        if erreurs:",
  "            reponses[i] = {'ok': False, 'erreurs': erreurs}",
  "        else:",
  "            valides.append(i)",
  "    if valides:",
  "        tableau = pd.DataFrame([requetes[i] for i in valides], columns=CHAMPS)",
  "        probabilites = modele.predict_proba(tableau)[:, 1]      # un seul appel pour tout le lot",
  "        for i, p in zip(valides, probabilites):",
  "            reponses[i] = construire_reponse(p)",
  "    return reponses",
  "",
  "lot = [{'rayon_moyen': 14.0, 'texture_moyenne': 19.0, 'lissage_moyen': 0.1}, {'rayon_moyen': 'x'}]",
  "print(predire_lot(lot))",
),
      test: lines(
  "class _Compteur:",
  "    \"\"\"Enveloppe le modèle pour compter les appels à predict_proba.\"\"\"",
  "    def __init__(self, vrai):",
  "        self.vrai, self.appels = vrai, 0",
  "    def predict_proba(self, tableau):",
  "        self.appels += 1",
  "        return self.vrai.predict_proba(tableau)",
  "",
  "_lot = [dict(zip(CHAMPS, map(float, ligne))) for ligne in X_test.values[:20]]",
  "_lot[3] = {'rayon_moyen': 14.0}                 # une requête invalide au milieu du lot",
  "_lot[7] = [1, 2, 3]                             # une autre, qui n'est même pas un dictionnaire",
  "_vrai_modele = modele",
  "_attendu = [predire(r) for r in _lot]",
  "modele = _Compteur(_vrai_modele)",
  "_reponses = predire_lot(_lot)",
  "_appels = modele.appels",
  "modele = _vrai_modele",
  "assert len(_reponses) == 20, f\"il faut une réponse par requête, dans le même ordre : 20 attendues, {len(_reponses)} reçues\"",
  "assert _reponses[3]['ok'] is False and _reponses[7]['ok'] is False, \"les requêtes invalides donnent {'ok': False, 'erreurs': [...]} à leur place, sans arrêter le lot\"",
  "assert _reponses == _attendu, \"chaque réponse doit être identique à celle de predire pour la même requête\"",
  "assert _appels == 1, f\"le modèle doit être appelé une seule fois pour tout le lot, pas {_appels} fois\"",
),
      hint: "Parcourez les requêtes avec enumerate, notez les positions des valides, construisez un seul DataFrame avec elles, un seul predict_proba, puis replacez chaque réponse à sa position.",
    },
    {
      kind: "text",
      md: `### Le journal : savoir ce que fait le service

Un service sans journal est une boîte noire. Chaque requête laisse ici une trace minimale : réussie ou refusée, et sa latence. Dans un vrai service, on ajoute l'identifiant de la requête, la version du modèle et un horodatage, ce qui permet de retrouver une réponse contestée.

Deux précautions, qui relèvent autant du droit que de la technique. **Ne journalisez pas ce que vous n'avez pas besoin de garder** : si les requêtes contiennent des données personnelles, surtout de santé, les écrire dans un journal crée un second fichier à protéger et à effacer à échéance. Et **résumez par des centiles, pas seulement par la moyenne** : quelques requêtes lentes ruinent l'expérience de ceux qui les subissent sans bouger la moyenne. Le **95e centile** est la latence que 95 % des requêtes ne dépassent pas ; la **médiane** est le 50e.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `resume_journal(journal)` : elle reçoit une liste d'entrées `{'ok': bool, 'latence_ms': float}` et renvoie un dictionnaire de clés `'requetes'` (nombre d'entrées), `'refus'` (nombre d'entrées dont `ok` est faux), `'latence_mediane_ms'` et `'latence_p95_ms'` (médiane et 95e centile, avec `np.percentile`). Pour un journal vide : 0 requête, 0 refus, et `None` pour les deux latences.",
      setup: lines(MODELE, "", SERVICE),
      starter: lines(
  "def resume_journal(journal):",
  "    return {}",
),
      solution: lines(
  "def resume_journal(journal):",
  "    latences = np.array([e['latence_ms'] for e in journal])",
  "    return {",
  "        'requetes': len(journal),",
  "        'refus': sum(not e['ok'] for e in journal),",
  "        'latence_mediane_ms': float(np.median(latences)) if len(latences) else None,",
  "        'latence_p95_ms': float(np.percentile(latences, 95)) if len(latences) else None,",
  "    }",
  "",
  "essai = [{'ok': True, 'latence_ms': 2.0}, {'ok': False, 'latence_ms': 0.1}, {'ok': True, 'latence_ms': 4.0}]",
  "print(resume_journal(essai))",
),
      test: lines(
  "_j = [{'ok': True, 'latence_ms': 1.0}, {'ok': False, 'latence_ms': 2.0}, {'ok': True, 'latence_ms': 3.0}, {'ok': True, 'latence_ms': 10.0}]",
  "_r = resume_journal(_j)",
  "assert _r.get('requetes') == 4, \"'requetes' doit valoir le nombre d'entrées du journal (4)\"",
  "assert _r.get('refus') == 1, \"'refus' compte les entrées dont 'ok' est False (1 ici)\"",
  "assert abs(_r.get('latence_mediane_ms', -1) - 2.5) < 1e-9, \"la médiane de 1, 2, 3 et 10 vaut 2,5 : np.median\"",
  "assert abs(_r.get('latence_p95_ms', -1) - 8.95) < 1e-9, \"le 95e centile se calcule avec np.percentile(latences, 95), ici 8,95\"",
  "_v = resume_journal([])",
  "assert _v.get('requetes') == 0 and _v.get('latence_mediane_ms') is None, \"un journal vide ne doit pas planter : 0 requête et des latences à None\"",
),
      hint: "np.array([e['latence_ms'] for e in journal]) donne les latences. np.median et np.percentile(latences, 95) les résument ; sum(not e['ok'] ...) compte les refus.",
    },
    {
      kind: "text",
      md: `### Du fonctionnel au vrai service : code à lire

Pour que d'autres programmes appellent \`predire\` à travers le réseau, on l'enveloppe dans un serveur web. En Python, **FastAPI** est une bibliothèque qui fait ce travail et décrit la validation avec des types. Le code ci-dessous ne tourne pas dans le moteur du site, qui n'a ni FastAPI, ni réseau, ni serveur : il est là pour être lu, et pour être essayé sur votre machine si vous le souhaitez.

\`\`\`python
# app.py
import pickle
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()
with open("modele.pkl", "rb") as f:        # un fichier produit par vous, jamais d'origine inconnue
    modele = pickle.load(f)

class Requete(BaseModel):
    # la validation du contrat est déclarée : un champ hors bornes renvoie une erreur 422
    rayon_moyen: float = Field(ge=5, le=40)
    texture_moyenne: float = Field(ge=5, le=50)
    lissage_moyen: float = Field(ge=0.04, le=0.2)

@app.get("/sante")
def sante():
    return {"etat": "ok"}                   # sert aux sondes de supervision

@app.post("/predire")
def predire(requete: Requete):
    ligne = [[requete.rayon_moyen, requete.texture_moyenne, requete.lissage_moyen]]
    p_benin = float(modele.predict_proba(ligne)[0, 1])
    return {"version": "1.0", "probabilite_benin": round(p_benin, 3)}
\`\`\`

Pour que le service tourne partout de la même façon, on le range dans un **conteneur** : une boîte qui embarque le programme, ses bibliothèques et leurs versions. Un \`Dockerfile\` en est la recette (le numéro de version de Python n'est qu'un exemple) :

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py modele.pkl ./
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

Une fois le conteneur lancé sur votre machine, un appel en ligne de commande avec **curl** ressemble à ceci :

\`\`\`bash
curl -X POST localhost:8000/predire \\
  -H "Content-Type: application/json" \\
  -d '{"rayon_moyen": 14.0, "texture_moyenne": 19.0, "lissage_moyen": 0.1}'
\`\`\`

La réponse est un petit objet JSON de la même forme que celle de notre fonction. Nous ne montrons pas de valeur : ce code n'a pas été exécuté ici.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: "Mettre un modèle en service ne se résume pas à ces trois fichiers. Il reste à décider qui a le droit de l'appeler (authentification), à limiter le débit, à chiffrer les échanges, à surveiller les erreurs et la latence, à prévoir le retour à la version précédente et, pour des données de santé, à respecter un cadre juridique strict. Ce module montre la logique du service ; la mise en production demande une équipe qui sait le faire.",
    },
    {
      kind: "note",
      tone: "info",
      md: "La **version** du modèle figure dans chaque réponse (version 1.0 ici). Quand une prédiction est contestée, on sait quel modèle l'a produite, et on peut le recharger pour la rejouer. Cela ne coûte presque rien et sauve bien des enquêtes.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi la fonction de service renvoie-t-elle une liste d'erreurs lisible au lieu de laisser Python lever une exception ?",
      options: [
        "Parce que les exceptions sont interdites en Python",
        "Parce que l'appelant doit pouvoir corriger sa requête sans lire le code du service, et qu'une trace peut révéler des détails internes",
        "Parce que cela rend le modèle plus précis",
        "Parce que les exceptions ralentissent toujours le modèle",
      ],
      correct: 1,
      explanation: "Le contrat de la porte d'entrée dit ce qui est accepté et ce qui revient en cas d'erreur. Une réponse claire se corrige, une trace Python s'adresse au développeur, pas à l'appelant.",
    },
    {
      question: "Pourquoi isinstance(valeur, bool) est-il testé avant de vérifier que la valeur est un nombre ?",
      options: [
        "Parce que True et False sont des int en Python, donc un booléen passerait pour un nombre valide",
        "Parce que les booléens ne peuvent pas être comparés à un nombre",
        "Parce que pandas refuse les booléens",
        "Parce que bool est plus lent que int",
      ],
      correct: 0,
      explanation: "bool est une sous-classe de int : isinstance(True, int) est vrai et True vaut 1. Sans test explicite, un True envoyé par erreur serait pris pour la valeur 1.",
    },
    {
      question: "Les 143 requêtes du jeu de test sont prédites une par une, puis en un seul appel. Quel constat fait l'exemple du module ?",
      options: [
        "Les deux façons ont la même durée",
        "Les prédictions par lot sont moins précises",
        "L'appel unique est de l'ordre de plusieurs centaines de fois plus rapide, avec les mêmes probabilités",
        "L'appel unique est plus lent mais économise de la mémoire",
      ],
      correct: 2,
      explanation: "Chaque appel au modèle a un coût fixe (tableau, pipeline, bibliothèque). Un lot le paie une fois. Le rapport mesuré va de 176 à 214 selon l'exécution, sans changer les probabilités.",
    },
    {
      question: "Pourquoi résumer les latences par le 95e centile et pas seulement par la moyenne ?",
      options: [
        "Parce que la moyenne est impossible à calculer",
        "Parce que le 95e centile est toujours plus petit que la moyenne",
        "Parce qu'une minorité de requêtes très lentes ne change presque pas la moyenne, mais gâche l'expérience de ceux qui les subissent",
        "Parce que la norme l'impose",
      ],
      correct: 2,
      explanation: "La moyenne lisse les extrêmes. Le 95e centile indique le délai que 5 % des requêtes dépassent, et fait apparaître les lenteurs que la moyenne cache.",
    },
    {
      question: "Parmi ces trois éléments (FastAPI, Dockerfile, curl), lesquels tournent dans le moteur du site ?",
      options: [
        "Les trois",
        "FastAPI et curl seulement",
        "Le Dockerfile seulement",
        "Aucun : le moteur n'a ni serveur, ni conteneur, ni réseau, ce code est à lire",
      ],
      correct: 3,
      explanation: "Le moteur exécute du Python et du SQL dans la page, sans réseau ni serveur. Ces trois éléments se lisent ici et s'essaient sur votre propre machine.",
    },
  ],
};
