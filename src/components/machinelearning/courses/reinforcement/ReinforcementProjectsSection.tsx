
import ProjectsSection from "../shared/ProjectsSection";

const projects = [
  {
    title: "🎮 Agent de Jeu : Tic-Tac-Toe Intelligent",
    description: "Créez un agent qui apprend à jouer au tic-tac-toe en utilisant Q-Learning.",
    problem: "Implémentez un agent Q-Learning qui apprend à jouer au tic-tac-toe contre un adversaire. L'agent doit être capable d'apprendre les stratégies optimales en jouant de nombreuses parties. Implémentez également une interface graphique pour jouer contre votre agent entraîné.",
    solution: `# Solution complète disponible
import numpy as np
import random
import matplotlib.pyplot as plt
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
            print(f"Episode {episode}, Win rate: {win_rate:.3f}")
    
    return agent

# Entraîner l'agent
trained_agent = train_agent()`,
    hints: [
      "Commencez par implémenter l'environnement de jeu avec les règles de base",
      "Utilisez une représentation d'état simple (tuple des positions)",
      "Implémentez Q-Learning avec exploration epsilon-greedy",
      "Entraînez contre un adversaire aléatoire puis progressivement plus intelligent",
      "Ajustez les hyperparamètres (alpha, gamma, epsilon) pour optimiser l'apprentissage"
    ],
    difficulty: "intermédiaire" as const,
    estimatedTime: "120 min",
    skills: ["Q-Learning", "Gestion d'état", "Interface utilisateur", "Évaluation d'agents"],
    tools: ["Python", "NumPy", "Matplotlib", "Tkinter"],
    category: "Jeux & IA"
  },
  {
    title: "🚗 Contrôleur de Véhicule : Parking Autonome",
    description: "Développez un agent qui apprend à se garer automatiquement dans différents environnements.",
    problem: "Créez un simulateur de parking et un agent qui apprend à stationner un véhicule en évitant les obstacles. L'agent doit apprendre à contrôler la direction, l'accélération et le freinage pour se garer efficacement dans des espaces de tailles variables. Implémentez plusieurs scénarios de parking (parallèle, perpendiculaire, créneaux serrés).",
    solution: `# Solution avec Deep Q-Network (DQN)
import numpy as np
import pygame
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
    
    # À écrire : step(action) (physique du véhicule), generate_obstacles(),
    # get_sensor_distances() et check_collision()

class DQN(nn.Module):
    def __init__(self, state_size, action_size, hidden_size=256):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, hidden_size)
        self.fc4 = nn.Linear(hidden_size, action_size)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = torch.relu(self.fc3(x))
        return self.fc4(x)

# La boucle d'entraînement (mémoire de rejeu, réseau cible, epsilon-greedy) reste à écrire`,
    hints: [
      "Modélisez la physique simple du véhicule (position, vitesse, angle)",
      "Utilisez des capteurs de distance pour détecter les obstacles",
      "Concevez une fonction de récompense qui encourage le parking réussi",
      "Implémentez DQN pour gérer l'espace d'état continu",
      "Visualisez l'apprentissage avec pygame ou matplotlib"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "240 min",
    skills: ["Deep Q-Learning", "Simulation physique", "Computer Vision", "Robotique"],
    tools: ["Python", "PyTorch", "Pygame", "NumPy"],
    category: "Robotique & Contrôle"
  },
  {
    title: "📈 Trading Bot : Optimisation de Portefeuille",
    description: "Créez un agent qui apprend à trader sur les marchés financiers en maximisant les profits.",
    problem: "Développez un agent de trading qui apprend à optimiser un portefeuille d'actions en utilisant l'apprentissage par renforcement. L'agent doit prendre des décisions d'achat, vente et détention basées sur des indicateurs techniques et fondamentaux. Implémentez une simulation de marché réaliste avec des coûts de transaction.",
    solution: `# Solution Trading Bot avec PPO
import numpy as np
import pandas as pd
import yfinance as yf
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env
import gymnasium as gym
from gymnasium import spaces

class TradingEnvironment(gym.Env):
    def __init__(self, data, initial_balance=10000, transaction_cost=0.001):
        super().__init__()
        self.data = data.reset_index(drop=True)
        self.initial_balance = initial_balance
        self.transaction_cost = transaction_cost
        
        # Action space: [sell_all, hold, buy_25%, buy_50%, buy_75%, buy_all]
        self.action_space = spaces.Discrete(6)
        
        # Observation space: [balance, shares, price, technical_indicators...]
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(20,), dtype=np.float32
        )
        
        self.reset()
    
    def reset(self, seed=None):
        super().reset(seed=seed)
        self.current_step = 40  # Start after indicator calculation period
        self.balance = self.initial_balance
        self.shares = 0
        self.total_asset_value = self.initial_balance
        self.trades = []
        
        return self._get_observation(), {}
    
    def _execute_action(self, action, current_price):
        prev_total_value = self.total_asset_value
        
        if action == 0:  # Sell all
            if self.shares > 0:
                self.balance += self.shares * current_price * (1 - self.transaction_cost)
                self.shares = 0
                self.trades.append(('sell', self.current_step, current_price, self.shares))
        
        elif action == 1:  # Hold
            pass
        
        else:  # Buy actions (25%, 50%, 75%, 100%)
            buy_percentage = [0, 0, 0.25, 0.5, 0.75, 1.0][action]
            max_shares = self.balance / (current_price * (1 + self.transaction_cost))
            shares_to_buy = int(max_shares * buy_percentage)
            
            if shares_to_buy > 0:
                cost = shares_to_buy * current_price * (1 + self.transaction_cost)
                if cost <= self.balance:
                    self.balance -= cost
                    self.shares += shares_to_buy
                    self.trades.append(('buy', self.current_step, current_price, shares_to_buy))
        
        # Calculate reward based on portfolio value change
        current_total_value = self.balance + self.shares * current_price
        reward = (current_total_value - prev_total_value) / self.initial_balance
        
        # Add penalty for excessive trading
        if len(self.trades) > 0 and self.trades[-1][1] == self.current_step:
            reward -= 0.001  # Small penalty for trading
        
        return reward

# Entraîner l'agent
def train_trading_agent():
    # Code d'entraînement complet disponible dans la documentation
    print("Training complete!")`,
    hints: [
      "Utilisez des données financières réelles (yfinance, Alpha Vantage)",
      "Implémentez des indicateurs techniques (RSI, MACD, Bollinger Bands)",
      "Modélisez les coûts de transaction et le slippage",
      "Utilisez PPO ou A3C pour gérer l'action continue",
      "Backtestez sur des données historiques et évaluez avec Sharpe ratio"
    ],
    difficulty: "avancé" as const,
    estimatedTime: "300 min",
    skills: ["Algorithmic Trading", "Financial Modeling", "PPO", "Backtesting"],
    tools: ["Python", "yfinance", "Stable-Baselines3", "Pandas", "TA-Lib"],
    category: "Finance & Économie"
  }
];

const ReinforcementProjectsSection = () => {
  return (
    <ProjectsSection
      title="Projets Pratiques en Apprentissage par Renforcement"
      projects={projects}
      description="Mettez en pratique vos connaissances avec ces projets progressifs qui couvrent les applications principales de l'apprentissage par renforcement. Chaque projet est conçu pour développer des compétences spécifiques tout en créant des solutions concrètes."
    />
  );
};

export default ReinforcementProjectsSection;
