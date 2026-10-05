# Modules Python 4 à 7 - Structure et Contenu (fichier historiquement nommé « 4-8 »)

> Le cours n'a que 7 modules : la version précédente de ce document décrivait un plan (POO, fichiers et exceptions, structures de données avancées, réseau, bases de données) qui n'a jamais été implémenté. Ce document décrit ce qui existe dans le code.

Le cours « Bases de Python » est la page `src/pages/courses/programming/PythonBasics.tsx` (route `/courses/programming/python-basics`). Chaque module est un composant de `src/components/courses/python/`, affiché dans un bloc repliable de la page. Les schémas interactifs communs sont dans `PythonInteractiveSchemas.tsx`.

| Module | Composant | Niveau affiché | Durée affichée |
|---|---|---|---|
| 1. Fondamentaux Python | `PythonModule1.tsx` | voir la page | voir la page |
| 2. Structures de contrôle | `PythonModule2.tsx` | voir la page | voir la page |
| 3. Fonctions et modules | `PythonModule3.tsx` | voir la page | voir la page |
| 4. NumPy - Calcul numérique | `PythonModule4.tsx` | Intermédiaire | 4h |
| 5. Pandas - Manipulation de données | `PythonModule5.tsx` | Intermédiaire | 5h |
| 6. Matplotlib - Visualisation | `PythonModule6.tsx` | Intermédiaire | 4h |
| 7. Jupyter Notebook | `PythonModule7.tsx` | Débutant | 3h |

Les modules 1 à 3 reçoivent `isOpen` / `onToggle` (état géré par la page) ; les modules 4 à 7 ne prennent aucune prop.

## Module 4 : NumPy

- Installation, création d'arrays (méthodes de création), opérations sur matrices, gestion des valeurs manquantes (NaN)
- Exercices pratiques et schémas interactifs

## Module 5 : Pandas

- Installation, `Series` (array 1D avec index), `DataFrame` (table 2D)
- Exemples sur des données de ventes et une simulation e-commerce
- Projets pratiques

## Module 6 : Matplotlib

- Graphiques linéaires, de dispersion (scatter), en barres (verticales, horizontales, groupées), distributions, matrice de corrélation, camemberts, styles, sous-graphiques
- Projets de visualisation

## Module 7 : Jupyter Notebook

- Installation via pip, interface du notebook, types de cellules, configuration Jupyter, conversion avec `nbconvert`
- Projets Jupyter

## Notes

- Les extraits de code sont affichés à titre pédagogique ; l'« exécution » dans l'éditeur du site reste simulée.
- Aucun module 8, aucun projet final « système de gestion de bibliothèque », aucune certification ni notation n'existent dans le code.
- La progression (modules terminés, notes) est locale au navigateur : voir `src/hooks/use-course-progress.ts`.
