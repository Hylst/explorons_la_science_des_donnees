/**
 * Natural Language Processing
 * Text analysis, language models and text-processing techniques
 */

import { GlossaryEntry } from './types';

export const nlpTerms: GlossaryEntry[] = [
  {
    term: "Analyse de sentiment (Sentiment Analysis)",
    description: `**L'art de décoder les émotions dans le texte !** L'analyse de sentiment est une technique de NLP qui détermine automatiquement l'attitude émotionnelle (positive, négative, neutre) exprimée dans un texte.

**🎯 Applications Concrètes :**
• **Réseaux sociaux** : Analyser l'opinion publique sur une marque
• **E-commerce** : Classifier les avis clients automatiquement
• **Finance** : Prédire les mouvements de marché via les news
• **Support client** : Prioriser les tickets selon l'urgence émotionnelle

**🔧 Approches Techniques :**
• **Lexicale** : Dictionnaires de mots positifs/négatifs
• **Machine Learning** : Classification supervisée (SVM, Naive Bayes)
• **Deep Learning** : RNN, LSTM, Transformers (BERT)
• **Hybride** : Combinaison de plusieurs méthodes

**💡 Défis Spécifiques :**
• Sarcasme et ironie
• Négations ("pas mal" vs "mal")
• Contexte culturel et linguistique
• Sentiments mixtes dans un même texte

L'analyse de sentiment transforme l'opinion subjective en données objectives exploitables !`,
    category: "nlp",
    icon: "Heart"
  },
  {
    term: "TF-IDF (Term Frequency-Inverse Document Frequency)",
    description: `**L'art de distinguer l'important du banal !** TF-IDF est une technique fondamentale qui identifie les termes vraiment significatifs en équilibrant leur fréquence locale avec leur rareté globale.

**🎯 Principe Fondamental :**
TF-IDF résout le paradoxe de la pertinence textuelle : comment identifier les mots qui caractérisent vraiment un document sans être noyés par les mots ultra-fréquents ("le", "de", "et") ou les mots ultra-rares ?

**🧮 Formule :**
**TF-IDF(t,d,D) = TF(t,d) × IDF(t,D)**

Où :
• **TF** = Fréquence du terme dans le document
• **IDF** = Inverse de la fréquence documentaire
• **t** = terme, **d** = document, **D** = corpus

**💡 Applications :**
• Recherche d'information et moteurs de recherche
• Classification de texte automatique
• Détection de plagiat et similarité documentaire
• Extraction de mots-clés pertinents
• Analyse de sentiment et opinion mining

**⚡ Avantages :**
• Simple à comprendre et implémenter
• Efficace computationnellement
• Résultats interprétables
• Baseline solide pour de nombreuses tâches

**⚠️ Limitations :**
• Ignore l'ordre des mots et le contexte sémantique
• Sensible à la taille du corpus
• Assume l'indépendance des termes
• Peut être dominé par des termes très spécifiques

**🔧 Bonnes Pratiques :**
• Préprocessing adapté (normalisation, suppression mots vides)
• Utilisation de n-grammes pour capturer le contexte
• Combinaison avec des embeddings pour la sémantique
• Filtrage par fréquence (min_df, max_df)

TF-IDF reste un **fondement essentiel** du NLP, combinant simplicité, efficacité et interprétabilité !`,
    category: "nlp",
    icon: "BarChart3"
  },
  {
    term: "N-grammes (N-grams)",
    description: `**Les séquences qui donnent du sens !** Les N-grammes sont des séquences contiguës de N éléments (mots, caractères) extraites d'un texte, capturant le contexte local et les patterns linguistiques.

**🔢 Types Principaux :**
• **Unigrammes (1-gram)** : Mots individuels ["chat", "mange"]
• **Bigrammes (2-gram)** : Paires de mots ["chat mange", "mange souris"]
• **Trigrammes (3-gram)** : Triplets ["le chat mange"]
• **N-grammes de caractères** : Séquences de caractères

**💻 Exemple Pratique :**
\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer

# Bigrammes de mots
vectorizer = CountVectorizer(ngram_range=(2, 2))
texts = ["le chat mange la souris"]
bigrammes = vectorizer.fit_transform(texts)
print(vectorizer.get_feature_names_out())
# ['chat mange', 'la souris', 'le chat', 'mange la']
\`\`\`

**🎯 Applications :**
• **Modèles de langue** : Prédiction du mot suivant
• **Détection de langue** : Patterns caractéristiques
• **Correction orthographique** : Séquences probables
• **Classification de texte** : Features contextuelles
• **Génération de texte** : Chaînes de Markov

**⚖️ Trade-offs :**
• **N faible** : Perte de contexte, mais généralisation
• **N élevé** : Contexte riche, mais sparsité et overfitting
• **Compromis optimal** : Généralement N=2 ou N=3

Les N-grammes transforment le texte brut en features structurées exploitables !`,
    category: "nlp",
    icon: "Link"
  }
];