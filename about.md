# À propos d'Explorons la Data Science

Texte de référence de la page « À propos » (`src/pages/About.tsx`). Le site s'appelait « Data Science Explorer » à l'origine ; il se nomme « Explorons la Data Science » depuis le 1er octobre 2026 (le nom vit dans `src/config/site.ts`). En cas d'écart entre ce fichier et la page, le code fait foi.

## Qu'est-ce qu'Explorons la Data Science ?

Explorons la Data Science est un projet personnel et éducatif créé par Geoffroy Streit, passionné de data science actuellement en apprentissage. Ce site web interactif a été développé comme un moyen de structurer et consolider mes connaissances tout en les partageant gratuitement avec la communauté francophone. Il est réalisé par Geoffroy Streit avec assistance IA, comme tous les sites de la plateforme hylst.fr.

C'est un site 100 % statique : il n'y a ni compte, ni serveur applicatif, ni cookie, ni mesure d'audience. Votre progression, vos notes, vos résultats de quiz et le code que vous écrivez restent dans votre navigateur et ne sont envoyés nulle part.

## Mission

Ma mission est de rendre la Data Science accessible aux francophones en proposant un contenu structuré et progressif. En tant qu'apprenant, je comprends les défis rencontrés lors de l'apprentissage de concepts complexes, c'est pourquoi je m'efforce de présenter l'information de manière claire et accessible.

## Fonctionnalités principales

### Parcours d'apprentissage
- **Introduction** : définition, histoire, piliers, cycle de vie d'un projet, applications, métiers
- **Fondamentaux** : mathématiques et statistiques (six pages : probabilités, statistiques descriptives, algèbre linéaire, calcul différentiel, statistiques avancées, calcul intégral), programmation, préparation des données, bases de données
- **Machine Learning** : apprentissage supervisé, non supervisé et par renforcement, évaluation des modèles, deep learning, exercices
- **Outils** : langages, traitement des données, frameworks de machine learning, visualisation
- **Cours** : dix cours rédigés sous `/courses/` (Python pour la data science, introduction aux mathématiques, statistiques inférentielles, statistiques appliquées, fondamentaux des bases de données, visualisation de données, machine learning supervisé, guide des modèles de ML, Transformers, traitement du langage naturel). Chaque cours est une suite de modules avec objectifs, exemples modifiables exécutés dans le navigateur, exercices vérifiés par le moteur, quiz de fin de module, progression et notes gardées dans le navigateur
- **Projets** : douze sujets classés par niveau ; cinq sont guidés pas à pas (analyse exploratoire de ventes, classification des iris, analyse de sentiment, segmentation de clients, prévision d'une fréquentation en série temporelle), avec jeu de données, exercices vérifiés et corrigés ; les sept autres sont des sujets à réaliser soi-même, sans énoncé détaillé, jeu de données ni corrigé

### Contenu et exercices
- Quiz de data science par thème, avec explications des réponses ; score et historique gardés dans le navigateur
- Glossaire : recherche et définitions courtes (au survol) ou détaillées (au clic), reprises dans le texte des cours
- Éditeur de code qui exécute réellement Python (NumPy, pandas, scikit-learn, Matplotlib), SQL (SQLite) et JavaScript dans le navigateur, sans envoyer le code à un serveur ; les figures Matplotlib s'affichent sous l'exemple
- Visualisations et laboratoires interactifs (tangente, descente de gradient, statistiques descriptives, matrice de corrélation calculée sur des jeux d'exemple)
- Sélection de ressources, blog, et rubrique Communauté (liens vers des forums, événements et comptes réels, avec un instantané daté d'actualités issues de flux RSS)
- Les chiffres qui décrivent le monde réel citent leur source et leur date de consultation ; les estimations personnelles sont signalées comme telles

### Interface
- Mode clair, sombre ou celui de l'appareil
- Application installable et utilisable hors ligne (PWA), interface adaptée au mobile
- Navigation par rubriques, barre latérale de sections dans chaque page

### Sections qui restent à enrichir
- **Projets** : les sept sujets non guidés n'ont ni énoncé détaillé, ni jeu de données, ni corrigé (certains demandent des bibliothèques que le navigateur ne fournit pas, comme TensorFlow ou Streamlit)
- **Visualisation** : Seaborn, Plotly, Altair et D3.js sont présentés en code à lire ; seul Matplotlib s'exécute dans le navigateur
- **Préparation des données** : le cycle complet est en ligne (collecte, audit, nettoyage, transformation, exploration visuelle, validation, automatisation) ; quelques démonstrations (rapport de validation, tableau de bord de monitoring, cas pratique hospitalier) utilisent des chiffres fictifs, signalés comme tels

## Technologies utilisées

J'ai choisi des technologies modernes que j'apprends et maîtrise progressivement :

### Frontend
- **React 18** avec **TypeScript** (mode strict) pour une interface interactive
- **Tailwind CSS** pour un design responsive, avec un thème clair et un thème sombre
- **shadcn/ui** (composants Radix) intégrés et personnalisés, et **Lucide React** pour les icônes
- **KaTeX** pour afficher les équations mathématiques, **Recharts** pour les graphiques
- **Pyodide** (Python) et **sql.js** (SQLite) compilés en WebAssembly pour exécuter le code dans le navigateur (environ 48 Mo, téléchargés à la première exécution de code) ; le JavaScript s'exécute dans un cadre isolé

### Outils de développement
- **Vite** pour un développement et un build rapides
- **React Router** pour la navigation, **React Helmet** pour les titres et descriptions de chaque page
- **ESLint**, **TypeScript** et **Vitest** pour la qualité du code
- **DOMPurify** pour nettoyer le HTML injecté

## Architecture du projet

J'organise le code de manière modulaire en apprenant les bonnes pratiques :
- Composants réutilisables que je développe et optimise progressivement (briques de cours, encadrés, quiz, figures)
- Contenu piloté par des données (`src/data/` : glossaire, quiz, projets, blog) ; les dix cours et les projets guidés sont eux-mêmes des données (`src/data/lessons/`), affichées par un seul jeu de composants, et leurs tests exécutent chaque exemple et chaque corrigé sur les vrais moteurs
- Séparation entre logique (`src/lib/`, `src/hooks/`) et interface
- Gestion d'état avec les hooks React ; stockage local isolé dans `src/lib/storage.ts`
- Description détaillée dans `structure.md`

## Public cible

Ce site s'adresse principalement à :

- **Étudiants** qui découvrent la Data Science
- **Professionnels** en reconversion ou en évolution de poste (mon parcours : ingénieur, développeur d'applications, plus de 20 ans de commerce et de gestion, puis autodidacte en data science / IA / ML / Python depuis plus de deux ans)
- **Développeurs** qui souhaitent explorer ce domaine
- **Autodidactes** qui apprennent par passion
- **Francophones** cherchant du contenu accessible dans leur langue

## Mon approche pédagogique

En tant qu'apprenant, j'adopte une méthode qui me semble efficace :

- **Apprentissage progressif** : Je structure le contenu selon ma propre progression
- **Exemples concrets** : J'utilise des cas que j'ai rencontrés ou expérimentés
- **Simplicité** : J'explique avec mes propres mots, sans jargon inutile
- **Partage d'expérience** : Je documente mes découvertes et difficultés
- **Mise à jour continue** : J'enrichis le contenu au fur et à mesure de mon apprentissage

## Évolution du projet

Ce projet évolue avec mon parcours d'apprentissage :

- Ajout de contenu au rythme de mes découvertes
- Amélioration de l'interface selon mes compétences techniques
- Intégration de nouvelles fonctionnalités que j'apprends à développer
- Expansion vers les domaines que j'explore
- Correction et amélioration basées sur mes propres erreurs

Le suivi des travaux restants se fait dans les tickets (issues) du dépôt.

## Paternité et licence

- Réalisé par Geoffroy Streit avec assistance IA, comme tous les sites de la plateforme [hylst.fr](https://hylst.fr/)
- Le code et les contenus rédigés pour le site sont publiés sous licence **GNU AGPL v3 ou ultérieure** (AGPL-3.0-or-later) ; le texte est publié avec le site (`LICENSE.txt`). Le dépôt était auparavant sous licence MIT
- Les moteurs Python et SQL embarqués (Pyodide, CPython, NumPy, pandas, SciPy, scikit-learn, SQLite, sql.js) gardent leurs licences propres, listées dans l'inventaire `vendor/NOTICE.txt`
- Les illustrations animées de l'accueil (`public/svg/cards/`) sont dessinées pour le site et suivent la même licence ; les logos sont des marques de leurs détenteurs : voir `public/img/CREDITS.md`

## Contribuer et échanger

Bien que ce soit un projet personnel, je suis ouvert aux échanges :

- **Suggestions** : Vos idées pour améliorer le contenu
- **Corrections** : Signaler les erreurs que vous pourriez remarquer
- **Partage d'expérience** : Échanger sur nos parcours d'apprentissage
- **Feedback** : Vos retours sur l'utilité du contenu
- **Questions** : N'hésitez pas à me contacter pour discuter

Le site n'ayant pas de serveur, la page Contact prépare un e-mail (lien `mailto:`) que vous envoyez vous-même depuis votre messagerie : le message ne part pas du site.

Ce site est avant tout un outil d'apprentissage partagé, créé par un passionné pour d'autres passionnés.

---

*Explorons la Data Science : apprendre la data science en français, pas à pas.*
