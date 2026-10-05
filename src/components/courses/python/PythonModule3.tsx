import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Code, Play, ChevronDown, ChevronRight, Package, Zap } from "lucide-react";

interface PythonModule3Props {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Module 3: Fonctions et modules - Composant pour les fonctions, modules et concepts avancés
 * Couvre la définition de fonctions, paramètres, modules, lambda et décorateurs
 */
const PythonModule3: React.FC<PythonModule3Props> = ({ isOpen, onToggle }) => {
  return (
    <Card className="border-2 border-purple-200">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="hover:bg-purple-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <div className="text-left">
                  <CardTitle className="text-xl text-purple-800">Fonctions et modules</CardTitle>
                  <CardDescription className="text-gray-600">Fonctions, paramètres, modules et concepts avancés</CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">Intermédiaire</Badge>
                    <Badge variant="outline" className="text-xs">5h</Badge>
                  </div>
                </div>
              </div>
              {isOpen ? 
                <ChevronDown className="h-5 w-5 text-purple-600" /> : 
                <ChevronRight className="h-5 w-5 text-purple-600" />
              }
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Section 3.1: Définition et appel de fonctions */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                3.1 Définition et appel de fonctions
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
                  <div className="text-green-400"># Fonction simple</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">saluer</span>():</div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">"Bonjour!"</span>)</div>
                  <div></div>
                  <div className="text-green-400"># Appel de la fonction</div>
                  <div><span className="text-cyan-300">saluer</span>()  <span className="text-gray-400"># Affiche: Bonjour!</span></div>
                  <div></div>
                  <div className="text-green-400"># Fonction avec paramètres</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">saluer_personne</span>(nom, age=<span className="text-blue-300">25</span>):</div>
                  <div>    <span className="text-green-300">"""Salue une personne avec son nom et âge"""</span></div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"Bonjour {'{'}nom{'}'}, vous avez {'{'}age{'}'} ans!"</span>)</div>
                  <div></div>
                  <div className="text-green-400"># Différents appels</div>
                  <div><span className="text-cyan-300">saluer_personne</span>(<span className="text-green-300">"Alice"</span>)           <span className="text-gray-400"># Utilise age=25 par défaut</span></div>
                  <div><span className="text-cyan-300">saluer_personne</span>(<span className="text-green-300">"Bob"</span>, <span className="text-blue-300">30</span>)        <span className="text-gray-400"># age=30</span></div>
                  <div><span className="text-cyan-300">saluer_personne</span>(age=<span className="text-blue-300">35</span>, nom=<span className="text-green-300">"Charlie"</span>)  <span className="text-gray-400"># Arguments nommés</span></div>
                  <div></div>
                  <div className="text-green-400"># Fonction avec valeur de retour</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">calculer_carre</span>(nombre):</div>
                  <div>    <span className="text-green-300">"""Calcule le carré d'un nombre"""</span></div>
                  <div>    <span className="text-red-300">return</span> nombre ** <span className="text-blue-300">2</span></div>
                  <div></div>
                  <div><span className="text-yellow-300">resultat</span> = <span className="text-cyan-300">calculer_carre</span>(<span className="text-blue-300">5</span>)</div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-green-300">f"5² = {'{'}resultat{'}'}"</span>)  <span className="text-gray-400"># 5² = 25</span></div>
                </div>
                
                <div className="bg-white p-3 rounded border border-purple-300">
                  <h6 className="font-medium text-purple-700 mb-2">💡 Bonnes pratiques</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Utilisez des noms de fonctions descriptifs (verbes d'action)</li>
                    <li>• Ajoutez des docstrings pour documenter vos fonctions</li>
                    <li>• Une fonction doit avoir une responsabilité unique</li>
                    <li>• Préférez return aux print dans les fonctions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3.2: Paramètres avancés */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                3.2 Paramètres avancés
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
                  <div className="text-green-400"># *args - arguments positionnels variables</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">additionner</span>(*nombres):</div>
                  <div>    <span className="text-green-300">"""Additionne tous les nombres passés en paramètre"""</span></div>
                  <div>    <span className="text-yellow-300">total</span> = <span className="text-blue-300">0</span></div>
                  <div>    <span className="text-red-300">for</span> nombre <span className="text-red-300">in</span> nombres:</div>
                  <div>        total += nombre</div>
                  <div>    <span className="text-red-300">return</span> total</div>
                  <div></div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-cyan-300">additionner</span>(<span className="text-blue-300">1</span>, <span className="text-blue-300">2</span>, <span className="text-blue-300">3</span>))        <span className="text-gray-400"># 6</span></div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-cyan-300">additionner</span>(<span className="text-blue-300">10</span>, <span className="text-blue-300">20</span>, <span className="text-blue-300">30</span>, <span className="text-blue-300">40</span>)) <span className="text-gray-400"># 100</span></div>
                  <div></div>
                  <div className="text-green-400"># **kwargs - arguments nommés variables</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">creer_profil</span>(**infos):</div>
                  <div>    <span className="text-green-300">"""Crée un profil utilisateur avec des informations variables"""</span></div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">"Profil utilisateur:"</span>)</div>
                  <div>    <span className="text-red-300">for</span> cle, valeur <span className="text-red-300">in</span> infos.<span className="text-cyan-300">items</span>():</div>
                  <div>        <span className="text-cyan-300">print</span>(<span className="text-green-300">f"  {'{'}cle{'}'}: {'{'}valeur{'}'}"</span>)</div>
                  <div></div>
                  <div><span className="text-cyan-300">creer_profil</span>(nom=<span className="text-green-300">"Alice"</span>, age=<span className="text-blue-300">30</span>, ville=<span className="text-green-300">"Paris"</span>)</div>
                  <div></div>
                  <div className="text-green-400"># Combinaison de tous les types de paramètres</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">fonction_complete</span>(obligatoire, defaut=<span className="text-green-300">"valeur"</span>, *args, **kwargs):</div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"Obligatoire: {'{'}obligatoire{'}'}"</span>)</div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"Défaut: {'{'}defaut{'}'}"</span>)</div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"Args: {'{'}args{'}'}"</span>)</div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"Kwargs: {'{'}kwargs{'}'}"</span>)</div>
                  <div></div>
                  <div><span className="text-cyan-300">fonction_complete</span>(<span className="text-green-300">"test"</span>, <span className="text-green-300">"nouveau"</span>, <span className="text-blue-300">1</span>, <span className="text-blue-300">2</span>, <span className="text-blue-300">3</span>, extra=<span className="text-green-300">"info"</span>)</div>
                </div>
              </div>
            </div>

            {/* Section 3.3: Valeurs de retour */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                3.3 Valeurs de retour
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
                  <div className="text-green-400"># Retour simple</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">doubler</span>(x):</div>
                  <div>    <span className="text-red-300">return</span> x * <span className="text-blue-300">2</span></div>
                  <div></div>
                  <div className="text-green-400"># Retours multiples (tuple)</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">divmod_custom</span>(a, b):</div>
                  <div>    <span className="text-green-300">"""Retourne le quotient et le reste d'une division"""</span></div>
                  <div>    quotient = a // b</div>
                  <div>    reste = a % b</div>
                  <div>    <span className="text-red-300">return</span> quotient, reste</div>
                  <div></div>
                  <div><span className="text-yellow-300">q</span>, <span className="text-yellow-300">r</span> = <span className="text-cyan-300">divmod_custom</span>(<span className="text-blue-300">17</span>, <span className="text-blue-300">5</span>)</div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-green-300">f"17 ÷ 5 = {'{'}q{'}'} reste {'{'}r{'}'}"</span>)  <span className="text-gray-400"># 17 ÷ 5 = 3 reste 2</span></div>
                  <div></div>
                  <div className="text-green-400"># Retour conditionnel</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">valeur_absolue</span>(x):</div>
                  <div>    <span className="text-red-300">if</span> x {'>='} <span className="text-blue-300">0</span>:</div>
                  <div>        <span className="text-red-300">return</span> x</div>
                  <div>    <span className="text-red-300">else</span>:</div>
                  <div>        <span className="text-red-300">return</span> -x</div>
                  <div></div>
                  <div className="text-green-400"># Fonction sans return explicite (retourne None)</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">afficher_info</span>(message):</div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"INFO: {'{'}message{'}'}"</span>)</div>
                  <div>    <span className="text-gray-400"># return None implicite</span></div>
                  <div></div>
                  <div><span className="text-yellow-300">resultat</span> = <span className="text-cyan-300">afficher_info</span>(<span className="text-green-300">"Test"</span>)</div>
                  <div><span className="text-cyan-300">print</span>(resultat)  <span className="text-gray-400"># None</span></div>
                </div>
              </div>
            </div>

            {/* Section 3.4: Portée des variables */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                3.4 Portée des variables (scope)
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
                  <div className="text-green-400"># Variables globales et locales</div>
                  <div><span className="text-yellow-300">compteur_global</span> = <span className="text-blue-300">0</span>  <span className="text-gray-400"># Variable globale</span></div>
                  <div></div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">incrementer</span>():</div>
                  <div>    <span className="text-red-300">global</span> compteur_global</div>
                  <div>    compteur_global += <span className="text-blue-300">1</span></div>
                  <div>    <span className="text-yellow-300">variable_locale</span> = <span className="text-green-300">"Je suis locale"</span></div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"Local: {'{'}variable_locale{'}'}"</span>)</div>
                  <div></div>
                  <div><span className="text-cyan-300">incrementer</span>()</div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-green-300">f"Global: {'{'}compteur_global{'}'}"</span>)  <span className="text-gray-400"># 1</span></div>
                  <div></div>
                  <div className="text-green-400"># Fonctions imbriquées et nonlocal</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">fonction_externe</span>():</div>
                  <div>    <span className="text-yellow-300">x</span> = <span className="text-blue-300">10</span></div>
                  <div>    </div>
                  <div>    <span className="text-red-300">def</span> <span className="text-cyan-300">fonction_interne</span>():</div>
                  <div>        <span className="text-red-300">nonlocal</span> x</div>
                  <div>        x += <span className="text-blue-300">5</span></div>
                  <div>        <span className="text-cyan-300">print</span>(<span className="text-green-300">f"x dans fonction interne: {'{'}x{'}'}"</span>)</div>
                  <div>    </div>
                  <div>    <span className="text-cyan-300">fonction_interne</span>()</div>
                  <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"x dans fonction externe: {'{'}x{'}'}"</span>)</div>
                  <div></div>
                  <div><span className="text-cyan-300">fonction_externe</span>()</div>
                </div>
              </div>
            </div>

            {/* Section 3.5: Fonctions lambda */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                3.5 Fonctions lambda (anonymes)
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
                  <div className="text-green-400"># Fonction lambda simple</div>
                  <div><span className="text-yellow-300">carre</span> = <span className="text-red-300">lambda</span> x: x ** <span className="text-blue-300">2</span></div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-cyan-300">carre</span>(<span className="text-blue-300">5</span>))  <span className="text-gray-400"># 25</span></div>
                  <div></div>
                  <div className="text-green-400"># Lambda avec plusieurs paramètres</div>
                  <div><span className="text-yellow-300">additionner</span> = <span className="text-red-300">lambda</span> x, y: x + y</div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-cyan-300">additionner</span>(<span className="text-blue-300">3</span>, <span className="text-blue-300">7</span>))  <span className="text-gray-400"># 10</span></div>
                  <div></div>
                  <div className="text-green-400"># Utilisation avec map()</div>
                  <div><span className="text-yellow-300">nombres</span> = [<span className="text-blue-300">1</span>, <span className="text-blue-300">2</span>, <span className="text-blue-300">3</span>, <span className="text-blue-300">4</span>, <span className="text-blue-300">5</span>]</div>
                  <div><span className="text-yellow-300">carres</span> = <span className="text-cyan-300">list</span>(<span className="text-cyan-300">map</span>(<span className="text-red-300">lambda</span> x: x**<span className="text-blue-300">2</span>, nombres))</div>
                  <div><span className="text-cyan-300">print</span>(carres)  <span className="text-gray-400"># [1, 4, 9, 16, 25]</span></div>
                  <div></div>
                  <div className="text-green-400"># Utilisation avec filter()</div>
                  <div><span className="text-yellow-300">pairs</span> = <span className="text-cyan-300">list</span>(<span className="text-cyan-300">filter</span>(<span className="text-red-300">lambda</span> x: x % <span className="text-blue-300">2</span> == <span className="text-blue-300">0</span>, nombres))</div>
                  <div><span className="text-cyan-300">print</span>(pairs)  <span className="text-gray-400"># [2, 4]</span></div>
                  <div></div>
                  <div className="text-green-400"># Utilisation avec sorted()</div>
                  <div><span className="text-yellow-300">etudiants</span> = [</div>
                  <div>    {'{'}<span className="text-green-300">"nom"</span>: <span className="text-green-300">"Alice"</span>, <span className="text-green-300">"note"</span>: <span className="text-blue-300">85</span>{'}'},</div>
                  <div>    {'{'}<span className="text-green-300">"nom"</span>: <span className="text-green-300">"Bob"</span>, <span className="text-green-300">"note"</span>: <span className="text-blue-300">92</span>{'}'},</div>
                  <div>    {'{'}<span className="text-green-300">"nom"</span>: <span className="text-green-300">"Charlie"</span>, <span className="text-green-300">"note"</span>: <span className="text-blue-300">78</span>{'}'}</div>
                  <div>]</div>
                  <div></div>
                  <div><span className="text-yellow-300">tries_par_note</span> = <span className="text-cyan-300">sorted</span>(etudiants, key=<span className="text-red-300">lambda</span> e: e[<span className="text-green-300">"note"</span>], reverse=<span className="text-red-300">True</span>)</div>
                  <div><span className="text-cyan-300">print</span>(tries_par_note[<span className="text-blue-300">0</span>][<span className="text-green-300">"nom"</span>])  <span className="text-gray-400"># Bob</span></div>
                </div>
              </div>
            </div>

            {/* Section 3.6: Décorateurs */}
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                3.6 Introduction aux décorateurs
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
                  <div className="text-green-400"># Décorateur simple pour mesurer le temps d'exécution</div>
                  <div><span className="text-red-300">import</span> time</div>
                  <div><span className="text-red-300">from</span> functools <span className="text-red-300">import</span> wraps</div>
                  <div></div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">mesurer_temps</span>(func):</div>
                  <div>    <span className="text-green-300">"""Décorateur qui mesure le temps d'exécution d'une fonction"""</span></div>
                  <div>    <span className="text-yellow-300">@wraps</span>(func)</div>
                  <div>    <span className="text-red-300">def</span> <span className="text-cyan-300">wrapper</span>(*args, **kwargs):</div>
                  <div>        debut = time.<span className="text-cyan-300">time</span>()</div>
                  <div>        resultat = <span className="text-cyan-300">func</span>(*args, **kwargs)</div>
                  <div>        fin = time.<span className="text-cyan-300">time</span>()</div>
                  <div>        <span className="text-cyan-300">print</span>(<span className="text-green-300">f"{'{'}func.__name__{'}'} a pris {'{'}fin - debut:.4f{'}'} secondes"</span>)</div>
                  <div>        <span className="text-red-300">return</span> resultat</div>
                  <div>    <span className="text-red-300">return</span> wrapper</div>
                  <div></div>
                  <div className="text-green-400"># Utilisation du décorateur</div>
                  <div><span className="text-yellow-300">@mesurer_temps</span></div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">calcul_lent</span>():</div>
                  <div>    <span className="text-green-300">"""Simule un calcul qui prend du temps"""</span></div>
                  <div>    total = <span className="text-blue-300">0</span></div>
                  <div>    <span className="text-red-300">for</span> i <span className="text-red-300">in</span> <span className="text-cyan-300">range</span>(<span className="text-blue-300">1000000</span>):</div>
                  <div>        total += i</div>
                  <div>    <span className="text-red-300">return</span> total</div>
                  <div></div>
                  <div><span className="text-yellow-300">resultat</span> = <span className="text-cyan-300">calcul_lent</span>()  <span className="text-gray-400"># Affiche le temps d'exécution</span></div>
                </div>
              </div>
            </div>

            {/* Section 3.7: Modules et packages */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                3.7 Modules et packages
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
                  <div className="text-green-400"># Import de modules standards</div>
                  <div><span className="text-red-300">import</span> math</div>
                  <div><span className="text-red-300">import</span> random</div>
                  <div><span className="text-red-300">from</span> datetime <span className="text-red-300">import</span> datetime, timedelta</div>
                  <div></div>
                  <div><span className="text-cyan-300">print</span>(math.<span className="text-cyan-300">pi</span>)  <span className="text-gray-400"># 3.141592653589793</span></div>
                  <div><span className="text-cyan-300">print</span>(math.<span className="text-cyan-300">sqrt</span>(<span className="text-blue-300">16</span>))  <span className="text-gray-400"># 4.0</span></div>
                  <div></div>
                  <div><span className="text-yellow-300">nombre_aleatoire</span> = random.<span className="text-cyan-300">randint</span>(<span className="text-blue-300">1</span>, <span className="text-blue-300">100</span>)</div>
                  <div><span className="text-yellow-300">maintenant</span> = datetime.<span className="text-cyan-300">now</span>()</div>
                  <div></div>
                  <div className="text-green-400"># Créer son propre module (fichier calculatrice.py)</div>
                  <div className="text-gray-400"># calculatrice.py</div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">additionner</span>(a, b):</div>
                  <div>    <span className="text-red-300">return</span> a + b</div>
                  <div></div>
                  <div><span className="text-red-300">def</span> <span className="text-cyan-300">multiplier</span>(a, b):</div>
                  <div>    <span className="text-red-300">return</span> a * b</div>
                  <div></div>
                  <div><span className="text-yellow-300">PI</span> = <span className="text-blue-300">3.14159</span></div>
                  <div></div>
                  <div className="text-green-400"># Utilisation du module personnalisé</div>
                  <div className="text-gray-400"># main.py</div>
                  <div><span className="text-red-300">import</span> calculatrice</div>
                  <div><span className="text-red-300">from</span> calculatrice <span className="text-red-300">import</span> additionner, PI</div>
                  <div></div>
                  <div><span className="text-yellow-300">resultat1</span> = calculatrice.<span className="text-cyan-300">multiplier</span>(<span className="text-blue-300">5</span>, <span className="text-blue-300">3</span>)</div>
                  <div><span className="text-yellow-300">resultat2</span> = <span className="text-cyan-300">additionner</span>(<span className="text-blue-300">10</span>, <span className="text-blue-300">20</span>)</div>
                  <div><span className="text-cyan-300">print</span>(<span className="text-green-300">f"π ≈ {'{'}PI{'}'}"</span>)</div>
                </div>
                
                <div className="bg-white p-3 rounded border border-yellow-300">
                  <h6 className="font-medium text-yellow-700 mb-2">📦 Organisation des modules</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Module:</strong> Un fichier .py contenant du code Python</li>
                    <li>• <strong>Package:</strong> Un dossier contenant plusieurs modules</li>
                    <li>• <strong>__init__.py:</strong> Fichier qui fait d'un dossier un package</li>
                    <li>• <strong>__main__.py:</strong> Point d'entrée d'un package exécutable</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exercices pratiques */}
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <Play className="h-4 w-4" />
                🎯 Exercices pratiques
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-yellow-700 mb-2">Exercice 1: Calculatrice modulaire</h5>
                  <p className="text-gray-700 mb-3 text-sm">
                    Créez une calculatrice avec des fonctions pour chaque opération.
                  </p>
                  <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                    <div><span className="text-red-300">def</span> <span className="text-cyan-300">additionner</span>(a, b):</div>
                    <div>    <span className="text-green-300">"""Additionne deux nombres"""</span></div>
                    <div>    <span className="text-red-300">return</span> a + b</div>
                    <div></div>
                    <div><span className="text-red-300">def</span> <span className="text-cyan-300">diviser</span>(a, b):</div>
                    <div>    <span className="text-green-300">"""Divise deux nombres avec gestion d'erreur"""</span></div>
                    <div>    <span className="text-red-300">if</span> b == <span className="text-blue-300">0</span>:</div>
                    <div>        <span className="text-red-300">raise</span> <span className="text-yellow-300">ValueError</span>(<span className="text-green-300">"Division par zéro impossible"</span>)</div>
                    <div>    <span className="text-red-300">return</span> a / b</div>
                    <div></div>
                    <div><span className="text-red-300">def</span> <span className="text-cyan-300">calculer</span>(operation, a, b):</div>
                    <div>    <span className="text-green-300">"""Effectue une opération selon le type demandé"""</span></div>
                    <div>    operations = {'{'}</div>
                    <div>        <span className="text-green-300">"+"</span>: additionner,</div>
                    <div>        <span className="text-green-300">"-"</span>: <span className="text-red-300">lambda</span> x, y: x - y,</div>
                    <div>        <span className="text-green-300">"*"</span>: <span className="text-red-300">lambda</span> x, y: x * y,</div>
                    <div>        <span className="text-green-300">"/"</span>: diviser</div>
                    <div>    {'}'}</div>
                    <div>    </div>
                    <div>    <span className="text-red-300">if</span> operation <span className="text-red-300">in</span> operations:</div>
                    <div>        <span className="text-red-300">return</span> operations[operation](a, b)</div>
                    <div>    <span className="text-red-300">else</span>:</div>
                    <div>        <span className="text-red-300">raise</span> <span className="text-yellow-300">ValueError</span>(<span className="text-green-300">f"Opération '{'{'}operation{'}'}'  inconnue"</span>)</div>
                    <div></div>
                    <div className="text-green-400"># Tests</div>
                    <div><span className="text-cyan-300">print</span>(<span className="text-cyan-300">calculer</span>(<span className="text-green-300">"+"</span>, <span className="text-blue-300">10</span>, <span className="text-blue-300">5</span>))  <span className="text-gray-400"># 15</span></div>
                    <div><span className="text-cyan-300">print</span>(<span className="text-cyan-300">calculer</span>(<span className="text-green-300">"/"</span>, <span className="text-blue-300">10</span>, <span className="text-blue-300">2</span>))  <span className="text-gray-400"># 5.0</span></div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-yellow-700 mb-2">Exercice 2: Analyseur de texte</h5>
                  <p className="text-gray-700 mb-3 text-sm">
                    Créez des fonctions pour analyser un texte (mots, caractères, etc.).
                  </p>
                  <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                    <div><span className="text-red-300">def</span> <span className="text-cyan-300">compter_mots</span>(texte):</div>
                    <div>    <span className="text-green-300">"""Compte le nombre de mots dans un texte"""</span></div>
                    <div>    <span className="text-red-300">return</span> <span className="text-cyan-300">len</span>(texte.<span className="text-cyan-300">split</span>())</div>
                    <div></div>
                    <div><span className="text-red-300">def</span> <span className="text-cyan-300">analyser_texte</span>(texte):</div>
                    <div>    <span className="text-green-300">"""Analyse complète d'un texte"""</span></div>
                    <div>    <span className="text-red-300">return</span> {'{'}</div>
                    <div>        <span className="text-green-300">"caracteres"</span>: <span className="text-cyan-300">len</span>(texte),</div>
                    <div>        <span className="text-green-300">"mots"</span>: <span className="text-cyan-300">compter_mots</span>(texte),</div>
                    <div>        <span className="text-green-300">"phrases"</span>: texte.<span className="text-cyan-300">count</span>(<span className="text-green-300">"."</span>) + texte.<span className="text-cyan-300">count</span>(<span className="text-green-300">"!"</span>) + texte.<span className="text-cyan-300">count</span>(<span className="text-green-300">"?"</span>),</div>
                    <div>        <span className="text-green-300">"voyelles"</span>: <span className="text-cyan-300">sum</span>(<span className="text-blue-300">1</span> <span className="text-red-300">for</span> c <span className="text-red-300">in</span> texte.<span className="text-cyan-300">lower</span>() <span className="text-red-300">if</span> c <span className="text-red-300">in</span> <span className="text-green-300">"aeiou"</span>)</div>
                    <div>    {'}'}</div>
                    <div></div>
                    <div><span className="text-yellow-300">texte_test</span> = <span className="text-green-300">"Bonjour! Comment allez-vous? J'espère que tout va bien."</span></div>
                    <div><span className="text-yellow-300">stats</span> = <span className="text-cyan-300">analyser_texte</span>(texte_test)</div>
                    <div><span className="text-red-300">for</span> cle, valeur <span className="text-red-300">in</span> stats.<span className="text-cyan-300">items</span>():</div>
                    <div>    <span className="text-cyan-300">print</span>(<span className="text-green-300">f"{'{'}cle.capitalize(){'}'}: {'{'}valeur{'}'}"</span>)</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PythonModule3;