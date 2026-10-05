
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { mlDefinitions } from "@/data/glossary/ml-definitions";

const DeepLearningSection = () => {
  return (
    <section id="deep-learning" className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Deep Learning</h2>
      
      <p className="text-lg mb-6">
        Le <GlossaryTerm definition={mlDefinitions["deep-learning"]}>Deep Learning</GlossaryTerm> est un sous-ensemble du Machine Learning qui utilise des réseaux de neurones
        artificiels à plusieurs couches pour apprendre des représentations hiérarchiques des données.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">Concepts fondamentaux</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Réseaux de neurones</h4>
              <p className="text-sm">
                Systèmes inspirés du cerveau humain, composés de neurones artificiels organisés en couches
                qui transforment les données d'entrée en sorties prédictives.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Fonctions d'activation</h4>
              <p className="text-sm">
                Fonctions non linéaires (ReLU, Sigmoid, Tanh) qui déterminent si un neurone doit être activé.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Rétropropagation</h4>
              <p className="text-sm">
                Algorithme permettant d'ajuster les poids du réseau en propageant l'erreur de la sortie vers l'entrée.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Descente de gradient</h4>
              <p className="text-sm">
                Méthode d'optimisation qui ajuste itérativement les paramètres pour minimiser la fonction de coût.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Architectures de Deep Learning</h3>
          <div className="space-y-3">
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["cnn"]}>Réseaux de neurones convolutifs (CNN)</GlossaryTerm>
              </p>
              <p className="text-sm">Spécialisés pour traiter les données avec une topologie en grille comme les images.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["rnn"]}>Réseaux de neurones récurrents (RNN)</GlossaryTerm>
              </p>
              <p className="text-sm">Adaptés aux séquences comme le texte ou les séries temporelles.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["lstm"]}>Réseaux de neurones à mémoire (LSTM, GRU)</GlossaryTerm>
              </p>
              <p className="text-sm">Types de RNN conçus pour mémoriser les dépendances à long terme.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["transformers"]}>Transformers</GlossaryTerm>
              </p>
              <p className="text-sm">Architecture basée sur le mécanisme d'attention, excellant dans les tâches de NLP.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">Autoencodeurs</p>
              <p className="text-sm">Réseaux non supervisés pour la réduction de dimension et la génération de données.</p>
            </div>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Exemple de code : Réseau de neurones simple</CardTitle>
              <CardDescription>Implémentation avec TensorFlow/Keras</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                <code>
{`import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Séparation d'abord, normalisation ensuite : le scaler n'apprend que sur
# l'entraînement (sinon des informations du test fuient dans l'entraînement)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Construction du modèle
model = Sequential([
    Input(shape=(X_train.shape[1],)),
    Dense(128, activation='relu'),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')  # pour classification binaire
])

# Compilation du modèle
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Entraînement
history = model.fit(
    X_train, y_train,
    epochs=20,
    batch_size=32,
    validation_split=0.2,
    verbose=1
)

# Évaluation
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Précision du test: {accuracy:.4f}")

# Prédictions
y_pred = model.predict(X_test)
y_pred_classes = (y_pred > 0.5).astype(int)`}
                </code>
              </pre>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Applications du Deep Learning</h3>
            <div className="grid grid-cols-2 gap-3 [overflow-wrap:anywhere]">
              <div className="border p-3 rounded-md">
                <p className="font-medium">Vision par ordinateur</p>
                <p className="text-sm">Reconnaissance d'images, détection d'objets, segmentation, etc.</p>
              </div>
              <div className="border p-3 rounded-md">
                <p className="font-medium">Traitement du langage naturel</p>
                <p className="text-sm">Traduction, analyse de sentiment, génération de texte, etc.</p>
              </div>
              <div className="border p-3 rounded-md">
                <p className="font-medium">Synthèse vocale et reconnaissance</p>
                <p className="text-sm">Text-to-speech, speech-to-text, identification de locuteurs.</p>
              </div>
              <div className="border p-3 rounded-md">
                <p className="font-medium">Systèmes de recommandation</p>
                <p className="text-sm">Recommandations personnalisées basées sur les comportements.</p>
              </div>
              <div className="border p-3 rounded-md">
                <p className="font-medium">Génération d'images</p>
                <p className="text-sm">GANs, diffusion, text-to-image comme DALL-E et Stable Diffusion.</p>
              </div>
              <div className="border p-3 rounded-md">
                <p className="font-medium">Aide à la décision médicale</p>
                <p className="text-sm">Diagnostic basé sur les images médicales, prédiction de maladies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Défis et considérations du Deep Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-3 rounded-md">
              <p className="font-medium">Besoins en données</p>
              <p className="text-sm">Les modèles de Deep Learning nécessitent généralement de grandes quantités de données pour bien performer.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">Puissance de calcul</p>
              <p className="text-sm">L'entraînement de modèles complexes nécessite des GPUs ou TPUs puissants et peut être coûteux.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">Interprétabilité</p>
              <p className="text-sm">Les modèles de Deep Learning sont souvent des "boîtes noires" difficiles à interpréter.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">Hyperparamètres</p>
              <p className="text-sm">Le réglage des hyperparamètres peut être complexe et nécessite souvent de l'expérience.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["overfitting"]}>Surapprentissage</GlossaryTerm>
              </p>
              <p className="text-sm">Les modèles profonds peuvent facilement mémoriser les données d'entraînement sans généraliser.</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">Éthique et biais</p>
              <p className="text-sm">Les modèles peuvent perpétuer ou amplifier les biais présents dans les données d'entraînement.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DeepLearningSection;
