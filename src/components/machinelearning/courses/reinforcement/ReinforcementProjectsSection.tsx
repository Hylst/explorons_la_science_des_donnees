
import ProjectsSection from "../shared/ProjectsSection";

const projects = [
  {
    title: "🎮 Agent de jeu : tic-tac-toe avec Q-Learning",
    description: "Un agent qui apprend à jouer au tic-tac-toe par Q-Learning, en jouant contre un adversaire aléatoire.",
    problem: "Implémentez un agent Q-Learning qui apprend à jouer au tic-tac-toe en affrontant un adversaire aléatoire, puis mesurez ses résultats sans exploration. Allez ensuite plus loin : entraînez-le contre lui-même (self-play) ou contre un adversaire minimax pour approcher le jeu optimal, et, si vous le souhaitez, ajoutez une interface graphique pour jouer contre lui. (La solution fournie couvre l'environnement, l'agent, l'entraînement et l'évaluation, pas l'interface.)",
    solution: `# Agent Q-Learning pour le tic-tac-toe (solution partielle)
# Contenu : environnement, agent, entraînement contre un adversaire aléatoire, évaluation.
# Reste à écrire : l'interface graphique (par exemple avec Tkinter) pour jouer contre l'agent.
# Limite : l'agent apprend à battre un adversaire aléatoire, pas à jouer de façon optimale. Pour s'en
# approcher, entraînez-le contre lui-même (self-play) ou contre un adversaire minimax.
# Prérequis : pip install numpy
import numpy as np
import random
from collections import defaultdict

class TicTacToeEnvironment:
    def __init__(self):
        self.reset()

    def reset(self):
        self.board = np.zeros((3, 3), dtype=int)
        self.current_player = 1
        return self.get_state()

    def get_state(self):
        return tuple(self.board.flatten())

    def get_valid_actions(self):
        return [(i, j) for i in range(3) for j in range(3) if self.board[i, j] == 0]

    def step(self, action):
        if action not in self.get_valid_actions():
            return self.get_state(), -10, True  # Invalid move penalty

        row, col = action
        self.board[row, col] = self.current_player

        # Check for win
        if self.check_winner(self.current_player):
            reward = 10 if self.current_player == 1 else -10
            return self.get_state(), reward, True

        # Check for draw
        if len(self.get_valid_actions()) == 0:
            return self.get_state(), 0, True

        # Switch player
        self.current_player = -self.current_player
        return self.get_state(), 0, False

    def check_winner(self, player):
        # Check rows, columns, and diagonals
        for i in range(3):
            if all(self.board[i, :] == player) or all(self.board[:, i] == player):
                return True
        if all(np.diag(self.board) == player) or all(np.diag(np.fliplr(self.board)) == player):
            return True
        return False

class QLearningAgent:
    def __init__(self, alpha=0.1, gamma=0.9, epsilon=0.1):
        self.q_table = defaultdict(lambda: defaultdict(float))
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon

    def get_action(self, state, valid_actions, training=True):
        if training and random.random() < self.epsilon:
            return random.choice(valid_actions)

        if state not in self.q_table:
            return random.choice(valid_actions)

        best_action = max(valid_actions, key=lambda a: self.q_table[state][a])
        return best_action

    def update_q_value(self, state, action, reward, next_state, valid_next_actions):
        current_q = self.q_table[state][action]
        if valid_next_actions:
            max_next_q = max(self.q_table[next_state][a] for a in valid_next_actions)
        else:
            max_next_q = 0

        new_q = current_q + self.alpha * (reward + self.gamma * max_next_q - current_q)
        self.q_table[state][action] = new_q

# Training loop
def train_agent(episodes=10000):
    env = TicTacToeEnvironment()
    agent = QLearningAgent()
    wins = 0

    for episode in range(episodes):
        state = env.reset()
        done = False

        while not done:
            # Coup de l'agent
            action = agent.get_action(state, env.get_valid_actions())
            next_state, reward, done = env.step(action)

            # Réponse de l'adversaire aléatoire : elle fait partie de la transition vue par l'agent
            # (une défaite arrive comme récompense négative sur le coup précédent de l'agent)
            if not done:
                opponent_action = random.choice(env.get_valid_actions())
                next_state, opponent_reward, done = env.step(opponent_action)
                reward += opponent_reward

            # Pas d'action possible après une fin de partie : la valeur future est nulle
            next_actions = [] if done else env.get_valid_actions()
            agent.update_q_value(state, action, reward, next_state, next_actions)
            state = next_state

        # Track wins
        if env.check_winner(1):
            wins += 1

        if episode % 1000 == 0:
            win_rate = wins / (episode + 1)
            print(f"Épisode {episode}, taux de victoire cumulé (exploration comprise) : {win_rate:.3f}")

    return agent

def evaluer(agent, parties=1000):
    """Parties sans exploration contre un adversaire aléatoire (l'agent joue toujours en premier)."""
    env = TicTacToeEnvironment()
    victoires = nuls = 0
    for _ in range(parties):
        state = env.reset()
        done = False
        while not done:
            action = agent.get_action(state, env.get_valid_actions(), training=False)
            state, _, done = env.step(action)
            if not done:
                state, _, done = env.step(random.choice(env.get_valid_actions()))
        if env.check_winner(1):
            victoires += 1
        elif not env.check_winner(-1):
            nuls += 1
    print(f"Évaluation sur {parties} parties : {victoires} victoires, {nuls} nuls, "
          f"{parties - victoires - nuls} défaites")

# Entraîner puis évaluer l'agent
random.seed(0)  # reproductibilité
trained_agent = train_agent()
evaluer(trained_agent)`,
    hints: [
      "Commencez par implémenter l'environnement de jeu avec les règles de base",
      "Utilisez une représentation d'état simple (tuple des cases du plateau)",
      "Implémentez Q-Learning avec une exploration epsilon-greedy",
      "Contre un adversaire aléatoire l'agent apprend à le battre, pas à jouer parfaitement : essayez le self-play",
      "Ajustez les hyperparamètres (alpha, gamma, epsilon) et mesurez l'effet sur les résultats d'évaluation"
    ],
    difficulty: "intermédiaire" as const,
    estimatedTime: "120 min (indicatif)",
    skills: ["Q-Learning", "Représentation d'état", "Évaluation d'agents", "Self-play"],
    tools: ["Python", "NumPy"],
    category: "Jeux"
  },
  {
    title: "🚗 Contrôleur de véhicule : parking autonome",
    description: "Un agent qui apprend, en simulation, à se garer en évitant des obstacles (squelette à compléter).",
    problem: "Créez un simulateur de parking en deux dimensions et un agent qui apprend à stationner un véhicule en évitant les obstacles. Le véhicule se commande par la direction, l'accélération et le freinage ; comme DQN suppose des actions discrètes, il faut les discrétiser. Prévoyez plusieurs scénarios (parallèle, perpendiculaire, créneaux serrés). La solution fournie est un squelette : elle donne l'état, la récompense et le réseau, le reste est à écrire.",
    solution: `# Squelette de solution avec Deep Q-Network (DQN) : volontairement incomplet
# Fourni : état normalisé, fonction de récompense, réseau de neurones.
# À écrire : step(action) (physique du véhicule), generate_obstacles(), get_sensor_distances(),
# check_collision() et la boucle d'entraînement (mémoire de rejeu, réseau cible, epsilon-greedy).
# Remarque : DQN suppose des actions DISCRÈTES. Direction, accélération et freinage (continus) doivent
# donc être discrétisés, par exemple 3 angles de braquage x 3 niveaux d'accélération = 9 actions.
# Prérequis : pip install numpy torch (et pygame pour une visualisation)
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random

class ParkingEnvironment:
    def __init__(self, width=800, height=600):
        self.width = width
        self.height = height
        self.car_width = 40
        self.car_height = 20
        self.reset()

    def reset(self):
        # Position aléatoire de départ
        self.car_x = random.randint(100, self.width - 200)
        self.car_y = random.randint(100, self.height - 200)
        self.car_angle = random.uniform(0, 2 * np.pi)
        self.car_velocity = 0

        # Position cible (parking)
        self.target_x = random.randint(200, self.width - 200)
        self.target_y = random.randint(200, self.height - 200)

        # Obstacles
        self.obstacles = self.generate_obstacles()

        return self.get_state()

    def get_state(self):
        # Distance et angle vers la cible
        dx = self.target_x - self.car_x
        dy = self.target_y - self.car_y
        distance = np.sqrt(dx**2 + dy**2)
        angle_to_target = np.arctan2(dy, dx) - self.car_angle

        # Distances aux obstacles (sensors)
        sensor_distances = self.get_sensor_distances()

        # État normalisé
        state = [
            self.car_x / self.width,
            self.car_y / self.height,
            self.car_angle / (2 * np.pi),
            self.car_velocity / 10.0,
            distance / np.sqrt(self.width**2 + self.height**2),
            np.sin(angle_to_target),
            np.cos(angle_to_target),
        ] + sensor_distances

        return np.array(state, dtype=np.float32)

    def calculate_reward(self):
        # Distance reward
        distance_to_target = np.sqrt((self.target_x - self.car_x)**2 +
                                   (self.target_y - self.car_y)**2)
        distance_reward = -distance_to_target / 100.0

        # Collision penalty
        if self.check_collision():
            return -100

        # Parking success
        if distance_to_target < 30 and abs(self.car_velocity) < 0.1:
            return 100

        # Speed penalty (encourage slow parking)
        speed_penalty = -abs(self.car_velocity) * 0.1

        return distance_reward + speed_penalty

    def render(self):
        distance = np.sqrt((self.target_x - self.car_x)**2 + (self.target_y - self.car_y)**2)
        print(f"Position: ({self.car_x:.0f}, {self.car_y:.0f}), angle: {self.car_angle:.2f} rad")
        print(f"Vitesse: {self.car_velocity:.2f}")
        print(f"Distance à la place cible: {distance:.1f}")

    # À écrire : step(action), generate_obstacles(), get_sensor_distances() et check_collision()

class DQN(nn.Module):
    def __init__(self, state_size, action_size, hidden_size=256):
        super().__init__()
        self.fc1 = nn.Linear(state_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, hidden_size)
        self.fc4 = nn.Linear(hidden_size, action_size)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = torch.relu(self.fc3(x))
        return self.fc4(x)

# La boucle d'entraînement reste à écrire (voir l'en-tête) ; elle utilisera deque (mémoire de rejeu) et optim`,
    hints: [
      "Modélisez une physique simple du véhicule (position, vitesse, angle de braquage)",
      "Utilisez des capteurs de distance pour détecter les obstacles",
      "Concevez une fonction de récompense qui encourage un stationnement réussi sans collision",
      "Avec DQN, discrétisez les commandes (par exemple 9 actions) ; un algorithme comme PPO ou SAC accepte des commandes continues",
      "Visualisez l'apprentissage avec pygame ou matplotlib"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "240 min (indicatif)",
    skills: ["Deep Q-Learning", "Simulation physique", "Conception de récompense", "Capteurs simulés"],
    tools: ["Python", "PyTorch", "Pygame", "NumPy"],
    category: "Contrôle"
  },
  {
    title: "📈 Agent de trading : un exercice de méthode",
    description: "Un agent PPO dans un environnement de trading simulé, pour apprendre à évaluer honnêtement une stratégie (et ses limites).",
    problem: "Développez un agent qui apprend, par renforcement, à acheter, conserver ou vendre un actif en tenant compte des coûts de transaction. Entraînez-le sur une période, testez-le sur une période ultérieure, et comparez-le à la stratégie « acheter et garder ». Aucun gain n'est à attendre : sur des prix simulés par marche aléatoire, tout profit durable serait un hasard, et sur de vraies données un bon résultat d'entraînement ne garantit rien. Ce projet n'est pas un conseil d'investissement.",
    solution: `# Agent de trading avec PPO sur une série de prix SIMULÉE
# Prérequis : pip install numpy pandas gymnasium stable-baselines3
#
# Avertissement : un agent entraîné sur un historique ne garantit aucun gain futur, et un backtest flatteur
# est souvent du surapprentissage. Ici les prix sont une marche aléatoire : aucune régularité n'y est
# cachée, donc tout « profit » durable de l'agent serait un hasard. C'est un exercice de méthode, pas
# un conseil d'investissement. Avec de vraies données (par exemple via yfinance), gardez la même démarche :
# entraînement sur le passé, test sur une période ultérieure, coûts de transaction inclus.
import numpy as np
import pandas as pd
import gymnasium as gym
from gymnasium import spaces
from stable_baselines3 import PPO

def simuler_prix(n=1500, graine=0):
    """Marche aléatoire géométrique, base 100."""
    rng = np.random.default_rng(graine)
    rendements = rng.normal(0.0003, 0.01, n)
    return pd.Series(100 * np.exp(np.cumsum(rendements)), name="prix")

class TradingEnvironment(gym.Env):
    """Actions : 0 = tout vendre, 1 = conserver, 2 à 5 = acheter 25 %, 50 %, 75 % ou 100 % du cash."""

    def __init__(self, prix, initial_balance=10_000, transaction_cost=0.001, fenetre=10):
        super().__init__()
        self.prix = np.asarray(prix, dtype=float)
        self.initial_balance = initial_balance
        self.transaction_cost = transaction_cost
        self.fenetre = fenetre

        self.action_space = spaces.Discrete(6)
        # Observation : part du portefeuille en cash, part investie, puis les \`fenetre\` derniers rendements
        self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(2 + fenetre,), dtype=np.float32)

    def reset(self, *, seed=None, options=None):
        super().reset(seed=seed)
        self.jour = self.fenetre              # il faut \`fenetre\` jours d'historique
        self.cash = float(self.initial_balance)
        self.parts = 0
        self.valeur = float(self.initial_balance)
        return self._observation(), {}

    def _observation(self):
        prix = self.prix[self.jour]
        valeur = self.cash + self.parts * prix
        rendements = np.diff(np.log(self.prix[self.jour - self.fenetre:self.jour + 1]))
        return np.array([self.cash / valeur, self.parts * prix / valeur, *rendements], dtype=np.float32)

    def step(self, action):
        prix = self.prix[self.jour]

        if action == 0 and self.parts > 0:                    # tout vendre
            self.cash += self.parts * prix * (1 - self.transaction_cost)
            self.parts = 0
        elif action >= 2:                                      # acheter une fraction du cash
            fraction = [0.25, 0.5, 0.75, 1.0][action - 2]
            n_parts = int(self.cash * fraction / (prix * (1 + self.transaction_cost)))
            if n_parts > 0:
                self.cash -= n_parts * prix * (1 + self.transaction_cost)
                self.parts += n_parts

        # Passage au jour suivant, puis valorisation du portefeuille au nouveau prix
        self.jour += 1
        nouvelle_valeur = self.cash + self.parts * self.prix[self.jour]
        reward = (nouvelle_valeur - self.valeur) / self.initial_balance
        self.valeur = nouvelle_valeur

        terminated = self.jour >= len(self.prix) - 1
        return self._observation(), reward, terminated, False, {}

def valeur_finale(modele, prix):
    """Valeur finale du portefeuille quand l'agent suit sa politique (sans exploration)."""
    env = TradingEnvironment(prix)
    obs, _ = env.reset()
    fini = False
    while not fini:
        action, _ = modele.predict(obs, deterministic=True)
        obs, _, fini, _, _ = env.step(int(action))
    return env.valeur

def acheter_et_garder(prix, initial_balance=10_000, transaction_cost=0.001, fenetre=10):
    """Référence : tout investir dès le premier jour et ne plus rien faire."""
    prix = np.asarray(prix, dtype=float)[fenetre:]
    n_parts = int(initial_balance / (prix[0] * (1 + transaction_cost)))
    return initial_balance - n_parts * prix[0] * (1 + transaction_cost) + n_parts * prix[-1]

def train_trading_agent():
    prix = simuler_prix()
    entrainement, test = prix[:1000], prix[1000:]    # le test vient APRÈS l'entraînement

    modele = PPO("MlpPolicy", TradingEnvironment(entrainement), seed=0, verbose=0)
    modele.learn(total_timesteps=20_000)

    print(f"Entraînement : agent {valeur_finale(modele, entrainement):,.0f} | "
          f"acheter et garder {acheter_et_garder(entrainement):,.0f}")
    print(f"Test         : agent {valeur_finale(modele, test):,.0f} | "
          f"acheter et garder {acheter_et_garder(test):,.0f}")
    return modele

if __name__ == "__main__":
    train_trading_agent()`,
    hints: [
      "Commencez avec des prix simulés (marche aléatoire) : l'agent ne doit pas y trouver de profit durable, c'est un bon test de votre méthode",
      "Ajoutez ensuite des données réelles (yfinance, Alpha Vantage) et des indicateurs techniques (RSI, MACD, bandes de Bollinger)",
      "Modélisez les coûts de transaction et le glissement de prix (slippage)",
      "Les actions de l'exemple sont discrètes : PPO ou A2C conviennent",
      "Séparez strictement entraînement et test dans le temps, et comparez avec « acheter et garder » ; regardez aussi le ratio de Sharpe et le risque"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "300 min (indicatif)",
    skills: ["Environnement Gymnasium", "PPO", "Backtest", "Évaluation honnête"],
    tools: ["Python", "Gymnasium", "Stable-Baselines3", "pandas", "yfinance (optionnel)"],
    category: "Finance (simulation)"
  }
];

const ReinforcementProjectsSection = () => {
  return (
    <ProjectsSection
      title="Projets pratiques en apprentissage par renforcement"
      projects={projects}
      description="Trois projets de difficulté croissante : un jeu simple, un simulateur de conduite (squelette à compléter) et un environnement de trading simulé. Les solutions sont des points de départ, parfois partielles, et les environnements sont simulés : les résultats ne disent rien de ce que donnerait le monde réel."
    />
  );
};

export default ReinforcementProjectsSection;
