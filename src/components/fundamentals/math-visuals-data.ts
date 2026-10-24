// Données des trois graphiques de MathVisualsSection, calculées ici et citées dans le texte de la section ;
// sans Recharts, pour que le texte puisse les afficher sans charger la bibliothèque de graphiques.
/** Nombre à la française (virgule décimale) */
export const fr = (value: number, digits = 2) => value.toFixed(digits).replace(".", ",");

// Régression linéaire : dix points FICTIFS ; la droite des moindres carrés et le R² sont calculés, pas écrits à la main
export const observations = [3, 4, 5, 7, 6, 9, 8, 11, 13, 14].map((y, i) => ({ x: i + 1, y }));
export const regression = (() => {
  const n = observations.length;
  const meanX = observations.reduce((s, p) => s + p.x, 0) / n;
  const meanY = observations.reduce((s, p) => s + p.y, 0) / n;
  const sxy = observations.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
  const sxx = observations.reduce((s, p) => s + (p.x - meanX) ** 2, 0);
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const ssRes = observations.reduce((s, p) => s + (p.y - (intercept + slope * p.x)) ** 2, 0);
  const ssTot = observations.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  return { slope, intercept, r2: 1 - ssRes / ssTot };
})();
export const regressionData = observations.map((p) => ({
  ...p,
  prediction: Math.round((regression.intercept + regression.slope * p.x) * 100) / 100,
}));

// Loi normale centrée réduite : densité f(x) = exp(-x²/2) / sqrt(2π), de -3 à 3 par pas de 0,3
export const normalDistributionData = Array.from({ length: 21 }, (_, i) => {
  const x = -3 + i * 0.3;
  const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2);
  return { x: x.toFixed(1), y: Number(y.toFixed(4)) };
});

// Mise à jour bayésienne : exemple d'un test médical FICTIF (prévalence 1 %, sensibilité 90 %, faux positifs 9 %).
// Chaque test positif multiplie les cotes (odds) par le rapport de vraisemblance 0,9 / 0,09 = 10.
// Les deux tests sont supposés indépendants entre eux, ce qui est une hypothèse forte en pratique.
export const probabilityData = (() => {
  const prevalence = 0.01;
  const likelihoodRatio = 0.9 / 0.09;
  const labels = ["Avant le test", "Après 1 test positif", "Après 2 tests positifs"];
  let odds = prevalence / (1 - prevalence);
  return labels.map((category) => {
    const value = Math.round((odds / (1 + odds)) * 1000) / 10;
    odds *= likelihoodRatio;
    return { category, value };
  });
})();
