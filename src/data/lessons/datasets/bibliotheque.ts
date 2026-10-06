/**
 * Jeu de données du cours « Fondamentaux des bases de données » : le réseau de bibliothèques d'une petite ville.
 * Auteurs, titres et années de première publication sont réels ; les exemplaires, les adhérents et les emprunts
 * sont inventés pour l'exercice. Exécuté avant chaque exemple et chaque exercice (base vide à chaque exécution).
 */
export const BIBLIOTHEQUE_SETUP = `CREATE TABLE auteurs (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  pays TEXT NOT NULL
);
INSERT INTO auteurs (id, nom, pays) VALUES
  (1, 'Victor Hugo', 'France'),
  (2, 'Jules Verne', 'France'),
  (3, 'George Sand', 'France'),
  (4, 'Albert Camus', 'France'),
  (5, 'Marguerite Yourcenar', 'France'),
  (6, 'Amélie Nothomb', 'Belgique'),
  (7, 'Ahmadou Kourouma', 'Côte d''Ivoire'),
  (8, 'Dany Laferrière', 'Haïti'),
  (9, 'Mary Shelley', 'Royaume-Uni'),
  (10, 'Isaac Asimov', 'États-Unis');

CREATE TABLE livres (
  id INTEGER PRIMARY KEY,
  titre TEXT NOT NULL,
  auteur_id INTEGER NOT NULL REFERENCES auteurs(id),
  annee INTEGER NOT NULL,
  genre TEXT NOT NULL,
  exemplaires INTEGER NOT NULL DEFAULT 1
);
INSERT INTO livres (id, titre, auteur_id, annee, genre, exemplaires) VALUES
  (1, 'Notre-Dame de Paris', 1, 1831, 'roman historique', 2),
  (2, 'Les Misérables', 1, 1862, 'roman', 3),
  (3, 'Vingt mille lieues sous les mers', 2, 1870, 'aventure', 2),
  (4, 'Le Tour du monde en quatre-vingts jours', 2, 1872, 'aventure', 2),
  (5, 'La Mare au diable', 3, 1846, 'roman', 1),
  (6, 'L''Étranger', 4, 1942, 'roman', 4),
  (7, 'La Peste', 4, 1947, 'roman', 3),
  (8, 'Mémoires d''Hadrien', 5, 1951, 'roman historique', 1),
  (9, 'Stupeur et tremblements', 6, 1999, 'roman', 2),
  (10, 'Les Soleils des indépendances', 7, 1968, 'roman', 1),
  (11, 'L''Énigme du retour', 8, 2009, 'roman', 1),
  (12, 'Frankenstein', 9, 1818, 'science-fiction', 2),
  (13, 'Fondation', 10, 1951, 'science-fiction', 2);

CREATE TABLE adherents (
  id INTEGER PRIMARY KEY,
  prenom TEXT NOT NULL,
  ville TEXT NOT NULL,
  inscription TEXT NOT NULL
);
INSERT INTO adherents (id, prenom, ville, inscription) VALUES
  (1, 'Inès', 'Rennes', '2024-09-02'),
  (2, 'Malik', 'Rennes', '2025-01-15'),
  (3, 'Chloé', 'Vitré', '2025-03-20'),
  (4, 'Tom', 'Rennes', '2025-06-01'),
  (5, 'Awa', 'Fougères', '2025-11-08'),
  (6, 'Lucas', 'Vitré', '2026-02-12');

CREATE TABLE emprunts (
  id INTEGER PRIMARY KEY,
  livre_id INTEGER NOT NULL REFERENCES livres(id),
  adherent_id INTEGER NOT NULL REFERENCES adherents(id),
  date_emprunt TEXT NOT NULL,
  date_retour TEXT
);
INSERT INTO emprunts (id, livre_id, adherent_id, date_emprunt, date_retour) VALUES
  (1, 6, 1, '2026-01-05', '2026-01-19'),
  (2, 3, 2, '2026-01-07', '2026-01-28'),
  (3, 12, 1, '2026-01-20', '2026-02-03'),
  (4, 6, 3, '2026-02-01', '2026-02-20'),
  (5, 13, 4, '2026-02-03', '2026-02-24'),
  (6, 2, 2, '2026-02-10', NULL),
  (7, 7, 1, '2026-02-15', '2026-03-01'),
  (8, 9, 5, '2026-03-02', '2026-03-10'),
  (9, 13, 1, '2026-03-04', NULL),
  (10, 4, 3, '2026-03-05', '2026-03-25'),
  (11, 6, 4, '2026-03-12', NULL),
  (12, 10, 5, '2026-03-15', '2026-04-02'),
  (13, 1, 2, '2026-03-20', NULL),
  (14, 12, 3, '2026-04-01', NULL);`;
