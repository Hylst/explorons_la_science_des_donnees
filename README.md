# Explorons la Data Science

Site éducatif en français sur la data science : cours, quiz, glossaire, projets, ressources et blog, avec un éditeur de code qui exécute Python, SQL et JavaScript dans le navigateur. Le projet s'appelait auparavant « Data Science Explorer » (le dépôt et le sous-chemin de déploiement `/data_science_explorer/` gardent ce nom).

Auteur : Geoffroy Streit, avec assistance IA. Adresse de déploiement prévue : [hylst.fr/data_science_explorer/](https://hylst.fr/data_science_explorer/) (plateforme de l'auteur). Licence : [AGPL-3.0-or-later](LICENSE).

## Ce que c'est, et ce que ce n'est pas

Une application web **100 % statique** (React 18, TypeScript, Vite) : pas de serveur applicatif, pas de base de données, pas de compte, pas de cookie, pas de mesure d'audience, et aucun service externe. Le code de l'application ne contacte aucune API : il ne charge que des fichiers du site lui-même, moteurs d'exécution compris (ni police, ni script, ni image tiers). La progression, les notes, les résultats de quiz, les favoris et le code de l'éditeur restent dans le `localStorage` du navigateur. Rien n'est partagé entre appareils.

Le contenu, avec les nombres comptés dans le code :

- **Introduction** et **Fondamentaux** : mathématiques et statistiques (6 cours avec formules et graphiques), programmation, préparation des données, bases de données.
- **Machine Learning** : apprentissage supervisé, non supervisé, par renforcement, deep learning, évaluation.
- **10 cours** sous `/courses/` : 5 sont rédigés (Python, introduction aux mathématiques, statistiques inférentielles, guide des modèles, Transformers) ; 5 ne sont encore que des plans de modules, avec suivi et notes mais sans leçon (statistiques appliquées, bases de données, visualisation, ML supervisé, NLP).
- **165 questions de quiz** en 8 catégories, avec explications, historique et statistiques calculés localement.
- **179 termes de glossaire**, aussi consultables par survol dans les cours.
- **10 projets** : des énoncés à réaliser soi-même, sans jeu de données ni corrigé.
- **5 articles de blog**, des ressources externes sélectionnées, et une page Communauté dont les actualités sont un **instantané daté** de flux RSS publics (pas un flux en direct).
- **Exécution de code réelle** : Python (Pyodide : NumPy, pandas, scikit-learn), SQL (SQLite via sql.js) et JavaScript (iframe isolée, sans réseau). Pas de Matplotlib. Les moteurs, environ 39 Mo, sont servis par le site lui-même et mis en cache.
- **Application installable** (PWA), utilisable hors ligne pour les pages et moteurs déjà chargés ; thème clair, sombre ou celui de l'appareil.

Le détail, avec l'état de chaque fonction (disponible, partiel, à venir) et les limites connues, est dans [features.md](features.md).

## Démarrage rapide

Prérequis : Node.js 22.13 ou plus récent, 24 ou 26 (champ `engines` de `package.json` : contrainte la plus stricte parmi Vite 7, Vitest 5 et jsdom 29 ; testé avec Node 24).

```bash
npm install
npm run dev          # http://localhost:8080
```

Au premier `npm run dev` ou `npm run build`, le script `runtimes:sync` prépare `public/vendor` (Pyodide, sql.js) : il télécharge des paquets Python vérifiés par SHA-256 et a donc besoin du réseau cette fois-là.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement (port 8080) |
| `npm run build` | build de production dans `dist/` |
| `npm run build:dev` | build en mode développement |
| `npm run build:hylst` | build pour hylst.fr dans `dist-hylst/` : base `/data_science_explorer/`, une page HTML par route, redirections, sitemap, `404.html`, puis contrôle automatique de la sortie |
| `npm run preview` | sert le dernier build |
| `npm run typecheck` | vérification TypeScript stricte (le build ne vérifie pas les types) |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:watch` | tests Vitest |
| `npm run runtimes:sync` | (re)prépare `public/vendor` ; lancé automatiquement avant `dev` et les builds |
| `npm run news:refresh` | réécrit `src/data/rss-articles.json` à partir des flux de `src/data/rss-sources.json` |
| `npm run verify:dist` / `npm run verify:hylst` | contrôle d'un dossier de build (`verify:hylst` suit `build:hylst` automatiquement) |

Avant une livraison : `npm run typecheck`, `npm run lint`, `npm test`, `npm run news:refresh`, puis `npm run build:hylst`. Le guide du développeur ([readme_dev.md](readme_dev.md)) détaille les étapes de livraison.

## Documentation

| Fichier | Contenu |
| --- | --- |
| [features.md](features.md) | fonctionnalités par section, état de chacune, nombres comptés, limites connues |
| [structure.md](structure.md) | organisation du dépôt, routage, build statique, exécution de code, PWA, thème, stockage local |
| [readme_dev.md](readme_dev.md) | guide pour développer : commandes, ajout de contenu, changement d'identité, livraison |
| [docs/SOURCES.md](docs/SOURCES.md) | vérification des chiffres externes affichés sur le site |
| [CHANGELOG.md](CHANGELOG.md) | historique des changements |
| [LICENSE](LICENSE) | licence AGPL-3.0-or-later et exceptions (images, moteurs d'exécution tiers) |

## Technologies

React 18, TypeScript, Vite 7 (plugin SWC), Tailwind CSS 3, shadcn/ui (Radix), React Router 7, KaTeX, Recharts, DOMPurify, Pyodide, sql.js, Vitest. Les composants tiers embarqués dans le site publié sont listés dans `vendor/NOTICE.txt`, généré par `scripts/sync-runtimes.mjs`.

## Contribuer

1. Créer une branche depuis `main`.
2. Respecter les conventions du code voisin ; ne jamais afficher de chiffre inventé (étudiants, notes, avis, statistiques de fréquentation).
3. Lancer `npm run typecheck`, `npm run lint` et `npm test` (zéro erreur attendue).
4. Vérifier la mise en page à 390, 768 et 1280 px (aucun défilement horizontal de la page).
5. Ouvrir une Pull Request.

## Licence

Code et contenus rédigés pour le site : [GNU AGPL v3 ou ultérieure](LICENSE) (SPDX : `AGPL-3.0-or-later`). Exceptions : les logos de `public/img/logos/` appartiennent à leurs détenteurs, et les moteurs d'exécution (Pyodide, NumPy, pandas, SciPy, scikit-learn, SQLite, sql.js) comme les bibliothèques npm gardent leur propre licence.

## Contact

Voir la page Contact du site : le formulaire prépare un e-mail dans votre messagerie, il n'envoie rien lui-même.
