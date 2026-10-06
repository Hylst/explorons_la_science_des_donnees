import { lines } from "../lines";

/** Petits textes fictifs (thème : une médiathèque), écrits pour le cours ; aucun texte réel n'est repris */
export const DOCUMENTS = lines(
  "documents = [",
  "    'La médiathèque ouvre le samedi matin à neuf heures.',",
  "    'Le prêt de livres est gratuit pour les moins de dix-huit ans.',",
  "    'Un atelier de bande dessinée a lieu chaque mercredi après-midi.',",
  "    'Les livres numériques se réservent depuis le site de la médiathèque.',",
  "    'Le café de la médiathèque propose des boissons chaudes et des gâteaux.',",
  "    'Les ateliers pour enfants sont gratuits mais l inscription est obligatoire.',",
  "]",
);

/** Mots vides (stopwords) courants du français, liste courte et volontairement visible */
export const MOTS_VIDES = lines(
  "MOTS_VIDES = {'le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd', 'et', 'à', 'a', 'au', 'aux', 'en', 'pour', 'par',",
  "              'sur', 'dans', 'est', 'sont', 'se', 'ce', 'qui', 'que', 'mais', 'ou', 'ne', 'pas', 'je', 'il', 'elle', 'on', 'nous', 'vous'}",
);
