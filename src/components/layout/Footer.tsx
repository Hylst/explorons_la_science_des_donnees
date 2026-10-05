
import { Link } from "react-router-dom";
import { asset } from "@/lib/asset";
import { AUTHOR_CREDIT, LICENSE_FILE, LICENSE_SPDX, PLATFORM_URL, SITE_NAME, SOURCE_URL } from "@/config/site";

const Footer = () => {
  return (
    <footer className="bg-muted py-12 mt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{SITE_NAME}</h3>
            <p className="text-muted-foreground">
              Apprendre la data science en français : cours, quiz, glossaire et éditeur de code exécuté dans votre navigateur.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contenu</h3>
            <ul className="space-y-2">
              <li><Link to="/introduction" className="text-muted-foreground hover:text-primary">Introduction</Link></li>
              <li><Link to="/fundamentals" className="text-muted-foreground hover:text-primary">Fondamentaux</Link></li>
              <li><Link to="/machine-learning" className="text-muted-foreground hover:text-primary">Machine Learning</Link></li>
              <li><Link to="/tools" className="text-muted-foreground hover:text-primary">Outils</Link></li>
              <li><Link to="/projects" className="text-muted-foreground hover:text-primary">Projets</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Communauté</h3>
            <ul className="space-y-2">
              <li><Link to="/community#forums" className="text-muted-foreground hover:text-primary">Forums</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link to="/community#events" className="text-muted-foreground hover:text-primary">Événements</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">À propos</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Politique de confidentialité</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Conditions d'utilisation</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {SITE_NAME}. Réalisé par {AUTHOR_CREDIT}. Licence{" "}
              <a href={asset(LICENSE_FILE)} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                {LICENSE_SPDX}
              </a>
              .
              {" "}
              {SOURCE_URL ? (
                <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                  Code source
                </a>
              ) : (
                <Link to="/contact" className="hover:text-primary hover:underline">
                  Code source sur demande
                </Link>
              )}
              .
            </p>
            <p>
              Un site de la plateforme{" "}
              <a href={PLATFORM_URL} className="hover:text-primary hover:underline">
                hylst.fr
              </a>
              .
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Projet personnel et éducatif - Contenu libre d'accès</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
