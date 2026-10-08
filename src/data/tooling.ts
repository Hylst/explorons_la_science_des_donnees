import type { CourseQuizQuestion } from "@/components/courses/CourseQuizBlock";
import { lines } from "@/data/lessons/lines";

/**
 * Section « Outils du quotidien » de la page Programmation : Git, environnements Python, Docker.
 * Rien ne s'exécute dans le navigateur ici (ce sont des commandes du système) : le code est à lire.
 */
export interface ToolingBlock {
  id: string;
  title: string;
  md: string;
}

export const TOOLING_BLOCKS: ToolingBlock[] = [
  {
    id: "outils-git",
    title: "Git : garder l'historique de son travail",
    md: lines(
      "**Git** enregistre l'état d'un dossier de projet à des moments choisis (les *commits*). On peut revenir en arrière, comparer deux versions, travailler sur une idée à part (une *branche*) sans casser ce qui marche, et partager le projet sur une plateforme comme GitHub, GitLab ou Codeberg.",
      "",
      "Le cycle de tous les jours :",
      "",
      "```bash",
      "git init                       # une fois : le dossier devient un dépôt",
      "git status                     # ce qui a changé depuis le dernier commit",
      "git diff                       # le détail des changements",
      "git add analyse.py             # préparer un fichier pour le prochain commit",
      "git commit -m \"Nettoie les dates de prêt\"",
      "git log --oneline              # l'historique, un commit par ligne",
      "```",
      "",
      "Travailler sur une idée à part, puis l'intégrer :",
      "",
      "```bash",
      "git switch -c essai-regression   # crée la branche et s'y place",
      "# ... modifications, commits ...",
      "git switch main",
      "git merge essai-regression",
      "```",
      "",
      "Avec un dépôt distant : `git clone` pour le récupérer, `git pull` pour recevoir les changements des autres, `git push` pour envoyer les siens.",
      "",
      "**Bonnes habitudes** : des commits petits, avec un message qui dit ce qui change ; un commit qui fonctionne plutôt que dix à moitié ; relire `git diff` avant de valider.",
    ),
  },
  {
    id: "outils-gitignore",
    title: "Ce qui ne va pas dans Git",
    md: lines(
      "Un dépôt n'est pas une sauvegarde de tout le disque. On n'y met **jamais de secrets** (mots de passe, clés d'accès, fichier `.env`) : une fois poussés, ils restent dans l'historique même si on les efface ensuite. On évite aussi les gros fichiers de données et ce qui se régénère (environnements, caches).",
      "",
      "Le fichier `.gitignore`, à la racine du projet, liste ce que Git doit ignorer :",
      "",
      "```text",
      ".venv/",
      "__pycache__/",
      ".ipynb_checkpoints/",
      ".env",
      "data/brut/",
      "*.parquet",
      "```",
      "",
      "Pour versionner de gros jeux de données, des outils existent à côté de Git, comme Git LFS ou DVC. Pour les notebooks, voir le dernier module du cours Python : leurs sorties enregistrées rendent les différences difficiles à relire.",
    ),
  },
  {
    id: "outils-venv",
    title: "Un environnement par projet",
    md: lines(
      "Deux projets peuvent avoir besoin de versions différentes d'une même bibliothèque. Un **environnement virtuel** est un dossier qui contient sa propre copie de Python et ses propres bibliothèques : on en crée un par projet.",
      "",
      "Avec les outils fournis par Python (`venv` et `pip`) :",
      "",
      "```bash",
      "python -m venv .venv                 # crée l'environnement dans le dossier .venv",
      "source .venv/bin/activate            # l'active (macOS, Linux)",
      ".venv\\Scripts\\activate               # l'active (Windows)",
      "python -m pip install pandas scikit-learn",
      "python -m pip freeze > requirements.txt   # note les versions installées",
      "```",
      "",
      "Sur une autre machine, on recrée le même environnement avec `python -m pip install -r requirements.txt`.",
      "",
      "**Conda** (fourni par Anaconda ou Miniconda) gère à la fois Python et des bibliothèques qui ne sont pas écrites en Python :",
      "",
      "```bash",
      "conda create -n analyse python=3.12 pandas scikit-learn",
      "conda activate analyse",
      "conda env export > environment.yml   # pour recréer : conda env create -f environment.yml",
      "```",
      "",
      "D'autres outils (Poetry, uv, pipenv...) font le même travail avec plus de confort ; l'essentiel est d'en choisir un et de **décrire l'environnement dans un fichier versionné**.",
    ),
  },
  {
    id: "outils-docker",
    title: "Docker : emporter tout le système",
    md: lines(
      "Un environnement virtuel fixe les bibliothèques Python, pas le reste de la machine (système, bibliothèques C, outils). **Docker** emballe tout dans une *image* : un programme qui tourne dans une image tourne de la même façon sur un portable, un serveur ou le poste d'un collègue. Une image se décrit dans un fichier `Dockerfile` :",
      "",
      "```dockerfile",
      "FROM python:3.12-slim",
      "WORKDIR /app",
      "COPY requirements.txt .",
      "RUN pip install --no-cache-dir -r requirements.txt",
      "COPY . .",
      "CMD [\"python\", \"analyse.py\"]",
      "```",
      "",
      "```bash",
      "docker build -t analyse-prets .   # construit l'image",
      "docker run --rm analyse-prets      # lance un conteneur à partir de l'image",
      "```",
      "",
      "Docker n'est pas indispensable pour apprendre : il devient utile quand un projet doit tourner ailleurs que sur sa propre machine (un serveur, une démonstration, un modèle mis en service). Copier `requirements.txt` avant le reste du code permet à Docker de réutiliser l'étape d'installation tant que les dépendances ne changent pas.",
    ),
  },
];

export const TOOLING_QUIZ: CourseQuizQuestion[] = [
  {
    question: "Un fichier .env contenant une clé d'accès a été poussé sur un dépôt public, puis supprimé dans le commit suivant. La clé est-elle à l'abri ?",
    options: [
      "Oui, le fichier n'existe plus",
      "Non : elle reste dans l'historique ; il faut la révoquer et en créer une nouvelle",
      "Oui, si le dépôt a moins de 10 commits",
      "Oui, Git chiffre les fichiers .env",
    ],
    correct: 1,
    explanation: "Git garde tout l'historique. Une clé publiée est à considérer comme compromise : on la révoque. Le .gitignore sert à ne jamais en arriver là.",
  },
  {
    question: "À quoi sert un environnement virtuel ?",
    options: [
      "À accélérer Python",
      "À isoler les bibliothèques (et leurs versions) d'un projet de celles des autres projets",
      "À sauvegarder le code",
      "À exécuter Python dans le navigateur",
    ],
    correct: 1,
    explanation: "Chaque projet a ses propres versions ; le fichier requirements.txt ou environment.yml permet de recréer l'environnement ailleurs.",
  },
  {
    question: "Quelle commande crée une nouvelle branche et s'y place ?",
    options: ["git commit -b", "git switch -c nom-de-branche", "git push nom-de-branche", "git init nom-de-branche"],
    correct: 1,
    explanation: "git switch -c crée la branche et la sélectionne (l'ancienne écriture git checkout -b fait la même chose).",
  },
  {
    question: "Que fixe Docker qu'un environnement virtuel ne fixe pas ?",
    options: [
      "La version des bibliothèques Python",
      "Le reste du système : système d'exploitation, bibliothèques non Python, outils",
      "Le contenu des données",
      "Rien de plus",
    ],
    correct: 1,
    explanation: "Une image Docker contient tout ce qui est nécessaire pour exécuter le programme, pas seulement les paquets Python.",
  },
];
