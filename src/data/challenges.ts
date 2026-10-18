import { lines } from "@/data/lessons/lines";
import type { ChallengeExercise } from "@/lib/lessons/types";

/**
 * Défis de programmation de la page Programmation (onglet « Défis »). Chaque défi est un exercice vérifié par le
 * moteur du site : la réponse est suivie de `test`, qui doit passer (Python : des assert ; JavaScript : la fonction
 * `verifier`, qui lève une erreur nommée AssertionError). La réussite n'est enregistrée qu'après une vérification
 * réussie (progression `challenges` de use-course-progress, un élément par identifiant de défi).
 * src/data/challenges.test.ts exécute chaque corrigé et vérifie que chaque réponse de départ échoue.
 */
export interface Challenge {
  /** Identifiant stable (clé de progression) : ne pas le changer */
  id: string;
  title: string;
  description: string;
  difficulty: "facile" | "moyen" | "difficile";
  category: string;
  /** Durée indicative, par exemple « 15 min » */
  duration: string;
  learningObjectives: string[];
  tags: string[];
  exercise: ChallengeExercise;
}

/** Vérification des défis JavaScript : même message que l'assert de Python (« AssertionError: ... ») */
const VERIFIER_JS = lines(
  "const verifier = (condition, message) => {",
  "  if (!condition) {",
  "    const erreur = new Error(message);",
  '    erreur.name = "AssertionError";',
  "    throw erreur;",
  "  }",
  "};",
);

export const CHALLENGES: Challenge[] = [
  {
    id: "python-basics-1",
    title: "Calculateur de moyenne",
    description: "Une fonction qui calcule la moyenne d'une liste de nombres",
    difficulty: "facile",
    category: "Bases de Python",
    duration: "15 min",
    learningObjectives: ["Manipuler des listes", "Fonctions natives (sum, len)", "Cas limites", "Définir une fonction"],
    tags: ["fonctions", "listes", "bases"],
    exercise: {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez une fonction `calculer_moyenne(nombres)` qui renvoie la moyenne d'une liste de nombres. Par exemple, `calculer_moyenne([1, 2, 3, 4, 5])` vaut 3.0 et `calculer_moyenne([10, 20])` vaut 15.0. La moyenne d'une liste vide n'est pas définie : par convention, la fonction renvoie alors 0.",
      starter: lines(
        "def calculer_moyenne(nombres):",
        "    # Votre code ici",
        "    pass",
        "",
        "print(calculer_moyenne([1, 2, 3, 4, 5]))",
      ),
      solution: lines(
        "def calculer_moyenne(nombres):",
        "    if not nombres:",
        "        return 0",
        "    return sum(nombres) / len(nombres)",
        "",
        "print(calculer_moyenne([1, 2, 3, 4, 5]))",
      ),
      test: lines(
        "for liste, attendu in [([1, 2, 3, 4, 5], 3.0), ([10, 20], 15.0), ([100], 100.0), ([2.5, 3.5], 3.0)]:",
        "    obtenu = calculer_moyenne(liste)",
        "    assert obtenu == attendu, f\"calculer_moyenne({liste}) doit valoir {attendu} (vous obtenez {obtenu})\"",
        "obtenu = calculer_moyenne([])",
        "assert obtenu == 0, f\"Pour une liste vide, la convention de l'énoncé est de renvoyer 0 (vous obtenez {obtenu})\"",
      ),
      hint: lines(
        "1. `sum(nombres)` additionne les éléments et `len(nombres)` les compte.",
        "2. La moyenne est la somme divisée par le nombre d'éléments.",
        "3. Testez d'abord la liste vide (`if not nombres:`) : sinon, la division par zéro lève une erreur.",
      ),
    },
  },
  {
    id: "python-data-1",
    title: "Analyse de ventes mensuelles",
    description: "Quatre indicateurs simples sur un dictionnaire de ventes",
    difficulty: "moyen",
    category: "Analyse de données",
    duration: "30 min",
    learningObjectives: ["Manipuler des dictionnaires", "Fonctions d'agrégation", "Logique conditionnelle"],
    tags: ["dictionnaires", "agrégation", "analyse"],
    exercise: {
      kind: "exercise",
      language: "python",
      prompt:
        "Les ventes d'une boutique sont rangées dans un dictionnaire mois → montant, dans l'ordre des mois. Écrivez `analyser_ventes(ventes)` qui renvoie un dictionnaire avec quatre clés : `total` (la somme des ventes), `moyenne` (la moyenne mensuelle), `meilleur_mois` (le mois du montant le plus élevé) et `croissance` (`True` si le dernier mois dépasse le premier, `False` sinon). Les montants sont inventés pour l'exercice.",
      starter: lines(
        "def analyser_ventes(ventes):",
        "    # Votre code ici",
        "    pass",
        "",
        "print(analyser_ventes({'janv': 1000, 'févr': 1200, 'mars': 1100, 'avr': 1300}))",
      ),
      solution: lines(
        "def analyser_ventes(ventes):",
        "    montants = list(ventes.values())",
        "    total = sum(montants)",
        "    mois = list(ventes.keys())",
        "    return {",
        "        'total': total,",
        "        'moyenne': total / len(montants),",
        "        'meilleur_mois': max(ventes, key=ventes.get),",
        "        'croissance': ventes[mois[-1]] > ventes[mois[0]],",
        "    }",
        "",
        "print(analyser_ventes({'janv': 1000, 'févr': 1200, 'mars': 1100, 'avr': 1300}))",
      ),
      test: lines(
        "r = analyser_ventes({'janv': 1000, 'févr': 1200, 'mars': 1100, 'avr': 1300})",
        "assert isinstance(r, dict), f\"analyser_ventes doit renvoyer un dictionnaire (vous obtenez {r!r})\"",
        "assert r.get('total') == 4600, f\"Le total des ventes de janvier à avril vaut 4600 (vous obtenez {r.get('total')})\"",
        "assert r.get('moyenne') == 1150.0, f\"La moyenne mensuelle vaut 1150.0 (vous obtenez {r.get('moyenne')})\"",
        "assert r.get('meilleur_mois') == 'avr', f\"Le meilleur mois est 'avr' (vous obtenez {r.get('meilleur_mois')!r})\"",
        "assert r.get('croissance') is True, f\"Avril (1300) dépasse janvier (1000) : croissance vaut True (vous obtenez {r.get('croissance')!r})\"",
        "r = analyser_ventes({'janv': 900, 'févr': 700, 'mars': 800})",
        "assert r.get('meilleur_mois') == 'janv', f\"Avec janv 900, févr 700, mars 800, le meilleur mois est 'janv' (vous obtenez {r.get('meilleur_mois')!r})\"",
        "assert r.get('croissance') is False, f\"Mars (800) ne dépasse pas janvier (900) : croissance vaut False (vous obtenez {r.get('croissance')!r})\"",
        "assert r.get('moyenne') == 800.0, f\"La moyenne de 900, 700 et 800 vaut 800.0 (vous obtenez {r.get('moyenne')})\"",
      ),
      hint: lines(
        "1. `ventes.values()` donne les montants, `ventes.keys()` les mois, dans l'ordre d'insertion.",
        "2. `max(ventes, key=ventes.get)` renvoie la clé dont la valeur est la plus grande.",
        "3. Pour la croissance, comparez le montant du dernier mois (`list(ventes)[-1]`) à celui du premier.",
      ),
    },
  },
  {
    id: "python-ml-1",
    title: "Classificateur des k plus proches voisins",
    description: "Un classificateur k-NN écrit à la main, sur des points en deux dimensions",
    difficulty: "difficile",
    category: "Machine Learning",
    duration: "45 min",
    learningObjectives: ["Distance euclidienne", "Trier et sélectionner", "Vote à la majorité", "Principe des k plus proches voisins"],
    tags: ["machine learning", "k-NN", "classification"],
    exercise: {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez `distance_euclidienne(p1, p2)`, la distance entre deux points (x, y), puis `knn_classifier(points, nouveau_point, k=3)`. `points` est une liste de triplets (x, y, classe) ; la fonction renvoie la classe la plus fréquente parmi les `k` points les plus proches de `nouveau_point`. Les points des tests sont choisis pour qu'il n'y ait jamais d'égalité de votes.",
      starter: lines(
        "import math",
        "",
        "def distance_euclidienne(p1, p2):",
        "    # Votre code ici",
        "    pass",
        "",
        "def knn_classifier(points, nouveau_point, k=3):",
        "    # Votre code ici",
        "    pass",
        "",
        "donnees = [(1, 1, 'A'), (2, 2, 'A'), (3, 3, 'B'), (4, 4, 'B')]",
        "print(knn_classifier(donnees, (2.2, 2.2), k=3))",
      ),
      solution: lines(
        "import math",
        "",
        "def distance_euclidienne(p1, p2):",
        "    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)",
        "",
        "def knn_classifier(points, nouveau_point, k=3):",
        "    distances = sorted((distance_euclidienne((x, y), nouveau_point), classe) for x, y, classe in points)",
        "    votes = {}",
        "    for _, classe in distances[:k]:",
        "        votes[classe] = votes.get(classe, 0) + 1",
        "    return max(votes, key=votes.get)",
        "",
        "donnees = [(1, 1, 'A'), (2, 2, 'A'), (3, 3, 'B'), (4, 4, 'B')]",
        "print(knn_classifier(donnees, (2.2, 2.2), k=3))",
      ),
      test: lines(
        "d = distance_euclidienne((0, 0), (3, 4))",
        "assert d == 5.0, f\"La distance entre (0, 0) et (3, 4) vaut 5.0 (vous obtenez {d})\"",
        "donnees = [(1, 1, 'A'), (2, 2, 'A'), (3, 3, 'B'), (4, 4, 'B')]",
        "for point, k, attendu in [((2.2, 2.2), 3, 'A'), ((3.6, 3.6), 3, 'B'), ((3.1, 3.1), 1, 'B'), ((1.4, 1.4), 1, 'A')]:",
        "    obtenu = knn_classifier(donnees, point, k=k)",
        "    assert obtenu == attendu, f\"Pour le point {point} avec k = {k}, la classe prédite est {attendu!r} (vous obtenez {obtenu!r})\"",
        "# trois points A groupés près de l'origine, deux points B plus loin : seuls les k plus proches votent",
        "groupes = [(0, 0, 'A'), (0, 1, 'A'), (1, 0, 'A'), (5, 5, 'B'), (5, 6, 'B')]",
        "for point, k, attendu in [((4.5, 4.5), 2, 'B'), ((4, 4), 3, 'B'), ((0.4, 0.4), 3, 'A')]:",
        "    obtenu = knn_classifier(groupes, point, k=k)",
        "    assert obtenu == attendu, f\"Avec trois points A près de l'origine et deux points B vers (5, 5), le point {point} avec k = {k} est classé {attendu!r} : seuls les {k} plus proches votent (vous obtenez {obtenu!r})\"",
      ),
      hint: lines(
        "1. La distance euclidienne vaut `math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)`.",
        "2. Calculez la distance de chaque point au nouveau point et gardez la classe avec : des couples (distance, classe).",
        "3. Triez ces couples par distance croissante et gardez les `k` premiers.",
        "4. Comptez les votes de chaque classe dans un dictionnaire et renvoyez la classe qui en a le plus.",
      ),
    },
  },
  {
    id: "js-dom-1",
    title: "Gestionnaire de tâches",
    description: "Une petite classe JavaScript qui gère une liste de tâches",
    difficulty: "moyen",
    category: "JavaScript",
    duration: "25 min",
    learningObjectives: ["Classes JavaScript", "Manipuler des tableaux", "Méthodes d'objet", "Gérer un état"],
    tags: ["javascript", "classes", "tableaux"],
    exercise: {
      kind: "exercise",
      language: "javascript",
      prompt:
        "Écrivez une classe `TaskManager` qui gère une liste de tâches, chacune de la forme `{ text, completed }`. Méthodes : `addTask(task)` ajoute une tâche (`completed` vaut `false` s'il est absent), `removeTask(index)` supprime la tâche à cette position, `toggleTask(index)` inverse son état, `getStats()` renvoie `{ total, completed, pending }`. Un index hors de la liste est ignoré. Le code s'exécute dans un bac à sable JavaScript, sans page à manipuler : `console.log` affiche ce que vous voulez voir.",
      starter: lines(
        "class TaskManager {",
        "  constructor() {",
        "    // Initialiser la liste des tâches",
        "  }",
        "",
        "  addTask(task) {}",
        "",
        "  removeTask(index) {}",
        "",
        "  toggleTask(index) {}",
        "",
        "  getStats() {}",
        "}",
        "",
        "const manager = new TaskManager();",
        'manager.addTask({ text: "Apprendre JavaScript", completed: false });',
        "console.log(manager.getStats());",
      ),
      solution: lines(
        "class TaskManager {",
        "  constructor() {",
        "    this.tasks = [];",
        "  }",
        "",
        "  addTask(task) {",
        "    this.tasks.push({ text: task.text, completed: Boolean(task.completed) });",
        "  }",
        "",
        "  removeTask(index) {",
        "    if (index >= 0 && index < this.tasks.length) this.tasks.splice(index, 1);",
        "  }",
        "",
        "  toggleTask(index) {",
        "    if (index >= 0 && index < this.tasks.length) this.tasks[index].completed = !this.tasks[index].completed;",
        "  }",
        "",
        "  getStats() {",
        "    const completed = this.tasks.filter((task) => task.completed).length;",
        "    return { total: this.tasks.length, completed, pending: this.tasks.length - completed };",
        "  }",
        "}",
        "",
        "const manager = new TaskManager();",
        'manager.addTask({ text: "Apprendre JavaScript", completed: false });',
        "console.log(manager.getStats());",
      ),
      test: lines(
        VERIFIER_JS,
        "const decrire = (s) => JSON.stringify(s);",
        "const essai = new TaskManager();",
        "let stats = essai.getStats();",
        "verifier(stats && stats.total === 0 && stats.completed === 0 && stats.pending === 0, `Une liste neuve donne {\"total\":0,\"completed\":0,\"pending\":0} (vous obtenez ${decrire(stats)})`);",
        'essai.addTask({ text: "Apprendre JavaScript", completed: false });',
        'essai.addTask({ text: "Lire la documentation" });',
        'essai.addTask({ text: "Faire l\'exercice", completed: true });',
        "stats = essai.getStats();",
        "verifier(stats && stats.total === 3 && stats.completed === 1 && stats.pending === 2, `Après trois ajouts, dont une tâche terminée : {\"total\":3,\"completed\":1,\"pending\":2} (vous obtenez ${decrire(stats)})`);",
        "essai.toggleTask(0);",
        "stats = essai.getStats();",
        "verifier(stats.completed === 2 && stats.pending === 1, `toggleTask(0) termine la première tâche : 2 terminées, 1 en attente (vous obtenez ${decrire(stats)})`);",
        "essai.removeTask(2);",
        "stats = essai.getStats();",
        "verifier(stats.total === 2 && stats.completed === 1, `removeTask(2) retire la troisième tâche (terminée) : 2 tâches, dont 1 terminée (vous obtenez ${decrire(stats)})`);",
        "essai.removeTask(10);",
        "essai.removeTask(-1);",
        "essai.toggleTask(-1);",
        "stats = essai.getStats();",
        "verifier(stats.total === 2 && stats.completed === 1, `Un index hors de la liste est ignoré (vous obtenez ${decrire(stats)})`);",
      ),
      hint: lines(
        "1. Le constructeur crée un tableau vide : `this.tasks = []`.",
        "2. `push` ajoute une tâche, `splice(index, 1)` en retire une.",
        "3. Vérifiez que `index` est entre 0 et `this.tasks.length - 1` avant de toucher au tableau.",
        "4. `filter((task) => task.completed).length` compte les tâches terminées.",
      ),
    },
  },
];
