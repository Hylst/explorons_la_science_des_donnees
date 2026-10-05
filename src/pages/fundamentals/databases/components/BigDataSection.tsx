
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Cloud, Zap } from "lucide-react";
import { asset } from "@/lib/asset";

const fiveVs = [
  { name: "Volume", text: "Une quantité massive de données, des téraoctets aux pétaoctets, qui dépasse la capacité d'un seul serveur." },
  { name: "Vélocité", text: "La vitesse à laquelle les données sont produites et doivent être traitées, parfois en temps réel (capteurs, flux, transactions)." },
  { name: "Variété", text: "Des formats hétérogènes : tables structurées, textes, images, journaux applicatifs, documents JSON." },
  { name: "Véracité", text: "La fiabilité des données : bruit, doublons, valeurs manquantes et biais réduisent la confiance qu'on peut leur accorder." },
  { name: "Valeur", text: "La capacité à en tirer des décisions utiles. Sans valeur exploitable, les quatre autres V ne sont qu'un coût de stockage." }
];

const BigDataSection = () => {
  return (
    <section id="big-data" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-orange-600" />
        <h2 className="text-3xl font-bold">Big Data et Écosystème Moderne</h2>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-xl font-semibold">Les 5 V du Big Data</h3>
          <p className="mb-4 text-gray-700">
            On parle de Big Data quand les données sont trop volumineuses, trop rapides ou trop variées pour être gérées avec une base de données classique sur un seul serveur. Cinq dimensions, les « 5 V », résument ce défi :
          </p>
          <dl className="space-y-3">
            {fiveVs.map((v) => (
              <div key={v.name}>
                <dt className="font-semibold">{v.name}</dt>
                <dd className="text-sm text-gray-700">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure>
          <img
            src={asset("svg/big_data_5v_diagram.svg")}
            alt="Schéma des 5 V du Big Data : Volume, Vélocité, Variété, Véracité et Valeur autour du Big Data"
            width={600}
            height={400}
            loading="lazy"
            className="h-auto w-full rounded-lg border border-gray-200"
          />
          <figcaption className="mt-2 text-center text-sm text-gray-500">Les cinq dimensions qui caractérisent le Big Data</figcaption>
        </figure>
      </div>

      <h3 className="text-xl font-semibold">L'écosystème d'outils</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Data Lakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">Stockage de données brutes multi-formats</p>
            <div className="space-y-2">
              <Badge variant="secondary">Amazon S3</Badge>
              <Badge variant="secondary">Azure Data Lake</Badge>
              <Badge variant="secondary">Google Cloud Storage</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">Traitement distribué temps réel</p>
            <div className="space-y-2">
              <Badge variant="secondary">Apache Spark</Badge>
              <Badge variant="secondary">Kafka</Badge>
              <Badge variant="secondary">Hadoop</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">Analyse et requêtes sur pétaoctets</p>
            <div className="space-y-2">
              <Badge variant="secondary">Snowflake</Badge>
              <Badge variant="secondary">BigQuery</Badge>
              <Badge variant="secondary">Redshift</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BigDataSection;
