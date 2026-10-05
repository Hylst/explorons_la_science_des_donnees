
import { History } from "lucide-react";
import { SourceNote } from "@/components/ui/source-note";

interface HistoryEventProps {
  period: string;
  event: string;
  color?: string;
}

const HistoryEvent = ({ period, event, color = "text-ds-purple-500" }: HistoryEventProps) => (
  <li className="flex items-start gap-2">
    <span className={`inline-block w-24 font-bold ${color}`}>{period}</span>
    <span>{event}</span>
  </li>
);

const HistorySection = () => {
  return (
    <div id="history" className="scroll-mt-24 border-l-4 border-ds-purple-500 pl-6 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ds-purple-100 p-2 rounded-full">
          <History className="h-6 w-6 text-ds-purple-500" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-ds-purple-500 to-ds-blue-500 bg-clip-text text-transparent">Histoire et évolution</h2>
      </div>
      
      <div className="max-w-none">
        <p className="text-lg">
          L'histoire de la Data Science commence bien avant l'ère numérique. Ses racines remontent aux statistiques classiques du XVIIe siècle, mais c'est l'explosion des données numériques et la puissance de calcul croissante qui ont véritablement permis son essor.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2 text-ds-purple-600">Les débuts historiques</h3>
            <ul className="space-y-2">
              <HistoryEvent period="XVIIe siècle" event="Développement des premiers concepts statistiques" />
              <HistoryEvent period="1800-1900" event="Avancées majeures en probabilités et statistiques" />
              <HistoryEvent period="1962" event="John Tukey publie 'The Future of Data Analysis' et défend l'analyse de données comme discipline à part entière" />
              <HistoryEvent period="1960-1970" event="Émergence de l'analyse de données assistée par ordinateur" />
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2 text-ds-blue-600">Ère moderne</h3>
            <ul className="space-y-2">
              <HistoryEvent period="Années 2000" event="L'essor du web fait exploser les volumes de données et prépare l'ère du Big Data" color="text-ds-blue-500" />
              <HistoryEvent period="2012" event="AlexNet (Krizhevsky, Sutskever et Hinton) remporte le concours ImageNet : l'apprentissage profond s'impose en vision par ordinateur" color="text-ds-blue-500" />
              <HistoryEvent period="2015" event="Des bibliothèques libres (TensorFlow, puis PyTorch) diffusent l'apprentissage profond hors des laboratoires" color="text-ds-blue-500" />
              <HistoryEvent period="Aujourd'hui" event="Intégration profonde dans tous les secteurs d'activité et développement de l'IA générative" color="text-ds-blue-500" />
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <h3 className="text-xl font-semibold mb-3">Moments clés dans l'évolution de la Data Science</h3>
          <div className="relative border-l-2 border-ds-purple-300 pl-6 ml-4 space-y-10 py-4">
            {[
              { year: "1974", event: "Peter Naur utilise le terme 'Data Science' dans son livre", highlight: false },
              { year: "1996", event: "La conférence de l'IFCS à Kobe porte 'Data science, classification, and related methods' dans son titre", highlight: false },
              { year: "2001", event: "William S. Cleveland publie 'Data Science: An Action Plan'", highlight: true },
              { year: "2008", event: "DJ Patil et Jeff Hammerbacher revendiquent la création du titre 'Data Scientist'", highlight: false },
              { year: "2011", event: "Le McKinsey Global Institute publie 'Big data: The next frontier for innovation, competition, and productivity', qui évoque une pénurie de profils analytiques", highlight: true },
              { year: "2015", event: "Google publie TensorFlow en open source (novembre 2015), ce qui contribue à populariser le Deep Learning auprès des développeurs", highlight: false },
              { year: "2020", event: "OpenAI présente GPT-3 (Brown et al., 2020), un modèle de langage de 175 milliards de paramètres", highlight: true }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className={`absolute -left-10 w-4 h-4 rounded-full ${item.highlight ? 'bg-ds-purple-500' : 'bg-ds-purple-200'}`}></div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">{item.year}</span>
                  <p className="text-gray-700">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
          <SourceNote
            className="mt-2"
            consulted="5 octobre 2026"
            sources={[{ label: "Brown et al., « Language Models are Few-Shot Learners », arXiv 2005.14165 (GPT-3, 175 milliards de paramètres)", href: "https://arxiv.org/abs/2005.14165" }]}
          />
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
