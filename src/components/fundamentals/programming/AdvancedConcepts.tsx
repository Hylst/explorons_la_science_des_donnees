import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Code, Play, Lightbulb, Trophy, Target, Zap, Brain, Rocket, Star, Clock, Package, Layers } from 'lucide-react';
import CourseHighlight from '@/components/courses/CourseHighlight';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { runCode, type RunResult } from '@/lib/runner';
import FigureOutput from '@/components/ui/figure-output';

interface Concept {
  id: string;
  title: string;
  description: string;
  code: string;
  explanation: string;
  benefits: string[];
  /** false : exemple qui ne peut pas tourner en un seul script (structure multi-fichiers) */
  runnable?: boolean;
}

/**
 * Advanced Programming Concepts Component
 * Covers modern programming paradigms including async/await, modules, classes, and ES6+ features
 * Designed for intermediate to advanced learners
 */
const AdvancedConcepts = () => {
  // State management for interactive learning
  const [completedConcepts, setCompletedConcepts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('async');
  const [codeExecution, setCodeExecution] = useState<{ [key: string]: boolean }>({});
  const [runResults, setRunResults] = useState<{ [key: string]: RunResult }>({});
  const [runStatus, setRunStatus] = useState<{ [key: string]: string }>({});
  const [showSolutions, setShowSolutions] = useState<{ [key: string]: boolean }>({});

  // Advanced concepts data structure
  const advancedConcepts = useMemo(() => ({
    async: {
      title: 'Programmation Asynchrone',
      icon: <Clock className="h-6 w-6" />,
      description: 'Découvrez async/await, Promises et la programmation non-bloquante',
      difficulty: 'Intermédiaire',
      estimatedTime: '3-4 heures',
      concepts: [
        {
          id: 'promises-basics',
          title: 'Promises et Callbacks',
          description: 'Comprendre les bases de la programmation asynchrone',
          code: `# Python - Programmation asynchrone avec asyncio
# Les requêtes réseau sont simulées avec asyncio.sleep (aucun accès réseau ici)
import asyncio
import time
from typing import List, Dict

# Fonction synchrone traditionnelle : time.sleep bloque tout le programme
def fetch_data_sync(url: str) -> Dict:
    """Simulation d'une requête synchrone"""
    time.sleep(0.5)  # simulation d'une latence réseau
    return {"url": url, "data": f"Données de {url}", "status": 200}

# Version asynchrone : await rend la main à la boucle d'événements pendant l'attente
async def fetch_data_async(url: str) -> Dict:
    """Requête asynchrone non-bloquante (latence simulée)"""
    try:
        await asyncio.sleep(0.5)  # simulation d'une latence réseau
        if "erreur" in url:
            raise ConnectionError("serveur injoignable")
        return {"url": url, "data": f"Données de {url}", "status": 200}
    except Exception as e:
        return {"url": url, "error": str(e), "status": 500}

# Traitement séquentiel : chaque await attend la fin du précédent
async def fetch_sequential(urls: List[str]) -> List[Dict]:
    results = []
    for url in urls:
        results.append(await fetch_data_async(url))
    return results

# Traitement concurrent : les attentes se chevauchent avec asyncio.gather
async def fetch_multiple_urls(urls: List[str]) -> List[Dict]:
    """Traite plusieurs URLs en même temps"""
    tasks = [fetch_data_async(url) for url in urls]
    return await asyncio.gather(*tasks, return_exceptions=True)

# Exemple d'utilisation
async def main():
    urls = [
        "https://example.com/api/utilisateurs/1",
        "https://example.com/api/articles/1",
        "https://example.com/api/erreur",
        "https://example.com/api/commentaires/1",
    ]

    print("Démarrage : version synchrone")
    start = time.perf_counter()
    for url in urls:
        fetch_data_sync(url)
    print(f"Synchrone : {time.perf_counter() - start:.2f} s")

    print("Démarrage : async/await, l'un après l'autre")
    start = time.perf_counter()
    await fetch_sequential(urls)
    print(f"Séquentiel async : {time.perf_counter() - start:.2f} s")

    print("Démarrage : asyncio.gather (concurrent)")
    start = time.perf_counter()
    results = await fetch_multiple_urls(urls)
    print(f"Concurrent : {time.perf_counter() - start:.2f} s")

    for result in results:
        print(f"Résultat : {result}")

# Exécution du programme asynchrone
if __name__ == "__main__":
    asyncio.run(main())`,
          explanation: 'La programmation asynchrone permet de faire avancer plusieurs opérations d\'attente (réseau, disque) en même temps dans un seul thread, sans le bloquer. Ici la latence est simulée avec asyncio.sleep : comparez les temps mesurés du mode synchrone, séquentiel et concurrent (asyncio.gather).',
          benefits: [
            'Performance améliorée pour les I/O',
            'Meilleure utilisation des ressources',
            'Interface utilisateur plus réactive'
          ]
        },
        {
          id: 'async-patterns',
          title: 'Patterns Asynchrones Avancés',
          description: 'Techniques avancées pour gérer la complexité asynchrone',
          code: `# Patterns asynchrones avancés en Python
import asyncio
from asyncio import Queue, Semaphore
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict, List

# Faux "fichiers" en mémoire : la lecture est simulée avec asyncio.sleep
FICHIERS = {f"data_{i}.txt": "ligne 1\\nligne 2\\nligne 3\\n" * (i + 1) for i in range(6)}

class AsyncDataProcessor:
    """Processeur de données asynchrone avec gestion des ressources"""

    def __init__(self, max_concurrent: int = 5):
        self.semaphore = Semaphore(max_concurrent)
        self.results_queue = Queue()

    @asynccontextmanager
    async def managed_resource(self, resource_id: str):
        """Gestionnaire de contexte asynchrone pour les ressources"""
        async with self.semaphore:  # au plus max_concurrent ressources en même temps
            print(f"Acquisition de la ressource {resource_id}")
            try:
                yield resource_id
            finally:
                print(f"Libération de la ressource {resource_id}")

    async def process_file(self, filepath: str) -> Dict:
        """Traite un fichier de manière asynchrone"""
        async with self.managed_resource(filepath):
            try:
                # Lecture asynchrone simulée (un vrai code utiliserait aiofiles)
                await asyncio.sleep(0.1)
                content = FICHIERS[filepath]

                result = {
                    'file': filepath,
                    'size': len(content),
                    'lines': content.count('\\n'),
                    'status': 'success'
                }

                # Ajout du résultat à la queue
                await self.results_queue.put(result)
                return result

            except Exception as e:
                error_result = {
                    'file': filepath,
                    'error': repr(e),
                    'status': 'error'
                }
                await self.results_queue.put(error_result)
                return error_result

    async def batch_process(self, filepaths: List[str]) -> List[Dict]:
        """Traite un lot de fichiers avec limitation de concurrence"""
        tasks = [self.process_file(filepath) for filepath in filepaths]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

    async def stream_results(self) -> AsyncGenerator[Dict, None]:
        """Générateur asynchrone pour streamer les résultats"""
        while True:
            try:
                result = await asyncio.wait_for(
                    self.results_queue.get(),
                    timeout=1.0
                )
                yield result
                self.results_queue.task_done()
            except asyncio.TimeoutError:
                break

# Exemple d'utilisation avancée
async def advanced_async_example():
    processor = AsyncDataProcessor(max_concurrent=3)

    # 6 fichiers existants et 1 fichier introuvable (pour voir la gestion d'erreur)
    files = list(FICHIERS) + ["absent.txt"]

    # Traitement en arrière-plan
    process_task = asyncio.create_task(
        processor.batch_process(files)
    )

    # Stream des résultats au fur et à mesure
    async for result in processor.stream_results():
        print(f"Résultat traité : {result['file']} - {result['status']}")

    # Attendre la fin du traitement
    final_results = await process_task
    print(f"Traitement terminé : {len(final_results)} fichiers traités")

# Pattern de retry avec backoff exponentiel
async def retry_with_backoff(func, max_retries: int = 3, base_delay: float = 1.0):
    """Retry une fonction avec backoff exponentiel"""
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise e

            delay = base_delay * (2 ** attempt)
            print(f"Tentative {attempt + 1} échouée, retry dans {delay}s")
            await asyncio.sleep(delay)

# Démonstration du retry : la fonction échoue deux fois puis réussit
async def demo_retry():
    appels = {"n": 0}

    async def service_instable():
        appels["n"] += 1
        if appels["n"] < 3:
            raise ConnectionError("service indisponible")
        return f"succès à l'appel n°{appels['n']}"

    print(await retry_with_backoff(service_instable, base_delay=0.1))

# Exécution
async def main():
    await advanced_async_example()
    await demo_retry()

if __name__ == "__main__":
    asyncio.run(main())`,
          explanation: 'Les patterns asynchrones avancés permettent de gérer la complexité des applications concurrentes : sémaphore pour limiter la concurrence, file d\'attente, générateur asynchrone et retry avec backoff. Les fichiers sont simulés en mémoire ; en production, on utiliserait par exemple aiofiles.',
          benefits: [
            'Gestion élégante des ressources',
            'Contrôle de la concurrence',
            'Streaming de données en temps réel'
          ]
        }
      ]
    },
    modules: {
      title: 'Modules et Packages',
      icon: <Package className="h-6 w-6" />,
      description: 'Organisation du code avec les modules, packages et imports',
      difficulty: 'Intermédiaire',
      estimatedTime: '2-3 heures',
      concepts: [
        {
          id: 'module-structure',
          title: 'Structure de Modules',
          description: 'Organisation et création de modules réutilisables',
          code: `# Structure d'un package Python professionnel
# my_data_package/
# ├── __init__.py
# ├── core/
# │   ├── __init__.py
# │   ├── data_loader.py
# │   └── preprocessor.py
# ├── models/
# │   ├── __init__.py
# │   ├── base_model.py
# │   └── ml_models.py
# ├── utils/
# │   ├── __init__.py
# │   └── helpers.py
# └── tests/
#     ├── __init__.py
#     └── test_core.py

# my_data_package/__init__.py
"""Package principal pour l'analyse de données"""

__version__ = "1.0.0"
__author__ = "Data Science Team"
__email__ = "team@example.com"

# Imports publics du package
from .core.data_loader import DataLoader, CSVLoader, JSONLoader
from .core.preprocessor import DataPreprocessor
from .models.ml_models import LinearRegressionModel, RandomForestModel
from .utils.helpers import validate_data, log_performance

# Configuration du logging
import logging
logging.getLogger(__name__).addHandler(logging.NullHandler())

# Définition de l'API publique
__all__ = [
    'DataLoader',
    'CSVLoader', 
    'JSONLoader',
    'DataPreprocessor',
    'LinearRegressionModel',
    'RandomForestModel',
    'validate_data',
    'log_performance'
]

# my_data_package/core/data_loader.py
from abc import ABC, abstractmethod
from typing import Union, Dict, Any, Optional
import pandas as pd
import json
from pathlib import Path

class DataLoader(ABC):
    """Classe abstraite pour le chargement de données"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self._validate_config()
    
    @abstractmethod
    def load(self, source: Union[str, Path]) -> pd.DataFrame:
        """Charge les données depuis une source"""
        pass
    
    @abstractmethod
    def _validate_config(self) -> None:
        """Valide la configuration du loader"""
        pass
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()
    
    def cleanup(self):
        """Nettoyage des ressources"""
        pass

class CSVLoader(DataLoader):
    """Loader spécialisé pour les fichiers CSV"""
    
    def _validate_config(self) -> None:
        allowed_keys = {'separator', 'encoding', 'header', 'index_col'}
        invalid_keys = set(self.config.keys()) - allowed_keys
        if invalid_keys:
            raise ValueError(f"Clés de configuration invalides: {invalid_keys}")
    
    def load(self, source: Union[str, Path]) -> pd.DataFrame:
        """Charge un fichier CSV avec configuration personnalisée"""
        default_config = {
            'separator': ',',
            'encoding': 'utf-8',
            'header': 0
        }
        
        # Fusion de la configuration par défaut avec celle fournie
        load_config = {**default_config, **self.config}
        
        try:
            df = pd.read_csv(
                source,
                sep=load_config['separator'],
                encoding=load_config['encoding'],
                header=load_config['header'],
                index_col=load_config.get('index_col')
            )
            
            print(f"✅ CSV chargé: {df.shape[0]} lignes, {df.shape[1]} colonnes")
            return df
            
        except Exception as e:
            raise RuntimeError(f"Erreur lors du chargement CSV: {e}")

class JSONLoader(DataLoader):
    """Loader spécialisé pour les fichiers JSON"""
    
    def _validate_config(self) -> None:
        allowed_keys = {'orient', 'lines', 'encoding'}
        invalid_keys = set(self.config.keys()) - allowed_keys
        if invalid_keys:
            raise ValueError(f"Clés de configuration invalides: {invalid_keys}")
    
    def load(self, source: Union[str, Path]) -> pd.DataFrame:
        """Charge un fichier JSON"""
        default_config = {
            'orient': 'records',
            'lines': False,
            'encoding': 'utf-8'
        }
        
        load_config = {**default_config, **self.config}
        
        try:
            if load_config['lines']:
                df = pd.read_json(
                    source,
                    orient=load_config['orient'],
                    lines=True,
                    encoding=load_config['encoding']
                )
            else:
                with open(source, 'r', encoding=load_config['encoding']) as f:
                    data = json.load(f)
                df = pd.DataFrame(data)
            
            print(f"✅ JSON chargé: {df.shape[0]} lignes, {df.shape[1]} colonnes")
            return df
            
        except Exception as e:
            raise RuntimeError(f"Erreur lors du chargement JSON: {e}")

# Exemple d'utilisation du module
if __name__ == "__main__":
    # Utilisation avec context manager
    with CSVLoader({'separator': ';', 'encoding': 'utf-8'}) as loader:
        df = loader.load('data.csv')
        print(df.head())
    
    # Utilisation directe
    json_loader = JSONLoader({'lines': True})
    df_json = json_loader.load('data.jsonl')
    print(df_json.info())`,
          runnable: false,
          explanation: 'Les modules permettent d\'organiser le code en unités réutilisables et maintenables. Cet exemple montre plusieurs fichiers d\'un package (imports relatifs) : il est à répartir dans une arborescence réelle.',
          benefits: [
            'Code réutilisable et modulaire',
            'Séparation des responsabilités',
            'Facilite les tests et la maintenance'
          ]
        },
        {
          id: 'import-strategies',
          title: 'Stratégies d\'Import Avancées',
          description: 'Techniques d\'importation dynamique et conditionnelle',
          code: `# Stratégies d'import avancées en Python
import importlib
import sys
from typing import Any, Dict, List, Optional, Type
from functools import lru_cache
import warnings

class DynamicImporter:
    """Gestionnaire d'imports dynamiques avec cache et fallbacks"""
    
    def __init__(self):
        self._cache: Dict[str, Any] = {}
        self._failed_imports: set = set()
    
    @lru_cache(maxsize=128)
    def safe_import(self, module_name: str, fallback: Optional[str] = None) -> Optional[Any]:
        """Import sécurisé avec fallback"""
        if module_name in self._failed_imports:
            return None
        
        try:
            module = importlib.import_module(module_name)
            self._cache[module_name] = module
            print(f"✅ Module '{module_name}' importé avec succès")
            return module
        
        except ImportError as e:
            self._failed_imports.add(module_name)
            print(f"❌ Échec d'import de '{module_name}': {e}")
            
            if fallback:
                print(f"🔄 Tentative avec fallback: {fallback}")
                return self.safe_import(fallback)
            
            return None
    
    def conditional_import(self, conditions: Dict[str, str]) -> Dict[str, Any]:
        """Import conditionnel basé sur l'environnement"""
        imported_modules = {}
        
        for condition, module_name in conditions.items():
            if self._check_condition(condition):
                module = self.safe_import(module_name)
                if module:
                    imported_modules[condition] = module
        
        return imported_modules
    
    def _check_condition(self, condition: str) -> bool:
        """Vérifie une condition d'environnement"""
        if condition == 'has_gpu':
            return self._has_gpu_support()
        elif condition == 'has_sklearn':
            return 'sklearn' in sys.modules or self.safe_import('sklearn') is not None
        elif condition == 'has_tensorflow':
            return 'tensorflow' in sys.modules or self.safe_import('tensorflow') is not None
        elif condition == 'has_torch':
            return 'torch' in sys.modules or self.safe_import('torch') is not None
        
        return False
    
    def _has_gpu_support(self) -> bool:
        """Détecte la disponibilité du GPU"""
        try:
            import torch
            return torch.cuda.is_available()
        except ImportError:
            try:
                import tensorflow as tf
                return len(tf.config.list_physical_devices('GPU')) > 0
            except ImportError:
                return False
    
    def get_best_available_backend(self, preferences: List[str]) -> Optional[Any]:
        """Sélectionne le meilleur backend disponible"""
        for backend in preferences:
            module = self.safe_import(backend)
            if module:
                print(f"🎯 Backend sélectionné: {backend}")
                return module
        
        print("⚠️ Aucun backend disponible")
        return None

# Factory pattern pour les modèles ML
class ModelFactory:
    """Factory pour créer des modèles ML selon la disponibilité"""
    
    def __init__(self):
        self.importer = DynamicImporter()
        self._model_registry = {}
        self._register_models()
    
    def _register_models(self):
        """Enregistre les modèles disponibles"""
        # Modèles scikit-learn
        sklearn = self.importer.safe_import('sklearn.ensemble')
        if sklearn:
            self._model_registry['random_forest'] = {
                'module': sklearn,
                'class': 'RandomForestRegressor',
                'type': 'sklearn'
            }
        
        # Modèles XGBoost
        xgboost = self.importer.safe_import('xgboost')
        if xgboost:
            self._model_registry['xgboost'] = {
                'module': xgboost,
                'class': 'XGBRegressor',
                'type': 'xgboost'
            }
        
        # Modèles LightGBM
        lightgbm = self.importer.safe_import('lightgbm')
        if lightgbm:
            self._model_registry['lightgbm'] = {
                'module': lightgbm,
                'class': 'LGBMRegressor',
                'type': 'lightgbm'
            }
    
    def create_model(self, model_type: str, **kwargs) -> Optional[Any]:
        """Crée un modèle du type spécifié"""
        if model_type not in self._model_registry:
            available = list(self._model_registry.keys())
            raise ValueError(f"Modèle '{model_type}' non disponible. Disponibles: {available}")
        
        model_info = self._model_registry[model_type]
        model_class = getattr(model_info['module'], model_info['class'])
        
        return model_class(**kwargs)
    
    def get_available_models(self) -> List[str]:
        """Retourne la liste des modèles disponibles"""
        return list(self._model_registry.keys())

# Exemple d'utilisation avancée
def advanced_import_example():
    """Exemple d'utilisation des imports dynamiques"""
    importer = DynamicImporter()
    
    # Import conditionnel selon l'environnement
    ml_backends = importer.conditional_import({
        'has_sklearn': 'sklearn',
        'has_tensorflow': 'tensorflow',
        'has_torch': 'torch'
    })
    
    print(f"📦 Backends ML disponibles: {list(ml_backends.keys())}")
    
    # Sélection du meilleur backend pour le calcul numérique
    numeric_preferences = ['cupy', 'numpy']  # CuPy pour GPU, NumPy en fallback
    numeric_backend = importer.get_best_available_backend(numeric_preferences)
    
    if numeric_backend:
        print(f"🔢 Backend numérique: {numeric_backend.__name__}")
    
    # Utilisation de la factory de modèles
    factory = ModelFactory()
    available_models = factory.get_available_models()
    print(f"🤖 Modèles ML disponibles: {available_models}")
    
    if available_models:
        # Création d'un modèle avec le premier disponible
        model = factory.create_model(available_models[0], n_estimators=100)
        print(f"✅ Modèle créé: {type(model).__name__}")

if __name__ == "__main__":
    advanced_import_example()`,
          explanation: 'Les imports dynamiques permettent d\'adapter le code selon l\'environnement d\'exécution.',
          benefits: [
            'Adaptabilité aux environnements',
            'Gestion élégante des dépendances optionnelles',
            'Code plus robuste et portable'
          ]
        }
      ]
    },
    classes: {
      title: 'Classes et POO Avancée',
      icon: <Layers className="h-6 w-6" />,
      description: 'Programmation orientée objet avancée avec métaclasses et patterns',
      difficulty: 'Avancé',
      estimatedTime: '4-5 heures',
      concepts: [
        {
          id: 'advanced-oop',
          title: 'POO Avancée et Métaclasses',
          description: 'Concepts avancés de la programmation orientée objet',
          code: `# Programmation orientée objet avancée en Python
from abc import ABC, ABCMeta, abstractmethod
from typing import Any, Dict, List, Optional, Type
from enum import Enum, auto
import threading
import weakref
from functools import wraps, cached_property
import logging
import numpy as np

# Métaclasse pour le pattern Singleton
class SingletonMeta(type):
    """Métaclasse implémentant le pattern Singleton"""
    _instances = {}
    _lock = threading.Lock()  # protège la création si plusieurs threads l'appellent

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    instance = super().__call__(*args, **kwargs)
                    cls._instances[cls] = instance
        return cls._instances[cls]

class Configuration(metaclass=SingletonMeta):
    """Une seule instance existe, quel que soit le nombre d'appels"""
    def __init__(self):
        self.parametres = {"seed": 42}

# Métaclasse pour l'enregistrement automatique.
# Elle hérite de ABCMeta pour pouvoir être combinée avec ABC (sinon : "metaclass conflict")
class AutoRegisterMeta(ABCMeta):
    """Métaclasse pour l'enregistrement automatique des classes"""
    registry = {}

    def __new__(mcs, name, bases, namespace, **kwargs):
        cls = super().__new__(mcs, name, bases, namespace, **kwargs)

        # Enregistrement automatique si la classe a un attribut 'register_name'
        if hasattr(cls, 'register_name'):
            mcs.registry[cls.register_name] = cls
            print(f"Classe {name} enregistrée sous '{cls.register_name}'")

        return cls

    @classmethod
    def get_registered_class(mcs, name: str) -> Optional[Type]:
        return mcs.registry.get(name)

    @classmethod
    def list_registered(mcs) -> List[str]:
        return list(mcs.registry.keys())

# Énumération pour les types de modèles
class ModelType(Enum):
    REGRESSION = auto()
    CLASSIFICATION = auto()
    CLUSTERING = auto()
    DEEP_LEARNING = auto()

# Classe abstraite de base pour les modèles ML
class BaseMLModel(ABC, metaclass=AutoRegisterMeta):
    """Classe abstraite de base pour tous les modèles ML"""

    def __init__(self, name: str, model_type: ModelType):
        self.name = name
        self.model_type = model_type
        self._is_trained = False
        self._metrics = {}
        self._observers = weakref.WeakSet()  # Pattern Observer avec weak references

    @abstractmethod
    def fit(self, X, y) -> 'BaseMLModel':
        """Entraîne le modèle"""

    @abstractmethod
    def predict(self, X) -> Any:
        """Effectue des prédictions"""

    @abstractmethod
    def evaluate(self, X, y) -> Dict[str, float]:
        """Évalue les performances du modèle"""

    @cached_property
    def feature_importance(self) -> Optional[Dict[str, float]]:
        """Importance des features (calculée une seule fois)"""
        if hasattr(self, '_calculate_feature_importance'):
            return self._calculate_feature_importance()
        return None

    def add_observer(self, observer):
        """Ajoute un observateur (Pattern Observer)"""
        self._observers.add(observer)

    def _notify_observers(self, event: str, data: Any = None):
        """Notifie tous les observateurs"""
        for observer in self._observers:
            if hasattr(observer, 'on_model_event'):
                observer.on_model_event(self, event, data)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()

    def cleanup(self):
        """Nettoyage des ressources"""
        self._observers.clear()

# Décorateur pour la validation des données
def validate_data(func):
    """Décorateur pour valider les données d'entrée"""
    @wraps(func)
    def wrapper(self, X, y=None, *args, **kwargs):
        if X is None or len(X) == 0:
            raise ValueError("Les données d'entrée ne peuvent pas être vides")

        if y is not None and len(X) != len(y):
            raise ValueError("X et y doivent avoir la même longueur")

        if y is None:  # predict(X) n'a pas de paramètre y
            return func(self, X, *args, **kwargs)
        return func(self, X, y, *args, **kwargs)
    return wrapper

# Implémentation concrète d'un modèle de régression
class AdvancedLinearRegression(BaseMLModel):
    """Modèle de régression linéaire avancé avec fonctionnalités étendues"""

    register_name = "advanced_linear_regression"  # Pour l'auto-registration

    def __init__(self, name: str = "AdvancedLinearRegression", regularization: str = "none", alpha: float = 0.01):
        super().__init__(name, ModelType.REGRESSION)
        self.regularization = regularization
        self.alpha = alpha
        self.coefficients_ = None
        self.intercept_ = None

        # Configuration du logging
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    @validate_data
    def fit(self, X, y) -> 'AdvancedLinearRegression':
        """Entraîne le modèle de régression"""
        self.logger.info(f"Début de l'entraînement avec {len(X)} échantillons")

        try:
            X_array = np.array(X)
            y_array = np.array(y)

            # Ajout du terme de biais
            X_with_bias = np.column_stack([np.ones(len(X_array)), X_array])

            # Résolution par moindres carrés avec régularisation
            if self.regularization == "ridge":
                # Ridge regression
                identity = np.eye(X_with_bias.shape[1])
                identity[0, 0] = 0  # Ne pas régulariser le biais
                coeffs = np.linalg.solve(
                    X_with_bias.T @ X_with_bias + self.alpha * identity,
                    X_with_bias.T @ y_array
                )
            else:
                # Régression linéaire standard
                coeffs = np.linalg.lstsq(X_with_bias, y_array, rcond=None)[0]

            self.intercept_ = coeffs[0]
            self.coefficients_ = coeffs[1:]
            self._is_trained = True

            self.logger.info("Entraînement terminé avec succès")
            self._notify_observers("training_completed", {"coefficients": self.coefficients_})

            return self

        except Exception as e:
            self.logger.error(f"Erreur lors de l'entraînement: {e}")
            self._notify_observers("training_failed", {"error": str(e)})
            raise

    @validate_data
    def predict(self, X) -> np.ndarray:
        """Effectue des prédictions"""
        if not self._is_trained:
            raise RuntimeError("Le modèle doit être entraîné avant de faire des prédictions")

        X_array = np.array(X)
        predictions = X_array @ self.coefficients_ + self.intercept_

        self._notify_observers("prediction_made", {"n_predictions": len(predictions)})
        return predictions

    @validate_data
    def evaluate(self, X, y) -> Dict[str, float]:
        """Évalue les performances du modèle"""
        predictions = self.predict(X)
        y_array = np.array(y)

        # Calcul des métriques
        mse = np.mean((predictions - y_array) ** 2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(predictions - y_array))

        # R² score
        ss_res = np.sum((y_array - predictions) ** 2)
        ss_tot = np.sum((y_array - np.mean(y_array)) ** 2)
        r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0

        metrics = {
            "mse": round(float(mse), 4),
            "rmse": round(float(rmse), 4),
            "mae": round(float(mae), 4),
            "r2": round(float(r2), 4)
        }

        self._metrics = metrics
        self._notify_observers("evaluation_completed", metrics)

        return metrics

    def _calculate_feature_importance(self) -> Dict[str, float]:
        """Calcule l'importance des features"""
        if not self._is_trained:
            return {}

        # Importance basée sur la valeur absolue des coefficients
        abs_coeffs = np.abs(self.coefficients_)
        total = np.sum(abs_coeffs)

        if total == 0:
            return {}

        importance = abs_coeffs / total
        return {f"feature_{i}": round(float(imp), 3) for i, imp in enumerate(importance)}

    def __repr__(self) -> str:
        status = "trained" if self._is_trained else "not trained"
        return f"AdvancedLinearRegression(name='{self.name}', regularization='{self.regularization}', status='{status}')"

# Observer pour le logging des événements
class ModelObserver:
    """Observateur pour logger les événements des modèles"""

    def __init__(self, name: str):
        self.name = name
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    def on_model_event(self, model: BaseMLModel, event: str, data: Any = None):
        """Gère les événements des modèles"""
        self.logger.info(f"[{self.name}] Modèle {model.name}: {event}")
        if data:
            self.logger.debug(f"[{self.name}] Données: {data}")

# Exemple d'utilisation avancée
def advanced_oop_example():
    """Exemple d'utilisation de la POO avancée"""
    # Configuration du logging
    logging.basicConfig(level=logging.INFO)

    # Singleton : les deux appels renvoient le même objet
    print(f"Singleton : {Configuration() is Configuration()}")

    # Création d'un observateur
    observer = ModelObserver("MainObserver")

    # Utilisation du context manager
    with AdvancedLinearRegression(regularization="ridge", alpha=0.1) as model:
        # Ajout de l'observateur
        model.add_observer(observer)

        # Données d'exemple
        np.random.seed(42)
        X = np.random.randn(100, 3)
        y = X @ np.array([1.5, -2.0, 0.5]) + np.random.randn(100) * 0.1

        # Entraînement
        model.fit(X, y)

        # Prédictions
        predictions = model.predict(X[:10])
        print(f"Prédictions : {np.round(predictions[:5], 3)}")

        # Évaluation
        metrics = model.evaluate(X, y)
        print(f"Métriques : {metrics}")

        # Importance des features (cached_property)
        importance = model.feature_importance
        print(f"Importance des features : {importance}")

    # Vérification de l'auto-registration
    print(f"Classes enregistrées : {AutoRegisterMeta.list_registered()}")

    # Récupération d'une classe enregistrée
    registered_class = AutoRegisterMeta.get_registered_class("advanced_linear_regression")
    if registered_class:
        print(f"Classe récupérée : {registered_class.__name__}")

if __name__ == "__main__":
    advanced_oop_example()`,
          explanation: 'La POO avancée utilise des concepts comme les métaclasses, les décorateurs et les patterns de conception. Pour combiner ABC et une métaclasse personnalisée, celle-ci doit hériter de ABCMeta, sinon Python lève un conflit de métaclasses.',
          benefits: [
            'Code plus maintenable et extensible',
            'Réutilisabilité maximale',
            'Patterns de conception robustes'
          ]
        }
      ]
    }
  }), []);

  // Handlers for interactive features
  const handleConceptComplete = useCallback((conceptId: string) => {
    setCompletedConcepts(prev => new Set([...prev, conceptId]));
  }, []);

  // Exécution réelle du code du concept avec Python (Pyodide) dans le navigateur
  const handleCodeExecution = useCallback(async (conceptId: string, code: string) => {
    setCodeExecution(prev => ({ ...prev, [conceptId]: true }));
    setRunStatus(prev => ({ ...prev, [conceptId]: '' }));
    const result = await runCode('python', code, (message) => setRunStatus(prev => ({ ...prev, [conceptId]: message })));
    setRunResults(prev => ({ ...prev, [conceptId]: result }));
    setCodeExecution(prev => ({ ...prev, [conceptId]: false }));
  }, []);

  const toggleSolution = useCallback((conceptId: string) => {
    setShowSolutions(prev => ({
      ...prev,
      [conceptId]: !prev[conceptId]
    }));
  }, []);

  // Calculate progress
  const totalConcepts = Object.values(advancedConcepts).reduce(
    (sum, category) => sum + category.concepts.length, 0
  );
  const completedCount = completedConcepts.size;
  const progressPercentage = (completedCount / totalConcepts) * 100;

  // Concept Card Component
  const ConceptCard = ({ concept }: { concept: Concept }) => {
    const isCompleted = completedConcepts.has(concept.id);
    const isExecuting = codeExecution[concept.id];
    const showSolution = showSolutions[concept.id];
    const runResult = runResults[concept.id];

    return (
      <Card className={`transition-all duration-300 ${
        isCompleted ? 'border-green-500 bg-green-50' : 'hover:shadow-lg'
      }`}>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">{concept.title}</h4>
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
            </div>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Terminé" : "En cours"}
            </Badge>
          </CardTitle>
          <p className="text-gray-600">{concept.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Benefits */}
          <div className="space-y-2">
            <h5 className="font-semibold text-sm flex items-center gap-1">
              <Target className="h-4 w-4" /> Avantages clés
            </h5>
            <ul className="text-sm space-y-1">
              {concept.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h5 className="font-semibold text-sm flex items-center gap-1">
                <Code className="h-4 w-4" /> Exemple de code
              </h5>
              <div className="flex flex-wrap items-center gap-2">
                {concept.runnable === false ? (
                  <span className="text-xs text-muted-foreground">
                    Exemple de structure de projet, à répartir dans plusieurs fichiers : non exécutable en un seul script.
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCodeExecution(concept.id, concept.code)}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <>
                        <div className="animate-spin h-3 w-3 mr-1 border border-blue-500 border-t-transparent rounded-full" />
                        Exécution...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Exécuter
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleSolution(concept.id)}
                >
                  {showSolution ? "Masquer" : "Voir explication"}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-800 text-gray-200 text-sm font-mono flex items-center justify-between">
                <span>💻 {concept.title}</span>
                <Badge variant="secondary" className="text-xs">
                  Python
                </Badge>
              </div>
              <pre className="p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
                <code>{concept.code}</code>
              </pre>
            </div>
            {isExecuting && runStatus[concept.id] && (
              <p className="text-sm text-blue-700" role="status">{runStatus[concept.id]}</p>
            )}
            {runResult && !isExecuting && (
              <div className="rounded-lg border bg-slate-50 p-3 space-y-2" aria-live="polite">
                <p className="text-xs text-muted-foreground">Exécution réelle dans votre navigateur (Python, {Math.round(runResult.durationMs)} ms)</p>
                {runResult.output && <pre className="text-sm font-mono whitespace-pre-wrap break-words text-slate-800">{runResult.output}</pre>}
                <FigureOutput images={runResult.images} />
                {runResult.error && <pre className="text-sm font-mono whitespace-pre-wrap break-words text-red-700">{runResult.error}</pre>}
                {!runResult.output && !runResult.error && !runResult.images?.length && <p className="text-sm text-green-800">Exécuté sans erreur, le programme n'a rien affiché.</p>}
              </div>
            )}
          </div>

          {/* Explanation */}
          {showSolution && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Explication :</strong> {concept.explanation}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button
            onClick={() => handleConceptComplete(concept.id)}
            disabled={isCompleted}
            className={`w-full ${
              isCompleted 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concept maîtrisé
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Marquer comme terminé
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <section id="advanced-concepts" className="mb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Concepts Avancés de Programmation
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explorez les concepts avancés pour aller plus loin en programmation, à votre rythme
        </p>
        <Badge className="bg-purple-100 text-purple-800 mt-2">
          Niveau Avancé
        </Badge>
      </div>

      {/* Progress Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{completedCount}</div>
              <div className="text-sm text-purple-600">Concepts maîtrisés</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-indigo-600" />
            <div>
              <div className="text-2xl font-bold text-indigo-700">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-indigo-600">Progression</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{totalConcepts}</div>
              <div className="text-sm text-blue-600">Concepts totaux</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">
                {completedCount === totalConcepts ? "Terminé" : "En cours"}
              </div>
              <div className="text-sm text-green-600">Statut</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression générale</span>
          <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      {/* Concepts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          {Object.entries(advancedConcepts).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              {category.icon}
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(advancedConcepts).map(([key, category]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            {/* Category Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="outline">{category.difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {category.estimatedTime}
                </Badge>
              </div>
            </div>

            {/* Concepts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.concepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Completion Message */}
      {completedCount === totalConcepts && (
        <CourseHighlight title="🎉 Félicitations !" type="success">
          <p className="mb-4">
            Vous avez parcouru tous les concepts avancés de programmation !
            Vous avez de bonnes bases pour aborder des défis plus complexes en data science.
          </p>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">Bravo pour ce beau parcours !</span>
          </div>
        </CourseHighlight>
      )}
    </section>
  );
};

export default AdvancedConcepts;