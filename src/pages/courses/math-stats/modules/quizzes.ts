import type { CourseQuizQuestion } from '@/components/courses/CourseQuizBlock';

/** Questions d'auto-évaluation de fin de module du cours « Introduction aux mathématiques » */

export const introductionQuiz: CourseQuizQuestion[] = [
  {
    question: "Quel est le principal avantage des mathématiques en data science ?",
    options: [
      "Rendre les calculs plus rapides",
      "Comprendre et optimiser les algorithmes",
      "Impressionner les collègues",
      "Compliquer les choses inutilement"
    ],
    correct: 1,
    explanation: "Les mathématiques permettent de comprendre le fonctionnement interne des algorithmes, d'optimiser leurs performances et de diagnostiquer les problèmes."
  },
  {
    question: "Quelle branche des mathématiques permet de modéliser l'incertitude ?",
    options: [
      "La théorie des ensembles seule",
      "Les probabilités et les statistiques",
      "La géométrie euclidienne",
      "L'arithmétique modulaire"
    ],
    correct: 1,
    explanation: "Les probabilités décrivent l'incertitude et les statistiques permettent de l'estimer à partir des données : c'est la base de l'inférence et des tests."
  },
  {
    question: "Dans l'exemple du prix d'une maison, quel type de modèle relie le prix à la surface et au nombre de chambres ?",
    options: [
      "Une régression linéaire multiple",
      "Un arbre de décision uniquement",
      "Un diagramme de Venn",
      "Une intégrale double"
    ],
    correct: 0,
    explanation: "Le prix est modélisé comme une combinaison linéaire des variables explicatives, dont les coefficients sont estimés par les moindres carrés."
  }
];

export const nombresEnsemblesQuiz: CourseQuizQuestion[] = [
  {
    question: "Soit A = {1, 2, 3, 4} et B = {3, 4, 5}. Que vaut A ∩ B ?",
    options: ["{3, 4}", "{1, 2, 3, 4, 5}", "{1, 2}", "{5}"],
    correct: 0,
    explanation: "L'intersection contient les éléments présents à la fois dans A et dans B : 3 et 4."
  },
  {
    question: "Quel est le plus petit de ces ensembles de nombres qui contienne √2 ?",
    options: ["ℤ (entiers relatifs)", "ℚ (rationnels)", "ℝ (réels)", "ℂ (complexes)"],
    correct: 2,
    explanation: "√2 est irrationnel : il n'appartient ni à ℤ ni à ℚ. ℝ le contient, et ℂ aussi, mais ℝ est le plus petit des deux."
  },
  {
    question: "Pourquoi les ensembles d'entraînement et de test d'un modèle doivent-ils être disjoints ?",
    options: [
      "Pour que le modèle s'entraîne plus vite",
      "Pour que l'évaluation porte sur des données jamais vues, sans fuite de données",
      "Pour avoir exactement autant de lignes dans chaque ensemble",
      "Pour éviter d'utiliser des nombres réels"
    ],
    correct: 1,
    explanation: "Si leur intersection n'est pas vide, le modèle est évalué sur des exemples qu'il a déjà vus : le score est alors trop optimiste (fuite de données)."
  }
];

export const fonctionsQuiz: CourseQuizQuestion[] = [
  {
    question: "Quelle fonction transforme n'importe quel réel en une valeur strictement comprise entre 0 et 1, interprétable comme une probabilité ?",
    options: ["ReLU", "La sigmoïde", "La fonction linéaire f(x) = ax + b", "tanh"],
    correct: 1,
    explanation: "La sigmoïde σ(x) = 1 / (1 + e⁻ˣ) reste dans ]0, 1[. tanh varie dans ]−1, 1[ et la ReLU n'est pas bornée."
  },
  {
    question: "Que vaut σ(0), avec σ(x) = 1 / (1 + e⁻ˣ) ?",
    options: ["0", "0,5", "1", "e"],
    correct: 1,
    explanation: "σ(0) = 1 / (1 + e⁰) = 1 / 2 : c'est le point où le modèle est parfaitement indécis."
  },
  {
    question: "Soit f(x) = 2x + 1 et g(x) = x². Que vaut (f ∘ g)(3) = f(g(3)) ?",
    options: ["19", "49", "16", "7"],
    correct: 0,
    explanation: "On calcule d'abord g(3) = 9, puis f(9) = 2 × 9 + 1 = 19. L'ordre compte : g(f(3)) = g(7) = 49."
  }
];

export const calculDifferentielQuiz: CourseQuizQuestion[] = [
  {
    question: "Quelle est la dérivée de f(x) = x³ au point x = 2 ?",
    options: ["6", "8", "12", "3"],
    correct: 2,
    explanation: "f′(x) = 3x², donc f′(2) = 3 × 4 = 12."
  },
  {
    question: "Que dit la règle du produit pour (f · g)′ ?",
    options: ["f′ · g′", "f′ · g + f · g′", "f′ + g′", "f′ · g − f · g′"],
    correct: 1,
    explanation: "La dérivée d'un produit est f′g + fg′ : on dérive chaque facteur à tour de rôle, l'autre restant inchangé."
  },
  {
    question: "Dans la descente de gradient θ ← θ − α · ∂J/∂θ, que risque-t-il d'arriver si le taux d'apprentissage α est beaucoup trop grand ?",
    options: [
      "L'algorithme converge toujours plus vite",
      "L'algorithme peut osciller autour du minimum, voire diverger",
      "Le gradient devient automatiquement nul",
      "L'algorithme s'arrête immédiatement"
    ],
    correct: 1,
    explanation: "Avec des pas trop grands, on saute par-dessus le minimum d'un côté puis de l'autre, et le coût peut même augmenter à chaque itération."
  }
];

export const calculIntegralQuiz: CourseQuizQuestion[] = [
  {
    question: "Que vaut l'intégrale ∫₀¹ 2x dx ?",
    options: ["0", "1", "2", "1/2"],
    correct: 1,
    explanation: "Une primitive de 2x est F(x) = x². Donc ∫₀¹ 2x dx = F(1) − F(0) = 1 − 0 = 1."
  },
  {
    question: "Pour une densité de probabilité f, que vaut ∫ f(x) dx sur tout ℝ ?",
    options: ["0", "1", "La moyenne de X", "L'écart-type de X"],
    correct: 1,
    explanation: "La probabilité totale vaut 1 : c'est la condition qui fait de f une densité (avec f ≥ 0)."
  },
  {
    question: "Si F est une primitive de f (F′ = f), que vaut ∫ₐᵇ f(x) dx ?",
    options: ["F(a) − F(b)", "F(b) + F(a)", "F(b) − F(a)", "f(b) − f(a)"],
    correct: 2,
    explanation: "C'est le théorème fondamental du calcul : l'intégrale se calcule à partir d'une primitive, F(b) − F(a)."
  }
];
