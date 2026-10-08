import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module7: LessonModule = {
  id: "module-7",
  title: "Jupyter et les bonnes habitudes",
  duration: "1 h 30",
  summary: "Cellules, noyau et état caché, commandes magiques et leurs équivalents en Python, et les habitudes qui rendent un notebook relisable et reproductible.",
  objectives: [
    "Expliquer ce que sont les cellules et le noyau d'un notebook",
    "Éviter les pièges de l'état caché quand on exécute les cellules dans le désordre",
    "Mesurer une durée sans commande magique",
    "Organiser un notebook pour qu'il soit reproductible et partageable",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un cahier de calcul

Un **notebook** Jupyter mélange des **cellules de code**, qu'on exécute une par une, des **cellules de texte** (markdown, formules), et les **sorties** : résultats, tableaux, graphiques. Le code est exécuté par un **noyau** (*kernel*), un processus Python qui garde en mémoire toutes les variables créées depuis son démarrage.

On ouvre les notebooks avec Jupyter Notebook ou JupyterLab (dans le navigateur), dans des éditeurs comme VS Code, ou dans des services en ligne comme Google Colab. Les fichiers portent l'extension \`.ipynb\` : c'est du JSON qui contient le code, le texte et les sorties.`,
    },
    { kind: "widget", widget: "jupyter-workflow" },
    {
      kind: "text",
      md: lines(
        "Sur votre machine, l'installation tient en deux commandes (à lire, elles ne s'exécutent pas ici) :",
        "",
        "```bash",
        "python -m pip install jupyterlab",
        "jupyter lab",
        "```",
        "",
        "Raccourcis utiles : Maj + Entrée exécute la cellule et passe à la suivante ; Échap puis A ou B insère une cellule au-dessus ou au-dessous ; Échap puis M transforme la cellule en texte.",
      ),
    },
    {
      kind: "text",
      md: "### Le piège de l'état caché\n\nLe noyau se souvient de tout, **dans l'ordre où les cellules ont été exécutées**, pas dans l'ordre où elles apparaissent. Exécuter deux fois une cellule qui modifie une variable, ou en sauter une, donne un résultat que personne ne retrouvera en relisant le notebook de haut en bas.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "# cellule 1",
        "stock = 10",
        "",
        "# cellule 2 : on retire 3 livres prêtés",
        "stock = stock - 3",
        "print('après une exécution :', stock)",
        "",
        "# la même cellule 2, relancée par mégarde",
        "stock = stock - 3",
        "print('après deux exécutions :', stock)",
      ),
      caption: "Relue de haut en bas, la page dit 7 livres en stock ; le noyau, lui, en compte 4. Avant de partager un notebook, on le relance entièrement (« Restart and Run All ») pour vérifier qu'il donne bien ce qui est écrit.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Réécrivez la cellule pour qu'elle donne **le même résultat même exécutée plusieurs fois** : ne modifiez pas `stock_initial` (10, fourni), calculez plutôt le stock restant après 3 prêts dans une nouvelle variable `stock_restant`.",
      setup: "stock_initial = 10",
      starter: lines("stock_initial = stock_initial - 3", "stock_restant = stock_initial"),
      solution: lines("stock_restant = stock_initial - 3", "print(stock_initial, stock_restant)"),
      test: lines(
        "assert stock_initial == 10, f\"stock_initial ne doit pas changer (il vaut maintenant {stock_initial}) : sinon, relancer la cellule le diminue encore\"",
        "assert stock_restant == 7, f\"stock_restant doit valoir 10 - 3 = 7 (vous avez {stock_restant})\"",
      ),
      hint: "Une nouvelle variable : stock_restant = stock_initial - 3.",
    },
    {
      kind: "text",
      md: lines(
        "### Les commandes magiques",
        "",
        "Jupyter (plus précisément IPython, le noyau Python) ajoute des commandes qui commencent par `%` ou `%%`, et `!` pour lancer une commande du système. Elles ne sont pas du Python et ne fonctionnent que dans un notebook ou IPython :",
        "",
        "```python",
        "%timeit sum(range(1000))   # durée moyenne sur de nombreuses exécutions",
        "%%time                     # en tête de cellule : durée de toute la cellule",
        "%who                       # variables définies",
        "!python -m pip list        # commande du système",
        "```",
        "",
        "En Python ordinaire, le module `time` et le module `timeit` font le même travail, partout.",
      ),
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import time",
        "import timeit",
        "",
        "debut = time.perf_counter()",
        "total = sum(i * i for i in range(200_000))",
        "duree = time.perf_counter() - debut",
        "print(f'une exécution : {duree * 1000:.1f} ms')",
        "",
        "# timeit répète la mesure : plus fiable pour du code très court",
        "par_essai = timeit.timeit('sum(range(1000))', number=1000) / 1000",
        "print(f'sum(range(1000)) : {par_essai * 1e6:.1f} microsecondes en moyenne')",
      ),
      caption: "Les durées affichées dépendent de votre machine et de ce qu'elle fait au même moment : relancez l'exemple, elles varient. C'est pour cela qu'on répète une mesure avant de comparer deux méthodes.",
    },
    {
      kind: "text",
      md: `### Un notebook relisable et reproductible

- **Un texte pour chaque étape** : une cellule markdown dit ce que fait la suivante et pourquoi.
- **Des fonctions plutôt que des copier-coller** : le code répété devient une fonction, et le code réutilisé d'un notebook à l'autre va dans un fichier \`.py\` qu'on importe.
- **Des noms de fichiers ordonnés** : \`01_exploration.ipynb\`, \`02_nettoyage.ipynb\`...
- **L'environnement décrit** : un fichier \`requirements.txt\` (pip) ou \`environment.yml\` (conda) liste les bibliothèques et leurs versions.
- **Relancer tout avant de partager**, pour chasser l'état caché.
- **Avec Git**, les sorties enregistrées dans le \`.ipynb\` rendent les différences difficiles à lire : beaucoup de personnes effacent les sorties avant de valider, et des outils comme nbdime (comparaison de notebooks) ou jupytext (notebook enregistré aussi en \`.py\`) facilitent la relecture.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Au lieu de recopier les mêmes calculs dans plusieurs cellules, écrivez une fonction `resume(notes)` qui renvoie un **dictionnaire** avec les clés `'min'`, `'max'` et `'moyenne'` (arrondie à 2 décimales) d'une liste de notes.",
      starter: lines("def resume(notes):", "    return {'min': min(notes), 'max': max(notes)}"),
      solution: lines(
        "def resume(notes):",
        "    return {'min': min(notes), 'max': max(notes), 'moyenne': round(sum(notes) / len(notes), 2)}",
        "",
        "print(resume([12, 15, 9, 17]))",
      ),
      test: lines(
        "_r = resume([12, 15, 9, 17])",
        "assert isinstance(_r, dict), \"resume doit renvoyer un dictionnaire\"",
        "assert set(_r) == {'min', 'max', 'moyenne'}, f\"clés attendues : min, max, moyenne (vous avez {sorted(_r)})\"",
        "assert _r == {'min': 9, 'max': 17, 'moyenne': 13.25}, f\"pour [12, 15, 9, 17] on attend min 9, max 17, moyenne 13.25 (vous avez {_r})\"",
        "assert resume([10, 11, 11])['moyenne'] == 10.67, \"la moyenne doit être arrondie à 2 décimales\"",
      ),
      hint: "round(sum(notes) / len(notes), 2) donne la moyenne arrondie.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Les exemples de ce site ressemblent à des cellules : on modifie le code et on l'exécute sur place. Les prochains pas naturels : le cours « Fondamentaux des bases de données » pour SQL, puis les cours de statistiques appliquées et de machine learning supervisé, qui réutilisent NumPy, pandas et Matplotlib.",
    },
  ],
  quiz: [
    {
      question: "Qu'est-ce que le noyau (kernel) d'un notebook ?",
      options: [
        "Le fichier .ipynb",
        "Le processus Python qui exécute les cellules et garde les variables en mémoire",
        "Une extension de navigateur",
        "La première cellule du notebook",
      ],
      correct: 1,
      explanation: "Le noyau garde tout ce qui a été exécuté depuis son démarrage, dans l'ordre d'exécution : d'où l'état caché.",
    },
    {
      question: "Pourquoi relancer tout le notebook (« Restart and Run All ») avant de le partager ?",
      options: [
        "Pour qu'il s'ouvre plus vite",
        "Pour vérifier qu'il donne les résultats affichés quand on l'exécute de haut en bas, sans état caché",
        "Pour effacer le texte",
        "Ce n'est pas utile",
      ],
      correct: 1,
      explanation: "Des cellules exécutées dans le désordre ou plusieurs fois laissent des résultats impossibles à reproduire.",
    },
    {
      question: "Que fait %timeit ?",
      options: [
        "Il arrête une cellule trop longue",
        "Il mesure la durée d'une instruction en la répétant, dans IPython ou Jupyter seulement",
        "Il affiche l'heure",
        "Il installe une bibliothèque",
      ],
      correct: 1,
      explanation: "C'est une commande magique d'IPython ; en Python ordinaire, le module timeit fait le même travail.",
    },
  ],
};
