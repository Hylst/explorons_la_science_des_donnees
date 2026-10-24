import { lines } from "../lines";

/**
 * Images du cours de vision par ordinateur : les chiffres manuscrits fournis avec scikit-learn (load_digits, rien n'est
 * téléchargé). 1 797 images de 8 x 8 pixels, niveaux de gris entiers de 0 à 16, 174 à 183 images par chiffre ; d'après
 * la description jointe (load_digits().DESCR) : copie de la partie test du jeu « Optical Recognition of Handwritten
 * Digits » de l'UCI (E. Alpaydin, 1998), chiffres de 13 personnes, image de 32 x 32 points découpée en blocs de 4 x 4 dont
 * on compte les points noirs (d'où 0 à 16). Source dans docs/SOURCES.md.
 * Vérifié le 24 octobre 2026 avec scikit-learn de Pyodide 314.0.7.
 */

/** `chiffres` (le jeu complet), `images` (1797, 8, 8) ramenées entre 0 et 1, `y` (le chiffre de chaque image) */
export const CHIFFRES = lines(
  "import numpy as np",
  "from sklearn.datasets import load_digits",
  "",
  "chiffres = load_digits()",
  "images = chiffres.images / 16.0",
  "y = chiffres.target",
);

/**
 * Découpage commun aux modules qui entraînent un modèle : `X` (une ligne de 64 pixels par image), puis 75 % pour
 * apprendre et 25 % (450 images) pour évaluer, mêmes proportions de chaque chiffre des deux côtés.
 */
export const DECOUPAGE = lines(
  CHIFFRES,
  "from sklearn.model_selection import train_test_split",
  "",
  "X = images.reshape(len(images), -1)",
  "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
);
